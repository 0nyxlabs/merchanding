import { api } from './api'
import type { ApplyCouponDto, ApplyCouponResult } from '@/types'

export const couponsService = {
  // --- coupons / coupon_usage tables ---

  applyCoupon: async (dto: ApplyCouponDto): Promise<ApplyCouponResult> => {
    console.log(`[COUPONS SERVICE] applyCoupon — código: "${dto.code}", total: $${dto.orderTotal}`)
    const { data } = await api.post('/coupons/apply', dto)
    console.log(`[COUPONS SERVICE] applyCoupon ✅ Descuento aplicado: $${data?.data?.discountAmount ?? data?.discountAmount}`)
    return data
  },

  validateCoupon: async (code: string, subtotal: number): Promise<{ valid: boolean; message?: string; discountAmount?: number }> => {
    console.log(`[COUPONS SERVICE] validateCoupon — código: "${code}", subtotal: $${subtotal}`)
    const { data } = await api.post('/coupons/validate', { code, subtotal })
    console.log(`[COUPONS SERVICE] validateCoupon ✅ Válido: ${data?.data?.valid ?? data?.valid}`)
    return data?.data ?? data
  },
}
