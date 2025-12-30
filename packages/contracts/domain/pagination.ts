/**
 * @ai-context Shared pagination types for consistent list responses
 */

/**
 * Standard pagination parameters accepted by list endpoints.
 */
export interface PaginationParams {
  limit: number;
  page: number;
  cursor?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Standard paginated response format.
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total?: number;
    totalPages?: number;
    hasMore: boolean;
    nextCursor?: string;
    prevCursor?: string;
  };
}
