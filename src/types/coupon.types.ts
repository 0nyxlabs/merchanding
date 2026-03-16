import type { COUPON_TYPE } from '@/utils/constants'

export type CouponType = (typeof COUPON_TYPE)[keyof typeof COUPON_TYPE]

// Represents the coupons table
export interface Coupon {
  id: string
  code: string
  type: CouponType
  discountValue: number
  minPurchase: number
  maxDiscount?: number
  campaignId?: string
  userId?: string
  maxUses?: number
  maxUsesPerUser: number
  usesCount: number
  validFrom: string
  validUntil?: string
  isActive: boolean
  createdBy?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Represents the coupon_usage table
export interface CouponUsage {
  id: string
  couponId: string
  orderId: string
  userId?: string
  discountAmount: number
  createdAt: string
}

export interface ApplyCouponDto {
  code: string
  orderTotal: number
  campaignId?: string
}

export interface ApplyCouponResult {
  coupon: Coupon
  discountAmount: number
  finalTotal: number
}

export interface CreateCouponDto {
  code: string
  type: CouponType
  discountValue: number
  minPurchase?: number
  maxDiscount?: number
  campaignId?: string
  userId?: string
  maxUses?: number
  maxUsesPerUser?: number
  validFrom?: string
  validUntil?: string
  notes?: string
}
