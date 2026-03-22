"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { formatAtLeastHundred } from "@/hooks/use-marketplace-stats";
import { useHomeHook } from "@/hooks/use-home-hook";

export function HeroSection() {
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("");
  const { heroDistricts, marketplaceStats } = useHomeHook();
  const router = useRouter();

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
          src="https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=2200"
          alt="Modern urban apartment complex"
          className="w-full h-full object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-primary/35 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-primary/40 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md shadow-lg shadow-black/20">
          <Sparkles className="h-3 w-3" />
          Sri Lanka's Smartest Rental Platform
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none md:leading-[0.95] tracking-normal md:tracking-[-0.04em] mb-8">
          Discover. Rent. <span className="text-primary italic">Move In.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 font-medium leading-relaxed mb-14">
          RENTR connects you with verified homeowners across Sri Lanka.
          Simple, transparent, and completely free to start.
        </p>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="relative bg-white/15 backdrop-blur-2xl border border-primary/25 p-2 md:p-3 rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">
              {/* Keyword */}
              <div className="flex-1 w-full relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <Input
                  placeholder="Where would you like to live?"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full h-14 md:h-16 pl-14 bg-transparent border-none text-base md:text-lg font-bold text-white placeholder:text-white/50 focus-visible:ring-0"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-10 bg-white/20" />

              {/* District Select */}
              <div className="w-full md:w-64">
                <Select value={district} onValueChange={setDistrict}>
                  <SelectTrigger className="h-14 md:h-16 border-none bg-transparent text-white hover:bg-white/10 rounded-2xl px-6 focus:ring-0">
                    <div className="flex items-center gap-3 font-bold">
                      <MapPin className="h-4 w-4 text-primary" />
                      <SelectValue placeholder="All Districts" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-xl p-2">
                    {heroDistricts.map((d) => (
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
                className="w-full md:w-auto h-14 md:h-16 px-10 rounded-2xl md:rounded-[1.75rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/30 active:scale-95 flex items-center justify-center gap-2"
              >
                Search
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Trust Markers */}
        <div className="mt-12 md:mt-20 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-white/60 font-black uppercase tracking-[0.3em] text-[10px]">
          <div className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" /> {formatAtLeastHundred(marketplaceStats?.listingsCount)} Listings
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
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[150px] pointer-events-none" />
    </section>
  );
}
