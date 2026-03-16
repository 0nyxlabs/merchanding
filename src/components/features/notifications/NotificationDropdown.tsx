import type { FC } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { NotificationItem } from './NotificationItem'
import { useMarkNotificationsRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications'
import type { Notification } from '@/types'

interface NotificationDropdownProps {
  notifications: Notification[]
  onClose: () => void
}

export const NotificationDropdown: FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
}) => {
  const markRead = useMarkNotificationsRead()
  const markAllRead = useMarkAllNotificationsRead()

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleRead = (id: string) => {
    markRead.mutate({ notificationIds: [id] })
  }

  const handleMarkAll = () => {
    markAllRead.mutate()
    onClose()
  }

  return (
    <div className="w-80 rounded-xl border bg-background shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={handleMarkAll}
            disabled={markAllRead.isPending}
          >
            <Check className="mr-1 h-3 w-3" />
            Mark all read
          </Button>
        )}
      </div>
      <Separator />
      {notifications.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          No notifications yet
        </p>
      ) : (
        <div className="max-h-80 overflow-y-auto divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={handleRead}
            />
          ))}
        </div>
      )}
    </div>
  )
}
