/* eslint-disable @typescript-eslint/no-explicit-any */
// components/listings/MapView.tsx
"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

// Feature Flag: Show placeholder or integrate map later
const USE_MAP_VIEW = false;

export default function MapView({ listings }: { listings: any[] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay or wait for real map init
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="relative h-[520px] w-full overflow-hidden rounded-xl border border-border-color bg-surface-light shadow-sm dark:border-white/10 dark:bg-surface-dark">
        <div className="flex h-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (USE_MAP_VIEW) {
    // TODO: Integrate Google Maps / Mapbox here
    return (
      <section className="relative h-[520px] w-full overflow-hidden rounded-xl border border-border-color bg-surface-light shadow-sm dark:border-white/10 dark:bg-surface-dark">
        <div className="flex h-full items-center justify-center">
          <p className="text-text-secondary">Map view under development.</p>
        </div>
      </section>
    );
  }

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
    </section>
  );
}