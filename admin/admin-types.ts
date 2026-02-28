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

import type {
    GoalDataSource,
    LabMappingStatus,
    LabMetricCategory,
    LabMetricDirectionality,
    StrategyStatus,
    StrategyType,
    UserRole,
} from "../domain";
import { type VolumeLevel } from "../primitives";

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
export interface TrainerSummary {
  id: string;
  name: string;
  role: UserRole;
}

// ============================================================================
// TRAINING STRATEGY TYPES
// ============================================================================

/**
 * Input for creating a training phase.
 * @deprecated Use `z.infer<typeof createPhaseInputSchema>` from admin-schemas instead.
 */
export interface CreatePhaseInput {
  name: string;
  order: number;
  weekCount: number;
  intensityRange?: string;
  volumeLevel?: VolumeLevel;
  focusAreas: string[];
  notes?: string;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * Input for creating a strategy goal.
 * @deprecated Use `z.infer<typeof createGoalInputSchema>` from admin-schemas instead.
 */
export interface CreateGoalInput {
  /** MetricDefinition code string (previously GoalMetricKey) */
  goalMetric: string;
  goalTarget: number;
  baselineValue?: number;
  weight?: number;
  linkedExerciseId?: string;
  dataSource?: GoalDataSource;
  dataKey?: string;
  /** For non-hardcoded metrics (lab:/bio: prefix), store definition for reconstruction */
  dynamicMetricDefinition?: {
    dataSource: "lab" | "biometric";
    dataKey: string;
    label: string;
    unit: string;
    direction: string;
    category: string;
  };
}

/**
 * Input for updating a strategy goal.
 * @deprecated Use `z.infer<typeof updateGoalInputSchema>` from admin-schemas instead.
 */
export interface UpdateGoalInput {
  goalTarget?: number;
  baselineValue?: number;
  currentValue?: number;
  weight?: number;
  /** Optional clinician notes about this metric update. */
  notes?: string;
}

/**
 * Input for creating a training strategy.
 * @deprecated Use `z.infer<typeof createStrategyInputSchema>` from admin-schemas instead.
 */
export interface CreateStrategyInput {
  name: string;
  type: StrategyType;
  goal: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status?: StrategyStatus;
  goals: CreateGoalInput[];
  phases?: CreatePhaseInput[];
}

// ============================================================================
// SMART ASSIST PROGRESS TYPES (used by workout, strategy, and other AI features)
// ============================================================================

/**
 * Smart Assist progress update with real-time agent activity.
 * Used by workout generation, strategy generation, and other AI-powered features.
 * Sent via SSE during generation processes.
 */
interface SmartAssistProgress {
  /** Current step number (1-based) */
  step: number;
  /** Total number of high-level steps */
  totalSteps: number;
  /** Current phase name (e.g., 'Searching exercises', 'Building plan') */
  phase: string;
  /** Human-readable detail about current activity */
  detail?: string;
  /** Current AI conversation turn (for progress insight) */
  turn?: number;
  /** Maximum conversation turns allowed */
  maxTurns?: number;
  /** Agent activity log entries for real-time display */
  activities?: SmartAssistActivity[];
  /** Running counts for progress summary - optional fields for different feature types */
  stats?: {
    exercisesSearched?: number;
    exercisesCreated?: number;
    exercisesSelected?: number;
    notesCreated?: number;
    goalsIdentified?: number;
    phasesCreated?: number;
  };
}

/**
 * Individual agent activity entry for real-time progress display.
 */
interface SmartAssistActivity {
  /** Timestamp of the activity */
  timestamp: string;
  /** Type of activity */
  type:
    | "search"
    | "create"
    | "select"
    | "plan"
    | "note"
    | "thinking"
    | "complete"
    | "analyze";
  /** Short description of the activity */
  message: string;
  /** Optional additional data (e.g., exercise names found) */
  data?: Record<string, unknown>;
}

/** @deprecated Use SmartAssistProgress from admin-schemas instead */
export type WorkoutGenerationProgress = SmartAssistProgress;

/**
 * Workout plan SSE generation parameters.
 */
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
 * Population qualifiers for race/ethnicity/sex-specific lab results.
 * Used for tests like eGFR that have population-specific reference equations.
 */
type LabPopulationQualifier =
  | "african"
  | "non_african"
  | "male"
  | "female"
  | null;

/**
 * Extracted lab observation from PDF/image parsing.
 * Extended to support multi-population results, panel hierarchies, and quality indicators.
 */
interface ExtractedLabObservation {
  // Core raw fields (extracted exactly as printed)
  rawAnalyteName: string;
  rawValueText?: string | null;
  rawUnit?: string | null;
  rawReferenceIntervalText?: string | null;
  rawReferenceIntervalLow?: number | null;
  rawReferenceIntervalHigh?: number | null;
  rawFlag?: string | null;
  observedAt?: string | null;
  extractionConfidences?: Record<string, number> | null;
  extractionFragments?: Record<string, string> | null;

