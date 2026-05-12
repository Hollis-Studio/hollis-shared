/**
 * Shared suite error codes.
 *
 * Workouts-mobile scoped codes are retained for one-line import migration from
 * Hollis Workouts. Health spellings for semantic overlaps are exported as
 * aliases below instead of widening the canonical union.
 */
export type AppErrorCode = "AUTH_REQUIRED"
/** @scope workouts-mobile */
 | "NETWORK_OFFLINE"
/** @scope workouts-mobile */
 | "HEALTH_PERMISSION"
/** @scope workouts-mobile */
 | "HEALTH_UNAVAILABLE" | "VALIDATION_FAILED" | "VALIDATION_WARNING" | "AI_UNAVAILABLE" | "AI_INVALID_RESPONSE"
/** @scope workouts-mobile */
 | "EXERCISE_NOT_FOUND"
/** @scope workouts-mobile */
 | "GYM_NOT_FOUND"
/** @scope workouts-mobile */
 | "PROGRAM_NOT_FOUND"
/** @scope workouts-mobile */
 | "SESSION_NOT_FOUND"
/** @scope workouts-mobile */
 | "BASELINE_NOT_FOUND"
/** @scope workouts-mobile */
 | "INJURY_NOT_FOUND" | "SESSION_CONFLICT"
/** @scope workouts-mobile */
 | "SESSION_ABANDONED" | "CONFIG_MISSING"
/** @scope workouts-mobile */
 | "SYNC_FAILED"
/** @scope workouts-mobile */
 | "SHARE_FAILED" | "NOT_IMPLEMENTED" | "UNKNOWN" | "FORBIDDEN" | "NOT_FOUND" | "RATE_LIMITED" | "INTERNAL_ERROR";
export declare const APP_ERROR_CODES: {
    readonly AUTH_REQUIRED: "AUTH_REQUIRED";
    /** @scope workouts-mobile */
    readonly NETWORK_OFFLINE: "NETWORK_OFFLINE";
    /** @scope workouts-mobile */
    readonly HEALTH_PERMISSION: "HEALTH_PERMISSION";
    /** @scope workouts-mobile */
    readonly HEALTH_UNAVAILABLE: "HEALTH_UNAVAILABLE";
    readonly VALIDATION_FAILED: "VALIDATION_FAILED";
    readonly VALIDATION_WARNING: "VALIDATION_WARNING";
    readonly AI_UNAVAILABLE: "AI_UNAVAILABLE";
    readonly AI_INVALID_RESPONSE: "AI_INVALID_RESPONSE";
    /** @scope workouts-mobile */
    readonly EXERCISE_NOT_FOUND: "EXERCISE_NOT_FOUND";
    /** @scope workouts-mobile */
    readonly GYM_NOT_FOUND: "GYM_NOT_FOUND";
    /** @scope workouts-mobile */
    readonly PROGRAM_NOT_FOUND: "PROGRAM_NOT_FOUND";
    /** @scope workouts-mobile */
    readonly SESSION_NOT_FOUND: "SESSION_NOT_FOUND";
    /** @scope workouts-mobile */
    readonly BASELINE_NOT_FOUND: "BASELINE_NOT_FOUND";
    /** @scope workouts-mobile */
    readonly INJURY_NOT_FOUND: "INJURY_NOT_FOUND";
    readonly SESSION_CONFLICT: "SESSION_CONFLICT";
    /** @scope workouts-mobile */
    readonly SESSION_ABANDONED: "SESSION_ABANDONED";
    readonly CONFIG_MISSING: "CONFIG_MISSING";
    /** @scope workouts-mobile */
    readonly SYNC_FAILED: "SYNC_FAILED";
    /** @scope workouts-mobile */
    readonly SHARE_FAILED: "SHARE_FAILED";
    readonly NOT_IMPLEMENTED: "NOT_IMPLEMENTED";
    readonly UNKNOWN: "UNKNOWN";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
};
export declare const APP_ERROR_CODE_ALIASES: {
    readonly UNAUTHORIZED: "AUTH_REQUIRED";
    readonly VALIDATION_ERROR: "VALIDATION_FAILED";
    readonly CONFLICT: "SESSION_CONFLICT";
};
export type AppErrorCodeAlias = keyof typeof APP_ERROR_CODE_ALIASES;
export type HealthAppErrorCodeAlias = AppErrorCodeAlias;
//# sourceMappingURL=app-error-code.d.ts.map