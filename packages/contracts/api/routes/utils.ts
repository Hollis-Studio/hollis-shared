/**
 * @ai-context Route Utilities | helper functions for route manipulation
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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
export function getRoutePattern(path: string): string {
  // Replace UUID-like segments with :param placeholders
  // This is a heuristic - actual UUIDs, numeric IDs, or date strings
  return path
    .replace(/\/[a-f0-9-]{36}\//gi, '/:id/')
    .replace(/\/[a-f0-9-]{36}$/gi, '/:id')
    .replace(/\/\d{4}-\d{2}-\d{2}\//gi, '/:date/')
    .replace(/\/\d{4}-\d{2}-\d{2}$/gi, '/:date')
    .replace(/\/[A-Za-z0-9_-]{20,}\//gi, '/:id/')
    .replace(/\/[A-Za-z0-9_-]{20,}$/gi, '/:id');
}

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
export function buildUrlWithQuery(
  basePath: string,
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
