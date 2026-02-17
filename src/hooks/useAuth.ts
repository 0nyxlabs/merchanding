import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth.service'
import { toast } from 'react-hot-toast'

export const useAuth = () => {
  const navigate = useNavigate()
  const { user, setUser, clearUser, isAdmin } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        clearUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, clearUser])

  const signUp = async (email: string, password: string, fullName: string) => {
    const data = await authService.signUp(email, password, fullName)
    toast.success('Account created! Please check your email.')
    return data
  }

  const signIn = async (email: string, password: string) => {
    const data = await authService.signIn(email, password)
    toast.success('Welcome back!')
    navigate({ to: '/' })
    return data
  }

  const signOut = async () => {
    await authService.signOut()
    clearUser()
    navigate({ to: '/login' })
    toast.success('Signed out successfully')
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
