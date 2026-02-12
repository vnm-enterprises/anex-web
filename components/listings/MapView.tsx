/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/Property";

export default function MapView({ listings }: { listings: Property[] }) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const router = useRouter();

  const validListings = listings.filter(
    (p) => p.latitude !== null && p.longitude !== null
  );

  useEffect(() => {
    if (!mapRef.current || validListings.length === 0) return;

    const initMap = async () => {
      const L = await import("leaflet");

      // Prevent re-init
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const center = [
        validListings[0].latitude!,
        validListings[0].longitude!,
      ];

      mapInstance.current = L.map(mapRef.current as any).setView(center as any, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapInstance.current);

      // Add markers
      validListings.forEach((property) => {
        const marker = L.marker([
          property.latitude!,
          property.longitude!,
        ]).addTo(mapInstance.current);

        marker.bindPopup(`
          <div style="font-size:14px">
            <strong>${property.title}</strong><br/>
            LKR ${property.price.toLocaleString()} /mo
          </div>
        `);

        marker.on("click", () => {
          router.push(`/rentals/${property.id}`);
        });
      });
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [listings]);

  if (validListings.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No map data available.
      </p>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-[520px] rounded-xl overflow-hidden"
    />
  );
}
