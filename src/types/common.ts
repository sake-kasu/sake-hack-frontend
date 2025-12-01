export type ApiError = {
  message: string
  code: string
  details?: unknown
}

export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}
