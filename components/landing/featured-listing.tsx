"use client";

import axios from "axios";
import {
  ArrowRight,
  BedDouble,
  Heart,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/* =========================
   FEATURE FLAG
========================= */
const USE_FEATURED_API = false;

/* =========================
   TYPES
========================= */
type Listing = {
  id: string;
  title: string;
  price: number;
  beds: number;
  type: "ANNEX" | "ROOM" | "HOUSE";
  verified: boolean;
  city: string;
  image: string;
};

/* =========================
   FALLBACK DATA
========================= */
const FALLBACK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Luxury Annex in Nugegoda",
    price: 35000,
    beds: 2,
    type: "ANNEX",
    verified: true,
    city: "Nugegoda, Colombo",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200  ",
  },
  {
    id: "2",
    title: "Cozy Room near University",
    price: 15000,
    beds: 1,
    type: "ROOM",
    verified: false,
    city: "Maharagama, Colombo",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200  ",
  },
  {
    id: "3",
    title: "Fully Furnished House",
    price: 65000,
    beds: 3,
    type: "HOUSE",
    verified: true,
    city: "Battaramulla, Colombo",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200  ",
  },
];

export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        if (!USE_FEATURED_API) {
          setListings(FALLBACK_LISTINGS);
          return;
        }

        const res = await axios.get<Listing[]>("/api/listings/featured");

        if (!res.data || res.data.length === 0) {
          setListings(FALLBACK_LISTINGS);
        } else {
          setListings(res.data);
        }
      } catch (err) {
        setListings(FALLBACK_LISTINGS);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="relative py-10 md:py-10">
        {/* Decorative gradient blobs */}
          {/* <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 h-64 w-64 rounded-full bg-primary/30 blur-3xl" /> */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
              Featured Listings
            </h2>
            <p className="mt-2 text-lg text-text-secondary ">
              Handpicked properties curated for you.
            </p>
          </div>

          <Link
            href="/rentals"
            className="hidden sm:flex items-center border border-slate-400 py-2 px-4 rounded-full gap-2 text-sm font-bold text-text-primary hover:text-primary-dark transition-colors"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[360px] rounded-2xl bg-background-light  animate-pulse border border-border-color "
              />
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-md bg-[[#f8fafc]] shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a2c24] border border-border-color dark:border-white/10"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-text-main dark:text-black">
                      {item.type}
                    </span>

                    {item.verified && (
                      <span className="flex items-center gap-1 rounded-md bg-primary/90 px-2 py-1 text-xs font-bold text-black">
                        <BadgeCheck size={14} />
                        VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
                  {/* <button className="absolute right-3 top-3 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 transition-colors">
                    <Heart size={18} />
                  </button> */}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xl font-bold text-primary">
                      Rs. {item.price.toLocaleString()}
                      <span className="text-sm text-gray-500"> /mo</span>
                    </p>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <BedDouble size={16} />
                      {item.beds}
                    </div>
                  </div>

                  <h3 className="mb-1 text-lg font-bold text-text-main dark:text-white line-clamp-1  transition-colors">
                    {item.title}
                  </h3>

                  <p className="mb-4 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    {item.city}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border-color dark:border-white/10">
                    <Link
                      href={`/rentals/${item.id}`}
                      className="block w-full rounded-lg bg-background-light py-2 text-center text-sm font-bold hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/rentals"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border-color dark:border-white/10 bg-white py-3 text-sm font-bold shadow-sm hover:bg-gray-50 dark:bg-surface-dark dark:hover:bg-white/5 transition-colors"
          >
            View All Listings
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}