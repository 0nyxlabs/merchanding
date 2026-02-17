import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/services/orders.service'
import { QUERY_KEYS } from '@/utils/constants'

export const useOrders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS],
    queryFn: ordersService.getUserOrders,
  })
}

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId,
  })
}
