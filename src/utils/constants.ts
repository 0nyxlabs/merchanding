export const APP_NAME = 'Merchanding'

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const DESIGN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const QUERY_KEYS = {
  ORDERS: 'orders',
  DESIGNS: 'designs',
  CAMPAIGNS: 'campaigns',
  PRODUCTS: 'products',
  USER: 'user',
} as const
