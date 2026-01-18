/* eslint-disable @typescript-eslint/no-explicit-any */
// components/listings/PropertyGrid.tsx
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ listings }: { listings: any[] }) {
  if (listings.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((item) => (
        <PropertyCard
          key={item.id}
          id={item.id}
          title={item.title}
          location={item.city}
          price={`LKR ${item.price.toLocaleString()}`}
          badge={item.verified ? "VERIFIED" : item.isNew ? "NEW" : ""}
          image={item.image}
        />
      ))}
    </div>
  );
}