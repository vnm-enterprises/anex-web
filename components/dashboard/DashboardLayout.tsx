/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileDrawer from "./ProfileDrawer";

/**
 * Dashboard layout component.
 *
 * Provides the structural layout for authenticated dashboard pages, including:
 * - A collapsible sidebar for navigation
 * - A main content area for page-specific content (`children`)
 * - A profile drawer (slide-over panel) for user account actions
 *
 * This layout assumes the user is already authenticated. It should be used
 * only on protected routes (e.g., /dashboard/*).
 *
 * Note: The top navbar is currently commented out but can be re-enabled
 * if a persistent top navigation bar is needed in addition to the sidebar.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  /**
   * Controls the visibility of the profile drawer (slide-over panel).
   * Toggled by clicking the profile button in the sidebar.
   */
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Top navbar is disabled; primary navigation is via sidebar */}

      <div className="flex mx-auto h-screen justify-center mt-5">
        {/* Left sidebar with navigation and profile trigger */}
        <Sidebar onProfile={() => setProfileOpen(true)} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>

        {/* Right-side profile drawer (slide-over panel) */}
        <ProfileDrawer
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      </div>
    </div>
  );
}