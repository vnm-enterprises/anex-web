/* eslint-disable @typescript-eslint/no-explicit-any */
// components/single-items/LocationMap.tsx
"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";

interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  locationLabel: string; // e.g. "Nugegoda, Colombo"
}

export default function LocationMap({
  latitude,
  longitude,
  locationLabel,
}: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    let map: any;

    const initMap = async () => {
      const L = await import("leaflet");

      // Fix marker icons (Next.js issue)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(mapRef.current!).setView([latitude, longitude], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([latitude, longitude]).addTo(map);
    };

    initMap();

    return () => {
      if (map) map.remove();
    };
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <section className="mb-10">
        <h3 className="text-xl font-bold mb-4">Location</h3>
        <p className="text-sm text-gray-500">
          Exact location will be shared after contacting the owner.
        </p>
      </section>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold mb-4">Location</h3>

      <div className="relative h-[360px] rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div ref={mapRef} className="w-full h-full" />

        {/* Overlay Button */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => window.open(googleMapsUrl, "_blank")}
            className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-md
                       flex items-center gap-2 text-sm font-medium
                       hover:scale-105 transition"
          >
            <ExternalLink size={16} />
            Open in Google Maps
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <MapPin size={14} />
        {locationLabel}
      </p>
    </section>
  );
}
