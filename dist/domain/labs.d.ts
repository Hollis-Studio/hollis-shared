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
/** Tuple of valid lab result status values (source of truth). UPPER_CASE to match Prisma LabPanelStatus enum. */
export declare const LAB_RESULT_STATUSES: readonly ["PRELIMINARY", "FINAL", "CORRECTED", "CANCELLED"];
export type LabResultStatus = z.infer<typeof LabResultStatusSchema>;
/** Zod schema for lab result status - derived from tuple */
export declare const LabResultStatusSchema: z.ZodEnum<{
    CANCELLED: "CANCELLED";
    PRELIMINARY: "PRELIMINARY";
    FINAL: "FINAL";
    CORRECTED: "CORRECTED";
}>;
/** Constant object for lab result status comparisons */
export declare const LAB_RESULT_STATUS: {
    readonly PRELIMINARY: "PRELIMINARY";
    readonly FINAL: "FINAL";
    readonly CORRECTED: "CORRECTED";
    readonly CANCELLED: "CANCELLED";
};
/** Human-readable labels for lab result statuses */
export declare const LAB_RESULT_STATUS_LABELS: Record<LabResultStatus, string>;
/**
 * Type guard to check if a string is a valid lab result status
 */
export declare function isLabResultStatus(value: string): value is LabResultStatus;
/** Tuple of valid lab result flag values (source of truth) */
export declare const LAB_RESULT_FLAGS: readonly ["normal", "low", "high", "critical_low", "critical_high"];
export type LabResultFlag = z.infer<typeof LabResultFlagSchema>;
/** Zod schema for lab result flag - derived from tuple */
export declare const LabResultFlagSchema: z.ZodEnum<{
    low: "low";
    high: "high";
    normal: "normal";
    critical_low: "critical_low";
    critical_high: "critical_high";
}>;
/** Constant object for lab result flag comparisons */
export declare const LAB_RESULT_FLAG: {
    readonly NORMAL: "normal";
    readonly LOW: "low";
    readonly HIGH: "high";
    readonly CRITICAL_LOW: "critical_low";
    readonly CRITICAL_HIGH: "critical_high";
};
/** Human-readable labels for lab result flags */
export declare const LAB_RESULT_FLAG_LABELS: Record<LabResultFlag, string>;
/**
 * Type guard to check if a string is a valid lab result flag
 */
export declare function isLabResultFlag(value: string): value is LabResultFlag;
/**
 * Tuple of valid lab mapping status values (source of truth).
 * UPPER_CASE to match Prisma LabMappingStatus enum.
 */
