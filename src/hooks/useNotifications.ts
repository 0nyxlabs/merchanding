import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsService } from '@/services/notifications.service'
import { QUERY_KEYS } from '@/utils/constants'
import type { MarkNotificationsReadDto } from '@/types'

// --- Notifications list ---

export const useNotifications = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: () => {
      console.log('[USE NOTIFICATIONS] useNotifications — cargando notificaciones...')
      return notificationsService.getNotifications()
    },
  })
}

// --- Unread count (for badge) ---

export const useUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, 'unread-count'],
    queryFn: notificationsService.getUnreadCount,
    refetchInterval: 30 * 1000, // poll every 30s
  })
}

// --- Mark as read ---

export const useMarkNotificationsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: MarkNotificationsReadDto) => notificationsService.markAsRead(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
    },
  })
}

// --- Mark all as read ---

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] })
    },
  })
}
