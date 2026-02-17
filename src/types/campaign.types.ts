export type CampaignStatus = 'draft' | 'active' | 'ended'

export interface Campaign {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  status: CampaignStatus
  startDate: string
  endDate: string
  productCount: number
  createdAt: string
  updatedAt: string
}

export interface CampaignSummary {
  id: string
  name: string
  slug: string
  imageUrl: string
  status: CampaignStatus
  productCount: number
}

export interface CreateCampaignDto {
  name: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
}

export interface UpdateCampaignDto {
  name?: string
  description?: string
  imageUrl?: string
  status?: CampaignStatus
  startDate?: string
  endDate?: string
}
