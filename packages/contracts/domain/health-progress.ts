/**
 * @ai-context Health Progress domain contracts | shared enums and constants for health tracking
 *
 * This module provides the canonical definitions for health progress-related constants:
 * - Health trends (improving, stable, declining)
 * - Data quality levels (sufficient, sparse, insufficient)
 * - Health metric directions and categories
 * - Complete HEALTH_METRIC_DEFINITIONS registry (migrated from src/contracts/healthProgress)
 *
 * BUSINESS CONTEXT:
 * Hollis Health differentiates from standard gyms by tracking actual HEALTH OUTCOMES,
 * not just activity metrics. This enables:
 * - Demonstrating ROI to clients (is their A1C actually improving?)
 * - Identifying clients whose health is declining despite activity
 * - Providing data to referring physicians
 * - Justifying premium pricing through measurable outcomes
 *
 * ============================================================================
 * CRITICAL DATA INVARIANTS (Enforced by tests)
 * ============================================================================
 *
 * 1. METRIC-ONLY STORAGE:
 *    - Weight: ALWAYS stored in kg (never lbs)
 *    - Height: ALWAYS stored in cm (never inches/feet)
 *    - Temperature: ALWAYS stored in °C (never °F)
 *
 * 2. US LAB UNITS (not international SI):
 *    - Glucose: mg/dL (NOT mmol/L - would be 18x wrong!)
 *    - Testosterone: ng/dL (NOT nmol/L - would be 28x wrong!)
 *    - Cholesterol: mg/dL (NOT mmol/L)
 *    - HbA1c: % (NOT mmol/mol)
 *
 * 3. UNIT VALIDATION:
 *    - Data with mismatched units is REJECTED, not auto-converted
 *    - See isUnitMatch() for validation logic
 *
 * CRITICAL: Mixing units could show false "improvement" when health is declining!
 *
 * IMPORTANT: All health trend and data quality enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';
import { type BiometricSource } from './clinical';
import {
  HEALTH_METRIC_DEFINITIONS,
  type HealthMetricDefinition,
  type HealthMetricKey,
  HEALTH_METRIC_KEYS,
} from './health-metric-definitions';
import {
  HEALTH_METRIC_DIRECTIONS,
  type HealthMetricDirection,
  HEALTH_METRIC_CATEGORIES,
  type HealthMetricCategory,
} from './health-metric-types';

// ============================================================================
// HEALTH METRIC DIRECTION
// ============================================================================

/**
 * Improvement direction for a metric:
 * - lower_better: Decreasing value = improvement (e.g., A1C, LDL, body fat)
 * - higher_better: Increasing value = improvement (e.g., HDL, grip strength)
 * - context: Direction depends on individual (e.g., weight, testosterone)
 */
export { HEALTH_METRIC_DIRECTIONS, type HealthMetricDirection } from './health-metric-types';

export const HealthMetricDirectionSchema = z.enum(HEALTH_METRIC_DIRECTIONS);

// ============================================================================
// HEALTH METRIC CATEGORY
// ============================================================================

/** Health metric categories for grouping and scoring */
export { HEALTH_METRIC_CATEGORIES, type HealthMetricCategory, HEALTH_METRIC_CATEGORY_LABELS } from './health-metric-types';

export const HealthMetricCategorySchema = z.enum(HEALTH_METRIC_CATEGORIES);

// ============================================================================
// HEALTH TREND
// ============================================================================

/**
 * Health trend values indicating direction of change.
 */
export const HEALTH_TRENDS = ['improving', 'stable', 'declining'] as const;
export type HealthTrend = (typeof HEALTH_TRENDS)[number];

export const HealthTrendSchema = z.enum(HEALTH_TRENDS);

/** Centralized trend constants for equality checks */
export const HEALTH_TREND = {
  IMPROVING: 'improving' as HealthTrend,
  STABLE: 'stable' as HealthTrend,
  DECLINING: 'declining' as HealthTrend,
} as const;

/** Human-readable labels for trends */
export const HEALTH_TREND_LABELS: Record<HealthTrend, string> = {
  improving: 'Improving',
  stable: 'Stable',
  declining: 'Declining',
};

/**
 * Check if a string is a valid health trend
 */
export function isHealthTrend(value: string): value is HealthTrend {
  return (HEALTH_TRENDS as readonly string[]).includes(value);
}

// ============================================================================
// DATA WEIGHTING
// ============================================================================

export const SOURCE_WEIGHTS: Record<BiometricSource, number> = {
  LAB_REPORT: 1.0,
  CLINICIAN_ENTRY: 1.0,
  DERIVED: 0.9,
  APPLE_HEALTH: 0.8,
  OURA: 0.75,
  WHOOP: 0.75,
  GOOGLE_FIT: 0.7,
  DEVICE: 0.7,
  USER_LOG: 0.6,
};

export const VERIFICATION_MULTIPLIER = {
  verified: 1.0,
  unverified: 0.7,
} as const;

