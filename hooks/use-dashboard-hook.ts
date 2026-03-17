import { createClient } from "@/lib/supabase/server";
import type { Listing, Profile } from "@/lib/types";

interface ReferredUserSummary {
  id: string;
  full_name: string | null;
  created_at: string;
  qualifyingPayments: number;
  totalPaidLkr: number;
  earnedLkr: number;
}

interface AffiliateSnapshot {
  id: string;
  ref_code: string;
  expires_at: string | null;
  total_users_brought_in: number;
  referredUsers: ReferredUserSummary[];
  totalEarningsLkr: number;
  qualifyingPayments: number;
}

export interface DashboardData {
  user: { id: string } | null;
  profile: Profile | null;
  listings: Listing[];
  totalListings: number;
  totalInquiries: number;
  unreadInquiries: number;
  totalViews: number;
  affiliate: AffiliateSnapshot | null;
}

function calculateAffiliateEarnings(
  referredUsers: Array<{ id: string; created_at: string; full_name: string | null }>,
  payments: Array<{ user_id: string; amount: number; created_at: string }>,
) {
  const perUser = new Map<string, ReferredUserSummary>();

  referredUsers.forEach((user) => {
    perUser.set(user.id, {
      id: user.id,
      full_name: user.full_name,
      created_at: user.created_at,
      qualifyingPayments: 0,
      totalPaidLkr: 0,
      earnedLkr: 0,
    });
  });

  const paymentCountByUser = new Map<string, number>();

  payments.forEach((payment) => {
    const user = perUser.get(payment.user_id);
    if (!user) return;

    const referralStart = new Date(user.created_at);
    const expiresAt = new Date(referralStart);
    expiresAt.setMonth(expiresAt.getMonth() + 12);

    const paidAt = new Date(payment.created_at);
    if (paidAt > expiresAt) return;

    const currentCount = (paymentCountByUser.get(payment.user_id) ?? 0) + 1;
    paymentCountByUser.set(payment.user_id, currentCount);

    const commissionRate = currentCount <= 10 ? 0.15 : 0.1;
    const amountLkr = payment.amount / 100;
    const earned = amountLkr * commissionRate;

    user.qualifyingPayments += 1;
    user.totalPaidLkr += amountLkr;
    user.earnedLkr += earned;
  });

  const referredUsersSummary = Array.from(perUser.values());
  const totalEarningsLkr = referredUsersSummary.reduce(
    (sum, user) => sum + user.earnedLkr,
    0,
  );
  const qualifyingPayments = referredUsersSummary.reduce(
    (sum, user) => sum + user.qualifyingPayments,
    0,
  );

  return {
    referredUsersSummary,
    totalEarningsLkr,
    qualifyingPayments,
  };
}

/**
 * Server-side dashboard data hook to keep page components focused on rendering.
 */
export async function useDashboardHook(): Promise<DashboardData> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      listings: [],
      totalListings: 0,
      totalInquiries: 0,
      unreadInquiries: 0,
      totalViews: 0,
      affiliate: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: listings } = await supabase
    .from("listings")
    .select("*, districts(name), cities(name), custom_city, listing_images(url)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const safeListings = (listings ?? []) as Listing[];

  const { count: totalListings } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const listingIds = safeListings.map((listing) => listing.id);

  let totalInquiries = 0;
  let unreadInquiries = 0;

  if (listingIds.length > 0) {
    const { count } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .in("listing_id", listingIds);
    totalInquiries = count ?? 0;

    const { count: unreadCount } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .in("listing_id", listingIds)
      .eq("is_read", false);
    unreadInquiries = unreadCount ?? 0;
  }

  const totalViews = safeListings.reduce(
    (sum, listing) => sum + (listing.views_count ?? 0),
    0,
  );

  const { data: affiliateUser } = await supabase
    .from("affiliate_user")
    .select("id, ref_code, expires_at, total_users_brought_in")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!affiliateUser) {
    return {
      user: { id: user.id },
      profile: profile as Profile | null,
      listings: safeListings,
      totalListings: totalListings ?? 0,
      totalInquiries,
      unreadInquiries,
      totalViews,
      affiliate: null,
    };
  }

  const { data: referredUsers } = await supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("referred_by", affiliateUser.id)
    .order("created_at", { ascending: true });

  const safeReferredUsers =
    (referredUsers as Array<{ id: string; full_name: string | null; created_at: string }>) ?? [];

  const referredUserIds = safeReferredUsers.map((userItem) => userItem.id);

  let referredPayments: Array<{ user_id: string; amount: number; created_at: string }> = [];

  if (referredUserIds.length > 0) {
    const { data } = await supabase
      .from("payments")
      .select("user_id, amount, created_at")
      .in("user_id", referredUserIds)
      .eq("status", "paid")
      .in("payment_type", ["ad_listing", "boost"])
      .order("created_at", { ascending: true });

    referredPayments =
      (data as Array<{ user_id: string; amount: number; created_at: string }>) ?? [];
  }

  const earnings = calculateAffiliateEarnings(safeReferredUsers, referredPayments);

  return {
    user: { id: user.id },
    profile: profile as Profile | null,
    listings: safeListings,
    totalListings: totalListings ?? 0,
    totalInquiries,
    unreadInquiries,
    totalViews,
    affiliate: {
      id: affiliateUser.id,
      ref_code: affiliateUser.ref_code,
      expires_at: affiliateUser.expires_at,
      total_users_brought_in: affiliateUser.total_users_brought_in ?? 0,
      referredUsers: earnings.referredUsersSummary,
      totalEarningsLkr: earnings.totalEarningsLkr,
      qualifyingPayments: earnings.qualifyingPayments,
    },
  };
}
