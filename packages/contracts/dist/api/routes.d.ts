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
import type { HttpMethod as _HttpMethod, RouteMetadata as _RouteMetadata } from "./routes/types.js";
/**
 * HTTP methods supported by the API.
 * @deprecated Import from './routes/types' instead
 */
export declare const HTTP_METHODS: readonly ["GET", "POST", "PUT", "PATCH", "DELETE"];
/** @deprecated Import from './routes/types' instead */
export type HttpMethod = _HttpMethod;
/**
 * Route metadata for documentation and validation purposes.
 * @deprecated Import from './routes/types' instead
 */
export type RouteMetadata = _RouteMetadata;
/**
 * Authentication API routes.
 * Base path: /auth
 *
 * @group AUTH
 */
export declare const AUTH_ROUTES: {
    /** POST - Email/password login */
    readonly LOGIN: "/auth/login";
    /** POST - Create new account with password */
    readonly SIGNUP: "/auth/signup";
    /** POST - Refresh access token using refresh token */
    readonly REFRESH: "/auth/refresh";
    /** POST - OAuth social sign-in (Apple or Google) with nonce + CSRF state verification */
    readonly OAUTH_SIGN_IN: "/auth/oauth";
    /**
     * POST - OAuth social registration (Apple or Google) during barcode onboarding.
     * Creates a new account by combining a social identity token with a barcode claim.
     */
    readonly OAUTH_REGISTER: "/auth/oauth-register";
    /** POST - Sign out current session */
    readonly LOGOUT: "/auth/logout";
    /** POST - Request password reset email */
    readonly FORGOT_PASSWORD: "/auth/forgot-password";
    /** POST - Reset password using token */
    readonly RESET_PASSWORD: "/auth/reset-password";
    /** POST - Send or resend email verification link for authenticated user */
    readonly VERIFY_EMAIL_SEND: "/auth/verify-email/send";
    /** GET - Confirm email verification token from email link */
    readonly VERIFY_EMAIL_CONFIRM: "/auth/verify-email/confirm";
    /** POST - Issue a refresh token to store for biometric login */
    readonly BIOMETRIC_TOKEN: "/auth/biometric-token";
    /** POST - Validate a registration barcode */
    readonly VALIDATE_BARCODE: "/auth/validate-barcode";
    /** POST - Change password for authenticated user (invalidates all sessions) */
    readonly CHANGE_PASSWORD: "/auth/change-password";
};
/** Type for auth route values */
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
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
 * Biometrics data API routes.
 * Base path: /users/:userId/biometrics
 *
 * @group BIOMETRICS
 */
