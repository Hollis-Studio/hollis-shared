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
    ME: "/users/me",
    /**
     * GET /users/:userId - Get user account data
     * @param userId - User's unique identifier
     */
    get: (userId) => `/users/${userId}`,
    /**
     * PUT /users/:userId/profile - Update user profile
     * @param userId - User's unique identifier
     */
    updateProfile: (userId) => `/users/${userId}/profile`,
    /**
     * PATCH /users/:userId/preferences - Update user preferences
     * @param userId - User's unique identifier
     */
    updatePreferences: (userId) => `/users/${userId}/preferences`,
    /**
     * PATCH /users/:userId/goals - Update user goals
     * @param userId - User's unique identifier
     */
    updateGoals: (userId) => `/users/${userId}/goals`,
    /**
     * GET /users/:userId/health-progress - Get health progress analytics
     * @param userId - User's unique identifier
     */
    healthProgress: (userId) => `/users/${userId}/health-progress`,
    /**
     * GET /users/:userId/health-progress/history - Get historical health progress
     * @param userId - User's unique identifier
     */
    healthProgressHistory: (userId) => `/users/${userId}/health-progress/history`,
    /**
     * GET /users/:userId/health-goals - Get health metric goals
     * @param userId - User's unique identifier
     */
    healthGoals: (userId) => `/users/${userId}/health-goals`,
    /**
     * GET /users/:userId/compliance - Get compliance metrics
     * @param userId - User's unique identifier
     */
    compliance: (userId) => `/users/${userId}/compliance`,
    /**
     * POST /users/:userId/data-export - HIPAA §164.524 right-of-access data export
     * @param userId - User's unique identifier
     */
    dataExport: (userId) => `/users/${userId}/data-export`,
};
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
    get: (userId, date) => `/users/${userId}/daily-metrics/${date}`,
    /**
     * GET /users/:userId/daily-metrics - List metrics for date range
     * Query params: startDate, endDate
     * @param userId - User's unique identifier
     */
    list: (userId) => `/users/${userId}/daily-metrics`,
    /**
     * PUT /users/:userId/daily-metrics/:date - Update metrics for date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    update: (userId, date) => `/users/${userId}/daily-metrics/${date}`,
};
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
    get: (userId, date) => `/users/${userId}/daily-summary/${date}`,
};
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
    list: (userId) => `/users/${userId}/journal`,
    /**
     * POST /users/:userId/journal - Create journal entry
     * @param userId - User's unique identifier
     */
    create: (userId) => `/users/${userId}/journal`,
    /**
     * PUT /users/:userId/journal/:entryId - Update journal entry
     * @param userId - User's unique identifier
     * @param entryId - Entry's unique identifier
     */
    update: (userId, entryId) => `/users/${userId}/journal/${entryId}`,
    /**
     * DELETE /users/:userId/journal/:entryId - Delete journal entry
     * @param userId - User's unique identifier
     * @param entryId - Entry's unique identifier
     */
    delete: (userId, entryId) => `/users/${userId}/journal/${entryId}`,
};
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
    balances: (userId) => `/users/${userId}/sessions/balances`,
    /**
     * POST /users/:userId/sessions/use - Use a session
     * @param userId - User's unique identifier
     */
    use: (userId) => `/users/${userId}/sessions/use`,
    /**
     * POST /users/:userId/sessions/adjust - Admin adjustment to session balance
     * @param userId - User's unique identifier
     */
    adjust: (userId) => `/users/${userId}/sessions/adjust`,
    /**
     * POST /users/:userId/sessions/check - Check session availability
     * @param userId - User's unique identifier
     */
    check: (userId) => `/users/${userId}/sessions/check`,
    /**
     * GET /users/:userId/sessions/history - Get session usage history
     * @param userId - User's unique identifier
     */
    history: (userId) => `/users/${userId}/sessions/history`,
    /**
     * PATCH /users/:userId/sessions/billing-anchor - Update billing anchor date
     * @param userId - User's unique identifier
     */
    billingAnchor: (userId) => `/users/${userId}/sessions/billing-anchor`,
    /**
     * GET /users/:userId/sessions - Get session data
     * @param userId - User's unique identifier
     */
    get: (userId) => `/users/${userId}/sessions`,
    /**
     * GET /users/:userId/sessions/billing-date - Get next billing date
     * @param userId - User's unique identifier
     */
    billingDate: (userId) => `/users/${userId}/sessions/billing-date`,
    /**
     * POST /users/:userId/sessions/tier-change - Handle tier change
     * @param userId - User's unique identifier
     */
    tierChange: (userId) => `/users/${userId}/sessions/tier-change`,
};
//# sourceMappingURL=users.js.map