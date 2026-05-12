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
import { BiometricSourceSchema } from "./clinical.js";
import { dailyMetricsSchema } from "./daily-metrics.js";
import { createPaginatedListSchema } from "./pagination.js";
import { DataQualityLevelSchema, HealthMetricKeySchema, HealthTrendSchema, } from "./health-progress.js";
import { journalEntrySchema } from "./journal.js";
import { MetricDefinitionSummarySchema } from "./metric-definition.js";
import { DailyNutritionLogSchema } from "./nutrition.js";
import { HealthMetricDirectionSchema } from "./training.js";
import { BiologicalSexSchema } from "./user.js";
// ============================================================================
// SOURCE WEIGHTS & DATA POINT WEIGHTING (canonical: health-progress.ts)
// ============================================================================
export { getDataPointWeight, SOURCE_WEIGHTS, VERIFICATION_MULTIPLIER } from "./health-progress.js";
/**
 * @deprecated Post-migration, reference ranges live in MetricDefinition records.
 * Use metricDefinitionLookup.getReferenceRanges(code) instead.
 * @returns null (no static ranges available)
 */
export function getDefaultReferenceRange(_metricKey) {
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
export function calculateInRangeScore(value, rangeLow, rangeHigh) {
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
    if (normalizedOutside >= 1)
        return 0;
    return Math.max(0, Math.round(80 * (1 - normalizedOutside)));
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
export const ConcernAreaSchema = z.object({
    metric: z.string().min(1),
    patientsDeclined: z.number().int().min(0),
});
export const MetricAggregateSchema = z.object({
    metric: z.string().min(1),
    avgChange: z.number(),
});
export const HealthImprovementPointSchema = z.object({
    date: z.string(),
    percentChange: z.number(),
    /** Raw overall health score (0-100) at this point in time */
    score: z.number().min(0).max(100),
});
export const HealthProgressImprovementSchema = z.object({
    periodDays: z.number().int().positive(),
    startScore: z.number().nullable(),
    endScore: z.number().nullable(),
    percentChange: z.number().nullable(),
    points: z.array(HealthImprovementPointSchema),
});
export const HealthProgressOverviewSchema = z.object({
    totalPatients: z.number().int().min(0),
    improving: z.number().int().min(0),
    stable: z.number().int().min(0),
    declining: z.number().int().min(0),
    avgScore: z.number().min(0).max(100),
    topImprovingMetrics: z.array(MetricAggregateSchema),
    concernAreas: z.array(ConcernAreaSchema),
});
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
export const PatientClinicalContextSchema = z.object({
    sex: BiologicalSexSchema.nullable().optional(),
    age: z.number().int().min(0).max(150).nullable().optional(),
    pregnancyStatus: z.string().nullable().optional(),
});
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
export const HealthMetricGoalUpsertSchema = z.object({
    targetValue: z.number().optional().nullable(),
    targetDirection: HealthMetricDirectionSchema.optional(),
    referenceRangeLow: z.number().optional().nullable(),
    referenceRangeHigh: z.number().optional().nullable(),
});
/**
 * Canonical paginated health goals list payload: { data, pagination }
 */
export const healthGoalsListResponseSchema = createPaginatedListSchema(HealthMetricGoalSchema);
// ============================================================================
// WEARABLES DATA CONTRACT
// ============================================================================
export const WearablesDataSchema = z.object({
    steps: z.number().int().optional(),
    sleepHours: z.number().optional(),
    deepSleepPercent: z.number().nullable().optional(),
    lightSleepPercent: z.number().nullable().optional(),
    remSleepPercent: z.number().nullable().optional(),
    awakeMinutes: z.number().int().nullable().optional(),
    restingHeartRate: z.number().int().optional(),
    activeCalories: z.number().int().optional(),
    flightsClimbed: z.number().int().optional(),
    weight: z.number().optional(),
    heartRateVariability: z.number().optional(), // RMSSD — from Android Health Connect
    /** SDNN from Apple HealthKit (HKQuantityTypeIdentifierHeartRateVariabilitySDNN). iOS only. */
    hrvSdnn: z.number().min(0).max(300).optional(),
    oxygenSaturation: z.number().optional(),
    respiratoryRate: z.number().optional(),
    source: BiometricSourceSchema.optional(),
    isVerified: z.boolean(),
    syncedAt: z.string().optional(),
    rawSources: z
        .array(z.object({
        source: BiometricSourceSchema,
        data: z
            .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
            .nullable()
            .optional(),
        isVerified: z.boolean(),
    }))
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
    documents: z.array(z.object({
        id: z.string(),
        category: z.string(),
        title: z.string().optional(),
        uploadedAt: z.string().optional(),
    })),
});
// ============================================================================
// HEALTH METRICS SUMMARY CONTRACT (unified biometrics + goals view)
// ============================================================================
/**
 * Unified summary row for a single tracked metric.
 * Merges MetricDefinition metadata, the latest reading, optional goal data,
 * and a simple two-point trend into one response item for admin UI consumption.
 *
 * Used by: GET /api/admin/patients/:userId/health-metrics/summary
 */
export const HealthMetricSummarySchema = z.object({
    /** MetricDefinition.code — stable identifier for this metric */
    metricCode: z.string(),
    /** MetricDefinition.id — UUID FK required by POST /api/biometrics body */
    metricDefinitionId: z.string().uuid(),
    /** Human-readable display name from MetricDefinition */
    displayName: z.string(),
    /** Canonical storage unit from MetricDefinition */
    primaryUnit: z.string(),
    /** Clinical grouping (e.g. "body_composition", "cardiovascular") — nullable */
    healthCategory: z.string().nullable(),
    /** Storage category: BIOMETRIC | LAB | COMPUTED */
    category: z.string(),
    /** Whether this metric participates in the goal system */
    goalEligible: z.boolean(),
    /** Optimization direction for trend interpretation */
    trendDirection: z
        .enum(["higher_better", "lower_better", "context"])
        .nullable(),
    // ---- Latest reading ----
    /** Most recent numeric value, null when no data exists */
    currentValue: z.number().nullable(),
    /** ISO date string of the most recent reading */
    currentValueDate: z.string().nullable(),
    /** Unit of the most recent reading */
    currentValueUnit: z.string().nullable(),
    /** Source of the most recent reading (e.g. "LAB_REPORT", "USER_LOG") */
    currentValueSource: z.string().nullable(),
    // ---- Goal data (null for non-goal-eligible metrics) ----
    /** Full goal contract when goalEligible is true, otherwise null */
    goalData: HealthMetricGoalSchema.nullable(),
    // ---- Simple two-point trend ----
    /** Direction of change computed from the last two readings */
    recentTrend: z.enum(["improving", "stable", "declining"]).nullable(),
    /** Percent change between the two most recent readings */
    recentChangePercent: z.number().nullable(),
});
//# sourceMappingURL=health-metrics.js.map