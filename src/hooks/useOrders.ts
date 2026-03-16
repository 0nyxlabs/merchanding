import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersService } from '@/services/orders.service'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { CreateOrderDto } from '@/types'

// --- User orders list ---

export const useOrders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: ordersService.getUserOrders,
  })
}

// --- Single order ---

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId,
  })
}

// --- Order items (order_items table) ---

export const useOrderItems = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, orderId, 'items'],
    queryFn: () => ordersService.getOrderItems(orderId),
    enabled: !!orderId,
  })
}

// --- Order status history (order_status_history table) ---

export const useOrderStatusHistory = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, orderId, 'history'],
    queryFn: () => ordersService.getOrderStatusHistory(orderId),
    enabled: !!orderId,
  })
}

// --- Track order ---

export const useTrackOrder = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, orderId, 'track'],
    queryFn: () => ordersService.trackOrder(orderId),
    enabled: !!orderId,
    refetchInterval: 60 * 1000, // refetch every 60s for live tracking
  })
}

// --- Create order ---

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateOrderDto) => {
      console.log(`[USE ORDERS] useCreateOrder — campaignId: ${dto.campaignId}, items: ${dto.items.length}`)
      return ordersService.createOrder(dto)
    },
    onSuccess: (data) => {
      console.log(`[USE ORDERS] useCreateOrder ✅ Orden creada — número: ${data.orderNumber}`)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] })
      toast.success('Order placed successfully!')
    },
    onError: (error) => {
      console.error('[USE ORDERS] useCreateOrder ❌ Error:', error)
      toast.error('Failed to place order')
    },
  })
}
