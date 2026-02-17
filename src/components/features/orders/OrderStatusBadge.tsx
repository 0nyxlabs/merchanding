import type { FC } from 'react'
import { Badge } from '@/components/ui/badge'
import type { OrderStatus, PaymentStatus } from '@/types'

const orderStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  processing: { label: 'Processing', variant: 'default' },
  shipped: { label: 'Shipped', variant: 'outline' },
  delivered: { label: 'Delivered', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

const paymentStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Payment Pending', variant: 'secondary' },
  paid: { label: 'Paid', variant: 'default' },
  failed: { label: 'Payment Failed', variant: 'destructive' },
  refunded: { label: 'Refunded', variant: 'outline' },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export const OrderStatusBadge: FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const config = orderStatusConfig[status] ?? { label: status, variant: 'outline' as const }
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

export const PaymentStatusBadge: FC<PaymentStatusBadgeProps> = ({ status, className }) => {
  const config = paymentStatusConfig[status] ?? { label: status, variant: 'outline' as const }
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
