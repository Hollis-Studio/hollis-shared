/**
 * @ai-context Errors barrel | Shared error classes used across surfaces
 */
export { ApiError } from "./ApiError.js";
export { RateLimitError } from "./RateLimitError.js";
export { APP_ERROR_CODE_ALIASES, APP_ERROR_CODES, type AppErrorCode, type AppErrorCodeAlias, type HealthAppErrorCodeAlias, } from "./app-error-code.js";
export { ErrorResponseSchema, type ErrorResponse as ErrorResponseType } from "./errorResponseSchema.js";
export { normalizeErrorPayload, type NormalizedErrorPayload } from "./normalizeErrorPayload.js";
export { err, isErr, isOk, ok, type AppError, type Result } from "./result.js";
//# sourceMappingURL=index.d.ts.map