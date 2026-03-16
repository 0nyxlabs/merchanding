import { api } from './api'
import type {
  Order,
  OrderSummary,
  OrderItem,
  OrderStatusHistory,
  CreateOrderDto,
} from '@/types'

export const ordersService = {
  // --- User orders ---

  getUserOrders: async (): Promise<OrderSummary[]> => {
    console.log('[ORDERS SERVICE] getUserOrders — obteniendo órdenes del usuario...')
    const { data } = await api.get('/orders')
    console.log(`[ORDERS SERVICE] getUserOrders ✅ ${data?.data?.length ?? data?.length ?? 0} órdenes recibidas`)
    return data
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    console.log(`[ORDERS SERVICE] getOrderById — id: ${orderId}`)
    const { data } = await api.get(`/orders/${orderId}`)
    console.log(`[ORDERS SERVICE] getOrderById ✅ Orden: ${data?.data?.orderNumber ?? data?.orderNumber}, status: ${data?.data?.status ?? data?.status}`)
    return data
  },

  // --- Order items (order_items table) ---

  getOrderItems: async (orderId: string): Promise<OrderItem[]> => {
    console.log(`[ORDERS SERVICE] getOrderItems — orderId: ${orderId}`)
    const { data } = await api.get(`/orders/${orderId}/items`)
    console.log(`[ORDERS SERVICE] getOrderItems ✅ ${data?.data?.length ?? data?.length ?? 0} items`)
    return data
  },

  // --- Order status history (order_status_history table) ---

  getOrderStatusHistory: async (orderId: string): Promise<OrderStatusHistory[]> => {
    console.log(`[ORDERS SERVICE] getOrderStatusHistory — orderId: ${orderId}`)
    const { data } = await api.get(`/orders/${orderId}/history`)
    console.log(`[ORDERS SERVICE] getOrderStatusHistory ✅ ${data?.data?.length ?? data?.length ?? 0} eventos`)
    return data
  },

  // --- Create / track ---

  createOrder: async (dto: CreateOrderDto): Promise<Order> => {
    console.log(`[ORDERS SERVICE] createOrder — campaignId: ${dto.campaignId}, items: ${dto.items.length}`)
    console.log(`[ORDERS SERVICE] createOrder — envío: ${dto.shippingAddress.city}, ${dto.shippingAddress.country}`)
    const { data } = await api.post('/orders', dto)
    console.log(`[ORDERS SERVICE] createOrder ✅ Orden creada — número: ${data?.data?.orderNumber ?? data?.orderNumber}`)
    return data
  },

  trackOrder: async (orderId: string): Promise<Order> => {
    console.log(`[ORDERS SERVICE] trackOrder — id: ${orderId}`)
    const { data } = await api.get(`/orders/${orderId}/track`)
    console.log(`[ORDERS SERVICE] trackOrder ✅ Estado: ${data?.data?.status ?? data?.status}, tracking: ${data?.data?.trackingNumber ?? data?.trackingNumber ?? 'N/A'}`)
    return data
  },
}
