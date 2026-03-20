"use client";

import useSWR from "swr";

import { createClient } from "@/lib/supabase/client";
import type { District, Listing } from "@/lib/types";

export interface DistrictWithCount extends District {
  image: string;
  count?: number;
}

interface MarketplaceStats {
  listingsCount: number;
  tenantsCount: number;
}

const LISTING_SELECT =
  "*, districts(name), cities(name), listing_images(url), listing_amenities(amenities(name))";

const PROMINENT_DISTRICTS = [
  { slug: "colombo", name: "Colombo" },
  { slug: "kandy", name: "Kandy" },
  { slug: "galle", name: "Galle" },
  { slug: "gampaha", name: "Gampaha" },
  { slug: "kalutara", name: "Kalutara" },
  { slug: "kurunegala", name: "Kurunegala" },
];

const DISTRICT_IMAGES: Record<string, string> = {
  colombo: "/media/images/colombo.png",
  kandy: "/media/images/kandy.png",
  galle: "/media/images/galle.png",
  gampaha: "/media/images/gampaha.png",
  kalutara: "/media/images/kaluthara.png",
  kurunegala: "/media/images/kurunegala.png",
};

const DISTRICT_PLACEHOLDERS: DistrictWithCount[] = PROMINENT_DISTRICTS.map(
  (district) => ({
    id: district.slug,
    name: district.name,
    slug: district.slug,
    image: DISTRICT_IMAGES[district.slug],
    count: undefined,
  }),
);

const fetchHeroDistricts = async (): Promise<District[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("districts").select("*").order("name");
  if (error) throw error;
  return data ?? [];
};

const fetchProminentDistricts = async (): Promise<DistrictWithCount[]> => {
  const supabase = createClient();
  const { data: districtsData, error } = await supabase
    .from("districts")
    .select("*")
    .order("name");

  if (error) throw error;
  if (!districtsData) return DISTRICT_PLACEHOLDERS;

  const prominentSlugs = PROMINENT_DISTRICTS.map((district) => district.slug);

  const enriched = await Promise.all(
    districtsData
      .map((district) => ({ ...district, slug: district.slug.toLowerCase() }))
      .filter((district) => prominentSlugs.includes(district.slug))
      .map(async (district) => {
        const { count } = await supabase
          .from("listings")
          .select("id", { count: "exact", head: true })
          .eq("district_id", district.id)
          .eq("status", "approved");

        return {
          ...district,
          count: count ?? 0,
          image:
            DISTRICT_IMAGES[district.slug] ||
            "https://images.unsplash.com/photo-1580000000000?auto=format&fit=crop&q=80&w=800",
        } as DistrictWithCount;
      }),
  );

  return enriched;
};

const fetchFeaturedListings = async (): Promise<Listing[]> => {
  const supabase = createClient();
  let { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "approved")
    .eq("is_boosted", true)
    .order("boost_weight", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;

  if (!data || data.length === 0) {
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(6);

    if (fallbackError) throw fallbackError;
    data = fallbackData;
  }

  return (data ?? []) as Listing[];
};

const fetchHandpickedListings = async (): Promise<Listing[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "approved")
    .eq("is_featured", false)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) throw error;
  return (data ?? []) as Listing[];
};

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
 * Centralized data hook for homepage sections.
 */
export function useHomeHook() {
  const heroDistrictsQuery = useSWR("home:hero-districts", fetchHeroDistricts, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });

  const prominentDistrictsQuery = useSWR(
    "home:prominent-districts",
    fetchProminentDistricts,
    {
      revalidateOnFocus: false,
      dedupingInterval: 120000,
    },
  );

  const featuredListingsQuery = useSWR("home:featured-listings", fetchFeaturedListings, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });

  const handpickedListingsQuery = useSWR("home:handpicked-listings", fetchHandpickedListings, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });

  const marketplaceStatsQuery = useSWR("home:marketplace-stats", fetchMarketplaceStats, {
    revalidateOnFocus: false,
    dedupingInterval: 120000,
  });

  return {
    heroDistricts: heroDistrictsQuery.data ?? [],
    isHeroDistrictsLoading: heroDistrictsQuery.isLoading,
    prominentDistricts: prominentDistrictsQuery.data ?? DISTRICT_PLACEHOLDERS,
    isProminentDistrictsLoading: prominentDistrictsQuery.isLoading,
    featuredListings: featuredListingsQuery.data ?? [],
    isFeaturedListingsLoading: featuredListingsQuery.isLoading,
    handpickedListings: handpickedListingsQuery.data ?? [],
    isHandpickedListingsLoading: handpickedListingsQuery.isLoading,
    marketplaceStats: marketplaceStatsQuery.data,
    isMarketplaceStatsLoading: marketplaceStatsQuery.isLoading,
  };
}
