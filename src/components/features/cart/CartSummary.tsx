import type { FC } from 'react'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/utils/formatters'
import type { CartTotals } from '@/types'

interface CartSummaryProps {
  totals: CartTotals
}

export const CartSummary: FC<CartSummaryProps> = ({ totals }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatCurrency(totals.subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Tax</span>
        <span>{formatCurrency(totals.tax)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatCurrency(totals.total)}</span>
      </div>
    </div>
  )
}
