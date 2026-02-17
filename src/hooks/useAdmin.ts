import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/admin.service'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { SearchParams, UpdateOrderStatusDto, ReviewDesignDto } from '@/types'

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminService.getDashboardStats,
  })
}

export const useAdminOrders = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['admin', QUERY_KEYS.ORDERS, params],
    queryFn: () => adminService.getAllOrders(params),
  })
}

export const useAdminOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['admin', QUERY_KEYS.ORDERS, orderId],
    queryFn: () => adminService.getOrderDetail(orderId),
    enabled: !!orderId,
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, dto }: { orderId: string; dto: UpdateOrderStatusDto }) =>
      adminService.updateOrderStatus(orderId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.ORDERS] })
      toast.success('Order status updated')
    },
    onError: () => {
      toast.error('Failed to update order status')
    },
  })
}

export const useAdminDesigns = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['admin', QUERY_KEYS.DESIGNS, params],
    queryFn: () => adminService.getAllDesigns(params),
  })
}

export const useReviewDesign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ designId, dto }: { designId: string; dto: ReviewDesignDto }) =>
      adminService.reviewDesign(designId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.DESIGNS] })
      toast.success('Design reviewed')
    },
    onError: () => {
      toast.error('Failed to review design')
    },
  })
}

export const useAdminCampaigns = () => {
  return useQuery({
    queryKey: ['admin', QUERY_KEYS.CAMPAIGNS],
    queryFn: adminService.getAllCampaigns,
  })
}
