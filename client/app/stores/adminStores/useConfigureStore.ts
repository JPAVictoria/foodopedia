import { create } from "zustand";

interface ConfigureState {
  firstName: string;
  lastName: string;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
}

export const useConfigureStore = create<ConfigureState>((set) => ({
  firstName: "",
  lastName: "",
  setFirstName: (name) => set({ firstName: name }),
  setLastName: (name) => set({ lastName: name }),

  showCurrent: false,
  showNew: false,
  showConfirm: false,

}));
