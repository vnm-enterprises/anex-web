"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

const LISTING_SELECT = "*, districts(*), cities(*), listing_images(*)";

/**
 * Handles all search page data fetching and filtering queries.
 */
export function useSearchHook(filters: SearchFilters): UseSearchHookResult {
  const [districts, setDistricts] = useState<District[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const selectedDistrictId = useMemo(() => {
    return districts.find((item) => item.slug === filters.district)?.id;
  }, [districts, filters.district]);

  const selectedCityId = useMemo(() => {
    return cities.find((item) => item.slug === filters.city)?.id;
  }, [cities, filters.city]);

  useEffect(() => {
    async function loadDistricts() {
      const supabase = createClient();
      const { data } = await supabase.from("districts").select("*").order("name");
      if (data) setDistricts(data);
    }

    loadDistricts();
  }, []);

  useEffect(() => {
    if (!filters.district) {
      setCities([]);
      return;
    }

    async function loadCities() {
      if (!selectedDistrictId) return;
      const supabase = createClient();
      const { data } = await supabase
        .from("cities")
        .select("*")
        .eq("district_id", selectedDistrictId)
        .order("name");

      if (data) setCities(data);
    }

    loadCities();
  }, [filters.district, selectedDistrictId]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("listings")
      .select(LISTING_SELECT, { count: "exact" })
      .eq("status", "approved");

    if (filters.keyword) {
      query = query.textSearch("search_vector", filters.keyword, {
        type: "websearch",
        config: "english",
      });
    }

    if (selectedDistrictId) {
      query = query.eq("district_id", selectedDistrictId);
    }

    if (selectedCityId) {
      query = query.eq("city_id", selectedCityId);
    }

    if (filters.propertyType) query = query.eq("property_type", filters.propertyType);
    if (filters.furnished) query = query.eq("furnished", filters.furnished);
    if (filters.gender && filters.gender !== "any") {
      query = query.eq("gender_preference", filters.gender);
    }
    if (filters.priceRange[0] > 0) query = query.gte("price", filters.priceRange[0]);
    if (filters.priceRange[1] < 200000) query = query.lte("price", filters.priceRange[1]);

    switch (filters.sort) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "views":
        query = query.order("views_count", { ascending: false });
        break;
      case "featured":
      default:
        query = query
          .order("is_featured", { ascending: false })
          .order("is_boosted", { ascending: false })
          .order("created_at", { ascending: false });
        break;
    }

    const from = (filters.page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;
    const { data, count } = await query.range(from, to);

    if (data) setListings(data as Listing[]);
    if (count !== null) setTotalCount(count);
    setLoading(false);
  }, [
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
    if (districts.length > 0 || !filters.district) {
      fetchListings();
    }
  }, [fetchListings, districts.length, filters.district]);

  return {
    districts,
    cities,
    listings,
    totalCount,
    loading,
  };
}
