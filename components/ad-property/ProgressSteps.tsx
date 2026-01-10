"use client";

import { Check } from "lucide-react";

const STEPS = ["Basics", "Location", "Details", "Photos", "Review"];

export default function ProgressSteps({ current = 2 }: { current?: number }) {
  return (
    <div className="mb-12">
      <div className="relative flex justify-between items-center">
        <div className="absolute inset-x-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div
          className="absolute left-0 top-1/2 h-1 bg-primary rounded-full transition-all"
          style={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-2 z-10">
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
            <span className="hidden sm:block text-xs font-semibold">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
