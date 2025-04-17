import { create } from "zustand";

interface StateStore {

  loading: boolean;
  submitted: boolean;
  setLoading: (loading: boolean) => void; // Action to set loading state
  setSubmitted: (submitted: boolean) => void; // Action to set submitted state
}

export const useStateStore = create<StateStore>((set) => ({
  loading: false,
  submitted: false,
  setLoading: (loading) => set({ loading }), // Updating loading state
  setSubmitted: (submitted) => set({ submitted }), // Updating submitted state
}));
