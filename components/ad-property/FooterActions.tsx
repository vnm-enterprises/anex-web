"use client";

import { ArrowRight } from "lucide-react";

/**
 * Mobile-only footer with navigation buttons.
 */
export default function FooterActions({
  onPrev,
  onNext,
  canGoBack,
  canGoNext,
}: {
  onPrev: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
}) {
  return (
    <div className="flex justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoBack}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 disabled:opacity-50"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        className="px-6 py-2 bg-primary text-background-dark rounded-lg font-medium flex items-center gap-1"
      >
        {canGoNext ? "Next" : "Publish Listing"}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}