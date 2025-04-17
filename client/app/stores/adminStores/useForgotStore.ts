import { create } from "zustand";

interface ForgotPasswordStore {
  email: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useForgotPasswordStore = create<ForgotPasswordStore>((set) => ({
  email: "",
  loading: false,
  setEmail: (email) => set({ email }),
  setLoading: (loading) => set({ loading }),
}));
