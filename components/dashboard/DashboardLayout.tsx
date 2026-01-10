/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileDrawer from "./ProfileDrawer";

export default function DashboardLayout({ children }: any) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar onProfile={() => setProfileOpen(true)} />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
