import { api } from './api'
import type { Order, OrderSummary, CreateOrderDto } from '@/types'

export const ordersService = {
  getUserOrders: async (): Promise<OrderSummary[]> => {
    const { data } = await api.get('/orders')
    return data
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${orderId}`)
    return data
  },

  createOrder: async (orderData: CreateOrderDto): Promise<Order> => {
    const { data } = await api.post('/orders', orderData)
    return data
  },

  trackOrder: async (orderId: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${orderId}/track`)
    return data
  },
}
