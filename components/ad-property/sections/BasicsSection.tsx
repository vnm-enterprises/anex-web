"use client";

import { Home, BedDouble, Building2 } from "lucide-react";
import { useState } from "react";

export default function BasicsSection() {
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(1);

  return (
    <section className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-2xl border">
      <h2 className="text-xl font-bold mb-6">The Basics</h2>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Property Title
        </label>
        <input
          className="w-full px-4 py-3 rounded-lg border bg-background-light dark:bg-background-dark"
          placeholder="Spacious Annex in Nugegoda with AC"
        />
      </div>

      {/* Property Type */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Annex", icon: Building2 },
          { label: "Room", icon: BedDouble },
          { label: "Full House", icon: Home },
        ].map(({ label, icon: Icon }) => (
          <label key={label} className="cursor-pointer">
            <input type="radio" name="type" className="hidden peer" />
            <div className="p-4 rounded-xl border peer-checked:border-primary transition">
              <Icon className="mb-2" size={20} />
              <p className="font-bold">{label}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Bedrooms", value: beds, set: setBeds },
          { label: "Bathrooms", value: baths, set: setBaths },
        ].map(({ label, value, set }) => (
          <div key={label}>
            <label className="block text-sm font-medium mb-2">
              {label}
            </label>
            <div className="flex items-center border rounded-lg w-fit">
              <button onClick={() => set(Math.max(0, value - 1))} className="px-4">
                −
              </button>
              <span className="w-10 text-center">{value}</span>
              <button onClick={() => set(value + 1)} className="px-4">
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
