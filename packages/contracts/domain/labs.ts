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

// ============================================================================
// LAB RESULT STATUS (Domain Constants Pattern)
// ============================================================================

/** Tuple of valid lab result status values (source of truth). UPPER_CASE to match Prisma LabResultStatus enum. */
export const LAB_RESULT_STATUSES = [
  "PRELIMINARY",
  "FINAL",
  "CORRECTED",
  "CANCELLED",
] as const;
export type LabResultStatus = (typeof LAB_RESULT_STATUSES)[number];

/** Zod schema for lab result status - derived from tuple */
export const LabResultStatusSchema = z.enum(LAB_RESULT_STATUSES);

/** Constant object for lab result status comparisons */
export const LAB_RESULT_STATUS = {
  PRELIMINARY: "PRELIMINARY",
  FINAL: "FINAL",
  CORRECTED: "CORRECTED",
  CANCELLED: "CANCELLED",
} as const satisfies Record<LabResultStatus, LabResultStatus>;

/** Human-readable labels for lab result statuses */
export const LAB_RESULT_STATUS_LABELS: Record<LabResultStatus, string> = {
  PRELIMINARY: "Preliminary",
  FINAL: "Final",
  CORRECTED: "Corrected",
  CANCELLED: "Cancelled",
};

/**
 * Type guard to check if a string is a valid lab result status
 */
export function isLabResultStatus(value: string): value is LabResultStatus {
  return (LAB_RESULT_STATUSES as readonly string[]).includes(value);
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
] as const;
export type LabResultFlag = (typeof LAB_RESULT_FLAGS)[number];

/** Zod schema for lab result flag - derived from tuple */
export const LabResultFlagSchema = z.enum(LAB_RESULT_FLAGS);

/** Constant object for lab result flag comparisons */
export const LAB_RESULT_FLAG = {
  NORMAL: "normal" as LabResultFlag,
  LOW: "low" as LabResultFlag,
  HIGH: "high" as LabResultFlag,
  CRITICAL_LOW: "critical_low" as LabResultFlag,
  CRITICAL_HIGH: "critical_high" as LabResultFlag,
} as const;

/** Human-readable labels for lab result flags */
export const LAB_RESULT_FLAG_LABELS: Record<LabResultFlag, string> = {
  normal: "Normal",
  low: "Low",
  high: "High",
  critical_low: "Critical Low",
  critical_high: "Critical High",
};

/**
 * Type guard to check if a string is a valid lab result flag
 */
export function isLabResultFlag(value: string): value is LabResultFlag {
  return (LAB_RESULT_FLAGS as readonly string[]).includes(value);
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
] as const;
export type LabMappingStatus = (typeof LAB_MAPPING_STATUSES)[number];

/** Zod schema for lab mapping status */
export const LabMappingStatusSchema = z.enum(LAB_MAPPING_STATUSES);

/** Constant object for lab mapping status comparisons */
export const LAB_MAPPING_STATUS = {
  MATCHED: "MATCHED",
  CREATED: "CREATED",
  REVIEW_NEEDED: "REVIEW_NEEDED",
  MANUAL_OVERRIDE: "MANUAL_OVERRIDE",
} as const satisfies Record<LabMappingStatus, LabMappingStatus>;

/** Human-readable labels for lab mapping statuses */
export const LAB_MAPPING_STATUS_LABELS: Record<LabMappingStatus, string> = {
  MATCHED: "Matched",
  CREATED: "Created",
  REVIEW_NEEDED: "Review Needed",
  MANUAL_OVERRIDE: "Manual Override",
};

// ============================================================================
// LAB METRIC DIRECTIONALITY
// ============================================================================

/** Tuple of valid lab metric directionality values (source of truth). UPPER_CASE to match Prisma enum. */
export const LAB_METRIC_DIRECTIONALITIES = [
  "LOWER_IS_BETTER",
  "HIGHER_IS_BETTER",
  "OPTIMAL_ZONE",
  "DECISION_LIMIT",
] as const;
export type LabMetricDirectionality =
  (typeof LAB_METRIC_DIRECTIONALITIES)[number];

/** Zod schema for lab metric directionality */
export const LabMetricDirectionalitySchema = z.enum(
  LAB_METRIC_DIRECTIONALITIES,
);

