"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Sparkles,
  Zap,
  Eye,
  Home,
  BedDouble,
  Warehouse,
  Building2,
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/constants"
import type { Listing } from "@/lib/types"

const propertyIcons: Record<string, React.ElementType> = {
  annex: Home,
  boarding: BedDouble,
  house: Warehouse,
  apartment: Building2,
}

export function ListingCard({ listing }: { listing: Listing }) {
  const PropertyIcon = propertyIcons[listing.property_type] || Home
  const mainImage = listing.listing_images?.[0]?.url

  return (
    <Link href={`/listings/${listing.slug}`}>
      <Card className="group h-full overflow-hidden border-border transition-all hover:border-primary/30 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {mainImage ? (
            <img
              src={mainImage}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <PropertyIcon className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {listing.is_featured && (
              <Badge className="bg-accent text-accent-foreground text-xs font-semibold shadow-sm">
                <Sparkles className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
            {listing.is_boosted && (
              <Badge className="bg-primary text-primary-foreground text-xs font-semibold shadow-sm">
                <Zap className="mr-1 h-3 w-3" />
                Boosted
              </Badge>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <Badge
              variant="secondary"
              className="bg-card/90 text-foreground backdrop-blur text-xs capitalize shadow-sm"
            >
              <PropertyIcon className="mr-1 h-3 w-3" />
              {listing.property_type}
            </Badge>
          </div>
        </div>

        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-base font-semibold text-foreground group-hover:text-primary">
              {listing.title}
            </h3>
          </div>

          <p className="text-xl font-bold text-primary">
            {formatPrice(listing.price)}
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {listing.cities?.name}
              {listing.districts ? `, ${listing.districts.name}` : ""}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs capitalize">
                {listing.furnished.replace("-", " ")}
              </Badge>
              {listing.gender_preference !== "any" && (
                <Badge variant="outline" className="text-xs capitalize">
                  {listing.gender_preference}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {listing.views_count}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {formatDate(listing.created_at)}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
