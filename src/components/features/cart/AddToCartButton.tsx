import type { FC } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/store/cartStore'

interface AddToCartButtonProps {
  item: CartItem
  disabled?: boolean
  className?: string
}

export const AddToCartButton: FC<AddToCartButtonProps> = ({
  item,
  disabled,
  className,
}) => {
  const { addToCart } = useCart()

  return (
    <Button
      onClick={() => addToCart(item)}
      disabled={disabled}
      className={className}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}
