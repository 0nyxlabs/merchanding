import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/services/products.service'
import { QUERY_KEYS } from '@/utils/constants'

export const useProductsByCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'campaign', campaignId],
    queryFn: () => productsService.getProductsByCampaign(campaignId),
    enabled: !!campaignId,
  })
}

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, productId],
    queryFn: () => productsService.getProductById(productId),
    enabled: !!productId,
  })
}
