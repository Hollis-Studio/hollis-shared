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
  /** POST - Request password reset email */
  FORGOT_PASSWORD: '/auth/forgot-password',
  /** POST - Reset password using token */
  RESET_PASSWORD: '/auth/reset-password',
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
   * GET /users/:userId/health-progress - Get health progress analytics
   * @param userId - User's unique identifier
   */
  healthProgress: (userId: string) => `/users/${userId}/health-progress` as const,

  /**
   * GET /users/:userId/health-progress/history - Get historical health progress
   * @param userId - User's unique identifier
   */
  healthProgressHistory: (userId: string) => `/users/${userId}/health-progress/history` as const,

  /**
   * GET /users/:userId/health-goals - Get health metric goals
   * @param userId - User's unique identifier
   */
  healthGoals: (userId: string) => `/users/${userId}/health-goals` as const,

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

  /**
   * POST /users/:userId/nutrition/analyze - Analyze nutrition data
   * @param userId - User's unique identifier
   */
  analyze: (userId: string) => `/users/${userId}/nutrition/analyze` as const,
} as const;

// ============================================================================
// PLANS ROUTES
// ============================================================================

/**
 * Plans API routes (workout and nutrition plans).
 * Base path: /api/plans
 *
 * @group PLANS
 */
export const PLANS_ROUTES = {
  /**
   * GET /api/plans/workout - Get workout plan
   * Query params: userId, date (or userId, startDate, endDate for range)
   */
  WORKOUT: '/api/plans/workout',

  /**
   * POST /api/plans/workout - Create/update workout plan
   */
  WORKOUT_UPSERT: '/api/plans/workout',

  /**
   * PUT /api/plans/workout/:workoutId/toggle-complete - Toggle workout completion
   * @param workoutId - Workout's unique identifier
   */
  toggleWorkoutComplete: (workoutId: string) => `/api/plans/workout/${workoutId}/toggle-complete` as const,

  /**
   * GET /api/plans/nutrition - Get nutrition plan
   * Query params: userId, date
   */
  NUTRITION: '/api/plans/nutrition',

  /**
   * POST /api/plans/nutrition - Create/update nutrition plan
   */
  NUTRITION_UPSERT: '/api/plans/nutrition',

  /**
   * POST /api/plans/nutrition/simple - Create/update simple nutrition plan
   */
  NUTRITION_SIMPLE: '/api/plans/nutrition/simple',
} as const;

// ============================================================================
// TRAINING STRATEGIES ROUTES
// ============================================================================

/**
 * Training strategies API routes.
 * Base path: /users/:userId/strategies
 *
 * @group STRATEGIES
 */
