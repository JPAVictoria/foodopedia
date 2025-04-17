import { create } from "zustand";

interface ChangeStore {
  password: string;
  confirmPassword: string;
  loading: boolean;
  submitted: boolean;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
}

export const useChangeStore = create<ChangeStore>((set) => ({
  password: "",
  confirmPassword: "",
  loading: false,
  submitted: false,
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setLoading: (loading) => set({ loading }),
  setSubmitted: (submitted) => set({ submitted }),
}));
