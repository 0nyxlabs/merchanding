import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/features/orders/OrderStatusBadge'
import { OrderItemsList } from '@/components/features/orders/OrderItemsList'
import { OrderTracking } from '@/components/features/orders/OrderTracking'
import { EmptyState } from '@/components/shared/EmptyState'
import { useOrder } from '@/hooks/useOrders'
import { formatDate, formatCurrency } from '@/utils/formatters'

export const Route = createFileRoute('/_authenticated/orders/$orderId')({
  component: OrderDetailPage,
})

function OrderDetailPage() {
  const { orderId } = Route.useParams()
  const { data: order, isLoading } = useOrder(orderId)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Skeleton className="mb-6 h-4 w-32" />
        <Skeleton className="mb-4 h-9 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <EmptyState
          title="Order not found"
          description="The order you're looking for doesn't exist."
          action={
            <Button asChild>
              <Link to="/orders">Back to Orders</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        to="/orders"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Order header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderItemsList items={order.items} />
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTracking events={order.trackingEvents} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && (
                <p className="text-muted-foreground">{order.shippingAddress.line2}</p>
              )}
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.country}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
