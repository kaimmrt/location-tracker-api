import { PaginationMeta } from '../pagination-response.dto';

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
}

export function calculatePaginationMeta(
  limit: number,
  offset: number,
  total: number,
  itemCount: number,
): PaginationMeta {
  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    itemCount,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function normalizePaginationParams(
  limit?: number,
  offset?: number,
): PaginationParams {
  return {
    limit: limit || 10,
    offset: offset || 0,
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  meta: PaginationMeta,
  successMessage: string,
  emptyMessage: string,
  userSuccessMessage: string,
  userEmptyMessage: string,
) {
  const isEmpty = data.length === 0;

  return {
    data,
    message: isEmpty ? emptyMessage : successMessage,
    userMessage: isEmpty ? userEmptyMessage : userSuccessMessage,
    isSuccess: true,
    meta,
  };
}
