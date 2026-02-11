import { create } from "zustand";
import api from "@/lib/api";

type PropertyViewState = {
  trackView: (propertyId: string) => Promise<void>;
};

export const usePropertyViewStore = create<PropertyViewState>(() => ({
  trackView: async (propertyId) => {
    await api.post(`/properties/${propertyId}/view`);
  },
}));
