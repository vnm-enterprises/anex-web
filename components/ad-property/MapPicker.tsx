"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";

export default function MapPicker() {
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );

  return (
    <div className="relative h-64 rounded-lg overflow-hidden border bg-gray-100 dark:bg-gray-800">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpuStS3sB0aAbMMc-Rv1EdUnjuOx2FiN-kFulZS4LN0vSElaPfM92yYTKXjTHsmTqB3U55V0zARYROJhCSjFXtO69z7RqDCIyg9SZi_wUWCq0h7ILh5wUn-lnOCl3kZGi1IbtlQ2HaKiSo5O_ZokzSCN8PftjSq2kPXYZlni-TgtOOyL2LNYKcHjQsJjwlX8DRY8BkJS_0LCZIIG0sChgjnbOlfXNK2h3suhxuXerqgRWi6BKFNfnI6A4Zt6Jjb8rZmNM88wXuj1k"
        className="w-full h-full object-cover opacity-70"
        alt="Map"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={() => setLatLng({ lat: 6.9271, lng: 79.8612 })}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full shadow font-semibold"
        >
          <MapPin size={16} />
          Set Pin on Map
        </button>
      </div>

      {latLng && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded">
          Lat: {latLng.lat}, Lng: {latLng.lng}
        </div>
      )}
    </div>
  );
}
