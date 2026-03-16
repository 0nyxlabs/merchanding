import { api } from './api'
import type {
  Campaign,
  CampaignSummary,
  CampaignUpdate,
  CreateCampaignUpdateDto,
  SearchParams,
} from '@/types'
import type { CampaignProduct } from '@/types'

export const campaignsService = {
  // --- Campaigns ---

  getCampaigns: async (params?: SearchParams & {
    category?: string
    featured?: boolean
  }): Promise<CampaignSummary[]> => {
    console.log('[CAMPAIGNS SERVICE] getCampaigns — params:', JSON.stringify(params ?? {}))
    const { data } = await api.get('/campaigns', { params })
    console.log(`[CAMPAIGNS SERVICE] getCampaigns ✅ ${Array.isArray(data) ? data.length : 0} campañas recibidas`)
    return data as CampaignSummary[]
  },

  getCampaignById: async (campaignId: string): Promise<Campaign> => {
    console.log(`[CAMPAIGNS SERVICE] getCampaignById — id: ${campaignId}`)
    const { data } = await api.get(`/campaigns/${campaignId}`)
    console.log(`[CAMPAIGNS SERVICE] getCampaignById ✅ Campaña: "${(data as Campaign)?.name}"`)
    return data as Campaign
  },

  getCampaignBySlug: async (slug: string): Promise<Campaign> => {
    console.log(`[CAMPAIGNS SERVICE] getCampaignBySlug — slug: ${slug}`)
    const { data } = await api.get(`/campaigns/slug/${slug}`)
    console.log(`[CAMPAIGNS SERVICE] getCampaignBySlug ✅ Campaña: "${(data as Campaign)?.name}"`)
    return data as Campaign
  },

  // --- Campaign Products (campaign_products table) ---

  getCampaignProducts: async (campaignId: string): Promise<CampaignProduct[]> => {
    console.log(`[CAMPAIGNS SERVICE] getCampaignProducts — campaignId: ${campaignId}`)
    const { data } = await api.get(`/campaigns/${campaignId}/products`)
    console.log(`[CAMPAIGNS SERVICE] getCampaignProducts ✅ ${Array.isArray(data) ? data.length : 0} productos`)
    return data as CampaignProduct[]
  },

  getCampaignProductById: async (_campaignId: string, productId: string): Promise<CampaignProduct> => {
    console.log(`[CAMPAIGNS SERVICE] getCampaignProductById — productId: ${productId}`)
    const { data } = await api.get(`/products/${productId}`)
    console.log(`[CAMPAIGNS SERVICE] getCampaignProductById ✅ Producto: ${(data as CampaignProduct)?.productType}`)
    return data as CampaignProduct
  },

  // --- Campaign Updates (campaign_updates table) ---

  getCampaignUpdates: async (campaignId: string): Promise<CampaignUpdate[]> => {
    console.log(`[CAMPAIGNS SERVICE] getCampaignUpdates — campaignId: ${campaignId}`)
    const { data } = await api.get(`/campaigns/${campaignId}/updates`)
    console.log(`[CAMPAIGNS SERVICE] getCampaignUpdates ✅ ${Array.isArray(data) ? data.length : 0} updates`)
    return data as CampaignUpdate[]
  },

  createCampaignUpdate: async (campaignId: string, dto: CreateCampaignUpdateDto): Promise<CampaignUpdate> => {
    console.log(`[CAMPAIGNS SERVICE] createCampaignUpdate — campaignId: ${campaignId}, título: "${dto.title ?? '(sin título)'}"`)
    const { data } = await api.post(`/campaigns/${campaignId}/updates`, dto)
    console.log(`[CAMPAIGNS SERVICE] createCampaignUpdate ✅ Update creado`)
    return data as CampaignUpdate
  },
}
