import { api } from './api'
import type { CartItem } from '@/store/cartStore'

interface CreatePaymentIntentResponse {
  clientSecret: string
  orderId: string
}

export const paymentsService = {
  createPaymentIntent: async (data: {
    items: CartItem[]
    total: number
    shippingAddress: {
      fullName: string
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
      phone?: string
    }
  }): Promise<CreatePaymentIntentResponse> => {
    const { data: response } = await api.post('/payments/create-intent', data)
    return response
  },
}
