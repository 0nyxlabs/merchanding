import { api } from './api'
import type { Product, ProductSummary } from '@/types'

export const productsService = {
  getProductsByCampaign: async (campaignId: string): Promise<ProductSummary[]> => {
    const { data } = await api.get(`/campaigns/${campaignId}/products`)
    return data
  },

  getProductById: async (productId: string): Promise<Product> => {
    const { data } = await api.get(`/products/${productId}`)
    return data
  },
}
