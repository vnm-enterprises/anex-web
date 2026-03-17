"use client";

import Link from "next/link";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";

import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/types";

interface SearchResultsProps {
  loading: boolean;
  listings: Listing[];
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
  onClearFilters: () => void;
}

export function SearchResults({
  loading,
  listings,
  page,
  totalPages,
  onPageChange,
  onClearFilters,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center gap-4 bg-muted/20 rounded-[3rem] border border-dashed border-border">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-bold tracking-tight">Updating results...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border bg-muted/10 text-center px-10">
        <div className="p-8 rounded-full bg-muted shadow-inner mb-8">
          <Search className="h-16 w-16 text-muted-foreground/30" />
        </div>
        <h3 className="text-3xl font-black text-foreground tracking-tight">No properties found</h3>
        <p className="mt-2 text-muted-foreground font-medium max-w-sm text-lg">
          We couldn't find any listings matching your search. Try broadening your criteria or resetting filters.
        </p>
        <Button asChild onClick={onClearFilters} className="mt-10 rounded-2xl h-14 px-10 font-black shadow-xl">
          <Link href="/search">Clear All Filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-10">
          <Button
            variant="outline"
            className="h-12 w-12 rounded-2xl border-border hover:bg-primary hover:text-white transition-all shadow-sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous Page"
          >
            <SlidersHorizontal className="h-5 w-5 rotate-90" />
          </Button>

          <div className="flex items-center gap-2 bg-muted/50 px-6 py-2 rounded-2xl border border-border/50">
            <span className="text-sm font-black text-foreground">Page</span>
            <span className="h-8 w-8 flex items-center justify-center bg-primary text-white rounded-lg text-sm font-black shadow-lg shadow-primary/20">
              {page}
            </span>
            <span className="text-sm font-black text-muted-foreground">of {totalPages}</span>
          </div>

          <Button
            variant="outline"
            className="h-12 w-12 rounded-2xl border-border hover:bg-primary hover:text-white transition-all shadow-sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next Page"
          >
            <SlidersHorizontal className="h-5 w-5 -rotate-90" />
          </Button>
        </div>
      )}
    </div>
  );
}
