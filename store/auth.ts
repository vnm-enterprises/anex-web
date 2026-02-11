/**
 * Authentication state management using Zustand.
 *
 * Manages global user session state, including:
 * - Current user profile data
 * - Authentication status (`isAuthenticated`)
 * - Loading state during hydration
 *
 * The store automatically syncs with the backend via:
 * - `hydrateUser()`: fetches user data on app load
 * - `logout()`: invalidates session on both client and server
 *
 * UI components (e.g., Navbar) consume `isAuthenticated` to render conditionally.
 */

import { create } from "zustand";
import api from "@/lib/api";

/**
 * Represents the shape of authenticated user data.
 */
interface AuthUser {
  id: string;
  email: string;
  phone: string;
  name: string | null;
  emailVerified: boolean;
  avatar: string | null;
}

/**
 * Zustand store interface for authentication state.
 */
interface AuthState {
  /**
   * Currently authenticated user data, or `null` if not logged in.
   */
  user: AuthUser | null;

  /**
   * Indicates whether the user has an active, verified session.
   */
  isAuthenticated: boolean;

  /**
   * Indicates whether the initial authentication state is being loaded.
   * Set to `false` once hydration completes (successfully or not).
   */
  loading: boolean;

  /**
   * Fetches current user data from `/auth/me` and updates store state.
   * Called on app initialization to restore session from HTTP-only cookie.
   * On failure (e.g., expired session), sets `isAuthenticated = false`.
   */
  hydrateUser: () => Promise<void>;

  /**
   * Logs the user out by:
   * 1. Calling `/auth/logout` to invalidate the server session
   * 2. Clearing local authentication state
   *
   * Safe to call even if already logged out.
   */
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  hydrateUser: async () => {
    try {
      const res = await api.get("/auth/me");
      set({
        user: res.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.warn("Logout API call failed (safe to ignore):", error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
}));