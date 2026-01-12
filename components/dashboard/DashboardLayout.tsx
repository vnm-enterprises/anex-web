/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import ProfileDrawer from "./ProfileDrawer";
import Navbar from "../common/Navbar";

export default function DashboardLayout({ children }: any) {
  const [profileOpen, setProfileOpen] = useState(false);
// max-w-7xl
  return (
    <div className=" min-h-screen">
      {/* <Navbar /> */}
      <div className="flex mx-auto h-screen   justify-center mt-5">
        <Sidebar onProfile={() => setProfileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <ProfileDrawer
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      </div>
    </div>
  );
}
