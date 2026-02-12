"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { Property } from "@/types/Property";

/* -------------------------------------------------------------------------- */
/*                                DUMMY DATA                                  */
/* -------------------------------------------------------------------------- */

const DUMMY_FEATURED: Property[] = [
  {
    id: "dummy-1",
    title: "Modern Annex in Nugegoda",
    description: "",
    location: "Nugegoda, Colombo",
    latitude: null,
    longitude: null,
    price: 35000,
    keymoney: 0,
    propertyType: "ANNEX",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 550,
    propertyImages: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    ],
    surroundingImages: [],
    amenities: [{ id: "wifi", name: "wifi" }],
    isVerified: true,
    isBoosted: false,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    landlord: { name: "Verified Owner", avatar: null },
  },
  {
    id: "dummy-2",
    title: "Luxury Apartment – Colombo 05",
    description: "",
    location: "Colombo 05",
    latitude: null,
    longitude: null,
    price: 85000,
    keymoney: 0,
    propertyType: "APARTMENT",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqft: 1100,
    propertyImages: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
    surroundingImages: [],
    amenities: [{ id: "wifi", name: "wifi" }],
    isVerified: true,
    isBoosted: true,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    landlord: { name: "Premium Host", avatar: null },
  },
  {
    id: "dummy-3",
    title: "Cozy Room near University",
    description: "",
    location: "Maharagama",
    latitude: null,
    longitude: null,
    price: 18000,
    keymoney: 0,
    propertyType: "ROOM",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 320,
    propertyImages: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    ],
    surroundingImages: [],
    amenities: [{ id: "wifi", name: "wifi" }],
    isVerified: true,
    isBoosted: false,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    landlord: { name: "Trusted Host", avatar: null },
  },
  {
    id: "dummy-4",
    title: "Fully Furnished House",
    description: "",
    location: "Battaramulla",
    latitude: null,
    longitude: null,
    price: 65000,
    keymoney: 0,
    propertyType: "ANNEX",
    bedrooms: 3,
    bathrooms: 2,
    sizeSqft: 1400,
    propertyImages: [
      "https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12",
    ],
    surroundingImages: [],
    amenities: [{ id: "wifi", name: "wifi" }],
    isVerified: true,
    isBoosted: true,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    landlord: { name: "Super Host", avatar: null },
  },
  {
    id: "dummy-5",
    title: "Studio Apartment – Rajagiriya",
    description: "",
    location: "Rajagiriya",
    latitude: null,
    longitude: null,
    price: 42000,
    keymoney: 0,
    propertyType: "APARTMENT",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqft: 600,
    propertyImages: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    ],
    surroundingImages: [],
    amenities: [{ id: "wifi", name: "wifi" }],
    isVerified: true,
    isBoosted: false,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    landlord: { name: "City Host", avatar: null },
  },
];

/* -------------------------------------------------------------------------- */
/*                               COMPONENT                                    */
/* -------------------------------------------------------------------------- */

export default function AdsCarousel() {
  const [ads, setAds] = useState<Property[]>([]);
  const [index, setIndex] = useState(0);

  /* ------------------------------ LOAD DATA ------------------------------ */

  useEffect(() => {
    const loadAds = async () => {
      try {
        const res = await api.get("/properties", { params: { limit: 5 } });

        const properties: Property[] = Array.isArray(res.data)
          ? res.data
          : res.data?.properties ?? [];

        const featured = properties.filter((p) => p.isFeatured);

        setAds(featured.length > 0 ? featured : DUMMY_FEATURED);
      } catch (err) {
        console.error("AdsCarousel → fallback to dummy", err);
        setAds(DUMMY_FEATURED);
      }
    };

    loadAds();
  }, []);

  /* --------------------------- AUTO SLIDE --------------------------- */

  useEffect(() => {
    if (ads.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [ads]);

  if (ads.length === 0) return null;

  /* ------------------------------- UI ------------------------------- */

  return (
    <section className="mb-8 min-h-[600px]">
      <div className="relative overflow-hidden rounded-none shadow-lg">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out min-h-[600px]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {ads.map((p) => (
            <div key={p.id} className="relative min-w-full h-64 md:h-[600px]">
              <img
                src={p.propertyImages?.[0] || "/placeholder.jpg"}
                alt={p.title}
                className="w-full h-full min-h-[600px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center px-8">
                <span className="mb-2 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">
                  Featured
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-bold">
                  {p.title}
                </h3>
                <p className="text-white/80">{p.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={() =>
            setIndex((prev) => (prev - 1 + ads.length) % ads.length)
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-black/60"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => setIndex((prev) => (prev + 1) % ads.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-black/60"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index ? "bg-primary" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
