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
  UserProfile,
  Coupon,
  CreateCouponDto,
  PaginatedResponse,
  SearchParams,
} from '@/types'

interface AdminDashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingDesigns: number
  activeCampaigns: number
  totalUsers: number
  pendingPayouts: number
}

export const adminService = {
  // --- Dashboard ---

  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    console.log('[ADMIN SERVICE] getDashboardStats — obteniendo estadísticas...')
    const { data } = await api.get('/admin/dashboard/stats')
    console.log('[ADMIN SERVICE] getDashboardStats ✅ Stats:', JSON.stringify(data?.data ?? data))
    return data
  },

  // --- Orders ---

  getAllOrders: async (params?: SearchParams): Promise<PaginatedResponse<OrderSummary>> => {
    console.log('[ADMIN SERVICE] getAllOrders — params:', JSON.stringify(params ?? {}))
    const { data } = await api.get('/admin/orders', { params })
    console.log(`[ADMIN SERVICE] getAllOrders ✅ ${data?.data?.length ?? 0} órdenes (total: ${data?.meta?.totalItems ?? '?'})`)
    return data
  },

  getOrderDetail: async (orderId: string): Promise<Order> => {
    console.log(`[ADMIN SERVICE] getOrderDetail — orderId: ${orderId}`)
    const { data } = await api.get(`/admin/orders/${orderId}`)
    console.log(`[ADMIN SERVICE] getOrderDetail ✅ Orden: ${data?.data?.orderNumber ?? data?.orderNumber}`)
    return data
  },

  updateOrderStatus: async (orderId: string, dto: UpdateOrderStatusDto): Promise<Order> => {
    console.log(`[ADMIN SERVICE] updateOrderStatus — orderId: ${orderId}, nuevo status: ${dto.status}`)
    if (dto.trackingNumber) console.log(`[ADMIN SERVICE] updateOrderStatus — tracking: ${dto.trackingNumber}`)
    const { data } = await api.patch(`/admin/orders/${orderId}/status`, dto)
    console.log(`[ADMIN SERVICE] updateOrderStatus ✅ Status actualizado → ${dto.status}`)
    return data
  },

  // --- Designs ---

  getAllDesigns: async (params?: SearchParams & {
    moderationStatus?: string
    campaignId?: string
  }): Promise<PaginatedResponse<Design>> => {
    console.log('[ADMIN SERVICE] getAllDesigns — params:', JSON.stringify(params ?? {}))
    const { data } = await api.get('/admin/designs', { params })
    console.log(`[ADMIN SERVICE] getAllDesigns ✅ ${data?.data?.length ?? 0} diseños`)
    return data
  },

  getPendingDesigns: async (): Promise<Design[]> => {
    console.log('[ADMIN SERVICE] getPendingDesigns — obteniendo diseños pendientes de moderación...')
    const { data } = await api.get('/admin/designs', { params: { moderationStatus: 'pending' } })
    console.log(`[ADMIN SERVICE] getPendingDesigns ✅ ${data?.data?.length ?? data?.length ?? 0} diseños pendientes`)
    return data
  },

  reviewDesign: async (designId: string, dto: ReviewDesignDto): Promise<Design> => {
    console.log(`[ADMIN SERVICE] reviewDesign — designId: ${designId}, acción: ${dto.moderationStatus}`)
    if (dto.rejectionReason) console.log(`[ADMIN SERVICE] reviewDesign — motivo: ${dto.rejectionReason}`)
    const { data } = await api.patch(`/admin/designs/${designId}/review`, dto)
    console.log(`[ADMIN SERVICE] reviewDesign ✅ Diseño ${dto.moderationStatus === 'approved' ? 'aprobado' : 'rechazado/flaggeado'}`)
    return data
  },

  // --- Campaigns ---

  getAllCampaigns: async (params?: SearchParams): Promise<PaginatedResponse<Campaign>> => {
    console.log('[ADMIN SERVICE] getAllCampaigns — params:', JSON.stringify(params ?? {}))
    const { data } = await api.get('/admin/campaigns', { params })
    console.log(`[ADMIN SERVICE] getAllCampaigns ✅ ${data?.data?.length ?? data?.length ?? 0} campañas`)
    return data
  },

  createCampaign: async (dto: CreateCampaignDto): Promise<Campaign> => {
    console.log(`[ADMIN SERVICE] createCampaign — nombre: "${dto.name}", categoría: "${dto.category}"`)
    const { data } = await api.post('/admin/campaigns', dto)
    console.log(`[ADMIN SERVICE] createCampaign ✅ Campaña creada — id: ${data?.data?.id ?? data?.id}`)
    return data
  },

  updateCampaign: async (campaignId: string, dto: UpdateCampaignDto): Promise<Campaign> => {
    console.log(`[ADMIN SERVICE] updateCampaign — campaignId: ${campaignId}, cambios:`, JSON.stringify(dto))
    const { data } = await api.patch(`/admin/campaigns/${campaignId}`, dto)
    console.log(`[ADMIN SERVICE] updateCampaign ✅ Campaña actualizada`)
    return data
  },

  deleteCampaign: async (campaignId: string): Promise<void> => {
    console.log(`[ADMIN SERVICE] deleteCampaign — campaignId: ${campaignId}`)
    await api.delete(`/admin/campaigns/${campaignId}`)
    console.log(`[ADMIN SERVICE] deleteCampaign ✅ Campaña desactivada`)
  },

  // --- Users ---

  getAllUsers: async (params?: SearchParams & { role?: string }): Promise<PaginatedResponse<UserProfile>> => {
    console.log('[ADMIN SERVICE] getAllUsers — params:', JSON.stringify(params ?? {}))
    const { data } = await api.get('/admin/users', { params })
    console.log(`[ADMIN SERVICE] getAllUsers ✅ ${data?.data?.length ?? 0} usuarios`)
    return data
  },

  // --- Coupons ---

  getAllCoupons: async (params?: SearchParams): Promise<PaginatedResponse<Coupon>> => {
    console.log('[ADMIN SERVICE] getAllCoupons — params:', JSON.stringify(params ?? {}))
    const { data } = await api.get('/admin/coupons', { params })
    console.log(`[ADMIN SERVICE] getAllCoupons ✅ ${data?.data?.length ?? 0} cupones`)
    return data
  },

  createCoupon: async (dto: CreateCouponDto): Promise<Coupon> => {
    console.log(`[ADMIN SERVICE] createCoupon — código: "${dto.code}", tipo: ${dto.type}, valor: ${dto.discountValue}`)
    const { data } = await api.post('/admin/coupons', dto)
    console.log(`[ADMIN SERVICE] createCoupon ✅ Cupón creado — id: ${data?.data?.id ?? data?.id}`)
    return data
  },

  deactivateCoupon: async (couponId: string): Promise<void> => {
    console.log(`[ADMIN SERVICE] deactivateCoupon — couponId: ${couponId}`)
    await api.patch(`/admin/coupons/${couponId}/deactivate`)
    console.log(`[ADMIN SERVICE] deactivateCoupon ✅ Cupón desactivado`)
  },
}
