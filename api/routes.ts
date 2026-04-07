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

// DEFERRED(audit-#44): [Barrel complexity] This file is 1195 lines and serves as both a route
// registry AND an inline type definition hub for all API endpoints across the monorepo.
// Severity: Medium | Rationale: File is correct and well-organized. All consumers import correctly.
// The complexity is structural (many endpoints) rather than an indicator of bugs.
// Revisit: When the number of routes grows significantly or causes slow TypeScript compilation.
// Consider splitting into routes/auth.ts, routes/users.ts, routes/admin.ts, etc. sub-registries.

// ============================================================================
// TYPE HELPERS (canonical source: ./routes/types.ts)
// ============================================================================

// Local import for use within this file
import type {
    HttpMethod as _HttpMethod,
    RouteMetadata as _RouteMetadata,
} from "./routes/types";
import { HTTP_METHODS as _HTTP_METHODS } from "./routes/types";

/**
 * HTTP methods supported by the API.
 * @deprecated Import from './routes/types' instead
 */
export const HTTP_METHODS = _HTTP_METHODS;
/** @deprecated Import from './routes/types' instead */
export type HttpMethod = _HttpMethod;

/**
 * Route metadata for documentation and validation purposes.
 * @deprecated Import from './routes/types' instead
 */
export type RouteMetadata = _RouteMetadata;

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
  LOGIN: "/auth/login",
  /** POST - Create new account with password */
  SIGNUP: "/auth/signup",
  /** POST - Refresh access token using refresh token */
  REFRESH: "/auth/refresh",
  /** POST - OAuth social sign-in (Apple or Google) with nonce + CSRF state verification */
  OAUTH_SIGN_IN: "/auth/oauth",
  /**
   * POST - OAuth social registration (Apple or Google) during barcode onboarding.
   * Creates a new account by combining a social identity token with a barcode claim.
   */
  OAUTH_REGISTER: "/auth/oauth-register",
  /** POST - Sign out current session */
  LOGOUT: "/auth/logout",
  /** POST - Request password reset email */
  FORGOT_PASSWORD: "/auth/forgot-password",
  /** POST - Reset password using token */
  RESET_PASSWORD: "/auth/reset-password",
  /** POST - Issue a refresh token to store for biometric login */
  BIOMETRIC_TOKEN: "/auth/biometric-token",
  /** POST - Validate a registration barcode */
  VALIDATE_BARCODE: "/auth/validate-barcode",
  /** POST - Change password for authenticated user (invalidates all sessions) */
  CHANGE_PASSWORD: "/auth/change-password",
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
   * GET /users/me - Get current authenticated user's profile
   */
  ME: "/users/me",

  /**
   * GET /users/:userId - Get user account data
   * @param userId - User's unique identifier
   */
  get: (userId: string) => `/users/${userId}` as const,

  /**
   * PUT /users/:userId/profile - Update user profile
   * @param userId - User's unique identifier
   */
  updateProfile: (userId: string) => `/users/${userId}/profile` as const,

  /**
   * PATCH /users/:userId/preferences - Update user preferences
   * @param userId - User's unique identifier
   */
  updatePreferences: (userId: string) =>
    `/users/${userId}/preferences` as const,

  /**
   * GET /users/:userId/goals - Get user goals
   * @param userId - User's unique identifier
   */
  goals: (userId: string) => `/users/${userId}/goals` as const,

  /**
   * PUT /users/:userId/goals - Update user goals
   * @param userId - User's unique identifier
   */
  updateGoals: (userId: string) => `/users/${userId}/goals` as const,

  /**
   * GET /users/:userId/health-progress - Get health progress analytics
   * @param userId - User's unique identifier
   */
  healthProgress: (userId: string) =>
    `/users/${userId}/health-progress` as const,

  /**
   * GET /users/:userId/health-progress/history - Get historical health progress
   * @param userId - User's unique identifier
   */
  healthProgressHistory: (userId: string) =>
    `/users/${userId}/health-progress/history` as const,

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
export type UserRoute =
  | typeof USER_ROUTES.ME
  | ReturnType<Exclude<(typeof USER_ROUTES)[keyof typeof USER_ROUTES], string>>;

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
  get: (userId: string, date: string) =>
    `/users/${userId}/daily-metrics/${date}` as const,

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
  update: (userId: string, date: string) =>
    `/users/${userId}/daily-metrics/${date}` as const,
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
  get: (userId: string, date: string) =>
    `/users/${userId}/daily-summary/${date}` as const,
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
  delete: (userId: string, entryId: string) =>
    `/users/${userId}/biometrics/${entryId}` as const,
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
  update: (userId: string, entryId: string) =>
    `/users/${userId}/journal/${entryId}` as const,

  /**
   * DELETE /users/:userId/journal/:entryId - Delete journal entry
   * @param userId - User's unique identifier
   * @param entryId - Entry's unique identifier
   */
  delete: (userId: string, entryId: string) =>
    `/users/${userId}/journal/${entryId}` as const,
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
  get: (userId: string, date: string) =>
    `/users/${userId}/nutrition/${date}` as const,

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
  upsert: (userId: string, date: string) =>
    `/users/${userId}/nutrition/${date}` as const,

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
  WORKOUT: "/api/plans/workout",

  /**
   * POST /api/plans/workout - Create/update workout plan
   */
  WORKOUT_UPSERT: "/api/plans/workout",

  /**
   * PUT /api/plans/workout/:workoutId/toggle-complete - Toggle workout completion
   * @param workoutId - Workout's unique identifier
   */
  toggleWorkoutComplete: (workoutId: string) =>
    `/api/plans/workout/${workoutId}/toggle-complete` as const,

  /**
   * GET /api/plans/nutrition - Get nutrition plan
   * Query params: userId, date
   */
  NUTRITION: "/api/plans/nutrition",

  /**
   * POST /api/plans/nutrition - Create/update nutrition plan
   */
  NUTRITION_UPSERT: "/api/plans/nutrition",

  /**
   * POST /api/plans/nutrition/simple - Create/update simple nutrition plan
   */
  NUTRITION_SIMPLE: "/api/plans/nutrition/simple",
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
  get: (userId: string, strategyId: string) =>
    `/users/${userId}/strategies/${strategyId}` as const,

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
  update: (userId: string, strategyId: string) =>
    `/users/${userId}/strategies/${strategyId}` as const,

  /**
   * DELETE /users/:userId/strategies/:strategyId - Delete strategy
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  delete: (userId: string, strategyId: string) =>
    `/users/${userId}/strategies/${strategyId}` as const,

  /**
   * POST /users/:userId/strategies/:strategyId/sync - Sync progress from data source
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  sync: (userId: string, strategyId: string) =>
    `/users/${userId}/strategies/${strategyId}/sync` as const,

  /**
   * PUT /users/:userId/strategies/:strategyId/progress - Update goal progress
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  updateProgress: (userId: string, strategyId: string) =>
    `/users/${userId}/strategies/${strategyId}/progress` as const,

  /**
   * POST /users/:userId/strategies/:strategyId/goals - Add goal to strategy
   * @param userId - User's unique identifier
   * @param strategyId - Strategy's unique identifier
   */
  addGoal: (userId: string, strategyId: string) =>
    `/users/${userId}/strategies/${strategyId}/goals` as const,

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
  upcoming: (userId: string) =>
    `/users/${userId}/appointments/upcoming` as const,

  /**
   * GET /users/:userId/appointments - List appointments for date range
   * Query params: startDate, endDate
   * @param userId - User's unique identifier
   */
  list: (userId: string) => `/users/${userId}/appointments` as const,

  /**
   * GET /users/:userId/appointments/:appointmentId - Get single appointment by ID
   * @param userId - User's unique identifier
   * @param appointmentId - Appointment's unique identifier
   */
  get: (userId: string, appointmentId: string) =>
    `/users/${userId}/appointments/${appointmentId}` as const,

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
  LIST: "/api/labs",

  /**
   * GET /api/labs?userId={userId}&includeReports=true - Get lab reports for user
   * @param userId - User's unique identifier
   */
  getReports: (userId: string) =>
    `/api/labs?userId=${userId}&includeReports=true` as const,

  /**
   * GET /api/labs/reports/:reportId - Get specific lab report
   * @param reportId - Lab report's unique identifier
   */
  getReport: (reportId: string) => `/api/labs/reports/${reportId}` as const,

  /**
   * GET /api/labs/panels/:panelId - Get specific lab panel
   * @param panelId - Lab panel's unique identifier
   */
  getPanel: (panelId: string) => `/api/labs/panels/${panelId}` as const,

  /**
   * GET /api/labs/metric-definitions - List canonical lab metric definitions
   * Query params: search, category, page, limit
   * Used for biomarker picker dropdown
   */
  METRIC_DEFINITIONS: "/api/labs/metric-definitions",
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
  LIST: "/api/messages",

  /**
   * POST /api/messages - Send a message
   */
  SEND: "/api/messages",

  /**
   * DELETE /api/messages/:messageId - Delete a message (sender-only)
   */
  DELETE: "/api/messages",

  /**
   * PUT /api/messages/read - Mark messages as read
   */
  MARK_READ: "/api/messages/read",

  /**
   * GET /api/messages/unread - Get unread message counts
   * Query params: userId
   */
  UNREAD: "/api/messages/unread",
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
  UPLOAD: "/api/upload",
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
  ANALYTICS: "/admin/analytics",
  /** GET /admin/cache-metrics - Get cache performance metrics */
  CACHE_METRICS: "/admin/cache-metrics",
  /** POST /admin/lab-extraction - Extract lab data from document */
  LAB_EXTRACTION: "/admin/lab-extraction",
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
  EVENTS: "/api/crm/events",
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
  billingAnchor: (userId: string) =>
    `/users/${userId}/sessions/billing-anchor` as const,

  /**
   * GET /users/:userId/sessions - Get session data
   * @param userId - User's unique identifier
   */
  get: (userId: string) => `/users/${userId}/sessions` as const,

  /**
   * GET /users/:userId/sessions/billing-date - Get next billing date
   * @param userId - User's unique identifier
   */
  billingDate: (userId: string) =>
    `/users/${userId}/sessions/billing-date` as const,

  /**
   * POST /users/:userId/sessions/tier-change - Handle tier change
   * @param userId - User's unique identifier
   */
  tierChange: (userId: string) =>
    `/users/${userId}/sessions/tier-change` as const,
} as const;

