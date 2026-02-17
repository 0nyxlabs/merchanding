import type { User } from '@supabase/supabase-js'

export type UserRole = 'user' | 'admin'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type AuthUser = User

export interface UpdateProfileDto {
  fullName?: string
  avatarUrl?: string
}
