/* eslint-disable @typescript-eslint/no-explicit-any */
// app/rentals/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FiltersSidebar from "@/components/filters/FiltersSidebar";
import PropertyGrid from "@/components/listings/PropertyGrid";
import Pagination from "@/components/listings/Pagination";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Breadcrumbs from "@/components/listings/Breadcrumbs";
import { ListingView } from "@/types/view";
import ListingToolbar from "@/components/listings/ListingsToolbar";
import PropertyList from "@/components/listings/PropertyList";
import MapView from "@/components/listings/MapView";
import AdsCarousel from "@/components/listings/AdsCarousel";

// 🔑 Feature Flag
const USE_DUMMY_DATA = true;

// 🎭 Dummy Data (from your provided images)
const DUMMY_LISTINGS = [
  {
    id: "1",
    title: "Modern Annex in Nugegoda",
    city: "Nugegoda, Colombo",
    price: 35000,
    verified: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200",
  },
  {
    id: "2",
    title: "Cozy Room near University",
    city: "Maharagama, Colombo",
    price: 15000,
    verified: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200",
  },
  {
    id: "3",
    title: "Fully Furnished House",
    city: "Battaramulla, Colombo",
    price: 65000,
    verified: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
  },
];

export default function RentalsPage() {
  const [view, setView] = useState<ListingView>("grid");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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

  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    if (USE_DUMMY_DATA) {
      // Simulate network delay
      setTimeout(() => {
        setListings(DUMMY_LISTINGS);
        setTotalPages(1);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const { city, minPrice, maxPrice, type, gender, amenities, page } =
        buildQueryFromURL();

      const params = new URLSearchParams();
      if (city) params.append("city", city);
      if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
      if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
      if (type) params.append("type", type);
      if (gender) params.append("gender", gender);
      if (amenities.length > 0) params.append("amenities", amenities.join(","));
      params.append("page", page.toString());
      params.append("limit", "12");

      const res = await fetch(`http://localhost:4000/rentals?${params}`);
      if (!res.ok) throw new Error("Failed to fetch listings");

      const data = await res.json();
      setListings(data.data || []);
      setTotalPages(data.totalPages || 1);
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

    ["city", "minPrice", "maxPrice", "type", "gender", "amenities"].forEach(
      (key) => current.delete(key)
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

  return (
    <>
      <Navbar />
      <main className="flex flex-col lg:flex-row justify-center mt-10 items-center w-full mb-5">
        <div className="max-w-7xl flex flex-col lg:flex-row lg:items-start lg:justify-between w-full">
          <aside className="w-full lg:w-1/4 shrink-0 mx-auto">
            <FiltersSidebar
              currentFilters={buildQueryFromURL()}
              onUpdateFilters={updateFilters}
            />
          </aside>
          <div className="flex-1 flex-col">
            <Breadcrumbs />
            <AdsCarousel />
            <ListingToolbar view={view} onViewChange={setView} />

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
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
              <div className="py-12 text-center">
                <p className="text-text-secondary">No properties match your filters.</p>
              </div>
            )}

            {listings.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", page.toString());
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