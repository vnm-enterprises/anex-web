/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Trash2, Home, RotateCcw, Link as LinkIcon, Eye } from "lucide-react";
import { Listing } from "./ListingsSection";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";

export default function ListingCard({
  listing,
  view,
}: {
  listing: Listing;
  view: "list" | "grid";
}) {
  const router = useRouter();
  const [showCopied, setShowCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const isOccupied = listing.status === "occupied";

  const statusConfig = {
    active: {
      label: "Available",
      className: "bg-emerald-100 text-emerald-800",
    },
    reviewing: {
      label: "Under Review",
      className: "bg-amber-100 text-amber-800",
    },
    occupied: {
      label: "Occupied",
      className: "bg-gray-100 text-gray-700",
    },
  };

  const status = statusConfig[listing.status] ?? statusConfig.reviewing;

  const coverImage =
    typeof listing.propertyImages === "string"
      ? listing.propertyImages
      : listing.propertyImages?.[0];

  const listingUrl = `${window.location.origin}/rentals/${listing.id}`;

  /* -------------------------------------------------------------------------- */
  /*                                ACTIONS                                     */
  /* -------------------------------------------------------------------------- */

  const copyUrl = async () => {
    await navigator.clipboard.writeText(listingUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const viewListing = () => {
    router.push(`/rentals/${listing.id}`);
  };

  // ✅ CORRECTED: Uses PATCH /properties/:id with { status } in body
  const updateStatus = async (status: "active" | "occupied") => {
    try {
      setLoading(true);
      await api.patch(`/properties/${listing.id}`, { status });
      router.refresh();
    } catch (err: any) {
      console.error("Failed to update status", err);
      const message =
        err.response?.data?.error || "Something went wrong. Try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteListing = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this listing? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await api.delete(`/properties/${listing.id}`);
      router.refresh();
    } catch (err: any) {
      console.error("Delete failed", err);
      const message = err.response?.data?.error || "Failed to delete listing.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  UI                                        */
  /* -------------------------------------------------------------------------- */

  return (
    <div
      className={`
        relative
        bg-white dark:bg-surface-dark
        rounded-2xl border border-gray-200 dark:border-gray-700
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5
        overflow-hidden
        ${view === "list" ? "flex gap-5 p-5" : "p-4"}
        shadow-sm
      `}
    >
      {/* Copied Toast */}
      {showCopied && (
        <div className="absolute top-4 right-4 z-50 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          URL copied to clipboard
        </div>
      )}

      {/* Image */}
      <div
        className={`
          relative rounded-xl overflow-hidden shrink-0
          ${view === "list" ? "w-64 h-40" : "w-full h-48 mb-4"}
          transition-transform duration-300 hover:scale-[1.02]
        `}
      >
        <img
          src={coverImage}
          alt={listing.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isOccupied ? "grayscale opacity-90" : "opacity-100"
          }`}
        />

        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${status.className} backdrop-blur-sm`}
        >
          {status.label}
        </span>

        {isOccupied && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold tracking-wide text-lg drop-shadow">
              OCCUPIED
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {listing.location}
          </p>
          <p className="mt-2 font-bold text-primary text-xl">
            LKR {listing.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
              / mo
            </span>
          </p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {listing.description}
        </p>

        {/* Actions */}
        <div className="mt-auto pt-2 flex flex-wrap gap-2">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            <LinkIcon size={14} />
            Copy URL
          </button>

          <button
            onClick={viewListing}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Eye size={14} />
            View
          </button>

          {!isOccupied ? (
            <>
              <button
                disabled={loading}
                onClick={() => updateStatus("occupied")}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50 transition-colors"
              >
                <Home size={14} />
                Mark Occupied
              </button>

              <button
                disabled={loading}
                onClick={deleteListing}
                className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </>
          ) : (
            <button
              disabled={loading}
              onClick={() => updateStatus("active")}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <RotateCcw size={14} />
              Republish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}