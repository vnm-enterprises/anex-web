"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { useThemeStore, type ThemePreference, type ResolvedTheme } from "@/stores/use-theme-store";

const getStoredTheme = (): ThemePreference => {
  const value = window.localStorage.getItem("theme");
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "light";
};

const getResolvedTheme = (resolved: string | undefined): ResolvedTheme =>
  resolved === "dark" ? "dark" : "light";

function ThemeHydrationFallback() {
  return (
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      Loading theme
    </span>
  );
}

export function ThemeStoreProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const setThemeInStore = useThemeStore((state) => state.setTheme);
  const setResolvedTheme = useThemeStore((state) => state.setResolvedTheme);
  const setHydrated = useThemeStore((state) => state.setHydrated);
  const isHydrated = useThemeStore((state) => state.isHydrated);

  useEffect(() => {
    const storedTheme = getStoredTheme();

    setTheme(storedTheme);
    setThemeInStore(storedTheme);
    setHydrated(true);
  }, [setTheme, setThemeInStore, setHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    if (theme === "light" || theme === "dark" || theme === "system") {
      setThemeInStore(theme);
    }
    if (resolvedTheme) {
      setResolvedTheme(getResolvedTheme(resolvedTheme));
    }
  }, [theme, resolvedTheme, isHydrated, setThemeInStore, setResolvedTheme]);

  if (!isHydrated) {
    return <ThemeHydrationFallback />;
  }

  return <>{children}</>;
}
