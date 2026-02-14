import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user listings
    const { data: listings } = await supabase
      .from('listings')
      .select('id')
      .eq('user_id', user.id)

    const listingIds = listings?.map((l: any) => l.id) || []

    if (listingIds.length === 0) {
      return NextResponse.json({
        totalViews: 0,
        totalInquiries: 0,
        totalFavorites: 0,
        listingBreakdown: [],
      })
    }

    // Views analytics
    const { data: viewAnalytics } = await supabase
      .from('analytics')
      .select('listing_id')
      .eq('event_type', 'listing_view')
      .in('listing_id', listingIds)

    // Inquiries
    const { data: inquiries } = await supabase
      .from('inquiries')
      .select('listing_id')
      .in('listing_id', listingIds)

    // Favorites
    const { data: favoriteAnalytics } = await supabase
      .from('analytics')
      .select('listing_id')
      .eq('event_type', 'favorite_added')
      .in('listing_id', listingIds)

    // Breakdown by listing
    const breakdown = listingIds.map((id: string) => ({
      listing_id: id,
      views: viewAnalytics?.filter((v: any) => v.listing_id === id).length || 0,
      inquiries: inquiries?.filter((i: any) => i.listing_id === id).length || 0,
      favorites: favoriteAnalytics?.filter((f: any) => f.listing_id === id).length || 0,
    }))

    return NextResponse.json({
      totalViews: viewAnalytics?.length || 0,
      totalInquiries: inquiries?.length || 0,
      totalFavorites: favoriteAnalytics?.length || 0,
      listingBreakdown: breakdown,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
