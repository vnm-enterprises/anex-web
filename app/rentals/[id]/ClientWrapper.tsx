/* eslint-disable @typescript-eslint/no-explicit-any */
// app/rentals/[slug]/ClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import client components
const Gallery = dynamic(() => import("@/components/single-items/Gallery"), {
  ssr: false,
});
const PropertyHeader = dynamic(
  () => import("@/components/single-items/PropertyHeader"),
  { ssr: false },
);
const PropertyDetails = dynamic(
  () => import("@/components/single-items/PropertyDetails"),
  { ssr: false },
);
const Amenities = dynamic(() => import("@/components/single-items/Amenities"), {
  ssr: false,
});
const LocationMap = dynamic(
  () => import("@/components/single-items/LocationMap"),
  { ssr: false },
);
const Reviews = dynamic(() => import("@/components/single-items/Reviews"), {
  ssr: false,
});
const PricingCard = dynamic(
  () => import("@/components/single-items/PricingCard"),
  { ssr: false },
);
const OwnerCard = dynamic(() => import("@/components/single-items/OwnerCard"), {
  ssr: false,
});

// 🔴 Named export fix
const SimilarProperties = dynamic(
  () =>
    import("@/components/single-items/SimilarProperties").then(
      (mod) => mod.SimilarProperties,
    ),
  { ssr: false },
);

interface ClientWrapperProps {
  property: any;
}

export default function ClientWrapper({ property }: ClientWrapperProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 py-10">
      <Gallery
        propertyImages={property.propertyImages}
        surroundingImages={property.surroundingImages}
      />

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-16">
        {/* LEFT */}
        <div className="flex-1">
          <PropertyHeader
            title={property.title}
            location={property.location}
            isActive={property.isActive}
            isVerified={property.isVerified}
          />

          <PropertyDetails
            beds={property.bedrooms}
            baths={property.bathrooms}
            area={property.sizeSqft}
            description={property.description}
          />
          <Amenities amenities={property.amenities} />
          <LocationMap
            latitude={property.latitude}
            longitude={property.longitude}
            locationLabel={property.location}
          />

          <Reviews propertyId={property.id} />
        </div>

        {/* RIGHT */}
        <div className="lg:w-[380px] flex-shrink-0 space-y-6">
          <PricingCard
            price={property.price}
            isActive={property.isActive}
            keymoney={property.keymoney}
            landlordPhone={property.landlord?.phone}
          />

          <OwnerCard
            ownerName={property.landlord.name}
            ownerAvatar={property.landlord.avatar}
            ownerJoinedAt={property.landlord.createdAt}
          />
        </div>
      </div>

      <SimilarProperties currentPropertyId={property.id} />
    </div>
  );
}
