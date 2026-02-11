"use client";

import { ChevronRight, HomeIcon, HousePlus, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

/**
 * Sidebar navigation component for the landlord dashboard.
 *
 * Displays:
 * - App logo and title
 * - Primary navigation links (Dashboard, Add Property)
 * - User profile section that opens the account drawer
 *
 * User data (name, avatar) is pulled from the global auth store.
 * If user data is not available (e.g., during initial load or if missing),
 * safe placeholder values are displayed to maintain UI integrity.
 *
 * Hidden on mobile screens (md:hidden); intended for desktop/tablet layouts.
 */
export default function Sidebar({ onProfile }: { onProfile: () => void }) {
  const { user } = useAuthStore();

  // Fallback values to ensure UI never breaks
  const displayName = user?.name && user.name.trim() !== ""
    ? user.name
    : "User";

  const displayAvatar = user?.avatar || null;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark">
      <div className="p-4 flex flex-col h-full">
        {/* Logo */}
        <Link href={'/'} className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-text-primary">
            <HomeIcon size={20} />
          </div>
          <div>
            <h1 className="font-bold">annex.lk</h1>
            <p className="text-xs text-gray-500">Owner Panel</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 font-medium text-text-primary/50"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/post-ad"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <HousePlus size={18} />
            Add New Property
          </Link>
        </nav>

        {/* Profile Section */}
        <div
          onClick={onProfile}
          className="cursor-pointer flex items-center gap-3 px-2 py-3 border-t border-gray-200 dark:border-gray-800 mt-auto"
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm font-medium">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Landlord • Sri Lanka
            </p>
          </div>

          {/* Chevron Icon */}
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </aside>
  );
}