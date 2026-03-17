import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Eye,
  Bolt,
  Zap,
  Sparkles,
  ArrowUpRight,
  Users,
  Armchair,
  CreditCard,
} from "lucide-react";
import { formatPrice } from "@/lib/constants";
import type { Listing } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  const mainImage = listing.listing_images?.[0]?.url;
  const isPriority = listing.is_boosted || listing.is_featured;

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-[2.25rem] border border-border/50 bg-card transition-all duration-700 soft-shadow hover:shadow-2xl hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={isPriority}
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/30">
            <Sparkles className="h-10 w-10 text-muted-foreground/20" />
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {listing.is_boosted && (
            <Badge className="bg-primary text-white border-none font-black uppercase tracking-widest text-[10px] px-3 py-1 shadow-lg backdrop-blur-sm">
              <Zap className="h-3 w-3 mr-1 fill-current" />
              Priority Choice
            </Badge>
          )}
          {listing.is_featured && (
            <Badge className="bg-amber-500 text-white border-none font-black uppercase tracking-widest text-[9px] px-3 py-1.5 shadow-xl backdrop-blur-md">
              <Sparkles className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          {listing.status === "pending_payment" && (
            <Badge className="bg-amber-500 text-white border-none font-black uppercase tracking-widest text-[9px] px-3 py-1.5 shadow-xl backdrop-blur-md">
              <CreditCard className="h-3 w-3 mr-1 fill-current" />
              Pending Payment
            </Badge>
          )}
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-1">
              Monthly Rent
            </span>
            <span className="text-3xl font-black tracking-tighter">
              {formatPrice(listing.price)}
              <span className="text-sm font-medium text-white/60 ml-1.5 italic">
                /mo
              </span>
            </span>
          </div>
          <Link
            href={`/listings/${listing.slug}`}
            className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all hover:bg-white hover:text-primary hover:scale-110 shadow-lg"
          >
            <ArrowUpRight className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">
            <MapPin className="h-3 w-3" />
            {listing.cities?.name ?? listing.custom_city}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60">
            <Eye className="h-4 w-4" />
            {listing.views_count.toLocaleString()}
          </div>
        </div>

        <h3 className="mb-3 line-clamp-1 text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
          <Link href={`/listings/${listing.slug}`}>{listing.title}</Link>
        </h3>

        <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed mb-6">
          {listing.description}
        </p>

        {/* Amenities Preview */}
        {listing.listing_amenities && listing.listing_amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {listing.listing_amenities.slice(0, 3).map((item, i) => (
              <span
                key={i}
                className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground uppercase tracking-wider"
              >
                {item.amenities?.name}
              </span>
            ))}
            {listing.listing_amenities.length > 3 && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-primary/5 text-primary uppercase tracking-wider">
                +{listing.listing_amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50 mt-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary/60">
              <Armchair className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                Furnishing
              </span>
              <span className="text-xs font-bold text-foreground capitalize truncate">
                {listing.furnished.replace("-", " ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary/60">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                Preference
              </span>
              <span className="text-xs font-bold text-foreground capitalize truncate">
                {listing.gender_preference}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Background Effect */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.02] transition-colors pointer-events-none" />
    </div>
  );
}
