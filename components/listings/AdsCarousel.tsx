/* eslint-disable @typescript-eslint/no-explicit-any */
// components/listings/AdsCarousel.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Feature Flag: Use dummy data or fetch from API
const USE_DUMMY_DATA = false;

// Dummy Data (fallback)
const DUMMY_ADS = [
  {
    id: 1,
    title: "Premium Annexes in Nugegoda",
    subtitle: "Verified • No Agents • Move-in Ready",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWPk_rKtHoptMcNcXJkc8xBG-x348eO10TrImXIS4QQ9R7LzVSDMKeEnfScoDcTHJ3OWWRWgPtvkKgeXdCQuMU_sc2V4sg2XoIeVrO9tNwx7zcNwL2TiSHPvgLpJmPhrsNWXcLAkGdgYdE_do6z72uw83qajE6Euux0lEXRr7aAWTbyduMcjY3UYPg23SDZqGLVHUnWIh6UvuzBRdGSKnuvOFYwUnrTopOpltmZ-E1rLcm7AyJ3KdKcSeRXF1BzixHevgEt_GQxxI",
    cta: "View Property",
  },
  {
    id: 2,
    title: "Luxury Apartments – Colombo",
    subtitle: "Furnished • Secure • Modern",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVLmH8idFEimJYXTmNu8HJmfAMV9CAufpJS5XXu-nt3SlWkrfoHzNSbrFLI1L2K0dr39JquNOeeP0zGY8vj29Q1ScjmIha93BcxIoPLpMdiZqwFb4G0XoLhwtlrDN0Fi3jvs0pLFoLFqCMw5UVxeSEtJCzkGKn7HTEmcsWSS431-7jUlgUsHsyDnpTd-FWubJOpMHk4up3pJI_jSnEmiIB-r1WT5wRLF96b1IhqHliOL9dDZ-4ujdRSOyyzSWrhIVModwSlJ81KlA",
    cta: "Explore Now",
  },
];

export default function AdsCarousel() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      if (USE_DUMMY_DATA) {
        setAds(DUMMY_ADS);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/ads");
        if (!res.ok) throw new Error("Failed to fetch ads");
        const data = await res.json();
        setAds(data.ads || DUMMY_ADS);
      } catch (err) {
        console.error("Error fetching ads:", err);
        setAds(DUMMY_ADS);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Auto slide
  useEffect(() => {
    if (ads.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [ads]);

  if (loading) {
    return (
      <section className="mb-6">
        <div className="h-[220px] rounded-xl bg-surface-light animate-pulse dark:bg-surface-dark"></div>
      </section>
    );
  }

  if (ads.length === 0) {
    return null; // or show placeholder
  }

  return (
    <section className="mb-6">
      <div className="relative overflow-hidden rounded-xl border border-border-color bg-surface-light shadow-sm dark:border-white/10 dark:bg-surface-dark">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {ads.map((ad) => (
            <div key={ad.id} className="relative h-[180px] min-w-full md:h-[220px]">
              {/* Image */}
              <img
                src={ad.image}
                alt={ad.title}
                className="h-full w-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10">
                <span className="mb-2 inline-block w-fit rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-background-dark">
                  Sponsored
                </span>

                <h3 className="max-w-md text-xl font-bold text-white md:text-2xl">
                  {ad.title}
                </h3>

                <p className="mt-1 max-w-md text-sm text-white/80">
                  {ad.subtitle}
                </p>

                <button className="mt-4 w-fit rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark transition hover:bg-primary-dark">
                  {ad.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={() =>
            setIndex((prev) => (prev - 1 + ads.length) % ads.length)
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
          aria-label="Previous ad"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => setIndex((prev) => (prev + 1) % ads.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
          aria-label="Next ad"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index
                  ? "bg-primary"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to ad ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}