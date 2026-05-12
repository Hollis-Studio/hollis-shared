/**
 * @ai-context Lab domain contracts | lab result statuses and flags
 *
 * This module provides the canonical definitions for lab-related constants:
 * - Lab result statuses (preliminary, final, corrected, cancelled)
 * - Lab result flags (normal, low, high, critical_low, critical_high)
 *
 * IMPORTANT: All lab-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
import { LAB_ORDER_STATUS, LabOrderStatusSchema } from "./businessAnalytics.js";
// ============================================================================
// LAB RESULT STATUS (Domain Constants Pattern)
// ============================================================================
/** Tuple of valid lab result status values (source of truth). UPPER_CASE to match Prisma LabPanelStatus enum. */
export const LAB_RESULT_STATUSES = [
    "PRELIMINARY",
    "FINAL",
    "CORRECTED",
    "CANCELLED",
];
/** Zod schema for lab result status - derived from tuple */
export const LabResultStatusSchema = z.enum(LAB_RESULT_STATUSES);
/** Constant object for lab result status comparisons */
export const LAB_RESULT_STATUS = {
    PRELIMINARY: "PRELIMINARY",
    FINAL: "FINAL",
    CORRECTED: "CORRECTED",
    CANCELLED: "CANCELLED",
};
/** Human-readable labels for lab result statuses */
export const LAB_RESULT_STATUS_LABELS = {
    PRELIMINARY: "Preliminary",
    FINAL: "Final",
    CORRECTED: "Corrected",
    CANCELLED: "Cancelled",
};
/**
 * Type guard to check if a string is a valid lab result status
 */
export function isLabResultStatus(value) {
    return LAB_RESULT_STATUSES.includes(value);
}
// ============================================================================
// LAB RESULT FLAG (Domain Constants Pattern)
// ============================================================================
/** Tuple of valid lab result flag values (source of truth) */
export const LAB_RESULT_FLAGS = [
    "normal",
    "low",
    "high",
    "critical_low",
    "critical_high",
];
/** Zod schema for lab result flag - derived from tuple */
export const LabResultFlagSchema = z.enum(LAB_RESULT_FLAGS);
/** Constant object for lab result flag comparisons */
export const LAB_RESULT_FLAG = {
    NORMAL: "normal",
    LOW: "low",
    HIGH: "high",
    CRITICAL_LOW: "critical_low",
    CRITICAL_HIGH: "critical_high",
};
/** Human-readable labels for lab result flags */
export const LAB_RESULT_FLAG_LABELS = {
    normal: "Normal",
    low: "Low",
    high: "High",
    critical_low: "Critical Low",
    critical_high: "Critical High",
};
/**
 * Type guard to check if a string is a valid lab result flag
 */
export function isLabResultFlag(value) {
    return LAB_RESULT_FLAGS.includes(value);
}
// ============================================================================
// LAB MAPPING STATUS (Canonicalization)
// ============================================================================
/**
 * Tuple of valid lab mapping status values (source of truth).
 * UPPER_CASE to match Prisma LabMappingStatus enum.
 */
export const LAB_MAPPING_STATUSES = [
    "MATCHED",
    "CREATED",
    "REVIEW_NEEDED",
    "MANUAL_OVERRIDE",
];
/** Zod schema for lab mapping status */
export const LabMappingStatusSchema = z.enum(LAB_MAPPING_STATUSES);
/** Constant object for lab mapping status comparisons */
export const LAB_MAPPING_STATUS = {
    MATCHED: "MATCHED",
    CREATED: "CREATED",
    REVIEW_NEEDED: "REVIEW_NEEDED",
    MANUAL_OVERRIDE: "MANUAL_OVERRIDE",
};
/** Human-readable labels for lab mapping statuses */
export const LAB_MAPPING_STATUS_LABELS = {
    MATCHED: "Matched",
    CREATED: "Created",
    REVIEW_NEEDED: "Review Needed",
    MANUAL_OVERRIDE: "Manual Override",
};
// ============================================================================
// LAB METRIC DIRECTIONALITY
// ============================================================================
/**
 * Tuple of valid lab metric directionality values (source of truth).
 *
 * NOTE: This is a pure application-layer type — it does NOT correspond to any
 * Prisma/DB enum. The `LabMetricDirectionality` Prisma enum was dropped in
 * migration 20260228200000_sync_schema_drift and replaced by the DB-level
 * `TrendDirection` enum (`HIGHER_BETTER`, `LOWER_BETTER`, `TARGET_BETTER`).
 *
 * When writing to the `MetricDefinition.trendDirection` DB column, use
 * `mapDirectionalityToTrend()` in `labMetricDefinitionService.ts` or
 * `labCanonicalizationService.ts` to convert:
 *   HIGHER_IS_BETTER -> HIGHER_BETTER
 *   LOWER_IS_BETTER  -> LOWER_BETTER
 *   OPTIMAL_ZONE     -> TARGET_BETTER
 *   DECISION_LIMIT   -> null (binary threshold, no single direction)
 *
 * When reading `trendDirection` from the DB for API responses, `labTrendService.ts`
 * performs the reverse mapping back to `LabMetricDirectionality`.
 */