/** Type for sessions route values */
export type SessionsRoute = ReturnType<
  (typeof SESSIONS_ROUTES)[keyof typeof SESSIONS_ROUTES]
>;

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
  LIST: "/api/providers",

  /**
   * GET /api/providers/:providerId - Get single provider
   * @param providerId - Provider's unique identifier
   * @note B-13: No known client caller — server route exists but is currently unused by mobile/web-admin
   */
  get: (providerId: string) => `/api/providers/${providerId}` as const,

  /**
   * GET /api/providers/:providerId/availability - Get available booking slots
   * Query params: date, days
   * @param providerId - Provider's unique identifier
   */
  availability: (providerId: string) =>
    `/api/providers/${providerId}/availability` as const,

  /**
   * GET/PUT /api/providers/:providerId/schedule - Get or update provider schedule
   * @param providerId - Provider's unique identifier
   */
  schedule: (providerId: string) =>
    `/api/providers/${providerId}/schedule` as const,
} as const;

/** Type for providers route values */
export type ProvidersRoute =
  | (typeof PROVIDERS_ROUTES)["LIST"]
  | ReturnType<
      Exclude<(typeof PROVIDERS_ROUTES)[keyof typeof PROVIDERS_ROUTES], string>
    >;

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
  LIST: "/api/documents",

  /** POST /api/documents - Create/upload document */
  CREATE: "/api/documents",

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
  | (typeof DOCUMENTS_ROUTES)["LIST"]
  | (typeof DOCUMENTS_ROUTES)["CREATE"]
  | ReturnType<
      Exclude<(typeof DOCUMENTS_ROUTES)[keyof typeof DOCUMENTS_ROUTES], string>
    >;

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
  REGISTER: "/api/push/register",

  /** DELETE /api/push/unregister - Unregister push notification token */
  UNREGISTER: "/api/push/unregister",

  /** POST /api/push/test - Send test notification */
  TEST: "/api/push/test",
} as const;

