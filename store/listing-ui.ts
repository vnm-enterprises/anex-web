import { create } from "zustand";

export const useListingUIStore = create<{
  view: "grid" | "list";
  dashboardMode: "simple" | "advanced";
  toggleView: () => void;
  toggleDashboardMode: () => void;
}>((set) => ({
  view: "list",
  dashboardMode: "simple",

  toggleView: () =>
    set((s) => ({
      view: s.view === "grid" ? "list" : "grid",
    })),

  toggleDashboardMode: () =>
    set((s) => ({
      dashboardMode:
        s.dashboardMode === "simple" ? "advanced" : "simple",
    })),
}));
