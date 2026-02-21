/**
 * @ai-context Training domain contracts | strategy types, statuses, goal categories
 *
 * This module provides the canonical definitions for training-related constants:
 * - Strategy types (LINEAR_PROGRESSION, UNDULATING, BLOCK, etc.)
 * - Strategy statuses (ACTIVE, COMPLETED, PAUSED, CANCELLED)
 * - Goal categories (fitness, body_composition, cardiovascular, etc.)
 * - Goal data sources (biometric, lab, exercise_log, manual)
 *
 * IMPORTANT: All training-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from "zod";
import { VolumeLevelSchema, type VolumeLevel } from "../primitives";
import {
    MetricDefinitionSummarySchema,
    type MetricDefinitionSummary,
} from "./metric-definition";

// ============================================================================
// STRATEGY TYPES
// ============================================================================

export const STRATEGY_TYPES = [
  "LINEAR_PROGRESSION",
  "UNDULATING",
  "BLOCK",
  "MESOCYCLE",
  "DELOAD",
  "CUSTOM",
] as const;
export type StrategyType = (typeof STRATEGY_TYPES)[number];

export const StrategyTypeSchema = z.enum(STRATEGY_TYPES);

export const STRATEGY_TYPE = {
  LINEAR_PROGRESSION: "LINEAR_PROGRESSION",
  UNDULATING: "UNDULATING",
  BLOCK: "BLOCK",
  MESOCYCLE: "MESOCYCLE",
  DELOAD: "DELOAD",
  CUSTOM: "CUSTOM",
} as const satisfies Record<StrategyType, StrategyType>;

/** Human-readable labels for strategy types */
export const STRATEGY_TYPE_LABELS: Record<StrategyType, string> = {
  LINEAR_PROGRESSION: "Linear Progression",
  UNDULATING: "Undulating",
  BLOCK: "Block Periodization",
  MESOCYCLE: "Mesocycle",
  DELOAD: "Deload",
  CUSTOM: "Custom",
};

/**
 * Check if a string is a valid strategy type
 */
export function isStrategyType(value: string): value is StrategyType {
  return (STRATEGY_TYPES as readonly string[]).includes(value);
}

// ============================================================================
// STRATEGY STATUSES
// ============================================================================

export const STRATEGY_STATUSES = [
  "ACTIVE",
  "COMPLETED",
  "PAUSED",
  "CANCELLED",
] as const;
export type StrategyStatus = (typeof STRATEGY_STATUSES)[number];

export const StrategyStatusSchema = z.enum(STRATEGY_STATUSES);

export const STRATEGY_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  PAUSED: "PAUSED",
  CANCELLED: "CANCELLED",
} as const satisfies Record<StrategyStatus, StrategyStatus>;

/** Human-readable labels for strategy statuses */
export const STRATEGY_STATUS_LABELS: Record<StrategyStatus, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  PAUSED: "Paused",
  CANCELLED: "Cancelled",
};

/**
 * Check if a string is a valid strategy status
 */
