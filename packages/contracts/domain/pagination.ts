/**
 * @ai-context Shared pagination types for consistent list responses
 */

import { z } from "zod";

/**
 * Standard pagination parameters accepted by list endpoints.
 */
export interface PaginationParams {
  limit: number;
  page: number;
  cursor?: string;
  sortBy?: string;
  sortOrder: "asc" | "desc";
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

/**
 * Pagination metadata schema for list payloads.
 * Supports both page-based and offset-based pagination fields for
 * backward compatibility while favoring page + limit + hasMore.
 */
export const paginationMetaSchema = z.object({
  page: z.number().int().min(1).optional(),
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().positive(),
  total: z.number().int().min(0).optional(),
  totalPages: z.number().int().min(0).optional(),
  hasMore: z.boolean().optional(),
  nextCursor: z.string().min(1).optional(),
  prevCursor: z.string().min(1).optional(),
});

/**
 * Factory for strongly typed paginated list schemas.
 */
export const createPaginatedListSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
) =>
  z.object({
    data: z.array(itemSchema),
    pagination: paginationMetaSchema,
  });

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