  // Extended extraction fields for complex results
  /** Population qualifier for race/ethnicity/sex-specific results (e.g., eGFR African/Non-African) */
  populationQualifier?: LabPopulationQualifier;
  /** Parent analyte for panel hierarchies (e.g., "Lipid Panel" for LDL Cholesterol) */
  parentAnalyte?: string | null;
  /** Whether this is a calculated/derived value vs direct measurement */
  isCalculated?: boolean | null;
  /** Calculation method if applicable (e.g., "CKD-EPI 2021", "Friedewald") */
  calculationMethod?: string | null;
  /** Quality indicators (hemolyzed, lipemic, icteric, diluted) */
  qualityIndicator?: string | null;
  /** Lab-specific comment for this result */
  labComment?: string | null;

  // Canonicalization fields (populated after AI matching)
  canonicalValue?: number | null;
  canonicalUnit?: string | null;
  metricDefinitionId?: string | null;
  metricDefinitionCode?: string | null;
  metricDefinitionName?: string | null;
  mappingStatus: LabMappingStatus;
  mappingConfidence?: number | null;
}

/**
 * Extracted lab report metadata.
 * Extended to include collection context and specimen quality.
 */
interface ExtractedLabReport {
  reportDate?: string | null;
  labName?: string | null;
  labLocation?: string | null;
  specimenType?: string | null;
  orderingProvider?: string | null;
  panelName?: string | null;
  panelCode?: string | null;
  /** Time specimen was collected */
  collectionTime?: string | null;
  /** Fasting status: "fasting", "non-fasting", or null */
  fastingStatus?: string | null;
  /** Notes about specimen quality, dilution, or processing issues */
  specimenQualityNotes?: string | null;
  extractionConfidences?: Record<string, number> | null;
  extractionFragments?: Record<string, string> | null;
}

/**
 * Lab data extraction response.
 */
interface LabDataExtractionResult {
  report: ExtractedLabReport;
  observations: ExtractedLabObservation[];
}

/**
 * Lab observation payload for verified ingestion.
 */
export interface LabObservationInput {
  rawAnalyteName: string;
  rawValueText?: string | null;
  rawUnit?: string | null;
  rawReferenceIntervalText?: string | null;
  rawReferenceIntervalLow?: number | null;
  rawReferenceIntervalHigh?: number | null;
  rawFlag?: string | null;
  observedAt?: string | null;
  canonicalValue?: number | null;
  canonicalUnit?: string | null;
  labReferenceIntervalLow?: number | null;
  labReferenceIntervalHigh?: number | null;
  labReferenceIntervalText?: string | null;
  labFlag?: string | null;
  metricDefinitionId?: string | null;
  mappingStatus: LabMappingStatus;
  mappingConfidence?: number | null;
  notes?: string | null;
  tags?: string[] | null;
}

// ============================================================================
// EXERCISE FILTER TYPES
// ============================================================================

/**
 * Exercise filter options for API queries.
 */
export interface ExerciseFilterParams {
  search?: string;
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// METRIC GOVERNANCE TYPES
// ============================================================================

/**
 * Suggested new metric - proposed metric from AI extraction not yet persisted.
 * Used in the self-review loop before admin approval.
 */
interface SuggestedNewMetric {
  suggestedCode: string;
  suggestedName: string;
  suggestedCategory: LabMetricCategory;
  suggestedAliases: string[];
  canonicalUnit: string;
  directionality: LabMetricDirectionality;
  /** User-facing description of what this metric measures and why it matters for health */
  description?: string;
  confidence: number;
  reasoning?: string;
  rawAnalyteName: string;
  isPopulationVariant?: boolean;
  parentMetricCode?: string;
}

/**
 * Extended extraction result with suggested new metrics for governance.
 */
export interface LabDataExtractionResultWithGovernance extends LabDataExtractionResult {
  /** Metrics suggested for creation (pending admin approval) */
  suggestedNewMetrics: SuggestedNewMetric[];
  /** Self-review audit summary */
  selfReviewSummary?: {
    iterationsPerformed: number;
    duplicatesDetected: number;
    garbageFlagged: number;
    verifiedCreations: number;
  };
}
