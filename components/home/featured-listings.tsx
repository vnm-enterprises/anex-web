"use client";

import { Sparkles, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListingCarousel } from "./listing-carousel";
import { useHomeHook } from "@/hooks/use-home-hook";

export function FeaturedListings() {
  const { featuredListings, isFeaturedListingsLoading } = useHomeHook();

  if (!isFeaturedListingsLoading && featuredListings.length === 0) return null;

  return (
    <section className="animate-fade-in [animation-delay:600ms]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" />
            Top Listings
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Top picks <span className="text-primary italic">right now</span>
          </h2>
        </div>
        <Button
          variant="ghost"
          asChild
          className="group font-black text-primary uppercase tracking-widest hover:bg-primary/5"
        >
          <Link href="/search?sort=featured">
            Explore All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {isFeaturedListingsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[420px] rounded-[2rem] bg-muted/50 border border-border animate-pulse"
            />
          ))}
        </div>
      ) : (
        <ListingCarousel listings={featuredListings} accentColor="primary" />
      )}

      {/* Modern Empty State within section if no boosted listings (though we return null above) */}
      {!isFeaturedListingsLoading && featuredListings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 border border-dashed border-border rounded-[3rem]">
          <div className="h-20 w-20 rounded-[2rem] bg-muted flex items-center justify-center text-muted-foreground/30 mb-6">
            <Home size={40} />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-foreground">
            No featured listings today
          </h3>
          <p className="mt-2 text-muted-foreground font-medium">
            Check back later or explore all available rentals.
          </p>
          <Button asChild className="mt-8 rounded-2xl px-8" size="lg">
            <Link href="/search">Browse All Listings</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
