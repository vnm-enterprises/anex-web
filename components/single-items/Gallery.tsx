"use client";

import { ChevronRight, Grid, MapPin } from "lucide-react";
import { useState } from "react";
import GalleryModal from "./GalleryModal";
import Link from "next/link";

interface GalleryProps {
  propertyImages: string[];
  surroundingImages?: string[];
  breadcumbtitle: string;
}

export default function Gallery({
  propertyImages,
  surroundingImages = [],
  breadcumbtitle,
}: GalleryProps) {
  const [open, setOpen] = useState(false);

  const allImages = [...propertyImages, ...surroundingImages];

  const MIN_SLOTS = 5;
  const placeholder = "/placeholder.jpg";
  const displayImages = [...allImages];

  while (displayImages.length < MIN_SLOTS) {
    displayImages.push(placeholder);
  }

  const heroImage = displayImages[0];
  const gridImages = displayImages.slice(1, 4);

  return (
    <>
      {/* Breadcrumbs */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-0 pt-8 pb-4">
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white font-medium">
            Property
          </span>
          <ChevronRight size={14} />
          <span className="text-gray-900 dark:text-white font-medium">
            {breadcumbtitle}
          </span>
        </nav>
      </div>

      {/* Image Gallery */}
      <section className="w-full mx-auto px-4 sm:px-6 lg:px-0 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:h-120 rounded-md overflow-hidden relative group">
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
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${displayImages[4]}')` }}
            />

            <div className="absolute inset-0 bg-black/40" />

            <button
              onClick={() => setOpen(true)}
              className="absolute inset-0 flex items-center justify-center text-white font-medium backdrop-blur-sm"
            >
              <div className="bg-white/90 text-black px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                <Grid size={16} />
                Show all photos
              </div>
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
