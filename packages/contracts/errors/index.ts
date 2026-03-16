/**
 * @ai-context Errors barrel | Shared error classes used across surfaces
 */

export { ApiError } from "./ApiError";
export { RateLimitError } from "./RateLimitError";
export { ErrorResponseSchema, type ErrorResponse as ErrorResponseType } from "./errorResponseSchema";
export { normalizeErrorPayload, type NormalizedErrorPayload } from "./normalizeErrorPayload";