export declare const LAB_MAPPING_STATUSES: readonly ["MATCHED", "CREATED", "REVIEW_NEEDED", "MANUAL_OVERRIDE"];
export type LabMappingStatus = z.infer<typeof LabMappingStatusSchema>;
/** Zod schema for lab mapping status */
export declare const LabMappingStatusSchema: z.ZodEnum<{
    MATCHED: "MATCHED";
    CREATED: "CREATED";
    REVIEW_NEEDED: "REVIEW_NEEDED";
    MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
}>;
/** Constant object for lab mapping status comparisons */
export declare const LAB_MAPPING_STATUS: {
    readonly MATCHED: "MATCHED";
    readonly CREATED: "CREATED";
    readonly REVIEW_NEEDED: "REVIEW_NEEDED";
    readonly MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
};
/** Human-readable labels for lab mapping statuses */
export declare const LAB_MAPPING_STATUS_LABELS: Record<LabMappingStatus, string>;
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
export declare const LAB_METRIC_DIRECTIONALITIES: readonly ["LOWER_IS_BETTER", "HIGHER_IS_BETTER", "OPTIMAL_ZONE", "DECISION_LIMIT"];
export type LabMetricDirectionality = z.infer<typeof LabMetricDirectionalitySchema>;
/** Zod schema for lab metric directionality */
export declare const LabMetricDirectionalitySchema: z.ZodEnum<{
    LOWER_IS_BETTER: "LOWER_IS_BETTER";
    HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
    OPTIMAL_ZONE: "OPTIMAL_ZONE";
    DECISION_LIMIT: "DECISION_LIMIT";
}>;
/** Constant object for lab metric directionality comparisons */
export declare const LAB_METRIC_DIRECTIONALITY: {
    readonly LOWER_IS_BETTER: "LOWER_IS_BETTER";
    readonly HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
    readonly OPTIMAL_ZONE: "OPTIMAL_ZONE";
    readonly DECISION_LIMIT: "DECISION_LIMIT";
};
/** Human-readable labels for lab metric directionality */
export declare const LAB_METRIC_DIRECTIONALITY_LABELS: Record<LabMetricDirectionality, string>;
/** Tuple of valid change significance values (source of truth) */
export declare const LAB_CHANGE_SIGNIFICANCES: readonly ["not_enough_data", "no_meaningful_change", "meaningful_change"];
export type LabChangeSignificance = z.infer<typeof LabChangeSignificanceSchema>;
/** Zod schema for change significance */
export declare const LabChangeSignificanceSchema: z.ZodEnum<{
    not_enough_data: "not_enough_data";
    no_meaningful_change: "no_meaningful_change";
    meaningful_change: "meaningful_change";
}>;
/** Constant object for change significance comparisons */
export declare const LAB_CHANGE_SIGNIFICANCE: {
    readonly NOT_ENOUGH_DATA: LabChangeSignificance;
    readonly NO_MEANINGFUL_CHANGE: LabChangeSignificance;
    readonly MEANINGFUL_CHANGE: LabChangeSignificance;
};
/** Human-readable labels for change significance */
export declare const LAB_CHANGE_SIGNIFICANCE_LABELS: Record<LabChangeSignificance, string>;
/** Tuple of valid clinical direction values (source of truth) */
export declare const LAB_CLINICAL_DIRECTIONS: readonly ["improving", "worsening", "stable", "not_applicable"];
export type LabClinicalDirection = z.infer<typeof LabClinicalDirectionSchema>;
/** Zod schema for clinical direction */
export declare const LabClinicalDirectionSchema: z.ZodEnum<{
    improving: "improving";
    stable: "stable";
    worsening: "worsening";
    not_applicable: "not_applicable";
}>;
/** Constant object for clinical direction comparisons */
export declare const LAB_CLINICAL_DIRECTION: {
    readonly IMPROVING: LabClinicalDirection;
    readonly WORSENING: LabClinicalDirection;
    readonly STABLE: LabClinicalDirection;
    readonly NOT_APPLICABLE: LabClinicalDirection;
};
/** Human-readable labels for clinical direction */
export declare const LAB_CLINICAL_DIRECTION_LABELS: Record<LabClinicalDirection, string>;
/** Tuple of valid lab range status values (source of truth) */
export declare const LAB_RANGE_STATUSES: readonly ["in_range", "low", "high", "not_computable"];
export type LabRangeStatus = z.infer<typeof LabRangeStatusSchema>;
/** Zod schema for lab range status */
export declare const LabRangeStatusSchema: z.ZodEnum<{
    low: "low";
    high: "high";
    in_range: "in_range";
    not_computable: "not_computable";
}>;
/** Constant object for lab range status comparisons */
export declare const LAB_RANGE_STATUS: {
    readonly IN_RANGE: LabRangeStatus;
    readonly LOW: LabRangeStatus;
    readonly HIGH: LabRangeStatus;
    readonly NOT_COMPUTABLE: LabRangeStatus;
};
/** Human-readable labels for lab range status */
export declare const LAB_RANGE_STATUS_LABELS: Record<LabRangeStatus, string>;
/** Tuple of valid lab metric categories (source of truth) */
export declare const LAB_METRIC_CATEGORIES: readonly ["body_composition", "cardiovascular", "metabolic", "hormonal", "performance", "hematology", "inflammatory", "nutritional", "uncategorized"];
export type LabMetricCategory = z.infer<typeof LabMetricCategorySchema>;
/** Zod schema for lab metric categories */
export declare const LabMetricCategorySchema: z.ZodEnum<{
    body_composition: "body_composition";
    cardiovascular: "cardiovascular";
    metabolic: "metabolic";
    hormonal: "hormonal";
    performance: "performance";
    hematology: "hematology";
    inflammatory: "inflammatory";
    nutritional: "nutritional";
    uncategorized: "uncategorized";
}>;
/** Constant object for lab metric category comparisons (avoids magic strings) */
export declare const LAB_METRIC_CATEGORY: {
    readonly body_composition: "body_composition";
    readonly cardiovascular: "cardiovascular";
    readonly metabolic: "metabolic";
    readonly hormonal: "hormonal";
    readonly performance: "performance";
    readonly hematology: "hematology";
    readonly inflammatory: "inflammatory";
    readonly nutritional: "nutritional";
    readonly uncategorized: "uncategorized";
};
/** Human-readable labels for lab metric categories */
export declare const LAB_METRIC_CATEGORY_LABELS: Record<LabMetricCategory, string>;
/** Tuple of valid metric approval status values (source of truth) */
export declare const METRIC_APPROVAL_STATUSES: readonly ["PENDING", "APPROVED", "REJECTED", "MERGED"];
export type MetricApprovalStatus = z.infer<typeof MetricApprovalStatusSchema>;
/** Zod schema for metric approval status */
export declare const MetricApprovalStatusSchema: z.ZodEnum<{
    PENDING: "PENDING";
    APPROVED: "APPROVED";
    REJECTED: "REJECTED";
    MERGED: "MERGED";
}>;
/** Constant object for metric approval status comparisons */
export declare const METRIC_APPROVAL_STATUS: {
    readonly PENDING: MetricApprovalStatus;
    readonly APPROVED: MetricApprovalStatus;
    readonly REJECTED: MetricApprovalStatus;
    readonly MERGED: MetricApprovalStatus;
};
/** Human-readable labels for metric approval statuses */
export declare const METRIC_APPROVAL_STATUS_LABELS: Record<MetricApprovalStatus, string>;
/**
 * Type guard to check if a string is a valid metric approval status
 */
