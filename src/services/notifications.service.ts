import { api } from './api'
import type { Notification, MarkNotificationsReadDto } from '@/types'

export const notificationsService = {
  // --- notifications table ---

  getNotifications: async (): Promise<Notification[]> => {
    console.log('[NOTIFICATIONS SERVICE] getNotifications — obteniendo notificaciones...')
    const { data } = await api.get('/notifications')
    console.log(`[NOTIFICATIONS SERVICE] getNotifications ✅ ${data?.data?.length ?? data?.length ?? 0} notificaciones`)
    return data
  },

  getUnreadCount: async (): Promise<number> => {
    console.log('[NOTIFICATIONS SERVICE] getUnreadCount — obteniendo conteo de no leídas...')
    const { data } = await api.get('/notifications/unread-count')
    console.log(`[NOTIFICATIONS SERVICE] getUnreadCount ✅ No leídas: ${data?.data?.count ?? data?.count ?? 0}`)
    return data?.data?.count ?? data?.count ?? 0
  },

  markAsRead: async (dto: MarkNotificationsReadDto): Promise<void> => {
    console.log(`[NOTIFICATIONS SERVICE] markAsRead — ids: ${dto.notificationIds.join(', ')}`)
    await api.patch('/notifications/read', { ids: dto.notificationIds })
    console.log(`[NOTIFICATIONS SERVICE] markAsRead ✅ ${dto.notificationIds.length} notificaciones marcadas como leídas`)
  },

  markAllAsRead: async (): Promise<void> => {
    console.log('[NOTIFICATIONS SERVICE] markAllAsRead — marcando todas como leídas...')
    await api.patch('/notifications/read-all')
    console.log('[NOTIFICATIONS SERVICE] markAllAsRead ✅ Todas marcadas como leídas')
  },
}
