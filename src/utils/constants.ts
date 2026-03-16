export const APP_NAME = 'Merchanding'

// --- User enums ---
export const USER_ROLE = {
  FAN: 'fan',
  DESIGNER: 'designer',
  INFLUENCER: 'influencer',
  ADMIN: 'admin',
} as const

export const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
  DELETED: 'deleted',
} as const

// --- Campaign enums ---
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  VOTING: 'voting',
  PRESALE: 'presale',
  PRODUCTION: 'production',
  SHIPPING: 'shipping',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

// --- Design enums ---
export const DESIGN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WINNER: 'winner',
} as const

export const MODERATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  FLAGGED: 'flagged',
} as const

// --- Product enums ---
export const PRODUCT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  IN_PRODUCTION: 'in_production',
  PRODUCED: 'produced',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
} as const

// --- Order enums ---
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PRODUCTION: 'production',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

// --- Earning enums ---
export const EARNING_STATUS = {
  PENDING: 'pending',
  AVAILABLE: 'available',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const

export const EARNING_TYPE = {
  COMMISSION: 'commission',
  BONUS: 'bonus',
  REFERRAL: 'referral',
  ADJUSTMENT: 'adjustment',
} as const

// --- Payout enums ---
export const PAYOUT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const

export const PAYOUT_METHOD = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
} as const

// --- Transaction enums ---
export const TRANSACTION_TYPE = {
  CREDIT: 'credit',
  DEBIT: 'debit',
  REFUND: 'refund',
  FEE: 'fee',
  ADJUSTMENT: 'adjustment',
} as const

// --- Coupon enums ---
export const COUPON_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const

// --- Email enums ---
export const EMAIL_STATUS = {
  QUEUED: 'queued',
  SENT: 'sent',
  DELIVERED: 'delivered',
  OPENED: 'opened',
  CLICKED: 'clicked',
  BOUNCED: 'bounced',
  FAILED: 'failed',
} as const

// --- Notification enums ---
export const NOTIFICATION_TYPE = {
  VOTE: 'vote',
  COMMENT: 'comment',
  DESIGN_APPROVED: 'design_approved',
  DESIGN_REJECTED: 'design_rejected',
  ORDER_UPDATE: 'order_update',
  CAMPAIGN_UPDATE: 'campaign_update',
  PAYOUT: 'payout',
  SYSTEM: 'system',
} as const

// --- React Query keys ---
export const QUERY_KEYS = {
  ORDERS: 'orders',
  DESIGNS: 'designs',
  CAMPAIGNS: 'campaigns',
  CAMPAIGN_PRODUCTS: 'campaign_products',
  CAMPAIGN_UPDATES: 'campaign_updates',
  PRODUCTS: 'products',
  USER: 'user',
  COMMENTS: 'comments',
  VOTES: 'votes',
  EARNINGS: 'earnings',
  PAYOUTS: 'payouts',
  TRANSACTIONS: 'transactions',
  NOTIFICATIONS: 'notifications',
  COUPONS: 'coupons',
} as const
