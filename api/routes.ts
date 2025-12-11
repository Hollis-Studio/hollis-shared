/**
 * @ai-context API Route Registry | typed constants for all HTTP API endpoints
 *
 * This file is the single source of truth for API route paths used by:
 * - Mobile app (src/services/*.ts)
 * - Web admin (web-admin/services/*.ts)
 * - Backend server (server/src/routes/*.ts) - can import for validation/documentation
 *
 * IMPORTANT: All API calls MUST use paths from this registry, not hardcoded strings.
 *
 * Pattern:
 * - Static routes: string constants
 * - Dynamic routes: functions returning template literal types for type safety
 * - Query params are NOT part of the route registry (handled at call site)
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
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

// ============================================================================
// AUTH ROUTES
// ============================================================================

/**
 * Authentication API routes.
 * Base path: /auth
 *
 * @group AUTH
 */
export const AUTH_ROUTES = {
  /** POST - Email/password login */
  LOGIN: '/auth/login',
  /** POST - Create new account with password */
  SIGNUP: '/auth/signup',
  /** POST - Refresh access token using refresh token */
  REFRESH: '/auth/refresh',
  /** POST - Link OAuth credentials to existing account */
  LINK: '/auth/link',
  /** POST - Sign out current session */
  LOGOUT: '/auth/logout',
} as const;

/** Type for auth route values */
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

// ============================================================================
// USER ROUTES
// ============================================================================

/**
 * User data API routes.
 * Base path: /users/:userId
 *
 * @group USERS
 */
export const USER_ROUTES = {
  /**
   * GET /users/:userId - Get user account data
   * @param userId - User's unique identifier
   */
  get: (userId: string) => `/users/${userId}` as const,

  /**
   * PATCH /users/:userId/profile - Update user profile
   * @param userId - User's unique identifier
   */
  updateProfile: (userId: string) => `/users/${userId}/profile` as const,

  /**
   * PATCH /users/:userId/preferences - Update user preferences
   * @param userId - User's unique identifier
   */
  updatePreferences: (userId: string) => `/users/${userId}/preferences` as const,

  /**
   * PATCH /users/:userId/goals - Update user goals
   * @param userId - User's unique identifier
   */
  updateGoals: (userId: string) => `/users/${userId}/goals` as const,

  /**
   * GET /users/:userId/compliance - Get compliance metrics
   * @param userId - User's unique identifier
   */
  compliance: (userId: string) => `/users/${userId}/compliance` as const,
} as const;

/** Type for user route values */
export type UserRoute = ReturnType<(typeof USER_ROUTES)[keyof typeof USER_ROUTES]>;

// ============================================================================
// DAILY METRICS ROUTES
// ============================================================================

/**
 * Daily metrics API routes.
 * Base path: /users/:userId/daily-metrics
 *
 * @group DAILY_METRICS
 */
export const DAILY_METRICS_ROUTES = {
  /**
   * GET /users/:userId/daily-metrics/:date - Get metrics for specific date
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   */
  get: (userId: string, date: string) => `/users/${userId}/daily-metrics/${date}` as const,

  /**
   * GET /users/:userId/daily-metrics - List metrics for date range
   * Query params: startDate, endDate
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/daily-metrics` as const,

  /**
   * PUT /users/:userId/daily-metrics/:date - Update metrics for date
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   */
  update: (userId: string, date: string) => `/users/${userId}/daily-metrics/${date}` as const,
} as const;

// ============================================================================
// DAILY SUMMARY ROUTES
// ============================================================================

/**
 * Daily summary API routes.
 * Base path: /users/:userId/daily-summary
 *
 * @group DAILY_SUMMARY
 */
export const DAILY_SUMMARY_ROUTES = {
  /**
   * GET /users/:userId/daily-summary/:date - Get summary for specific date
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   */
  get: (userId: string, date: string) => `/users/${userId}/daily-summary/${date}` as const,
} as const;

// ============================================================================
// BIOMETRICS ROUTES
// ============================================================================

