import { create } from "zustand";
import api from "@/lib/api";

type SavedListing = {
  id: string;
  propertyId: string;
};

type SavedListingsState = {
  saved: SavedListing[];
  loading: boolean;

  fetchSaved: () => Promise<void>;
  toggleSave: (propertyId: string) => Promise<void>;
  isSaved: (propertyId: string) => boolean;
};

export const useSavedListingsStore = create<SavedListingsState>(
  (set, get) => ({
    saved: [],
    loading: false,

    fetchSaved: async () => {
      set({ loading: true });
      try {
        const res = await api.get("/saved-listings");
        set({ saved: res.data });
      } finally {
        set({ loading: false });
      }
    },

    toggleSave: async (propertyId) => {
      await api.post(`/saved-listings/${propertyId}`);
      const exists = get().saved.find(
        (s) => s.propertyId === propertyId
      );

      set({
        saved: exists
          ? get().saved.filter((s) => s.propertyId !== propertyId)
          : [...get().saved, { id: crypto.randomUUID(), propertyId }],
      });
    },

    isSaved: (propertyId) =>
      !!get().saved.find((s) => s.propertyId === propertyId),
  })
);
