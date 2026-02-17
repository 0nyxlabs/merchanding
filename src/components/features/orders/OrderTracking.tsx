import type { FC } from 'react'
import { CheckCircle, Circle } from 'lucide-react'
import { formatDateTime } from '@/utils/formatters'
import type { OrderTrackingEvent } from '@/types'

interface OrderTrackingProps {
  events: OrderTrackingEvent[]
}

export const OrderTracking: FC<OrderTrackingProps> = ({ events }) => {
  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground">No tracking information available.</p>
    )
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const isLast = index === events.length - 1
        const isFirst = index === 0

        return (
          <div key={`${event.status}-${event.timestamp}`} className="flex gap-3">
            {/* Timeline line + icon */}
            <div className="flex flex-col items-center">
              {isFirst ? (
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              {!isLast && <div className="w-px flex-1 bg-border" />}
            </div>

            {/* Content */}
            <div className="pb-6">
              <p className="text-sm font-medium capitalize">{event.status}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(event.timestamp)}
              </p>
              {event.description && (
                <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
