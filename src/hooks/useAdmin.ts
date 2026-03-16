import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/admin.service'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type {
  SearchParams,
  UpdateOrderStatusDto,
  ReviewDesignDto,
  CreateCampaignDto,
  UpdateCampaignDto,
  CreateCouponDto,
} from '@/types'

// --- Dashboard ---

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminService.getDashboardStats,
  })
}

// --- Orders ---

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
    onSuccess: (_, { dto }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.ORDERS] })
      toast.success(`Order status updated to "${dto.status}"`)
    },
    onError: () => {
      toast.error('Failed to update order status')
    },
  })
}

// --- Designs ---

export const useAdminDesigns = (params?: SearchParams & {
  moderationStatus?: string
  campaignId?: string
}) => {
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
    onSuccess: (_, { dto }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.DESIGNS] })
      toast.success(`Design ${dto.moderationStatus === 'approved' ? 'approved' : 'rejected'}`)
    },
    onError: () => {
      toast.error('Failed to review design')
    },
  })
}

// --- Campaigns ---

export const useAdminCampaigns = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['admin', QUERY_KEYS.CAMPAIGNS, params],
    queryFn: () => adminService.getAllCampaigns(params),
  })
}

export const useAdminCreateCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateCampaignDto) => adminService.createCampaign(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.CAMPAIGNS] })
      toast.success('Campaign created')
    },
    onError: () => {
      toast.error('Failed to create campaign')
    },
  })
}

export const useAdminUpdateCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ campaignId, dto }: { campaignId: string; dto: UpdateCampaignDto }) =>
      adminService.updateCampaign(campaignId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.CAMPAIGNS] })
      toast.success('Campaign updated')
    },
    onError: () => {
      toast.error('Failed to update campaign')
    },
  })
}

export const useAdminDeleteCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (campaignId: string) => adminService.deleteCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.CAMPAIGNS] })
      toast.success('Campaign deactivated')
    },
    onError: () => {
      toast.error('Failed to deactivate campaign')
    },
  })
}

// --- Users ---

export const useAdminUsers = (params?: SearchParams & { role?: string }) => {
  return useQuery({
    queryKey: ['admin', QUERY_KEYS.USER, params],
    queryFn: () => adminService.getAllUsers(params),
  })
}

// --- Coupons ---

export const useAdminCoupons = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['admin', QUERY_KEYS.COUPONS, params],
    queryFn: () => adminService.getAllCoupons(params),
  })
}

export const useCreateCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateCouponDto) => adminService.createCoupon(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.COUPONS] })
      toast.success('Coupon created')
    },
    onError: () => {
      toast.error('Failed to create coupon')
    },
  })
}

export const useDeactivateCoupon = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (couponId: string) => adminService.deactivateCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', QUERY_KEYS.COUPONS] })
      toast.success('Coupon deactivated')
    },
    onError: () => {
      toast.error('Failed to deactivate coupon')
    },
  })
}
