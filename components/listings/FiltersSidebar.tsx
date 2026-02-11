"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface Props {
  currentFilters: Record<string, any>;
  onUpdateFilters: (filters: Record<string, any>) => void;
}

/* -------------------------------------------------------------------------- */
/*                               CONSTANTS                                    */
/* -------------------------------------------------------------------------- */

const PROPERTY_TYPES = [
  { label: "All types", value: "" },
  { label: "Apartment", value: "APARTMENT" },
  { label: "Annex", value: "ANNEX" },
  { label: "Room / Boarding", value: "ROOM" },
];

const PREDEFINED_AMENITIES = [
  { id: "wifi", name: "Wi-Fi" },
  { id: "ac", name: "Air Conditioning" },
  { id: "parking", name: "Parking" },
  { id: "kitchen", name: "Kitchen" },
  { id: "furnished", name: "Furnished" },
  { id: "hot_water", name: "Hot Water" },
  { id: "private_entrance", name: "Private Entrance" },
  { id: "attached_bathroom", name: "Attached Bathroom" },
];

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function FiltersSidebar({
  currentFilters,
  onUpdateFilters,
}: Props) {
  const [filters, setFilters] = useState(() => ({
    query: currentFilters.query || "",
    minPrice: currentFilters.minPrice || "",
    maxPrice: currentFilters.maxPrice || "",
    propertyType: currentFilters.propertyType || "",
    amenities: currentFilters.amenities
      ? currentFilters.amenities.split(",")
      : [],
  }));

  /* ------------------------------------------------------------------------ */
  /*                                 HELPERS                                  */
  /* ------------------------------------------------------------------------ */

  const toggleAmenity = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a: any) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  const applyFilters = () => {
    const payload: Record<string, any> = {};

    if (filters.query) payload.query = filters.query;
    if (filters.minPrice) payload.minPrice = filters.minPrice;
    if (filters.maxPrice) payload.maxPrice = filters.maxPrice;
    if (filters.propertyType) payload.propertyType = filters.propertyType;
    if (filters.amenities.length)
      payload.amenities = filters.amenities.join(",");

    onUpdateFilters(payload);
  };

  const resetFilters = () => {
    setFilters({
      query: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      amenities: [],
    });
    onUpdateFilters({});
  };

  /* ------------------------------------------------------------------------ */
  /*                                   UI                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <aside className="rounded-2xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <SlidersHorizontal size={18} />
        <h2 className="text-lg font-bold">Filters</h2>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="text-sm font-medium text-gray-600">
          Location or title
        </label>
        <div className="relative mt-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={filters.query}
            onChange={(e) =>
              setFilters({ ...filters, query: e.target.value })
            }
            placeholder="e.g. Nugegoda, Annex"
            className="w-full rounded-xl border pl-9 pr-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Price */}
      <div className="mb-5">
        <label className="text-sm font-medium text-gray-600">
          Monthly rent (LKR)
        </label>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: e.target.value })
            }
            className="rounded-xl border p-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            className="rounded-xl border p-2 text-sm"
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600">
          Property type
        </label>
        <select
          value={filters.propertyType}
          onChange={(e) =>
            setFilters({ ...filters, propertyType: e.target.value })
          }
          className="mt-1 w-full rounded-xl border p-2 text-sm"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities */}
      {/* <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-gray-600">
          Amenities
        </p>

        <div className="grid grid-cols-2 gap-2">
          {PREDEFINED_AMENITIES.map((a) => {
            const active = filters.amenities.includes(a.id);

            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAmenity(a.id)}
                className={`rounded-xl border px-3 py-2 text-sm text-left
                  ${
                    active
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-gray-200"
                  }
                `}
              >
                {a.name}
              </button>
            );
          })}
        </div>
      </div> */}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={applyFilters}
          className="flex-1 rounded-xl bg-primary py-2 text-sm font-bold text-black"
        >
          Apply filters
        </button>

        <button
          onClick={resetFilters}
          className="flex-1 rounded-xl border py-2 text-sm"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
