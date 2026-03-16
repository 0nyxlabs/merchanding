// Represents the votes table
export interface Vote {
  id: string
  designId: string
  userId: string
  campaignId: string
  ipAddress?: string
  userAgent?: string
  isFlagged: boolean
  flaggedReason?: string
  createdAt: string
}

export interface CastVoteDto {
  designId: string
  campaignId: string
}
