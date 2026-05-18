/**
 * @ai-context API Routes Barrel | re-exports all route definitions
 *
 * This barrel file provides backward compatibility by re-exporting all
 * domain-specific route files. Import from here or from the specific
 * domain file as needed.
 *
 * deps: ./routes/* | consumers: src/services/*, web-admin/services/*, server/src/*
 */
import type { RouteMetadata } from "./types.js";
export * from "./types.js";
export * from "./admin.js";
export * from "./ai.js";
export * from "./appointments.js";
export * from "./auth.js";
export * from "./biometrics.js";
export * from "./health-metrics.js";
export * from "./labs.js";
export * from "./messaging.js";
export * from "./mfa.js";
export * from "./nutrition.js";
export * from "./users.js";
export * from "./workouts.js";
export * from "./utils.js";
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
        readonly LOGIN: "/auth/login";
        readonly SIGNUP: "/auth/signup";
        readonly VALIDATE_BARCODE: "/auth/validate-barcode";
        readonly REFRESH: "/auth/refresh";
        readonly OAUTH_SIGN_IN: "/auth/oauth";
        readonly OAUTH_REGISTER: "/auth/oauth-register";
        readonly LOGOUT: "/auth/logout";
        readonly FORGOT_PASSWORD: "/auth/forgot-password";
        readonly RESET_PASSWORD: "/auth/reset-password";
        readonly CHANGE_PASSWORD: "/auth/change-password";
        readonly MFA_SESSION_REVERIFY: "/auth/mfa/session-reverify";
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
    };
    readonly DAILY_METRICS: {
        readonly get: (userId: string, date: string) => `/users/${string}/daily-metrics/${string}`;
        readonly list: (userId: string) => `/users/${string}/daily-metrics`;
        readonly update: (userId: string, date: string) => `/users/${string}/daily-metrics/${string}`;
    };
    readonly DAILY_SUMMARY: {
        readonly get: (userId: string, date: string) => `/users/${string}/daily-summary/${string}`;
    };
    readonly BIOMETRICS: {
        readonly list: (userId: string) => `/users/${string}/biometrics`;
        readonly create: (userId: string) => `/users/${string}/biometrics`;
        readonly delete: (userId: string, entryId: string) => `/users/${string}/biometrics/${string}`;
    };
    readonly HEALTH_METRICS: {
        readonly METRIC_DEFINITIONS: "/api/metric-definitions";
    };
    readonly JOURNAL: {
        readonly list: (userId: string) => `/users/${string}/journal`;
        readonly create: (userId: string) => `/users/${string}/journal`;
        readonly update: (userId: string, entryId: string) => `/users/${string}/journal/${string}`;
        readonly delete: (userId: string, entryId: string) => `/users/${string}/journal/${string}`;
    };
    readonly NUTRITION: {
        readonly get: (userId: string, date: string) => `/users/${string}/nutrition/${string}`;
        readonly list: (userId: string) => `/users/${string}/nutrition`;
        readonly upsert: (userId: string, date: string) => `/users/${string}/nutrition/${string}`;
        readonly addFoodEntries: (userId: string, date: string) => `/users/${string}/nutrition/${string}/entries`;
        readonly deleteFoodEntry: (userId: string, date: string, foodId: string) => `/users/${string}/nutrition/${string}/entries/${string}`;
        readonly analyze: (userId: string) => `/users/${string}/nutrition/analyze`;
    };
    readonly PLANS: {
        readonly WORKOUT: "/api/plans/workout";
        readonly WORKOUT_UPSERT: "/api/plans/workout";
        readonly toggleWorkoutComplete: (workoutId: string) => `/api/plans/workout/${string}/toggle-complete`;
        readonly NUTRITION: "/api/plans/nutrition";
        readonly NUTRITION_UPSERT: "/api/plans/nutrition";
        readonly NUTRITION_SIMPLE: "/api/plans/nutrition/simple";
    };
    readonly STRATEGIES: {
        readonly list: (userId: string) => `/users/${string}/strategies`;
        readonly active: (userId: string) => `/users/${string}/strategies/active`;
        readonly get: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
        readonly create: (userId: string) => `/users/${string}/strategies`;
        readonly update: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
        readonly delete: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}`;
        readonly sync: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/sync`;
        readonly updateProgress: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/progress`;
        readonly addGoal: (userId: string, strategyId: string) => `/users/${string}/strategies/${string}/goals`;
        readonly updateGoal: (userId: string, strategyId: string, goalId: string) => `/users/${string}/strategies/${string}/goals/${string}`;
        readonly deleteGoal: (userId: string, strategyId: string, goalId: string) => `/users/${string}/strategies/${string}/goals/${string}`;
    };
    readonly APPOINTMENTS: {
        readonly upcoming: (userId: string) => `/users/${string}/appointments/upcoming`;
        readonly list: (userId: string) => `/users/${string}/appointments`;
        readonly get: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}`;
        readonly create: (userId: string) => `/users/${string}/appointments`;
        readonly update: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}`;
        readonly cancel: (userId: string, appointmentId: string) => `/users/${string}/appointments/${string}/cancel`;
    };
    readonly LABS: {
        readonly LIST: "/api/labs";
        readonly getReports: (userId: string) => `/api/labs?userId=${string}&includeReports=true`;
        readonly getReport: (reportId: string) => `/api/labs/reports/${string}`;
        readonly getPanel: (panelId: string) => `/api/labs/panels/${string}`;
        readonly METRIC_DEFINITIONS: "/api/labs/metric-definitions";
    };
    readonly MESSAGES: {
        readonly LIST: "/api/messages";
        readonly SEND: "/api/messages";
        readonly DELETE: "/api/messages";
        readonly MARK_READ: "/api/messages/read";
        readonly UNREAD: "/api/messages/unread";
    };
    readonly UPLOAD: {
        readonly UPLOAD: "/api/upload";
    };
    readonly ADMIN: {
        readonly ANALYTICS: "/admin/analytics";
        readonly CACHE_METRICS: "/admin/cache-metrics";
        readonly LAB_EXTRACTION: "/admin/lab-extraction";
    };
    readonly CRM: {
        readonly EVENTS: "/api/crm/events";
    };
    readonly SESSIONS: {
        readonly balances: (userId: string) => `/users/${string}/sessions/balances`;
        readonly use: (userId: string) => `/users/${string}/sessions/use`;
        readonly adjust: (userId: string) => `/users/${string}/sessions/adjust`;
        readonly check: (userId: string) => `/users/${string}/sessions/check`;
        readonly history: (userId: string) => `/users/${string}/sessions/history`;
        readonly billingAnchor: (userId: string) => `/users/${string}/sessions/billing-anchor`;
        readonly get: (userId: string) => `/users/${string}/sessions`;
        readonly billingDate: (userId: string) => `/users/${string}/sessions/billing-date`;
        readonly tierChange: (userId: string) => `/users/${string}/sessions/tier-change`;
    };
    readonly PROVIDERS: {
        readonly LIST: "/api/providers";
        readonly get: (providerId: string) => `/api/providers/${string}`;
        readonly availability: (providerId: string) => `/api/providers/${string}/availability`;
        readonly schedule: (providerId: string) => `/api/providers/${string}/schedule`;
    };
    readonly DOCUMENTS: {
        readonly LIST: "/api/documents";
        readonly CREATE: "/api/documents";
        readonly get: (documentId: string) => `/api/documents/${string}`;
        readonly delete: (documentId: string) => `/api/documents/${string}`;
    };
    readonly PUSH: {
        readonly REGISTER: "/api/push/register";
        readonly UNREGISTER: "/api/push/unregister";
        readonly TEST: "/api/push/test";
    };
    readonly SSE: {
        readonly TOKEN: "/api/events/token";
        readonly CONNECT: "/api/events";
        readonly STATS: "/api/events/stats";
    };
    readonly MFA: {
        readonly STATUS: "/auth/mfa/status";
        readonly CREDENTIALS: "/auth/mfa/credentials";
        readonly CREDENTIAL: "/auth/mfa/credentials/:credentialId";
        readonly TOTP_SETUP: "/auth/mfa/totp/setup";
        readonly TOTP_VERIFY: "/auth/mfa/totp/verify";
        readonly LOGIN_VERIFY: "/auth/mfa/login/verify";
        readonly STEP_UP: "/auth/mfa/step-up";
        readonly BACKUP_CODES: "/auth/mfa/backup-codes";
        readonly WEBAUTHN_REGISTER_START: "/auth/mfa/webauthn/register/start";
        readonly WEBAUTHN_REGISTER_FINISH: "/auth/mfa/webauthn/register/finish";
        readonly WEBAUTHN_AUTH_START: "/auth/mfa/webauthn/auth/start";
        readonly WEBAUTHN_AUTH_FINISH: "/auth/mfa/webauthn/auth/finish";
    };
    readonly ASSIGNMENTS: {
        readonly LIST: "/admin/assignments";
        readonly CREATE: "/admin/assignments";
        readonly GET: "/admin/assignments/:id";
        readonly REVOKE: "/admin/assignments/:id";
        readonly BY_CLINICIAN: "/admin/assignments/clinician/:clinicianId";
        readonly BY_PATIENT: "/admin/assignments/patient/:patientId";
        readonly UPDATE: "/admin/assignments/:id";
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
//# sourceMappingURL=index.d.ts.map