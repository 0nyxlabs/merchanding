import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { couponsService } from '@/services/coupons.service'
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
  const discount = useCartStore((s) => s.discount)
  const couponCode = useCartStore((s) => s.couponCode)
  const setCoupon = useCartStore((s) => s.setCoupon)
  const clearCoupon = useCartStore((s) => s.clearCoupon)
  const { openCartDrawer } = useUIStore()

  const addToCart = (item: CartItem) => {
    const existing = items.find((i) => i.id === item.id && i.size === item.size && i.color === item.color)
    console.log(`[USE CART] addToCart — "${item.designTitle}" (${item.productType}, ${item.size}) id: ${item.id}, precio: $${item.price}`)
    if (existing) {
      console.log(`[USE CART] addToCart — producto ya existe en carrito, incrementando cantidad (actual: ${existing.quantity})`)
    } else {
      console.log(`[USE CART] addToCart — nuevo producto añadido al carrito`)
    }
    addItem(item)
    toast.success(`${item.designTitle} added to cart`)
    openCartDrawer()
    console.log(`[USE CART] addToCart ✅ Carrito actualizado — total items: ${getTotalItems() + 1}`)
  }

  const removeFromCart = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    console.log(`[USE CART] removeFromCart — id: ${itemId}, producto: "${item?.designTitle ?? 'desconocido'}"`)
    removeItem(itemId)
    if (item) {
      toast.success(`${item.designTitle} removed from cart`)
      console.log(`[USE CART] removeFromCart ✅ Producto eliminado del carrito`)
    }
  }

  const calculateTotals = (): CartTotals => {
    const subtotal = getTotalPrice()
    const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const tax = subtotal * TAX_RATE
    const total = subtotal + shipping + tax - discount
    const itemCount = getTotalItems()

    console.log(`[USE CART] calculateTotals — subtotal: $${subtotal.toFixed(2)}, envío: $${shipping.toFixed(2)}, impuesto: $${tax.toFixed(2)}, descuento: $${discount.toFixed(2)}, TOTAL: $${total.toFixed(2)}, items: ${itemCount}`)
    return { subtotal, shipping, tax, discount, total, itemCount }
  }

  const applyCoupon = async (code: string) => {
    const subtotal = getTotalPrice()
    console.log(`[USE CART] applyCoupon — código: "${code}", subtotal: $${subtotal}`)
    try {
      const result = await couponsService.validateCoupon(code, subtotal)
      if (result.valid && result.discountAmount != null) {
        setCoupon(code, result.discountAmount)
        toast.success(`Coupon applied! -$${result.discountAmount.toFixed(2)}`)
        console.log(`[USE CART] applyCoupon ✅ Descuento aplicado: $${result.discountAmount}`)
      } else {
        toast.error(result.message ?? 'Invalid coupon code')
        console.warn(`[USE CART] applyCoupon ❌ Cupón inválido: ${result.message}`)
      }
    } catch {
      toast.error('Failed to validate coupon')
    }
  }

  const removeCoupon = () => {
    clearCoupon()
    toast.success('Coupon removed')
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
    applyCoupon,
    removeCoupon,
    couponCode,
    discount,
    isEmpty: items.length === 0,
  }
}
