"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import type { District } from "@/lib/types";

export function DistrictsSection() {
  const [districts, setDistricts] = useState<
    (District & { count?: number; image: string })[]
  >([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Get districts
      const { data: districtsData } = await supabase
        .from("districts")
        .select("*")
        .order("name");

      if (districtsData) {
        const districtImages: Record<string, string> = {
          colombo:
            "https://images.unsplash.com/photo-1623595289196-007a22dd8560?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

          kandy:
            "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2FuZHl8ZW58MHx8MHx8fDA%3D",

          galle:
            "https://images.unsplash.com/photo-1579989197111-928f586796a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FsbGV8ZW58MHx8MHx8fDA%3D",

          gampaha:
            "https://images.unsplash.com/photo-1584211932359-513d7b58fe5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtcGFoYXxlbnwwfHwwfHx8MA%3D%3D",

          kalutara:
            "https://images.unsplash.com/photo-1697548532456-561b5f9a694d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2FsdXRoYXJhfGVufDB8fDB8fHww",

          kurunegala:
            "https://images.unsplash.com/photo-1707879255077-cd04f34b3643?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a3VydW5lZ2FsYXxlbnwwfHwwfHx8MA%3D%3D",
        };

        const prominentSlugs = [
          "colombo",
          "kandy",
          "galle",
          "gampaha",
          "kalutara",
          "kurunegala",
        ];
        const enriched = districtsData
          .map((d) => ({ ...d, slug: d.slug.toLowerCase() }))
          .filter((d) => prominentSlugs.includes(d.slug))
          .map((d) => ({
            ...d,
            count: Math.floor(Math.random() * 200) + 50,
            image:
              districtImages[d.slug] ||
              `https://images.unsplash.com/photo-1580000000000?auto=format&fit=crop&q=80&w=800`,
          }));
        setDistricts(enriched);
      }
    }
    load();
  }, []);

  if (districts.length === 0) return null;

  return (
    <section className="animate-fade-in [animation-delay:400ms]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            Popular Locations
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Find your place in{" "}
            <span className="text-primary italic">Sri Lanka</span>
          </h2>
        </div>
        <Link
          href="/search"
          className="group flex items-center gap-2 text-sm font-black text-primary uppercase tracking-widest hover:gap-4 transition-all"
        >
          View all districts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {districts.map((district, i) => (
          <Link
            key={district.id}
            href={`/search?district=${district.slug}`}
            className="group relative h-80 rounded-[2.5rem] overflow-hidden soft-shadow transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Background Placeholder/Simulated Image */}
            <div className="absolute inset-0 bg-muted">
              <img
                src={district.image}
                alt={district.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity group-hover:from-primary/90" />

            {/* Content */}
            <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-2">
                <MapPin className="h-3 w-3" />
                District
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-2 group-hover:translate-x-2 transition-transform duration-500">
                {district.name}
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                <Sparkles className="h-3 w-3 text-primary" />
                {district.count} Listings available
              </div>
            </div>

            {/* External Link Icon */}
            <div className="absolute top-8 right-8 h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center translate-y-4 group-hover:translate-y-0 shadow-lg">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
