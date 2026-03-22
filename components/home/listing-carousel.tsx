"use client";

import { Listing } from "@/lib/types";
import { ListingCard } from "@/components/listing-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";

interface ListingCarouselProps {
  listings: Listing[];
  accentColor?: "primary" | "rose";
}

export function ListingCarousel({
  listings,
  accentColor = "primary",
}: ListingCarouselProps) {
  const hoverClass =
    accentColor === "rose" ? "hover:bg-primary" : "hover:bg-primary";

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 1000,
          stopOnInteraction: true,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-10">
        {listings.map((listing) => (
          <CarouselItem
            key={listing.id}
            className="pl-10 md:basis-1/2 lg:basis-1/3"
          >
            <ListingCard listing={listing} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:flex justify-end gap-3 mt-8">
        <CarouselPrevious
          className={`static translate-y-0 h-14 w-14 rounded-2xl border-border bg-card soft-shadow hover:text-white transition-all ${hoverClass}`}
        />
        <CarouselNext
          className={`static translate-y-0 h-14 w-14 rounded-2xl border-border bg-card soft-shadow hover:text-white transition-all ${hoverClass}`}
        />
      </div>
    </Carousel>
  );
}
