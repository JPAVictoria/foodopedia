import { create } from "zustand";

type Admin = {
  email: string;
  firstName: string;
  lastName: string;
};

type AuthStore = {
  admin: Admin | null;
  setAdmin: (admin: Admin) => void;
  clearAdmin: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
  clearAdmin: () => set({ admin: null }),
}));