export function isStrategyStatus(value: string): value is StrategyStatus {
  return (STRATEGY_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// GOAL CATEGORIES
// ============================================================================

/**
 * Categories for health/fitness goals.
 * Used to group and filter strategies by their primary focus area.
 */
export const GOAL_CATEGORIES = [
  "fitness",
  "body_composition",
  "cardiovascular",
  "metabolic",
  "hormonal",
  "performance",
] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const GoalCategorySchema = z.enum(GOAL_CATEGORIES);

/** Centralized goal category constants for equality checks */
export const GOAL_CATEGORY = {
  FITNESS: "fitness" as GoalCategory,
  BODY_COMPOSITION: "body_composition" as GoalCategory,
  CARDIOVASCULAR: "cardiovascular" as GoalCategory,
  METABOLIC: "metabolic" as GoalCategory,
  HORMONAL: "hormonal" as GoalCategory,
  PERFORMANCE: "performance" as GoalCategory,
} as const;

/** Human-readable labels for goal categories */
export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
  fitness: "Fitness",
  body_composition: "Body Composition",
  cardiovascular: "Cardiovascular",
  metabolic: "Metabolic",
  hormonal: "Hormonal",
  performance: "Performance",
};

/**
 * Check if a string is a valid goal category
 */
export function isGoalCategory(value: string): value is GoalCategory {
  return (GOAL_CATEGORIES as readonly string[]).includes(value);
}

// ============================================================================
// GOAL DATA SOURCES
// ============================================================================

/**
 * Data sources from which goal progress (currentValue) can be pulled.
 * Enables automatic progress tracking from existing database records.
 */
export const GOAL_DATA_SOURCES = [
  "biometric",
  "lab",
  "exercise_log",
  "manual",
] as const;
export type GoalDataSource = (typeof GOAL_DATA_SOURCES)[number];

/**
 * Legacy goal data-source values accepted for backward-compatible reads.
 * New writes should always use GOAL_DATA_SOURCES.
 */
export const LEGACY_GOAL_DATA_SOURCES = [
  ...GOAL_DATA_SOURCES,
  "measurement",
] as const;
export type LegacyGoalDataSource = (typeof LEGACY_GOAL_DATA_SOURCES)[number];

export const GoalDataSourceSchema = z.enum(GOAL_DATA_SOURCES);
export const LegacyGoalDataSourceSchema = z.enum(LEGACY_GOAL_DATA_SOURCES);

/** Centralized goal data source constants for equality checks */
export const GOAL_DATA_SOURCE = {
  BIOMETRIC: "biometric" as GoalDataSource,
  LAB: "lab" as GoalDataSource,
  EXERCISE_LOG: "exercise_log" as GoalDataSource,
  MANUAL: "manual" as GoalDataSource,
} as const;

/** Human-readable labels for data sources */
export const GOAL_DATA_SOURCE_LABELS: Record<GoalDataSource, string> = {
  biometric: "Biometric",
  lab: "Lab Result",
  exercise_log: "Exercise Log",
  manual: "Manual Entry",
};

/**
 * Check if a string is a valid goal data source
 */
export function isGoalDataSource(value: string): value is GoalDataSource {
  return (GOAL_DATA_SOURCES as readonly string[]).includes(value);
}

/**
 * Normalize legacy/unknown data-source values to the canonical enum.
 */
export function normalizeGoalDataSource(
  value: string | null | undefined,
): GoalDataSource {
  if (value === "measurement") return "biometric";
  const parsed = GoalDataSourceSchema.safeParse(value);
  return parsed.success ? parsed.data : "manual";
}

// ============================================================================
// HEALTH METRIC TYPES (canonical source: health-metric-types.ts)
// ============================================================================

export {
    HEALTH_METRIC_CATEGORIES,
    HEALTH_METRIC_CATEGORY_LABELS,
    HEALTH_METRIC_DIRECTIONS,
    HealthMetricCategorySchema,
    HealthMetricDirectionSchema,
    type HealthMetricCategory,
    type HealthMetricDirection
} from "./health-metric-types";

// Backwards-compatibility aliases
export { HealthMetricDirectionSchema as GoalDirectionSchema } from "./health-metric-types";
export type { HealthMetricDirection as GoalDirection } from "./health-metric-types";

// ============================================================================
// WORKOUT TYPES
// ============================================================================

/**
 * Valid workout types for training sessions and load tracking.
 * Used in analytics algorithms, training load calculations, and workout logging.
 */
export const WORKOUT_TYPES = [
  "strength",
  "cardio",
  "mixed",
  "recovery",
  "flexibility",
  "sports",
] as const;
export type WorkoutType = (typeof WORKOUT_TYPES)[number];

export const WorkoutTypeSchema = z.enum(WORKOUT_TYPES);

/** Centralized workout type constants for equality checks */
export const WORKOUT_TYPE = {
  STRENGTH: "strength" as WorkoutType,
  CARDIO: "cardio" as WorkoutType,
  MIXED: "mixed" as WorkoutType,
  RECOVERY: "recovery" as WorkoutType,
  FLEXIBILITY: "flexibility" as WorkoutType,
  SPORTS: "sports" as WorkoutType,
} as const;

/** Human-readable labels for workout types */
export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  strength: "Strength",
  cardio: "Cardio",
  mixed: "Mixed",
  recovery: "Recovery",
  flexibility: "Flexibility",
  sports: "Sports",
};

