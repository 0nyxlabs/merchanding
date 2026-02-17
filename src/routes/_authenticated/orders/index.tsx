import { createFileRoute } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { OrderCard } from '@/components/features/orders/OrderCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { useOrders } from '@/hooks/useOrders'

export const Route = createFileRoute('/_authenticated/orders/')({
  component: OrdersPage,
})

function OrdersPage() {
  const { data: orders, isLoading } = useOrders()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight">My Orders</h2>
      <p className="mt-2 text-muted-foreground">View and track your orders.</p>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : !orders?.length ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No orders yet"
            description="Your order history will appear here once you make a purchase."
          />
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  )
}