export const STRATEGIES_ROUTES = {
  /**
   * GET /users/:userId/strategies - List user's training strategies
   * Query params: status, includePhases
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/strategies` as const,

  /**
   * GET /users/:userId/strategies/active - Get active strategy (deprecated, use list with status filter)
   * @param userId - User's unique identifier
   */
  active: (userId: string) => `/users/${userId}/strategies/active` as const,

  /**
   * GET /users/:userId/strategies/:strategyId - Get strategy details
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  get: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}` as const,

  /**
   * POST /users/:userId/strategies - Create new strategy
   * @param userId - User's unique identifier
   */
  create: (userId: string) => `/users/${userId}/strategies` as const,

  /**
   * PUT /users/:userId/strategies/:strategyId - Update strategy
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  update: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}` as const,

  /**
   * DELETE /users/:userId/strategies/:strategyId - Delete strategy
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  delete: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}` as const,

  /**
   * POST /users/:userId/strategies/:strategyId/sync - Sync progress from data source
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  sync: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}/sync` as const,

  /**
   * PUT /users/:userId/strategies/:strategyId/progress - Update goal progress
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  updateProgress: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}/progress` as const,

  /**
   * POST /users/:userId/strategies/:strategyId/goals - Add goal to strategy
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  addGoal: (userId: string, strategyId: string) => `/users/${userId}/strategies/${strategyId}/goals` as const,

  /**
   * PUT /users/:userId/strategies/:strategyId/goals/:goalId - Update goal
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   * @param goalId - Goal's unique identifier
   */
  updateGoal: (userId: string, strategyId: string, goalId: string) =>
    `/users/${userId}/strategies/${strategyId}/goals/${goalId}` as const,

  /**
   * DELETE /users/:userId/strategies/:strategyId/goals/:goalId - Remove goal
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   * @param goalId - Goal's unique identifier
   */
  deleteGoal: (userId: string, strategyId: string, goalId: string) =>
    `/users/${userId}/strategies/${strategyId}/goals/${goalId}` as const,
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
// LABS ROUTES
// ============================================================================

/**
 * Labs API routes.
 * Base path: /api/labs
 *
 * @group LABS
 */
export const LABS_ROUTES = {
  /**
   * GET /api/labs - Get lab panels for user
   * Query params: userId, includePanels
   */
  LIST: '/api/labs',

  /**
   * GET /api/labs/panels/:panelId - Get specific lab panel
   * @param panelId - Lab panel's unique identifier
   */
  getPanel: (panelId: string) => `/api/labs/panels/${panelId}` as const,

  /**
   * POST /api/labs/panels - Create new lab panel
   */
  CREATE_PANEL: '/api/labs/panels',

  /**
   * POST /api/labs/auto-ingest - Auto-ingest lab data
   */
  AUTO_INGEST: '/api/labs/auto-ingest',
} as const;

// ============================================================================
// MESSAGES ROUTES
// ============================================================================

/**
 * Messages API routes.
 * Base path: /api/messages
 *
 * @group MESSAGES
 */
export const MESSAGES_ROUTES = {
  /**
   * GET /api/messages - Get messages
   * Query params: userId, role
   */
  LIST: '/api/messages',

  /**
   * POST /api/messages - Send a message
   */
  SEND: '/api/messages',

  /**
   * PUT /api/messages/read - Mark messages as read
   */
  MARK_READ: '/api/messages/read',

  /**
   * GET /api/messages/unread - Get unread message counts
   * Query params: userId
   */
  UNREAD: '/api/messages/unread',
} as const;

// ============================================================================
// UPLOAD ROUTES
// ============================================================================

/**
 * Upload API routes.
 * Base path: /api/upload
 *
 * @group UPLOAD
 */
export const UPLOAD_ROUTES = {
  /**
   * POST /api/upload - Upload a file
   */
  UPLOAD: '/api/upload',
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
// SESSIONS ROUTES
// ============================================================================

/**
 * Session balance/usage API routes.
 * Base path: /users/:userId/sessions
 *
 * @group SESSIONS
 */
export const SESSIONS_ROUTES = {
  /**
   * GET /users/:userId/sessions/balances - Get session balance info
   * @param userId - User's unique identifier
   */
  balances: (userId: string) => `/users/${userId}/sessions/balances` as const,

  /**
   * POST /users/:userId/sessions/use - Use a session
   * @param userId - User's unique identifier
   */
  use: (userId: string) => `/users/${userId}/sessions/use` as const,

  /**
   * POST /users/:userId/sessions/adjust - Admin adjustment to session balance
   * @param userId - User's unique identifier
   */
  adjust: (userId: string) => `/users/${userId}/sessions/adjust` as const,

  /**
   * POST /users/:userId/sessions/check - Check session availability
   * @param userId - User's unique identifier
   */
  check: (userId: string) => `/users/${userId}/sessions/check` as const,

  /**
   * GET /users/:userId/sessions/history - Get session usage history
   * @param userId - User's unique identifier
   */
  history: (userId: string) => `/users/${userId}/sessions/history` as const,

  /**
   * PATCH /users/:userId/sessions/billing-anchor - Update billing anchor date
   * @param userId - User's unique identifier
   */
  billingAnchor: (userId: string) => `/users/${userId}/sessions/billing-anchor` as const,

  /**
   * GET /users/:userId/sessions - Get session data
   * @param userId - User's unique identifier
   */
  get: (userId: string) => `/users/${userId}/sessions` as const,

  /**
   * GET /users/:userId/sessions/billing-date - Get next billing date
   * @param userId - User's unique identifier
   */
  billingDate: (userId: string) => `/users/${userId}/sessions/billing-date` as const,

  /**
   * POST /users/:userId/sessions/tier-change - Handle tier change
   * @param userId - User's unique identifier
   */
  tierChange: (userId: string) => `/users/${userId}/sessions/tier-change` as const,
} as const;

/** Type for sessions route values */
export type SessionsRoute = ReturnType<(typeof SESSIONS_ROUTES)[keyof typeof SESSIONS_ROUTES]>;

// ============================================================================
// PROVIDERS ROUTES
// ============================================================================

/**
 * Providers API routes.
 * Base path: /api/providers
 *
 * @group PROVIDERS
 */
export const PROVIDERS_ROUTES = {
  /** GET /api/providers - List all providers */
  LIST: '/api/providers',

  /**
   * GET /api/providers/:providerId - Get single provider
   * @param providerId - Provider's unique identifier
   */
  get: (providerId: string) => `/api/providers/${providerId}` as const,

  /**
   * GET /api/providers/:providerId/available-slots - Get available slots
   * Query params: startDate, endDate
   * @param providerId - Provider's unique identifier
   */
  availableSlots: (providerId: string) => `/api/providers/${providerId}/available-slots` as const,

  /**
   * GET/PUT /api/providers/:providerId/schedule - Get or update provider schedule
   * @param providerId - Provider's unique identifier
   */
  schedule: (providerId: string) => `/api/providers/${providerId}/schedule` as const,
  /**
   * GET /api/providers/:providerId/availability - Get provider availability
   * @param providerId - Provider's unique identifier
   */
  availability: (providerId: string) => `/api/providers/${providerId}/availability` as const,} as const;

/** Type for providers route values */
export type ProvidersRoute =
  | (typeof PROVIDERS_ROUTES)['LIST']
  | ReturnType<Exclude<(typeof PROVIDERS_ROUTES)[keyof typeof PROVIDERS_ROUTES], string>>;

// ============================================================================
// DOCUMENTS ROUTES
// ============================================================================

/**
 * Documents API routes.
 * Base path: /api/documents
 *
 * @group DOCUMENTS
 */
export const DOCUMENTS_ROUTES = {
  /** GET /api/documents - List all documents for user */
  LIST: '/api/documents',

  /** POST /api/documents - Create/upload document */
  CREATE: '/api/documents',

  /**
   * GET /api/documents/:documentId - Get single document
   * @param documentId - Document's unique identifier
   */
  get: (documentId: string) => `/api/documents/${documentId}` as const,

  /**
   * DELETE /api/documents/:documentId - Delete document
   * @param documentId - Document's unique identifier
   */
  delete: (documentId: string) => `/api/documents/${documentId}` as const,
} as const;

/** Type for documents route values */
export type DocumentsRoute =
  | (typeof DOCUMENTS_ROUTES)['LIST']
  | (typeof DOCUMENTS_ROUTES)['CREATE']
  | ReturnType<Exclude<(typeof DOCUMENTS_ROUTES)[keyof typeof DOCUMENTS_ROUTES], string>>;

// ============================================================================
// PUSH NOTIFICATION ROUTES
// ============================================================================

/**
 * Push notification API routes.
 * Base path: /api/push
 *
 * @group PUSH
 */
export const PUSH_ROUTES = {
  /** POST /api/push/register - Register push notification token */
  REGISTER: '/api/push/register',

  /** DELETE /api/push/unregister - Unregister push notification token */
  UNREGISTER: '/api/push/unregister',

  /** POST /api/push/test - Send test notification */
  TEST: '/api/push/test',
} as const;

/** Type for push route values */
export type PushRoute = (typeof PUSH_ROUTES)[keyof typeof PUSH_ROUTES];

// ============================================================================
// SSE (Server-Sent Events) ROUTES
// ============================================================================

/**
 * SSE API routes.
 * Base path: /api/sse
 *
 * @group SSE
 */
export const SSE_ROUTES = {
  /** POST /api/sse/token - Exchange JWT for SSE token */
  TOKEN: '/api/sse/token',

  /** GET /api/sse/connect - SSE stream connection */
  CONNECT: '/api/sse/connect',

  /** GET /api/sse/stats - Get connection stats (admin only) */
  STATS: '/api/sse/stats',
} as const;

/** Type for SSE route values */
export type SseRoute = (typeof SSE_ROUTES)[keyof typeof SSE_ROUTES];

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
  PLANS: PLANS_ROUTES,
  STRATEGIES: STRATEGIES_ROUTES,
  APPOINTMENTS: APPOINTMENTS_ROUTES,
  LABS: LABS_ROUTES,
  MESSAGES: MESSAGES_ROUTES,
  UPLOAD: UPLOAD_ROUTES,
  ADMIN: ADMIN_ROUTES,
  CRM: CRM_ROUTES,
  SESSIONS: SESSIONS_ROUTES,
  PROVIDERS: PROVIDERS_ROUTES,
  DOCUMENTS: DOCUMENTS_ROUTES,
  PUSH: PUSH_ROUTES,
  SSE: SSE_ROUTES,
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
