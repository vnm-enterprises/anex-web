"use client";

import { Home, Menu, Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const isLogged = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const { user } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const mobileNavReferance = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileNavReferance.current &&
        !mobileNavReferance.current.contains(event.target as Node)
      )
        setMobileOpen(false);

      if (mobileOpen)
        document.addEventListener("mousedown", handleClickOutside);

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileOpen]);

  const navbarColor = () => {
    if (pathname !== "/") return true;
  };

  if (loading) {
    return null;
  }
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinkClass = (href: string) =>
    `
    text-sm font-medium transition-all
    ${
      isActive(href)
        ? "text-primary underline decoration-primary underline-offset-4"
        : `${pathname !== '/' ? 'text-black' : 'text-white'} text-[#f8fafc] hover:underline decoration-primary underline-offset-4`
    }
  `;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/rentals?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
    setSearchFocused(false);
    setMobileOpen(false);
  };

  /* ===========================
     AUTHENTICATED NAVBAR
  =========================== */
  if (isLogged) {
    return (
          <header className="relative z-50 ">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 ">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-5">
              <Link href="/" className="flex items-center gap-2 group">
                <div
                  className={`size-9 bg-primary rounded-full flex items-center justify-center text-black shadow-md ${navbarColor() ? "" : ""}`}
                >
                  <Home size={18} />
                </div>
                <h2
                  className={`text-xl font-bold  tracking-tight transition-colors ${pathname !== '/' ? "text-black" : "text-[#f8fafc] group-hover:text-primary "}`}
                >
                  annex.lk
                </h2>
              </Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className={`${navLinkClass("/")} ${navbarColor() ? "text-black" : "text-[#f8fafc]"}`}
                >
                  Home
                </Link>
                <Link href="/rentals" className={navLinkClass("/rentals")}>
                  Rentals
                </Link>
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className={`hidden sm:flex h-10 px-4 items-center justify-center rounded-full ${navbarColor() ? "text-black" : "text-[#f8fafc]"} text-sm font-semibold  transition cursor-pointer`}
                >
                  Dashboard
                </button>

                <button
                  className="size-10 rounded-full overflow-hidden border-2 border-[#f8fafc]/60 shadow-md cursor-pointer"
                  onClick={() => router.push("/dashboard?profile=open")}
                >
                  <img
                    alt="User profile"
                    src={
                      user?.avatar ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLQzF5rlcxkn3b1G4CBlYjTpZ-IiH_RVjYo3JjjO0WWfc7DC_id8tqV6yVDZpywKYY8a0dMGD4EFoM4EaYjwxRHESN0ojaOhuQpnX-x3NFAgM0S0KDxW1RhTp_KUBAzA7CANYyQ_PdJHQrDSCVRffhiEm3ds78FyDBAk6OT_hM1xxjWLD11QcKrHTtYXvjpAaDqjm_nWRJGV4JC-uw7A5Cjq3TnowW3iBMuklWhjqx3VWQLlIp-qS8gNRcKpEx7-sJXwQ4o7hH948"
                    }
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </button>

                {/* Mobile Toggle */}
                <button
                  className="md:hidden text-[#f8fafc]"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Panel */}
          {mobileOpen && (
            <div className="md:hidden mt-4 rounded-2xl bg-black/80 backdrop-blur-xl p-4 space-y-4 animate-fadeIn">
              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass("/")}
                >
                  Home
                </Link>
                <Link
                  href="/rentals"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass("/rentals")}
                >
                  Rentals
                </Link>
                <button
                  onClick={() => {
                    router.push("/dashboard");
                    setMobileOpen(false);
                  }}
                  className="text-[#f8fafc] text-sm font-semibold text-left"
                >
                  Dashboard
                </button>
              </nav>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center h-11 bg-[#f8fafc] rounded-full px-3">
                  <Search size={18} className="text-gray-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search rentals..."
                    className="w-full ml-2 bg-transparent border-none outline-none text-sm text-black"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </header>
    );
  }

  /* ===========================
     GUEST NAVBAR
  =========================== */
  return (
    <header className="relative z-50 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-9 bg-primary rounded-full flex items-center justify-center text-black shadow-md">
              <Home size={18} />
            </div>
            <h2
              className={`text-xl font-bold  tracking-tight ${pathname !== "/" ? "text-[#000000]" : "text-[#f8fafc]"}`}
            >
              annex.lk
            </h2>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={ navLinkClass("/")}>
            Home
          </Link>
          <Link href="/rentals" className={navLinkClass("/rentals") }>
            Find a Place
          </Link>
          <Link href="/auth/login" className={navLinkClass("/auth/login")}>
            List Property
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => router.push("/auth/login")}
              className={`h-9 px-4 rounded-md border  text-sm font-semibold hover:border-primary transition ${pathname !== "/" ? "border-black text-black" : "border-[#f8fafc] text-[#f8fafc] "}`}
            >
              Log In
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="h-9 px-4 rounded-md bg-primary text-sm font-bold text-black hover:bg-primary-dark transition"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden z-50 ${pathname !== '/' ? 'text-black' : 'text-[#f8fafc]'} `}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Guest Mobile Panel */}
      {mobileOpen && (

          <div
            ref={mobileNavReferance}
            className={`md:hidden mx-4  rounded-2xl my-10 right-0  border border-[#f8fafc] backdrop-blur-xl p-4 space-y-4 animate-fadeIn ${pathname !== '/' ? 'bg-black text-[#f8fafc]' : 'bg-transparent'}`}
          >
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/")}
              >
                Home
              </Link>
              <Link
                href="/rentals"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/rentals")}
              >
                Find a Place
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/auth/login")}
              >
                List Property
              </Link>
            </nav>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/auth/login")}
                className="w-full h-10 rounded-full border border-[#f8fafc] text-[#f8fafc] text-sm font-semibold"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/auth/signup")}
                className="w-full h-10 rounded-full bg-primary text-sm font-bold text-black"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Search */}
            {/* <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center h-11 bg-[#f8fafc] rounded-full px-3">
              <Search size={18} className="text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search rentals..."
                className="w-full ml-2 bg-transparent border-none outline-none text-sm text-black"
              />
            </div>
          </form> */}
          </div>

      )}
    </header>
  );
}
