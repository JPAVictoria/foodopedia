// useLoginStore.ts

import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

type Admin = {
  email: string;
  firstName: string;
  lastName: string;
};

type LoginStore = {
  email: string;
  password: string;
  loading: boolean;
  submitted: boolean;
  error: string | null;
  admin: Admin | null;

  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoading: (loading: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
  setError: (error: string | null) => void;
  setAdmin: (admin: Admin) => void;
  clearAdmin: () => void; 

  login: (opts: {
    showSnackbar: (msg: string, type: "success" | "error") => void;
    onSuccess: (admin: Admin) => void;
    onRedirect?: () => void;
  }) => Promise<void>;

  resetLoginForm: () => void;
};

export const useLoginStore = create<LoginStore>((set, get) => ({
  email: "",
  password: "",
  loading: false,
  submitted: false,
  error: null,
  admin: null, 

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setLoading: (loading) => set({ loading }),
  setSubmitted: (submitted) => set({ submitted }),
  setError: (error) => set({ error }),
  setAdmin: (admin: Admin) => set({ admin }),
  clearAdmin: () => set({ admin: null }), 

  login: async ({ showSnackbar, onSuccess, onRedirect }) => {
    const { email, password } = get();

    if (!email || !password) {
      set({ error: "Email and password are required." });
      showSnackbar("Email and password are required.", "error");
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.post("http://localhost:5000/admin/login/login", {
        email,
        password,
      });

      const { token, admin } = response.data;

      if (token && admin) {
        Cookies.set("token", token, { expires: 1 });
        onSuccess(admin);
        showSnackbar("Login successful!", "success");
        set({ submitted: true });

        if (onRedirect) {
          setTimeout(onRedirect, 2000);
        }
      }
    } catch (err) {
      set({ loading: false });

      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Invalid email or password."
        : "An unexpected error occurred.";

      set({ error: msg });
      showSnackbar(msg, "error");
    }
  },

  resetLoginForm: () => set({
    email: "",
    password: "",
    loading: false,
    submitted: false,
    error: null,
    admin: null, 
  }),
}));
