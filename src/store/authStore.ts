import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  isAdmin: () => {
    const { user } = get()
    return user?.app_metadata?.role === 'admin'
  },
}))
