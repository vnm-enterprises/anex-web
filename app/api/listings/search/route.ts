import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { SearchParams } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Parse search parameters
    const params: SearchParams = {
      q: searchParams.get("q") || undefined,
      district: searchParams.get("district") || undefined,
      city: searchParams.get("city") || undefined,
      type: (searchParams.get("type") as any) || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      furnished: (searchParams.get("furnished") as any) || undefined,
      gender: (searchParams.get("gender") as any) || undefined,
      amenities: searchParams.getAll("amenities") || undefined,
      sort: (searchParams.get("sort") as any) || "featured",
      page: searchParams.get("page") || "1",
    };

    const pageSize = 12;
    const page = Math.max(1, parseInt(params.page || "1"));
    const offset = (page - 1) * pageSize;

    // Build base query
    let query = supabase
      .from("listings")
      .select(
        `*,
        districts(name),
        cities(name),
        listing_images(url, storage_path),
        listing_amenities(amenities(id, name))`,
        { count: "exact" },
      )
      .eq("status", "approved");

    // Full-text search
    if (params.q) {
      query = query.textSearch("search_vector", params.q);
    }

    // Filters
    if (params.district) {
      query = query.eq("district_id", params.district);
    }
    if (params.city) {
      query = query.eq("city_id", params.city);
    }
    if (params.type) {
      query = query.eq("property_type", params.type);
    }
    if (params.minPrice) {
      query = query.gte("price", parseInt(params.minPrice));
    }
    if (params.maxPrice) {
      query = query.lte("price", parseInt(params.maxPrice));
    }
    if (params.furnished) {
      query = query.eq("furnished", params.furnished);
    }
    if (params.gender && params.gender !== "any") {
      query = query.or(
        `gender_preference.eq.${params.gender},gender_preference.eq.any`,
      );
    }

    // Sorting with featured/boosted priority
    let orderBy: string = "created_at";
    let ascending = false;

    switch (params.sort) {
      case "price_asc":
        orderBy = "price";
        ascending = true;
        break;
      case "price_desc":
        orderBy = "price";
        ascending = false;
        break;
      case "views":
        orderBy = "views_count";
        ascending = false;
        break;
      case "newest":
        orderBy = "created_at";
        ascending = false;
        break;
      case "featured":
      default:
        // Custom ranking: Featured (with weight) > Boosted (with weight) > Newest
        query = query.order("is_featured", { ascending: false });
        query = query.order("featured_weight", { ascending: false });
        query = query.order("is_boosted", { ascending: false });
        query = query.order("boost_weight", { ascending: false });
        orderBy = "created_at";
        ascending = false;
    }

    query = query.order(orderBy, { ascending });
    query = query.range(offset, offset + pageSize - 1);

    const { data: listings, count, error } = await query;

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      listings: listings || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
