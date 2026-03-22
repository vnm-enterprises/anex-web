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
    const nowIso = new Date().toISOString()
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
      .lt('expires_at', nowIso)

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
      .select('id, listing_id')
      .lt('expires_at', nowIso)
      .eq('status', 'active')

    if (expiredBoosts && expiredBoosts.length > 0) {
      const affectedListingIds = Array.from(
        new Set(expiredBoosts.map((b: any) => b.listing_id))
      )
      const expiredBoostIds = expiredBoosts.map((b: any) => b.id)

      const { error: boostError } = await supabase
        .from('boosts')
        .update({ status: 'expired' })
        .in('id', expiredBoostIds)

      if (!boostError) {
        // Only reset denormalized listing boost flags if there is no active boost left.
        const { data: remainingActiveBoosts, error: activeBoostsError } = await supabase
          .from('boosts')
          .select('listing_id')
          .in('listing_id', affectedListingIds)
          .eq('status', 'active')
          .gt('expires_at', nowIso)

        if (!activeBoostsError) {
          const listingIdsWithActiveBoosts = new Set(
            (remainingActiveBoosts ?? []).map((b: any) => b.listing_id)
          )

          const listingIdsToReset = affectedListingIds.filter(
            (id: string) => !listingIdsWithActiveBoosts.has(id)
          )

          if (listingIdsToReset.length > 0) {
            await supabase
              .from('listings')
              .update({
                is_boosted: false,
                boost_expires_at: null,
                boost_weight: 0,
                boost_type: null,
              })
              .in('id', listingIdsToReset)

            results.expired_boosts = listingIdsToReset.length
          }
        }
      }
    }

    // Remove expired featured
    const { data: expiredFeatured } = await supabase
      .from('listings')
      .select('id')
      .eq('is_featured', true)
      .lt('featured_expires_at', nowIso)

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
