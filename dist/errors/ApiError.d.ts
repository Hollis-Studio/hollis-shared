/**
 * @ai-context Shared ApiError class | Single definition for mobile, web-admin, and web-public
 *
 * Previously duplicated in src/services/apiClient.ts and web-admin/services/webApiClient.ts.
 * Moved here so all surfaces share one canonical class that supports `instanceof ApiError`.
 *
 * The constructor sanitizes the message via `sanitizeErrorMessage` to prevent PHI
 * from leaking into error displays or structured logs.
 *
 * deps: errorSanitization | consumers: src/services/apiClient, web-admin/services/webApiClient, web-public/services/webApiClient
 */
export declare class ApiError extends Error {
    statusCode?: number | undefined;
    response?: unknown | undefined;
    constructor(message: string, statusCode?: number | undefined, response?: unknown | undefined);
    /**
     * Convert to JSON for serialization, excluding raw response data
     * that may contain PHI
     */
    toJSON(): {
        name: string;
        message: string;
        statusCode?: number;
    };
}
//# sourceMappingURL=ApiError.d.ts.map