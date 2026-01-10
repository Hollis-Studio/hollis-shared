/**
 * @ai-context Health Progress domain contracts | shared enums and constants for health tracking
 *
 * This module provides the canonical definitions for health progress-related constants:
 * - Health trends (improving, stable, declining)
 * - Data quality levels (sufficient, sparse, insufficient)
 *
 * NOTE: Health metric directions and categories are defined in ./training.ts
 * NOTE: The full HEALTH_METRIC_DEFINITIONS registry is defined in src/contracts/healthProgress
 * due to its platform-specific nature and size. This module provides only the shared
 * enum values and types needed across codebases.
 *
 * IMPORTANT: All health trend and data quality enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

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
// HEALTH METRIC KEY MAPPINGS
// ============================================================================

/**
 * Canonical health metric key type.
 * Matches keys defined in HEALTH_METRIC_DEFINITIONS (src/contracts/healthProgress/definitions.ts).
 * 
 * NOTE: The full HEALTH_METRIC_DEFINITIONS registry is in src/contracts/healthProgress due to
 * its platform-specific nature and size. This type covers the commonly used keys.
 */
export type HealthMetricKey =
  // Body composition
  | 'weight'
  | 'bodyFatPercent'
  | 'leanMassKg'
  | 'bmi'
  // Cardiovascular
  | 'restingHR'
  | 'bloodPressureSystolic'
  | 'bloodPressureDiastolic'
  | 'vo2MaxEstimate'
  // Metabolic
  | 'hba1c'
  | 'fastingGlucose'
  | 'totalCholesterol'
  | 'ldlCholesterol'
  | 'hdlCholesterol'
  | 'triglycerides'
  // Hormonal
  | 'testosteroneTotal'
  | 'vitaminD'
  // Performance
  | 'gripStrength';

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
 * Used for unit validation without requiring the full HEALTH_METRIC_DEFINITIONS.
 * 
 * CRITICAL: All biometrics are stored in metric units (kg, cm).
 * Lab values use US standard units (mg/dL, ng/dL).
 */
export const EXPECTED_UNITS: Record<HealthMetricKey, string> = {
  // Body composition
  weight: 'kg',
  bodyFatPercent: '%',
  leanMassKg: 'kg',
  bmi: 'kg/m²',
  // Cardiovascular
  restingHR: 'bpm',
  bloodPressureSystolic: 'mmHg',
  bloodPressureDiastolic: 'mmHg',
  vo2MaxEstimate: 'ml/kg/min',
  // Metabolic (US lab units)
  hba1c: '%',
  fastingGlucose: 'mg/dL',
  totalCholesterol: 'mg/dL',
  ldlCholesterol: 'mg/dL',
  hdlCholesterol: 'mg/dL',
  triglycerides: 'mg/dL',
  // Hormonal (US lab units)
  testosteroneTotal: 'ng/dL',
  vitaminD: 'ng/mL',
  // Performance
  gripStrength: 'kg',
};

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

