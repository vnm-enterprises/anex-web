import { create } from "zustand";
import api from "@/lib/api";

export type Rating = {
  id: string;
  rating: number;
  comment?: string;
  user: {
    id: string;
    name?: string;
    avatar?: string;
  };
};

type RatingsState = {
  ratings: Rating[];
  loading: boolean;

  fetchRatings: (propertyId: string) => Promise<void>;
  submitRating: (
    propertyId: string,
    rating: number,
    comment?: string
  ) => Promise<void>;
};

export const useRatingsStore = create<RatingsState>((set) => ({
  ratings: [],
  loading: false,

  fetchRatings: async (propertyId) => {
    set({ loading: true });
    try {
      const res = await api.get(`/properties/${propertyId}/ratings`);
      set({ ratings: res.data });
    } finally {
      set({ loading: false });
    }
  },

  submitRating: async (propertyId, rating, comment) => {
    await api.post(`/properties/${propertyId}/ratings`, {
      rating,
      comment,
    });
  },
}));
