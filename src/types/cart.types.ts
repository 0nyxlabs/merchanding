import type { CartItem } from '@/store/cartStore'

export type { CartItem }

export interface CartItemWithDetails extends CartItem {
  campaignName: string
  productType: string
  thumbnailUrl?: string
  maxStock: number
}

export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  itemCount: number
}

export interface CreateCheckoutDto {
  items: CartItem[]
  shippingAddress: {
    fullName: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  shippingMethod: string
  couponCode?: string
}
