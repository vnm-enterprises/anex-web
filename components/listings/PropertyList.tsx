/* eslint-disable @typescript-eslint/no-explicit-any */
// components/listings/PropertyList.tsx
"use client";

import { useEffect, useState } from "react";
import { Bed, Bath, MapPin, Wifi, Heart } from "lucide-react";

// Feature Flag: Use dummy data or fetch from API
const USE_DUMMY_DATA = false;

// Dummy Data
const DUMMY_PROPERTIES = [
  {
    id: 1,
    title: "Modern Annex for Rent",
    location: "Nugegoda, Colombo",
    price: 35000,
    beds: 1,
    baths: 1,
    extra: "450 sqft",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWPk_rKtHoptMcNcXJkc8xBG-x348eO10TrImXIS4QQ9R7LzVSDMKeEnfScoDcTHJ3OWWRWgPtvkKgeXdCQuMU_sc2V4sg2XoIeVrO9tNwx7zcNwL2TiSHPvgLpJmPhrsNWXcLAkGdgYdE_do6z72uw83qajE6Euux0lEXRr7aAWTbyduMcjY3UYPg23SDZqGLVHUnWIh6UvuzBRdGSKnuvOFYwUnrTopOpltmZ-E1rLcm7AyJ3KdKcSeRXF1BzixHevgEt_GQxxI",
  },
  {
    id: 2,
    title: "Single Room for Ladies",
    location: "Kohuwala, Nugegoda",
    price: 18500,
    beds: 1,
    baths: "Shared",
    extra: "WiFi",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5zmuUGi-Y65Qcn7C9KgJe3q1pMYyyMhSxhwCijeUvKDbGlQg39CbuFZqhj_16TWkS3x5D3UHmJRtDv9x4F9D0C6mao8uTFKLBAxn9UNWCW3HHHXBzknxWcx6nRVoAnT8HzPNzjV6ILC6yTigfwRnZVBHexCPdRSB0QPzkti3AsR9B5fU5ArRFDGkqM3sJjZIOLYE20r-s4F3OJifQfZPJ43emEcvs6vsF4-rn9iEf7ppcj6jTxk37bT5SOMwKDcBXkO8yz6Xcm1w",
  },
];

type Listing = {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number | string;
  baths: number | string;
  extra: string;
  image: string;
};

export default function PropertyList({ listings }: { listings: Listing[] }) {
  // If no listings passed (from parent), use dummy or fetch
  const [localListings, setLocalListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listings && listings.length > 0) {
      setLocalListings(listings);
      return;
    }

    const fetchProperties = async () => {
      if (USE_DUMMY_DATA) {
        setLocalListings(DUMMY_PROPERTIES);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/rentals?limit=6");
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = await res.json();
        setLocalListings(data.data || DUMMY_PROPERTIES);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setLocalListings(DUMMY_PROPERTIES);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [listings]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-52 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    );
  }

  if (localListings.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-secondary">No properties available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {localListings.map((property) => (
        <article
          key={property.id}
          className="group flex flex-col overflow-hidden rounded-xl border border-border-color bg-surface-light shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-surface-dark sm:flex-row"
        >
          {/* Image */}
          <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-64">
            <img
              src={property.image}
              alt={property.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button className="absolute right-3 top-3 rounded-full bg-black/30 p-2 text-white backdrop-blur hover:bg-black/50">
              <Heart size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-text-main dark:text-white">
                {property.title}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                <MapPin size={14} />
                {property.location}
              </p>
            </div>

            {/* Meta */}
            <div className="my-3 flex flex-wrap gap-4 text-sm text-text-main dark:text-white">
              <span className="flex items-center gap-1">
                <Bed size={16} /> {property.beds} Bed
              </span>
              <span className="flex items-center gap-1">
                <Bath size={16} /> {property.baths}
              </span>
              <span className="flex items-center gap-1">
                <Wifi size={16} /> {property.extra}
              </span>
            </div>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between">
              <div>
                <p className="text-xs text-text-secondary">Monthly Rent</p>
                <p className="text-xl font-bold text-primary">
                  LKR {property.price.toLocaleString()}
                </p>
              </div>

              <button className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-background-dark">
                View Details
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}