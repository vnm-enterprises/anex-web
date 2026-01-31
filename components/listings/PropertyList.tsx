import { Property } from "@/types/Property";
import Link from "next/link";
import { Bed, Bath, MapPin } from "lucide-react";

export default function PropertyList({ listings }: { listings: Property[] }) {
  return (
    <div className="space-y-4">
      {listings.map((p) => (
        <div
          key={p.id}
          className="flex gap-4 rounded-xl border p-4 hover:shadow"
        >
          <img
            src={p.propertyImages[0]}
            className="w-48 h-32 object-cover rounded-lg"
          />

          <div className="flex-1">
            <Link href={`/rentals/${p.id}`}>
              <h3 className="font-bold text-lg">{p.title}</h3>
            </Link>

            <p className="text-sm flex items-center gap-1 text-gray-500">
              <MapPin size={14} /> {p.location}
            </p>

            <div className="flex gap-4 text-sm mt-2">
              <span><Bed size={14} /> {p.bedrooms}</span>
              <span><Bath size={14} /> {p.bathrooms}</span>
            </div>

            <p className="mt-2 font-bold text-primary">
              LKR {p.price.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
