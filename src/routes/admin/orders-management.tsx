import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrdersTable } from '@/components/features/admin/OrdersTable'
import { OrderDetailModal } from '@/components/features/admin/OrderDetailModal'
import { useAdminOrders } from '@/hooks/useAdmin'
import { ORDER_STATUS } from '@/utils/constants'
import { useDebounce } from '@/hooks/useDebounce'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/admin/orders-management')({
  component: OrdersManagementPage,
})

function OrdersManagementPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useAdminOrders({
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Orders Management</h2>
        <p className="mt-1 text-muted-foreground">
          View and manage all customer orders.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Orders</CardTitle>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[200px] pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ORDER_STATUS.PENDING}>Pending</SelectItem>
                  <SelectItem value={ORDER_STATUS.CONFIRMED}>Confirmed</SelectItem>
                  <SelectItem value={ORDER_STATUS.PROCESSING}>Processing</SelectItem>
                  <SelectItem value={ORDER_STATUS.SHIPPED}>Shipped</SelectItem>
                  <SelectItem value={ORDER_STATUS.DELIVERED}>Delivered</SelectItem>
                  <SelectItem value={ORDER_STATUS.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={data?.data}
            isLoading={isLoading}
            onViewOrder={(id) => setSelectedOrderId(id)}
          />
        </CardContent>
      </Card>

      <OrderDetailModal
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId(null)
        }}
      />
    </div>
  )
}
