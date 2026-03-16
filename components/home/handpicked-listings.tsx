"use client";

import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListingCarousel } from "./listing-carousel";
import { useHomeHook } from "@/hooks/use-home-hook";

export function HandpickedListings() {
  const { handpickedListings, isHandpickedListingsLoading } = useHomeHook();

  if (!isHandpickedListingsLoading && handpickedListings.length === 0) return null;

  return (
    <section className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
            <Heart className="h-3 w-3 fill-current" />
            Featured Listings
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Featured <span className="text-rose-500 italic">listings</span>
          </h2>
          <p className="text-muted-foreground font-medium max-w-xl">
            A curated selection of high-quality annexes and rooms based on
            tenant feedback and property standards.
          </p>
        </div>
        <Button
          variant="ghost"
          asChild
          className="font-bold text-rose-500 hover:bg-rose-500/5 group"
        >
          <Link href="/search" className="flex items-center">
            Explore All{" "}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {isHandpickedListingsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[420px] rounded-[2rem] bg-muted/50 border border-border animate-pulse"
            />
          ))}
        </div>
      ) : (
        <ListingCarousel listings={handpickedListings} accentColor="rose" />
      )}
    </section>
  );
}
