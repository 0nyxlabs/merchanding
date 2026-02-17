import type { FC } from 'react'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { formatCurrency } from '@/utils/formatters'
import type { OrderItem } from '@/types'

interface OrderItemsListProps {
  items: OrderItem[]
}

export const OrderItemsList: FC<OrderItemsListProps> = ({ items }) => {
  return (
    <div className="divide-y">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 py-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.productName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 justify-between">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-muted-foreground">
                {item.size} / {item.color} &middot; Qty: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(item.unitPrice)} each
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
