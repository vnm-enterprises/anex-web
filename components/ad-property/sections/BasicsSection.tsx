/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Home, BedDouble, Building2 } from "lucide-react";

/**
 * Basics section: title, property type, bedrooms, bathrooms.
 */
export default function BasicsSection({
  data,
  onChange,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: {
   data:any
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">The Basics</h2>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Property Title
        </label>
        <input
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Spacious Annex in Nugegoda with AC"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
          Property Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Annex", value: "annex", icon: Building2 },
            { label: "Room", value: "room", icon: BedDouble },
            { label: "Full House", value: "house", icon: Home },
          ].map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange("propertyType", value)}
              className={`p-4 rounded-xl border transition-all
                ${data.propertyType === value
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
            >
              <Icon className="mx-auto mb-1" size={20} />
              <p className="text-sm font-medium">{label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Bedrooms", value: data.bedrooms, field: "bedrooms" },
          { label: "Bathrooms", value: data.bathrooms, field: "bathrooms" },
        ].map(({ label, value, field }) => (
          <div key={label}>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => onChange(field, Math.max(1, value - 1))}
                className="px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg"
              >
                −
              </button>
              <span className="w-10 text-center font-medium">{value}</span>
              <button
                type="button"
                onClick={() => onChange(field, value + 1)}
                className="px-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg"
              >
                +
              </button>
            </div>
          </div>
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