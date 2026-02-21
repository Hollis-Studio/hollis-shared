/**
 * @ai-context Health Metrics Unified Exports | centralized health metric types, utilities, and schemas
 *
 * This module provides a unified export surface for health metric functionality,
 * including contract types for health progress, goals, wearables, and daily summaries.
 *
 * NOTE: GoalMetricKey and the static GOAL_METRIC_DEFINITIONS registry were removed in
 * Phase 6 of the Unified MetricDefinition Migration. Metric identity is now authoritative
 * in the MetricDefinition database table. All metric fields that previously used
 * GoalMetricKey now use string.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from "zod";
import { type BiometricSource, BiometricSourceSchema } from "./clinical";
import { dailyMetricsSchema } from "./daily-metrics";
import {
  type DataQualityLevel,
  DataQualityLevelSchema,
  type HealthTrend,
  HealthTrendSchema,
} from "./health-progress";
import { journalEntrySchema } from "./journal";
import {
  type MetricDefinitionSummary,
  MetricDefinitionSummarySchema,
} from "./metric-definition";
import { DailyNutritionLogSchema } from "./nutrition";
import {
  type HealthMetricCategory,
  type HealthMetricDirection,
  HealthMetricDirectionSchema,
} from "./training";
import { type BiologicalSex, BiologicalSexSchema } from "./user";

// ============================================================================
// SOURCE WEIGHTS & DATA POINT WEIGHTING (canonical: health-progress.ts)
// ============================================================================

export {
  getDataPointWeight,
  SOURCE_WEIGHTS,
  VERIFICATION_MULTIPLIER
} from "./health-progress";

/**
 * @deprecated Post-migration, reference ranges live in MetricDefinition records.
 * Use metricDefinitionLookup.getReferenceRanges(code) instead.
 * @returns null (no static ranges available)
 */
export function getDefaultReferenceRange(
  _metricKey: string,
): { low: number; high: number } | null {
  return null;
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
  rangeHigh: number | null,
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

  // Outside range: continues from 80 at the edge, tapering to 0
  // Uses the same 80-point ceiling as the inside edge for continuity
  const distanceBeyond = value < low ? low - value : value - high;
  const normalizedOutside = distanceBeyond / span;
  if (normalizedOutside >= 1) return 0;
  return Math.max(0, Math.round(80 * (1 - normalizedOutside)));
}

// ============================================================================
// METRIC CHANGE TYPE AND SCHEMA
// ============================================================================

/**
 * Tracks change in a single health metric over a period.
 * The metric field is a string (MetricDefinition.code) post-migration.
 */
export interface MetricChange {
  /** MetricDefinition code string (previously GoalMetricKey) */
  metric: string;
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
  metric: z.string().min(1),
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
  /** MetricDefinition code string (previously GoalMetricKey) */
  metric: string;
  patientsDeclined: number;
}

export const ConcernAreaSchema = z.object({
  metric: z.string().min(1),
  patientsDeclined: z.number().int().min(0),
});

// ============================================================================
// METRIC AGGREGATE TYPE AND SCHEMA
// ============================================================================

/**
 * Metric with average change across patients.
 */
export interface MetricAggregate {
  /** MetricDefinition code string (previously GoalMetricKey) */
  metric: string;
  avgChange: number;
}

export const MetricAggregateSchema = z.object({
  metric: z.string().min(1),
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
  /** Biological sex */
  sex?: BiologicalSex | null;
  /** Age in years */
  age?: number | null;
  /** Pregnancy status */
  pregnancyStatus?: string | null;
}

export const PatientClinicalContextSchema = z.object({
  sex: BiologicalSexSchema.nullable().optional(),
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
  /** MetricDefinition code string (previously GoalMetricKey) */
  metric: string;
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
  /** True if the reference range was adjusted for pregnancy (trimester-specific) */
  isPregnancyAdjusted: boolean;
  rangeSource:
    | "guideline"
    | "custom"
    | "derived"
    | "missing"
    | "dynamic-db"
    | "lab";
  rangeDerivation: RangeDerivation | null;
  /** MetricDefinition metadata (server-enriched) */
  metricDefinition?: MetricDefinitionSummary;
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
  metric: z.string().min(1),
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
  isPregnancyAdjusted: z.boolean(),
  rangeSource: z.enum([
    "guideline",
    "custom",
    "derived",
    "missing",
    "dynamic-db",
    "lab",
  ]),
  rangeDerivation: RangeDerivationSchema.nullable(),
  metricDefinition: MetricDefinitionSummarySchema.optional(),
});

export const HealthMetricGoalUpsertSchema = z.object({
  targetValue: z.number().optional().nullable(),
  targetDirection: HealthMetricDirectionSchema.optional(),
  referenceRangeLow: z.number().optional().nullable(),
  referenceRangeHigh: z.number().optional().nullable(),
});

export type HealthMetricGoalUpsert = z.infer<
  typeof HealthMetricGoalUpsertSchema
>;

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
    data?: Record<string, string | number | boolean | null> | null;
    isVerified: boolean;
  }[];
}

export const WearablesDataSchema = z.object({
  steps: z.number().int().optional(),
  sleepHours: z.number().optional(),
  restingHeartRate: z.number().int().optional(),
  activeCalories: z.number().int().optional(),
  flightsClimbed: z.number().int().optional(),
  weight: z.number().optional(),
  heartRateVariability: z.number().optional(),
  oxygenSaturation: z.number().optional(),
  respiratoryRate: z.number().optional(),
  source: BiometricSourceSchema.optional(),
  isVerified: z.boolean(),
  syncedAt: z.string().optional(),
  rawSources: z
    .array(
      z.object({
        source: BiometricSourceSchema,
        data: z
          .record(
            z.string(),
            z.union([z.string(), z.number(), z.boolean(), z.null()]),
          )
          .nullable()
          .optional(),
        isVerified: z.boolean(),
      }),
    )
    .optional(),
});

// ============================================================================
// DAILY SUMMARY CONTRACT
// ============================================================================

/**
 * Daily summary aggregating wearables, nutrition, journal, metrics, and documents.
 */
export const DailySummarySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  userId: z.string(),
  wearables: WearablesDataSchema,
  nutrition: DailyNutritionLogSchema,
  journal: journalEntrySchema.optional(),
  metrics: dailyMetricsSchema.optional(),
  documents: z.array(
    z.object({
      id: z.string(),
      category: z.string(),
      title: z.string().optional(),
      uploadedAt: z.string().optional(),
    }),
  ),
});

export type DailySummaryContract = z.infer<typeof DailySummarySchema>;
