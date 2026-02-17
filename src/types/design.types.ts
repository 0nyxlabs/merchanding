import type { DESIGN_STATUS } from '@/utils/constants'

export type DesignStatus = (typeof DESIGN_STATUS)[keyof typeof DESIGN_STATUS]

export interface Design {
  id: string
  userId: string
  name: string
  description?: string
  imageUrl: string
  status: DesignStatus
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDesignDto {
  name: string
  description?: string
  imageUrl: string
}

export interface ReviewDesignDto {
  status: 'approved' | 'rejected'
  rejectionReason?: string
}
