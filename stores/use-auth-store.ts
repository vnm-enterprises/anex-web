"use client";

import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";

/**
 * Global auth state synchronized with Supabase session changes.
 */
interface AuthStoreState {
  user: User | null;
  session: Session | null;
  isInitialized: boolean;
  setAuth: (session: Session | null, user: User | null) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<() => void>;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  session: null,
  isInitialized: false,
  setAuth: (session, user) => set({ session, user }),
  clearAuth: () => set({ session: null, user: null }),
  initializeAuth: async () => {
    if (get().isInitialized) {
      return () => {};
    }

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ?? null,
      isInitialized: true,
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      set({
        session: nextSession,
        user: nextSession?.user ?? null,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  },
}));
