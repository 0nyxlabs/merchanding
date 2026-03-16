import { useState, type FC } from 'react'
import { Tag, X } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { formatCurrency } from '@/utils/formatters'
import { CartSummary } from '@/components/features/cart/CartSummary'
import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/store/cartStore'
import type { CartTotals } from '@/types'

interface OrderSummaryProps {
  items: CartItem[]
  totals: CartTotals
}

export const OrderSummary: FC<OrderSummaryProps> = ({ items, totals }) => {
  const { applyCoupon, removeCoupon, couponCode } = useCart()
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return
    setIsApplying(true)
    await applyCoupon(code.trim())
    setIsApplying(false)
    setCode('')
  }

  return (
    <div className="rounded-xl border p-6">
      <h3 className="mb-4 font-semibold">Order Summary</h3>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md">
              <ImageWithFallback
                src={item.thumbnailUrl ?? ''}
                alt={item.designTitle}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 justify-between">
              <div>
                <p className="text-sm font-medium">{item.designTitle}</p>
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

      {/* Coupon input */}
      {couponCode ? (
        <div className="mb-4 flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm dark:bg-green-950/20">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Tag className="h-4 w-4" />
            <span className="font-medium">{couponCode}</span>
          </div>
          <button
            onClick={removeCoupon}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className="h-9 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleApply}
            disabled={!code.trim() || isApplying}
            className="shrink-0"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </Button>
        </div>
      )}

      <CartSummary totals={totals} />
    </div>
  )
}
