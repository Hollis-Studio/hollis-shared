/**
 * @ai-context Goal Metrics Registry | Canonical goal metric keys for validation
 *
 * This module defines the canonical set of valid goal metric keys used for
 * training strategy goal tracking. These keys MUST be used by AI systems
 * when generating strategy goals.
 *
 * IMPORTANT: This is the single source of truth for valid goal metric keys.
 * Any AI-generated goalMetric value MUST be one of these keys.
 *
 * deps: zod, ./training | consumers: shared/contracts/ai, server/src/services/ai, web-admin
 */

import { z } from 'zod';
import {
    type GoalCategory,
    type GoalDataSource,
    type HealthMetricDirection,
} from './training';

// ============================================================================
// GOAL METRIC KEYS (Canonical Registry)
// ============================================================================

/**
 * All valid goal metric keys.
 * 
 * Convention: snake_case for consistency with existing data.
 * Migration to camelCase planned but legacy support required.
 */
export const GOAL_METRIC_KEYS = [
  // Body Composition
  'weight',
  'body_fat_percent',
  'lean_mass',
  
  // Cardiovascular
  'resting_hr',
  'blood_pressure_systolic',
  'blood_pressure_diastolic',
  'vo2_max',
  
  // Metabolic (Lab-sourced)
  'hba1c',
  'fasting_glucose',
  'total_cholesterol',
  'ldl_cholesterol',
  'hdl_cholesterol',
  'triglycerides',
  'vitamin_d',
  
  // Hormonal (Lab-sourced)
  'testosterone_total',
  
  // Performance (Biometric/Manual)
  'grip_strength',
  
  // Fitness (Exercise Log-sourced)
  'squat_1rm',
  'bench_1rm',
  'deadlift_1rm',
  'overhead_press_1rm',
  'pull_up_max',
  'mile_time',
] as const;

export type GoalMetricKey = (typeof GOAL_METRIC_KEYS)[number];

/**
 * Zod schema for validating goal metric keys.
 * Use this in AI validation schemas instead of z.string().
 */
export const GoalMetricKeySchema = z.enum(GOAL_METRIC_KEYS, {
  errorMap: () => ({
    message: `goalMetric must be one of: ${GOAL_METRIC_KEYS.join(', ')}`,
  }),
});

// ============================================================================
// GOAL METRIC DEFINITIONS
// ============================================================================

/**
 * Definition for a goal metric, including display info and data source.
 */
export interface GoalMetricDefinition {
  /** Human-readable label for display */
  label: string;
  /** Unit of measurement */
  unit: string;
  /** Improvement direction */
  direction: HealthMetricDirection;
  /** Goal category for grouping */
  category: GoalCategory;
  /** Where to pull current value from */
  dataSource: GoalDataSource;
  /** Key to query from data source (e.g., 'glucose_fasting', 'weight') */
  dataKey: string;
}

/**
 * Central registry of all goal metric definitions.
 * This is the single source of truth for goal metric metadata.
 * Uses Record<string, ...> to allow dynamic string indexing.
 */
