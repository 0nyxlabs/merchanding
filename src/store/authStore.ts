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

  setUser: (user) => {
    console.log(`[AUTH STORE] setUser — userId: ${user.id}, email: ${user.email}, role: ${user.app_metadata?.role ?? 'user'}`)
    set({ user })
  },

  clearUser: () => {
    console.log('[AUTH STORE] clearUser — limpiando usuario del store')
    set({ user: null })
  },

  isAdmin: () => {
    const { user } = get()
    const admin = user?.app_metadata?.role === 'admin'
    return admin
  },
}))
