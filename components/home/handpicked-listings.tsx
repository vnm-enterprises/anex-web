import { createStaticClient } from "@/lib/supabase/server";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListingCarousel } from "./listing-carousel";
import { unstable_cache } from "next/cache";

const getHandpickedListings = unstable_cache(
  async () => {
    const supabase = await createStaticClient();
    const { data } = await supabase
      .from("listings")
      .select(
        `*, districts(name), cities(name), listing_images(url), listing_amenities(amenities(name))`,
      )
      .eq("status", "approved")
      .eq("is_featured", false) // Handpicked are different from featured
      .order("created_at", { ascending: false })
      .limit(8);
    return data;
  },
  ["handpicked-listings-cache"],
  { revalidate: 3600, tags: ["listings"] },
);

export async function HandpickedListings() {
  const listings = await getHandpickedListings();

  if (!listings || listings.length === 0) return null;

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

      <ListingCarousel listings={listings} accentColor="rose" />
    </section>
  );
}
