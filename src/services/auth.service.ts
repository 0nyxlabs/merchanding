import { supabase } from './supabase'
import { api } from './api'
import type { UserProfile, UpdateProfileDto } from '@/types'

export const authService = {
  signUp: async (email: string, password: string, fullName: string) => {
    console.log(`[AUTH SERVICE] signUp — email: ${email}, nombre: ${fullName}`)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      console.error('[AUTH SERVICE] signUp ❌ Error:', error.message)
      throw error
    }
    console.log(`[AUTH SERVICE] signUp ✅ Usuario creado — userId: ${data.user?.id}`)
    return data
  },

  signIn: async (email: string, password: string) => {
    console.log(`[AUTH SERVICE] signIn — email: ${email}`)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[AUTH SERVICE] signIn ❌ Error:', error.message)
      throw error
    }
    console.log(`[AUTH SERVICE] signIn ✅ Login exitoso — userId: ${data.user?.id}, email: ${data.user?.email}`)
    return data
  },

  signOut: async () => {
    console.log('[AUTH SERVICE] signOut — cerrando sesión...')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('[AUTH SERVICE] signOut ❌ Error:', error.message)
      throw error
    }
    console.log('[AUTH SERVICE] signOut ✅ Sesión cerrada')
  },

  getSession: async () => {
    console.log('[AUTH SERVICE] getSession — obteniendo sesión actual...')
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('[AUTH SERVICE] getSession ❌ Error:', error.message)
      throw error
    }
    if (data.session) {
      console.log(`[AUTH SERVICE] getSession ✅ Sesión activa — userId: ${data.session.user.id}, expires: ${new Date(data.session.expires_at! * 1000).toLocaleTimeString()}`)
    } else {
      console.log('[AUTH SERVICE] getSession — sin sesión activa')
    }
    return data.session
  },

  getProfile: async (): Promise<UserProfile> => {
    console.log('[AUTH SERVICE] getProfile — obteniendo perfil del usuario...')
    const { data } = await api.get('/users/profile')
    console.log(`[AUTH SERVICE] getProfile ✅ Perfil obtenido — role: ${data?.data?.role ?? data?.role}`)
    return data
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    console.log('[AUTH SERVICE] updateProfile — actualizando perfil:', JSON.stringify(dto))
    const { data } = await api.patch('/users/profile', dto)
    console.log('[AUTH SERVICE] updateProfile ✅ Perfil actualizado')
    return data
  },
}
