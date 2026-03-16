import type { CAMPAIGN_STATUS } from '@/utils/constants'

export type CampaignStatus = (typeof CAMPAIGN_STATUS)[keyof typeof CAMPAIGN_STATUS]

export interface BrandAssets {
  logoUrl?: string
  colorPalette?: string[]
  fontFamily?: string
  [key: string]: unknown
}

export interface Campaign {
  id: string
  influencerId: string
  name: string
  slug: string
  description: string
  category: string
  coverImageUrl?: string
  designPhaseDuration: number
  presaleDuration: number
  minPreorders: number
  maxDesignsPerUser: number
  designerCommissionRate: number
  products: unknown[]
  designGuidelines?: string
  brandAssets: BrandAssets
  status: CampaignStatus
  launchedAt?: string
  designPhaseEndsAt?: string
  presaleStartsAt?: string
  presaleEndsAt?: string
  totalDesigns: number
  totalVotes: number
  totalParticipants: number
  totalPreorders: number
  totalRevenue: number
  isFeatured: boolean
  featuredUntil?: string
  createdAt: string
  updatedAt: string
}

export interface CampaignSummary {
  id: string
  name: string
  slug: string
  coverImageUrl?: string
  category: string
  status: CampaignStatus
  totalDesigns: number
  totalPreorders: number
  presaleEndsAt?: string
  isFeatured: boolean
}

export interface CreateCampaignDto {
  name: string
  description: string
  category: string
  coverImageUrl?: string
  designPhaseDuration: number
  presaleDuration: number
  minPreorders?: number
  maxDesignsPerUser?: number
  designerCommissionRate?: number
  designGuidelines?: string
  brandAssets?: BrandAssets
}

export interface UpdateCampaignDto {
  name?: string
  description?: string
  category?: string
  coverImageUrl?: string
  designGuidelines?: string
  brandAssets?: BrandAssets
  status?: CampaignStatus
}

export interface CampaignUpdate {
  id: string
  campaignId: string
  authorId: string
  title?: string
  content: string
  isPinned: boolean
  pinnedUntil?: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCampaignUpdateDto {
  title?: string
  content: string
  isPinned?: boolean
  pinnedUntil?: string
}