/**
 * Check if a string is a valid workout type
 */
export function isWorkoutType(value: string): value is WorkoutType {
  return (WORKOUT_TYPES as readonly string[]).includes(value);
}

// ============================================================================
// VOLUME LEVELS
// ============================================================================

// Note: VolumeLevel type, constants, and labels are imported from primitives (canonical export location)

// ============================================================================
// TRAINING PHASE CONTRACT
// ============================================================================

/**
 * Training phase contract - represents a phase within a training strategy.
 */
export interface TrainingPhaseContract {
  id: string;
  strategyId: string;
  name: string;
  order: number;
  weekCount: number;
  intensityRange?: string;
  volumeLevel?: VolumeLevel;
  focusAreas: string[];
  notes?: string;
  startDate?: string; // IsoDateString
  endDate?: string; // IsoDateString
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string; // IsoTimestampString
  updatedAt: string; // IsoTimestampString
}

export const TrainingPhaseSchema: z.ZodType<TrainingPhaseContract> = z.object({
  id: z.string().uuid(),
  strategyId: z.string().uuid(),
  name: z.string().min(1),
  order: z.number().int().min(0),
  weekCount: z.number().int().positive(),
  intensityRange: z.string().optional(),
  volumeLevel: VolumeLevelSchema.optional(),
  focusAreas: z.array(z.string()),
  notes: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean(),
  isCompleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================================
// TRAINING STRATEGY CONTRACT
// ============================================================================

/**
 * Training strategy contract - represents a complete training program.
 */
export interface TrainingStrategyContract {
  id: string;
  /**
   * User identifier in HH-XXXXXX barcode format.
   * References the patient this strategy is for.
   *
   * @format HH-XXXXXX
   */
  userId: string;
  name: string;
  description?: string;
  strategyType: StrategyType;
  status: StrategyStatus;
  goalCategory: GoalCategory;
  startDate: string; // IsoDateString
  endDate?: string; // IsoDateString
  targetWeeks: number;
  currentWeek?: number;
  phases: TrainingPhaseContract[];
  goals?: StrategyGoalContract[];
  overallProgress?: number;
  isAIGenerated?: boolean;
  aiPrompt?: string;
  notes?: string;
  tags?: string[];
  createdAt: string; // IsoTimestampString
  updatedAt: string; // IsoTimestampString
}

// ============================================================================
// STRATEGY GOALS
// ============================================================================

/**
 * Strategy goal contract - represents a measurable goal within a training strategy.
 */
export interface StrategyGoalContract {
  id: string;
  strategyId: string;
  goalMetric: string;
  goalTarget: number;
  baselineValue?: number;
  currentValue?: number;
  progressPercent?: number;
  weight?: number;
  linkedExerciseId?: string;
  dynamicMetricDefinition?: {
    dataSource: "lab" | "biometric";
    dataKey: string;
    label: string;
    unit: string;
    direction: string;
    category: string;
  };
  /** Server-enriched metric metadata (Phase 3 migration). Optional for backward compat. */
  metricDefinition?: MetricDefinitionSummary | null;
  createdAt: string;
  updatedAt: string;
}

export const StrategyGoalSchema: z.ZodType<StrategyGoalContract> = z.object({
  id: z.string().uuid(),
  strategyId: z.string().uuid(),
  goalMetric: z.string(),
  goalTarget: z.number(),
  baselineValue: z.number().optional(),
  currentValue: z.number().optional(),
  progressPercent: z.number().optional(),
  weight: z.number().optional(),
  linkedExerciseId: z.string().uuid().optional(),
  dynamicMetricDefinition: z
    .object({
      dataSource: z.enum(["lab", "biometric"]),
      dataKey: z.string(),
      label: z.string(),
      unit: z.string(),
      direction: z.string(),
      category: z.string(),
    })
    .optional(),
  /** Server-enriched metric metadata (Phase 3 migration). Optional for backward compat. */
  metricDefinition: MetricDefinitionSummarySchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TrainingStrategySchema: z.ZodType<TrainingStrategyContract> =
  z.object({
    id: z.string().uuid(),
    userId: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    strategyType: StrategyTypeSchema,
    status: StrategyStatusSchema,
    goalCategory: GoalCategorySchema,
    startDate: z.string(),
    endDate: z.string().optional(),
    targetWeeks: z.number().int().positive(),
    currentWeek: z.number().int().min(0).optional(),
    phases: z.array(TrainingPhaseSchema),
    goals: z.array(StrategyGoalSchema).optional(),
    overallProgress: z.number().optional(),
    isAIGenerated: z.boolean().optional(),
    aiPrompt: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });

// ============================================================================
// STRATEGY GENERATION PHASES (AI Generation Progress)
// ============================================================================

/**
 * Phases during AI-powered strategy generation.
 * Used for streaming progress updates to the client.
 */
export const STRATEGY_GENERATION_PHASES = [
  "analyzing_context",
  "identifying_goals",
  "checking_conflicts",
  "searching_exercises",
  "designing_periodization",
  "building_strategy",
  "generating_workouts",
  "optimizing",
  "complete",
] as const;
export type StrategyGenerationPhase =
  (typeof STRATEGY_GENERATION_PHASES)[number];

export const strategyGenerationPhaseSchema = z.enum(STRATEGY_GENERATION_PHASES);

/** Constant object for strategy generation phase comparisons */
export const STRATEGY_GENERATION_PHASE = {
  ANALYZING_CONTEXT: "analyzing_context" as StrategyGenerationPhase,
  IDENTIFYING_GOALS: "identifying_goals" as StrategyGenerationPhase,
  CHECKING_CONFLICTS: "checking_conflicts" as StrategyGenerationPhase,
  SEARCHING_EXERCISES: "searching_exercises" as StrategyGenerationPhase,
  DESIGNING_PERIODIZATION: "designing_periodization" as StrategyGenerationPhase,
  BUILDING_STRATEGY: "building_strategy" as StrategyGenerationPhase,
  GENERATING_WORKOUTS: "generating_workouts" as StrategyGenerationPhase,
  OPTIMIZING: "optimizing" as StrategyGenerationPhase,
  COMPLETE: "complete" as StrategyGenerationPhase,
} as const;

// ============================================================================
// STRATEGY GENERATION EVENTS (SSE Event Types)
// ============================================================================

/**
 * Event types emitted during AI strategy generation via SSE.
 * Used to distinguish between progress updates, completion, errors, etc.
 */
export const STRATEGY_GENERATION_EVENTS = [
  "progress",
  "complete",
  "clarification_needed",
  "error",
] as const;
export type StrategyGenerationEventType =
  (typeof STRATEGY_GENERATION_EVENTS)[number];

export const strategyGenerationEventSchema = z.enum(STRATEGY_GENERATION_EVENTS);

/** Constant object for strategy generation event comparisons */
export const STRATEGY_GENERATION_EVENT = {
  PROGRESS: "progress" as StrategyGenerationEventType,
  COMPLETE: "complete" as StrategyGenerationEventType,
  CLARIFICATION_NEEDED: "clarification_needed" as StrategyGenerationEventType,
  ERROR: "error" as StrategyGenerationEventType,
} as const;

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockTrainingPhase = (
  overrides: Partial<TrainingPhaseContract> = {},
): TrainingPhaseContract => {
  const timestamp = nowIso();
  return {
    id: "mock-phase-id",
    strategyId: "mock-strategy-id",
    name: "Foundation Phase",
    order: 0,
    weekCount: 4,
    intensityRange: "60-70%",
    volumeLevel: "moderate",
    focusAreas: ["strength", "conditioning"],
    isActive: true,
    isCompleted: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};

export const createMockTrainingStrategy = (
  overrides: Partial<TrainingStrategyContract> = {},
): TrainingStrategyContract => {
  const timestamp = nowIso();
  return {
    id: "mock-strategy-id",
    userId: "HH-ABC123",
    name: "Strength Building Program",
    description: "A 12-week progressive strength program",
    strategyType: "LINEAR_PROGRESSION",
    status: "ACTIVE",
    goalCategory: "fitness",
    startDate: "2024-01-01",
    targetWeeks: 12,
    currentWeek: 1,
    phases: [createMockTrainingPhase()],
    isAIGenerated: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};
