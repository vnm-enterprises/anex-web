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
      {/* Background with modern abstract elements or clean architecture */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.15),transparent_50%)]" /> */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
          alt="Modern Architecture"
          className="w-full h-full object-cover opacity-70 grayscale-[20%]"
        />
        {/* Adjusted gradient for better contrast with the search bar */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" /> */}
      {/* Subtle overall darkening */}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in">
          <Sparkles className="h-3 w-3" />
          The Future of Rental Search
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.95] text-foreground tracking-[-0.04em] mb-10 animate-fade-in drop-shadow-sm">
          Find your <span className="text-primary italic">next</span><br />
          <span className="relative">
            living space.
            <svg className="absolute -bottom-4 left-0 w-full h-3 text-primary/20 fill-current opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white font-medium leading-relaxed mb-16 animate-fade-in [animation-delay:100ms]">
          Annex.lk connects you with verified homeowners across Sri Lanka.
          Simple, transparent, and completely free to start.
        </p>

        {/* Ultra-Modern Search Interface */}
        <div className="max-w-4xl mx-auto animate-fade-in [animation-delay:200ms]">
          <form
            onSubmit={handleSearch}
            className="group relative bg-card/40 backdrop-blur-3xl border border-white/30 dark:border-white/10 p-2 md:p-3 rounded-[2.5rem] soft-shadow-2xl transition-all hover:bg-card/60 ring-1 ring-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Where would you like to live?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full h-16 pl-14 bg-transparent border-none text-lg font-bold placeholder:text-muted-foreground/40 focus-visible:ring-0"
                />
              </div>

              <div className="hidden md:block w-px h-10 bg-border/50" />

              <div className="w-full md:w-64">
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger className="h-16 border-none bg-transparent hover:bg-muted/50 rounded-2xl transition-all px-6 focus:ring-0">
                    <div className="flex items-center gap-3 text-foreground/70 font-bold">
                      <MapPin className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="All Districts" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none soft-shadow p-2">
                    {districts.map((d) => (
                      <SelectItem key={d.id} value={d.slug} className="rounded-xl font-bold py-3 transition-colors focus:bg-primary/5 focus:text-primary">
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto h-16 px-10 rounded-[1.75rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"
              >
                Search
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Trust Markers */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-12 text-muted-foreground/40 font-black uppercase tracking-[0.3em] text-[10px] animate-fade-in [animation-delay:400ms]">
          <div className="flex items-center gap-2 grayscale brightness-200">
            <Warehouse className="h-5 w-5" /> 2,000+ Listings
          </div>
          <div className="flex items-center gap-2 grayscale brightness-200">
            <Building2 className="h-5 w-5" /> 100% Verified
          </div>
          <div className="flex items-center gap-2 grayscale brightness-200">
            <Home className="h-5 w-5" /> Secure Rentals
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
}
