"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import SimilarPropertyCard from "./SimilarPropertyCard";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SimilarProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  propertyImages: string[];
}

export function SimilarProperties({
  currentPropertyId,
}: {
  currentPropertyId: string;
}) {
  const [properties, setProperties] = useState<SimilarProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await api.get("/properties?limit=6&page=1");
        const all: SimilarProperty[] = res.data.properties;

        const filtered = all.filter(
          (p) => p.id !== currentPropertyId
        );

        setProperties(filtered.slice(0, 3) || []);
      } catch (err) {
        console.error("Failed to load similar properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [currentPropertyId]);

  if (loading || properties.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white my-4">
          Similar properties you may like
        </h3>

        <Link
          href="/rentals"
          className="text-sm flex gap-3 font-medium text-black hover:underline border border-slate-300 px-6 py-2 rounded-md"
        >
          View all
          <ArrowRight size={18} className='text-black' />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {properties.map((property) => (
          <SimilarPropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            location={property.location}
            price={property.price}
            beds={property.bedrooms}
            baths={property.bathrooms}
            area={property.sizeSqft}
            image={property.propertyImages?.[0] || "/placeholder.jpg"}
          />
        ))}
      </div>
    </section>
  );
}
