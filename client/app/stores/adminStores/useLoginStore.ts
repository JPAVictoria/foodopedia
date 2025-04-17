import { create } from "zustand";

type LoginStore = {
  email: string;
  password: string;
  loading: boolean;
  submitted: boolean;
  showPassword: boolean;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;

  toggleShowPassword: () => void;
  resetLoginForm: () => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  email: "",
  password: "",
  loading: false,
  submitted: false,
  showPassword: false,

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setLoading: (loading) => set({ loading }),
  setSubmitted: (submitted) => set({ submitted }),

  toggleShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),

  resetLoginForm: () =>
    set({
      email: "",
      password: "",
      loading: false,
      submitted: false,
      showPassword: false,
    }),
}));