/** Constant object for lab metric directionality comparisons */
export const LAB_METRIC_DIRECTIONALITY = {
  LOWER_IS_BETTER: "LOWER_IS_BETTER",
  HIGHER_IS_BETTER: "HIGHER_IS_BETTER",
  OPTIMAL_ZONE: "OPTIMAL_ZONE",
  DECISION_LIMIT: "DECISION_LIMIT",
} as const satisfies Record<LabMetricDirectionality, LabMetricDirectionality>;

/** Human-readable labels for lab metric directionality */
export const LAB_METRIC_DIRECTIONALITY_LABELS: Record<
  LabMetricDirectionality,
  string
> = {
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
] as const;
export type LabChangeSignificance = (typeof LAB_CHANGE_SIGNIFICANCES)[number];

/** Zod schema for change significance */
export const LabChangeSignificanceSchema = z.enum(LAB_CHANGE_SIGNIFICANCES);

/** Constant object for change significance comparisons */
export const LAB_CHANGE_SIGNIFICANCE = {
  NOT_ENOUGH_DATA: "not_enough_data" as LabChangeSignificance,
  NO_MEANINGFUL_CHANGE: "no_meaningful_change" as LabChangeSignificance,
  MEANINGFUL_CHANGE: "meaningful_change" as LabChangeSignificance,
} as const;

/** Human-readable labels for change significance */
export const LAB_CHANGE_SIGNIFICANCE_LABELS: Record<
  LabChangeSignificance,
  string
> = {
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
] as const;
export type LabClinicalDirection = (typeof LAB_CLINICAL_DIRECTIONS)[number];

/** Zod schema for clinical direction */
export const LabClinicalDirectionSchema = z.enum(LAB_CLINICAL_DIRECTIONS);

/** Constant object for clinical direction comparisons */
export const LAB_CLINICAL_DIRECTION = {
  IMPROVING: "improving" as LabClinicalDirection,
  WORSENING: "worsening" as LabClinicalDirection,
  STABLE: "stable" as LabClinicalDirection,
  NOT_APPLICABLE: "not_applicable" as LabClinicalDirection,
} as const;

/** Human-readable labels for clinical direction */
export const LAB_CLINICAL_DIRECTION_LABELS: Record<
  LabClinicalDirection,
  string
> = {
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
] as const;
export type LabRangeStatus = (typeof LAB_RANGE_STATUSES)[number];

/** Zod schema for lab range status */
export const LabRangeStatusSchema = z.enum(LAB_RANGE_STATUSES);

/** Constant object for lab range status comparisons */
export const LAB_RANGE_STATUS = {
  IN_RANGE: "in_range" as LabRangeStatus,
  LOW: "low" as LabRangeStatus,
  HIGH: "high" as LabRangeStatus,
  NOT_COMPUTABLE: "not_computable" as LabRangeStatus,
} as const;

/** Human-readable labels for lab range status */
export const LAB_RANGE_STATUS_LABELS: Record<LabRangeStatus, string> = {
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
] as const;
export type LabMetricCategory = (typeof LAB_METRIC_CATEGORIES)[number];

/** Zod schema for lab metric categories */
export const LabMetricCategorySchema = z.enum(LAB_METRIC_CATEGORIES);

/** Human-readable labels for lab metric categories */
export const LAB_METRIC_CATEGORY_LABELS: Record<LabMetricCategory, string> = {
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
] as const;
export type MetricApprovalStatus = (typeof METRIC_APPROVAL_STATUSES)[number];

/** Zod schema for metric approval status */
export const MetricApprovalStatusSchema = z.enum(METRIC_APPROVAL_STATUSES);

/** Constant object for metric approval status comparisons */
export const METRIC_APPROVAL_STATUS = {
  PENDING: "PENDING" as MetricApprovalStatus,
  APPROVED: "APPROVED" as MetricApprovalStatus,
  REJECTED: "REJECTED" as MetricApprovalStatus,
  MERGED: "MERGED" as MetricApprovalStatus,
} as const;

/** Human-readable labels for metric approval statuses */
export const METRIC_APPROVAL_STATUS_LABELS: Record<
  MetricApprovalStatus,
  string
> = {
  PENDING: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  MERGED: "Merged",
};

/**
 * Type guard to check if a string is a valid metric approval status
 */
export function isMetricApprovalStatus(
  value: string,
): value is MetricApprovalStatus {
  return (METRIC_APPROVAL_STATUSES as readonly string[]).includes(value);
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
] as const;
export type ClinicianGoalStatus = (typeof CLINICIAN_GOAL_STATUSES)[number];

