import { create } from "zustand";

type ModalState = {
  profileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  profileOpen: false,
  openProfile: () => set({ profileOpen: true }),
  closeProfile: () => set({ profileOpen: false }),
}));