export declare function isMetricApprovalStatus(value: string): value is MetricApprovalStatus;
/** Tuple of valid clinician goal status values (source of truth) */
export declare const CLINICIAN_GOAL_STATUSES: readonly ["at-goal", "above-goal", "below-goal", "no-goal-set"];
export type ClinicianGoalStatus = z.infer<typeof ClinicianGoalStatusSchema>;
/** Zod schema for clinician goal status */
export declare const ClinicianGoalStatusSchema: z.ZodEnum<{
    "at-goal": "at-goal";
    "above-goal": "above-goal";
    "below-goal": "below-goal";
    "no-goal-set": "no-goal-set";
}>;
/** Constant object for clinician goal status comparisons */
export declare const CLINICIAN_GOAL_STATUS: {
    readonly AT_GOAL: ClinicianGoalStatus;
    readonly ABOVE_GOAL: ClinicianGoalStatus;
    readonly BELOW_GOAL: ClinicianGoalStatus;
    readonly NO_GOAL_SET: ClinicianGoalStatus;
};
/** Human-readable labels for clinician goal status */
export declare const CLINICIAN_GOAL_STATUS_LABELS: Record<ClinicianGoalStatus, string>;
/** Target direction for clinician goals */
export declare const GOAL_TARGET_DIRECTIONS: readonly ["below", "above", "at", "range"];
export type GoalTargetDirection = z.infer<typeof GoalTargetDirectionSchema>;
/** Zod schema for goal target direction */
export declare const GoalTargetDirectionSchema: z.ZodEnum<{
    at: "at";
    below: "below";
    above: "above";
    range: "range";
}>;
/** Tuple of valid goal source values (source of truth) */
export declare const GOAL_SOURCES: readonly ["clinician", "none"];
export type GoalSource = z.infer<typeof GoalSourceSchema>;
/** Zod schema for goal source */
export declare const GoalSourceSchema: z.ZodEnum<{
    none: "none";
    clinician: "clinician";
}>;
/** Constant object for goal source comparisons */
export declare const GOAL_SOURCE: {
    readonly CLINICIAN: GoalSource;
    readonly NONE: GoalSource;
};
/** Human-readable labels for goal sources */
export declare const GOAL_SOURCE_LABELS: Record<GoalSource, string>;
/**
 * Lab observation contract - represents a single lab result observation.
 */
