/**
 * @ai-context API Route Types | shared type definitions for route modules
 *
 * deps: none | consumers: routes/*
 */
/**
 * HTTP methods supported by the API.
 */
export declare const HTTP_METHODS: readonly ["GET", "POST", "PUT", "PATCH", "DELETE"];
export type HttpMethod = (typeof HTTP_METHODS)[number];
/**
 * Route metadata for documentation and validation purposes.
 */
export interface RouteMetadata {
    /** HTTP method for this route */
    method: HttpMethod;
    /** Brief description of what the route does */
    description: string;
    /** Whether the route requires authentication */
    requiresAuth: boolean;
    /** Whether the route requires admin/clinician role */
    requiresAdmin?: boolean;
}
//# sourceMappingURL=types.d.ts.map