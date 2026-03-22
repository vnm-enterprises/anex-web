"use client";

import useSWR from "swr";

import type { District, Listing } from "@/lib/types";

export interface DistrictWithCount extends District {
  image: string;
  count?: number;
}

interface MarketplaceStats {
  listingsCount: number;
  tenantsCount: number;
}

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

interface HomePayload {
  heroDistricts: District[];
  prominentDistricts: DistrictWithCount[];
  featuredListings: Listing[];
  handpickedListings: Listing[];
  marketplaceStats: MarketplaceStats;
}

const fetchHomePayload = async (): Promise<HomePayload> => {
  const response = await fetch("/api/public/home", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load homepage payload");
  }

  return response.json();
};

/**
 * Centralized data hook for homepage sections.
 */
export function useHomeHook() {
  const homePayloadQuery = useSWR("home:payload", fetchHomePayload, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    refreshInterval: 60000,
    keepPreviousData: true,
  });

  const payload = homePayloadQuery.data;

  return {
    heroDistricts: payload?.heroDistricts ?? [],
    isHeroDistrictsLoading: homePayloadQuery.isLoading,
    prominentDistricts: payload?.prominentDistricts ?? DISTRICT_PLACEHOLDERS,
    isProminentDistrictsLoading: homePayloadQuery.isLoading,
    featuredListings: payload?.featuredListings ?? [],
    isFeaturedListingsLoading: homePayloadQuery.isLoading,
    handpickedListings: payload?.handpickedListings ?? [],
    isHandpickedListingsLoading: homePayloadQuery.isLoading,
    marketplaceStats: payload?.marketplaceStats,
    isMarketplaceStatsLoading: homePayloadQuery.isLoading,
  };
}
