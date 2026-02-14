import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdminRole(userId: string, supabase: any) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role === 'admin'
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !(await checkAdminRole(user.id, supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Total platform stats
    const { count: totalListings } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: totalInquiries } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })

    const { count: totalViews } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'listing_view')

    // Analytics by type
    const { data: eventBreakdown } = await supabase
      .from('analytics')
      .select('event_type')

    const breakdown: Record<string, number> = {}
    eventBreakdown?.forEach((event: any) => {
      breakdown[event.event_type] = (breakdown[event.event_type] || 0) + 1
    })

    // Top districts
    const { data: topDistricts } = await supabase
      .from('listings')
      .select('district_id, districts(name)')
      .eq('status', 'approved')

    const districtCounts: Record<string, any> = {}
    topDistricts?.forEach((listing: any) => {
      const name = listing.districts?.name
      if (name) {
        districtCounts[name] = (districtCounts[name] || 0) + 1
      }
    })

    const topDistrictsList = Object.entries(districtCounts)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    return NextResponse.json({
      stats: {
        totalListings,
        totalUsers,
        totalInquiries,
        totalViews,
      },
      eventBreakdown: breakdown,
      topDistricts: topDistrictsList,
    })
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
