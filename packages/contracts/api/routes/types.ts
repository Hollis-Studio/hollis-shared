/**
 * @ai-context API Route Types | shared type definitions for route modules
 *
 * deps: none | consumers: routes/*
 */

// ============================================================================
// TYPE HELPERS
// ============================================================================

/**
 * HTTP methods supported by the API.
 */
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
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
