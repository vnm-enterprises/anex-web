"use client";

import { Edit, Trash2, Home, Eye, RotateCcw } from "lucide-react";
import { Listing } from "./ListingsSection";

/**
 * A visually refined card component for displaying property listings.
 *
 * Supports both list and grid layouts with responsive styling.
 * Uses consistent Lucide icons and clear visual hierarchy.
 * Status indicators and actions are context-aware (e.g., "occupied" vs "active").
 */
export default function ListingCard({
  listing,
  view,
}: {
  listing: Listing;
  view: "list" | "grid";
}) {
  const isOccupied = listing.status === "occupied";
  const statusConfig = {
    active: { label: "Available", color: "bg-emerald-100 text-emerald-800" },
    reviewing: { label: "Under Review", color: "bg-amber-100 text-amber-800" },
    occupied: { label: "Occupied", color: "bg-gray-100 text-gray-600" },
  };

  const status = statusConfig[listing.status] || statusConfig.reviewing;

  return (
    <div
      className={`bg-white dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-700
        shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
        ${view === "list" ? "flex flex-col sm:flex-row gap-5 p-5" : "p-4"}`}
    >
      {/* Image */}
      <div
        className={`relative rounded-lg overflow-hidden shrink-0
          ${view === "list" ? "sm:w-64 h-40" : "w-full h-48 mb-4"}`}
        style={{
          backgroundImage: `url(${listing.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold capitalize
            ${status.color}`}
        >
          {status.label}
        </span>

        {/* Occupied overlay */}
        {isOccupied && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Occupied</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-3">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3
              className={`font-bold text-base md:text-lg line-clamp-1 ${
                isOccupied
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {listing.title}, {listing.location}
            </h3>

            {/* Views */}
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              <Eye size={14} />
              {listing.views.toLocaleString()}
            </div>
          </div>

          <p className="font-bold text-lg text-primary mb-1">
            LKR {listing.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mo</span>
          </p>

          <p
            className={`text-sm line-clamp-2 ${
              isOccupied ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {listing.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
          {!isOccupied ? (
            <>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800
                  hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200
                  transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20
                  hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-medium text-red-600 dark:text-red-400
                  transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-700
                  hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/30
                  text-sm font-medium transition-colors"
              >
                <Home size={16} />
                Mark Occupied
              </button>
            </>
          ) : (
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700
                hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30
                text-sm font-medium transition-colors"
            >
              <RotateCcw size={16} />
              Republish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}