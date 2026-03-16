import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/services/supabase'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, setUser, clearUser, isAdmin } = useAuthStore()

  useEffect(() => {
    console.log('[USE AUTH] Inicializando — obteniendo sesión activa...')
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log(`[USE AUTH] Sesión existente detectada — userId: ${session.user.id}, email: ${session.user.email}`)
        setUser(session.user)
      } else {
        console.log('[USE AUTH] Sin sesión activa al inicializar')
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[USE AUTH] onAuthStateChange — evento: ${event}`)
      if (session?.user) {
        console.log(`[USE AUTH] onAuthStateChange — usuario autenticado: ${session.user.email}, role: ${session.user.app_metadata?.role ?? 'fan'}`)
        setUser(session.user)
      } else {
        console.log('[USE AUTH] onAuthStateChange — sesión terminada, limpiando usuario')
        clearUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, clearUser])

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log(`[USE AUTH] signUp — email: ${email}, nombre: ${fullName}`)
    try {
      const data = await authService.signUp(email, password, fullName)
      console.log(`[USE AUTH] signUp ✅ Cuenta creada — userId: ${data.user?.id}`)
      toast.success('Account created! Please check your email.')
      return data
    } catch (error) {
      console.error('[USE AUTH] signUp ❌ Error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log(`[USE AUTH] signIn — email: ${email}`)
    try {
      const data = await authService.signIn(email, password)
      console.log(`[USE AUTH] signIn ✅ Login exitoso — userId: ${data.user?.id}, redirigiendo a /browse`)
      toast.success('Welcome back!')
      navigate({ to: '/browse' })
      return data
    } catch (error) {
      console.error('[USE AUTH] signIn ❌ Error:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log(`[USE AUTH] signOut — cerrando sesión de userId: ${user?.id}`)
    try {
      await authService.signOut()
      clearUser()
      console.log('[USE AUTH] signOut ✅ Sesión cerrada, redirigiendo a /login')
      navigate({ to: '/login' })
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('[USE AUTH] signOut ❌ Error:', error)
      throw error
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    signUp,
    signIn,
    signOut,
  }
}

export const useProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, 'profile'],
    queryFn: () => {
      console.log('[USE AUTH] useProfile — obteniendo perfil...')
      return authService.getProfile()
    },
  })
}
