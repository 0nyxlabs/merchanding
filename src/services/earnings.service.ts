import { api } from './api'
import type {
  Earning,
  Payout,
  Transaction,
  RequestPayoutDto,
} from '@/types'

export const earningsService = {
  // --- earnings table ---

  getMyEarnings: async (): Promise<Earning[]> => {
    console.log('[EARNINGS SERVICE] getMyEarnings — obteniendo ganancias...')
    const { data } = await api.get('/earnings')
    console.log(`[EARNINGS SERVICE] getMyEarnings ✅ ${data?.data?.length ?? data?.length ?? 0} ganancias`)
    return data
  },

  // --- transactions table ---

  getMyTransactions: async (): Promise<Transaction[]> => {
    console.log('[EARNINGS SERVICE] getMyTransactions — obteniendo transacciones...')
    const { data } = await api.get('/transactions')
    console.log(`[EARNINGS SERVICE] getMyTransactions ✅ ${data?.data?.length ?? data?.length ?? 0} transacciones`)
    return data
  },

  // --- payouts table ---

  getMyPayouts: async (): Promise<Payout[]> => {
    console.log('[EARNINGS SERVICE] getMyPayouts — obteniendo payouts...')
    const { data } = await api.get('/payouts')
    console.log(`[EARNINGS SERVICE] getMyPayouts ✅ ${data?.data?.length ?? data?.length ?? 0} payouts`)
    return data
  },

  requestPayout: async (dto: RequestPayoutDto): Promise<Payout> => {
    console.log(`[EARNINGS SERVICE] requestPayout — método: ${dto.method}, monto: $${dto.amount}`)
    const { data } = await api.post('/payouts', dto)
    console.log(`[EARNINGS SERVICE] requestPayout ✅ Payout solicitado — id: ${data?.data?.id ?? data?.id}`)
    return data
  },
}
