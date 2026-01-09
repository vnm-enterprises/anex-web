import { AuthSchema, AuthState } from "@/schema/auth";
import { create } from "zustand";

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

type AuthActions = {
  login: (data: AuthState) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  login: (data) => {
    const parsed = AuthSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Invalid auth payload", parsed.error);
      return;
    }

    localStorage.setItem("token", parsed.data.token ?? "");
    set(parsed.data);
  },

  logout: () => {
    localStorage.removeItem("token");
    set(initialState);
  },

  hydrate: () => {
    const token = localStorage.getItem("token");

    const state: AuthState = {
      token,
      isAuthenticated: !!token,
      user: null,
    };

    const parsed = AuthSchema.safeParse(state);
    if (parsed.success) {
      set(parsed.data);
    }
  },
}));
