import { create } from "zustand";

interface StateStore {

  loading: boolean;
  submitted: boolean;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void; 
}

export const useStateStore = create<StateStore>((set) => ({
  loading: false,
  submitted: false,
  setLoading: (loading) => set({ loading }), 
  setSubmitted: (submitted) => set({ submitted }), 
}));
