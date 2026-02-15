import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Scheduled maintenance tasks (cron job)
 * 
 * Deploy as Vercel Cron Job by adding to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/maintenance",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const results: any = {
      expired_listings: 0,
      expired_boosts: 0,
      expired_featured: 0,
    }

    // Expire old listings
    const { data: expiredListings } = await supabase
      .from('listings')
      .select('id')
      .eq('status', 'approved')
      .lt('expires_at', new Date().toISOString())

    if (expiredListings && expiredListings.length > 0) {
      const listingIds = expiredListings.map((l: any) => l.id)
      
      const { error } = await supabase
        .from('listings')
        .update({ status: 'expired' })
        .in('id', listingIds)

      if (!error) {
        results.expired_listings = listingIds.length
      }
    }

    // Remove expired boosts
    const { data: expiredBoosts } = await supabase
      .from('boosts')
      .select('listing_id')
      .lt('expires_at', new Date().toISOString())
      .eq('status', 'active')

    if (expiredBoosts && expiredBoosts.length > 0) {
      const listingIds = Array.from(
        new Set(expiredBoosts.map((b: any) => b.listing_id))
      )

      const { error: boostError } = await supabase
        .from('boosts')
        .update({ status: 'expired' })
        .lt('expires_at', new Date().toISOString())

      if (!boostError) {
        await supabase
          .from('listings')
          .update({
            is_boosted: false,
            boost_expires_at: null,
            boost_weight: 0,
          })
          .in('id', listingIds)

        results.expired_boosts = listingIds.length
      }
    }

    // Remove expired featured
    const { data: expiredFeatured } = await supabase
      .from('listings')
      .select('id')
      .eq('is_featured', true)
      .lt('featured_expires_at', new Date().toISOString())

    if (expiredFeatured && expiredFeatured.length > 0) {
      const listingIds = expiredFeatured.map((l: any) => l.id)
      
      const { error } = await supabase
        .from('listings')
        .update({
          is_featured: false,
          featured_expires_at: null,
          featured_weight: 0,
        })
        .in('id', listingIds)

      if (!error) {
        results.expired_featured = listingIds.length
      }
    }

    // Clean up old analytics (keep last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    
    const { error: analyticsError } = await supabase
      .from('analytics')
      .delete()
      .lt('created_at', ninetyDaysAgo.toISOString())

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    console.error('Cron maintenance error:', error)
    return NextResponse.json(
      {
        error: 'Maintenance failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
