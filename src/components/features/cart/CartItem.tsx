import type { FC } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/shared/ImageWithFallback'
import { formatCurrency } from '@/utils/formatters'
import type { CartItem as CartItemType } from '@/store/cartStore'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export const CartItem: FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="flex gap-4 py-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <ImageWithFallback
          src={item.image ?? ''}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium leading-tight">{item.name}</h4>
          <p className="mt-0.5 text-sm font-semibold">{formatCurrency(item.price)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
