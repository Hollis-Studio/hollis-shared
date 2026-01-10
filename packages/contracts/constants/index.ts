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
  // Auth
  ACCESS_TOKEN: 'hollis:accessToken',
  REFRESH_TOKEN: 'hollis:refreshToken',
  USER_ID: 'hollis:userId',
  USER_SESSION: 'hollis:userSession',

  // User preferences
  THEME_MODE: 'hollis:themeMode',
  NOTIFICATIONS_ENABLED: 'hollis:notificationsEnabled',
  UNIT_SYSTEM: 'hollis:unitSystem',

  // Cache keys
  USER_PROFILE_CACHE: 'hollis:userProfileCache',
  LAST_SYNC_TIMESTAMP: 'hollis:lastSyncTimestamp',

  // Feature-specific
  ONBOARDING_COMPLETED: 'hollis:onboardingCompleted',
  DAILY_CHECKIN_LAST_DATE: 'hollis:dailyCheckinLastDate',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// ============================================================================
// UNIT SYSTEMS
// ============================================================================

/**
 * Unit system preference for measurements.
 * All data is stored in metric; imperial is for display only.
 */
export const UNIT_SYSTEMS = ['METRIC', 'IMPERIAL'] as const;
export type UnitSystem = (typeof UNIT_SYSTEMS)[number];

export const UNIT_SYSTEM = {
  METRIC: 'METRIC' as UnitSystem,
  IMPERIAL: 'IMPERIAL' as UnitSystem,
} as const;

export const DEFAULT_UNIT_SYSTEM: UnitSystem = 'METRIC';

// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================

/**
 * Default pagination values used across the application.
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
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
  PASSWORD_MIN: 8,
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
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
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
