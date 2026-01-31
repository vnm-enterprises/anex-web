"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

/* =========================
   TYPES
========================= */
type Location = {
  id: string;
  name: string;
  slug: string;
  listingsCount: number;
  image: string;
};

/* =========================
   FEATURE FLAG
========================= */
const USE_LOCATIONS_API = true;

/* =========================
   FALLBACK DATA
========================= */
const FALLBACK_LOCATIONS: Location[] = [
  {
    id: "1",
    name: "Colombo",
    slug: "colombo",
    listingsCount: 120,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdNYV7nu_HPRVD61MUNrzK52taj5JIQks5cghmOw329ovS3uHIovWVr-jgZZizP7awX6DQ2A60ZLVUA8pBdQFJfN9URjauwqF4upL75O3lvutv3iHQrWV79NtufuMnkMzc6yJyhgOmjSWymOamX47YlNRk42koktI0QisccO-5nmfa4B4T_p5eX1wXOtrUUc0HmapYvqLOR4ey3WgwPvaYDhH69zTyEe_56AZ73AD2amoW3w6npofj_ls10kn1ruUq4d-SoLp73f0",
  },
  {
    id: "2",
    name: "Kandy",
    slug: "kandy",
    listingsCount: 85,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6E7sAiyrF8I1IlJnqSMOGJUylprU-_kQMv-fjZiXOYVRmKwCUF23DNEp76PLQ0dQzDW92SZRHoeQpByGp7hq_VFmINBGwZkeJ-ad5md1bh9lbOGYFXXZx6sCM1ZN5722SCkeBRIIi9IZqTXCC7ZXDyad0E6eyzZKoWD3J3RaZ1sGjyG3RoMEYRngxFkj7mad2OpZEOBms2b5u7V5fOeQOrerVKXbLiDgwzV1sE03YEMKaFKe2m2cNJjMAT7VBRHR6YEXY9WbSA6o",
  },
  {
    id: "3",
    name: "Galle",
    slug: "galle",
    listingsCount: 40,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmFBOxE4uzdFmYfcTiRR0l2qIYHcjVg86VgNaSP2VUA46zUoWJIIOOVLKH2CAmdtwl2CeuCN4ShzIRgvWOjxTwi7IOq-EkUL6iZB9Yn-i_5Utqe3BLRzF-5bRMHsgpmWClWTaSYajC625Dji2kZmy-HMQ0zNXIlW_qW98pkmYAtw1Hx51TNhj82p2SEsBRP2D15SymoHDrbqgte6pAkr-e1ZIM7tabMd6gWNU2XuoUsdbIvkFuOQQzAvhqB2It5ToZx5PrqDZ0Q7E",
  },
  {
    id: "4",
    name: "Gampaha",
    slug: "gampaha",
    listingsCount: 65,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDA3TazTyULTAL8_-BKppcXo3gxA6j43XHE2Vb1aossB9iXKcDbuqbdEMfRECfrF1ebwPkHbMPdgwcbhaqcqOhNLflwnMWZpWYcpfM0dtDOaC3IEC8YaepfjFlG4BVCtqL0WfyRUYFxS-FjdmRTcDxnWZlW6RBWKDRSl0ZwUpV38knO_woJkvoD6TWMp6BuNEnIZOfgF34CjkMBK55OlLHegMxhIkWf8tHdB89zDvfrsbxSWsFu6t7lWSkEH_deUWh48WfdJGHomhc",
  },
];

export default function PopularLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        if (!USE_LOCATIONS_API) {
          setLocations(FALLBACK_LOCATIONS);
          return;
        }

        const res = await axios.get<Location[]>("/api/locations/popular");

        if (!res.data || res.data.length === 0) {
          setLocations(FALLBACK_LOCATIONS);
        } else {
          setLocations(res.data);
        }
      } catch {
        setLocations(FALLBACK_LOCATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-white/5">

        {/* Decorative gradient blobs */}
          {/* <div className="absolute bottom-0 left-0 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-0 right-0 translate-x-1/2 translate-y-1/2 h-64 w-64 rounded-full bg-primary/20 blur-3xl" /> */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white sm:text-4xl">
            Popular Locations
          </h2>
          <p className="mt-2 text-lg text-text-secondary dark:text-gray-400">
            Explore properties in top cities.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Locations */}
        {!loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={`/rentals?location=${location.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-md"
              >
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />

                <img
                  src={location.image}
                  alt={location.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute bottom-0 left-0 z-20 w-full p-4">
                  <h3 className="text-xl font-bold text-white">
                    {location.name}
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    {location.listingsCount}+ Listings
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
