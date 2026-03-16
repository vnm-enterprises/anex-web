"use client";

import useSWR from "swr";

import { createClient } from "@/lib/supabase/client";

interface MarketplaceStats {
  listingsCount: number;
  tenantsCount: number;
}

/**
 * Shows 100+ when count is unavailable or <= 100, otherwise shows the real value.
 */
export function formatAtLeastHundred(count?: number | null): string {
  if (!count || count <= 100) {
    return "100+";
  }

  return count.toLocaleString("en-US");
}

const fetchMarketplaceStats = async (): Promise<MarketplaceStats> => {
  const supabase = createClient();

  const [listingsResult, tenantsResult] = await Promise.all([
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "user"),
  ]);

  if (listingsResult.error) throw listingsResult.error;
  if (tenantsResult.error) throw tenantsResult.error;

  return {
    listingsCount: listingsResult.count ?? 0,
    tenantsCount: tenantsResult.count ?? 0,
  };
};

/**
 * Shared stats hook for hero/auth/newsletter counters.
 */
export function useMarketplaceStats() {
  return useSWR("marketplace-stats", fetchMarketplaceStats, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });
}
