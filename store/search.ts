import { create } from "zustand";

type SearchFilters = {
  query: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
};

type SearchState = {
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void;
  resetFilters: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: {
    query: "",
  },

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({
      filters: { query: "" },
    }),
}));
