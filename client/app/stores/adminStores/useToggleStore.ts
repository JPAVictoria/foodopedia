// app/stores/adminStores/passwordStore.ts
import { create } from 'zustand';

interface PasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  setCurrentPassword: (password: string) => void;
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  toggleShowCurrent: () => void;
  toggleShowNew: () => void;
  toggleShowConfirm: () => void;
  resetPasswordForm: () => void;
}

export const useToggleStore = create<PasswordState>((set) => ({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  showCurrent: false,
  showNew: false,
  showConfirm: false,
  
  setCurrentPassword: (password) => set({ currentPassword: password }),
  setNewPassword: (password) => set({ newPassword: password }),
  setConfirmPassword: (password) => set({ confirmPassword: password }),
  
  toggleShowCurrent: () => set((state) => ({ showCurrent: !state.showCurrent })),
  toggleShowNew: () => set((state) => ({ showNew: !state.showNew })),
  toggleShowConfirm: () => set((state) => ({ showConfirm: !state.showConfirm })),
  
  resetPasswordForm: () => set({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false
  })
}));