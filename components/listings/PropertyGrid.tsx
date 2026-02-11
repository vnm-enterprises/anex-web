import { Property } from "@/types/Property";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ listings }: { listings: Property[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {listings.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
