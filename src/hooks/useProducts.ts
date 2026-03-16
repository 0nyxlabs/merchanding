import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsService } from '@/services/products.service'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { CreateCampaignProductDto, UpdateCampaignProductDto } from '@/types'

// --- Campaign products (campaign_products table) ---

export const useCampaignProducts = (campaignId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGN_PRODUCTS, campaignId],
    queryFn: () => productsService.getCampaignProducts(campaignId),
    enabled: !!campaignId,
  })
}

export const useCampaignProduct = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGN_PRODUCTS, productId],
    queryFn: () => productsService.getCampaignProductById(productId),
    enabled: !!productId,
  })
}

export const useCreateCampaignProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateCampaignProductDto) => {
      console.log(`[USE PRODUCTS] useCreateCampaignProduct — campaignId: ${dto.campaignId}, tipo: "${dto.productType}"`)
      return productsService.createCampaignProduct(dto)
    },
    onSuccess: (data) => {
      console.log(`[USE PRODUCTS] useCreateCampaignProduct ✅ Producto creado — id: ${data.id}`)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGN_PRODUCTS, data.campaignId] })
      toast.success('Product added to campaign')
    },
    onError: () => {
      toast.error('Failed to add product')
    },
  })
}

export const useUpdateCampaignProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, dto }: { productId: string; dto: UpdateCampaignProductDto }) => {
      console.log(`[USE PRODUCTS] useUpdateCampaignProduct — productId: ${productId}`)
      return productsService.updateCampaignProduct(productId, dto)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGN_PRODUCTS, data.campaignId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGN_PRODUCTS, data.id] })
      toast.success('Product updated')
    },
    onError: () => {
      toast.error('Failed to update product')
    },
  })
}
