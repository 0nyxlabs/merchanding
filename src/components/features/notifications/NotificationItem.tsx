import type { FC } from 'react'
import { Bell, Heart, MessageSquare, Package, DollarSign } from 'lucide-react'
import { formatDate } from '@/utils/formatters'
import { NOTIFICATION_TYPE } from '@/utils/constants'
import type { Notification } from '@/types'

const iconMap: Record<string, React.ReactNode> = {
  [NOTIFICATION_TYPE.VOTE]: <Heart className="h-4 w-4 text-pink-500" />,
  [NOTIFICATION_TYPE.COMMENT]: <MessageSquare className="h-4 w-4 text-blue-500" />,
  [NOTIFICATION_TYPE.DESIGN_APPROVED]: <Package className="h-4 w-4 text-green-500" />,
  [NOTIFICATION_TYPE.DESIGN_REJECTED]: <Package className="h-4 w-4 text-destructive" />,
  [NOTIFICATION_TYPE.ORDER_UPDATE]: <Package className="h-4 w-4 text-orange-500" />,
  [NOTIFICATION_TYPE.CAMPAIGN_UPDATE]: <Bell className="h-4 w-4 text-purple-500" />,
  [NOTIFICATION_TYPE.PAYOUT]: <DollarSign className="h-4 w-4 text-green-600" />,
  [NOTIFICATION_TYPE.SYSTEM]: <Bell className="h-4 w-4 text-muted-foreground" />,
}

interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
}

export const NotificationItem: FC<NotificationItemProps> = ({ notification, onRead }) => {
  const icon = iconMap[notification.type] ?? <Bell className="h-4 w-4 text-muted-foreground" />

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent ${
        !notification.read ? 'bg-accent/50' : ''
      }`}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  )
}
