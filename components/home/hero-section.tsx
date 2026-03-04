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
  Warehouse,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { District } from "@/lib/types";

export function HeroSection() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("");
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
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Modern Architecture"
          className="w-full h-full object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center text-white">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md">
          <Sparkles className="h-3 w-3" />
          The Future of Rental Search
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-[-0.04em] mb-8">
          Find your <span className="text-primary italic">next</span>
          <br />
          living space.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 font-medium leading-relaxed mb-14">
          Annex.lk connects you with verified homeowners across Sri Lanka.
          Simple, transparent, and completely free to start.
        </p>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-2 md:p-3 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">

              {/* Keyword */}
              <div className="flex-1 w-full relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <Input
                  placeholder="Where would you like to live?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full h-16 pl-14 bg-transparent border-none text-lg font-bold text-white placeholder:text-white/50 focus-visible:ring-0"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-10 bg-white/20" />

              {/* District Select */}
              <div className="w-full md:w-64">
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger className="h-16 border-none bg-transparent text-white hover:bg-white/10 rounded-2xl px-6 focus:ring-0">
                    <div className="flex items-center gap-3 font-bold">
                      <MapPin className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="All Districts" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl p-2">
                    {districts.map((d) => (
                      <SelectItem
                        key={d.id}
                        value={d.slug}
                        className="rounded-xl font-bold py-3 focus:bg-primary/10 focus:text-primary"
                      >
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto h-16 px-10 rounded-[1.75rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/30 active:scale-95 flex items-center gap-2"
              >
                Search
                <ArrowRight className="h-5 w-5" />
              </Button>

            </div>
          </form>
        </div>

        {/* Trust Markers */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-12 text-white/60 font-black uppercase tracking-[0.3em] text-[10px]">
          <div className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" /> 2,000+ Listings
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> 100% Verified
          </div>
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5" /> Secure Rentals
          </div>
        </div>

      </div>

      {/* Decorative Blur Effects */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none" />

    </section>
  );
}