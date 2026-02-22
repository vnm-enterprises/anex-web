"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight, Home, ChevronLeft, ChevronRight } from "lucide-react"
import type { Listing } from "@/lib/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      let { data } = await supabase
        .from("listings")
        .select("*, districts(name), cities(name), listing_images(url), listing_amenities(amenities(name))")
        .eq("status", "approved")
        .eq("is_boosted", true)
        .order("created_at", { ascending: false })
        .limit(6)

      if (!data || data.length === 0) {
        // Fallback to featured or just latest approved for demo
        const { data: fallbackData } = await supabase
          .from("listings")
          .select("*, districts(name), cities(name), listing_images(url), listing_amenities(amenities(name))")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(6)
        data = fallbackData
      }

      if (data) setListings(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (listings.length === 0) return null

  return (
    <section className="animate-fade-in [animation-delay:600ms]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" />
            Spotlight Listings
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Handpicked for <span className="text-primary italic">You</span>
          </h2>
        </div>
        <Button variant="ghost" asChild className="group font-black text-primary uppercase tracking-widest hover:bg-primary/5">
          <Link href="/search?sort=featured">
            Explore All
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-10">
          {listings.map((listing) => (
            <CarouselItem key={listing.id} className="pl-10 md:basis-1/2 lg:basis-1/3">
              <ListingCard listing={listing} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:flex justify-end gap-3 mt-8">
           <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl border-border bg-card soft-shadow hover:bg-primary hover:text-white transition-all" />
           <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl border-border bg-card soft-shadow hover:bg-primary hover:text-white transition-all" />
        </div>
      </Carousel>

      {/* Modern Empty State within section if no boosted listings (though we return null above) */}
      {listings.length === 0 && (
         <div className="flex flex-col items-center justify-center py-24 bg-muted/20 border border-dashed border-border rounded-[3rem]">
            <div className="h-20 w-20 rounded-[2rem] bg-muted flex items-center justify-center text-muted-foreground/30 mb-6">
               <Home size={40} />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-foreground">No featured listings today</h3>
            <p className="mt-2 text-muted-foreground font-medium">Check back later or explore all available rentals.</p>
            <Button asChild className="mt-8 rounded-2xl px-8" size="lg">
               <Link href="/search">Browse All Listings</Link>
            </Button>
         </div>
      )}
    </section>
  )
}
