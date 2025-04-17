import { create } from "zustand";

type LoginStore = {
  email: string;
  password: string;
  loading: boolean;
  submitted: boolean;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;

  resetLoginForm: () => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  email: "",
  password: "",
  loading: false,
  submitted: false,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setLoading: (loading) => set({ loading }),
  setSubmitted: (submitted) => set({ submitted }),

  resetLoginForm: () =>
    set({
      email: "",
      password: "",
      loading: false,
      submitted: false,
    }),
}));
