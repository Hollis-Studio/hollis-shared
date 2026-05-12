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
export declare const ErrorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    details: z.ZodOptional<z.ZodUnknown>;
    requestId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
//# sourceMappingURL=errorResponseSchema.d.ts.map