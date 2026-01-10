"use client";

import { CheckCircle } from "lucide-react";

const AMENITIES = [
  "Air Conditioning",
  "Private Entrance",
  "Parking",
  "Attached Bathroom",
  "Kitchen",
  "Furnished",
  "Hot Water",
];

export default function DetailsAmenitiesSection() {
  return (
    <section className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-2xl border">
      <h2 className="text-xl font-bold mb-6">Details & Amenities</h2>

      <textarea
        rows={5}
        className="w-full px-4 py-3 rounded-lg border resize-none mb-6"
        placeholder="Describe your place..."
      />

      <div className="flex flex-wrap gap-3">
        {AMENITIES.map((a) => (
          <label key={a} className="cursor-pointer">
            <input type="checkbox" className="hidden peer" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border peer-checked:border-primary peer-checked:text-primary">
              <CheckCircle size={14} />
              {a}
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
