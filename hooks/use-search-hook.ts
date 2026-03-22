"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { ITEMS_PER_PAGE, SEARCH_PRICE_MAX } from "@/lib/constants";
import type { City, District, Listing } from "@/lib/types";

interface SearchFilters {
  keyword: string;
  district: string;
  city: string;
  propertyType: string;
  furnished: string;
  gender: string;
  priceRange: [number, number];
  sort: string;
  page: number;
}

interface UseSearchHookResult {
  districts: District[];
  cities: City[];
  listings: Listing[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

type MarketplaceSearchRow = {
  listing: Listing;
  total_count: number;
};

const normalizeValue = (value: string) => value.trim().toLowerCase();

const matchBySlugNameOrId = <T extends { id: string; slug: string; name: string }>(
  items: T[],
  candidate: string,
) => {
  if (!candidate) return undefined;
  const normalizedCandidate = normalizeValue(candidate);

  return items.find((item) => {
    const normalizedName = normalizeValue(item.name);
    const normalizedSlug = normalizeValue(item.slug);
    return (
      normalizedCandidate === item.id ||
      normalizedCandidate === normalizedSlug ||
      normalizedCandidate === normalizedName
    );
  });
};

/**
 * Production-ready marketplace search hook.
 *
 * Architecture:
 * 1) Uses one ranked PostgreSQL RPC call for featured-first pagination.
 * 2) Applies filters server-side to keep data transfer small.
 * 3) Handles page overflow safely without breaking UX.
 * 4) Reuses a stable Supabase client instance.
 */
export function useSearchHook(filters: SearchFilters): UseSearchHookResult {
  const supabase = useMemo(() => createClient(), []);
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const normalizedFilters = useMemo(() => {
    const allowedSort = new Set(["featured", "newest", "price_asc", "price_desc", "views"]);
    const minPrice = Number.isFinite(filters.priceRange[0]) ? Math.max(filters.priceRange[0], 0) : 0;
    const maxPriceRaw = Number.isFinite(filters.priceRange[1]) ? Math.max(filters.priceRange[1], 0) : SEARCH_PRICE_MAX;
    const maxPrice = maxPriceRaw >= minPrice ? maxPriceRaw : minPrice;

    return {
      keyword: filters.keyword.trim(),
      district: filters.district,
      city: filters.city,
      propertyType: filters.propertyType,
      furnished: filters.furnished,
      gender: filters.gender,
      sort: allowedSort.has(filters.sort) ? filters.sort : "featured",
      page: Math.max(filters.page, 1),
      priceRange: [minPrice, maxPrice] as [number, number],
    };
  }, [filters]);

  const selectedDistrictId = useMemo(() => {
    return matchBySlugNameOrId(districts, normalizedFilters.district)?.id;
  }, [districts, normalizedFilters.district]);

  const selectedCityId = useMemo(() => {
    return matchBySlugNameOrId(cities, normalizedFilters.city)?.id;
  }, [cities, normalizedFilters.city]);

  useEffect(() => {
    async function loadDistricts() {
      const { data } = await supabase.from("districts").select("*").order("name");
      if (data) setDistricts(data);
    }

    loadDistricts();
  }, [supabase]);

  useEffect(() => {
    if (!normalizedFilters.district) {
      setCities([]);
      return;
    }

    async function loadCities() {
      if (!selectedDistrictId) return;
      const { data } = await supabase
        .from("cities")
        .select("*")
        .eq("district_id", selectedDistrictId)
        .order("name");

      if (data) setCities(data);
    }

    loadCities();
  }, [normalizedFilters.district, selectedDistrictId, supabase]);

  const fetchListings = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const { data: rankedRows, error: rankedError } = await supabase.rpc(
        "search_marketplace_listings",
        {
          p_keyword: normalizedFilters.keyword || null,
          p_district_id: selectedDistrictId || null,
          p_city_id: selectedCityId || null,
          p_property_type: normalizedFilters.propertyType || null,
          p_furnished: normalizedFilters.furnished || null,
          p_gender: normalizedFilters.gender || null,
          p_min_price: normalizedFilters.priceRange[0] > 0 ? normalizedFilters.priceRange[0] : null,
          p_max_price: normalizedFilters.priceRange[1] < SEARCH_PRICE_MAX ? normalizedFilters.priceRange[1] : null,
          p_sort: normalizedFilters.sort,
          p_page: normalizedFilters.page,
          p_per_page: ITEMS_PER_PAGE,
        },
      );

      if (rankedError) throw rankedError;

      const rows = (rankedRows as MarketplaceSearchRow[] | null) ?? [];

      if (currentRequestId !== requestIdRef.current) return;

      const validRows = rows.filter((row) => row.listing) as Array<MarketplaceSearchRow & { listing: Listing }>;
      const derivedTotal = rows.length > 0 ? Number(rows[0].total_count || 0) : 0;

      setListings(validRows.map((row) => row.listing));
      setTotalCount(derivedTotal);
    } catch (fetchError) {
      if (currentRequestId !== requestIdRef.current) return;
      setListings([]);
      setTotalCount(0);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load search results");
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    supabase,
    normalizedFilters,
    selectedDistrictId,
    selectedCityId,
  ]);

  useEffect(() => {
    const canQueryListings = !normalizedFilters.district || Boolean(selectedDistrictId);
    if (canQueryListings) {
      fetchListings();
    }
  }, [fetchListings, normalizedFilters.district, selectedDistrictId]);

  return {
    districts,
    cities,
    listings,
    totalCount,
    loading,
    error,
  };
}
