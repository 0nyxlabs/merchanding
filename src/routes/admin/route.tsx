import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw redirect({ to: '/login' })
    }

    const { isAdmin } = useAuthStore.getState()
    if (!isAdmin()) {
      throw redirect({ to: '/' })
    }
  },
  component: () => <Outlet />,
})
