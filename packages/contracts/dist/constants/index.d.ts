/**
 * @ai-context Constants Barrel | exports all shared constants and configuration values
 *
 * This module provides shared constants including:
 * - Storage keys for persistence
 * - Configuration values
 * - Magic number constants
 * - Feature flags (static)
 *
 * IMPORTANT: Constants in this module must be environment-agnostic.
 * Environment-specific values should be loaded from config at runtime.
 *
 * deps: none | consumers: all codebases
 */
import { type UserTier } from "../domain/user.js";
/**
 * Storage key constants for AsyncStorage (mobile) and localStorage (web).
 * Using a central registry prevents key collisions and makes auditing easier.
 *
 * NOTE: Platform-specific storage keys (like SecureStore keys for iOS keychain)
 * remain in their respective platform codebases.
 */
export declare const STORAGE_KEYS: {
    /** @deprecated Auth uses httpOnly cookies now. Do not use. */
    readonly ACCESS_TOKEN: "hollis:accessToken";
    /** @deprecated Auth uses httpOnly cookies now. Do not use. */
    readonly REFRESH_TOKEN: "hollis:refreshToken";
    /** @deprecated Auth uses httpOnly cookies now. Do not use. */
    readonly USER_ID: "hollis:userId";
    /** @deprecated Auth uses httpOnly cookies now. Do not use. */
    readonly USER_SESSION: "hollis:userSession";
    readonly THEME_MODE: "hollis:themeMode";
    readonly NOTIFICATIONS_ENABLED: "hollis:notificationsEnabled";
    readonly UNIT_SYSTEM: "hollis:unitSystem";
    readonly USER_PROFILE_CACHE: "hollis:userProfileCache";
    readonly LAST_SYNC_TIMESTAMP: "hollis:lastSyncTimestamp";
    readonly ONBOARDING_COMPLETED: "hollis:onboardingCompleted";
    readonly DAILY_CHECKIN_LAST_DATE: "hollis:dailyCheckinLastDate";
};
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
/**
 * Default pagination values used across the application.
 */
export declare const PAGINATION: {
    readonly DEFAULT_PAGE_SIZE: 50;
    readonly MAX_PAGE_SIZE: 200;
    readonly DEFAULT_PAGE: 1;
};
/**
 * Time-related constants in milliseconds.
 */
export declare const TIME_MS: {
    readonly SECOND: 1000;
    readonly MINUTE: number;
    readonly HOUR: number;
    readonly DAY: number;
    readonly WEEK: number;
};
/**
 * Default cache TTL values.
 */
export declare const CACHE_TTL: {
    /** Short-lived data like real-time metrics */
    readonly SHORT: number;
    /** Medium-lived data like user profiles */
    readonly MEDIUM: number;
    /** Long-lived data like static configuration */
    readonly LONG: number;
};
/**
 * Common validation limits used across forms and APIs.
 */
export declare const VALIDATION_LIMITS: {
    /** Maximum length for display names */
    readonly DISPLAY_NAME_MAX: 100;
    /** Maximum length for email addresses */
    readonly EMAIL_MAX: 255;
    /** Minimum password length */
    readonly PASSWORD_MIN: 6;
    /** Maximum length for general text fields */
    readonly TEXT_FIELD_MAX: 5000;
    /** Maximum length for notes fields */
    readonly NOTES_MAX: 10000;
    /** Maximum length for URLs */
    readonly URL_MAX: 2048;
};
/**
 * Common HTTP status codes used in API responses.
 */
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly GONE: 410;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly PAYLOAD_TOO_LARGE: 413;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
/**
 * Canonical conversion factors for unit transformations.
 * Base units: kg (weight), cm (length), g (food weight), ml (volume), m (distance), °C (temperature)
 *
 * INVARIANT: All persisted biometrics use metric. Convert at display boundary only.
 *
 * IMPORTANT: All codebases (mobile, server, web-admin) must import these constants
 * from @hollis-studio/contracts rather than defining local duplicates.
 */
