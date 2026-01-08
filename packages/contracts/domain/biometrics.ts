/**
 * @ai-context Biometric Key Registry | Canonical biometric keys for validation
 *
 * This module defines the canonical set of valid biometric keys used throughout
 * the application for health metrics tracking. Uses camelCase convention.
 *
 * IMPORTANT: This is the single source of truth for valid biometric keys.
 * All new biometric data should use these canonical keys.
 *
 * Legacy PascalCase keys are supported via the BIOMETRIC_KEY_ALIASES map
 * and the toCanonicalKey() helper function.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// BIOMETRIC KEYS (Canonical Registry)
// ============================================================================

/**
 * All valid biometric keys.
 *
 * Convention: camelCase for consistency with modern codebase standards.
 * Legacy PascalCase keys are mapped via BIOMETRIC_KEY_ALIASES.
 */
export const BIOMETRIC_KEYS = [
  // Body Composition
  'weight',
  'bodyFatPercent',
  'leanMass',
  'bmi',

  // Heart Rate & Cardiovascular
  'restingHr',
  'activeHr',
  'hrv',
  'vo2Max',
  'bloodPressureSystolic',
  'bloodPressureDiastolic',

  // Activity & Performance
  'steps',
  'caloriesBurned',
  'activeMinutes',
  'strain',
  'trainingLoad',
  'gripStrength',

  // Sleep
  'sleepDuration',
  'deepSleepPercent',
  'remSleepPercent',

  // Recovery
  'recoveryScore',
] as const;

export type BiometricKey = (typeof BIOMETRIC_KEYS)[number];

/**
 * Zod schema for validating biometric keys.
 * Use this in validation schemas instead of z.string().
 */
export const BiometricKeySchema = z.enum(BIOMETRIC_KEYS, {
  errorMap: () => ({
    message: `biometricKey must be one of: ${BIOMETRIC_KEYS.join(', ')}`,
  }),
});

// ============================================================================
// BIOMETRIC KEY CONSTANTS
// ============================================================================

/** Centralized biometric key constants for equality checks */
export const BIOMETRIC_KEY = {
  // Body Composition
  WEIGHT: 'weight' as BiometricKey,
  BODY_FAT_PERCENT: 'bodyFatPercent' as BiometricKey,
  LEAN_MASS: 'leanMass' as BiometricKey,
  BMI: 'bmi' as BiometricKey,

  // Heart Rate & Cardiovascular
  RESTING_HR: 'restingHr' as BiometricKey,
  ACTIVE_HR: 'activeHr' as BiometricKey,
  HRV: 'hrv' as BiometricKey,
  VO2_MAX: 'vo2Max' as BiometricKey,
  BLOOD_PRESSURE_SYSTOLIC: 'bloodPressureSystolic' as BiometricKey,
  BLOOD_PRESSURE_DIASTOLIC: 'bloodPressureDiastolic' as BiometricKey,

  // Activity & Performance
  STEPS: 'steps' as BiometricKey,
  CALORIES_BURNED: 'caloriesBurned' as BiometricKey,
  ACTIVE_MINUTES: 'activeMinutes' as BiometricKey,
  STRAIN: 'strain' as BiometricKey,
  TRAINING_LOAD: 'trainingLoad' as BiometricKey,
  GRIP_STRENGTH: 'gripStrength' as BiometricKey,

  // Sleep
  SLEEP_DURATION: 'sleepDuration' as BiometricKey,
  DEEP_SLEEP_PERCENT: 'deepSleepPercent' as BiometricKey,
  REM_SLEEP_PERCENT: 'remSleepPercent' as BiometricKey,

  // Recovery
  RECOVERY_SCORE: 'recoveryScore' as BiometricKey,
} as const;

// ============================================================================
// BIOMETRIC KEY LABELS
// ============================================================================

/**
 * Human-readable labels for biometric keys
 */
export const BIOMETRIC_KEY_LABELS: Record<BiometricKey, string> = {
  // Body Composition
  weight: 'Body Weight',
  bodyFatPercent: 'Body Fat Percentage',
  leanMass: 'Lean Body Mass',
  bmi: 'BMI',

  // Heart Rate & Cardiovascular
  restingHr: 'Resting Heart Rate',
  activeHr: 'Active Heart Rate',
  hrv: 'Heart Rate Variability',
  vo2Max: 'VO2 Max',
  bloodPressureSystolic: 'Blood Pressure (Systolic)',
  bloodPressureDiastolic: 'Blood Pressure (Diastolic)',

  // Activity & Performance
  steps: 'Daily Steps',
  caloriesBurned: 'Calories Burned',
  activeMinutes: 'Active Minutes',
  strain: 'Strain Score',
  trainingLoad: 'Training Load',
  gripStrength: 'Grip Strength',

  // Sleep
  sleepDuration: 'Sleep Duration',
  deepSleepPercent: 'Deep Sleep Percentage',
  remSleepPercent: 'REM Sleep Percentage',

  // Recovery
  recoveryScore: 'Recovery Score',
};

