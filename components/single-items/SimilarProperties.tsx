"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import SimilarPropertyCard from "./SimilarPropertyCard";
import api from "@/lib/api";
import Link from "next/link";

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

        //TODO change to not
        const filtered = all.filter(
          (p) => p.id === currentPropertyId
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
    <section className="mt-20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Similar properties you may like
        </h3>

        <Link
          href="/rentals"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <SimilarPropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            location={property.location}
            price={property.price}
            beds={property.bedrooms}       // ✅ FIXED
            baths={property.bathrooms}     // ✅ FIXED
            area={property.sizeSqft}       // ✅ FIXED
            image={property.propertyImages?.[0] || "/placeholder.jpg"}
          />
        ))}
      </div>
    </section>
  );
}
