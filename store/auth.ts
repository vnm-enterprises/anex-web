import { create } from "zustand";
import api from "@/lib/api";

interface AuthUser {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  avatar: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  hydrateUser: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  hydrateUser: async () => {
    try {
      const res = await api.get("/auth/me");
      const user = {
        ...res.data,
        avatar: res.data.avatarUrl ?? null,
        emailVerified: Boolean(res.data.emailVerified),
      };
      set({ user, isAuthenticated: true, loading: false });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // noop
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  loginWithGoogle: async (idToken: string) => {
    await api.post("/auth/google", { idToken });
    await get().hydrateUser();
  },
}));
