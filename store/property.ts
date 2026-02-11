import { create } from "zustand";
import api from "@/lib/api";

export type PropertyStatus = "ACTIVE" | "OCCUPIED" | "REVIEWING";

export type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  isActive: boolean;
  viewsCount: number;
  images: string[];
};

type PropertyState = {
  listings: Property[];
  loading: boolean;

  fetchMyListings: () => Promise<void>;
  markOccupied: (id: string) => Promise<void>;
  republish: (id: string) => Promise<void>;
};

export const usePropertyStore = create<PropertyState>((set, get) => ({
  listings: [],
  loading: false,

  fetchMyListings: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/properties/my");
      set({ listings: res.data });
    } finally {
      set({ loading: false });
    }
  },

  markOccupied: async (id) => {
    await api.post(`/properties/${id}/occupy`);
    set({
      listings: get().listings.map((p) =>
        p.id === id ? { ...p, isActive: false } : p
      ),
    });
  },

  republish: async (id) => {
    await api.post(`/properties/${id}/republish`);
    set({
      listings: get().listings.map((p) =>
        p.id === id ? { ...p, isActive: true } : p
      ),
    });
  },
}));
