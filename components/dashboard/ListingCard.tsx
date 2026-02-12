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
      "Are you sure you want to delete this listing? This action cannot be undone.",
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
    group relative overflow-hidden
    rounded-md bg-white dark:bg-[#1a2c24]
    border border-border-color dark:border-white/10
    shadow-sm transition-all duration-300
    hover:-translate-y-1 hover:shadow-xl
    ${view === "list" ? "flex gap-5 p-5" : "flex flex-col"}
  `}
>

      {/* Copied Toast */}
      {showCopied && (
        <div className="absolute top-4 right-4 z-50 bg-black/80 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          URL copied to clipboard
        </div>
      )}

      {/* Image Section */}
     <div
  className={`
    relative overflow-hidden rounded-md shrink-0
    ${
      view === "list"
        ? "w-64 h-40"
        : "aspect-[4/3]"
    }
  `}
>

        <img
          src={coverImage}
          alt={listing.title}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isOccupied ? "grayscale opacity-90" : ""
          }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-bold ${status.className}`}
        >
          {status.label}
        </span>

        {isOccupied && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wide">
              OCCUPIED
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
<div className={`flex flex-col flex-1 ${view === "list" ? "" : "p-5"}`}>

        {/* Price */}
        <p className="text-xl font-bold text-primary">
          LKR {listing.price.toLocaleString()}
          <span className="text-sm text-gray-500"> /mo</span>
        </p>

        {/* Title */}
        <h3 className="mt-1 text-lg font-bold text-text-main dark:text-white line-clamp-1">
          {listing.title}
        </h3>

        {/* Location */}
        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
          {listing.location}
        </p>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {listing.description}
        </p>

        {/* Divider */}
        <div className="mt-auto pt-4 border-t border-border-color dark:border-white/10" />

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={copyUrl}
            className="px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition"
          >
            Copy URL
          </button>

          <button
            onClick={viewListing}
            className="px-3 py-2 text-sm rounded-md bg-primary text-background-dark font-semibold hover:bg-primary/90 transition"
          >
            View
          </button>

          {!isOccupied ? (
            <>
              <button
                disabled={loading}
                onClick={() => updateStatus("occupied")}
                className="px-3 py-2 text-sm rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200 transition"
              >
                Mark Occupied
              </button>

              <button
                disabled={loading}
                onClick={deleteListing}
                className="px-3 py-2 text-sm rounded-md bg-red-100 text-red-800 hover:bg-red-200 transition"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              disabled={loading}
              onClick={() => updateStatus("active")}
              className="px-3 py-2 text-sm rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition"
            >
              Republish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
