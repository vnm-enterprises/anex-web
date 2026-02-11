import { Bed, Bath, MapPin, Wifi, Star } from "lucide-react";
import Link from "next/link";
import { Property } from "@/types/Property";

const CARD_AMENITIES = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "ac", label: "AC", icon: Star },
  { id: "parking", label: "Parking", icon: Star },
];

export default function PropertyCard({ property }: { property: Property }) {
  const image = property.propertyImages?.[0] || "/placeholder.jpg";

  const badge =
    property.isFeatured
      ? "FEATURED"
      : property.isBoosted
      ? "BOOSTED"
      : property.isVerified
      ? "VERIFIED"
      : null;

  const amenityIds = property.amenities.map((a) => a.name);

  const visibleAmenities = CARD_AMENITIES.filter((a) =>
    amenityIds.includes(a.id)
  );

  const extraCount =
    property.amenities.length - visibleAmenities.length;

  return (
    <Link href={`/rentals/${property.id}`}>
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition dark:bg-surface-dark">
      {/* Image */}
      <div className="relative h-48">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {badge && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
          <h3 className="font-bold text-lg leading-snug hover:text-primary transition">
            {property.title}
          </h3>

        <p className="mt-1 text-sm flex items-center gap-1 text-gray-500">
          <MapPin size={14} />
          {property.location}
        </p>

        {/* Beds / Baths */}
        <div className="mt-3 flex gap-4 text-sm text-gray-700">
          <span className="flex items-center gap-1">
            <Bed size={14} /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={14} /> {property.bathrooms}
          </span>
        </div>

        {/* Amenities */}
        {visibleAmenities.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600">
            {visibleAmenities.map((a) => {
              const Icon = a.icon;
              return (
                <span key={a.id} className="flex items-center gap-1">
                  <Icon size={14} /> {a.label}
                </span>
              );
            })}

            {extraCount > 0 && (
              <span className="text-gray-400">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-4 text-lg font-bold text-primary">
          LKR {property.price.toLocaleString()}
        </div>
      </div>
    </div>
    </Link>
  );
}
