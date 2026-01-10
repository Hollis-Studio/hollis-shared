/**
 * @ai-context Health Metrics Unified Exports | centralized health metric types, utilities, and schemas
 *
 * This module provides a unified export surface for health metric functionality,
 * consolidating types and utilities that were previously scattered across:
 * - goal-metrics.ts (GOAL_METRIC_DEFINITIONS, GoalMetricKey)
 * - health-progress.ts (trends, data quality)
 * - training.ts (HealthMetricDirection, HealthMetricCategory)
 *
 * NOTE: This module uses GoalMetricKey from goal-metrics.ts for type references.
 * The health-progress.ts module has a separate HealthMetricKey type using camelCase
 * for biometric/lab data mapping. These are intentionally different types.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';
import {
    type BiometricSource,
    BiometricSourceSchema,
} from './clinical';
import {
    GOAL_METRIC_DEFINITIONS,
    GOAL_METRIC_KEYS,
    type GoalMetricKey,
    GoalMetricKeySchema,
} from './goal-metrics';
import {
    type DataQualityLevel,
    DataQualityLevelSchema,
    HEALTH_TREND,
    type HealthTrend,
    HealthTrendSchema
} from './health-progress';
import { type JournalEntryContract } from './journal';
import { type DailyNutritionLogContract } from './nutrition';
import {
    type HealthMetricCategory,
    type HealthMetricDirection,
    HealthMetricDirectionSchema,
} from './training';

// ============================================================================
// HEALTH METRIC ALIASES (Goal Metrics → Health Metrics)
// ============================================================================

/**
 * @deprecated Use GOAL_METRIC_DEFINITIONS for new code.
 * This alias exists for backward compatibility with imports expecting HEALTH_METRIC_DEFINITIONS.
 */
export const HEALTH_METRIC_DEFINITIONS = GOAL_METRIC_DEFINITIONS;

/**
 * @deprecated Use GOAL_METRIC_KEYS for new code.
 * This alias exists for backward compatibility.
 */
export const HEALTH_METRIC_KEYS = GOAL_METRIC_KEYS;

// Re-export GoalMetricKey and GoalMetricKeySchema for convenience
// (they are already exported from goal-metrics.ts which is in the barrel)

// ============================================================================
// SOURCE WEIGHTS (Data Quality Weighting)
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
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Returns the weight for a data point based on source and verification status.
 */
export function getDataPointWeight(source: BiometricSource, isVerified: boolean): number {
  const base = SOURCE_WEIGHTS[source] ?? 0.6;
  const verification = isVerified ? VERIFICATION_MULTIPLIER.verified : VERIFICATION_MULTIPLIER.unverified;
  return Math.min(1, Math.max(0, base * verification));
}

/**
 * Gets the category for a health/goal metric.
 * @param metricKey - The metric key
 * @returns The category or 'metabolic' as default
 */
export function getMetricCategory(metricKey: GoalMetricKey): HealthMetricCategory {
  const definition = GOAL_METRIC_DEFINITIONS[metricKey];
  if (!definition) return 'metabolic';
  return definition.category as HealthMetricCategory;
}

/**
 * Gets the improvement direction for a health metric.
 * @param metricKey - The metric key
 * @returns The direction ('lower_better', 'higher_better', or 'context')
 */
export function getMetricDirection(metricKey: GoalMetricKey): HealthMetricDirection {
  const definition = GOAL_METRIC_DEFINITIONS[metricKey];
  if (!definition) return 'context';
  return definition.direction;
}

/**
 * Determines the health trend based on percent change and metric direction.
 * A change of less than 3% in either direction is considered stable.
 *
 * @param metricKey - The health metric key
 * @param percentChange - The percent change (can be negative)
 * @returns The health trend
 */
