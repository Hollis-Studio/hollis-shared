/**
 * @ai-context Canonical error response schema | Single source of truth for API error envelopes
 *
 * All server error responses MUST conform to this shape. This schema is used by:
 * - Backend errorHandler middleware (formats caught errors)
 * - Backend AppError.toJSON() (serializes AppError instances)
 * - Clients (validates/types inbound error payloads)
 *
 * Canonical shape: { success: false, error: string, code?: string, details?: unknown, requestId?: string }
 *
 * deps: zod | consumers: server/src/lib/AppError, server/src/middleware/errorHandler, src/services/apiClient
 */
import { z } from "zod";
/**
 * Canonical API error response schema.
 *
 * Every error response from the server uses this flat envelope.
 * Clients should use this schema to validate and type-narrow error payloads.
 */
export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    error: z.string(),
    code: z.string().optional(),
    details: z.unknown().optional(),
    requestId: z.string().optional(),
});
//# sourceMappingURL=errorResponseSchema.js.map