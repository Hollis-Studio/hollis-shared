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

import { USER_TIER_PRICES_DOLLARS, type UserTier } from "../domain/user";

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * Storage key constants for AsyncStorage (mobile) and localStorage (web).
 * Using a central registry prevents key collisions and makes auditing easier.
 *
 * NOTE: Platform-specific storage keys (like SecureStore keys for iOS keychain)
 * remain in their respective platform codebases.
 */
export const STORAGE_KEYS = {
  // Auth — DEPRECATED: Auth is now cookie-based (httpOnly cookies set by server).
  // These keys are vestigial and should NOT be used in new code.
  // Retained only for backward compatibility with existing references.
  /** @deprecated Auth uses httpOnly cookies now. Do not use. */
  ACCESS_TOKEN: "hollis:accessToken",
  /** @deprecated Auth uses httpOnly cookies now. Do not use. */
  REFRESH_TOKEN: "hollis:refreshToken",
  /** @deprecated Auth uses httpOnly cookies now. Do not use. */
  USER_ID: "hollis:userId",
  /** @deprecated Auth uses httpOnly cookies now. Do not use. */
  USER_SESSION: "hollis:userSession",

  // User preferences
  THEME_MODE: "hollis:themeMode",
  NOTIFICATIONS_ENABLED: "hollis:notificationsEnabled",
  UNIT_SYSTEM: "hollis:unitSystem",

  // Cache keys
  USER_PROFILE_CACHE: "hollis:userProfileCache",
  LAST_SYNC_TIMESTAMP: "hollis:lastSyncTimestamp",

  // Feature-specific
  ONBOARDING_COMPLETED: "hollis:onboardingCompleted",
  DAILY_CHECKIN_LAST_DATE: "hollis:dailyCheckinLastDate",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================
// NOTE: UNIT_SYSTEMS and UNIT_SYSTEM are now exported from domain/units
// with more comprehensive values (metric, imperial, advanced)

/**
 * Default pagination values used across the application.
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 200,
  DEFAULT_PAGE: 1,
} as const;

// ============================================================================
// TIME CONSTANTS
// ============================================================================

/**
 * Time-related constants in milliseconds.
 */
export const TIME_MS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Default cache TTL values.
 */
export const CACHE_TTL = {
  /** Short-lived data like real-time metrics */
  SHORT: 5 * TIME_MS.MINUTE,
  /** Medium-lived data like user profiles */
  MEDIUM: 30 * TIME_MS.MINUTE,
  /** Long-lived data like static configuration */
  LONG: 24 * TIME_MS.HOUR,
} as const;

// ============================================================================
// VALIDATION LIMITS
// ============================================================================

/**
 * Common validation limits used across forms and APIs.
 */
export const VALIDATION_LIMITS = {
  /** Maximum length for display names */
  DISPLAY_NAME_MAX: 100,
  /** Maximum length for email addresses */
  EMAIL_MAX: 255,
  /** Minimum password length */
  PASSWORD_MIN: 6,
  /** Maximum length for general text fields */
  TEXT_FIELD_MAX: 5000,
  /** Maximum length for notes fields */
  NOTES_MAX: 10000,
  /** Maximum length for URLs */
  URL_MAX: 2048,
} as const;

// ============================================================================
// HTTP STATUS CODES
// ============================================================================

/**
 * Common HTTP status codes used in API responses.
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// UNIT CONVERSION FACTORS
// ============================================================================

/**
 * Canonical conversion factors for unit transformations.
 * Base units: kg (weight), cm (length), g (food weight), ml (volume), m (distance), °C (temperature)
 *
 * INVARIANT: All persisted biometrics use metric. Convert at display boundary only.
 *
 * IMPORTANT: All codebases (mobile, server, web-admin) must import these constants
 * from @hollis/contracts rather than defining local duplicates.
 */
export const UNIT_CONVERSION = {
  // Weight (base: kg)
  LBS_PER_KG: 2.20462,

  // Length (base: cm)
  CM_PER_INCH: 2.54,
  INCHES_PER_FOOT: 12,
  CM_PER_FOOT: 30.48, // CM_PER_INCH * INCHES_PER_FOOT = 2.54 * 12

  // Food weight (base: g)
  OZ_PER_GRAM: 0.035274,
  LBS_PER_GRAM: 0.00220462,

  // Food volume (base: ml)
  FL_OZ_PER_ML: 0.033814,
  CUPS_PER_ML: 0.00422675,
  TBSP_PER_ML: 0.067628,
  TSP_PER_ML: 0.202884,
  L_PER_ML: 0.001,

  // Distance (base: m)
  KM_PER_M: 0.001,
  MI_PER_M: 0.000621371,
  FT_PER_M: 3.28084,
} as const;

/**
 * Canonical monthly membership pricing in whole US dollars.
 *
 * This alias preserves existing constants imports while delegating to the
 * canonical user-domain pricing contract. Convert to cents with `price * 100`
 * only at integrations that explicitly require cents (for example, Stripe).
 */
export const TIER_MONTHLY_PRICE_DOLLARS: Record<UserTier, number> =
  USER_TIER_PRICES_DOLLARS;

/**
 * @deprecated Use `TIER_MONTHLY_PRICE_DOLLARS` or `USER_TIER_PRICES_DOLLARS`
 * for explicit units. This legacy alias is dollar-denominated, not cents.
 */
export const TIER_MONTHLY_PRICE: Record<UserTier, number> =
  TIER_MONTHLY_PRICE_DOLLARS;

// ============================================================================
// UPLOAD LIMITS
// ============================================================================

/** Maximum file sizes in bytes by category */
export const UPLOAD_LIMITS = {
  /** Default max file size (10 MB) */
  DEFAULT_MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
  /** Max video file size (50 MB) */
  MAX_VIDEO_FILE_SIZE_BYTES: 50 * 1024 * 1024,
  /** Max number of files in a single upload batch */
  MAX_FILES_PER_UPLOAD: 5,
  /** Max base64-encoded image payload characters (~10 MB decoded) */
  MAX_IMAGE_BASE64_CHARS: 13_500_000,
} as const;

// ============================================================================
// OAUTH PROVIDERS
// ============================================================================

/**
 * Canonical list of supported OAuth providers for social sign-in.
 * Single source of truth used by shared contracts, server validation, and client code.
 * All provider string comparisons must reference this constant — no magic strings.
 */
export const OAUTH_PROVIDERS = ["apple", "google"] as const;

/**
 * Union type of supported OAuth provider identifiers.
 * Derived from OAUTH_PROVIDERS so it stays in sync automatically.
 */
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

// ============================================================================
// SLEEP STAGES (normalized cross-platform strings)
// ============================================================================

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
export const SLEEP_STAGE = {
  UNKNOWN: "unknown",
  AWAKE: "awake",
  LIGHT: "light",
  DEEP: "deep",
  REM: "rem",
  OUT_OF_BED: "out_of_bed",
  SLEEPING: "sleeping",
} as const;

export type SleepStage = (typeof SLEEP_STAGE)[keyof typeof SLEEP_STAGE];

// ============================================================================
// LEGAL
// ============================================================================

/**
 * Canonical URLs for Hollis Health legal and support pages.
 * Single source of truth used by mobile, web-admin, and web-public surfaces.
 * Do NOT hardcode these URLs elsewhere — import from here.
 */
export const LEGAL_URLS = {
  PRIVACY_POLICY: "https://hollishealth.com/privacy",
  TERMS_OF_SERVICE: "https://hollishealth.com/terms",
  SUPPORT: "https://hollishealth.com/support",
} as const;

export type LegalUrl = (typeof LEGAL_URLS)[keyof typeof LEGAL_URLS];

/** Support contact information displayed in-app and on store listings. */
export const SUPPORT_CONTACT = {
  EMAIL: "admin@hollis.health",
  PHONE: "210-891-9005",
  HOURS: "Monday–Friday, 9:00 AM – 5:00 PM CT",
} as const;

/**
 * Standard medical disclaimer displayed throughout the app.
 * Must be shown wherever health-related content could be misread as medical advice.
 */
export const MEDICAL_DISCLAIMER =
  "Hollis Health provides wellness coaching and care coordination services. This app is not a medical device and does not diagnose, treat, cure, or prevent any disease or condition. Always consult your physician or qualified healthcare provider before making health decisions." as const;
