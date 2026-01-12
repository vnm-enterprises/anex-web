/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";
import { authApi } from "@/api/auth";
import { User, Session } from "@/types/auth";

type AuthState = {
  user: User | null;
  token: string | null;
  sessions: Session[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  /* actions */
  signup: (data: {
    email: string;
    password: string;
    name?: string;
  }) => Promise<void>;

  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>; // alias
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;

  hydrateAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      sessions: [],
      loading: false,
      error: null,
      isAuthenticated: false,

      /* ---------- HYDRATION ---------- */
      hydrateAuth: () => {
        const token = get().token;
        if (token) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
      },

      /* ---------- SIGNUP ---------- */
      signup: async (data) => {
        set({ loading: true, error: null });
        try {
          await authApi.signup(data);
        } catch (e: any) {
          set({ error: e.response?.data?.error || "Signup failed" });
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      /* ---------- LOGIN ---------- */
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authApi.login(email, password);
          api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
          set({ token: data.token, isAuthenticated: true });
          await get().fetchMe();
        } catch (e: any) {
          set({ error: e.response?.data?.error || "Login failed" });
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      /* ---------- GOOGLE LOGIN ---------- */
      googleLogin: async (idToken) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authApi.google(idToken);
          api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
          set({ token: data.token, isAuthenticated: true });
          await get().fetchMe();
        } catch (e: any) {
          set({ error: e.response?.data?.error || "Google login failed" });
          throw e;
        } finally {
          set({ loading: false });
        }
      },

      // Alias to match second snippet naming
      loginWithGoogle: async (idToken) => {
        return get().googleLogin(idToken);
      },

      /* ---------- ME ---------- */
      fetchMe: async () => {
        try {
          const { data } = await authApi.me();
          set({ user: data });
        } catch {
          delete api.defaults.headers.common.Authorization;
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      /* ---------- PROFILE ---------- */
      updateProfile: async (payload) => {
        const { data } = await authApi.updateProfile(payload);
        set({ user: data });
      },

      changePassword: async (current, next) => {
        await authApi.changePassword(current, next);
      },

      /* ---------- SESSIONS ---------- */
      fetchSessions: async () => {
        const { data } = await authApi.sessions();
        set({ sessions: data });
      },

      /* ---------- LOGOUT ---------- */
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          delete api.defaults.headers.common.Authorization;
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      logoutAll: async () => {
        try {
          await authApi.logoutAll();
        } finally {
          delete api.defaults.headers.common.Authorization;
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            sessions: [],
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
