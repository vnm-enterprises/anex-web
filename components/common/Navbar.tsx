"use client";

import { Home, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const isLogged = useAuthStore((s) => s.isAuthenticated);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      isActive(href)
        ? "text-black dark:text-white underline decoration-primary underline-offset-4"
        : "text-text-main dark:text-text-main-dark hover:text-primary"
    }`;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/rentals?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
    setSearchFocused(false);
    setMobileOpen(false);
  };

  // Common logo component
  const Logo = () => (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark">
        <Home size={18} />
      </div>
      <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
        annex.lk
      </h2>
    </Link>
  );

  // Authenticated Navbar
  if (isLogged) {
    return (
      <header className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-sm border-b border-border-color px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Logo + Search */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-8 bg-primary rounded-full flex items-center justify-center text-background-dark">
                <Home size={18} />
              </div>
              <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                annex.lk
              </h2>
            </Link>


            {/* Desktop Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center h-10 bg-white dark:bg-surface-dark border border-border-color dark:border-white/10 rounded-full pl-3 pr-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50"
              style={{ width: searchFocused ? "520px" : "320px" }}
            >
              <Search size={18} className="text-text-secondary flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={
                  searchFocused
                    ? "Search by city, area, property ID, or keyword"
                    : "Search..."
                }
                className="w-full ml-2 bg-transparent border-none outline-none text-sm placeholder:text-text-secondary text-text-main dark:text-white"
              />
            </form>
          </div>

          {/* Right: Nav + Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>
              <Link href="/rentals" className={navLinkClass("/rentals")}>
                Rentals
              </Link>
              <Link href="/short-stays" className={navLinkClass("/short-stays")}>
                Short Stays
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/list")}
                className="hidden sm:flex h-10 px-5 items-center justify-center rounded-full bg-primary hover:bg-primary-dark text-background-dark text-sm font-bold transition-all shadow-sm hover:shadow-md"
              >
                List Property
              </button>

              <button className="size-10 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-sm">
                <Image
                  alt="User profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLQzF5rlcxkn3b1G4CBlYjTpZ-IiH_RVjYo3JjjO0WWfc7DC_id8tqV6yVDZpywKYY8a0dMGD4EFoM4EaYjwxRHESN0ojaOhuQpnX-x3NFAgM0S0KDxW1RhTp_KUBAzA7CANYyQ_PdJHQrDSCVRffhiEm3ds78FyDBAk6OT_hM1xxjWLD11QcKrHTtYXvjpAaDqjm_nWRJGV4JC-uw7A5Cjq3TnowW3iBMuklWhjqx3VWQLlIp-qS8gNRcKpEx7-sJXwQ4o7hH948"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden text-text-main dark:text-white"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 px-4 space-y-3 animate-fadeIn">
            <Link
              href="/"
              className={navLinkClass("/")}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/rentals"
              className={navLinkClass("/rentals")}
              onClick={() => setMobileOpen(false)}
            >
              Rentals
            </Link>
            <Link
              href="/short-stays"
              className={navLinkClass("/short-stays")}
              onClick={() => setMobileOpen(false)}
            >
              Short Stays
            </Link>
            <button
              onClick={() => {
                router.push("/list");
                setMobileOpen(false);
              }}
              className="w-full h-10 rounded-full bg-primary text-background-dark font-bold"
            >
              List Property
            </button>
          </div>
        )}

        {/* Mobile Search (below navbar on small screens) */}
        {mobileOpen && (
          <div className="lg:hidden px-4 pb-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center h-10 bg-white dark:bg-surface-dark border border-border-color dark:border-white/10 rounded-full pl-3 pr-2">
              <Search size={18} className="text-text-secondary flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rentals..."
                className="w-full ml-2 bg-transparent border-none outline-none text-sm placeholder:text-text-secondary text-text-main dark:text-white"
              />
            </form>
          </div>
        )}
      </header>
    );
  }

  // Guest Navbar
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7f3ed] bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80 dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
              <div className="size-8 bg-primary rounded-full flex items-center justify-center text-background-dark">
                <Home size={18} />
              </div>
              <h2 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                annex.lk
              </h2>
            </Link>


          {/* Desktop Nav (Guest) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link href="/rentals" className={navLinkClass("/rentals")}>
              Find a Place
            </Link>
            <Link href="/auth/login" className={navLinkClass("/auth/login")}>
              List Property
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Search (Guest) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center h-10 bg-white dark:bg-surface-dark border border-border-color dark:border-white/10 rounded-full pl-3 pr-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50"
            style={{ width: searchFocused ? "520px" : "320px" }}
          >
            <Search size={18} className="text-text-secondary flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder={
                searchFocused
                  ? "Search by city, area, property ID, or keyword"
                  : "Search..."
              }
              className="w-full ml-2 bg-transparent border-none outline-none text-sm placeholder:text-text-secondary text-text-main dark:text-white"
            />
          </form>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => router.push("/auth/login")}
              className="h-9 px-4 text-sm font-semibold text-text-main dark:text-white hover:text-primary transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="h-9 px-4 rounded-full bg-primary text-sm font-bold text-black hover:bg-primary-dark transition-colors"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-text-main dark:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Guest) */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 animate-fadeIn">
          <Link
            href="/"
            className={navLinkClass("/")}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/rentals"
            className={navLinkClass("/rentals")}
            onClick={() => setMobileOpen(false)}
          >
            Find a Place
          </Link>
          <Link
            href="/auth/login"
            className={navLinkClass("/auth/login")}
            onClick={() => setMobileOpen(false)}
          >
            List Property
          </Link>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                router.push("/auth/login");
                setMobileOpen(false);
              }}
              className="w-full h-9 rounded-full border border-border-color text-sm font-semibold text-text-main dark:text-white"
            >
              Log In
            </button>
            <button
              onClick={() => {
                router.push("/auth/signup");
                setMobileOpen(false);
              }}
              className="w-full h-9 rounded-full bg-primary text-sm font-bold text-black"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="flex items-center h-10 bg-white dark:bg-surface-dark border border-border-color dark:border-white/10 rounded-full pl-3 pr-2">
              <Search size={18} className="text-text-secondary flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rentals..."
                className="w-full ml-2 bg-transparent border-none outline-none text-sm placeholder:text-text-secondary text-text-main dark:text-white"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}