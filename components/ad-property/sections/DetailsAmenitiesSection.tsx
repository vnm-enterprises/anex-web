/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CheckCircle, Wifi, Snowflake, Car, Bath, CookingPot, Bed, ShowerHead } from "lucide-react";

/**
 * Amenities and description section.
 */
const AMENITIES = [
  { name: "Air Conditioning", icon: Snowflake },
  { name: "Private Entrance", icon: DoorClosed },
  { name: "Parking", icon: Car },
  { name: "Attached Bathroom", icon: Bath },
  { name: "Kitchen", icon: CookingPot },
  { name: "Furnished", icon: Bed },
  { name: "Hot Water", icon: ShowerHead },
  { name: "WiFi", icon: Wifi },
];

function DoorClosed({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
      <path d="M12 12h.01" />
      <path d="M2 20h20" />
    </svg>
  );
}

export default function DetailsAmenitiesSection({
  data,
  onChange,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: {
   data:any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}) {
  const toggleAmenity = (name: string) => {
    const newAmenities = data.amenities.includes(name)
      ? data.amenities.filter((a: string) => a !== name)
      : [...data.amenities, name];
    onChange("amenities", newAmenities);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Details & Amenities</h2>

      <textarea
        value={data.description}
        onChange={(e) => onChange("description", e.target.value)}
        rows={5}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        placeholder="Describe your place... Mention nearby landmarks, transport, and what makes it special."
      />

      <div className="flex flex-wrap gap-3">
        {AMENITIES.map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => toggleAmenity(name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors
              ${data.amenities.includes(name)
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
          >
            <Icon size={16} />
            {name}
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Back
          </button>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary/90"
        >
          {isLastStep ? "Publish Listing" : "Next"}
        </button>
      </div>
    </div>
  );
}