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
import { BiometricSourceSchema } from "./clinical";
import { dailyMetricsSchema } from "./daily-metrics";
import { createPaginatedListSchema } from "./pagination";
import {
    DataQualityLevelSchema,
    HealthMetricKeySchema,
    HealthTrendSchema,
} from "./health-progress";
import { journalEntrySchema } from "./journal";
import { MetricDefinitionSummarySchema } from "./metric-definition";
import { DailyNutritionLogSchema } from "./nutrition";
import { HealthMetricDirectionSchema } from "./training";
import { BiologicalSexSchema } from "./user";

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
export type MetricChange = z.infer<typeof MetricChangeSchema>;

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
export type ConcernArea = z.infer<typeof ConcernAreaSchema>;

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
export type MetricAggregate = z.infer<typeof MetricAggregateSchema>;

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
export type HealthImprovementPoint = z.infer<
  typeof HealthImprovementPointSchema
>;

export const HealthImprovementPointSchema = z.object({
  date: z.string(),
  percentChange: z.number(),
});

/**
 * Lightweight view for monthly improvement badge.
 */
export type HealthProgressImprovement = z.infer<
  typeof HealthProgressImprovementSchema
>;

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
export type HealthProgressOverview = z.infer<
  typeof HealthProgressOverviewSchema
>;

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
export type HealthProgressSnapshot = z.infer<
  typeof HealthProgressSnapshotSchema
>;

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
export type PatientHealthProgress = z.infer<typeof PatientHealthProgressSchema>;

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
export type PatientClinicalContext = z.infer<
  typeof PatientClinicalContextSchema
>;

export const PatientClinicalContextSchema = z.object({
  sex: BiologicalSexSchema.nullable().optional(),
  age: z.number().int().min(0).max(150).nullable().optional(),
  pregnancyStatus: z.string().nullable().optional(),
});

// ============================================================================
// HEALTH METRIC GOAL TYPES AND SCHEMAS
// ============================================================================

export type RangeDerivationStep = z.infer<typeof RangeDerivationStepSchema>;

export type RangeDerivationModifier = z.infer<
  typeof RangeDerivationModifierSchema
>;

export type RangeDerivation = z.infer<typeof RangeDerivationSchema>;

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
  metric: HealthMetricKeySchema,
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
export type HealthMetricGoal = z.infer<typeof HealthMetricGoalSchema>;
/** Health metric goal with clinician overrides, guideline defaults, and range derivation. */
export type HealthMetricGoalContract = z.infer<typeof HealthMetricGoalSchema>;

export const HealthMetricGoalUpsertSchema = z.object({
  targetValue: z.number().optional().nullable(),
  targetDirection: HealthMetricDirectionSchema.optional(),
  referenceRangeLow: z.number().optional().nullable(),
  referenceRangeHigh: z.number().optional().nullable(),
});

export type HealthMetricGoalUpsert = z.infer<
  typeof HealthMetricGoalUpsertSchema
>;

/**
 * Canonical paginated health goals list payload: { data, pagination }
 */
export const healthGoalsListResponseSchema = createPaginatedListSchema(
  HealthMetricGoalSchema,
);

export type HealthGoalsListResponse = z.infer<
  typeof healthGoalsListResponseSchema
>;

// ============================================================================
// WEARABLES DATA CONTRACT
// ============================================================================

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
export type WearablesData = z.infer<typeof WearablesDataSchema>;
export type WearablesDataContract = z.infer<typeof WearablesDataSchema>;

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
