// components/filters/FiltersSidebar.tsx
"use client";

import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";

type Filters = {
  city: string;
  minPrice?: number;
  maxPrice?: number;
  type: string;
  gender: string;
  amenities: string[];
};

type Props = {
  currentFilters: Filters;
  onUpdateFilters: (filters: Partial<Filters>) => void;
};

export default function FiltersSidebar({ currentFilters, onUpdateFilters }: Props) {
  const [localFilters, setLocalFilters] = useState<Filters>({
    city: currentFilters.city || "",
    minPrice: currentFilters.minPrice,
    maxPrice: currentFilters.maxPrice,
    type: currentFilters.type || "",
    gender: currentFilters.gender || "ANY",
    amenities: currentFilters.amenities || [],
  });

  // Sync local state with URL changes
  useEffect(() => {
    const fn = async () => {
      setLocalFilters({
      city: currentFilters.city || "",
      minPrice: currentFilters.minPrice,
      maxPrice: currentFilters.maxPrice,
      type: currentFilters.type || "",
      gender: currentFilters.gender || "ANY",
      amenities: currentFilters.amenities || [],
    });
    }

    fn()
  }, [currentFilters]);

  const toggleAmenity = (amenity: string) => {
    setLocalFilters((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleApply = () => {
    onUpdateFilters(localFilters);
  };

  const handleReset = () => {
    const reset: Filters = {
      city: "",
      minPrice: undefined,
      maxPrice: undefined,
      type: "",
      gender: "ANY",
      amenities: [],
    };
    setLocalFilters(reset);
    onUpdateFilters(reset);
  };

  const propertyTypes = ["ANNEX", "ROOM", "HOUSE", "APARTMENT"];
  const amenitiesList = ["Private Bathroom", "Air Conditioning", "WiFi", "Parking"];

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

      <div className="sticky top-24 rounded-xl border border-border-color bg-surface-light p-5 shadow-sm dark:border-white/10 dark:bg-surface-dark">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-main dark:text-white">Filters</h3>
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-primary hover:text-primary-dark"
          >
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
              value={localFilters.city}
              onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
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
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                LKR
              </span>
              <input
                type="number"
                value={localFilters.minPrice || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
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
                value={localFilters.maxPrice || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
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
            {propertyTypes.map((type) => (
              <label key={type} className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={localFilters.type === type}
                  onChange={() =>
                    setLocalFilters({
                      ...localFilters,
                      type: localFilters.type === type ? "" : type,
                    })
                  }
                  className="h-4 w-4 rounded border-border-color bg-transparent text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-main transition-colors group-hover:text-primary dark:text-white">
                  {type.charAt(0) + type.slice(1).toLowerCase()}
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
            {["MALE", "FEMALE", "ANY"].map((g) => (
              <button
                key={g}
                onClick={() => setLocalFilters({ ...localFilters, gender: g })}
                className={`flex-1 rounded py-1.5 text-xs font-medium transition ${
                  localFilters.gender === g
                    ? "bg-white text-primary shadow-sm dark:bg-surface-dark"
                    : "text-text-secondary hover:text-text-main dark:hover:text-white"
                }`}
              >
                {g.charAt(0) + g.slice(1).toLowerCase()}
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
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={localFilters.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="h-4 w-4 rounded border-border-color bg-transparent text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-main dark:text-white">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleApply}
          className="mt-6 w-full rounded-lg bg-primary py-2 text-sm font-bold text-background-dark hover:bg-primary-dark"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}