/**
 * Biometrics data API routes.
 * Base path: /users/:userId/biometrics
 *
 * @group BIOMETRICS
 */
export const BIOMETRICS_ROUTES = {
  /**
   * GET /users/:userId/biometrics - List biometric entries
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/biometrics` as const,

  /**
   * POST /users/:userId/biometrics - Create biometric entry
   * @param userId - User's unique identifier
   */
  create: (userId: string) => `/users/${userId}/biometrics` as const,

  /**
   * DELETE /users/:userId/biometrics/:entryId - Delete biometric entry
   * @param userId - User's unique identifier
   * @param entryId - Entry's unique identifier
   */
  delete: (userId: string, entryId: string) => `/users/${userId}/biometrics/${entryId}` as const,
} as const;

// ============================================================================
// JOURNAL ROUTES
// ============================================================================

/**
 * Journal entry API routes.
 * Base path: /users/:userId/journal
 *
 * @group JOURNAL
 */
export const JOURNAL_ROUTES = {
  /**
   * GET /users/:userId/journal - List journal entries
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/journal` as const,

  /**
   * POST /users/:userId/journal - Create journal entry
   * @param userId - User's unique identifier
   */
  create: (userId: string) => `/users/${userId}/journal` as const,

  /**
   * PUT /users/:userId/journal/:entryId - Update journal entry
   * @param userId - User's unique identifier
   * @param entryId - Entry's unique identifier
   */
  update: (userId: string, entryId: string) => `/users/${userId}/journal/${entryId}` as const,

  /**
   * DELETE /users/:userId/journal/:entryId - Delete journal entry
   * @param userId - User's unique identifier
   * @param entryId - Entry's unique identifier
   */
  delete: (userId: string, entryId: string) => `/users/${userId}/journal/${entryId}` as const,
} as const;

// ============================================================================
// NUTRITION ROUTES
// ============================================================================

/**
 * Nutrition log API routes.
 * Base path: /users/:userId/nutrition
 *
 * @group NUTRITION
 */
export const NUTRITION_ROUTES = {
  /**
   * GET /users/:userId/nutrition/:date - Get nutrition log for date
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   */
  get: (userId: string, date: string) => `/users/${userId}/nutrition/${date}` as const,

  /**
   * GET /users/:userId/nutrition - List nutrition logs for date range
   * Query params: startDate, endDate
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/nutrition` as const,

  /**
   * PUT /users/:userId/nutrition/:date - Upsert nutrition log for date
   * @param userId - User's unique identifier
   * @param date - ISO date string (YYYY-MM-DD)
   */
  upsert: (userId: string, date: string) => `/users/${userId}/nutrition/${date}` as const,
} as const;

// ============================================================================
// APPOINTMENTS ROUTES
// ============================================================================

/**
 * Appointments API routes.
 * Base path: /users/:userId/appointments
 *
 * @group APPOINTMENTS
 */
export const APPOINTMENTS_ROUTES = {
  /**
   * GET /users/:userId/appointments/upcoming - Get upcoming appointments
   * @param userId - User's unique identifier
   */
  upcoming: (userId: string) => `/users/${userId}/appointments/upcoming` as const,

  /**
   * GET /users/:userId/appointments - List appointments for date range
   * Query params: startDate, endDate
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/appointments` as const,

  /**
   * POST /users/:userId/appointments - Create appointment
   * @param userId - User's unique identifier
   */
  create: (userId: string) => `/users/${userId}/appointments` as const,

  /**
   * PUT /users/:userId/appointments/:appointmentId - Update appointment
   * @param userId - User's unique identifier
   * @param appointmentId - Appointment's unique identifier
   */
  update: (userId: string, appointmentId: string) =>
    `/users/${userId}/appointments/${appointmentId}` as const,

  /**
   * PATCH /users/:userId/appointments/:appointmentId/cancel - Cancel appointment
   * @param userId - User's unique identifier
   * @param appointmentId - Appointment's unique identifier
   */
  cancel: (userId: string, appointmentId: string) =>
    `/users/${userId}/appointments/${appointmentId}/cancel` as const,
} as const;