export declare const UNIT_CONVERSION: {
    readonly LBS_PER_KG: 2.20462;
    readonly CM_PER_INCH: 2.54;
    readonly INCHES_PER_FOOT: 12;
    readonly CM_PER_FOOT: 30.48;
    readonly OZ_PER_GRAM: 0.035274;
    readonly LBS_PER_GRAM: 0.00220462;
    readonly FL_OZ_PER_ML: 0.033814;
    readonly CUPS_PER_ML: 0.00422675;
    readonly TBSP_PER_ML: 0.067628;
    readonly TSP_PER_ML: 0.202884;
    readonly L_PER_ML: 0.001;
    readonly KM_PER_M: 0.001;
    readonly MI_PER_M: 0.000621371;
    readonly FT_PER_M: 3.28084;
};
/**
 * Canonical monthly membership pricing in whole US dollars.
 *
 * This alias preserves existing constants imports while delegating to the
 * canonical user-domain pricing contract. Convert to cents with `price * 100`
 * only at integrations that explicitly require cents (for example, Stripe).
 */
export declare const TIER_MONTHLY_PRICE_DOLLARS: Record<UserTier, number>;
/**
 * @deprecated Use `TIER_MONTHLY_PRICE_DOLLARS` or `USER_TIER_PRICES_DOLLARS`
 * for explicit units. This legacy alias is dollar-denominated, not cents.
 */
export declare const TIER_MONTHLY_PRICE: Record<UserTier, number>;
/** Maximum file sizes in bytes by category */
export declare const UPLOAD_LIMITS: {
    /** Default max file size (10 MB) */
    readonly DEFAULT_MAX_FILE_SIZE_BYTES: number;
    /** Max video file size (50 MB) */
    readonly MAX_VIDEO_FILE_SIZE_BYTES: number;
    /** Max number of files in a single upload batch */
    readonly MAX_FILES_PER_UPLOAD: 5;
    /** Max base64-encoded image payload characters (~10 MB decoded) */
    readonly MAX_IMAGE_BASE64_CHARS: 13500000;
};
/**
 * Canonical list of supported OAuth providers for social sign-in.
 * Single source of truth used by shared contracts, server validation, and client code.
 * All provider string comparisons must reference this constant — no magic strings.
 */
export declare const OAUTH_PROVIDERS: readonly ["apple", "google"];
/**
 * Union type of supported OAuth provider identifiers.
 * Derived from OAUTH_PROVIDERS so it stays in sync automatically.
 */
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];
/**
 * Normalized sleep stage strings used across platform health integrations.
 *
 * These are the canonical output strings produced after mapping platform-specific
 * numeric codes to a common vocabulary:
 * - Health Connect (Android): uses integer codes 0-6 (mapped in useHealthConnect.ts)
 * - HealthKit (iOS): uses HKCategoryValueSleepAnalysis integer codes (mapped in useHealthKit.ts)
 *
 * Platform-specific numeric constants (HC_SLEEP_STAGE_CODE, SLEEP_VALUE) remain
 * local to their respective hook files — only the normalized output strings are shared.
 */
export declare const SLEEP_STAGE: {
    readonly UNKNOWN: "unknown";
    readonly AWAKE: "awake";
    readonly LIGHT: "light";
    readonly DEEP: "deep";
    readonly REM: "rem";
    readonly OUT_OF_BED: "out_of_bed";
    readonly SLEEPING: "sleeping";
};
export type SleepStage = (typeof SLEEP_STAGE)[keyof typeof SLEEP_STAGE];
/**
 * Canonical URLs for Hollis Health legal and support pages.
 * Single source of truth used by mobile, web-admin, and web-public surfaces.
 * Do NOT hardcode these URLs elsewhere — import from here.
 */
export declare const LEGAL_URLS: {
    readonly PRIVACY_POLICY: "https://hollis.health/privacy";
    readonly TERMS_OF_SERVICE: "https://hollis.health/terms";
    readonly SUPPORT: "https://hollis.health/support";
};
export type LegalUrl = (typeof LEGAL_URLS)[keyof typeof LEGAL_URLS];
/** Support contact information displayed in-app and on store listings. */
export declare const SUPPORT_CONTACT: {
    readonly EMAIL: "admin@hollis.health";
    readonly PHONE: "210-891-9005";
    readonly HOURS: "Monday–Friday, 9:00 AM – 5:00 PM CT";
};
/**
 * Standard medical disclaimer displayed throughout the app.
 * Must be shown wherever health-related content could be misread as medical advice.
 */
export declare const MEDICAL_DISCLAIMER: "Hollis Health provides wellness coaching and care coordination services. This app is not a medical device and does not diagnose, treat, cure, or prevent any disease or condition. Always consult your physician or qualified healthcare provider before making health decisions.";
//# sourceMappingURL=index.d.ts.map