/**
 * @ai-context User Routes | user profile and settings API endpoints
 *
 * deps: none | consumers: src/services/*, web-admin/services/*, server/src/*
 */
/**
 * User data API routes.
 * Base path: /users/:userId
 *
 * @group USERS
 */
export declare const USER_ROUTES: {
    /**
     * GET /users/me - Get current authenticated user's profile
     */
    readonly ME: "/users/me";
    /**
     * GET /users/:userId - Get user account data
     * @param userId - User's unique identifier
     */
    readonly get: (userId: string) => `/users/${string}`;
    /**
     * PUT /users/:userId/profile - Update user profile
     * @param userId - User's unique identifier
     */
    readonly updateProfile: (userId: string) => `/users/${string}/profile`;
    /**
     * PATCH /users/:userId/preferences - Update user preferences
     * @param userId - User's unique identifier
     */
    readonly updatePreferences: (userId: string) => `/users/${string}/preferences`;
    /**
     * PATCH /users/:userId/goals - Update user goals
     * @param userId - User's unique identifier
     */
    readonly updateGoals: (userId: string) => `/users/${string}/goals`;
    /**
     * GET /users/:userId/health-progress - Get health progress analytics
     * @param userId - User's unique identifier
     */
    readonly healthProgress: (userId: string) => `/users/${string}/health-progress`;
    /**
     * GET /users/:userId/health-progress/history - Get historical health progress
     * @param userId - User's unique identifier
     */
    readonly healthProgressHistory: (userId: string) => `/users/${string}/health-progress/history`;
    /**
     * GET /users/:userId/health-goals - Get health metric goals
     * @param userId - User's unique identifier
     */
    readonly healthGoals: (userId: string) => `/users/${string}/health-goals`;
    /**
     * GET /users/:userId/compliance - Get compliance metrics
     * @param userId - User's unique identifier
     */
    readonly compliance: (userId: string) => `/users/${string}/compliance`;
    /**
     * POST /users/:userId/data-export - HIPAA §164.524 right-of-access data export
     * @param userId - User's unique identifier
     */
    readonly dataExport: (userId: string) => `/users/${string}/data-export`;
    /**
     * POST /users/:userId/intake - Submit patient clinical intake form (v1)
     * @param userId - User's unique identifier
     * @ai-context PHI: clinic-launch patient intake; requires auth + selfOrAdmin
     * Added by: patient-intake agent (2026-05-19); version bump handled by consent-route agent
     */
    readonly intake: (userId: string) => `/users/${string}/intake`;
    /**
     * GET /users/:userId/intake - Fetch existing patient intake (for status check)
     * @param userId - User's unique identifier
     */
    readonly getIntake: (userId: string) => `/users/${string}/intake`;
};
/** Type for user route values */
export type UserRoute = {
    [K in keyof typeof USER_ROUTES]: (typeof USER_ROUTES)[K] extends (...args: unknown[]) => infer R ? R : (typeof USER_ROUTES)[K];
}[keyof typeof USER_ROUTES];
/**
 * Daily metrics API routes.
 * Base path: /users/:userId/daily-metrics
 *
 * @group DAILY_METRICS
 */
export declare const DAILY_METRICS_ROUTES: {
    /**
     * GET /users/:userId/daily-metrics/:date - Get metrics for specific date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly get: (userId: string, date: string) => `/users/${string}/daily-metrics/${string}`;
    /**
     * GET /users/:userId/daily-metrics - List metrics for date range
     * Query params: startDate, endDate
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/daily-metrics`;
    /**
     * PUT /users/:userId/daily-metrics/:date - Update metrics for date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly update: (userId: string, date: string) => `/users/${string}/daily-metrics/${string}`;
};
/**
 * Daily summary API routes.
 * Base path: /users/:userId/daily-summary
 *
 * @group DAILY_SUMMARY
 */
export declare const DAILY_SUMMARY_ROUTES: {
    /**
     * GET /users/:userId/daily-summary/:date - Get summary for specific date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly get: (userId: string, date: string) => `/users/${string}/daily-summary/${string}`;
};
/**
 * Journal entry API routes.
 * Base path: /users/:userId/journal
 *
 * @group JOURNAL
 */
export declare const JOURNAL_ROUTES: {
    /**
     * GET /users/:userId/journal - List journal entries
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/journal`;
    /**
     * POST /users/:userId/journal - Create journal entry
     * @param userId - User's unique identifier
     */
    readonly create: (userId: string) => `/users/${string}/journal`;
    /**
     * PUT /users/:userId/journal/:entryId - Update journal entry
     * @param userId - User's unique identifier
     * @param entryId - Entry's unique identifier
     */
    readonly update: (userId: string, entryId: string) => `/users/${string}/journal/${string}`;
    /**
     * DELETE /users/:userId/journal/:entryId - Delete journal entry
     * @param userId - User's unique identifier
     * @param entryId - Entry's unique identifier
     */
    readonly delete: (userId: string, entryId: string) => `/users/${string}/journal/${string}`;
};
/**
 * Session balance/usage API routes.
 * Base path: /users/:userId/sessions
 *
 * @group SESSIONS
 */
export declare const SESSIONS_ROUTES: {
    /**
     * GET /users/:userId/sessions/balances - Get session balance info
     * @param userId - User's unique identifier
     */
    readonly balances: (userId: string) => `/users/${string}/sessions/balances`;
    /**
     * POST /users/:userId/sessions/use - Use a session
     * @param userId - User's unique identifier
     */
    readonly use: (userId: string) => `/users/${string}/sessions/use`;
    /**
     * POST /users/:userId/sessions/adjust - Admin adjustment to session balance
     * @param userId - User's unique identifier
     */
    readonly adjust: (userId: string) => `/users/${string}/sessions/adjust`;
    /**
     * POST /users/:userId/sessions/check - Check session availability
     * @param userId - User's unique identifier
     */
    readonly check: (userId: string) => `/users/${string}/sessions/check`;
    /**
     * GET /users/:userId/sessions/history - Get session usage history
     * @param userId - User's unique identifier
     */
    readonly history: (userId: string) => `/users/${string}/sessions/history`;
    /**
     * PATCH /users/:userId/sessions/billing-anchor - Update billing anchor date
     * @param userId - User's unique identifier
     */
    readonly billingAnchor: (userId: string) => `/users/${string}/sessions/billing-anchor`;
    /**
     * GET /users/:userId/sessions - Get session data
     * @param userId - User's unique identifier
     */
    readonly get: (userId: string) => `/users/${string}/sessions`;
    /**
     * GET /users/:userId/sessions/billing-date - Get next billing date
     * @param userId - User's unique identifier
     */
    readonly billingDate: (userId: string) => `/users/${string}/sessions/billing-date`;
    /**
     * POST /users/:userId/sessions/tier-change - Handle tier change
     * @param userId - User's unique identifier
     */
    readonly tierChange: (userId: string) => `/users/${string}/sessions/tier-change`;
};
/** Type for sessions route values */
export type SessionsRoute = ReturnType<(typeof SESSIONS_ROUTES)[keyof typeof SESSIONS_ROUTES]>;
//# sourceMappingURL=users.d.ts.map