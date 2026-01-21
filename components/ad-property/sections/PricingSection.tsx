/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CreditCard } from "lucide-react";

/**
 * Pricing section: monthly rent and advance payment.
 */
export default function PricingSection({
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
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Pricing</h2>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Monthly Rent (LKR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">LKR</span>
            <input
              type="number"
              value={data.price}
              onChange={(e) => onChange("price", Number(e.target.value))}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="45000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Key Money / Advance (months)
          </label>
          <input
            type="number"
            min="0"
            max="24"
            value={data.advanceMonths}
            onChange={(e) => onChange("advanceMonths", Number(e.target.value))}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="6"
          />
        </div>
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