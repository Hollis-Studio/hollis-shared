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
export declare const paginationMetaSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodNumber;
    total: z.ZodOptional<z.ZodNumber>;
    totalPages: z.ZodOptional<z.ZodNumber>;
    hasMore: z.ZodOptional<z.ZodBoolean>;
    nextCursor: z.ZodOptional<z.ZodString>;
    prevCursor: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Factory for strongly typed paginated list schemas.
 */
export declare const createPaginatedListSchema: <T extends z.ZodTypeAny>(itemSchema: T) => z.ZodObject<{
    data: z.ZodArray<T>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
//# sourceMappingURL=pagination.d.ts.map