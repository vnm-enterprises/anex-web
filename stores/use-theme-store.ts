"use client";

import { create } from "zustand";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeStoreState {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  isHydrated: boolean;
  setTheme: (theme: ThemePreference) => void;
  setResolvedTheme: (theme: ResolvedTheme) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  theme: "light",
  resolvedTheme: "light",
  isHydrated: false,
  setTheme: (theme) =>
    set((state) => (state.theme === theme ? state : { ...state, theme })),
  setResolvedTheme: (resolvedTheme) =>
    set((state) =>
      state.resolvedTheme === resolvedTheme
        ? state
        : { ...state, resolvedTheme },
    ),
  setHydrated: (isHydrated) =>
    set((state) =>
      state.isHydrated === isHydrated ? state : { ...state, isHydrated },
    ),
}));
