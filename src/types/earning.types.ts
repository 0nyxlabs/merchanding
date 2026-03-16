import type {
  EARNING_STATUS,
  EARNING_TYPE,
  PAYOUT_STATUS,
  PAYOUT_METHOD,
  TRANSACTION_TYPE,
} from '@/utils/constants'

export type EarningStatus = (typeof EARNING_STATUS)[keyof typeof EARNING_STATUS]
export type EarningType = (typeof EARNING_TYPE)[keyof typeof EARNING_TYPE]
export type PayoutStatus = (typeof PAYOUT_STATUS)[keyof typeof PAYOUT_STATUS]
export type PayoutMethod = (typeof PAYOUT_METHOD)[keyof typeof PAYOUT_METHOD]
export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]

// Represents the earnings table
export interface Earning {
  id: string
  userId: string
  orderId?: string
  campaignId?: string
  designId?: string
  amount: number
  type: EarningType
  status: EarningStatus
  description?: string
  availableAt?: string
  payoutId?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

// Represents the payouts table
export interface Payout {
  id: string
  userId: string
  amount: number
  fee: number
  netAmount: number
  method: PayoutMethod
  payoutDetails?: Record<string, unknown>
  status: PayoutStatus
  stripeTransferId?: string
  paypalBatchId?: string
  externalId?: string
  failureReason?: string
  failedAt?: string
  processedBy?: string
  processedAt?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

// Represents the transactions table
export interface Transaction {
  id: string
  userId?: string
  orderId?: string
  earningId?: string
  payoutId?: string
  amount: number
  type: TransactionType
  description: string
  balanceAfter?: number
  stripeTransactionId?: string
  createdBy?: string
  notes?: string
  createdAt: string
}

export interface RequestPayoutDto {
  amount: number
  method: PayoutMethod
  payoutDetails: Record<string, unknown>
}
