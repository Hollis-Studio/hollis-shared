/**
 * @ai-context User Routes | user profile and settings API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */

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
  ME: "/users/me" as const,

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
  updatePreferences: (userId: string) =>
    `/users/${userId}/preferences` as const,

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
export type UserRoute = {
  [K in keyof typeof USER_ROUTES]: (typeof USER_ROUTES)[K] extends (
    ...args: unknown[]
  ) => infer R
    ? R
    : (typeof USER_ROUTES)[K];
}[keyof typeof USER_ROUTES];

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
