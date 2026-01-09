"use client";

import { MapPin } from "lucide-react";

export default function MapView() {
  return (
    <section className="relative h-[520px] w-full overflow-hidden rounded-xl border border-border-color bg-surface-light shadow-sm dark:border-white/10 dark:bg-surface-dark">
      {/* Placeholder */}
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <MapPin size={32} />
        </div>

        <h3 className="text-lg font-bold text-text-main dark:text-white">
          Map View
        </h3>

        <p className="max-w-xs text-sm text-text-secondary">
          Interactive map view will be available soon.
          This will allow browsing listings by location.
        </p>
      </div>

      {/* Future Map Overlay */}
      {/*
        Integrate Mapbox / Google Maps here:
        - Load markers
        - Sync with filters
        - Hover → highlight card
      */}
    </section>
  );
}
