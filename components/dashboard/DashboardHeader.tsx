"use client";

import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

/**
 * Dashboard header component.
 *
 * Displays a personalized welcome message using the authenticated user's name
 * (from Zustand store) and provides a primary action button to create new listings.
 *
 * - Shows "User" as fallback if name is not available
 * - Uses a supportive, professional subtitle to guide the landlord
 * - Fully responsive and accessible
 */
export default function DashboardHeader() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Fallback to "User" if name is missing or empty
  const displayName = user?.name && user.name.trim() !== "" ? user.name : "User";

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      {/* Left: Welcome message */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          Welcome back, {displayName}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg">
          Manage your listings, track inquiries, and grow your rental business.
        </p>
      </div>

      {/* Right: Primary action button */}
      <button
        className="flex items-center gap-2 bg-primary hover:bg-primary/90
                   text-gray-900 font-bold px-5 py-2.5 rounded-md
                   shadow-lg shadow-primary/20
                   transition-all active:scale-95
                   self-start md:self-auto cursor-pointer"
        onClick={() => {
          router.push('/dashboard/post-ad');
        }}
        aria-label="Post new property ad"
      >
        <PlusCircle size={20} />
        <span>Post New Ad</span>
      </button>
    </div>
  );
}