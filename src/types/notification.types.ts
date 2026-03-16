import type { NOTIFICATION_TYPE } from '@/utils/constants'

export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE]

// Represents the notifications table
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  linkUrl?: string
  campaignId?: string
  designId?: string
  orderId?: string
  commentId?: string
  read: boolean
  readAt?: string
  createdAt: string
}

export interface MarkNotificationsReadDto {
  notificationIds: string[]
}
