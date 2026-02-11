/* eslint-disable @typescript-eslint/no-explicit-any */
// app/rentals/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ListingView } from "@/types/view";
import FiltersSidebar from "@/components/listings/FiltersSidebar";
import PropertyGrid from "@/components/listings/PropertyGrid";
import PropertyList from "@/components/listings/PropertyList";
import MapView from "@/components/listings/MapView";
import AdsCarousel from "@/components/listings/AdsCarousel";
import ListingToolbar from "@/components/listings/ListingsToolbar";
import Pagination from "@/components/listings/Pagination";
import Breadcrumbs from "@/components/listings/Breadcrumbs";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Property } from "@/types/Property";



export default function RentalsPage() {
  const [view, setView] = useState<ListingView>("grid");
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

  const buildQueryFromURL = () => {
    const city = searchParams.get("city") || "";
    const minPrice = searchParams.get("minPrice")
      ? parseInt(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseInt(searchParams.get("maxPrice")!)
      : undefined;
    const type = searchParams.get("type")?.toUpperCase() || "";
    const gender = searchParams.get("gender")?.toUpperCase() || "";
    const amenities = searchParams.get("amenities")
      ? searchParams.get("amenities")!.split(",")
      : [];
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : 1;

    return { city, minPrice, maxPrice, type, gender, amenities, page };
  };

  // app/rentals/page.tsx
const fetchListings = async () => {
  setLoading(true);
  setError(null);

  try {
    const { city, minPrice, maxPrice, type, gender, amenities, page } = buildQueryFromURL();

    // Check if any filters are active
    const hasFilters =
      city ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      type ||
      gender ||
      amenities.length > 0;

    const params = new URLSearchParams();

    if (hasFilters) {
      // Use SEARCH endpoint
      if (city) params.append("query", city); // Note: search uses "query", not "city"
      if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
      if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
      if (type) params.append("propertyType", type);
      if (amenities.length > 0) params.append("amenities", amenities.join(","));
      // Note: your backend doesn't support "gender" filter yet
    } else {
      // Use LIST endpoint
      params.append("page", page.toString());
      params.append("limit", "12");
    }

    const endpoint = hasFilters ? "/properties/search" : "/properties";
    const res = await fetch(`${API_BASE_URL}${endpoint}?${params}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const data = await res.json();

    // Handle different response shapes
    if (hasFilters) {
      // Search returns array directly
      setListings(Array.isArray(data) ? data : []);
      setTotalPages(1); // Search doesn't paginate in your current impl
    } else {
      // List returns { properties, totalPages }
      setListings(data.properties || []);
      setTotalPages(data.totalPages || 1);
    }
  } catch (err: any) {
    console.error("Fetch error:", err);
    setError(err.message || "Unable to load listings");
    setListings([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const updateFilters = (newFilters: Record<string, any>) => {
    const current = new URLSearchParams(searchParams.toString());

    ["city", "minPrice", "maxPrice", "type", "gender", "amenities"].forEach((key) =>
      current.delete(key)
    );

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          current.set(key, value.join(","));
        } else {
          current.set(key, value.toString());
        }
      }
    });

    current.set("page", "1");
    router.push(`${pathname}?${current.toString()}`);
  };

  const currentPage = parseInt(searchParams.get("page") || "1");

  // Transform property for UI components
  const transformedListings = listings.map((p) => ({
    ...p,
    beds: p.bedrooms,
    baths: p.bathrooms,
    area: p.sizeSqft,
    amenities: p.amenities.map((a) => a.name),
  }));

  return (
    <>
      <Navbar />

      <main className="my-2 max-w-7xl mx-auto px-4">
        <AdsCarousel />
        <Breadcrumbs params={searchParams} />

        <div className="flex gap-8">
          {/* ----------------------------- SIDEBAR ----------------------------- */}
          <aside className="w-1/4 hidden lg:block">
            <FiltersSidebar
              currentFilters={Object.fromEntries(searchParams)}
              onUpdateFilters={(filters) => {
                const p = new URLSearchParams(filters as any);
                router.push(`${pathname}?${p.toString()}`);
              }}
            />
          </aside>

          {/* ----------------------------- CONTENT ----------------------------- */}
          <div className="flex-1">
            <ListingToolbar
              view={view}
              onViewChange={setView}
              count={listings.length}
            />

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <>
                {view === "grid" && <PropertyGrid listings={listings} />}
                {view === "list" && <PropertyList listings={listings} />}
                {view === "map" && <MapView listings={listings} />}
              </>
            )}

            {!loading && listings.length === 0 && !error && (
              <div className="py-16 text-center text-gray-500">
                No properties found matching your criteria.
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={1}
                totalPages={totalPages}
                onPageChange={(p) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(p));
                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}