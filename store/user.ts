import { create } from "zustand";
import api from "@/lib/api";

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: "USER" | "ADMIN";
};

type UserState = {
  user: User | null;
  loading: boolean;
  fetchMe: () => Promise<void>;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,

  fetchMe: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/users/me");
      set({ user: res.data });
    } finally {
      set({ loading: false });
    }
  },

  clearUser: () => set({ user: null }),
}));
