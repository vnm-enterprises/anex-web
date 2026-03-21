"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { ITEMS_PER_PAGE } from "@/lib/constants";
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
}

type MarketplaceSearchRow = {
  listing: Listing;
  total_count: number;
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
  const requestIdRef = useRef(0);

  const selectedDistrictId = useMemo(() => {
    return districts.find((item) => item.slug === filters.district)?.id;
  }, [districts, filters.district]);

  const selectedCityId = useMemo(() => {
    return cities.find((item) => item.slug === filters.city)?.id;
  }, [cities, filters.city]);

  useEffect(() => {
    async function loadDistricts() {
      const { data } = await supabase.from("districts").select("*").order("name");
      if (data) setDistricts(data);
    }

    loadDistricts();
  }, [supabase]);

  useEffect(() => {
    if (!filters.district) {
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
  }, [filters.district, selectedDistrictId, supabase]);

  const fetchListings = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const safePage = Math.max(filters.page, 1);

      const { data: rankedRows, error: rankedError } = await supabase.rpc(
        "search_marketplace_listings",
        {
          p_keyword: filters.keyword || null,
          p_district_id: selectedDistrictId || null,
          p_city_id: selectedCityId || null,
          p_property_type: filters.propertyType || null,
          p_furnished: filters.furnished || null,
          p_gender: filters.gender || null,
          p_min_price: filters.priceRange[0] > 0 ? filters.priceRange[0] : null,
          p_max_price: filters.priceRange[1] < 200000 ? filters.priceRange[1] : null,
          p_sort: filters.sort || "featured",
          p_page: safePage,
          p_per_page: ITEMS_PER_PAGE,
        },
      );

      if (rankedError) throw rankedError;

      const rows = (rankedRows as MarketplaceSearchRow[] | null) ?? [];

      if (currentRequestId !== requestIdRef.current) return;

      if (rows.length > 0) {
        setListings(rows.map((row) => row.listing));
        setTotalCount(Number(rows[0].total_count || 0));
        return;
      }

      // Page overflow fallback: keep total count accurate even when requested page has no rows.
      let countQuery = supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");

      if (filters.keyword) {
        countQuery = countQuery.or(
          `title.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%`,
        );
      }

      if (selectedDistrictId) countQuery = countQuery.eq("district_id", selectedDistrictId);
      if (selectedCityId) countQuery = countQuery.eq("city_id", selectedCityId);
      if (filters.propertyType) countQuery = countQuery.eq("property_type", filters.propertyType);
      if (filters.furnished) countQuery = countQuery.eq("furnished", filters.furnished);
      if (filters.gender && filters.gender !== "any") {
        countQuery = countQuery.eq("gender_preference", filters.gender);
      }
      if (filters.priceRange[0] > 0) countQuery = countQuery.gte("price", filters.priceRange[0]);
      if (filters.priceRange[1] < 200000) countQuery = countQuery.lte("price", filters.priceRange[1]);

      const { count } = await countQuery;

      if (currentRequestId !== requestIdRef.current) return;

      setListings([]);
      setTotalCount(count ?? 0);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    supabase,
    filters.keyword,
    filters.propertyType,
    filters.furnished,
    filters.gender,
    filters.priceRange,
    filters.sort,
    filters.page,
    selectedDistrictId,
    selectedCityId,
  ]);

  useEffect(() => {
    const canQueryListings = !filters.district || Boolean(selectedDistrictId);
    if (canQueryListings) {
      fetchListings();
    }
  }, [fetchListings, filters.district, selectedDistrictId]);

  return {
    districts,
    cities,
    listings,
    totalCount,
    loading,
  };
}
