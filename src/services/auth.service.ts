import { supabase } from './supabase'
import { api } from './api'
import type { UserProfile, UpdateProfileDto } from '@/types'

export const authService = {
  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) throw error
    return data
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  getProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get('/users/profile')
    return data
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const { data } = await api.patch('/users/profile', dto)
    return data
  },
}