/** Type for push route values */
export type PushRoute = (typeof PUSH_ROUTES)[keyof typeof PUSH_ROUTES];

// ============================================================================
// SSE (Server-Sent Events) ROUTES
// ============================================================================

/**
 * SSE API routes.
 * Base path: /api/events
 *
 * @group SSE
 */
export const SSE_ROUTES = {
  /** POST /api/events/token - Exchange JWT for short-lived SSE token */
  TOKEN: "/api/events/token",

  /** GET /api/events/:userId - SSE stream for user-specific events */
  CONNECT: "/api/events",

  /** GET /api/events/stats - SSE connection statistics (admin only) */
  STATS: "/api/events/stats",
} as const;

/** Type for SSE route values */
export type SseRoute = (typeof SSE_ROUTES)[keyof typeof SSE_ROUTES];

// ============================================================================
// ADMIN PAYMENTS ROUTES
// ============================================================================

/**
 * Admin payments API routes.
 * Base path: /api/admin/payments
 * Requires admin role.
 *
 * @group ADMIN_PAYMENTS
 */
export const ADMIN_PAYMENTS_ROUTES = {
  /** GET /api/admin/payments/config - Get Stripe publishable key config */
  CONFIG: "/api/admin/payments/config",

  /** POST /api/admin/payments/setup-intent - Create SetupIntent for card save */
  SETUP_INTENT: "/api/admin/payments/setup-intent",

  /** POST /api/admin/payments/collect - Create PaymentIntent for one-time charge */
  COLLECT: "/api/admin/payments/collect",

  /**
   * POST /api/admin/payments/payment-methods/:userId - Attach payment method to user
   * @param userId - User's unique identifier
   */
  attachPaymentMethod: (userId: string) =>
    `/api/admin/payments/payment-methods/${userId}` as const,
} as const;