export declare const LabObservationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodNullable<z.ZodString>;
    reportId: z.ZodString;
    metricDefinitionId: z.ZodString;
    observedAt: z.ZodString;
    rawAnalyteName: z.ZodString;
    rawValueText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawValueNumber: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rawUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rawReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rawFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    canonicalValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    canonicalUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    labReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    labReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mappingStatus: z.ZodEnum<{
        MATCHED: "MATCHED";
        CREATED: "CREATED";
        REVIEW_NEEDED: "REVIEW_NEEDED";
        MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
    }>;
    mappingConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    mappingNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
    extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type LabObservationContract = z.infer<typeof LabObservationSchema>;
/**
 * Lab report contract - represents a complete lab report with observations.
 */
export declare const LabReportSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodNullable<z.ZodString>;
    reportDate: z.ZodString;
    labName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    specimenType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    orderingProvider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    panelName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    panelCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sourceDocumentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    verifiedById: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    verifiedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    orderStatus: z.ZodEnum<{
        ORDERED: "ORDERED";
        KIT_SENT: "KIT_SENT";
        SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
        RESULTS_PENDING: "RESULTS_PENDING";
        RESULTS_REVIEWED: "RESULTS_REVIEWED";
        RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
    }>;
    observations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodNullable<z.ZodString>;
        reportId: z.ZodString;
        metricDefinitionId: z.ZodString;
        observedAt: z.ZodString;
        rawAnalyteName: z.ZodString;
        rawValueText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawValueNumber: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        canonicalValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        canonicalUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        labReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        labReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mappingStatus: z.ZodEnum<{
            MATCHED: "MATCHED";
            CREATED: "CREATED";
            REVIEW_NEEDED: "REVIEW_NEEDED";
            MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
        }>;
        mappingConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        mappingNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
        extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type LabReportContract = z.infer<typeof LabReportSchema>;
