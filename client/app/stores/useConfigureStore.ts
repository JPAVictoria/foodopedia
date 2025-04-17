import { create } from "zustand";

interface ConfigureState {
  firstName: string;
  lastName: string;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;

  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  toggleShowCurrent: () => void;
  toggleShowNew: () => void;
  toggleShowConfirm: () => void;
}

export const useConfigureStore = create<ConfigureState>((set) => ({
  firstName: "",
  lastName: "",
  setFirstName: (name) => set({ firstName: name }),
  setLastName: (name) => set({ lastName: name }),

  showCurrent: false,
  showNew: false,
  showConfirm: false,
  toggleShowCurrent: () => set((state) => ({ showCurrent: !state.showCurrent })),
  toggleShowNew: () => set((state) => ({ showNew: !state.showNew })),
  toggleShowConfirm: () => set((state) => ({ showConfirm: !state.showConfirm })),
}));
