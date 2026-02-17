import type { CartItem } from '@/store/cartStore'

export type { CartItem }

export interface CartItemWithDetails extends CartItem {
  productName: string
  size: string
  color: string
  maxStock: number
}

export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  total: number
  itemCount: number
}

export interface CreateCheckoutDto {
  items: CartItem[]
  shippingAddressId: string
}
