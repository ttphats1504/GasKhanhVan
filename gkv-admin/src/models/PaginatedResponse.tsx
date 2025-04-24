export interface PaginatedResponse<T> {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  data: T[]
}
