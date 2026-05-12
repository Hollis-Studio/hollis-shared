export const APP_ERROR_CODES = {
    AUTH_REQUIRED: "AUTH_REQUIRED",
    /** @scope workouts-mobile */
    NETWORK_OFFLINE: "NETWORK_OFFLINE",
    /** @scope workouts-mobile */
    HEALTH_PERMISSION: "HEALTH_PERMISSION",
    /** @scope workouts-mobile */
    HEALTH_UNAVAILABLE: "HEALTH_UNAVAILABLE",
    VALIDATION_FAILED: "VALIDATION_FAILED",
    VALIDATION_WARNING: "VALIDATION_WARNING",
    AI_UNAVAILABLE: "AI_UNAVAILABLE",
    AI_INVALID_RESPONSE: "AI_INVALID_RESPONSE",
    /** @scope workouts-mobile */
    EXERCISE_NOT_FOUND: "EXERCISE_NOT_FOUND",
    /** @scope workouts-mobile */
    GYM_NOT_FOUND: "GYM_NOT_FOUND",
    /** @scope workouts-mobile */
    PROGRAM_NOT_FOUND: "PROGRAM_NOT_FOUND",
    /** @scope workouts-mobile */
    SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
    /** @scope workouts-mobile */
    BASELINE_NOT_FOUND: "BASELINE_NOT_FOUND",
    /** @scope workouts-mobile */
    INJURY_NOT_FOUND: "INJURY_NOT_FOUND",
    SESSION_CONFLICT: "SESSION_CONFLICT",
    /** @scope workouts-mobile */
    SESSION_ABANDONED: "SESSION_ABANDONED",
    CONFIG_MISSING: "CONFIG_MISSING",
    /** @scope workouts-mobile */
    SYNC_FAILED: "SYNC_FAILED",
    /** @scope workouts-mobile */
    SHARE_FAILED: "SHARE_FAILED",
    NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
    UNKNOWN: "UNKNOWN",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    RATE_LIMITED: "RATE_LIMITED",
    INTERNAL_ERROR: "INTERNAL_ERROR",
};
export const APP_ERROR_CODE_ALIASES = {
    UNAUTHORIZED: APP_ERROR_CODES.AUTH_REQUIRED,
    VALIDATION_ERROR: APP_ERROR_CODES.VALIDATION_FAILED,
    CONFLICT: APP_ERROR_CODES.SESSION_CONFLICT,
};
//# sourceMappingURL=app-error-code.js.map