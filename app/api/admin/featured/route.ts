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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !(await checkAdminRole(user.id, supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { listing_id, days } = body

    if (!listing_id || !days) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

    const { data: listing, error } = await supabase
      .from('listings')
      .update({
        is_featured: true,
        featured_expires_at: expiresAt,
        featured_weight: 1000,
      })
      .eq('id', listing_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Featured API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
