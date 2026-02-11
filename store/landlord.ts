import { create } from "zustand";
import api from "@/lib/api";

export type Landlord = {
  id: string;
  phone?: string;
  isVerified: boolean;
};

type LandlordState = {
  landlord: Landlord | null;
  loading: boolean;

  fetchLandlord: () => Promise<void>;
};

export const useLandlordStore = create<LandlordState>((set) => ({
  landlord: null,
  loading: false,

  fetchLandlord: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/landlord/me");
      set({ landlord: res.data });
    } finally {
      set({ loading: false });
    }
  },
}));
