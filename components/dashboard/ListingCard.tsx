"use client";

import { Delete, Edit, RefreshCcw } from "lucide-react";
import { Listing } from "./ListingsSection";

export default function ListingCard({
  listing,
  view,
}: {
  listing: Listing;
  view: "list" | "grid";
}) {
  const isOccupied = listing.status === "occupied";

  return (
    <div
      className={`bg-surface-light dark:bg-surface-dark
      rounded-2xl border border-gray-100 dark:border-gray-800
      shadow-sm hover:shadow-md transition-all
      ${view === "list" ? "flex flex-col sm:flex-row gap-5 p-4" : "p-4"}`}
    >
      {/* Image */}
      <div
        className={`relative rounded-xl overflow-hidden shrink-0
        ${view === "list" ? "sm:w-64 aspect-video" : "aspect-video mb-4"}
        ${isOccupied ? "grayscale opacity-80" : ""}`}
        style={{
          backgroundImage: `url(${listing.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Status badge */}
        <span
          className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide
          ${
            listing.status === "active"
              ? "bg-green-500 text-white"
              : listing.status === "reviewing"
              ? "bg-yellow-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {listing.status}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-3">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3
              className={`font-bold text-lg ${
                isOccupied
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {listing.title}, {listing.location}
            </h3>

            {/* Views */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="material-symbols-outlined text-[16px]">
                visibility
              </span>
              {listing.views.toLocaleString()}
            </div>
          </div>

          <p
            className={`font-bold mb-1 ${
              isOccupied ? "text-gray-400" : "text-primary"
            }`}
          >
            LKR {listing.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-500">/mo</span>
          </p>

          <p
            className={`text-sm line-clamp-2 ${
              isOccupied ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {listing.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50 dark:border-gray-800 mt-auto">
          {!isOccupied && (
            <>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px]">
                  <Edit />
                </span>
                Edit
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px]">
                  <Delete />
                </span>
                Delete
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                Mark as Occupied
              </button>
            </>
          )}

          {isOccupied && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">
                <RefreshCcw />
              </span>
              Republish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
