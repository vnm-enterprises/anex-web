"use client";

import { Check } from "lucide-react";

/**
 * Responsive progress indicator for multi-step form.
 */
const STEP_LABELS = ["Basics", "Location", "Details", "Photos", "Pricing"];

export default function ProgressSteps({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="relative flex justify-between items-center">
        <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div
          className="absolute left-0 top-1/2 h-1 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(current / (total - 1)) * 100}%` }}
        />

        {STEP_LABELS.slice(0, total).map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-2 z-10">
            <div
              className={`size-8 rounded-full flex items-center justify-center font-bold text-sm
                ${
                  i <= current
                    ? "bg-primary text-background-dark"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400"
                }`}
            >
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}