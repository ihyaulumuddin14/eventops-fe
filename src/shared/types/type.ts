export interface ErrorResponse {
  code: string;
  raw_error: string;
}

export interface SuccessResponse<T = Record<string, unknown>> {
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SuccessPaginatedResponse<T = Record<string, unknown>> {
  data: T[];
  pagination: Pagination;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export type ApiPaginatedResponse<T = unknown> =
  | SuccessPaginatedResponse<T>
  | ErrorResponse;
