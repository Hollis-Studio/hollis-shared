/**
 * @ai-context Shared error payload normalizer | used by all API clients
 *
 * Extracts a human-readable message, optional error code, and optional details
 * from an unknown HTTP error response body. Handles all server envelope shapes:
 *
 *   { error: "string" }
 *   { error: { message, code, details } }
 *   { message: "string", code: "string" }
 *   "plain string body"
 *
 * Previously duplicated across:
 *   - src/services/apiClient.ts (private method)
 *   - web-admin/services/webApiClient.ts (exported free function `normalizeApiErrorPayload`)
 *   - web-public/services/webApiClient.ts (private method, simplified)
 *
 * deps: ../primitives/typeGuards | consumers: src/services/apiClient, web-admin/services/webApiClient, web-public/services/webApiClient
 */
export interface NormalizedErrorPayload {
    message: string;
    code?: string;
    details?: unknown;
    response: unknown;
}
/**
 * Normalize an unknown HTTP error response body into a structured payload.
 *
 * @param payload - Raw error body (string, object, or unknown)
 * @param fallbackMessage - Message to use when none can be extracted
 * @returns Normalized payload with message, optional code/details, and original response
 */
export declare function normalizeErrorPayload(payload: unknown, fallbackMessage: string): NormalizedErrorPayload;
//# sourceMappingURL=normalizeErrorPayload.d.ts.map