import type { User } from '@supabase/supabase-js'
import type { USER_ROLE, USER_STATUS } from '@/utils/constants'

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

export interface UserProfile {
  id: string
  email: string
  fullName: string
  username?: string
  avatarUrl?: string
  bio?: string
  role: UserRole
  status: UserStatus
  socialLinks: Record<string, string>
  category?: string
  followerCount: number
  isVerified: boolean
  portfolioUrl?: string
  designWins: number
  totalDesignsSubmitted: number
  reputationScore: number
  totalEarnings: number
  availableBalance: number
  pendingBalance: number
  emailNotifications: boolean
  marketingEmails: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export type AuthUser = User

export interface UpdateProfileDto {
  fullName?: string
  username?: string
  avatarUrl?: string
  bio?: string
  socialLinks?: Record<string, string>
  portfolioUrl?: string
  emailNotifications?: boolean
  marketingEmails?: boolean
}