/** Type for admin payments route values */
export type AdminPaymentsRoute =
  | (typeof ADMIN_PAYMENTS_ROUTES)["CONFIG"]
  | (typeof ADMIN_PAYMENTS_ROUTES)["SETUP_INTENT"]
  | (typeof ADMIN_PAYMENTS_ROUTES)["COLLECT"]
  | ReturnType<typeof ADMIN_PAYMENTS_ROUTES.attachPaymentMethod>;

// ============================================================================
// ACCOUNT ROUTES (Customer Self-Service)
// ============================================================================

/**
 * Customer account API routes (read-only billing display).
 * Base path: /api/account
 * Requires authentication but NOT admin role.
 *
 * @group ACCOUNT
 */
export const ACCOUNT_ROUTES = {
  /** GET /api/account/subscription - Get current user's active subscription */
  SUBSCRIPTION: "/api/account/subscription",

  /** PATCH /api/account/subscription/pause - Pause current user's subscription */
  PAUSE_SUBSCRIPTION: "/api/account/subscription/pause",

  /** PATCH /api/account/subscription/resume - Resume current user's subscription */
  RESUME_SUBSCRIPTION: "/api/account/subscription/resume",

  /** PATCH /api/account/subscription/change-tier - Change current user's subscription tier */
  CHANGE_TIER: "/api/account/subscription/change-tier",

  /** GET /api/account/orders - Get current user's order history */
  ORDERS: "/api/account/orders",
  /** GET /api/account/payment-methods - Get current user's saved payment methods */
  PAYMENT_METHODS: "/api/account/payment-methods",

  /** POST /api/account/deletion-request - Submit a self-service account deletion request (GDPR/CCPA) */
  DELETION_REQUEST: "/api/account/deletion-request",
} as const;

/** Type for account route values */
export type AccountRoute = (typeof ACCOUNT_ROUTES)[keyof typeof ACCOUNT_ROUTES];

// ============================================================================
// PUBLIC BILLING ROUTES (unauthenticated — token IS the credential)
// ============================================================================

/**
 * Public billing API routes used by email-linked pages.
 * These routes do NOT require a session cookie — the signed billing token
 * embedded in the URL is the sole credential.  Base path: /public/billing
 *
 * @group PUBLIC_BILLING
 */
export const PUBLIC_BILLING_ROUTES = {
  /**
   * GET /public/billing/verify-token?token=<signed-token>
   * Verifies an HMAC-signed billing action token and returns { userId }.
   * Returns 400 for malformed tokens and 401 for expired/invalid tokens.
   */
  VERIFY_TOKEN: "/public/billing/verify-token",
} as const;

/** Type for public billing route values */
export type PublicBillingRoute =
  (typeof PUBLIC_BILLING_ROUTES)[keyof typeof PUBLIC_BILLING_ROUTES];

// ============================================================================
// PHI ROUTES
// ============================================================================

/**
 * Protected Health Information (PHI) API routes.
 * Base path: /phi
 *
 * SECURITY: All PHI routes enforce strict authorization and Cache-Control: no-store.
 * Users can only access their own PHI; clinicians their patients'; admins all.
 *
 * Query params (e.g. userId) are NOT part of the route path — append at call-site
 * using buildUrlWithQuery.
 *
 * @group PHI
 */