// ============================================================================
// DATA QUALITY
// ============================================================================

/**
 * Data quality levels indicating confidence in health progress calculations:
 * - sufficient: ≥3 data points per metric, can calculate meaningful trends
 * - sparse: 2 data points, can show change but not trend
 * - insufficient: <2 data points, cannot calculate progress
 */
export const DATA_QUALITY_LEVELS = ['sufficient', 'sparse', 'insufficient'] as const;
export type DataQualityLevel = (typeof DATA_QUALITY_LEVELS)[number];

export const DataQualityLevelSchema = z.enum(DATA_QUALITY_LEVELS);

/** Centralized data quality constants for equality checks */
export const DATA_QUALITY = {
  SUFFICIENT: 'sufficient' as DataQualityLevel,
  SPARSE: 'sparse' as DataQualityLevel,
  INSUFFICIENT: 'insufficient' as DataQualityLevel,
} as const;

/** Human-readable labels for data quality levels */
export const DATA_QUALITY_LABELS: Record<DataQualityLevel, string> = {
  sufficient: 'Sufficient Data',
  sparse: 'Sparse Data',
  insufficient: 'Insufficient Data',
};

/**
 * Check if a string is a valid data quality level
 */
export function isDataQualityLevel(value: string): value is DataQualityLevel {
  return (DATA_QUALITY_LEVELS as readonly string[]).includes(value);
}

// ============================================================================
// HEALTH METRIC REGISTRY RE-EXPORTS
// ============================================================================

/**
 * Re-export the complete health metric definitions registry and related types.
 * The full registry is now in ./health-metric-definitions.ts
 */
export {
  HEALTH_METRIC_DEFINITIONS,
  type HealthMetricKey,
  HEALTH_METRIC_KEYS,
  HEALTH_METRIC_LABELS,
  type HealthMetricDefinition,
} from './health-metric-definitions';

/** Zod schema for HealthMetricKey validation */
export const HealthMetricKeySchema = z.enum(HEALTH_METRIC_KEYS as [HealthMetricKey, ...HealthMetricKey[]]);

// ============================================================================
// HEALTH METRIC KEY MAPPINGS
// ============================================================================

/**
 * Maps biometric entry keys to health metric keys.
 * Used by services that read from the biometrics table to align with the
 * health metric registry.
 */
export const BIOMETRIC_KEY_MAP: Record<string, HealthMetricKey> = {
  weight: 'weight',
  Weight: 'weight',
  bodyFat: 'bodyFatPercent',
  'Body Fat': 'bodyFatPercent',
  'body_fat_percent': 'bodyFatPercent',
  leanMass: 'leanMassKg',
  'Lean Mass': 'leanMassKg',
  restingHR: 'restingHR',
  'Resting HR': 'restingHR',
  'resting_heart_rate': 'restingHR',
  vo2Max: 'vo2MaxEstimate',
  'VO2 Max': 'vo2MaxEstimate',
  gripStrength: 'gripStrength',
  'Grip Strength': 'gripStrength',
  systolic: 'bloodPressureSystolic',
  Systolic: 'bloodPressureSystolic',
  diastolic: 'bloodPressureDiastolic',
  Diastolic: 'bloodPressureDiastolic',
};

/**
 * Maps lab test names/codes to health metric keys.
 * Multiple aliases are supported because lab vendors use different naming.
 */
export const LAB_NAME_MAP: Record<string, HealthMetricKey> = {
  // HbA1c variations
  HbA1c: 'hba1c',
  'Hemoglobin A1c': 'hba1c',
  A1C: 'hba1c',
  HbA1C: 'hba1c',
  Glycohemoglobin: 'hba1c',

  // Glucose variations
  'Fasting Glucose': 'fastingGlucose',
  'Glucose, Fasting': 'fastingGlucose',
  Glucose: 'fastingGlucose',
  'Blood Glucose': 'fastingGlucose',

  // Cholesterol variations
  'Total Cholesterol': 'totalCholesterol',
  Cholesterol: 'totalCholesterol',
  'Cholesterol, Total': 'totalCholesterol',

  'LDL Cholesterol': 'ldlCholesterol',
  'LDL-C': 'ldlCholesterol',
  LDL: 'ldlCholesterol',
  'Low Density Lipoprotein': 'ldlCholesterol',

  'HDL Cholesterol': 'hdlCholesterol',
  'HDL-C': 'hdlCholesterol',
  HDL: 'hdlCholesterol',
  'High Density Lipoprotein': 'hdlCholesterol',

  Triglycerides: 'triglycerides',
  TG: 'triglycerides',

  // Vitamin D variations
  'Vitamin D, 25-Hydroxy': 'vitaminD',
  '25-OH Vitamin D': 'vitaminD',
  'Vitamin D': 'vitaminD',
  '25-Hydroxyvitamin D': 'vitaminD',

  // Testosterone variations
  'Testosterone, Total': 'testosteroneTotal',
  Testosterone: 'testosteroneTotal',
  'Total Testosterone': 'testosteroneTotal',
};

