import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { toast } from 'react-hot-toast'
import type { CartItem } from '@/store/cartStore'
import type { CartTotals } from '@/types'

const SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 5.99
const TAX_RATE = 0.08

export const useCart = () => {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const getTotalItems = useCartStore((s) => s.getTotalItems)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const { openCartDrawer } = useUIStore()

  const addToCart = (item: CartItem) => {
    addItem(item)
    toast.success(`${item.name} added to cart`)
    openCartDrawer()
  }

  const removeFromCart = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    removeItem(itemId)
    if (item) {
      toast.success(`${item.name} removed from cart`)
    }
  }

  const calculateTotals = (): CartTotals => {
    const subtotal = getTotalPrice()
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const tax = subtotal * TAX_RATE
    const total = subtotal + shipping + tax
    const itemCount = getTotalItems()

    return { subtotal, shipping, tax, total, itemCount }
  }

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    calculateTotals,
    isEmpty: items.length === 0,
  }
}
