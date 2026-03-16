import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { earningsService } from '@/services/earnings.service'
import { QUERY_KEYS } from '@/utils/constants'
import { toast } from 'react-hot-toast'
import type { RequestPayoutDto } from '@/types'

// --- Earnings (earnings table) ---

export const useEarnings = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.EARNINGS],
    queryFn: () => {
      console.log('[USE EARNINGS] useEarnings — cargando ganancias...')
      return earningsService.getMyEarnings()
    },
  })
}

// --- Transactions (transactions table) ---

export const useTransactions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS],
    queryFn: () => {
      console.log('[USE EARNINGS] useTransactions — cargando transacciones...')
      return earningsService.getMyTransactions()
    },
  })
}

// --- Payouts (payouts table) ---

export const usePayouts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PAYOUTS],
    queryFn: () => {
      console.log('[USE EARNINGS] usePayouts — cargando payouts...')
      return earningsService.getMyPayouts()
    },
  })
}

// --- Request payout ---

export const useRequestPayout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: RequestPayoutDto) => {
      console.log(`[USE EARNINGS] useRequestPayout — método: ${dto.method}, monto: $${dto.amount}`)
      return earningsService.requestPayout(dto)
    },
    onSuccess: (data) => {
      console.log(`[USE EARNINGS] useRequestPayout ✅ Payout solicitado — id: ${data.id}`)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PAYOUTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EARNINGS] })
      toast.success('Payout requested successfully')
    },
    onError: () => {
      toast.error('Failed to request payout')
    },
  })
}
