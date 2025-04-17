import { create } from "zustand"; 

interface RegisterStore {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  submitted: boolean;
  setField: (field: string, value: string) => void; 
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  loading: false,
  submitted: false,
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setLoading: (loading) => set((state) => ({ ...state, loading })),
  setSubmitted: (submitted) => set((state) => ({ ...state, submitted })),
}));