// ============================================================================
// EXPECTED UNITS MAP (for validation without full definitions)
// ============================================================================

/**
 * Expected units for health metrics.
 * Automatically derived from HEALTH_METRIC_DEFINITIONS.
 *
 * CRITICAL: All biometrics are stored in metric units (kg, cm).
 * Lab values use US standard units (mg/dL, ng/dL).
 */
export const EXPECTED_UNITS: Record<HealthMetricKey, string> = Object.fromEntries(
  HEALTH_METRIC_KEYS.map((key) => [key, HEALTH_METRIC_DEFINITIONS[key].unit])
) as Record<HealthMetricKey, string>;

/**
 * Gets the expected unit for a health metric.
 *
 * @param metricKey - The health metric key
 * @returns The expected unit string
 */
export function getExpectedUnit(metricKey: HealthMetricKey): string {
  return EXPECTED_UNITS[metricKey];
}

/**
 * Validates that an input unit matches the expected unit for a metric.
 *
 * CRITICAL for unit safety: Always call this before comparing metric values.
 * Returns false if units don't match, indicating data needs conversion or rejection.
 *
 * @param metricKey - The health metric key
 * @param inputUnit - The unit from the data source
 * @returns true if units match (case-insensitive), false otherwise
 *
 * @example
 * if (!isUnitMatch('fastingGlucose', labResult.unit)) {
 *   throw new Error(`Unit mismatch: expected mg/dL, got ${labResult.unit}`);
 * }
 */
export function isUnitMatch(metricKey: HealthMetricKey, inputUnit: string): boolean {
  const expectedUnit = EXPECTED_UNITS[metricKey];
  return expectedUnit.toLowerCase() === inputUnit.toLowerCase();
}

// ============================================================================
// ADDITIONAL UTILITY FUNCTIONS
// ============================================================================

/**
 * Returns the weight for a data point based on source and verification status.
 */
export function getDataPointWeight(source: BiometricSource, isVerified: boolean): number {
  const base = SOURCE_WEIGHTS[source];
  const verification = isVerified ? VERIFICATION_MULTIPLIER.verified : VERIFICATION_MULTIPLIER.unverified;
  return Math.min(1, Math.max(0, base * verification));
}

/**
 * Gets the improvement direction for a health metric.
 *
 * @param metricKey - The health metric key
 * @returns The direction ('lower_better', 'higher_better', or 'context')
 */
export function getMetricDirection(metricKey: HealthMetricKey): HealthMetricDirection {
  return HEALTH_METRIC_DEFINITIONS[metricKey].direction;
}

/**
 * Gets the category for a health metric.
 *
 * @param metricKey - The health metric key
 * @returns The category
 */
export function getMetricCategory(metricKey: HealthMetricKey): HealthMetricCategory {
  return HEALTH_METRIC_DEFINITIONS[metricKey].category;
}

/**
 * @deprecated WARNING: Uses static reference ranges that ignore patient sex, age, and pregnancy status.
 * This function is NOT appropriate for clinical decision-making.
 *
 * Use resolveReferenceRange() from referenceRanges module instead for patient-aware range checking.
 *
 * @param metricKey - The health metric key
 * @param value - The value to check
 * @returns true if within range or no range defined, false if outside range
 */
export function isWithinNormalRange(metricKey: HealthMetricKey, value: number): boolean {
  const definition: HealthMetricDefinition = HEALTH_METRIC_DEFINITIONS[metricKey];
  if (!definition.normalRange) {
    return true; // No range defined, assume acceptable
  }
  const { min, max } = definition.normalRange;
  return value >= min && value <= max;
}

/**
 * Determines the health trend based on percent change and metric direction.
 * A change of less than 3% in either direction is considered stable.
 *
 * @param metricKey - The health metric key
 * @param percentChange - The percent change (can be negative)
 * @returns The health trend
 */
export function determineTrend(metricKey: HealthMetricKey, percentChange: number | null): HealthTrend {
  if (percentChange === null) {
    return HEALTH_TREND.STABLE; // No data to determine trend
  }

  const STABILITY_THRESHOLD = 3; // ±3% is considered stable
  const direction = getMetricDirection(metricKey);

  if (Math.abs(percentChange) < STABILITY_THRESHOLD) {
    return HEALTH_TREND.STABLE;
  }

  // For context-dependent metrics, we can't determine improvement without more info
  if (direction === 'context') {
    return HEALTH_TREND.STABLE;
  }

  const isIncreasing = percentChange > 0;

  if (direction === 'higher_better') {
    return isIncreasing ? HEALTH_TREND.IMPROVING : HEALTH_TREND.DECLINING;
  } else {
    // lower_better
    return isIncreasing ? HEALTH_TREND.DECLINING : HEALTH_TREND.IMPROVING;
  }
}

