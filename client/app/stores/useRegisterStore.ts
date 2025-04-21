import { create } from "zustand";

interface RegisterStore {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  submitted: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setField: (field: string, value: string) => void;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  toggleShowPassword: () => void;
  toggleShowConfirmPassword: () => void;
  resetForm: () => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  loading: false,
  submitted: false,
  showPassword: false,
  showConfirmPassword: false,

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  setLoading: (loading) => set((state) => ({ ...state, loading })),
  setSubmitted: (submitted) => set((state) => ({ ...state, submitted })),

  toggleShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),

  toggleShowConfirmPassword: () =>
    set((state) => ({ showConfirmPassword: !state.showConfirmPassword })),

  resetForm: () =>
    set(() => ({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false,
      submitted: false,
      showPassword: false,
      showConfirmPassword: false,
    })),
}));
