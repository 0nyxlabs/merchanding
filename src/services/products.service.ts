import { api } from './api'
import type {
  CampaignProduct,
  CreateCampaignProductDto,
  UpdateCampaignProductDto,
} from '@/types'

export const productsService = {
  // --- campaign_products table ---

  getCampaignProducts: async (campaignId: string): Promise<CampaignProduct[]> => {
    console.log(`[PRODUCTS SERVICE] getCampaignProducts — campaignId: ${campaignId}`)
    const { data } = await api.get(`/campaigns/${campaignId}/products`)
    console.log(`[PRODUCTS SERVICE] getCampaignProducts ✅ ${data?.data?.length ?? data?.length ?? 0} productos recibidos`)
    return data
  },

  getCampaignProductById: async (productId: string): Promise<CampaignProduct> => {
    console.log(`[PRODUCTS SERVICE] getCampaignProductById — id: ${productId}`)
    const { data } = await api.get(`/products/${productId}`)
    console.log(`[PRODUCTS SERVICE] getCampaignProductById ✅ Producto: "${data?.data?.productType ?? data?.productType}", status: ${data?.data?.status ?? data?.status}`)
    return data
  },

  createCampaignProduct: async (dto: CreateCampaignProductDto): Promise<CampaignProduct> => {
    console.log(`[PRODUCTS SERVICE] createCampaignProduct — campaignId: ${dto.campaignId}, tipo: "${dto.productType}", precio: $${dto.retailPrice}`)
    const { data } = await api.post('/products', dto)
    console.log(`[PRODUCTS SERVICE] createCampaignProduct ✅ Producto creado — id: ${data?.data?.id ?? data?.id}`)
    return data
  },

  updateCampaignProduct: async (productId: string, dto: UpdateCampaignProductDto): Promise<CampaignProduct> => {
    console.log(`[PRODUCTS SERVICE] updateCampaignProduct — id: ${productId}`, JSON.stringify(dto))
    const { data } = await api.patch(`/products/${productId}`, dto)
    console.log(`[PRODUCTS SERVICE] updateCampaignProduct ✅ Producto actualizado`)
    return data
  },
}
