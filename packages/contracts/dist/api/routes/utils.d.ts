/**
 * @ai-context Route Utilities | helper functions for route manipulation
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * Get the base path pattern for a dynamic route (for server-side route registration).
 *
 * @example
 * ```ts
 * // Returns '/users/:userId'
 * getRoutePattern('/users/abc123')
 *
 * // Returns '/users/:userId/biometrics/:entryId'
 * getRoutePattern('/users/abc123/biometrics/entry456')
 * ```
 */
export declare function getRoutePattern(path: string): string;
/**
 * Build a URL with query parameters from a base path.
 *
 * @example
 * ```ts
 * // Returns '/users/123/daily-metrics?startDate=2024-01-01&endDate=2024-01-31'
 * buildUrlWithQuery(
 *   DAILY_METRICS_ROUTES.list('123'),
 *   { startDate: '2024-01-01', endDate: '2024-01-31' }
 * )
 * ```
 */
export declare function buildUrlWithQuery(basePath: string, params: Record<string, string | number | boolean | undefined | null>): string;
//# sourceMappingURL=utils.d.ts.map