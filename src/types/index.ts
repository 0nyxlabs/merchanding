// API types
export type {
  PaginatedResponse,
  ApiResponse,
  ApiError,
  PaginationParams,
  SearchParams,
} from './api.types'

// User types
export type {
  UserRole,
  UserStatus,
  UserProfile,
  AuthUser,
  UpdateProfileDto,
} from './user.types'

// Design types
export type {
  DesignStatus,
  ModerationStatus,
  Design,
  CreateDesignDto,
  ReviewDesignDto,
} from './design.types'

// Campaign types
export type {
  CampaignStatus,
  BrandAssets,
  Campaign,
  CampaignSummary,
  CampaignUpdate,
  CreateCampaignDto,
  UpdateCampaignDto,
  CreateCampaignUpdateDto,
} from './campaign.types'

// Product types
export type {
  ProductStatus,
  ProductSize,
  ProductColor,
  ProductVariant,
  CampaignProduct,
  CreateCampaignProductDto,
  UpdateCampaignProductDto,
} from './product.types'

// Cart types
export type {
  CartItem,
  CartItemWithDetails,
  CartTotals,
  CreateCheckoutDto,
} from './cart.types'

// Order types
export type {
  OrderStatus,
  PaymentStatus,
  ShippingAddress,
  OrderItem,
  OrderStatusHistory,
  Order,
  OrderSummary,
  CreateOrderDto,
  UpdateOrderStatusDto,
} from './order.types'

// Notification types
export type {
  NotificationType,
  Notification,
  MarkNotificationsReadDto,
} from './notification.types'

// Comment types
export type {
  Comment,
  CommentVote,
  CreateCommentDto,
  UpdateCommentDto,
} from './comment.types'

// Coupon types
export type {
  CouponType,
  Coupon,
  CouponUsage,
  ApplyCouponDto,
  ApplyCouponResult,
  CreateCouponDto,
} from './coupon.types'

// Earning / Payout / Transaction types
export type {
  EarningStatus,
  EarningType,
  PayoutStatus,
  PayoutMethod,
  TransactionType,
  Earning,
  Payout,
  Transaction,
  RequestPayoutDto,
} from './earning.types'

// Vote types
export type {
  Vote,
  CastVoteDto,
} from './vote.types'
