import type { DESIGN_STATUS, MODERATION_STATUS } from '@/utils/constants'

export type DesignStatus = (typeof DESIGN_STATUS)[keyof typeof DESIGN_STATUS]
export type ModerationStatus = (typeof MODERATION_STATUS)[keyof typeof MODERATION_STATUS]

export interface Design {
  id: string
  campaignId: string
  designerId: string
  title: string
  description?: string
  tags: string[]
  originalFileUrl: string
  thumbnailUrl?: string
  mockupUrls: Record<string, string>
  targetProducts: string[]
  suggestedColor?: string
  status: DesignStatus
  moderationStatus: ModerationStatus
  rejectionReason?: string
  votesCount: number
  rank?: number
  isTrending: boolean
  isWinner: boolean
  selectedAt?: string
  unitsSold: number
  totalCommission: number
  flaggedAt?: string
  flaggedReason?: string
  reviewedBy?: string
  reviewedAt?: string
  fileFormat?: string
  fileSize?: number
  createdAt: string
  updatedAt: string
}

export interface CreateDesignDto {
  campaignId: string
  title: string
  description?: string
  tags?: string[]
  originalFileUrl: string
  thumbnailUrl?: string
  targetProducts: string[]
  suggestedColor?: string
  fileFormat?: string
  fileSize?: number
}

export interface ReviewDesignDto {
  moderationStatus: 'approved' | 'rejected' | 'flagged'
  rejectionReason?: string
}
