import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  recoveryMode: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setRecoveryMode: (recoveryMode: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,
  recoveryMode: false,
  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),
  setRecoveryMode: (recoveryMode) => set({ recoveryMode }),
}));
