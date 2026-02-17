import type { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/features/orders/OrderStatusBadge'
import { formatDate, formatCurrency } from '@/utils/formatters'
import { Skeleton } from '@/components/ui/skeleton'
import type { OrderSummary } from '@/types'
import { Eye } from 'lucide-react'

interface OrdersTableProps {
  orders: OrderSummary[] | undefined
  isLoading: boolean
  onViewOrder: (orderId: string) => void
}

export const OrdersTable: FC<OrdersTableProps> = ({ orders, isLoading, onViewOrder }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (!orders?.length) {
    return (
      <p className="py-8 text-center text-muted-foreground">No orders found.</p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="w-[70px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.orderNumber}</TableCell>
            <TableCell>{formatDate(order.createdAt)}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell>
              <PaymentStatusBadge status={order.paymentStatus} />
            </TableCell>
            <TableCell>{order.itemCount}</TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(order.total)}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm" onClick={() => onViewOrder(order.id)}>
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