export function determineTrend(metricKey: GoalMetricKey, percentChange: number | null): HealthTrend {
  if (percentChange === null) {
    return HEALTH_TREND.STABLE;
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

/**
 * Checks if a value is within the normal range for a metric.
 * Uses the normalRange from goal metric definitions if available.
 *
 * @deprecated Use isWithinClinicalRange for patient-aware range checking
 * @param _metricKey - The health metric key (unused, for interface consistency)
 * @param _value - The value to check (unused, for interface consistency)
 * @returns true if within range or no range defined
 */
export function isWithinNormalRange(_metricKey: GoalMetricKey, _value: number): boolean {
  // Goal metrics don't have normalRange, but some derived definitions might
  // Default to true if no range is defined
  return true;
}

/**
 * Gets the default reference range for a metric based on standard guidelines.
 * This is a simplified version - for full clinical ranges, use the
 * referenceRanges module with patient context.
 *
 * @param metricKey - The metric key
 * @returns Object with low/high bounds or null if not defined
 */
export function getDefaultReferenceRange(
  metricKey: GoalMetricKey
): { low: number; high: number } | null {
  // Common reference ranges based on clinical guidelines
  const ranges: Partial<Record<GoalMetricKey, { low: number; high: number }>> = {
    weight: { low: 40, high: 136 },
    body_fat_percent: { low: 8, high: 35 },
    resting_hr: { low: 60, high: 100 },
    blood_pressure_systolic: { low: 90, high: 120 },
    blood_pressure_diastolic: { low: 60, high: 80 },
    vo2_max: { low: 30, high: 60 },
    hba1c: { low: 4.0, high: 5.6 },
    fasting_glucose: { low: 70, high: 99 },
    total_cholesterol: { low: 0, high: 200 },
    ldl_cholesterol: { low: 0, high: 100 },
    hdl_cholesterol: { low: 40, high: 999 },
    triglycerides: { low: 0, high: 150 },
    vitamin_d: { low: 30, high: 100 },
    testosterone_total: { low: 200, high: 1000 },
    grip_strength: { low: 20, high: 60 },
  };

  return ranges[metricKey] ?? null;
}

/**
 * Calculate a 0-100 score for how close a value is to the desired range.
 * 100 = centered in range, ~80 at the edges, tapering to 0 as it deviates.
 *
 * @param value - The current value
 * @param rangeLow - Low end of reference range
 * @param rangeHigh - High end of reference range
 * @returns Score from 0-100
 */
export function calculateInRangeScore(
  value: number,
  rangeLow: number | null,
  rangeHigh: number | null
): number {
  if (rangeLow == null || rangeHigh == null) {
    return 0;
  }

  if (Number.isNaN(rangeLow) || Number.isNaN(rangeHigh)) {
    return 0;
  }

  const low = Math.min(rangeLow, rangeHigh);
  const high = Math.max(rangeLow, rangeHigh);
  const span = Math.max(high - low, 1);
  const mid = (low + high) / 2;

  // Inside range: score tapers from 100 at center to 80 at edges
  if (value >= low && value <= high) {
    const distanceFromCenter = Math.abs(value - mid);
    const normalized = Math.min(distanceFromCenter / (span / 2), 1);
    return Math.round((1 - normalized * 0.2) * 100);
  }

  // Outside range: penalize more aggressively with capped floor at 0
  const distanceBeyond = value < low ? low - value : value - high;
  const normalizedOutside = Math.min(distanceBeyond / span, 1.5);
  return Math.max(0, Math.round((1 - normalizedOutside) * 80));
}

// ============================================================================
// METRIC CHANGE TYPE AND SCHEMA
// ============================================================================

/**
 * Tracks change in a single health metric over a period.
 */
export interface MetricChange {
  metric: GoalMetricKey;
  unit: string;
  startValue: number | null;
  endValue: number | null;
  percentChange: number | null;
  trend: HealthTrend;
  isWithinNormalRange: boolean;
  dataConfidence?: number | null;
  inRangeScore?: number | null;
}

export const MetricChangeSchema = z.object({
  metric: GoalMetricKeySchema,
  unit: z.string().min(1),
  startValue: z.number().nullable(),
  endValue: z.number().nullable(),
  percentChange: z.number().nullable(),
  trend: HealthTrendSchema,
  isWithinNormalRange: z.boolean(),
  dataConfidence: z.number().min(0).max(1).nullable().optional(),
  inRangeScore: z.number().min(0).max(100).nullable().optional(),
});

// ============================================================================
// CONCERN AREA TYPE AND SCHEMA
// ============================================================================

/**
 * Area of concern showing which metrics have declining patients.
 */
export interface ConcernArea {
  metric: GoalMetricKey;
  patientsDeclined: number;
}

export const ConcernAreaSchema = z.object({
  metric: GoalMetricKeySchema,
  patientsDeclined: z.number().int().min(0),
});

// ============================================================================
// METRIC AGGREGATE TYPE AND SCHEMA
// ============================================================================

/**
 * Metric with average change across patients.
 */
export interface MetricAggregate {
  metric: GoalMetricKey;
  avgChange: number;
}

export const MetricAggregateSchema = z.object({
  metric: GoalMetricKeySchema,
  avgChange: z.number(),
});

// ============================================================================
// HEALTH PROGRESS TYPES AND SCHEMAS
// ============================================================================

/**
 * Point on the health improvement sparkline.
 */
export interface HealthImprovementPoint {
  date: string;
  percentChange: number;
}

export const HealthImprovementPointSchema = z.object({
  date: z.string(),
  percentChange: z.number(),
});

/**
 * Lightweight view for monthly improvement badge.
 */
export interface HealthProgressImprovement {
  periodDays: number;
  startScore: number | null;
  endScore: number | null;
  percentChange: number | null;
  points: HealthImprovementPoint[];
}

export const HealthProgressImprovementSchema = z.object({
  periodDays: z.number().int().positive(),
  startScore: z.number().nullable(),
  endScore: z.number().nullable(),
  percentChange: z.number().nullable(),
  points: z.array(HealthImprovementPointSchema),
});

/**
 * Aggregate health progress view for admin dashboard.
 */
export interface HealthProgressOverview {
  totalPatients: number;
  improving: number;
  stable: number;
  declining: number;
  avgScore: number;
  topImprovingMetrics: MetricAggregate[];
  concernAreas: ConcernArea[];
}

export const HealthProgressOverviewSchema = z.object({
  totalPatients: z.number().int().min(0),
  improving: z.number().int().min(0),
  stable: z.number().int().min(0),
  declining: z.number().int().min(0),
  avgScore: z.number().min(0).max(100),
  topImprovingMetrics: z.array(MetricAggregateSchema),
  concernAreas: z.array(ConcernAreaSchema),
});

/**
 * Historical snapshot of health progress for a user.
 */
export interface HealthProgressSnapshot {
  id: string;
  userId: string;
  calculatedAt: string;
  periodMonths: number;
  overallScore: number;
  overallTrend: HealthTrend;
  dataConfidence: number | null;
  categoryScores: Record<HealthMetricCategory, number>;
  metricChanges: MetricChange[];
}

const categoryScoreSchema = z.number().min(0).max(100);

export const HealthProgressSnapshotSchema = z.object({
  id: z.string(),
  userId: z.string(),
  calculatedAt: z.string(),
  periodMonths: z.number().int().min(1),
  overallScore: z.number().min(0).max(100),
  overallTrend: HealthTrendSchema,
  dataConfidence: z.number().min(0).max(1).nullable(),
  categoryScores: z.object({
    body_composition: categoryScoreSchema,
    cardiovascular: categoryScoreSchema,
    metabolic: categoryScoreSchema,
    hormonal: categoryScoreSchema,
    performance: categoryScoreSchema,
    hematology: categoryScoreSchema,
    inflammatory: categoryScoreSchema,
    nutritional: categoryScoreSchema,
  }),
  metricChanges: z.array(MetricChangeSchema),
});

// ============================================================================
// PATIENT HEALTH PROGRESS (Per-Patient View)
// ============================================================================

/**
 * Complete health progress report for a single patient over a time period.
 */
export interface PatientHealthProgress {
  /** Patient identifier */
  patientId: string;
  /** Start of evaluation period (ISO date) */
  periodStart: string;
  /** End of evaluation period (ISO date) */
  periodEnd: string;
  /** Overall health trend across all metrics */
  overallTrend: HealthTrend;
  /** Overall health progress score (0 to 100) */
  overallScore: number;
  /** Scores broken down by category (0 to 100 each) */
  categoryScores: Record<HealthMetricCategory, number>;
  /** Individual metric changes */
  metricChanges: MetricChange[];
  /** Data quality assessment */
  dataQuality: DataQualityLevel;
  /** Weighted average confidence across all metrics */
  overallDataConfidence?: number | null;
  /** Lightweight monthly improvement summary for UI sparklines */
  monthlyImprovement?: HealthProgressImprovement | null;
}

export const PatientHealthProgressSchema = z.object({
  patientId: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  overallTrend: HealthTrendSchema,
  overallScore: z.number().min(0).max(100),
  categoryScores: z.object({
    body_composition: categoryScoreSchema,
    cardiovascular: categoryScoreSchema,
    metabolic: categoryScoreSchema,
    hormonal: categoryScoreSchema,
    performance: categoryScoreSchema,
    hematology: categoryScoreSchema,
    inflammatory: categoryScoreSchema,
    nutritional: categoryScoreSchema,
  }),
  metricChanges: z.array(MetricChangeSchema),
  dataQuality: DataQualityLevelSchema,
  overallDataConfidence: z.number().min(0).max(1).nullable().optional(),
  monthlyImprovement: HealthProgressImprovementSchema.nullable().optional(),
});

// ============================================================================
// PATIENT CLINICAL CONTEXT
// ============================================================================

/**
 * Patient context for clinical reference range lookup.
 */
export interface PatientClinicalContext {
  /** Biological sex (male/female) */
  sex?: 'male' | 'female' | null;
  /** Age in years */
  age?: number | null;
  /** Pregnancy status */
  pregnancyStatus?: string | null;
}

export const PatientClinicalContextSchema = z.object({
  sex: z.enum(['male', 'female']).nullable().optional(),
  age: z.number().int().min(0).max(150).nullable().optional(),
  pregnancyStatus: z.string().nullable().optional(),
});

// ============================================================================
// HEALTH METRIC GOAL TYPES AND SCHEMAS
// ============================================================================

export interface RangeDerivationStep {
  step: string;
  modifier?: string;
  description?: string;
  minBefore?: number | null;
  maxBefore?: number | null;
  minAfter: number;
  maxAfter: number;
}

export interface RangeDerivationModifier {
  type: string;
  value: string;
  logicType?: string;
}

export interface RangeDerivation {
  source: string | null;
  appliedModifiers: RangeDerivationModifier[];
  steps: RangeDerivationStep[];
}

export interface HealthMetricGoalContract {
  metric: GoalMetricKey;
  targetValue: number | null;
  targetDirection: HealthMetricDirection;
  referenceRangeLow: number | null;
  referenceRangeHigh: number | null;
  defaultReferenceRangeLow: number | null;
  defaultReferenceRangeHigh: number | null;
  labReferenceRangeLow: number | null;
  labReferenceRangeHigh: number | null;
  isCustom: boolean;
  setById: string | null;
  currentValue: number | null;
  currentValueDate: string | null;
  currentValueUnit: string | null;
  needsTargetSetting: boolean;
  hasMissingRange: boolean;
  isDerivedRange: boolean;
  rangeSource: 'guideline' | 'custom' | 'derived' | 'missing' | 'dynamic-db' | 'lab';
  rangeDerivation: RangeDerivation | null;
}

export const RangeDerivationStepSchema = z.object({
  step: z.string(),
  modifier: z.string().optional(),
  description: z.string().optional(),
  minBefore: z.number().nullable().optional(),
  maxBefore: z.number().nullable().optional(),
  minAfter: z.number(),
  maxAfter: z.number(),
});

export const RangeDerivationModifierSchema = z.object({
  type: z.string(),
  value: z.string(),
  logicType: z.string().optional(),
});

export const RangeDerivationSchema = z.object({
  source: z.string().nullable(),
  appliedModifiers: z.array(RangeDerivationModifierSchema),
  steps: z.array(RangeDerivationStepSchema),
});

export const HealthMetricGoalSchema = z.object({
  metric: GoalMetricKeySchema,
  targetValue: z.number().nullable(),
  targetDirection: HealthMetricDirectionSchema,
  referenceRangeLow: z.number().nullable(),
  referenceRangeHigh: z.number().nullable(),
  defaultReferenceRangeLow: z.number().nullable(),
  defaultReferenceRangeHigh: z.number().nullable(),
  labReferenceRangeLow: z.number().nullable(),
  labReferenceRangeHigh: z.number().nullable(),
  isCustom: z.boolean(),
  setById: z.string().nullable(),
  currentValue: z.number().nullable(),
  currentValueDate: z.string().nullable(),
  currentValueUnit: z.string().nullable(),
  needsTargetSetting: z.boolean(),
  hasMissingRange: z.boolean(),
  isDerivedRange: z.boolean(),
  rangeSource: z.enum(['guideline', 'custom', 'derived', 'missing', 'dynamic-db', 'lab']),
  rangeDerivation: RangeDerivationSchema.nullable(),
});

export const HealthMetricGoalUpsertSchema = z.object({
  targetValue: z.number().optional().nullable(),
  targetDirection: HealthMetricDirectionSchema.optional(),
  referenceRangeLow: z.number().optional().nullable(),
  referenceRangeHigh: z.number().optional().nullable(),
});

export type HealthMetricGoalUpsert = z.infer<typeof HealthMetricGoalUpsertSchema>;

// ============================================================================
// WEARABLES DATA CONTRACT
// ============================================================================

export interface WearablesDataContract {
  steps?: number;
  sleepHours?: number;
  restingHeartRate?: number;
  activeCalories?: number;
  flightsClimbed?: number;
  weight?: number;
  heartRateVariability?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  source?: BiometricSource;
  isVerified: boolean;
  syncedAt?: string;
  rawSources?: {
    source: BiometricSource;
    data?: Record<string, unknown> | null;
    isVerified: boolean;
  }[];
}

export const WearablesDataSchema = z.object({
  steps: z.number().optional(),
  sleepHours: z.number().optional(),
  restingHeartRate: z.number().optional(),
  activeCalories: z.number().optional(),
  flightsClimbed: z.number().optional(),
  weight: z.number().optional(),
  heartRateVariability: z.number().optional(),
  oxygenSaturation: z.number().optional(),
  respiratoryRate: z.number().optional(),
  source: BiometricSourceSchema.optional(),
  isVerified: z.boolean(),
  syncedAt: z.string().optional(),
  rawSources: z.array(z.object({
    source: BiometricSourceSchema,
    data: z.record(z.string(), z.unknown()).nullable().optional(),
    isVerified: z.boolean(),
  })).optional(),
});

// ============================================================================
// DAILY SUMMARY CONTRACT
// ============================================================================

/**
 * Daily summary aggregating wearables, nutrition, journal, metrics, and documents.
 * This is a simplified contract - full implementation uses domain-specific schemas.
 */
export interface DailySummaryContract {
  date: string;
  userId: string;
  wearables: WearablesDataContract;
  nutrition: DailyNutritionLogContract;
  journal?: JournalEntryContract;
  metrics?: Record<string, unknown>;
  documents: Record<string, unknown>[];
}

export const DailySummarySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  userId: z.string(),
  wearables: WearablesDataSchema,
  nutrition: z.record(z.string(), z.unknown()),
  journal: z.record(z.string(), z.unknown()).optional(),
  metrics: z.record(z.string(), z.unknown()).optional(),
  documents: z.array(z.record(z.string(), z.unknown())),
});

// ============================================================================
// HEALTH METRIC LABELS (derived from goal metrics)
// ============================================================================

export const HEALTH_METRIC_LABELS: Record<GoalMetricKey, string> = Object.fromEntries(
  GOAL_METRIC_KEYS.map((key) => [key, GOAL_METRIC_DEFINITIONS[key]?.label ?? key])
) as Record<GoalMetricKey, string>;
