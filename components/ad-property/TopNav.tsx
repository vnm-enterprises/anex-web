"use client";

import { Home } from "lucide-react";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded bg-primary flex items-center justify-center text-background-dark">
              <span className="material-symbols-outlined"><Home /></span>
            </div>
            <span className="text-xl font-bold">annex.lk</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-slate-900">
              Save as Draft
            </button>

            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi_g7bjay9pIR5Zyembly6ERIBxE_btkzSlfKwvCfUGF2TOG3aMCANkz14D0V0shMqrxRThsUThYG7G9haNuAaP_DnBGaauXc_R3UxSH4-lqw9HnIIg8r3htfklrLggoewpPen08Cz1rsZoPkkh2rCD-trXvW7KzU9CiotfS_56ZN-CjvbqdhhwRiWu_xmi3CVzBBYg62hnVJfxjggjXF9xhPCzEdJZ2KxSrzp5I3MDHlrKl9fMiGGZIYfQCFAut0y3ko9r_9WYGs"
              className="w-8 h-8 rounded-full object-cover"
              alt="Profile"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
