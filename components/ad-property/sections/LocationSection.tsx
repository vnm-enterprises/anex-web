/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MapPicker from "../MapPicker";

/**
 * Location section: city/town selector and map pin.
 */
export default function LocationSection({
  data,
  onChange,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: {
   data: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Location</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={data.location.split(",")[0] || ""}
          onChange={(e) => onChange("location", `${e.target.value}, Sri Lanka`)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Select District</option>
          <option>Colombo</option>
          <option>Gampaha</option>
          <option>Kandy</option>
          <option>Galle</option>
          <option>Matara</option>
        </select>
        <input
          value={data.location}
          onChange={(e) => onChange("location", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="City / Town"
        />
      </div>

      <MapPicker
        value={data.latLng}
        onChange={(latLng) => onChange("latLng", latLng)}
      />

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