/** Mapping status values used in lab trend data points (lowercase for API responses) */
export declare const LAB_TREND_MAPPING_STATUSES: readonly ["mapped", "unmapped", "ambiguous"];
export type LabTrendMappingStatus = z.infer<typeof LabTrendMappingStatusSchema>;
/** Zod schema for lab trend mapping status */
export declare const LabTrendMappingStatusSchema: z.ZodEnum<{
    mapped: "mapped";
    unmapped: "unmapped";
    ambiguous: "ambiguous";
}>;
/** Zod schema for a single lab trend data point */
export declare const LabTrendDataPointSchema: z.ZodObject<{
    observationId: z.ZodString;
    observedAt: z.ZodString;
    canonicalValue: z.ZodNullable<z.ZodNumber>;
    canonicalUnit: z.ZodNullable<z.ZodString>;
    labReferenceIntervalLow: z.ZodNullable<z.ZodNumber>;
    labReferenceIntervalHigh: z.ZodNullable<z.ZodNumber>;
    labReferenceIntervalText: z.ZodNullable<z.ZodString>;
    mappingStatus: z.ZodEnum<{
        mapped: "mapped";
        unmapped: "unmapped";
        ambiguous: "ambiguous";
    }>;
}, z.core.$strip>;
export type LabTrendDataPoint = z.infer<typeof LabTrendDataPointSchema>;
/** Zod schema for the lab metric trend contract (per-metric trend with clinical interpretation) */
export declare const LabMetricTrendContractSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    metricDefinitionId: z.ZodString;
    metricCode: z.ZodString;
    metricName: z.ZodString;
    canonicalUnit: z.ZodString;
    directionality: z.ZodEnum<{
        LOWER_IS_BETTER: "LOWER_IS_BETTER";
        HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
        OPTIMAL_ZONE: "OPTIMAL_ZONE";
        DECISION_LIMIT: "DECISION_LIMIT";
    }>;
    variabilityThreshold: z.ZodNullable<z.ZodNumber>;
    optimalRangeLow: z.ZodNullable<z.ZodNumber>;
    optimalRangeHigh: z.ZodNullable<z.ZodNumber>;
    dataPoints: z.ZodArray<z.ZodObject<{
        observationId: z.ZodString;
        observedAt: z.ZodString;
        canonicalValue: z.ZodNullable<z.ZodNumber>;
        canonicalUnit: z.ZodNullable<z.ZodString>;
        labReferenceIntervalLow: z.ZodNullable<z.ZodNumber>;
        labReferenceIntervalHigh: z.ZodNullable<z.ZodNumber>;
        labReferenceIntervalText: z.ZodNullable<z.ZodString>;
        mappingStatus: z.ZodEnum<{
            mapped: "mapped";
            unmapped: "unmapped";
            ambiguous: "ambiguous";
        }>;
    }, z.core.$strip>>;
    latestValue: z.ZodNullable<z.ZodNumber>;
    latestObservedAt: z.ZodNullable<z.ZodString>;
    startValue: z.ZodNullable<z.ZodNumber>;
    startObservedAt: z.ZodNullable<z.ZodString>;
    percentChange: z.ZodNullable<z.ZodNumber>;
    absoluteChange: z.ZodNullable<z.ZodNumber>;
    labRangeStatus: z.ZodEnum<{
        low: "low";
        high: "high";
        in_range: "in_range";
        not_computable: "not_computable";
    }>;
    changeSignificance: z.ZodEnum<{
        not_enough_data: "not_enough_data";
        no_meaningful_change: "no_meaningful_change";
        meaningful_change: "meaningful_change";
    }>;
    clinicalDirection: z.ZodEnum<{
        improving: "improving";
        stable: "stable";
        worsening: "worsening";
        not_applicable: "not_applicable";
    }>;
}, z.core.$strip>;
export type LabMetricTrendContract = z.infer<typeof LabMetricTrendContractSchema>;
export declare const createMockLabObservation: (overrides?: Partial<LabObservationContract>) => LabObservationContract;
/**
 * Zod schema for validating the metadata fields of the lab report entry form
 * before API submission. Observations are validated separately.
 *
 * @see web-admin/components/admin/LabEntryForm.tsx
 */
export declare const labReportFormSchema: z.ZodObject<{
    reportDate: z.ZodString;
    labName: z.ZodOptional<z.ZodString>;
    labLocation: z.ZodOptional<z.ZodString>;
    panelName: z.ZodOptional<z.ZodString>;
    specimenType: z.ZodOptional<z.ZodString>;
    orderingProvider: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type LabReportFormData = z.infer<typeof labReportFormSchema>;
/**
 * Zod schema for validating the BiomarkerPicker inline creation form data
 * before API submission.
 *
 * @see web-admin/components/labs/BiomarkerPicker.tsx
 */
export declare const biomarkerCreateFormSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<{
        body_composition: "body_composition";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        hormonal: "hormonal";
        performance: "performance";
        hematology: "hematology";
        inflammatory: "inflammatory";
        nutritional: "nutritional";
        uncategorized: "uncategorized";
    }>;
    canonicalUnit: z.ZodString;
    directionality: z.ZodEnum<{
        LOWER_IS_BETTER: "LOWER_IS_BETTER";
        HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
        OPTIMAL_ZONE: "OPTIMAL_ZONE";
        DECISION_LIMIT: "DECISION_LIMIT";
    }>;
}, z.core.$strip>;
export type BiomarkerCreateFormData = z.infer<typeof biomarkerCreateFormSchema>;
export declare const createMockLabReport: (overrides?: Partial<LabReportContract>) => LabReportContract;
//# sourceMappingURL=labs.d.ts.map