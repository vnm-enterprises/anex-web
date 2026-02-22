"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import type { Listing } from "@/lib/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function HandpickedListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadListings() {
      const supabase = createClient()
      const { data } = await supabase
        .from("listings")
        .select(`*, districts(name), cities(name), listing_images(url), listing_amenities(amenities(name))`)
        .eq("status", "approved")
        .eq("is_featured", false) // Handpicked are different from featured
        .order("created_at", { ascending: false })
        .limit(8)

      if (data) setListings(data as any)
      setLoading(false)
    }
    loadListings()
  }, [])

  if (loading || listings.length === 0) return null

  return (
    <section className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
            <Heart className="h-3 w-3 fill-current" />
            Handpicked for You
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
            Our <span className="text-rose-500 italic">Favorite Picks</span>
          </h2>
          <p className="text-muted-foreground font-medium max-w-xl">
            A curated selection of high-quality annexes and rooms based on tenant feedback and property standards.
          </p>
        </div>
        <Button variant="ghost" asChild className="font-bold text-rose-500 hover:bg-rose-500/5 group">
          <Link href="/search" className="flex items-center">
            Explore All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
           <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl border-border bg-card soft-shadow hover:bg-rose-500 hover:text-white transition-all" />
           <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl border-border bg-card soft-shadow hover:bg-rose-500 hover:text-white transition-all" />
        </div>
      </Carousel>
    </section>
  )
}
