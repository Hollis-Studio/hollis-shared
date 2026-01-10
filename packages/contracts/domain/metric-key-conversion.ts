/**
 * @ai-context Metric Key Conversion | Bidirectional mapping between GoalMetricKey and HealthMetricKey
 *
 * Two metric key types exist intentionally:
 * - GoalMetricKey (snake_case): Used by AI strategy generation, persisted in strategy_goal
 * - HealthMetricKey (camelCase): Used by biometrics, labs, health progress scoring
 *
 * This module provides explicit conversion utilities for boundary crossing.
 *
 * BOUNDARY RULE:
 * When crossing from strategy goals (AI domain) to health scoring (biometrics domain),
 * always use goalMetricToHealthMetric(). When crossing in the reverse direction,
 * use healthMetricToGoalMetric(). Never cast between types without conversion.
 *
 * deps: ./goal-metrics, ./health-progress | consumers: server/src/services/*
 */

import { type GoalMetricKey } from './goal-metrics';
import { type HealthMetricKey } from './health-progress';

// ============================================================================
// GOAL → HEALTH METRIC CONVERSION MAP
// ============================================================================

/**
 * Maps GoalMetricKey (snake_case) → HealthMetricKey (camelCase)
 * Not all goal metrics have a corresponding health metric (some are performance-only)
 */
export const GOAL_TO_HEALTH_METRIC_MAP: Partial<Record<GoalMetricKey, HealthMetricKey>> = {
  weight: 'weight',
  body_fat_percent: 'bodyFatPercent',
  lean_mass: 'leanMassKg',
  resting_hr: 'restingHR',
  blood_pressure_systolic: 'bloodPressureSystolic',
  blood_pressure_diastolic: 'bloodPressureDiastolic',
  vo2_max: 'vo2MaxEstimate',
  hba1c: 'hba1c',
  fasting_glucose: 'fastingGlucose',
  total_cholesterol: 'totalCholesterol',
  ldl_cholesterol: 'ldlCholesterol',
  hdl_cholesterol: 'hdlCholesterol',
  triglycerides: 'triglycerides',
  vitamin_d: 'vitaminD',
  testosterone_total: 'testosteroneTotal',
  grip_strength: 'gripStrength',
  // Performance metrics don't have HealthMetricKey equivalents (yet)
  // squat_1rm, bench_1rm, deadlift_1rm, overhead_press_1rm, pull_up_max, mile_time
};

// ============================================================================
// HEALTH → GOAL METRIC CONVERSION MAP
// ============================================================================

/**
 * Maps HealthMetricKey (camelCase) → GoalMetricKey (snake_case)
 */
export const HEALTH_TO_GOAL_METRIC_MAP: Partial<Record<HealthMetricKey, GoalMetricKey>> = {
  weight: 'weight',
  bodyFatPercent: 'body_fat_percent',
  leanMassKg: 'lean_mass',
  restingHR: 'resting_hr',
  bloodPressureSystolic: 'blood_pressure_systolic',
  bloodPressureDiastolic: 'blood_pressure_diastolic',
  vo2MaxEstimate: 'vo2_max',
  hba1c: 'hba1c',
  fastingGlucose: 'fasting_glucose',
  totalCholesterol: 'total_cholesterol',
  ldlCholesterol: 'ldl_cholesterol',
  hdlCholesterol: 'hdl_cholesterol',
  triglycerides: 'triglycerides',
  vitaminD: 'vitamin_d',
  testosteroneTotal: 'testosterone_total',
  gripStrength: 'grip_strength',
  // bmi has no GoalMetricKey equivalent
};

// ============================================================================
// CONVERSION FUNCTIONS
// ============================================================================

/**
 * Convert GoalMetricKey → HealthMetricKey
 * Use when crossing from AI/strategy domain into biometrics/scoring domain.
 *
 * @param goalKey - The goal metric key (snake_case)
 * @returns The health metric key (camelCase) or null if no mapping exists
 */
export function goalMetricToHealthMetric(goalKey: GoalMetricKey): HealthMetricKey | null {
  return GOAL_TO_HEALTH_METRIC_MAP[goalKey] ?? null;
}

/**
 * Convert HealthMetricKey → GoalMetricKey
 * Use when crossing from biometrics domain into AI/strategy domain.
 *
 * @param healthKey - The health metric key (camelCase)
 * @returns The goal metric key (snake_case) or null if no mapping exists
 */
export function healthMetricToGoalMetric(healthKey: HealthMetricKey): GoalMetricKey | null {
  return HEALTH_TO_GOAL_METRIC_MAP[healthKey] ?? null;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard: is this a valid HealthMetricKey?
 * Uses the known camelCase keys.
 */
export function isHealthMetricKeyStrict(value: string): value is HealthMetricKey {
  const healthMetricKeys: string[] = [
    'weight',
    'bodyFatPercent',
    'leanMassKg',
    'bmi',
    'restingHR',
    'bloodPressureSystolic',
    'bloodPressureDiastolic',
    'vo2MaxEstimate',
    'hba1c',
    'fastingGlucose',
    'totalCholesterol',
    'ldlCholesterol',
    'hdlCholesterol',
    'triglycerides',
    'testosteroneTotal',
    'vitaminD',
    'gripStrength',
  ];
  return healthMetricKeys.includes(value);
}

// ============================================================================
// BATCH CONVERSION UTILITIES
// ============================================================================

/**
 * Convert an array of GoalMetricKeys to HealthMetricKeys, filtering out unmapped keys.
 */
export function goalMetricsToHealthMetrics(goalKeys: GoalMetricKey[]): HealthMetricKey[] {
  return goalKeys
    .map(goalMetricToHealthMetric)
    .filter((key): key is HealthMetricKey => key !== null);
}

/**
 * Convert an array of HealthMetricKeys to GoalMetricKeys, filtering out unmapped keys.
 */
export function healthMetricsToGoalMetrics(healthKeys: HealthMetricKey[]): GoalMetricKey[] {
  return healthKeys
    .map(healthMetricToGoalMetric)
    .filter((key): key is GoalMetricKey => key !== null);
}
