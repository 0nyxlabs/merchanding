import { api } from './api'
import type { CartItem } from '@/store/cartStore'
import type { ShippingAddress } from '@/types'

interface CreatePaymentIntentDto {
  items: CartItem[]
  total: number
  shippingAddress: ShippingAddress
  couponCode?: string
}

interface CreatePaymentIntentResponse {
  clientSecret: string
  orderId: string
}

export const paymentsService = {
  createPaymentIntent: async (dto: CreatePaymentIntentDto): Promise<CreatePaymentIntentResponse> => {
    console.log('[PAYMENTS SERVICE] createPaymentIntent — iniciando creación de PaymentIntent...')
    console.log(`[PAYMENTS SERVICE] createPaymentIntent — total: $${dto.total}, items: ${dto.items.length}`)
    console.log(`[PAYMENTS SERVICE] createPaymentIntent — destino: ${dto.shippingAddress.city}, ${dto.shippingAddress.country}`)
    dto.items.forEach((item, i) => {
      console.log(`[PAYMENTS SERVICE] createPaymentIntent — item[${i}]: "${item.designTitle}" (${item.productType}, ${item.size}) x${item.quantity} @ $${item.price}`)
    })

    const { data } = await api.post('/payments/create-intent', dto)
    console.log(`[PAYMENTS SERVICE] createPaymentIntent ✅ PaymentIntent creado — orderId: ${data?.data?.orderId ?? data?.orderId}`)
    return data
  },
}
