// components/single-items/Gallery.tsx
"use client";

import { ChevronRight, Grid, MapPin } from "lucide-react";
import { useState } from "react";
import GalleryModal from "./GalleryModal";
import Link from "next/link";

interface GalleryProps {
  propertyImages: string[];
  surroundingImages?: string[];
}

export default function Gallery({
  propertyImages,
  surroundingImages = [],
}: GalleryProps) {
  const [open, setOpen] = useState(false);

  const allImages = [...propertyImages, ...surroundingImages];

  const heroImage = propertyImages[0] || "/placeholder.jpg";

  // Take next 3 images (prefer property images first)
  const gridImages = allImages.slice(1, 4);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white font-medium">
            Property
          </span>
        </nav>
      </div>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:h-[480px] rounded-2xl overflow-hidden relative group">
          {/* Hero Image */}
          <div className="md:col-span-2 md:row-span-2 h-64 md:h-full relative overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Right Grid Images */}
          {gridImages.map((url, i) => (
            <GalleryImage key={i} url={url} />
          ))}

          {/* Show All Button */}
          <div className="hidden md:block h-full relative overflow-hidden">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              <MapPin size={28} />
            </div>

            <button
              onClick={() => setOpen(true)}
              className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-white transition flex items-center gap-2"
            >
              <Grid size={16} />
              Show all photos
            </button>
          </div>
        </div>
      </section>

      {open && (
        <GalleryModal
          propertyImages={propertyImages}
          surroundingImages={surroundingImages}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function GalleryImage({ url }: { url: string }) {
  if (!url) return null;

  return (
    <div className="hidden md:block h-full relative overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url('${url}')` }}
      />
    </div>
  );
}
