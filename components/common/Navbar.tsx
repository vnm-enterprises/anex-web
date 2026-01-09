"use client";

import { Home, Menu, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";

const Navbar = () => {
  const isLogged = useAuthStore((s) => s.isAuthenticated);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ===========================
     LOGGED-IN NAVBAR
  =========================== */
  if (isLogged) {
    return (
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-border-color dark:border-white/10 px-4 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2 text-text-main dark:text-white group" href="#">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
                <Home />
              </div>
              <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                annex.lk
              </h2>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center bg-white dark:bg-surface-dark border border-border-color dark:border-white/10 rounded-lg h-10 min-w-[320px] focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
              <div className="text-text-secondary pl-3 pr-2 flex items-center">
                <Search size={18} />
              </div>
              <input
                className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-text-secondary text-text-main dark:text-white h-full"
                placeholder="Search by city, town or ID..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="/">Home</Link>
              <Link className="text-sm font-medium text-primary" href="/rentals">Rentals</Link>
              <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">Short Stays</Link>
            </nav>

            <div className="flex items-center gap-4">
              <button className="hidden sm:flex h-10 px-5 items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-background-dark text-sm font-bold transition-all shadow-sm hover:shadow-md">
                List Property
              </button>

              <button className="size-10 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-sm">
                <Image
                  alt="User profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLQzF5rlcxkn3b1G4CBlYjTpZ-IiH_RVjYo3JjjO0WWfc7DC_id8tqV6yVDZpywKYY8a0dMGD4EFoM4EaYjwxRHESN0ojaOhuQpnX-x3NFAgM0S0KDxW1RhTp_KUBAzA7CANYyQ_PdJHQrDSCVRffhiEm3ds78FyDBAk6OT_hM1xxjWLD11QcKrHTtYXvjpAaDqjm_nWRJGV4JC-uw7A5Cjq3TnowW3iBMuklWhjqx3VWQLlIp-qS8gNRcKpEx7-sJXwQ4o7hH948"
                  width={40}
                  height={40}
                />
              </button>

              {/* Mobile toggle */}
              <button
                className="md:hidden"
                onClick={() => setMobileOpen((v) => !v)}
              >
                <Menu />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 px-4 space-y-3">
            <Link href={'/'} className="block text-sm font-medium">Home</Link>
            <Link  href={'/rentals'} className="block text-sm font-medium text-primary">Rentals</Link>
            <Link  href={'/list'}className="block text-sm font-medium">Short Stays</Link>
            <button className="w-full h-10 rounded-lg bg-primary text-background-dark font-bold">
              List Property
            </button>
          </div>
        )}
      </header>
    );
  }

  /* ===========================
     NON-LOGGED NAVBAR
  =========================== */
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7f3ed] bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80 dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-2 transition-opacity hover:opacity-80" href="#">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-black">
              <Home />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-main dark:text-white">
              anex.lk
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href={'/'}  className="text-sm font-medium hover:text-primary transition-colors" >Home</Link>
            <Link  className="text-sm font-medium hover:text-primary transition-colors" href="/rentals">Find a Place</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">List Property</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex relative items-center">
            <span className="absolute left-3 text-text-secondary">
              <Search size={18} />
            </span>
            <input
              className="h-9 w-64 rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm"
              placeholder="Quick search..."
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:block h-9 px-4 text-sm font-semibold">
              Log In
            </button>
            <button className="h-9 px-4 rounded-lg bg-primary text-sm font-bold text-black">
              Sign Up
            </button>

            <button
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ MOBILE MENU FOR NON-LOGGED USERS */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <Link href={'/'}  className="block text-sm font-medium">Home</Link>
          <Link href={'/rentals'} className="block text-sm font-medium">Find a Place</Link>
          <Link href={'/list'} className="block text-sm font-medium">List Property</Link>

          <button className="w-full h-9 rounded-lg border text-sm font-semibold">
            Log In
          </button>
          <button className="w-full h-9 rounded-lg bg-primary text-sm font-bold text-black">
            Sign Up
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
