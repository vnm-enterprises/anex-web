"use client";

import { ArrowRight, Eye } from "lucide-react";

export default function FooterActions() {
  return (
    <div className="sticky bottom-4 bg-white/90 dark:bg-[#162e22]/90 backdrop-blur p-4 rounded-xl border shadow-lg flex flex-col sm:flex-row gap-4 justify-between">
      <p className="text-sm text-slate-500">
        By publishing, you agree to our{" "}
        <span className="text-primary">Terms of Service</span>.
      </p>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">
          <Eye size={16} /> Preview
        </button>
        <button className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold bg-primary text-background-dark">
          Publish Listing <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
