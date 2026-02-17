import type { FC } from 'react'
import { Separator } from '@/components/ui/separator'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { formatCurrency } from '@/utils/formatters'
import { CartSummary } from '@/components/features/cart/CartSummary'
import type { CartItem } from '@/store/cartStore'
import type { CartTotals } from '@/types'

interface OrderSummaryProps {
  items: CartItem[]
  totals: CartTotals
}

export const OrderSummary: FC<OrderSummaryProps> = ({ items, totals }) => {
  return (
    <div className="rounded-xl border p-6">
      <h3 className="mb-4 font-semibold">Order Summary</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md">
              <ImageWithFallback
                src={item.image ?? ''}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 justify-between">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />
      <CartSummary totals={totals} />
    </div>
  )
}
