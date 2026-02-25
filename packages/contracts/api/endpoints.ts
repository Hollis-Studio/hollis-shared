/**
 * @ai-context Shared API base URL constants | single source of truth for API host URLs
 *
 * These constants are the canonical definitions used by:
 * - Mobile app (src/utils/apiConfig.ts)
 * - Web admin (web-admin/lib/apiConfig.ts)
 *
 * Do NOT hardcode these URLs elsewhere — import from here.
 *
 * deps: none | consumers: src/utils/apiConfig.ts, web-admin/lib/apiConfig.ts
 */

/**
 * @tech-debt API-1: Three independent HTTP client classes remain:
 *   - src/services/apiClient.ts (mobile, React Native)
 *   - web-admin/services/webApiClient.ts (web-admin, Next.js)
 *   - web-public/services/webApiClient.ts (web-public, Next.js)
 *
 * These share: ApiError (now unified), unwrapEnvelope (now unified), DEV_API_URL/PROD_API_URL (now unified).
 * Remaining divergence: auth token refresh logic, retry/backoff, request interceptors.
 *
 * Future work: Extract createHttpClient(config) factory to shared/http/ when platforms converge.
 * Blocking: React Native fetch polyfills differ from browser fetch (headers, multipart).
 */

/** Base API URL for local development */
export const DEV_API_URL = "http://localhost:4000" as const;

/** Base API URL for production */
export const PROD_API_URL = "https://api.hollis.health" as const;

/**
 * Default request timeout for all API clients (mobile, web-admin, web-public).
 * Long-running endpoints (e.g. AI analysis, large exports) should override per-request.
 */
export const REQUEST_TIMEOUT_MS = 30_000;
