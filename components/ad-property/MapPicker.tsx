"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

/**
 * Interactive map picker component.
 */
export default function MapPicker({
  value,
  onChange,
}: {
  value: { lat: number; lng: number } | null;
  onChange: (latLng: { lat: number; lng: number } | null) => void;
}) {
  return (
    <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpuStS3sB0aAbMMc-Rv1EdUnjuOx2FiN-kFulZS4LN0vSElaPfM92yYTKXjTHsmTqB3U55V0zARYROJhCSjFXtO69z7RqDCIyg9SZi_wUWCq0h7ILh5wUn-lnOCl3kZGi1IbtlQ2HaKiSo5O_ZokzSCN8PftjSq2kPXYZlni-TgtOOyL2LNYKcHjQsJjwlX8DRY8BkJS_0LCZIIG0sChgjnbOlfXNK2h3suhxuXerqgRWi6BKFNfnI6A4Zt6Jjb8rZmNM88wXuj1k"
        className="w-full h-full object-cover opacity-70"
        alt="Map preview"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={() => onChange({ lat: 6.9271, lng: 79.8612 })}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow-md font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <MapPin size={16} />
          Set Pin on Map
        </button>
      </div>

      {value && (
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg">
          Lat: {value.lat.toFixed(4)}, Lng: {value.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}