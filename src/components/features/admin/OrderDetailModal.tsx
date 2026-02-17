import type { FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/features/orders/OrderStatusBadge'
import { StatusUpdateForm } from './StatusUpdateForm'
import { formatDate, formatCurrency } from '@/utils/formatters'
import { useAdminOrderDetail, useUpdateOrderStatus } from '@/hooks/useAdmin'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'

interface OrderDetailModalProps {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const OrderDetailModal: FC<OrderDetailModalProps> = ({
  orderId,
  open,
  onOpenChange,
}) => {
  const { data: order, isLoading } = useAdminOrderDetail(orderId ?? '')
  const updateStatus = useUpdateOrderStatus()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {isLoading || !order ? (
          <>
            <DialogHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </DialogHeader>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Order #{order.orderNumber}</DialogTitle>
              <DialogDescription>
                Placed on {formatDate(order.createdAt)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-2">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>

            <Separator />

            {/* Items */}
            <div>
              <h4 className="mb-2 text-sm font-semibold">Items ({order.items.length})</h4>
              <div className="divide-y rounded-md border">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded">
                      <ImageWithFallback
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-muted-foreground">
                        {item.size} / {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">{formatCurrency(item.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="mb-1 text-sm font-semibold">Shipping Address</h4>
              <div className="text-sm text-muted-foreground">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <Separator />

            {/* Status Update */}
            <div>
              <h4 className="mb-2 text-sm font-semibold">Update Status</h4>
              <StatusUpdateForm
                currentStatus={order.status}
                isPending={updateStatus.isPending}
                onSubmit={(dto) =>
                  updateStatus.mutate(
                    { orderId: order.id, dto },
                    { onSuccess: () => onOpenChange(false) },
                  )
                }
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
