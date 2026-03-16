/**
 * @ai-context Admin domain types | Types for admin/CRM operations
 *
 * This module provides type definitions for admin-specific operations:
 * - Clinician and trainer management
 * - Training strategies (create/update inputs)
 * - Lab results and extraction
 * - Workout generation
 * - Exercise filtering
 *
 * IMPORTANT: All admin-related types MUST be imported from here.
 *
 * NOTE: This module defines self-contained types for admin operations.
 * Complex nested types (like PatientDetails) use generic typing to allow
 * consumers to inject their platform-specific contract types.
 *
 * deps: domain types | consumers: web-admin/services/*, server/src/routes/admin/*
 */

import type { input as ZodInput } from "zod";
import type {
    CreateGoalInputFromSchema,
    CreatePhaseInputFromSchema,
    CreateStrategyInputFromSchema,
    ExerciseFilterParamsFromSchema,
    LabDataExtractionResultWithGovernanceFromSchema,
    SmartAssistProgress as SmartAssistProgressFromSchema,
    TrainerSummaryFromSchema,
    UpdateGoalInputFromSchema,
} from "./admin-schemas";

// ============================================================================
// COMPLIANCE STATUS (admin-specific)
// ============================================================================

/**
 * Granular compliance status levels for admin views.
 */
export const ADMIN_COMPLIANCE_STATUSES = [
  "excellent",
  "good",
  "at-risk",
  "non-compliant",
] as const;

// Note: VolumeLevel type is imported from primitives (canonical export location)

// ============================================================================
// CLINICIAN MANAGEMENT TYPES
// ============================================================================

/**
 * Summary view of a trainer for list displays.
 * Similar to ClinicianSummary but for fitness trainers.
 */
export type TrainerSummary = TrainerSummaryFromSchema;

// ============================================================================
// TRAINING STRATEGY TYPES
// ============================================================================

/**
 * Input for creating a training phase.
 * Schema-derived alias that preserves the legacy public export name.
 */
export type CreatePhaseInput = CreatePhaseInputFromSchema;

/**
 * Input for creating a strategy goal.
 * Schema-derived alias that preserves the legacy public export name.
 */
export type CreateGoalInput = CreateGoalInputFromSchema;

/**
 * Input for updating a strategy goal.
 * Schema-derived alias that preserves the legacy public export name.
 */
export type UpdateGoalInput = UpdateGoalInputFromSchema;

/**
 * Input for creating a training strategy.
 * Schema-derived alias that preserves the legacy public export name.
 */
export type CreateStrategyInput = CreateStrategyInputFromSchema;

// ============================================================================
// SMART ASSIST PROGRESS TYPES (used by workout, strategy, and other AI features)
// ============================================================================

/**
 * Smart Assist progress update with real-time agent activity.
 * Used by workout generation, strategy generation, and other AI-powered features.
 * Sent via SSE during generation processes.
 */
type SmartAssistProgress = SmartAssistProgressFromSchema;

/** @deprecated Use SmartAssistProgress from admin-schemas instead */
export type WorkoutGenerationProgress = SmartAssistProgress;

/**
 * Workout plan SSE generation parameters.
 */
// DEFERRED [audit-04]: This wrapper intentionally extends the schema-backed request shape with transport/runtime-only concerns (e.g. AbortSignal and progress callbacks); this is not material at <50 users pre-revenue, but revisit if the shared contract-backed subset starts drifting.
export interface WorkoutPlanGenerationParams {
  userId: string;
  weekStartDate: string;
  customPrompt?: string;
  overwriteMode?: "overwrite" | "fillEmpty";
  signal?: AbortSignal;
  onProgress?: (progress: SmartAssistProgress) => void;
}

// ============================================================================
// LAB RESULT TYPES (Provenance-First)
// ============================================================================

/**
 * Lab observation payload for verified ingestion.
 *
 * Derived from the shared runtime schema so the manual type cannot drift wider
 * than the validated contract.
 */
export type LabObservationInput = ZodInput<
  typeof import("./admin-schemas").labObservationInputSchema
>;

// ============================================================================
// EXERCISE FILTER TYPES
// ============================================================================

/**
 * Exercise filter options for API queries.
 */
export type ExerciseFilterParams = ExerciseFilterParamsFromSchema;

// ============================================================================
// METRIC GOVERNANCE TYPES
// ============================================================================

/**
 * Extended extraction result with suggested new metrics for governance.
 * Canonical alias — kept identical to the schema's inferred type so that
 * compile-time exactness assertions in compile.test.ts remain satisfied.
 */
export type LabDataExtractionResultWithGovernance =
  LabDataExtractionResultWithGovernanceFromSchema;