export const GOAL_METRIC_DEFINITIONS: Record<string, GoalMetricDefinition> = {
  // -------------------------------------------------------------------------
  // Body Composition (from biometrics)
  // -------------------------------------------------------------------------
  weight: {
    label: 'Body Weight',
    unit: 'lbs',
    direction: 'context',
    category: 'body_composition',
    dataSource: 'biometric',
    dataKey: 'Weight',
  },
  body_fat_percent: {
    label: 'Body Fat Percentage',
    unit: '%',
    direction: 'lower_better',
    category: 'body_composition',
    dataSource: 'biometric',
    dataKey: 'BodyFatPercentage',
  },
  lean_mass: {
    label: 'Lean Body Mass',
    unit: 'lbs',
    direction: 'higher_better',
    category: 'body_composition',
    dataSource: 'biometric',
    dataKey: 'MuscleMassKg',
  },

  // -------------------------------------------------------------------------
  // Cardiovascular (from biometrics)
  // -------------------------------------------------------------------------
  resting_hr: {
    label: 'Resting Heart Rate',
    unit: 'bpm',
    direction: 'lower_better',
    category: 'cardiovascular',
    dataSource: 'biometric',
    dataKey: 'RestingHeartRate',
  },
  blood_pressure_systolic: {
    label: 'Blood Pressure (Systolic)',
    unit: 'mmHg',
    direction: 'lower_better',
    category: 'cardiovascular',
    dataSource: 'biometric',
    dataKey: 'BloodPressureSystolic',
  },
  blood_pressure_diastolic: {
    label: 'Blood Pressure (Diastolic)',
    unit: 'mmHg',
    direction: 'lower_better',
    category: 'cardiovascular',
    dataSource: 'biometric',
    dataKey: 'BloodPressureDiastolic',
  },
  vo2_max: {
    label: 'VO2 Max Estimate',
    unit: 'ml/kg/min',
    direction: 'higher_better',
    category: 'cardiovascular',
    dataSource: 'biometric',
    dataKey: 'VO2Max',
  },

  // -------------------------------------------------------------------------
  // Metabolic (from labs)
  // -------------------------------------------------------------------------
  hba1c: {
    label: 'Hemoglobin A1C',
    unit: '%',
    direction: 'lower_better',
    category: 'metabolic',
    dataSource: 'lab',
    dataKey: 'hba1c',
  },
  fasting_glucose: {
    label: 'Fasting Blood Glucose',
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    dataSource: 'lab',
    dataKey: 'glucose_fasting',
  },
  total_cholesterol: {
    label: 'Total Cholesterol',
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    dataSource: 'lab',
    dataKey: 'totalCholesterol',
  },
  ldl_cholesterol: {
    label: 'LDL Cholesterol',
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    dataSource: 'lab',
    dataKey: 'ldlCholesterol',
  },
  hdl_cholesterol: {
    label: 'HDL Cholesterol',
    unit: 'mg/dL',
    direction: 'higher_better',
    category: 'metabolic',
    dataSource: 'lab',
    dataKey: 'hdlCholesterol',
  },
  triglycerides: {
    label: 'Triglycerides',
    unit: 'mg/dL',
    direction: 'lower_better',
    category: 'metabolic',
    dataSource: 'lab',
    dataKey: 'triglycerides',
  },
  vitamin_d: {
    label: 'Vitamin D',
    unit: 'ng/mL',
    direction: 'higher_better',
    category: 'metabolic',
    dataSource: 'lab',
    dataKey: 'vitaminD',
  },

  // -------------------------------------------------------------------------
  // Hormonal (from labs)
  // -------------------------------------------------------------------------
  testosterone_total: {
    label: 'Total Testosterone',
    unit: 'ng/dL',
    direction: 'context',
    category: 'hormonal',
    dataSource: 'lab',
    dataKey: 'testosteroneTotal',
  },

  // -------------------------------------------------------------------------
  // Performance (from biometrics/manual)
  // -------------------------------------------------------------------------
  grip_strength: {
    label: 'Grip Strength',
    unit: 'kg',
    direction: 'higher_better',
    category: 'performance',
    dataSource: 'manual',
    dataKey: 'gripStrength',
  },

  // -------------------------------------------------------------------------
  // Fitness (from exercise_log)
  // -------------------------------------------------------------------------
  squat_1rm: {
    label: 'Squat 1RM',
    unit: 'lbs',
    direction: 'higher_better',
    category: 'fitness',
    dataSource: 'exercise_log',
    dataKey: 'estimated1RM',
  },
  bench_1rm: {
    label: 'Bench Press 1RM',
    unit: 'lbs',
    direction: 'higher_better',
    category: 'fitness',
    dataSource: 'exercise_log',
    dataKey: 'estimated1RM',
  },
  deadlift_1rm: {
    label: 'Deadlift 1RM',
    unit: 'lbs',
    direction: 'higher_better',
    category: 'fitness',
    dataSource: 'exercise_log',
    dataKey: 'estimated1RM',
  },
  overhead_press_1rm: {
    label: 'Overhead Press 1RM',
    unit: 'lbs',
    direction: 'higher_better',
    category: 'fitness',
    dataSource: 'exercise_log',
    dataKey: 'estimated1RM',
  },
  pull_up_max: {
    label: 'Max Pull-ups',
    unit: 'reps',
    direction: 'higher_better',
    category: 'fitness',
    dataSource: 'exercise_log',
    dataKey: 'estimated1RM',
  },
  mile_time: {
    label: 'Mile Run Time',
    unit: 'minutes',
    direction: 'lower_better',
    category: 'fitness',
    dataSource: 'exercise_log',
    dataKey: 'bestDuration',
  },
};

/**
 * Get the definition for a goal metric key.
 */
export function getGoalMetricDefinition(key: GoalMetricKey): GoalMetricDefinition {
  return GOAL_METRIC_DEFINITIONS[key];
}

// ============================================================================
// GOAL METRIC CONSTANTS
// ============================================================================

