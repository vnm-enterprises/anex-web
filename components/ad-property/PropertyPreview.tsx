/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * Live preview of the property listing as the user fills the form.
 */
export default function PropertyPreview({ data }: any) {
  return (
    <div className="space-y-4">
      {/* Image */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        {data.propertyImages[0] ? (
          <img
            src={data.propertyImages[0]}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image uploaded
          </div>
        )}
      </div>

      {/* Title & Price */}
      <div>
        <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
          {data.title || "Your property title"}
        </h4>
        <p className="text-primary font-bold">
          LKR {data.price ? data.price.toLocaleString() : "0"}/mo
        </p>
      </div>

      {/* Location */}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {data.location || "Colombo, Sri Lanka"}
      </p>

      {/* Amenities */}
      {data.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.amenities.slice(0, 3).map((a: string) => (
            <span
              key={a}
              className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
        {data.description ||
          "Describe your place... Mention nearby landmarks, transport, and what makes it special."}
      </p>
    </div>
  );
}

import { Eye } from "lucide-react";