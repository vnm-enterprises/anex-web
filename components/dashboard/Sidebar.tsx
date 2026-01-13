"use client";

import { ChevronRight, HomeIcon, HousePlus, LucideLayoutDashboard, Text } from "lucide-react";
import Link from "next/link";
import { GiChatBubble } from "react-icons/gi";

export default function Sidebar({ onProfile }: { onProfile: () => void }) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-surface-light dark:bg-surface-dark">
      <div className="p-4 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined"><HomeIcon /></span>
          </div>
          <div>
            <h1 className="font-bold">annex.lk</h1>
            <p className="text-xs text-gray-500">Owner Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 font-medium">
            <span className="material-symbols-outlined text-primary">
              <LucideLayoutDashboard />
            </span>
            Dashboard
          </a>

          <Link href={'/dashboard/post-ad'} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100">
            <span className="material-symbols-outlined">

              <HousePlus />
            </span>
            Add New Property
          </Link>

          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100">
            <span className="material-symbols-outlined">
              <Text />
            </span>
            Messages
          </a>
        </nav>

        {/* Profile */}
        <div
          onClick={onProfile}
          className="cursor-pointer flex items-center gap-3 px-2 py-3 border-t"
        >
           <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold">Mr. Perera</p>
            <p className="text-xs text-gray-500">Landlord • Colombo</p>
          </div>
          <span className="material-symbols-outlined text-gray-400">
            <ChevronRight />
          </span>
        </div>
      </div>
    </aside>
  );
}