export const PHI_ROUTES = {
  // --- Labs ---

  /** GET /phi/labs - Lab panel timeline (query: userId) */
  LAB_TIMELINE: "/phi/labs",

  /**
   * GET /phi/labs/:panelId - Specific lab panel (query: userId)
   * @param panelId - Lab panel's unique identifier
   */
  labPanel: (panelId: string) => `/phi/labs/${panelId}` as const,

  /**
   * GET /phi/labs/results/:resultId - Specific lab result (query: userId)
   * @param resultId - Lab result's unique identifier
   */
  labResult: (resultId: string) => `/phi/labs/results/${resultId}` as const,

  // --- Trends ---

  /** GET /phi/trends - All clinical metric trends (query: userId) */
  ALL_TRENDS: "/phi/trends",

  /**
   * GET /phi/trends/:metricCode - Specific clinical metric trend (query: userId)
   * @param metricCode - Clinical metric code (e.g. "HBA1C", "GLUCOSE")
   */
  metricTrend: (metricCode: string) => `/phi/trends/${metricCode}` as const,

  // --- Care Team / Providers ---

  /** GET /phi/providers - Care team list (query: userId) */
  PROVIDERS: "/phi/providers",

  /**
   * GET /phi/providers/:memberId - Specific care team member (query: userId)
   * @param memberId - Care team member's unique identifier
   */
  provider: (memberId: string) => `/phi/providers/${memberId}` as const,
} as const;

/** Type for PHI route values */
export type PhiRoute =
  | (typeof PHI_ROUTES)["LAB_TIMELINE"]
  | (typeof PHI_ROUTES)["ALL_TRENDS"]
  | (typeof PHI_ROUTES)["PROVIDERS"]
  | ReturnType<typeof PHI_ROUTES.labPanel>
  | ReturnType<typeof PHI_ROUTES.labResult>
  | ReturnType<typeof PHI_ROUTES.metricTrend>
  | ReturnType<typeof PHI_ROUTES.provider>;

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
  ADMIN_PAYMENTS: ADMIN_PAYMENTS_ROUTES,
  CRM: CRM_ROUTES,
  SESSIONS: SESSIONS_ROUTES,
  PROVIDERS: PROVIDERS_ROUTES,
  DOCUMENTS: DOCUMENTS_ROUTES,
  PUSH: PUSH_ROUTES,
  SSE: SSE_ROUTES,
  ACCOUNT: ACCOUNT_ROUTES,
  PHI: PHI_ROUTES,
  PUBLIC_BILLING: PUBLIC_BILLING_ROUTES,
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
    method: "POST",
    description: "Authenticate user with email/password",
    requiresAuth: false,
  },
  [AUTH_ROUTES.SIGNUP]: {
    method: "POST",
    description: "Create new user account with password",
    requiresAuth: false,
  },
  [AUTH_ROUTES.REFRESH]: {
    method: "POST",
    description: "Refresh access token using refresh token",
    requiresAuth: false,
  },
  [AUTH_ROUTES.LOGOUT]: {
    method: "POST",
    description: "Sign out current session",
    requiresAuth: true,
  },
  // Admin routes
  [ADMIN_ROUTES.ANALYTICS]: {
    method: "GET",
    description: "Get CRM analytics dashboard data",
    requiresAuth: true,
    requiresAdmin: true,
  },
  [ADMIN_ROUTES.CACHE_METRICS]: {
    method: "GET",
    description: "Get cache performance metrics",
    requiresAuth: true,
    requiresAdmin: true,
  },
  [ADMIN_ROUTES.LAB_EXTRACTION]: {
    method: "POST",
    description: "Extract lab data from uploaded document using AI",
    requiresAuth: true,
    requiresAdmin: true,
  },
  // CRM routes
  [CRM_ROUTES.EVENTS]: {
    method: "POST",
    description: "Create user event for compliance tracking",
    requiresAuth: true,
  },
  // Account routes (customer self-service)
  [ACCOUNT_ROUTES.SUBSCRIPTION]: {
    method: "GET",
    description: "Get current user's active subscription",
    requiresAuth: true,
  },
  [ACCOUNT_ROUTES.ORDERS]: {
    method: "GET",
    description: "Get current user's order history",
    requiresAuth: true,
  },
  [ACCOUNT_ROUTES.PAYMENT_METHODS]: {
    method: "GET",
    description: "Get current user's saved payment methods",
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
    .replace(/\/[a-f0-9-]{36}\//gi, "/:id/")
    .replace(/\/[a-f0-9-]{36}$/gi, "/:id")
    .replace(/\/\d{4}-\d{2}-\d{2}\//gi, "/:date/")
    .replace(/\/\d{4}-\d{2}-\d{2}$/gi, "/:date")
    .replace(/\/[A-Za-z0-9_-]{20,}\//gi, "/:id/")
    .replace(/\/[A-Za-z0-9_-]{20,}$/gi, "/:id");
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
