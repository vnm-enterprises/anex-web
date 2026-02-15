"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Bolt,
  Star,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Square,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { Listing } from "@/lib/types";

export function FeaturedListings() {
  const [boosted, setBoosted] = useState<Listing[]>([]);
  const [featured, setFeatured] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Duplicate slides for infinite effect
  const infiniteSlides = [...featured, ...featured, ...featured];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex >= featured.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(featured.length);
      }, 500);
    } else {
      setIsTransitioning(true);
    }
  }, [currentIndex, featured.length]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      let { data } = await supabase
        .from("listings")
        .select(`*, districts(*), cities(*), listing_images(*)`)
        .eq("status", "approved")
        .order("is_featured", { ascending: false })
        .order("is_boosted", { ascending: false })
        .order("created_at", { ascending: false });

      //Temp
      data = [
        {
          id: "1",
          user_id: "u1",
          title: "Luxury 2BR Apartment with Sea View",
          description: "Modern furnished apartment in Colombo 03.",
          slug: "luxury-2br-colombo",
          property_type: "apartment",
          price: 180000,
          district_id: "colombo",
          city_id: "colombo-03",
          area: "Colombo 03",
          latitude: null,
          longitude: null,
          furnished: "furnished",
          gender_preference: "any",
          contact_name: "John",
          contact_phone: "0771234567",
          contact_email: null,
          status: "approved",
          is_boosted: true,
          boost_expires_at: null,
          boost_weight: 10,
          is_featured: true,
          featured_expires_at: null,
          featured_weight: 10,
          views_count: 120,
          inquiries_count: 12,
          expires_at: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          districts: { id: "1", name: "Colombo", slug: "colombo" },
          cities: {
            id: "1",
            district_id: "1",
            name: "Colombo 03",
            slug: "colombo-03",
          },
          listing_images: [
            {
              id: "img1",
              listing_id: "1",
              url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
              storage_path: "",
              display_order: 0,
            },
          ],
        },
        {
          id: "2",
          user_id: "u2",
          title: "Modern Studio Annex",
          description: "Affordable studio annex in Nugegoda.",
          slug: "studio-annex-nugegoda",
          property_type: "annex",
          price: 45000,
          district_id: "colombo",
          city_id: "nugegoda",
          area: "Nugegoda",
          latitude: null,
          longitude: null,
          furnished: "semi-furnished",
          gender_preference: "any",
          contact_name: "Sarah",
          contact_phone: "0779876543",
          contact_email: null,
          status: "approved",
          is_boosted: true,
          boost_expires_at: null,
          boost_weight: 8,
          is_featured: false,
          featured_expires_at: null,
          featured_weight: 0,
          views_count: 50,
          inquiries_count: 4,
          expires_at: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          districts: { id: "1", name: "Colombo", slug: "colombo" },
          cities: {
            id: "2",
            district_id: "1",
            name: "Nugegoda",
            slug: "nugegoda",
          },
          listing_images: [
            {
              id: "img2",
              listing_id: "2",
              url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2070",
              storage_path: "",
              display_order: 0,
            },
          ],
        },
        {
          id: "3",
          user_id: "u3",
          title: "Cozy 3BR House with Garden",
          description: "Family-friendly house in Kandy.",
          slug: "cozy-3br-kandy",
          property_type: "house",
          price: 85000,
          district_id: "kandy",
          city_id: "kandy",
          area: "Kandy",
          latitude: null,
          longitude: null,
          furnished: "unfurnished",
          gender_preference: "any",
          contact_name: "Amal",
          contact_phone: "0714567890",
          contact_email: null,
          status: "approved",
          is_boosted: false,
          boost_expires_at: null,
          boost_weight: 0,
          is_featured: true,
          featured_expires_at: null,
          featured_weight: 7,
          views_count: 30,
          inquiries_count: 2,
          expires_at: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          districts: { id: "2", name: "Kandy", slug: "kandy" },
          cities: { id: "3", district_id: "2", name: "Kandy", slug: "kandy" },
          listing_images: [
            {
              id: "img3",
              listing_id: "3",
              url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070",
              storage_path: "",
              display_order: 0,
            },
          ],
        },
        {
          id: "4",
          user_id: "u4",
          title: "Luxury Villa with Pool",
          description: "High-end villa in Thalawathugoda.",
          slug: "luxury-villa-pool",
          property_type: "house",
          price: 250000,
          district_id: "colombo",
          city_id: "thalawathugoda",
          area: "Thalawathugoda",
          latitude: null,
          longitude: null,
          furnished: "furnished",
          gender_preference: "any",
          contact_name: "Nimal",
          contact_phone: "0751112233",
          contact_email: null,
          status: "approved",
          is_boosted: true,
          boost_expires_at: null,
          boost_weight: 9,
          is_featured: true,
          featured_expires_at: null,
          featured_weight: 9,
          views_count: 200,
          inquiries_count: 15,
          expires_at: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          districts: { id: "1", name: "Colombo", slug: "colombo" },
          cities: {
            id: "4",
            district_id: "1",
            name: "Thalawathugoda",
            slug: "thalawathugoda",
          },
          listing_images: [
            {
              id: "img4",
              listing_id: "4",
              url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070",
              storage_path: "",
              display_order: 0,
            },
          ],
        },
      ];

      if (data) {
        const boostedItems = data
          .filter((l) => l.is_boosted || l.is_featured)
          .slice(0, 6);

        const featuredItems = data.slice(0, 6);

        setBoosted(boostedItems);
        setFeatured(featuredItems);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) return null;

  if (boosted.length === 0) return null;

  return (
    <>
      {/* ================= BOOSTED ================= */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <span className="bg-gradient-to-r from-emerald-500 to-green-400 p-3 rounded-lg text-black shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Premium & Boosted
              </h2>
              <p className="text-sm text-slate-500">
                Verified owners with high response rates
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boosted.map((listing) => (
              <Link
                key={listing.id}
                href={`/listing/${listing.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  {/* Badge */}
                  {listing.is_boosted && (
                    <div className="absolute top-3 left-3 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 uppercase">
                      <Bolt className="h-3 w-3" />
                      Boosted
                    </div>
                  )}

                  {listing.is_featured && !listing.is_boosted && (
                    <div className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 uppercase">
                      <Star className="h-3 w-3" />
                      Featured
                    </div>
                  )}

                  <div className="absolute top-3 right-3 z-10 bg-white/90 p-1.5 rounded-full shadow-sm hover:scale-110 transition">
                    <Heart className="h-4 w-4 text-slate-400 hover:text-red-500" />
                  </div>

                  <img
                    src={
                      listing.listing_images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    alt={listing.title}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900 line-clamp-1">
                    {listing.title}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {listing.cities?.name}
                  </p>

                  <div className="flex gap-3 my-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                      <BedDouble className="h-3 w-3" />2
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                      <Bath className="h-3 w-3" />1
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                      <Square className="h-3 w-3" />
                      900
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <span className="text-primary font-bold text-lg">
                        Rs {listing.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400">/mo</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CAROUSEL ================= */}
      <section className="pb-10 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Handpicked for You
              </h2>
              <p className="text-sm text-slate-500">
                Recently added listings in your area
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              ref={carouselRef}
              className={`flex gap-6 ${
                isTransitioning
                  ? "transition-transform duration-500 ease-in-out"
                  : ""
              }`}
              style={{
                transform: `translateX(-${currentIndex * 340}px)`,
              }}
            >
              {infiniteSlides.map((listing, index) => (
                <Link
                  key={index}
                  href={`/listing/${listing.slug}`}
                  className="min-w-[320px] bg-white rounded-xl overflow-hidden border hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={
                        listing.listing_images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
                      }
                      className="w-full h-full object-cover hover:scale-105 transition duration-700"
                      alt={listing.title}
                    />
                  </div>

                  <div className="p-4">
                    <div className="text-xl font-bold text-slate-900">
                      Rs {listing.price.toLocaleString()}
                      <span className="text-xs text-slate-400">/mo</span>
                    </div>
                    <h4 className="text-slate-700 font-medium mt-1 truncate">
                      {listing.title}
                    </h4>
                    <p className="text-slate-500 text-sm mt-1">
                      {listing.cities?.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