export const LAB_METRIC_DIRECTIONALITIES = [
    "LOWER_IS_BETTER",
    "HIGHER_IS_BETTER",
    "OPTIMAL_ZONE",
    "DECISION_LIMIT",
];
/** Zod schema for lab metric directionality */
export const LabMetricDirectionalitySchema = z.enum(LAB_METRIC_DIRECTIONALITIES);
/** Constant object for lab metric directionality comparisons */
export const LAB_METRIC_DIRECTIONALITY = {
    LOWER_IS_BETTER: "LOWER_IS_BETTER",
    HIGHER_IS_BETTER: "HIGHER_IS_BETTER",
    OPTIMAL_ZONE: "OPTIMAL_ZONE",
    DECISION_LIMIT: "DECISION_LIMIT",
};
/** Human-readable labels for lab metric directionality */
export const LAB_METRIC_DIRECTIONALITY_LABELS = {
    LOWER_IS_BETTER: "Lower Is Better",
    HIGHER_IS_BETTER: "Higher Is Better",
    OPTIMAL_ZONE: "Optimal Zone",
    DECISION_LIMIT: "Decision Limit",
};
// ============================================================================
// LAB CHANGE SIGNIFICANCE (Trend Gate)
// ============================================================================
/** Tuple of valid change significance values (source of truth) */
export const LAB_CHANGE_SIGNIFICANCES = [
    "not_enough_data",
    "no_meaningful_change",
    "meaningful_change",
];
/** Zod schema for change significance */
export const LabChangeSignificanceSchema = z.enum(LAB_CHANGE_SIGNIFICANCES);
/** Constant object for change significance comparisons */
export const LAB_CHANGE_SIGNIFICANCE = {
    NOT_ENOUGH_DATA: "not_enough_data",
    NO_MEANINGFUL_CHANGE: "no_meaningful_change",
    MEANINGFUL_CHANGE: "meaningful_change",
};
/** Human-readable labels for change significance */
export const LAB_CHANGE_SIGNIFICANCE_LABELS = {
    not_enough_data: "Not Enough Data",
    no_meaningful_change: "No Meaningful Change",
    meaningful_change: "Meaningful Change",
};
// ============================================================================
// LAB CLINICAL DIRECTION (Post-Significance)
// ============================================================================
/** Tuple of valid clinical direction values (source of truth) */
export const LAB_CLINICAL_DIRECTIONS = [
    "improving",
    "worsening",
    "stable",
    "not_applicable",
];
/** Zod schema for clinical direction */
export const LabClinicalDirectionSchema = z.enum(LAB_CLINICAL_DIRECTIONS);
/** Constant object for clinical direction comparisons */
export const LAB_CLINICAL_DIRECTION = {
    IMPROVING: "improving",
    WORSENING: "worsening",
    STABLE: "stable",
    NOT_APPLICABLE: "not_applicable",
};
/** Human-readable labels for clinical direction */
export const LAB_CLINICAL_DIRECTION_LABELS = {
    improving: "Improving",
    worsening: "Worsening",
    stable: "Stable",
    not_applicable: "Not Applicable",
};
// ============================================================================
// LAB RANGE STATUS (Interpretation)
// ============================================================================
/** Tuple of valid lab range status values (source of truth) */
export const LAB_RANGE_STATUSES = [
    "in_range",
    "low",
    "high",
    "not_computable",
];
/** Zod schema for lab range status */
export const LabRangeStatusSchema = z.enum(LAB_RANGE_STATUSES);
/** Constant object for lab range status comparisons */
export const LAB_RANGE_STATUS = {
    IN_RANGE: "in_range",
    LOW: "low",
    HIGH: "high",
    NOT_COMPUTABLE: "not_computable",
};
/** Human-readable labels for lab range status */
export const LAB_RANGE_STATUS_LABELS = {
    in_range: "In Range",
    low: "Low",
    high: "High",
    not_computable: "Not Computable",
};
// ============================================================================
// LAB METRIC CATEGORIES
// ============================================================================
/** Tuple of valid lab metric categories (source of truth) */
export const LAB_METRIC_CATEGORIES = [
    "body_composition",
    "cardiovascular",
    "metabolic",
    "hormonal",
    "performance",
    "hematology",
    "inflammatory",
    "nutritional",
    "uncategorized",
];
/** Zod schema for lab metric categories */
export const LabMetricCategorySchema = z.enum(LAB_METRIC_CATEGORIES);
/** Constant object for lab metric category comparisons (avoids magic strings) */
export const LAB_METRIC_CATEGORY = {
    body_composition: "body_composition",
    cardiovascular: "cardiovascular",
    metabolic: "metabolic",
    hormonal: "hormonal",
    performance: "performance",
    hematology: "hematology",
    inflammatory: "inflammatory",
    nutritional: "nutritional",
    uncategorized: "uncategorized",
};
/** Human-readable labels for lab metric categories */
export const LAB_METRIC_CATEGORY_LABELS = {
    body_composition: "Body Composition",
    cardiovascular: "Cardiovascular",
    metabolic: "Metabolic",
    hormonal: "Hormonal",
    performance: "Performance",
    hematology: "Hematology",
    inflammatory: "Inflammatory",
    nutritional: "Nutritional",
    uncategorized: "Uncategorized",
};
// ============================================================================
// METRIC APPROVAL STATUS (Governance Workflow)
// ============================================================================
/** Tuple of valid metric approval status values (source of truth) */
export const METRIC_APPROVAL_STATUSES = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "MERGED",
];
/** Zod schema for metric approval status */
export const MetricApprovalStatusSchema = z.enum(METRIC_APPROVAL_STATUSES);
/** Constant object for metric approval status comparisons */
export const METRIC_APPROVAL_STATUS = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    MERGED: "MERGED",
};
/** Human-readable labels for metric approval statuses */
export const METRIC_APPROVAL_STATUS_LABELS = {
    PENDING: "Pending Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    MERGED: "Merged",
};
/**
 * Type guard to check if a string is a valid metric approval status
 */
