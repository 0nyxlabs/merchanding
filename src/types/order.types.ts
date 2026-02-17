import type { ORDER_STATUS } from '@/utils/constants'

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  imageUrl: string
  size: string
  color: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderTrackingEvent {
  status: OrderStatus
  timestamp: string
  description: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  stripePaymentIntentId?: string
  trackingEvents: OrderTrackingEvent[]
  createdAt: string
  updatedAt: string
}

export interface OrderSummary {
  id: string
  orderNumber: string
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  itemCount: number
  createdAt: string
}

export interface CreateOrderDto {
  items: {
    productId: string
    variantId: string
    quantity: number
  }[]
  shippingAddress: ShippingAddress
}

export interface UpdateOrderStatusDto {
  status: OrderStatus
  description?: string
}
