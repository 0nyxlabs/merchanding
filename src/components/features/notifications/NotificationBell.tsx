import { useState, useRef, useEffect, type FC } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotificationDropdown } from './NotificationDropdown'
import { useNotifications, useUnreadNotificationsCount } from '@/hooks/useNotifications'

export const NotificationBell: FC = () => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data: notifications } = useNotifications()
  const { data: unreadCount } = useUnreadNotificationsCount()

  const notifList = (notifications as { data?: unknown[] })?.data ?? (Array.isArray(notifications) ? notifications : [])
  const count = unreadCount ?? 0

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
          >
            {count > 99 ? '99+' : count}
          </Badge>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2">
          <NotificationDropdown
            notifications={notifList as Parameters<typeof NotificationDropdown>[0]['notifications']}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
