import { useQuery } from '@tanstack/react-query'
import { campaignsService } from '@/services/campaigns.service'
import { QUERY_KEYS } from '@/utils/constants'

export const useCampaigns = (params?: {
  page?: number
  pageSize?: number
  status?: string
  search?: string
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGNS, params],
    queryFn: () => campaignsService.getCampaigns(params),
  })
}

export const useCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CAMPAIGNS, campaignId],
    queryFn: () => campaignsService.getCampaignById(campaignId),
    enabled: !!campaignId,
  })
}