export function isMetricApprovalStatus(value) {
    return METRIC_APPROVAL_STATUSES.includes(value);
}
// ============================================================================
// CLINICIAN GOAL STATUS (Goal Evaluation)
// ============================================================================
/** Tuple of valid clinician goal status values (source of truth) */
export const CLINICIAN_GOAL_STATUSES = [
    "at-goal",
    "above-goal",
    "below-goal",
    "no-goal-set",
];
/** Zod schema for clinician goal status */
export const ClinicianGoalStatusSchema = z.enum(CLINICIAN_GOAL_STATUSES);
/** Constant object for clinician goal status comparisons */
export const CLINICIAN_GOAL_STATUS = {
    AT_GOAL: "at-goal",
    ABOVE_GOAL: "above-goal",
    BELOW_GOAL: "below-goal",
    NO_GOAL_SET: "no-goal-set",
};
/** Human-readable labels for clinician goal status */
export const CLINICIAN_GOAL_STATUS_LABELS = {
    "at-goal": "At Goal",
    "above-goal": "Above Goal",
    "below-goal": "Below Goal",
    "no-goal-set": "No Goal Set",
};
/** Target direction for clinician goals */
export const GOAL_TARGET_DIRECTIONS = [
    "below",
    "above",
    "at",
    "range",
];
/** Zod schema for goal target direction */
export const GoalTargetDirectionSchema = z.enum(GOAL_TARGET_DIRECTIONS);
// ============================================================================
// GOAL SOURCE (Audit/Display)
// ============================================================================
/** Tuple of valid goal source values (source of truth) */
export const GOAL_SOURCES = ["clinician", "none"];
/** Zod schema for goal source */
export const GoalSourceSchema = z.enum(GOAL_SOURCES);
/** Constant object for goal source comparisons */
export const GOAL_SOURCE = {
    CLINICIAN: "clinician",
    NONE: "none",
};
/** Human-readable labels for goal sources */
export const GOAL_SOURCE_LABELS = {
    clinician: "Clinician",
    none: "None",
};
// ============================================================================
// LAB OBSERVATION CONTRACT
// ============================================================================
/**
 * Lab observation contract - represents a single lab result observation.
 */
