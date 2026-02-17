export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  statusCode: number
  fieldErrors?: Record<string, string[]>
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams extends PaginationParams {
  search?: string
  status?: string
}
