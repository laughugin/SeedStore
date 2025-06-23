import { create } from 'zustand';
import { User } from '../types/database';

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  isAuthenticated: false,
}));

// Add empty export to make it a module
export {}; 