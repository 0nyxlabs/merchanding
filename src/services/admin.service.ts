import { api } from './api'
import type {
  Order,
  OrderSummary,
  UpdateOrderStatusDto,
  Design,
  ReviewDesignDto,
  Campaign,
  CreateCampaignDto,
  UpdateCampaignDto,
  PaginatedResponse,
  SearchParams,
} from '@/types'

export const adminService = {
  // Orders
  getAllOrders: async (params?: SearchParams): Promise<PaginatedResponse<OrderSummary>> => {
    const { data } = await api.get('/admin/orders', { params })
    return data
  },

  getOrderDetail: async (orderId: string): Promise<Order> => {
    const { data } = await api.get(`/admin/orders/${orderId}`)
    return data
  },

  updateOrderStatus: async (orderId: string, dto: UpdateOrderStatusDto): Promise<Order> => {
    const { data } = await api.patch(`/admin/orders/${orderId}/status`, dto)
    return data
  },

  // Designs
  getPendingDesigns: async (): Promise<Design[]> => {
    const { data } = await api.get('/admin/designs', { params: { status: 'pending' } })
    return data
  },

  getAllDesigns: async (params?: SearchParams): Promise<Design[]> => {
    const { data } = await api.get('/admin/designs', { params })
    return data
  },

  reviewDesign: async (designId: string, dto: ReviewDesignDto): Promise<Design> => {
    const { data } = await api.patch(`/admin/designs/${designId}/review`, dto)
    return data
  },

  // Campaigns
  getAllCampaigns: async (): Promise<Campaign[]> => {
    const { data } = await api.get('/admin/campaigns')
    return data
  },

  createCampaign: async (dto: CreateCampaignDto): Promise<Campaign> => {
    const { data } = await api.post('/admin/campaigns', dto)
    return data
  },

  updateCampaign: async (campaignId: string, dto: UpdateCampaignDto): Promise<Campaign> => {
    const { data } = await api.patch(`/admin/campaigns/${campaignId}`, dto)
    return data
  },

  deleteCampaign: async (campaignId: string): Promise<void> => {
    await api.delete(`/admin/campaigns/${campaignId}`)
  },

  // Dashboard stats
  getDashboardStats: async (): Promise<{
    totalOrders: number
    totalRevenue: number
    pendingDesigns: number
    activeCampaigns: number
  }> => {
    const { data } = await api.get('/admin/dashboard/stats')
    return data
  },
}
