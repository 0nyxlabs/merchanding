import type { PRODUCT_STATUS } from '@/utils/constants'

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS]

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface ProductColor {
  name: string
  hex: string
}

// Represents the campaign_products table
export interface CampaignProduct {
  id: string
  campaignId: string
  designId: string
  productType: string
  baseCost: number
  retailPrice: number
  minQuantity: number
  preorderCount: number
  unitsProduced: number
  unitsShipped: number
  status: ProductStatus
  printfulProductId?: number
  productionStartedAt?: string
  productionCompletedAt?: string
  totalRevenue: number
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
}

export interface CreateCampaignProductDto {
  campaignId: string
  designId: string
  productType: string
  baseCost: number
  retailPrice: number
  minQuantity: number
}

export interface UpdateCampaignProductDto {
  retailPrice?: number
  minQuantity?: number
  status?: ProductStatus
  printfulProductId?: number
}

// Variant used for size/color selection in cart
export interface ProductVariant {
  size: ProductSize
  color?: ProductColor
}
