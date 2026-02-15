"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Home,
  Plus,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import type { Profile } from "@/lib/types";

export function SiteHeader() {
  const [user, setUser] = useState<Profile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profile) setUser(profile);
      }
    }

    getUser();
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav
      className={`absolute top-0 left-0 w-full z-50 ${pathname === "/" ? "bg-black/30 backdrop-blur-xl" : "bg-white text-black"} border-b border-white/10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <div
              className={`w-8 h-8 rounded-lg bg-primary flex items-center justify-center  text-white font-bold text-lg`}
            >
              <Home className="h-4 w-4" />
            </div>
            <span
              className={`font-extrabold text-2xl tracking-tight ${pathname === "/" ? "text-white" : "text-black"}`}
            >
              Annex<span className="text-primary">.lk</span>
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
               <Link
                href="/"
                className={`text-sm font-medium ${pathname === "/" ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}  transition-colors`}
              >
                Home
              </Link>
              <Link
                href="/search"
                className={`text-sm font-medium ${pathname === "/" ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}  transition-colors`}
              >
                Rentals
              </Link>

              <Link
                href="/pricing"
                className={`text-sm font-medium ${pathname === "/" ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"} transition-colors`}
              >
                Pricing
              </Link>
            </div>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`hidden md:flex items-center gap-2 text-sm font-semibold ${pathname === "/" ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}  transition`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {/* <img src={user.avatar_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy_JmafxKbli9Es5QUvL6d-qIdOd5RmExsvA&s'} className="rounded-full w-5 h-5"/> */}
                  Dashboard
                </Link>

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`hidden md:flex items-center gap-2 text-sm font-semibold ${pathname === "/" ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}  transition`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className={`hidden md:flex items-center gap-2 text-sm font-semibold ${pathname === "/" ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"}  transition`}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>

                <Link
                  href="/dashboard/listings/new"
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/40 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/20"
                >
                  <Plus className="h-4 w-4" />
                  Post an Ad
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`hidden md:block text-sm font-semibold ${pathname === "/" ? "text-white/80 " : "text-black/80"} dark:text-slate-300 hover:text-primary transition`}
                >
                  Log in
                </Link>

                <Link
                  href="/auth/sign-up"
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/20"
                >
                  <Plus className="h-4 w-4" />
                  Post an Ad
                </Link>
              </>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background px-4 py-4 space-y-4">
          <Link href="/search" className="block text-sm font-medium">
            Rentals
          </Link>
          <Link href="/pricing" className="block text-sm font-medium">
            Pricing
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="block text-sm font-medium">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="block text-sm font-medium">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block text-sm font-medium text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="block text-sm font-medium">
                Login
              </Link>
              <Link href="/auth/sign-up" className="block text-sm font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
