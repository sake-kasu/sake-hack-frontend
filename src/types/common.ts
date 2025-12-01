export type ApiError = {
  message: string;
  code: string;
  details?: unknown;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export type SortOrder = "asc" | "desc";

export type SortParams = {
  sortBy: string;
  order: SortOrder;
};
