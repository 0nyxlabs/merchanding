import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campaignsService } from '@/services/campaigns.service'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { CampaignSummary, SearchParams, CreateCampaignUpdateDto } from '@/types'

// --- Campaign list ---

export const useCampaigns = (params?: SearchParams & {
  category?: string
  featured?: boolean
}) => {
  return useQuery<CampaignSummary[]>({
    queryKey: [QUERY_KEYS.CAMPAIGNS, params],
    queryFn: () => campaignsService.getCampaigns(params),
  })
}

// --- Single campaign by ID ---

export const useCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGNS, campaignId],
    queryFn: () => campaignsService.getCampaignById(campaignId),
    enabled: !!campaignId,
  })
}

// --- Single campaign by slug ---

export const useCampaignBySlug = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGNS, 'slug', slug],
    queryFn: () => campaignsService.getCampaignBySlug(slug),
    enabled: !!slug,
  })
}

// --- Campaign products (campaign_products table) ---

export const useCampaignProducts = (campaignId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGN_PRODUCTS, campaignId],
    queryFn: () => {
      console.log(`[USE CAMPAIGNS] useCampaignProducts — campaignId: ${campaignId}`)
      return campaignsService.getCampaignProducts(campaignId)
    },
    enabled: !!campaignId,
  })
}

export const useCampaignProduct = (campaignId: string, productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGN_PRODUCTS, campaignId, productId],
    queryFn: () => campaignsService.getCampaignProductById(campaignId, productId),
    enabled: !!campaignId && !!productId,
  })
}

// --- Campaign updates (campaign_updates table) ---

export const useCampaignUpdates = (campaignId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGN_UPDATES, campaignId],
    queryFn: () => {
      console.log(`[USE CAMPAIGNS] useCampaignUpdates — campaignId: ${campaignId}`)
      return campaignsService.getCampaignUpdates(campaignId)
    },
    enabled: !!campaignId,
  })
}

export const useCreateCampaignUpdate = (campaignId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateCampaignUpdateDto) => {
      console.log(`[USE CAMPAIGNS] useCreateCampaignUpdate — campaignId: ${campaignId}`)
      return campaignsService.createCampaignUpdate(campaignId, dto)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CAMPAIGN_UPDATES, campaignId] })
      toast.success('Update posted')
    },
    onError: () => {
      toast.error('Failed to post update')
    },
  })
}
