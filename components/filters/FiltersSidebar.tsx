"use client";

import {
  MapPin,
} from "lucide-react";

export default function FiltersSidebar() {
  return (
    <aside className="w-full h-full shrink-0 space-y-8 lg:w-1/4 lg:min-w-[280px]">
      {/* Mobile Breadcrumbs */}
      <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
        <a className="text-sm font-medium text-text-secondary hover:text-primary">
          Home
        </a>
        <span className="text-sm text-text-secondary">/</span>
        <span className="text-sm font-medium text-text-main dark:text-white">
          Rentals
        </span>
      </div>

      {/* Filters Card */}
      <div className="sticky top-24 rounded-xl border border-border-color bg-surface-light p-5 shadow-sm dark:border-white/10 dark:bg-surface-dark">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-main dark:text-white">
            Filters
          </h3>
          <button className="text-xs font-semibold text-primary hover:text-primary-dark">
            Reset All
          </button>
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-text-main dark:text-white">
            Location
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              defaultValue="Nugegoda"
              placeholder="City or Suburb"
              className="w-full rounded-lg border border-border-color bg-background-light py-2.5 pl-10 pr-4 text-sm text-text-main placeholder:text-text-secondary focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-background-dark dark:text-white"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-text-main dark:text-white">
            Price Range (LKR)
          </label>

          {/* Slider */}
          <div className="relative mb-6 mt-2 h-1 rounded-full bg-border-color dark:bg-white/10">
            <div className="absolute inset-y-0 left-[10%] right-[30%] rounded-full bg-primary" />
            <div className="absolute left-[10%] top-1/2 size-4 -translate-y-1/2 cursor-pointer rounded-full border-2 border-primary bg-white shadow-sm transition-transform hover:scale-110" />
            <div className="absolute right-[30%] top-1/2 size-4 -translate-y-1/2 cursor-pointer rounded-full border-2 border-primary bg-white shadow-sm transition-transform hover:scale-110" />
          </div>

          {/* Min / Max */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                LKR
              </span>
              <input
                type="number"
                defaultValue={15000}
                className="w-full rounded-lg border border-border-color bg-transparent py-1.5 pl-9 pr-2 text-sm text-text-main focus:border-primary focus:ring-primary dark:border-white/10 dark:text-white"
              />
            </div>

            <span className="text-text-secondary">-</span>

            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                LKR
              </span>
              <input
                type="number"
                defaultValue={85000}
                className="w-full rounded-lg border border-border-color bg-transparent py-1.5 pl-9 pr-2 text-sm text-text-main focus:border-primary focus:ring-primary dark:border-white/10 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-text-main dark:text-white">
            Property Type
          </label>
          <div className="space-y-2.5">
            {["Annex", "Room", "House", "Apartment"].map((type, i) => (
              <label
                key={type}
                className="group flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  defaultChecked={i < 2}
                  className="h-4 w-4 rounded border-border-color bg-transparent text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-main transition-colors group-hover:text-primary dark:text-white">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-text-main dark:text-white">
            Gender Allowed
          </label>
          <div className="flex rounded-lg border border-border-color bg-background-light p-1 dark:border-white/10 dark:bg-background-dark">
            {["Male", "Female", "Any"].map((g, i) => (
              <button
                key={g}
                className={`flex-1 rounded py-1.5 text-xs font-medium transition ${
                  i === 1
                    ? "bg-white text-primary shadow-sm dark:bg-surface-dark"
                    : "text-text-secondary hover:text-text-main dark:hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="mb-3 block text-sm font-medium text-text-main dark:text-white">
            Amenities
          </label>
          <div className="grid gap-2.5">
            {[
              "Private Bathroom",
              "Air Conditioning",
              "WiFi",
              "Parking",
            ].map((amenity, i) => (
              <label
                key={amenity}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  defaultChecked={amenity === "WiFi"}
                  className="h-4 w-4 rounded border-border-color bg-transparent text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-main dark:text-white">
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