export const LabObservationSchema = z.object({
    id: z.string(),
    userId: z.string().nullable(),
    reportId: z.string(),
    metricDefinitionId: z.string().min(1),
    observedAt: z.string(),
    rawAnalyteName: z.string(),
    rawValueText: z.string().nullable().optional(),
    rawValueNumber: z.number().nullable().optional(),
    rawUnit: z.string().nullable().optional(),
    rawReferenceIntervalText: z.string().nullable().optional(),
    rawReferenceIntervalLow: z.number().nullable().optional(),
    rawReferenceIntervalHigh: z.number().nullable().optional(),
    rawFlag: z.string().nullable().optional(),
    canonicalValue: z.number().nullable().optional(),
    canonicalUnit: z.string().nullable().optional(),
    labReferenceIntervalLow: z.number().nullable().optional(),
    labReferenceIntervalHigh: z.number().nullable().optional(),
    labReferenceIntervalText: z.string().nullable().optional(),
    labFlag: z.string().nullable().optional(),
    mappingStatus: LabMappingStatusSchema,
    mappingConfidence: z.number().min(0).max(1).nullable().optional(),
    mappingNotes: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    extractionConfidences: z.record(z.string(), z.number()).nullable().optional(),
    extractionFragments: z.record(z.string(), z.string()).nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// ============================================================================
// LAB REPORT CONTRACT
// ============================================================================
/**
 * Lab report contract - represents a complete lab report with observations.
 */
export const LabReportSchema = z.object({
    id: z.string(),
    userId: z.string().nullable(),
    reportDate: z.string(),
    labName: z.string().nullable().optional(),
    labLocation: z.string().nullable().optional(),
    specimenType: z.string().nullable().optional(),
    orderingProvider: z.string().nullable().optional(),
    panelName: z.string().nullable().optional(),
    panelCode: z.string().nullable().optional(),
    sourceDocumentId: z.string().nullable().optional(),
    verifiedById: z.string().nullable().optional(),
    verifiedAt: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    orderStatus: LabOrderStatusSchema,
    observations: z.array(LabObservationSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// ============================================================================
// LAB TREND DATA POINT (Computed Trend Types)
// ============================================================================
/** Mapping status values used in lab trend data points (lowercase for API responses) */
export const LAB_TREND_MAPPING_STATUSES = [
    "mapped",
    "unmapped",
    "ambiguous",
];
/** Zod schema for lab trend mapping status */
export const LabTrendMappingStatusSchema = z.enum(LAB_TREND_MAPPING_STATUSES);
/** Zod schema for a single lab trend data point */
export const LabTrendDataPointSchema = z.object({
    observationId: z.string(),
    observedAt: z.string(),
    canonicalValue: z.number().nullable(),
    canonicalUnit: z.string().nullable(),
    labReferenceIntervalLow: z.number().nullable(),
    labReferenceIntervalHigh: z.number().nullable(),
    labReferenceIntervalText: z.string().nullable(),
    mappingStatus: LabTrendMappingStatusSchema,
});
// ============================================================================
// LAB METRIC TREND CONTRACT (Computed Trend Response)
// ============================================================================
/** Zod schema for the lab metric trend contract (per-metric trend with clinical interpretation) */
export const LabMetricTrendContractSchema = z.object({
    id: z.string(),
    userId: z.string(),
    metricDefinitionId: z.string(),
    metricCode: z.string(),
    metricName: z.string(),
    canonicalUnit: z.string(),
    directionality: LabMetricDirectionalitySchema,
    variabilityThreshold: z.number().nullable(),
    optimalRangeLow: z.number().nullable(),
    optimalRangeHigh: z.number().nullable(),
    dataPoints: z.array(LabTrendDataPointSchema),
    latestValue: z.number().nullable(),
    latestObservedAt: z.string().nullable(),
    startValue: z.number().nullable(),
    startObservedAt: z.string().nullable(),
    percentChange: z.number().nullable(),
    absoluteChange: z.number().nullable(),
    labRangeStatus: LabRangeStatusSchema,
    changeSignificance: LabChangeSignificanceSchema,
    clinicalDirection: LabClinicalDirectionSchema,
});
// ============================================================================
// MOCK FACTORIES
// ============================================================================
const nowIso = () => new Date().toISOString();
export const createMockLabObservation = (overrides = {}) => {
    const timestamp = nowIso();
    return {
        id: "mock-observation-id",
        userId: "HH-ABC123",
        reportId: "mock-report-id",
        observedAt: timestamp,
        rawAnalyteName: "Glucose",
        rawValueNumber: 95,
        rawUnit: "mg/dL",
        rawReferenceIntervalLow: 70,
        rawReferenceIntervalHigh: 100,
        canonicalValue: 95,
        canonicalUnit: "mg/dL",
        metricDefinitionId: "mock-metric-definition-id",
        mappingStatus: "MATCHED",
        mappingConfidence: 0.95,
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
    };
};
// ============================================================================
// LAB REPORT FORM SCHEMA (Web-admin entry form validation)
// ============================================================================
/**
 * Zod schema for validating the metadata fields of the lab report entry form
 * before API submission. Observations are validated separately.
 *
 * @see web-admin/components/admin/LabEntryForm.tsx
 */
export const labReportFormSchema = z.object({
    /** ISO date string (YYYY-MM-DD) for the report date */
    reportDate: z.string().min(1, "Report date is required"),
    labName: z
        .string()
        .max(200, "Lab name must be 200 characters or fewer")
        .optional(),
    labLocation: z
        .string()
        .max(200, "Lab location must be 200 characters or fewer")
        .optional(),
    panelName: z
        .string()
        .max(200, "Panel name must be 200 characters or fewer")
        .optional(),
    specimenType: z
        .string()
        .max(100, "Specimen type must be 100 characters or fewer")
        .optional(),
    orderingProvider: z
        .string()
        .max(200, "Ordering provider must be 200 characters or fewer")
        .optional(),
    notes: z.string().optional(),
});
// ============================================================================
// BIOMARKER CREATE FORM SCHEMA (Web-admin inline create form validation)
// ============================================================================
/**
 * Zod schema for validating the BiomarkerPicker inline creation form data
 * before API submission.
 *
 * @see web-admin/components/labs/BiomarkerPicker.tsx
 */
export const biomarkerCreateFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Biomarker name is required")
        .max(200, "Name must be 200 characters or fewer"),
    code: z
        .string()
        .trim()
        .max(100, "Code must be 100 characters or fewer")
        .optional(),
    category: LabMetricCategorySchema,
    canonicalUnit: z
        .string()
        .trim()
        .min(1, "Unit is required")
        .max(50, "Unit must be 50 characters or fewer"),
    directionality: LabMetricDirectionalitySchema,
});
export const createMockLabReport = (overrides = {}) => {
    const timestamp = nowIso();
    return {
        id: "mock-report-id",
        userId: "HH-ABC123",
        reportDate: timestamp,
        labName: "Quest Diagnostics",
        panelName: "Comprehensive Metabolic Panel",
        orderStatus: LAB_ORDER_STATUS.ORDERED,
        observations: [createMockLabObservation()],
        createdAt: timestamp,
        updatedAt: timestamp,
        ...overrides,
    };
};
//# sourceMappingURL=labs.js.map