import { createClient } from '@/lib/supabase/server'

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role === 'admin'
}

/**
 * Get user subscription status
 */
export async function getUserSubscription(userId: string) {
  const supabase = await createClient()
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plans(*)')
    .eq('user_id', userId)
    .in('status', ['active', 'grace'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (subscription) {
    return { subscription, plan: subscription.plans }
  }

  // Return free plan
  const { data: freePlan } = await supabase
    .from('plans')
    .select('*')
    .eq('slug', 'free')
    .single()

  return { subscription: null, plan: freePlan }
}

/**
 * Get user's available listing slots
 */
export async function getAvailableListingSlots(userId: string): Promise<number> {
  const supabase = await createClient()
  const { subscription, plan } = await getUserSubscription(userId)

  const listingLimit = plan?.listing_limit || 3

  const { count: currentListings } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', ['pending', 'approved'])

  return Math.max(0, listingLimit - (currentListings || 0))
}

/**
 * Check if user can access featured listings
 */
export async function canAccessFeatured(userId: string): Promise<boolean> {
  const { plan } = await getUserSubscription(userId)
  return plan?.featured_eligible || false
}

/**
 * Get available free boosts for user
 */
export async function getAvailableBoosts(userId: string): Promise<number> {
  const supabase = await createClient()
  const { plan } = await getUserSubscription(userId)

  const freeBoosts = plan?.free_boosts || 0

  const { count: usedBoosts } = await supabase
    .from('boosts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('price', 0)
    .gte('expires_at', new Date().toISOString())

  return Math.max(0, freeBoosts - (usedBoosts || 0))
}

/**
 * Track analytics event
 */
export async function trackAnalyticsEvent(
  eventType: string,
  data: {
    listing_id?: string
    ad_id?: string
    user_id?: string
    metadata?: Record<string, any>
  }
) {
  const supabase = await createClient()
  
  await supabase.from('analytics').insert({
    event_type: eventType,
    ...data,
  })
}

/**
 * Expire old listings
 */
export async function expireOldListings() {
  const supabase = await createClient()

  const { data: expiredListings } = await supabase
    .from('listings')
    .select('id')
    .eq('status', 'approved')
    .lt('expires_at', new Date().toISOString())

  if (!expiredListings || expiredListings.length === 0) {
    return 0
  }

  await supabase
    .from('listings')
    .update({ status: 'expired' })
    .in('id', expiredListings.map(l => l.id))

  return expiredListings.length
}

/**
 * Remove expired boosts
 */
export async function removeExpiredBoosts() {
  const supabase = await createClient()

  const { data: expiredBoosts } = await supabase
    .from('boosts')
    .select('listing_id')
    .lt('expires_at', new Date().toISOString())
    .eq('status', 'active')

  if (!expiredBoosts || expiredBoosts.length === 0) {
    return 0
  }

  const listingIds = expiredBoosts.map(b => b.listing_id)

  // Update boosts status
  await supabase
    .from('boosts')
    .update({ status: 'expired' })
    .in('listing_id', listingIds)

  // Remove boost from listings
  await supabase
    .from('listings')
    .update({
      is_boosted: false,
      boost_expires_at: null,
      boost_weight: 0,
    })
    .in('id', listingIds)

  return expiredBoosts.length
}

/**
 * Remove expired featured flags
 */
export async function removeExpiredFeatured() {
  const supabase = await createClient()

  const { data: expiredFeatured } = await supabase
    .from('listings')
    .select('id')
    .eq('is_featured', true)
    .lt('featured_expires_at', new Date().toISOString())

  if (!expiredFeatured || expiredFeatured.length === 0) {
    return 0
  }

  await supabase
    .from('listings')
    .update({
      is_featured: false,
      featured_expires_at: null,
      featured_weight: 0,
    })
    .in('id', expiredFeatured.map(l => l.id))

  return expiredFeatured.length
}

/**
 * Get district statistics
 */
export async function getDistrictStats() {
  const supabase = await createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('district_id, districts(name)')
    .eq('status', 'approved')

  const stats: Record<string, number> = {}
  listings?.forEach((listing: any) => {
    const name = listing.districts?.name
    if (name) {
      stats[name] = (stats[name] || 0) + 1
    }
  })

  return stats
}
