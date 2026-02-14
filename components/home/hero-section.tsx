"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Home,
  BedDouble,
  Warehouse,
  Building2,
} from "lucide-react";
import type { District } from "@/lib/types";
import { PROPERTY_TYPES } from "@/lib/constants";

export function HeroSection() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("districts")
        .select("*")
        .order("name");
      if (data) setDistricts(data);
    }
    load();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (district) params.set("district", district);
    if (propertyType) params.set("type", propertyType);
    router.push(`/search?${params.toString()}`);
  };

  const stats = [
    { label: "Districts", value: "25" },
    { label: "Property Types", value: "4" },
    { label: "Free to List", value: "Yes" },
  ];

  return (
    <section className="relative w-full min-h-[760px] overflow-hidden bg-primary/5">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
          alt="Modern Sri Lankan villa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-24 mt-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight text-white tracking-tight drop-shadow-lg">
            Find a place that
            <span className="block font-bold text-primary mt-2">
              feels like home.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-200 leading-relaxed max-w-xl">
            Discover annexes, apartments, boarding places and houses across Sri
            Lanka — verified, trusted, and ready for long-term living.
          </p>
        </div>

        {/* Floating Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-16 backdrop-blur-xl bg-white/90 border border-slate-200 shadow-2xl rounded-2xl p-4"
        >
          <div className="grid md:grid-cols-4 gap-4 items-center">
            {/* Keyword */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by area, keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-11 h-12 bg-transparent border-none focus-visible:ring-0 text-slate-800"
              />
            </div>

            {/* District */}
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="h-12 border-none bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4" />
                  <SelectValue placeholder="District" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.slug}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type + Button */}
            <div className="flex gap-3">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="h-12 border-none bg-slate-50 rounded-xl">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="submit"
                className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 shadow-lg"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </form>

        {/* Minimal Categories */}
        <div className="mt-20 flex flex-wrap gap-10 text-slate-200">

          {[
            { icon: Home, label: "Annexes", type: "annex" },
            { icon: BedDouble, label: "Boarding", type: "boarding" },
            { icon: Warehouse, label: "Houses", type: "house" },
            { icon: Building2, label: "Apartments", type: "apartment" },
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => router.push(`/search?type=${item.type}`)}
              className="group flex items-center gap-3 text-base font-medium text-slate-200 hover:text-primary transition-colors"

            >
              <item.icon className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />

              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