export declare const BIOMETRICS_ROUTES: {
    /**
     * GET /users/:userId/biometrics - List biometric entries
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/biometrics`;
    /**
     * POST /users/:userId/biometrics - Create biometric entry
     * @param userId - User's unique identifier
     */
    readonly create: (userId: string) => `/users/${string}/biometrics`;
    /**
     * DELETE /users/:userId/biometrics/:entryId - Delete biometric entry
     * @param userId - User's unique identifier
     * @param entryId - Entry's unique identifier
     */
    readonly delete: (userId: string, entryId: string) => `/users/${string}/biometrics/${string}`;
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
 * Nutrition log API routes.
 * Base path: /users/:userId/nutrition
 *
 * @group NUTRITION
 */
export declare const NUTRITION_ROUTES: {
    /**
     * GET /users/:userId/nutrition/:date - Get nutrition log for date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly get: (userId: string, date: string) => `/users/${string}/nutrition/${string}`;
    /**
     * GET /users/:userId/nutrition - List nutrition logs for date range
     * Query params: startDate, endDate
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/nutrition`;
    /**
     * PUT /users/:userId/nutrition/:date - Upsert nutrition log for date
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly upsert: (userId: string, date: string) => `/users/${string}/nutrition/${string}`;
    /**
     * POST /users/:userId/nutrition/:date/entries - Add food entries to one hourly bucket
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     */
    readonly addFoodEntries: (userId: string, date: string) => `/users/${string}/nutrition/${string}/entries`;
    /**
     * DELETE /users/:userId/nutrition/:date/entries/:foodId - Delete one food entry from a daily log
     * @param userId - User's unique identifier
     * @param date - ISO date string (YYYY-MM-DD)
     * @param foodId - Food entry identifier
     */
    readonly deleteFoodEntry: (userId: string, date: string, foodId: string) => `/users/${string}/nutrition/${string}/entries/${string}`;
    /** Atomically edit and move one food entry to another date/hour. */
    readonly moveFoodEntry: (userId: string, sourceDate: string, foodId: string) => `/users/${string}/nutrition/${string}/entries/${string}/move`;
    /** List and create reusable named meal templates. */
    readonly templates: (userId: string) => `/users/${string}/nutrition/templates`;
    /** Update or delete one reusable named meal template. */
    readonly template: (userId: string, templateId: string) => `/users/${string}/nutrition/templates/${string}`;
    /** Search the server-backed food catalog. */
    readonly catalogSearch: (userId: string) => `/users/${string}/nutrition/catalog/search`;
    /** Resolve one product barcode through the server-backed food catalog. */
    readonly catalogBarcode: (userId: string, barcode: string) => `/users/${string}/nutrition/catalog/barcode/${string}`;
    /**
     * POST /users/:userId/nutrition/analyze - Analyze nutrition data
     * @param userId - User's unique identifier
     */
    readonly analyze: (userId: string) => `/users/${string}/nutrition/analyze`;
};
/**
 * Plans API routes (workout and nutrition plans).
 * Base path: /api/plans
 *
 * @group PLANS
 */
export declare const PLANS_ROUTES: {
    /**
     * GET /api/plans/workout - Get workout plan
     * Query params: userId, date (or userId, startDate, endDate for range)
     */
    readonly WORKOUT: "/api/plans/workout";
    /**
     * POST /api/plans/workout - Create/update workout plan
     */
    readonly WORKOUT_UPSERT: "/api/plans/workout";
    /**
     * PUT /api/plans/workout/:workoutId/toggle-complete - Toggle workout completion
     * @param workoutId - Workout's unique identifier
     */
    readonly toggleWorkoutComplete: (workoutId: string) => `/api/plans/workout/${string}/toggle-complete`;
    /**
     * GET /api/plans/nutrition - Get nutrition plan
     * Query params: userId, date
     */
    readonly NUTRITION: "/api/plans/nutrition";
    /**
     * POST /api/plans/nutrition - Create/update nutrition plan
     */
    readonly NUTRITION_UPSERT: "/api/plans/nutrition";
    /**
     * POST /api/plans/nutrition/simple - Create/update simple nutrition plan
     */
    readonly NUTRITION_SIMPLE: "/api/plans/nutrition/simple";
};
/**
 * Training strategies API routes.
 * Base path: /users/:userId/strategies
 *
 * @group STRATEGIES
 */
export declare const STRATEGIES_ROUTES: {
    /**
     * GET /users/:userId/strategies - List user's training strategies
     * Query params: status, includePhases
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/strategies`;
    /**
     * GET /users/:userId/strategies/active - Get active strategy (deprecated, use list with status filter)
     * @param userId - User's unique identifier
     */
    readonly active: (userId: string) => `/users/${string}/strategies/active`;
    /**
     * GET /users/:userId/strategies/:strategyId - Get strategy details
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly get: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
    /**
     * POST /users/:userId/strategies - Create new strategy
     * @param userId - User's unique identifier
     */
    readonly create: (userId: string) => `/users/${string}/strategies`;
    /**
     * PUT /users/:userId/strategies/:strategyId - Update strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly update: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
    /**
     * DELETE /users/:userId/strategies/:strategyId - Delete strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly delete: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
    /**
     * POST /users/:userId/strategies/:strategyId/sync - Sync progress from data source
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly sync: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/sync`;
    /**
     * PUT /users/:userId/strategies/:strategyId/progress - Update goal progress
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly updateProgress: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/progress`;
    /**
     * POST /users/:userId/strategies/:strategyId/goals - Add goal to strategy
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     */
    readonly addGoal: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/goals`;
    /**
     * PUT /users/:userId/strategies/:strategyId/goals/:goalId - Update goal
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     * @param goalId - Goal's unique identifier
     */
    readonly updateGoal: (userId: string, strategyId: string, goalId: string) => `/users/${string}/strategies/${string}/goals/${string}`;
    /**
     * DELETE /users/:userId/strategies/:strategyId/goals/:goalId - Remove goal
     * @param userId - User's unique identifier
     * @param strategyId - Strategy's unique identifier
     * @param goalId - Goal's unique identifier
     */
    readonly deleteGoal: (userId: string, strategyId: string, goalId: string) => `/users/${string}/strategies/${string}/goals/${string}`;
};
/**
 * Appointments API routes.
 * Base path: /users/:userId/appointments
 *
 * @group APPOINTMENTS
 */
export declare const APPOINTMENTS_ROUTES: {
    /**
     * GET /users/:userId/appointments/upcoming - Get upcoming appointments
     * @param userId - User's unique identifier
     */
    readonly upcoming: (userId: string) => `/users/${string}/appointments/upcoming`;
    /**
     * GET /users/:userId/appointments - List appointments for date range
     * Query params: startDate, endDate
     * @param userId - User's unique identifier
     */
    readonly list: (userId: string) => `/users/${string}/appointments`;
    /**
     * GET /users/:userId/appointments/:appointmentId - Get single appointment by ID
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    readonly get: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}`;
    /**
     * POST /users/:userId/appointments - Create appointment
     * @param userId - User's unique identifier
     */
    readonly create: (userId: string) => `/users/${string}/appointments`;
    /**
     * PUT /users/:userId/appointments/:appointmentId - Update appointment
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    readonly update: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}`;
    /**
     * PATCH /users/:userId/appointments/:appointmentId/cancel - Cancel appointment
     * @param userId - User's unique identifier
     * @param appointmentId - Appointment's unique identifier
     */
    readonly cancel: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}/cancel`;
};
/**
 * Labs API routes.
 * Base path: /api/labs
 *
 * @group LABS
 */
export declare const LABS_ROUTES: {
    /**
     * GET /api/labs - Get lab panels for user
     * Query params: userId, includePanels
     */
    readonly LIST: "/api/labs";
    /**
     * GET /api/labs?userId={userId}&includeReports=true - Get lab reports for user
     * @param userId - User's unique identifier
     */
    readonly getReports: (userId: string) => `/api/labs?userId=${string}&includeReports=true`;
    /**
     * GET /api/labs/reports/:reportId - Get specific lab report
     * @param reportId - Lab report's unique identifier
     */
    readonly getReport: (reportId: string) => `/api/labs/reports/${string}`;
    /**
     * GET /api/labs/panels/:panelId - Get specific lab panel
     * @param panelId - Lab panel's unique identifier
     */
    readonly getPanel: (panelId: string) => `/api/labs/panels/${string}`;
    /**
     * GET /api/labs/metric-definitions - List canonical lab metric definitions
     * Query params: search, category, page, limit
     * Used for biomarker picker dropdown
     */
    readonly METRIC_DEFINITIONS: "/api/labs/metric-definitions";
};
/**
 * Messages API routes.
 * Base path: /api/messages
 *
 * @group MESSAGES
 */
export declare const MESSAGES_ROUTES: {
    /**
     * GET /api/messages - Get messages
     * Query params: userId, role
     */
    readonly LIST: "/api/messages";
    /**
     * POST /api/messages - Send a message
     */
    readonly SEND: "/api/messages";
    /**
     * DELETE /api/messages/:messageId - Delete a message (sender-only)
     */
    readonly DELETE: "/api/messages";
    /**
     * PUT /api/messages/read - Mark messages as read
     */
    readonly MARK_READ: "/api/messages/read";
    /**
     * GET /api/messages/unread - Get unread message counts
     * Query params: userId
     */
    readonly UNREAD: "/api/messages/unread";
};
/**
 * Upload API routes.
 * Base path: /api/upload
 *
 * @group UPLOAD
 */
export declare const UPLOAD_ROUTES: {
    /**
     * POST /api/upload - Upload a file
     */
    readonly UPLOAD: "/api/upload";
};
/**
 * Admin/CRM API routes.
 * Base path: /admin
 * Requires admin or clinician role.
 *
 * @group ADMIN
 */
export declare const ADMIN_ROUTES: {
    /** GET /admin/analytics - Get CRM analytics data */
    readonly ANALYTICS: "/admin/analytics";
    /** GET /admin/cache-metrics - Get cache performance metrics */
    readonly CACHE_METRICS: "/admin/cache-metrics";
    /** POST /admin/lab-extraction - Extract lab data from document */
    readonly LAB_EXTRACTION: "/admin/lab-extraction";
};
/** Type for admin route values */
export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];
/**
 * CRM events API routes.
 * Base path: /api/crm
 *
 * @group CRM
 */
export declare const CRM_ROUTES: {
    /** POST /api/crm/events - Create user event for compliance tracking */
    readonly EVENTS: "/api/crm/events";
};
/** Type for CRM route values */
export type CrmRoute = (typeof CRM_ROUTES)[keyof typeof CRM_ROUTES];
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
/**
 * Providers API routes.
 * Base path: /api/providers
 *
 * @group PROVIDERS
 */
export declare const PROVIDERS_ROUTES: {
    /** GET /api/providers - List all providers */
    readonly LIST: "/api/providers";
    /**
     * GET /api/providers/:providerId - Get single provider
     * @param providerId - Provider's unique identifier
     * @note B-13: No known client caller — server route exists but is currently unused by mobile/web-admin
     */
    readonly get: (providerId: string) => `/api/providers/${string}`;
    /**
     * GET /api/providers/:providerId/availability - Get available booking slots
     * Query params: date, days
     * @param providerId - Provider's unique identifier
     */
    readonly availability: (providerId: string) => `/api/providers/${string}/availability`;
    /**
     * GET/PUT /api/providers/:providerId/schedule - Get or update provider schedule
     * @param providerId - Provider's unique identifier
     */
    readonly schedule: (providerId: string) => `/api/providers/${string}/schedule`;
};
/** Type for providers route values */
export type ProvidersRoute = (typeof PROVIDERS_ROUTES)["LIST"] | ReturnType<Exclude<(typeof PROVIDERS_ROUTES)[keyof typeof PROVIDERS_ROUTES], string>>;
/**
 * Documents API routes.
 * Base path: /api/documents
 *
 * @group DOCUMENTS
 */
export declare const DOCUMENTS_ROUTES: {
    /** GET /api/documents - List all documents for user */
    readonly LIST: "/api/documents";
    /** POST /api/documents - Create/upload document */
    readonly CREATE: "/api/documents";
    /**
     * GET /api/documents/:documentId - Get single document
     * @param documentId - Document's unique identifier
     */
    readonly get: (documentId: string) => `/api/documents/${string}`;
    /**
     * DELETE /api/documents/:documentId - Delete document
     * @param documentId - Document's unique identifier
     */
    readonly delete: (documentId: string) => `/api/documents/${string}`;
};
/** Type for documents route values */
export type DocumentsRoute = (typeof DOCUMENTS_ROUTES)["LIST"] | (typeof DOCUMENTS_ROUTES)["CREATE"] | ReturnType<Exclude<(typeof DOCUMENTS_ROUTES)[keyof typeof DOCUMENTS_ROUTES], string>>;
/**
 * Push notification API routes.
 * Base path: /api/push
 *
 * @group PUSH
 */
export declare const PUSH_ROUTES: {
    /** POST /api/push/register - Register push notification token */
    readonly REGISTER: "/api/push/register";
    /** DELETE /api/push/unregister - Unregister push notification token */
    readonly UNREGISTER: "/api/push/unregister";
    /** POST /api/push/test - Send test notification */
    readonly TEST: "/api/push/test";
};
/** Type for push route values */
export type PushRoute = (typeof PUSH_ROUTES)[keyof typeof PUSH_ROUTES];
/**
 * SSE API routes.
 * Base path: /api/events
 *
 * @group SSE
 */
export declare const SSE_ROUTES: {
    /** POST /api/events/token - Exchange JWT for short-lived SSE token */
    readonly TOKEN: "/api/events/token";
    /** GET /api/events/:userId - SSE stream for user-specific events */
    readonly CONNECT: "/api/events";
    /** GET /api/events/stats - SSE connection statistics (admin only) */
    readonly STATS: "/api/events/stats";
};
/** Type for SSE route values */
export type SseRoute = (typeof SSE_ROUTES)[keyof typeof SSE_ROUTES];
/**
 * Admin payments API routes.
 * Base path: /api/admin/payments
 * Requires admin role.
 *
 * @group ADMIN_PAYMENTS
 */
export declare const ADMIN_PAYMENTS_ROUTES: {
    /** GET /api/admin/payments/config - Get Stripe publishable key config */
    readonly CONFIG: "/api/admin/payments/config";
    /** POST /api/admin/payments/setup-intent - Create SetupIntent for card save */
    readonly SETUP_INTENT: "/api/admin/payments/setup-intent";
    /** POST /api/admin/payments/collect - Create PaymentIntent for one-time charge */
    readonly COLLECT: "/api/admin/payments/collect";
    /**
     * POST /api/admin/payments/payment-methods/:userId - Attach payment method to user
     * @param userId - User's unique identifier
     */
    readonly attachPaymentMethod: (userId: string) => `/api/admin/payments/payment-methods/${string}`;
};
/** Type for admin payments route values */
export type AdminPaymentsRoute = (typeof ADMIN_PAYMENTS_ROUTES)["CONFIG"] | (typeof ADMIN_PAYMENTS_ROUTES)["SETUP_INTENT"] | (typeof ADMIN_PAYMENTS_ROUTES)["COLLECT"] | ReturnType<typeof ADMIN_PAYMENTS_ROUTES.attachPaymentMethod>;
/**
 * Customer account API routes (read-only billing display).
 * Base path: /api/account
 * Requires authentication but NOT admin role.
 *
 * @group ACCOUNT
 */
export declare const ACCOUNT_ROUTES: {
    /** GET /api/account/subscription - Get current user's active subscription */
    readonly SUBSCRIPTION: "/api/account/subscription";
    /** PATCH /api/account/subscription/pause - Pause current user's subscription */
    readonly PAUSE_SUBSCRIPTION: "/api/account/subscription/pause";
    /** PATCH /api/account/subscription/resume - Resume current user's subscription */
    readonly RESUME_SUBSCRIPTION: "/api/account/subscription/resume";
    /** PATCH /api/account/subscription/change-tier - Change current user's subscription tier */
    readonly CHANGE_TIER: "/api/account/subscription/change-tier";
    /** GET /api/account/orders - Get current user's order history */
    readonly ORDERS: "/api/account/orders";
    /** GET /api/account/payment-methods - Get current user's saved payment methods */
    readonly PAYMENT_METHODS: "/api/account/payment-methods";
    /** POST /api/account/deletion-request - Submit a self-service account deletion request (GDPR/CCPA) */
    readonly DELETION_REQUEST: "/api/account/deletion-request";
};
/** Type for account route values */
export type AccountRoute = (typeof ACCOUNT_ROUTES)[keyof typeof ACCOUNT_ROUTES];
/**
 * Public billing API routes used by email-linked pages.
 * These routes do NOT require a session cookie — the signed billing token
 * embedded in the URL is the sole credential.  Base path: /public/billing
 *
 * @group PUBLIC_BILLING
 */
export declare const PUBLIC_BILLING_ROUTES: {
    /**
     * GET /public/billing/verify-token?token=<signed-token>
     * Verifies an HMAC-signed billing action token and returns { userId }.
     * Returns 400 for malformed tokens and 401 for expired/invalid tokens.
     */
    readonly VERIFY_TOKEN: "/public/billing/verify-token";
};
/** Type for public billing route values */
export type PublicBillingRoute = (typeof PUBLIC_BILLING_ROUTES)[keyof typeof PUBLIC_BILLING_ROUTES];
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
export declare const PHI_ROUTES: {
    /** GET /phi/labs - Lab panel timeline (query: userId) */
    readonly LAB_TIMELINE: "/phi/labs";
    /**
     * GET /phi/labs/:panelId - Specific lab panel (query: userId)
     * @param panelId - Lab panel's unique identifier
     */
    readonly labPanel: (panelId: string) => `/phi/labs/${string}`;
    /**
     * GET /phi/labs/results/:resultId - Specific lab result (query: userId)
     * @param resultId - Lab result's unique identifier
     */
    readonly labResult: (resultId: string) => `/phi/labs/results/${string}`;
    /** GET /phi/trends - All clinical metric trends (query: userId) */
    readonly ALL_TRENDS: "/phi/trends";
    /**
     * GET /phi/trends/:metricCode - Specific clinical metric trend (query: userId)
     * @param metricCode - Clinical metric code (e.g. "HBA1C", "GLUCOSE")
     */
    readonly metricTrend: (metricCode: string) => `/phi/trends/${string}`;
    /** GET /phi/providers - Care team list (query: userId) */
    readonly PROVIDERS: "/phi/providers";
    /**
     * GET /phi/providers/:memberId - Specific care team member (query: userId)
     * @param memberId - Care team member's unique identifier
     */
    readonly provider: (memberId: string) => `/phi/providers/${string}`;
};
/** Type for PHI route values */
export type PhiRoute = (typeof PHI_ROUTES)["LAB_TIMELINE"] | (typeof PHI_ROUTES)["ALL_TRENDS"] | (typeof PHI_ROUTES)["PROVIDERS"] | ReturnType<typeof PHI_ROUTES.labPanel> | ReturnType<typeof PHI_ROUTES.labResult> | ReturnType<typeof PHI_ROUTES.metricTrend> | ReturnType<typeof PHI_ROUTES.provider>;
/**
 * Patient-scoped consent API routes.
 * Base path: /api/consent
 *
 * These routes are patient-self-scoped: userId is derived from the authenticated
 * session (req.user.userId), so a patient cannot access another patient's records.
 *
 * @group CONSENT
 */
export declare const CONSENT_ROUTES: {
    /**
     * GET /api/consent/me/pdf — Download own signed consent PDF (presigned S3 URL).
     * Returns 404 if no PDF is on file. Cache-Control: no-store.
     */
    readonly MY_PDF: "/api/consent/me/pdf";
    /**
     * GET /api/consent/me — List own consent record metadata (no signature blobs).
     * Returns an array ordered by most recent first.
     */
    readonly MY_LIST: "/api/consent/me";
};
/** Type for patient consent route values */
export type ConsentRoute = (typeof CONSENT_ROUTES)[keyof typeof CONSENT_ROUTES];
/**
 * Complete API routes registry.
 * Use this for centralized access to all route definitions.
 *
 * @example
 * ```ts
 * import { API_ROUTES } from '@hollis-studio/contracts/api';
 *
 * // Static route
 * await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
 *
 * // Dynamic route
 * await apiClient.get(API_ROUTES.USERS.get(userId));
 * ```
 */
export declare const API_ROUTES: {
    readonly AUTH: {
        /** POST - Email/password login */
        readonly LOGIN: "/auth/login";
        /** POST - Create new account with password */
        readonly SIGNUP: "/auth/signup";
        /** POST - Refresh access token using refresh token */
        readonly REFRESH: "/auth/refresh";
        /** POST - OAuth social sign-in (Apple or Google) with nonce + CSRF state verification */
        readonly OAUTH_SIGN_IN: "/auth/oauth";
        /**
         * POST - OAuth social registration (Apple or Google) during barcode onboarding.
         * Creates a new account by combining a social identity token with a barcode claim.
         */
        readonly OAUTH_REGISTER: "/auth/oauth-register";
        /** POST - Sign out current session */
        readonly LOGOUT: "/auth/logout";
        /** POST - Request password reset email */
        readonly FORGOT_PASSWORD: "/auth/forgot-password";
        /** POST - Reset password using token */
        readonly RESET_PASSWORD: "/auth/reset-password";
        /** POST - Send or resend email verification link for authenticated user */
        readonly VERIFY_EMAIL_SEND: "/auth/verify-email/send";
        /** GET - Confirm email verification token from email link */
        readonly VERIFY_EMAIL_CONFIRM: "/auth/verify-email/confirm";
        /** POST - Issue a refresh token to store for biometric login */
        readonly BIOMETRIC_TOKEN: "/auth/biometric-token";
        /** POST - Validate a registration barcode */
        readonly VALIDATE_BARCODE: "/auth/validate-barcode";
        /** POST - Change password for authenticated user (invalidates all sessions) */
        readonly CHANGE_PASSWORD: "/auth/change-password";
    };
    readonly USERS: {
        readonly ME: "/users/me";
        readonly get: (userId: string) => `/users/${string}`;
        readonly updateProfile: (userId: string) => `/users/${string}/profile`;
        readonly updatePreferences: (userId: string) => `/users/${string}/preferences`;
        readonly updateGoals: (userId: string) => `/users/${string}/goals`;
        readonly healthProgress: (userId: string) => `/users/${string}/health-progress`;
        readonly healthProgressHistory: (userId: string) => `/users/${string}/health-progress/history`;
        readonly healthGoals: (userId: string) => `/users/${string}/health-goals`;
        readonly compliance: (userId: string) => `/users/${string}/compliance`;
        readonly dataExport: (userId: string) => `/users/${string}/data-export`;
        readonly intake: (userId: string) => `/users/${string}/intake`;
        readonly getIntake: (userId: string) => `/users/${string}/intake`;
    };
    readonly DAILY_METRICS: {
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
    readonly DAILY_SUMMARY: {
        /**
         * GET /users/:userId/daily-summary/:date - Get summary for specific date
         * @param userId - User's unique identifier
         * @param date - ISO date string (YYYY-MM-DD)
         */
        readonly get: (userId: string, date: string) => `/users/${string}/daily-summary/${string}`;
    };
    readonly BIOMETRICS: {
        /**
         * GET /users/:userId/biometrics - List biometric entries
         * @param userId - User's unique identifier
         */
        readonly list: (userId: string) => `/users/${string}/biometrics`;
        /**
         * POST /users/:userId/biometrics - Create biometric entry
         * @param userId - User's unique identifier
         */
        readonly create: (userId: string) => `/users/${string}/biometrics`;
        /**
         * DELETE /users/:userId/biometrics/:entryId - Delete biometric entry
         * @param userId - User's unique identifier
         * @param entryId - Entry's unique identifier
         */
        readonly delete: (userId: string, entryId: string) => `/users/${string}/biometrics/${string}`;
    };
    readonly JOURNAL: {
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
    readonly NUTRITION: {
        /**
         * GET /users/:userId/nutrition/:date - Get nutrition log for date
         * @param userId - User's unique identifier
         * @param date - ISO date string (YYYY-MM-DD)
         */
        readonly get: (userId: string, date: string) => `/users/${string}/nutrition/${string}`;
        /**
         * GET /users/:userId/nutrition - List nutrition logs for date range
         * Query params: startDate, endDate
         * @param userId - User's unique identifier
         */
        readonly list: (userId: string) => `/users/${string}/nutrition`;
        /**
         * PUT /users/:userId/nutrition/:date - Upsert nutrition log for date
         * @param userId - User's unique identifier
         * @param date - ISO date string (YYYY-MM-DD)
         */
        readonly upsert: (userId: string, date: string) => `/users/${string}/nutrition/${string}`;
        /**
         * POST /users/:userId/nutrition/:date/entries - Add food entries to one hourly bucket
         * @param userId - User's unique identifier
         * @param date - ISO date string (YYYY-MM-DD)
         */
        readonly addFoodEntries: (userId: string, date: string) => `/users/${string}/nutrition/${string}/entries`;
        /**
         * DELETE /users/:userId/nutrition/:date/entries/:foodId - Delete one food entry from a daily log
         * @param userId - User's unique identifier
         * @param date - ISO date string (YYYY-MM-DD)
         * @param foodId - Food entry identifier
         */
        readonly deleteFoodEntry: (userId: string, date: string, foodId: string) => `/users/${string}/nutrition/${string}/entries/${string}`;
        /** Atomically edit and move one food entry to another date/hour. */
        readonly moveFoodEntry: (userId: string, sourceDate: string, foodId: string) => `/users/${string}/nutrition/${string}/entries/${string}/move`;
        /** List and create reusable named meal templates. */
        readonly templates: (userId: string) => `/users/${string}/nutrition/templates`;
        /** Update or delete one reusable named meal template. */
        readonly template: (userId: string, templateId: string) => `/users/${string}/nutrition/templates/${string}`;
        /** Search the server-backed food catalog. */
        readonly catalogSearch: (userId: string) => `/users/${string}/nutrition/catalog/search`;
        /** Resolve one product barcode through the server-backed food catalog. */
        readonly catalogBarcode: (userId: string, barcode: string) => `/users/${string}/nutrition/catalog/barcode/${string}`;
        /**
         * POST /users/:userId/nutrition/analyze - Analyze nutrition data
         * @param userId - User's unique identifier
         */
        readonly analyze: (userId: string) => `/users/${string}/nutrition/analyze`;
    };
    readonly PLANS: {
        /**
         * GET /api/plans/workout - Get workout plan
         * Query params: userId, date (or userId, startDate, endDate for range)
         */
        readonly WORKOUT: "/api/plans/workout";
        /**
         * POST /api/plans/workout - Create/update workout plan
         */
        readonly WORKOUT_UPSERT: "/api/plans/workout";
        /**
         * PUT /api/plans/workout/:workoutId/toggle-complete - Toggle workout completion
         * @param workoutId - Workout's unique identifier
         */
        readonly toggleWorkoutComplete: (workoutId: string) => `/api/plans/workout/${string}/toggle-complete`;
        /**
         * GET /api/plans/nutrition - Get nutrition plan
         * Query params: userId, date
         */
        readonly NUTRITION: "/api/plans/nutrition";
        /**
         * POST /api/plans/nutrition - Create/update nutrition plan
         */
        readonly NUTRITION_UPSERT: "/api/plans/nutrition";
        /**
         * POST /api/plans/nutrition/simple - Create/update simple nutrition plan
         */
        readonly NUTRITION_SIMPLE: "/api/plans/nutrition/simple";
    };
    readonly STRATEGIES: {
        /**
         * GET /users/:userId/strategies - List user's training strategies
         * Query params: status, includePhases
         * @param userId - User's unique identifier
         */
        readonly list: (userId: string) => `/users/${string}/strategies`;
        /**
         * GET /users/:userId/strategies/active - Get active strategy (deprecated, use list with status filter)
         * @param userId - User's unique identifier
         */
        readonly active: (userId: string) => `/users/${string}/strategies/active`;
        /**
         * GET /users/:userId/strategies/:strategyId - Get strategy details
         * @param userId - User's unique identifier
         * @param strategyId - Strategy's unique identifier
         */
        readonly get: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
        /**
         * POST /users/:userId/strategies - Create new strategy
         * @param userId - User's unique identifier
         */
        readonly create: (userId: string) => `/users/${string}/strategies`;
        /**
         * PUT /users/:userId/strategies/:strategyId - Update strategy
         * @param userId - User's unique identifier
         * @param strategyId - Strategy's unique identifier
         */
        readonly update: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
        /**
         * DELETE /users/:userId/strategies/:strategyId - Delete strategy
         * @param userId - User's unique identifier
         * @param strategyId - Strategy's unique identifier
         */
        readonly delete: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
        /**
         * POST /users/:userId/strategies/:strategyId/sync - Sync progress from data source
         * @param userId - User's unique identifier
         * @param strategyId - Strategy's unique identifier
         */
        readonly sync: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/sync`;
        /**
         * PUT /users/:userId/strategies/:strategyId/progress - Update goal progress
         * @param userId - User's unique identifier
         * @param strategyId - Strategy's unique identifier
         */
        readonly updateProgress: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/progress`;
        /**
         * POST /users/:userId/strategies/:strategyId/goals - Add goal to strategy
         * @param userId - User's unique identifier
         * @param strategyId - Strategy's unique identifier
         */
        readonly addGoal: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/goals`;
        /**
         * PUT /users/:userId/strategies/:strategyId/goals/:goalId - Update goal
         * @param userId - User's unique identifier
         * @param strategyId - Strategy's unique identifier
         * @param goalId - Goal's unique identifier
         */
        readonly updateGoal: (userId: string, strategyId: string, goalId: string) => `/users/${string}/strategies/${string}/goals/${string}`;
        /**
         * DELETE /users/:userId/strategies/:strategyId/goals/:goalId - Remove goal
         * @param userId - User's unique identifier
         * @param strategyId - Strategy's unique identifier
         * @param goalId - Goal's unique identifier
         */
        readonly deleteGoal: (userId: string, strategyId: string, goalId: string) => `/users/${string}/strategies/${string}/goals/${string}`;
    };
    readonly APPOINTMENTS: {
        /**
         * GET /users/:userId/appointments/upcoming - Get upcoming appointments
         * @param userId - User's unique identifier
         */
        readonly upcoming: (userId: string) => `/users/${string}/appointments/upcoming`;
        /**
         * GET /users/:userId/appointments - List appointments for date range
         * Query params: startDate, endDate
         * @param userId - User's unique identifier
         */
        readonly list: (userId: string) => `/users/${string}/appointments`;
        /**
         * GET /users/:userId/appointments/:appointmentId - Get single appointment by ID
         * @param userId - User's unique identifier
         * @param appointmentId - Appointment's unique identifier
         */
        readonly get: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}`;
        /**
         * POST /users/:userId/appointments - Create appointment
         * @param userId - User's unique identifier
         */
        readonly create: (userId: string) => `/users/${string}/appointments`;
        /**
         * PUT /users/:userId/appointments/:appointmentId - Update appointment
         * @param userId - User's unique identifier
         * @param appointmentId - Appointment's unique identifier
         */
        readonly update: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}`;
        /**
         * PATCH /users/:userId/appointments/:appointmentId/cancel - Cancel appointment
         * @param userId - User's unique identifier
         * @param appointmentId - Appointment's unique identifier
         */
        readonly cancel: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}/cancel`;
    };
    readonly LABS: {
        /**
         * GET /api/labs - Get lab panels for user
         * Query params: userId, includePanels
         */
        readonly LIST: "/api/labs";
        /**
         * GET /api/labs?userId={userId}&includeReports=true - Get lab reports for user
         * @param userId - User's unique identifier
         */
        readonly getReports: (userId: string) => `/api/labs?userId=${string}&includeReports=true`;
        /**
         * GET /api/labs/reports/:reportId - Get specific lab report
         * @param reportId - Lab report's unique identifier
         */
        readonly getReport: (reportId: string) => `/api/labs/reports/${string}`;
        /**
         * GET /api/labs/panels/:panelId - Get specific lab panel
         * @param panelId - Lab panel's unique identifier
         */
        readonly getPanel: (panelId: string) => `/api/labs/panels/${string}`;
        /**
         * GET /api/labs/metric-definitions - List canonical lab metric definitions
         * Query params: search, category, page, limit
         * Used for biomarker picker dropdown
         */
        readonly METRIC_DEFINITIONS: "/api/labs/metric-definitions";
    };
    readonly MESSAGES: {
        /**
         * GET /api/messages - Get messages
         * Query params: userId, role
         */
        readonly LIST: "/api/messages";
        /**
         * POST /api/messages - Send a message
         */
        readonly SEND: "/api/messages";
        /**
         * DELETE /api/messages/:messageId - Delete a message (sender-only)
         */
        readonly DELETE: "/api/messages";
        /**
         * PUT /api/messages/read - Mark messages as read
         */
        readonly MARK_READ: "/api/messages/read";
        /**
         * GET /api/messages/unread - Get unread message counts
         * Query params: userId
         */
        readonly UNREAD: "/api/messages/unread";
    };
    readonly UPLOAD: {
        /**
         * POST /api/upload - Upload a file
         */
        readonly UPLOAD: "/api/upload";
    };
    readonly ADMIN: {
        /** GET /admin/analytics - Get CRM analytics data */
        readonly ANALYTICS: "/admin/analytics";
        /** GET /admin/cache-metrics - Get cache performance metrics */
        readonly CACHE_METRICS: "/admin/cache-metrics";
        /** POST /admin/lab-extraction - Extract lab data from document */
        readonly LAB_EXTRACTION: "/admin/lab-extraction";
    };
    readonly ADMIN_PAYMENTS: {
        /** GET /api/admin/payments/config - Get Stripe publishable key config */
        readonly CONFIG: "/api/admin/payments/config";
        /** POST /api/admin/payments/setup-intent - Create SetupIntent for card save */
        readonly SETUP_INTENT: "/api/admin/payments/setup-intent";
        /** POST /api/admin/payments/collect - Create PaymentIntent for one-time charge */
        readonly COLLECT: "/api/admin/payments/collect";
        /**
         * POST /api/admin/payments/payment-methods/:userId - Attach payment method to user
         * @param userId - User's unique identifier
         */
        readonly attachPaymentMethod: (userId: string) => `/api/admin/payments/payment-methods/${string}`;
    };
    readonly CRM: {
        /** POST /api/crm/events - Create user event for compliance tracking */
        readonly EVENTS: "/api/crm/events";
    };
    readonly SESSIONS: {
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
    readonly PROVIDERS: {
        /** GET /api/providers - List all providers */
        readonly LIST: "/api/providers";
        /**
         * GET /api/providers/:providerId - Get single provider
         * @param providerId - Provider's unique identifier
         * @note B-13: No known client caller — server route exists but is currently unused by mobile/web-admin
         */
        readonly get: (providerId: string) => `/api/providers/${string}`;
        /**
         * GET /api/providers/:providerId/availability - Get available booking slots
         * Query params: date, days
         * @param providerId - Provider's unique identifier
         */
        readonly availability: (providerId: string) => `/api/providers/${string}/availability`;
        /**
         * GET/PUT /api/providers/:providerId/schedule - Get or update provider schedule
         * @param providerId - Provider's unique identifier
         */
        readonly schedule: (providerId: string) => `/api/providers/${string}/schedule`;
    };
    readonly DOCUMENTS: {
        /** GET /api/documents - List all documents for user */
        readonly LIST: "/api/documents";
        /** POST /api/documents - Create/upload document */
        readonly CREATE: "/api/documents";
        /**
         * GET /api/documents/:documentId - Get single document
         * @param documentId - Document's unique identifier
         */
        readonly get: (documentId: string) => `/api/documents/${string}`;
        /**
         * DELETE /api/documents/:documentId - Delete document
         * @param documentId - Document's unique identifier
         */
        readonly delete: (documentId: string) => `/api/documents/${string}`;
    };
    readonly PUSH: {
        /** POST /api/push/register - Register push notification token */
        readonly REGISTER: "/api/push/register";
        /** DELETE /api/push/unregister - Unregister push notification token */
        readonly UNREGISTER: "/api/push/unregister";
        /** POST /api/push/test - Send test notification */
        readonly TEST: "/api/push/test";
    };
    readonly SSE: {
        /** POST /api/events/token - Exchange JWT for short-lived SSE token */
        readonly TOKEN: "/api/events/token";
        /** GET /api/events/:userId - SSE stream for user-specific events */
        readonly CONNECT: "/api/events";
        /** GET /api/events/stats - SSE connection statistics (admin only) */
        readonly STATS: "/api/events/stats";
    };
    readonly ACCOUNT: {
        /** GET /api/account/subscription - Get current user's active subscription */
        readonly SUBSCRIPTION: "/api/account/subscription";
        /** PATCH /api/account/subscription/pause - Pause current user's subscription */
        readonly PAUSE_SUBSCRIPTION: "/api/account/subscription/pause";
        /** PATCH /api/account/subscription/resume - Resume current user's subscription */
        readonly RESUME_SUBSCRIPTION: "/api/account/subscription/resume";
        /** PATCH /api/account/subscription/change-tier - Change current user's subscription tier */
        readonly CHANGE_TIER: "/api/account/subscription/change-tier";
        /** GET /api/account/orders - Get current user's order history */
        readonly ORDERS: "/api/account/orders";
        /** GET /api/account/payment-methods - Get current user's saved payment methods */
        readonly PAYMENT_METHODS: "/api/account/payment-methods";
        /** POST /api/account/deletion-request - Submit a self-service account deletion request (GDPR/CCPA) */
        readonly DELETION_REQUEST: "/api/account/deletion-request";
    };
    readonly PHI: {
        /** GET /phi/labs - Lab panel timeline (query: userId) */
        readonly LAB_TIMELINE: "/phi/labs";
        /**
         * GET /phi/labs/:panelId - Specific lab panel (query: userId)
         * @param panelId - Lab panel's unique identifier
         */
        readonly labPanel: (panelId: string) => `/phi/labs/${string}`;
        /**
         * GET /phi/labs/results/:resultId - Specific lab result (query: userId)
         * @param resultId - Lab result's unique identifier
         */
        readonly labResult: (resultId: string) => `/phi/labs/results/${string}`;
        /** GET /phi/trends - All clinical metric trends (query: userId) */
        readonly ALL_TRENDS: "/phi/trends";
        /**
         * GET /phi/trends/:metricCode - Specific clinical metric trend (query: userId)
         * @param metricCode - Clinical metric code (e.g. "HBA1C", "GLUCOSE")
         */
        readonly metricTrend: (metricCode: string) => `/phi/trends/${string}`;
        /** GET /phi/providers - Care team list (query: userId) */
        readonly PROVIDERS: "/phi/providers";
        /**
         * GET /phi/providers/:memberId - Specific care team member (query: userId)
         * @param memberId - Care team member's unique identifier
         */
        readonly provider: (memberId: string) => `/phi/providers/${string}`;
    };
    readonly PUBLIC_BILLING: {
        /**
         * GET /public/billing/verify-token?token=<signed-token>
         * Verifies an HMAC-signed billing action token and returns { userId }.
         * Returns 400 for malformed tokens and 401 for expired/invalid tokens.
         */
        readonly VERIFY_TOKEN: "/public/billing/verify-token";
    };
    readonly CONSENT: {
        /**
         * GET /api/consent/me/pdf — Download own signed consent PDF (presigned S3 URL).
         * Returns 404 if no PDF is on file. Cache-Control: no-store.
         */
        readonly MY_PDF: "/api/consent/me/pdf";
        /**
         * GET /api/consent/me — List own consent record metadata (no signature blobs).
         * Returns an array ordered by most recent first.
         */
        readonly MY_LIST: "/api/consent/me";
    };
};
/**
 * Route metadata registry for documentation and validation.
 * Maps route paths to their metadata.
 *
 * Note: This is primarily for documentation purposes and can be used
 * by the server to validate route definitions match expected patterns.
 */
export declare const ROUTE_METADATA: Record<string, RouteMetadata>;
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
//# sourceMappingURL=routes.d.ts.map