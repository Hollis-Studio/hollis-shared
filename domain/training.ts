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
import { VolumeLevelSchema } from "../primitives";
import { MetricDefinitionSummarySchema } from "./metric-definition";

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
export const StrategyTypeSchema = z.enum(STRATEGY_TYPES);
export type StrategyType = z.infer<typeof StrategyTypeSchema>;

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
export const StrategyStatusSchema = z.enum(STRATEGY_STATUSES);
export type StrategyStatus = z.infer<typeof StrategyStatusSchema>;

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
export const GoalCategorySchema = z.enum(GOAL_CATEGORIES);
export type GoalCategory = z.infer<typeof GoalCategorySchema>;

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
export const GoalDataSourceSchema = z.enum(GOAL_DATA_SOURCES);
export type GoalDataSource = z.infer<typeof GoalDataSourceSchema>;

/**
 * @deprecated Compatibility alias; canonical goal data-source values only.
 */
export const LEGACY_GOAL_DATA_SOURCES = GOAL_DATA_SOURCES;
export const LegacyGoalDataSourceSchema = GoalDataSourceSchema;
export type LegacyGoalDataSource = GoalDataSource;

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
 * Legacy value mapping for goal data sources persisted before the canonical
 * GOAL_DATA_SOURCES enum was established. Maps old string values to their
 * canonical equivalents before Zod validation.
 */
const LEGACY_GOAL_DATA_SOURCE_MAP: Record<string, GoalDataSource> = {
  measurement: "biometric",
};

/**
 * Normalize a goal data-source value, mapping legacy values to their canonical
 * equivalents. Throws a ZodError for unrecognized values.
 *
 * Legacy mappings:
 * - "measurement" → "biometric"
 */
export function normalizeGoalDataSource(
  value: string | null | undefined,
): GoalDataSource {
  const normalized =
    value != null && value in LEGACY_GOAL_DATA_SOURCE_MAP
      ? LEGACY_GOAL_DATA_SOURCE_MAP[value]
      : value;
  return GoalDataSourceSchema.parse(normalized);
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
export const WorkoutTypeSchema = z.enum(WORKOUT_TYPES);
export type WorkoutType = z.infer<typeof WorkoutTypeSchema>;

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
 *
 * @deprecated Use DetailedTrainingPhaseSchema from training-strategy.ts for new code.
 * This schema will be removed after 2026-09-01.
 */
export const TrainingPhaseSchema = z.object({
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
export type TrainingPhaseContract = z.infer<typeof TrainingPhaseSchema>;

// ============================================================================
// STRATEGY GOALS
// ============================================================================

/**
 * Strategy goal contract - represents a measurable goal within a training strategy.
 *
 * @deprecated Use DetailedStrategyGoalSchema from training-strategy.ts for new code.
 * This schema will be removed after 2026-09-01.
 */
export const StrategyGoalSchema = z.object({
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
export type StrategyGoalContract = z.infer<typeof StrategyGoalSchema>;

// ============================================================================
// TRAINING STRATEGY CONTRACT
// ============================================================================

/**
 * Training strategy contract - represents a complete training program.
 */
export const TrainingStrategySchema = z.object({
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
export type TrainingStrategyContract = z.infer<typeof TrainingStrategySchema>;

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
export const strategyGenerationPhaseSchema = z.enum(STRATEGY_GENERATION_PHASES);
export type StrategyGenerationPhase = z.infer<
  typeof strategyGenerationPhaseSchema
>;

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
export type StrategyGenerationEvent = z.infer<
  typeof strategyGenerationEventSchema
>;

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