// ============================================================================
// ADMIN ROUTES
// ============================================================================

/**
 * Admin/CRM API routes.
 * Base path: /admin
 * Requires admin or clinician role.
 *
 * @group ADMIN
 */
export const ADMIN_ROUTES = {
  /** GET /admin/analytics - Get CRM analytics data */
  ANALYTICS: '/admin/analytics',
  /** GET /admin/cache-metrics - Get cache performance metrics */
  CACHE_METRICS: '/admin/cache-metrics',
  /** POST /admin/lab-extraction - Extract lab data from document */
  LAB_EXTRACTION: '/admin/lab-extraction',
} as const;

/** Type for admin route values */
export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];

// ============================================================================
// CRM/EVENTS ROUTES
// ============================================================================

/**
 * CRM events API routes.
 * Base path: /api/crm
 *
 * @group CRM
 */
export const CRM_ROUTES = {
  /** POST /api/crm/events - Create user event for compliance tracking */
  EVENTS: '/api/crm/events',
} as const;

/** Type for CRM route values */
export type CrmRoute = (typeof CRM_ROUTES)[keyof typeof CRM_ROUTES];

// ============================================================================
// AGGREGATED API ROUTES
// ============================================================================

/**
 * Complete API routes registry.
 * Use this for centralized access to all route definitions.
 *
 * @example
 * ```ts
 * import { API_ROUTES } from '@hollis/contracts/api';
 *
 * // Static route
 * await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
 *
 * // Dynamic route
 * await apiClient.get(API_ROUTES.USERS.get(userId));
 * ```
 */
export const API_ROUTES = {
  AUTH: AUTH_ROUTES,
  USERS: USER_ROUTES,
  DAILY_METRICS: DAILY_METRICS_ROUTES,
  DAILY_SUMMARY: DAILY_SUMMARY_ROUTES,
  BIOMETRICS: BIOMETRICS_ROUTES,
  JOURNAL: JOURNAL_ROUTES,
  NUTRITION: NUTRITION_ROUTES,
  APPOINTMENTS: APPOINTMENTS_ROUTES,
  ADMIN: ADMIN_ROUTES,
  CRM: CRM_ROUTES,
} as const;

// ============================================================================
// ROUTE METADATA (for documentation/validation)
// ============================================================================

/**
 * Route metadata registry for documentation and validation.
 * Maps route paths to their metadata.
 *
 * Note: This is primarily for documentation purposes and can be used
 * by the server to validate route definitions match expected patterns.
 */
export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  // Auth routes
  [AUTH_ROUTES.LOGIN]: {
    method: 'POST',
    description: 'Authenticate user with email/password',
    requiresAuth: false,
  },
  [AUTH_ROUTES.SIGNUP]: {
    method: 'POST',
    description: 'Create new user account with password',
    requiresAuth: false,
  },
  [AUTH_ROUTES.REFRESH]: {
    method: 'POST',
    description: 'Refresh access token using refresh token',
    requiresAuth: false,
  },
  [AUTH_ROUTES.LINK]: {
    method: 'POST',
    description: 'Link OAuth credentials to existing account',
    requiresAuth: true,
  },
  [AUTH_ROUTES.LOGOUT]: {
    method: 'POST',
    description: 'Sign out current session',
    requiresAuth: true,
  },
  // Admin routes
  [ADMIN_ROUTES.ANALYTICS]: {
    method: 'GET',
    description: 'Get CRM analytics dashboard data',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [ADMIN_ROUTES.CACHE_METRICS]: {
    method: 'GET',
    description: 'Get cache performance metrics',
    requiresAuth: true,
    requiresAdmin: true,
  },
  [ADMIN_ROUTES.LAB_EXTRACTION]: {
    method: 'POST',
    description: 'Extract lab data from uploaded document using AI',
    requiresAuth: true,
    requiresAdmin: true,
  },
  // CRM routes
  [CRM_ROUTES.EVENTS]: {
    method: 'POST',
    description: 'Create user event for compliance tracking',
    requiresAuth: true,
  },
} as const;

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
