import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const BOOST_PRICES: Record<number, number> = {
  7: 500,
  14: 800,
  30: 1200,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { listing_id, duration_days } = body

    if (!listing_id || !duration_days) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify listing belongs to user
    const { data: listing } = await supabase
      .from('listings')
      .select('user_id, is_boosted, boost_expires_at')
      .eq('id', listing_id)
      .single()

    if (!listing || listing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get boost price
    const price = BOOST_PRICES[duration_days]
    if (!price) {
      return NextResponse.json(
        { error: 'Invalid duration' },
        { status: 400 }
      )
    }

    // Create boost record
    const now = new Date()
    const expiresAt = new Date(now.getTime() + duration_days * 24 * 60 * 60 * 1000)

    const { data: boost, error: boostError } = await supabase
      .from('boosts')
      .insert({
        listing_id,
        user_id: user.id,
        duration_days,
        price,
        starts_at: now,
        expires_at: expiresAt,
      })
      .select()
      .single()

    if (boostError) {
      return NextResponse.json({ error: boostError.message }, { status: 500 })
    }

    // Update listing
    const { error: updateError } = await supabase
      .from('listings')
      .update({
        is_boosted: true,
        boost_expires_at: expiresAt,
        boost_weight: 100,
      })
      .eq('id', listing_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      boost,
      amount: price,
      currency: 'LKR',
    })
  } catch (error) {
    console.error('POST boost error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
