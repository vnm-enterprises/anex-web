"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { formatAtLeastHundred, useMarketplaceStats } from "@/hooks/use-marketplace-stats";

interface RouteConfig {
  topPrompt?: string;
  topLinkLabel?: string;
  topLinkHref?: string;
  heroImage: string;
  heroAlt: string;
  heroTitle: string;
  heroDescription: string;
}

const routeConfigMap: Record<string, RouteConfig> = {
  "/auth/login": {
    topPrompt: "New here?",
    topLinkLabel: "Create account",
    topLinkHref: "/auth/sign-up",
    heroImage: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=2200",
    heroAlt: "Professional renter using a laptop",
    heroTitle: "Manage your rentals effortlessly.",
    heroDescription:
      "Access your dashboard, boost listings, track inquiries, and grow your rental presence across Sri Lanka.",
  },
  "/auth/sign-up": {
    topPrompt: "Already a member?",
    topLinkLabel: "Log in",
    topLinkHref: "/auth/login",
    heroImage: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=2200",
    heroAlt: "Bright modern apartment room",
    heroTitle: "Find your space.",
    heroDescription:
      "Whether you're renting out your annex or searching for your next home, RENTR connects verified owners with trusted tenants.",
  },
  "/auth/forgot-password": {
    topPrompt: "Remembered your password?",
    topLinkLabel: "Sign in",
    topLinkHref: "/auth/login",
    heroImage: "https://images.pexels.com/photos/267614/pexels-photo-267614.jpeg?auto=compress&cs=tinysrgb&w=2200",
    heroAlt: "Secure login and password concept",
    heroTitle: "Secure access to your account.",
    heroDescription:
      "We'll send you a secure link so you can reset your password and continue managing your listings.",
  },
  "/auth/reset-password": {
    topPrompt: "Back to",
    topLinkLabel: "Sign in",
    topLinkHref: "/auth/login",
    heroImage: "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=2200",
    heroAlt: "Cyber security lock illustration",
    heroTitle: "Stay secure.",
    heroDescription:
      "A strong password keeps your listings, inquiries, and dashboard safe across Sri Lanka's trusted rental marketplace.",
  },
  "/auth/sign-up-success": {
    heroImage: "https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=2200",
    heroAlt: "Person checking confirmation email",
    heroTitle: "You're almost there.",
    heroDescription:
      "Verify your email to unlock your dashboard and start listing properties or discovering rentals across Sri Lanka.",
  },
  "/auth/error": {
    topPrompt: "Need support?",
    topLinkLabel: "Contact us",
    topLinkHref: "/contact-support",
    heroImage: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=2200",
    heroAlt: "Support specialist assisting a user",
    heroTitle: "Let's get you back on track.",
    heroDescription:
      "Authentication issues are usually temporary. Try signing in again or return home to continue browsing listings.",
  },
};

const fallbackConfig: RouteConfig = {
  heroImage: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=2200",
  heroAlt: "Rental property interior",
  heroTitle: "Welcome to RENTR",
  heroDescription: "Find and manage rentals with confidence.",
};

/**
 * Shared auth shell that adapts visuals and top navigation by route.
 */
export function AuthLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const routeConfig = routeConfigMap[pathname] ?? fallbackConfig;
  const { data: stats } = useMarketplaceStats();

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 xl:p-20 bg-white dark:bg-slate-900 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">RENTR</span>
          </Link>

          {routeConfig.topPrompt && routeConfig.topLinkLabel && routeConfig.topLinkHref ? (
            <div className="text-sm text-muted-foreground">
              {routeConfig.topPrompt}{" "}
              <Link href={routeConfig.topLinkHref} className="text-primary font-semibold">
                {routeConfig.topLinkLabel}
              </Link>
            </div>
          ) : null}
        </div>

        {children}

        <div className="mt-12 text-xs text-muted-foreground text-center">© {new Date().getFullYear()} RENTR</div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden">
        <Image
          src={routeConfig.heroImage}
          alt={routeConfig.heroAlt}
          fill
          priority
          sizes="50vw"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent mix-blend-multiply" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <h2 className="text-3xl font-bold mb-3">{routeConfig.heroTitle}</h2>
          <p className="text-white/80 max-w-md">{routeConfig.heroDescription}</p>

          <div className="flex gap-8 mt-10 border-t border-white/20 pt-8">
            <div>
              <p className="text-2xl font-bold">{formatAtLeastHundred(stats?.listingsCount)}</p>
              <p className="text-xs uppercase tracking-wide text-white/60">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{formatAtLeastHundred(stats?.tenantsCount)}</p>
              <p className="text-xs uppercase tracking-wide text-white/60">Happy Tenants</p>
            </div>
            <div>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-xs uppercase tracking-wide text-white/60">Verified Owners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