/** Zod schema for clinician goal status */
export const ClinicianGoalStatusSchema = z.enum(CLINICIAN_GOAL_STATUSES);

/** Constant object for clinician goal status comparisons */
export const CLINICIAN_GOAL_STATUS = {
  AT_GOAL: "at-goal" as ClinicianGoalStatus,
  ABOVE_GOAL: "above-goal" as ClinicianGoalStatus,
  BELOW_GOAL: "below-goal" as ClinicianGoalStatus,
  NO_GOAL_SET: "no-goal-set" as ClinicianGoalStatus,
} as const;

/** Human-readable labels for clinician goal status */
export const CLINICIAN_GOAL_STATUS_LABELS: Record<ClinicianGoalStatus, string> =
  {
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
] as const;
export type GoalTargetDirection = (typeof GOAL_TARGET_DIRECTIONS)[number];

/** Zod schema for goal target direction */
export const GoalTargetDirectionSchema = z.enum(GOAL_TARGET_DIRECTIONS);

// ============================================================================
// LAB OBSERVATION CONTRACT
// ============================================================================

/**
 * Lab observation contract - represents a single lab result observation.
 */
export interface LabObservationContract {
  id: string;
  /**
   * Patient's user ID in HH-XXXXXX barcode format.
   * References the patient this lab result belongs to.
   *
   * @format HH-XXXXXX
   */
  userId: string;
  reportId: string;
  metricDefinitionId: string;
  observedAt: string; // IsoTimestampString
  rawAnalyteName: string;
  rawValueText?: string | null;
  rawValueNumber?: number | null;
  rawUnit?: string | null;
  rawReferenceIntervalText?: string | null;
  rawReferenceIntervalLow?: number | null;
  rawReferenceIntervalHigh?: number | null;
  rawFlag?: string | null;
  canonicalValue?: number | null;
  canonicalUnit?: string | null;
  labReferenceIntervalLow?: number | null;
  labReferenceIntervalHigh?: number | null;
  labReferenceIntervalText?: string | null;
  labFlag?: string | null;
  mappingStatus: LabMappingStatus;
  mappingConfidence?: number | null;
  notes?: string | null;
  tags?: string[] | null;
  extractionConfidences?: Record<string, number> | null;
  extractionFragments?: Record<string, string> | null;
  createdAt: string; // IsoTimestampString
  updatedAt: string; // IsoTimestampString
}

export const LabObservationSchema: z.ZodType<LabObservationContract> = z.object(
  {
    id: z.string(),
    userId: z.string(),
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
    notes: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    extractionConfidences: z
      .record(z.string(), z.number())
      .nullable()
      .optional(),
    extractionFragments: z.record(z.string(), z.string()).nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  },
);

// ============================================================================
// LAB REPORT CONTRACT
// ============================================================================

/**
 * Lab report contract - represents a complete lab report with observations.
 */
export interface LabReportContract {
  id: string;
  /**
   * Patient's user ID in HH-XXXXXX barcode format.
   * References the patient this lab panel belongs to.
   *
   * @format HH-XXXXXX
   */
  userId: string;
  reportDate: string; // IsoTimestampString
  labName?: string | null;
  labLocation?: string | null;
  specimenType?: string | null;
  orderingProvider?: string | null;
  panelName?: string | null;
  panelCode?: string | null;
  sourceDocumentId?: string | null;
  verifiedById?: string | null;
  verifiedAt?: string | null; // IsoTimestampString
  notes?: string | null;
  observations: LabObservationContract[];
  createdAt: string; // IsoTimestampString
  updatedAt: string; // IsoTimestampString
}

export const LabReportSchema: z.ZodType<LabReportContract> = z.object({
  id: z.string(),
  userId: z.string(),
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
  observations: z.array(LabObservationSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockLabObservation = (
  overrides: Partial<LabObservationContract> = {},
): LabObservationContract => {
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

export const createMockLabReport = (
  overrides: Partial<LabReportContract> = {},
): LabReportContract => {
  const timestamp = nowIso();
  return {
    id: "mock-report-id",
    userId: "HH-ABC123",
    reportDate: timestamp,
    labName: "Quest Diagnostics",
    panelName: "Comprehensive Metabolic Panel",
    observations: [createMockLabObservation()],
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};
