import type { ORDER_STATUS, PAYMENT_STATUS } from '@/utils/constants'

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

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

// Represents the order_items table
export interface OrderItem {
  id: string
  orderId: string
  campaignProductId: string
  productType: string
  designTitle: string
  designThumbnailUrl?: string
  designId?: string
  size: string
  color?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: string
}

// Represents the order_status_history table
export interface OrderStatusHistory {
  id: string
  orderId: string
  status: OrderStatus
  changedBy?: string
  notes?: string
  trackingNumber?: string
  createdAt: string
}

// Represents the orders table
export interface Order {
  id: string
  orderNumber: string
  userId?: string
  campaignId: string
  customerEmail: string
  customerName: string
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  shippingMethod: string
  shippingCost: number
  subtotal: number
  tax: number
  discount: number
  total: number
  stripePaymentIntentId?: string
  paymentMethod?: string
  paymentStatus: PaymentStatus
  printfulOrderId?: number
  trackingNumber?: string
  trackingUrl?: string
  shippedAt?: string
  deliveredAt?: string
  status: OrderStatus
  cancelledAt?: string
  cancellationReason?: string
  refundedAt?: string
  refundAmount?: number
  createdAt: string
  updatedAt: string
}

export interface OrderSummary {
  id: string
  orderNumber: string
  campaignId: string
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  itemCount: number
  createdAt: string
}

export interface CreateOrderDto {
  campaignId: string
  items: {
    campaignProductId: string
    size: string
    color?: string
    quantity: number
  }[]
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  shippingMethod: string
  couponCode?: string
}

export interface UpdateOrderStatusDto {
  status: OrderStatus
  notes?: string
  trackingNumber?: string
}