// ============================================================================
// LEGACY KEY ALIASES
// ============================================================================

/**
 * Maps legacy PascalCase and other variant keys to canonical camelCase keys.
 * Used for backwards compatibility with existing database records.
 */
export const BIOMETRIC_KEY_ALIASES: Record<string, BiometricKey> = {
  // Weight variants
  Weight: 'weight',
  WEIGHT: 'weight',

  // Body Fat variants
  BodyFat: 'bodyFatPercent',
  BodyFatPercentage: 'bodyFatPercent',
  BodyFatPercent: 'bodyFatPercent',
  BODY_FAT: 'bodyFatPercent',
  body_fat_percent: 'bodyFatPercent',

  // Lean Mass variants
  LeanMass: 'leanMass',
  MuscleMass: 'leanMass',
  MuscleMassKg: 'leanMass',
  lean_mass: 'leanMass',

  // BMI variants
  BMI: 'bmi',

  // Resting HR variants
  RestingHeartRate: 'restingHr',
  RestingHR: 'restingHr',
  RestingHr: 'restingHr',
  resting_hr: 'restingHr',

  // Active HR variants
  ActiveHeartRate: 'activeHr',
  ActiveHR: 'activeHr',
  ActiveHr: 'activeHr',
  active_hr: 'activeHr',

  // HRV variants
  HRV: 'hrv',
  HeartRateVariability: 'hrv',

  // VO2 Max variants
  VO2Max: 'vo2Max',
  Vo2Max: 'vo2Max',
  vo2_max: 'vo2Max',

  // Blood Pressure variants
  BloodPressureSystolic: 'bloodPressureSystolic',
  SystolicBP: 'bloodPressureSystolic',
  blood_pressure_systolic: 'bloodPressureSystolic',
  BloodPressureDiastolic: 'bloodPressureDiastolic',
  DiastolicBP: 'bloodPressureDiastolic',
  blood_pressure_diastolic: 'bloodPressureDiastolic',

  // Steps variants
  Steps: 'steps',
  DailySteps: 'steps',

  // Calories variants
  CaloriesBurned: 'caloriesBurned',
  Calories: 'caloriesBurned',
  calories_burned: 'caloriesBurned',

  // Active Minutes variants
  ActiveMinutes: 'activeMinutes',
  active_minutes: 'activeMinutes',

  // Sleep variants
  SleepDuration: 'sleepDuration',
  Sleep: 'sleepDuration',
  sleep_duration: 'sleepDuration',
  DeepSleepPercent: 'deepSleepPercent',
  DeepSleep: 'deepSleepPercent',
  deep_sleep_percent: 'deepSleepPercent',
  RemSleepPercent: 'remSleepPercent',
  REMSleep: 'remSleepPercent',
  rem_sleep_percent: 'remSleepPercent',

  // Recovery variants
  RecoveryScore: 'recoveryScore',
  Recovery: 'recoveryScore',
  recovery_score: 'recoveryScore',

  // Strain variants
  Strain: 'strain',
  StrainScore: 'strain',

  // Training Load variants
  TrainingLoad: 'trainingLoad',
  training_load: 'trainingLoad',

  // Grip Strength variants
  GripStrength: 'gripStrength',
  grip_strength: 'gripStrength',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a string is a valid canonical biometric key
 */
export function isBiometricKey(value: string): value is BiometricKey {
  return (BIOMETRIC_KEYS as readonly string[]).includes(value);
}

/**
 * Convert a legacy/variant key to the canonical biometric key.
 * Returns undefined if the key is not recognized.
 *
 * @param dbKey - The key from database or external source (may be PascalCase, snake_case, etc.)
 * @returns The canonical camelCase BiometricKey, or undefined if not found
 *
 * @example
 * toCanonicalKey('Weight') // => 'weight'
 * toCanonicalKey('BodyFatPercentage') // => 'bodyFatPercent'
 * toCanonicalKey('restingHr') // => 'restingHr' (already canonical)
 * toCanonicalKey('unknown') // => undefined
 */
export function toCanonicalKey(dbKey: string): BiometricKey | undefined {
  // Check if already canonical
  if (isBiometricKey(dbKey)) {
    return dbKey;
  }

  // Check aliases
  return BIOMETRIC_KEY_ALIASES[dbKey];
}

/**
 * Get biometric key label by key.
 * Falls back to the key itself if not found in labels.
 */
export function getBiometricKeyLabel(key: BiometricKey): string {
  return BIOMETRIC_KEY_LABELS[key] ?? key;
}

/**
 * Normalize a key and get its label.
 * Useful for displaying legacy keys with proper labels.
 *
 * @param key - Any biometric key variant
 * @returns The human-readable label, or the original key if not recognized
 */
export function getBiometricLabel(key: string): string {
  const canonical = toCanonicalKey(key);
  if (canonical) {
    return BIOMETRIC_KEY_LABELS[canonical];
  }
  return key;
}
