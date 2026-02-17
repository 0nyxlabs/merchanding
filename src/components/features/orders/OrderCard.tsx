import type { FC } from 'react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from './OrderStatusBadge'
import { formatDate, formatCurrency } from '@/utils/formatters'
import type { OrderSummary } from '@/types'

interface OrderCardProps {
  order: OrderSummary
}

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">#{order.orderNumber}</p>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.createdAt)} &middot; {order.itemCount}{' '}
            {order.itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/orders/$orderId" params={{ orderId: order.id }}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
