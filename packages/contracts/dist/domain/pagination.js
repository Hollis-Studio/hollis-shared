/**
 * @ai-context Shared pagination types for consistent list responses
 */
import { z } from "zod";
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
// zod-manual: generic factory function
export const createPaginatedListSchema = (itemSchema) => z.object({
    data: z.array(itemSchema),
    pagination: paginationMetaSchema,
});
//# sourceMappingURL=pagination.js.map