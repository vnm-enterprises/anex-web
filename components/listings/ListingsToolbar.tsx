"use client";

import { Grid, List, Map } from "lucide-react";
import { ListingView } from "@/types/view";

type Props = {
  view: ListingView;
  onViewChange: (view: ListingView) => void;
};

export default function ListingToolbar({ view, onViewChange }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border-color bg-surface-light p-3 shadow-sm dark:border-white/10 dark:bg-surface-dark sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <h1 className="px-2 text-base font-semibold text-text-main dark:text-white">
        124 Properties found{" "}
        <span className="font-normal text-text-secondary">in Nugegoda</span>
      </h1>

      {/* Right */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Sort */}
        <select className="rounded-lg border border-border-color bg-background-light py-1.5 pl-3 pr-8 text-sm focus:border-primary focus:ring-primary dark:border-white/10 dark:bg-background-dark">
          <option>Newest First</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>

        <div className="mx-1 h-6 w-px bg-border-color dark:bg-white/10" />

        {/* View Switch */}
        <div
          role="tablist"
          aria-label="Listing view"
          className="flex gap-1 rounded-lg border border-border-color bg-background-light p-1 dark:border-white/10 dark:bg-background-dark"
        >
          <ViewButton
            active={view === "grid"}
            onClick={() => onViewChange("grid")}
            label="Grid view"
          >
            <Grid size={18} />
          </ViewButton>

          <ViewButton
            active={view === "list"}
            onClick={() => onViewChange("list")}
            label="List view"
          >
            <List size={18} />
          </ViewButton>

          <ViewButton
            active={view === "map"}
            onClick={() => onViewChange("map")}
            label="Map view"
          >
            <Map size={18} />
          </ViewButton>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- */
/* View Button (Internal)        */
/* ----------------------------- */

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className={[
        "rounded p-1.5 transition",
        active
          ? "bg-white text-primary shadow-sm dark:bg-surface-dark"
          : "text-text-secondary hover:text-text-main dark:hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
