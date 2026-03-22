"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Shield,
  ChevronDown,
  Settings,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import type { Profile } from "@/lib/types";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileModal } from "./dashboard/profile-modal";
import { Separator } from "@/components/ui/separator";
import Logo from "./logo";
import { useThemeStore, type ThemePreference } from "@/stores/use-theme-store";

export function SiteHeader() {
  const [user, setUser] = useState<Profile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { setTheme } = useTheme();
  const theme = useThemeStore((state) => state.theme);
  const isThemeHydrated = useThemeStore((state) => state.isHydrated);

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

  const handleThemeChange = (nextTheme: string) => {
    if (nextTheme !== "light" && nextTheme !== "dark" && nextTheme !== "system") {
      return;
    }
    setTheme(nextTheme);
  };

  const getThemeIcon = (value: ThemePreference) => {
    if (value === "light") return <Sun className="h-4 w-4" />;
    if (value === "dark") return <Moon className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        pathname === "/"
          ? "glass soft-shadow"
          : "bg-background/95 backdrop-blur-md border-b"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Logo tone={pathname === "/" ? "light" : "dark"} />
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1 items-center">
              {[
                { name: "Home", href: "/" },
                { name: "Rentals", href: "/search" },
                { name: "Pricing", href: "/pricing" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-muted ${
                    pathname === item.href
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isThemeHydrated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:inline-flex rounded-xl font-bold"
                      aria-label="Change theme"
                    >
                      {getThemeIcon(theme)}
                      <span className="ml-2 capitalize">{theme}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-44 rounded-2xl border-none soft-shadow p-2 mt-2"
                    align="end"
                  >
                    <DropdownMenuLabel className="font-bold">Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
                      <DropdownMenuRadioItem value="system" className="rounded-xl">
                        <Monitor className="mr-2 h-4 w-4" />
                        System
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="light" className="rounded-xl">
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark" className="rounded-xl">
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {user ? (
                <>
                  <Link
                    href="/dashboard/listings/new"
                    className="hidden xs:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <span className="hidden sm:inline">+ Post</span>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 p-1 rounded-2xl hover:bg-muted transition-all outline-none">
                        <Avatar className="h-10 w-10 border border-border shadow-sm">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback className="bg-primary text-white font-black">
                            {user.full_name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 rounded-2xl border-none soft-shadow p-2 mt-2"
                      align="end"
                    >
                      <DropdownMenuLabel className="font-medium p-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-black tracking-tight">
                            {user.full_name}
                          </span>
                          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                            {user.role} Account
                          </span>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem
                        onClick={() => setIsProfileModalOpen(true)}
                        className="rounded-xl py-2.5 cursor-pointer font-bold focus:bg-primary/5 focus:text-primary transition-colors"
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl py-2.5 cursor-pointer font-bold focus:bg-primary/5 focus:text-primary transition-colors"
                      >
                        <Link href="/dashboard">
                          <LayoutDashboard className="mr-3 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <DropdownMenuItem
                          asChild
                          className="rounded-xl py-2.5 cursor-pointer font-bold focus:bg-primary/5 focus:text-primary transition-colors"
                        >
                          <Link href="/admin">
                            <Shield className="mr-3 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="rounded-xl py-2.5 cursor-pointer font-bold text-destructive focus:bg-destructive/5 focus:text-destructive transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="hidden md:block text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/auth/sign-up"
                    className="hidden md:inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Sign Up
                  </Link>

                  <Link
                    href="/auth/sign-up"
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <span className="hidden sm:inline">+ Post</span>
                  </Link>
                </>
              )}

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card text-foreground px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-4">
          {isThemeHydrated && (
            <div className="rounded-xl border border-border/60 p-3">
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={theme === "system" ? "default" : "outline"}
                  className="rounded-lg h-9"
                  onClick={() => handleThemeChange("system")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={theme === "light" ? "default" : "outline"}
                  className="rounded-lg h-9"
                  onClick={() => handleThemeChange("light")}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={theme === "dark" ? "default" : "outline"}
                  className="rounded-lg h-9"
                  onClick={() => handleThemeChange("dark")}
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Link
            href="/search"
            className="block text-sm font-bold hover:text-primary transition-colors"
          >
            Explore Rentals
          </Link>
          <Link
            href="/pricing"
            className="block text-sm font-bold hover:text-primary transition-colors"
          >
            Pricing Plans
          </Link>

          <Separator className="bg-border/50" />

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/30">
                <Avatar className="h-10 w-10 border border-border shadow-sm">
                  <AvatarImage src={user.avatar_url || ""} />
                  <AvatarFallback className="bg-primary text-white font-black">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-black">{user.full_name}</span>
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                    {user.role} Account
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="rounded-xl font-bold justify-start"
                  size="sm"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-xl font-bold justify-start"
                  size="sm"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </div>

              <Button
                variant="destructive"
                onClick={handleLogout}
                className="w-full rounded-xl font-bold"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                asChild
                className="rounded-xl font-black"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="rounded-xl font-black">
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      )}

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={user}
        onUpdate={(updated) => setUser(updated)}
      />
    </nav>
  );
}
