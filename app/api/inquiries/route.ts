import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      listing_id,
      sender_name,
      sender_phone,
      sender_email,
      message,
    } = body

    // Validate
    if (!listing_id || !sender_name || !sender_phone || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify listing exists and is approved
    const { data: listing } = await supabase
      .from('listings')
      .select('id, status')
      .eq('id', listing_id)
      .single()

    if (!listing || listing.status !== 'approved') {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Create inquiry
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert({
        listing_id,
        sender_name,
        sender_phone,
        sender_email,
        message,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update inquiry count
    await supabase
      .from('listings')
      .update({ inquiries_count: (listing.inquiries_count || 0) + 1 })
      .eq('id', listing_id)

    // Track in analytics
    await supabase.from('analytics').insert({
      event_type: 'inquiry_sent',
      listing_id,
      metadata: { sender_email },
    })

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('POST inquiry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listingId = request.nextUrl.searchParams.get('listing_id')

    let query = supabase
      .from('inquiries')
      .select('*, listings(id, title, user_id)')

    if (listingId) {
      query = query.eq('listing_id', listingId)
    }

    const { data: inquiries, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Filter to only inquiries for user's listings
    const filtered = inquiries.filter(
      (i: any) => i.listings?.user_id === user.id
    )

    return NextResponse.json(filtered)
  } catch (error) {
    console.error('GET inquiries error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
