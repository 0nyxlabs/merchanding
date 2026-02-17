import { api } from './api'
import type { Campaign, CampaignSummary, PaginatedResponse } from '@/types'

export const campaignsService = {
  getCampaigns: async (params?: {
    page?: number
    pageSize?: number
    status?: string
    search?: string
  }): Promise<PaginatedResponse<CampaignSummary>> => {
    const { data } = await api.get('/campaigns', { params })
    return data
  },

  getCampaignById: async (campaignId: string): Promise<Campaign> => {
    const { data } = await api.get(`/campaigns/${campaignId}`)
    return data
  },
}
