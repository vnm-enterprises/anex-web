// components/single-items/GalleryModal.tsx
"use client";

import { X, Home, MapPin } from "lucide-react";

interface GalleryModalProps {
  propertyImages: string[];
  surroundingImages: string[];
  onClose: () => void;
}

export default function GalleryModal({
  propertyImages,
  surroundingImages,
  onClose,
}: GalleryModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-white text-lg font-semibold">
              Photo Gallery
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80"
              aria-label="Close gallery"
            >
              <X size={24} />
            </button>
          </div>

          {/* PROPERTY IMAGES */}
          {propertyImages.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4 text-white">
                <Home size={18} />
                <h3 className="text-base font-semibold">
                  Property Photos
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {propertyImages.map((img, i) => (
                  <img
                    key={`property-${i}`}
                    src={img}
                    alt={`Property photo ${i + 1}`}
                    className="w-full h-64 object-cover rounded-xl hover:opacity-90 transition"
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          )}

          {/* SURROUNDING IMAGES */}
          {surroundingImages.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4 text-white">
                <MapPin size={18} />
                <h3 className="text-base font-semibold">
                  Surroundings
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {surroundingImages.map((img, i) => (
                  <img
                    key={`surrounding-${i}`}
                    src={img}
                    alt={`Surrounding photo ${i + 1}`}
                    className="w-full h-64 object-cover rounded-xl hover:opacity-90 transition"
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
