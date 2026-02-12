/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useViewMode } from "../../hooks/useViewMode";
import ViewToggle from "./ViewToggle";
import ListingCard from "./ListingCard";
import { Landmark } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store";

/* -------------------- */
/* Listing data model   */
/* -------------------- */

/**
 * Represents the status of a property listing.
 */
export type ListingStatus = "active" | "reviewing" | "occupied";

/**
 * Represents a property listing managed by the user.
 */
export interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  views: number;
  status: ListingStatus;
  propertyImages: string;
  bedrooms?: number
  bathrooms? : number;
  sizeSqft?: any;
}

/* -------------------- */
/* Dummy data for development */
/* -------------------- */
const DUMMY_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "2 Bedroom Annex",
    location: "Nugegoda",
    price: 35000,
    description:
      "Spacious upstairs annex with separate entrance, fully tiled, parking available. Walking distance to High Level road.",
    views: 1240,
    status: "active",
    propertyImages:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmw2mBDhmH7tct4JnO4mZVRpA8TGfTs5W-k-MMYy1T-r27Itr6I7_HnAv_HZe52GXgOkODJ-8PJXfR3BtmrXZ7NlyMGNwLNfIJmnifTt82wpHK5gYTE9e1G2-P8-ttwlHux14M7uwySkPf_Ma554qw4jUVpLYGQ1YwgPtramvB9Nz0hH-1ZCmgwLxzkSMxF-9Qq0zL-JHQlfQeCyzKBGPvCaI3Y4ge23zSXIG2oWtuitU7XtawNejSAXICtcG1smHHy6SVjqi7uX8",
  },
  {
    id: "2",
    title: "Single Room for Student",
    location: "Kandy",
    price: 12000,
    description:
      "Ideal for university students. Shared bathroom, cooking facility available. Close to Peradeniya University.",
    views: 450,
    status: "reviewing",
    propertyImages:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmw2mBDhmH7tct4JnO4mZVRpA8TGfTs5W-k-MMYy1T-r27Itr6I7_HnAv_HZe52GXgOkODJ-8PJXfR3BtmrXZ7NlyMGNwLNfIJmnifTt82wpHK5gYTE9e1G2-P8-ttwlHux14M7uwySkPf_Ma554qw4jUVpLYGQ1YwgPtramvB9Nz0hH-1ZCmgwLxzkSMxF-9Qq0zL-JHQlfQeCyzKBGPvCaI3Y4ge23zSXIG2oWtuitU7XtawNejSAXICtcG1smHHy6SVjqi7uX8",
  },
  {
    id: "3",
    title: "Luxury House",
    location: "Battaramulla",
    price: 150000,
    description:
      "Currently rented out until Dec 2024. 4 Bedrooms, 3 Bathrooms, Servant quarters, Solar power.",
    views: 2100,
    status: "occupied",
    propertyImages:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmw2mBDhmH7tct4JnO4mZVRpA8TGfTs5W-k-MMYy1T-r27Itr6I7_HnAv_HZe52GXgOkODJ-8PJXfR3BtmrXZ7NlyMGNwLNfIJmnifTt82wpHK5gYTE9e1G2-P8-ttwlHux14M7uwySkPf_Ma554qw4jUVpLYGQ1YwgPtramvB9Nz0hH-1ZCmgwLxzkSMxF-9Qq0zL-JHQlfQeCyzKBGPvCaI3Y4ge23zSXIG2oWtuitU7XtawNejSAXICtcG1smHHy6SVjqi7uX8",
  },
];

/**
 * Listings section component for the dashboard.
 *
 * Displays the user's property listings in either list or grid view.
 *
 * In development mode (`NEXT_PUBLIC_DEV_MODE=true`), displays dummy data
 * to enable UI/UX work without requiring a backend.
 *
 * In production, fetches real listing data from `/api/listings`.
 */
export default function ListingsSection() {
  const { view, setView } = useViewMode();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  /**
   * Fetches user's listings from the backend.
   */
  const fetchListings = async () => {
    try {
      const res = await api.get(`/properties?id=${user?.id}`);
      console.info(res.data);
      setListings(res.data.properties || []);
    } catch (err: any) {
      setError("Failed to load listings. Please try again later.");
      console.error("Listings fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isDevMode = true;
    fetchListings();

    // if (isDevMode) {
    //   // Use dummy data in development
    //   setTimeout(() => {
    //     setListings(DUMMY_LISTINGS);
    //     setLoading(false);
    //   }, 300);
    // } else {
    //   // Fetch real data in production
    //   fetchListings();
    // }
  }, []);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-red-500">Error</h2>
        </div>
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Landmark size={20} className="text-primary" />
          My Listings
        </h2>

        <ViewToggle view={view} setView={setView} />
      </div>

      {/* Listings */}
      {listings.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No listings found.</p>
      ) : (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              : "space-y-4"
          }
        >
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} view={view} />
          ))}
        </div>
      )}
    </section>
  );
}