/** Centralized goal metric key constants for equality checks */
export const GOAL_METRIC = {
  // Body Composition
  WEIGHT: 'weight' as GoalMetricKey,
  BODY_FAT_PERCENT: 'body_fat_percent' as GoalMetricKey,
  LEAN_MASS: 'lean_mass' as GoalMetricKey,
  
  // Cardiovascular
  RESTING_HR: 'resting_hr' as GoalMetricKey,
  BLOOD_PRESSURE_SYSTOLIC: 'blood_pressure_systolic' as GoalMetricKey,
  BLOOD_PRESSURE_DIASTOLIC: 'blood_pressure_diastolic' as GoalMetricKey,
  VO2_MAX: 'vo2_max' as GoalMetricKey,
  
  // Metabolic
  HBA1C: 'hba1c' as GoalMetricKey,
  FASTING_GLUCOSE: 'fasting_glucose' as GoalMetricKey,
  TOTAL_CHOLESTEROL: 'total_cholesterol' as GoalMetricKey,
  LDL_CHOLESTEROL: 'ldl_cholesterol' as GoalMetricKey,
  HDL_CHOLESTEROL: 'hdl_cholesterol' as GoalMetricKey,
  TRIGLYCERIDES: 'triglycerides' as GoalMetricKey,
  VITAMIN_D: 'vitamin_d' as GoalMetricKey,
  
  // Hormonal
  TESTOSTERONE_TOTAL: 'testosterone_total' as GoalMetricKey,
  
  // Performance
  GRIP_STRENGTH: 'grip_strength' as GoalMetricKey,
  
  // Fitness
  SQUAT_1RM: 'squat_1rm' as GoalMetricKey,
  BENCH_1RM: 'bench_1rm' as GoalMetricKey,
  DEADLIFT_1RM: 'deadlift_1rm' as GoalMetricKey,
  OVERHEAD_PRESS_1RM: 'overhead_press_1rm' as GoalMetricKey,
  PULL_UP_MAX: 'pull_up_max' as GoalMetricKey,
  MILE_TIME: 'mile_time' as GoalMetricKey,
} as const;

/**
 * Human-readable labels for goal metrics
 */
export const GOAL_METRIC_LABELS: Record<GoalMetricKey, string> = {
  weight: 'Body Weight',
  body_fat_percent: 'Body Fat Percentage',
  lean_mass: 'Lean Body Mass',
  resting_hr: 'Resting Heart Rate',
  blood_pressure_systolic: 'Blood Pressure (Systolic)',
  blood_pressure_diastolic: 'Blood Pressure (Diastolic)',
  vo2_max: 'VO2 Max Estimate',
  hba1c: 'Hemoglobin A1C',
  fasting_glucose: 'Fasting Blood Glucose',
  total_cholesterol: 'Total Cholesterol',
  ldl_cholesterol: 'LDL Cholesterol',
  hdl_cholesterol: 'HDL Cholesterol',
  triglycerides: 'Triglycerides',
  vitamin_d: 'Vitamin D',
  testosterone_total: 'Total Testosterone',
  grip_strength: 'Grip Strength',
  squat_1rm: 'Squat 1RM',
  bench_1rm: 'Bench Press 1RM',
  deadlift_1rm: 'Deadlift 1RM',
  overhead_press_1rm: 'Overhead Press 1RM',
  pull_up_max: 'Max Pull-ups',
  mile_time: 'Mile Run Time',
};

/**
 * Check if a string is a valid goal metric key
 */
export function isGoalMetricKey(value: string): value is GoalMetricKey {
  return (GOAL_METRIC_KEYS as readonly string[]).includes(value);
}

/**
 * Get goal metric label by key
 */
export function getGoalMetricLabel(key: GoalMetricKey): string {
  return GOAL_METRIC_LABELS[key];
}

// ============================================================================
// LEGACY ALIASES (Migration Support)
// ============================================================================

/**
 * Legacy aliases for goal metric keys.
 * Maps alternative formats to canonical snake_case keys.
 */
export const GOAL_METRIC_KEY_ALIASES: Record<string, GoalMetricKey> = {
  // camelCase variants
  'bodyFatPercent': 'body_fat_percent',
  'leanMass': 'lean_mass',
  'restingHr': 'resting_hr',
  'bloodPressureSystolic': 'blood_pressure_systolic',
  'bloodPressureDiastolic': 'blood_pressure_diastolic',
  'vo2Max': 'vo2_max',
  'fastingGlucose': 'fasting_glucose',
  'totalCholesterol': 'total_cholesterol',
  'ldlCholesterol': 'ldl_cholesterol',
  'hdlCholesterol': 'hdl_cholesterol',
  'vitaminD': 'vitamin_d',
  'testosteroneTotal': 'testosterone_total',
  'gripStrength': 'grip_strength',
  'squat1rm': 'squat_1rm',
  'bench1rm': 'bench_1rm',
  'deadlift1rm': 'deadlift_1rm',
  'overheadPress1rm': 'overhead_press_1rm',
  'pullUpMax': 'pull_up_max',
  'mileTime': 'mile_time',
};

/**
 * Normalizes a goal metric key to its canonical form.
 * Handles both canonical keys and legacy aliases.
 */
export function normalizeGoalMetricKey(key: string): GoalMetricKey | undefined {
  if (isGoalMetricKey(key)) return key;
  return GOAL_METRIC_KEY_ALIASES[key];
}
