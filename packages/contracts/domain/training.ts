/**
 * @ai-context Training domain contracts | strategy types, statuses, goal categories
 *
 * This module provides the canonical definitions for training-related constants:
 * - Strategy types (linear_progression, undulating, block_periodization, etc.)
 * - Strategy statuses (active, completed, paused, cancelled)
 * - Goal categories (fitness, body_composition, cardiovascular, etc.)
 * - Goal data sources (biometric, lab, exercise_log, manual)
 *
 * IMPORTANT: All training-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// STRATEGY TYPES
// ============================================================================

export const STRATEGY_TYPES = [
  'linear_progression',
  'undulating',
  'block_periodization',
  'mesocycle',
  'deload',
  'custom',
] as const;
export type StrategyType = (typeof STRATEGY_TYPES)[number];

export const StrategyTypeSchema = z.enum(STRATEGY_TYPES);

export const STRATEGY_TYPE = {
  LINEAR_PROGRESSION: 'linear_progression' as StrategyType,
  UNDULATING: 'undulating' as StrategyType,
  BLOCK_PERIODIZATION: 'block_periodization' as StrategyType,
  MESOCYCLE: 'mesocycle' as StrategyType,
  DELOAD: 'deload' as StrategyType,
  CUSTOM: 'custom' as StrategyType,
} as const;

/** Human-readable labels for strategy types */
export const STRATEGY_TYPE_LABELS: Record<StrategyType, string> = {
  linear_progression: 'Linear Progression',
  undulating: 'Undulating',
  block_periodization: 'Block Periodization',
  mesocycle: 'Mesocycle',
  deload: 'Deload',
  custom: 'Custom',
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

export const STRATEGY_STATUSES = ['active', 'completed', 'paused', 'cancelled'] as const;
export type StrategyStatus = (typeof STRATEGY_STATUSES)[number];

export const StrategyStatusSchema = z.enum(STRATEGY_STATUSES);

export const STRATEGY_STATUS = {
  ACTIVE: 'active' as StrategyStatus,
  COMPLETED: 'completed' as StrategyStatus,
  PAUSED: 'paused' as StrategyStatus,
  CANCELLED: 'cancelled' as StrategyStatus,
} as const;

/** Human-readable labels for strategy statuses */
export const STRATEGY_STATUS_LABELS: Record<StrategyStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  paused: 'Paused',
  cancelled: 'Cancelled',
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
  'fitness',
  'body_composition',
  'cardiovascular',
  'metabolic',
  'hormonal',
  'performance',
] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const GoalCategorySchema = z.enum(GOAL_CATEGORIES);

/** Centralized goal category constants for equality checks */
export const GOAL_CATEGORY = {
  FITNESS: 'fitness' as GoalCategory,
  BODY_COMPOSITION: 'body_composition' as GoalCategory,
  CARDIOVASCULAR: 'cardiovascular' as GoalCategory,
  METABOLIC: 'metabolic' as GoalCategory,
  HORMONAL: 'hormonal' as GoalCategory,
  PERFORMANCE: 'performance' as GoalCategory,
} as const;

/** Human-readable labels for goal categories */
export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
  fitness: 'Fitness',
  body_composition: 'Body Composition',
  cardiovascular: 'Cardiovascular',
  metabolic: 'Metabolic',
  hormonal: 'Hormonal',
  performance: 'Performance',
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
  'biometric',
  'lab',
  'exercise_log',
  'manual',
] as const;
export type GoalDataSource = (typeof GOAL_DATA_SOURCES)[number];

export const GoalDataSourceSchema = z.enum(GOAL_DATA_SOURCES);

/** Centralized goal data source constants for equality checks */
export const GOAL_DATA_SOURCE = {
  BIOMETRIC: 'biometric' as GoalDataSource,
  LAB: 'lab' as GoalDataSource,
  EXERCISE_LOG: 'exercise_log' as GoalDataSource,
  MANUAL: 'manual' as GoalDataSource,
} as const;

/** Human-readable labels for data sources */
export const GOAL_DATA_SOURCE_LABELS: Record<GoalDataSource, string> = {
  biometric: 'Biometric',
  lab: 'Lab Result',
  exercise_log: 'Exercise Log',
  manual: 'Manual Entry',
};

/**
 * Check if a string is a valid goal data source
 */
export function isGoalDataSource(value: string): value is GoalDataSource {
  return (GOAL_DATA_SOURCES as readonly string[]).includes(value);
}

// ============================================================================
// HEALTH METRIC DIRECTION
// ============================================================================

/**
 * Improvement direction for a metric:
 * - lower_better: Decreasing value = improvement (e.g., A1C, LDL, body fat)
 * - higher_better: Increasing value = improvement (e.g., HDL, grip strength)
 * - context: Direction depends on individual (e.g., weight, testosterone)
 */
export const HEALTH_METRIC_DIRECTIONS = ['lower_better', 'higher_better', 'context'] as const;
export type HealthMetricDirection = (typeof HEALTH_METRIC_DIRECTIONS)[number];

export const HealthMetricDirectionSchema = z.enum(HEALTH_METRIC_DIRECTIONS);

// Alias for backwards compatibility
export type GoalDirection = HealthMetricDirection;
export const GoalDirectionSchema = HealthMetricDirectionSchema;

// ============================================================================
// HEALTH METRIC CATEGORIES
// ============================================================================

/** Health metric categories for grouping and scoring */
export const HEALTH_METRIC_CATEGORIES = [
  'body_composition',
  'cardiovascular',
  'metabolic',
  'hormonal',
  'performance',
  'hematology',
  'inflammatory',
  'nutritional',
] as const;
export type HealthMetricCategory = (typeof HEALTH_METRIC_CATEGORIES)[number];

export const HealthMetricCategorySchema = z.enum(HEALTH_METRIC_CATEGORIES);

/** Human-readable labels for health metric categories */
export const HEALTH_METRIC_CATEGORY_LABELS: Record<HealthMetricCategory, string> = {
  body_composition: 'Body Composition',
  cardiovascular: 'Cardiovascular',
  metabolic: 'Metabolic',
  hormonal: 'Hormonal',
  performance: 'Performance',
  hematology: 'Hematology',
  inflammatory: 'Inflammatory',
  nutritional: 'Nutritional',
};

// ============================================================================
// WORKOUT TYPES
// ============================================================================

/**
 * Valid workout types for training sessions and load tracking.
 * Used in analytics algorithms, training load calculations, and workout logging.
 */
export const WORKOUT_TYPES = [
  'strength',
  'cardio',
  'mixed',
  'recovery',
  'flexibility',
  'sports',
] as const;
export type WorkoutType = (typeof WORKOUT_TYPES)[number];

export const WorkoutTypeSchema = z.enum(WORKOUT_TYPES);

/** Centralized workout type constants for equality checks */
export const WORKOUT_TYPE = {
  STRENGTH: 'strength' as WorkoutType,
  CARDIO: 'cardio' as WorkoutType,
  MIXED: 'mixed' as WorkoutType,
  RECOVERY: 'recovery' as WorkoutType,
  FLEXIBILITY: 'flexibility' as WorkoutType,
  SPORTS: 'sports' as WorkoutType,
} as const;

/** Human-readable labels for workout types */
export const WORKOUT_TYPE_LABELS: Record<WorkoutType, string> = {
  strength: 'Strength',
  cardio: 'Cardio',
  mixed: 'Mixed',
  recovery: 'Recovery',
  flexibility: 'Flexibility',
  sports: 'Sports',
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

// Note: VolumeLevel type and VOLUME_LEVELS constant are canonically defined in admin/admin-types.ts
// Import from there if needed. We only define the schema and local constants here.
import type { VolumeLevel } from '../admin/admin-types';

export const VolumeLevelSchema = z.enum(['low', 'moderate', 'high'] as const);

export const VOLUME_LEVEL = {
  LOW: 'low' as const,
  MODERATE: 'moderate' as const,
  HIGH: 'high' as const,
} as const;

export const VOLUME_LEVEL_LABELS: Record<'low' | 'moderate' | 'high', string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
};

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
  isAIGenerated?: boolean;
  aiPrompt?: string;
  notes?: string;
  tags?: string[];
  createdAt: string; // IsoTimestampString
  updatedAt: string; // IsoTimestampString
}

export const TrainingStrategySchema: z.ZodType<TrainingStrategyContract> = z.object({
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
  'analyzing_context',
  'identifying_goals',
  'checking_conflicts',
  'searching_exercises',
  'designing_periodization',
  'building_strategy',
  'generating_workouts',
  'optimizing',
  'complete',
] as const;
export type StrategyGenerationPhase = (typeof STRATEGY_GENERATION_PHASES)[number];

export const strategyGenerationPhaseSchema = z.enum(STRATEGY_GENERATION_PHASES);

/** Constant object for strategy generation phase comparisons */
export const STRATEGY_GENERATION_PHASE = {
  ANALYZING_CONTEXT: 'analyzing_context' as StrategyGenerationPhase,
  IDENTIFYING_GOALS: 'identifying_goals' as StrategyGenerationPhase,
  CHECKING_CONFLICTS: 'checking_conflicts' as StrategyGenerationPhase,
  SEARCHING_EXERCISES: 'searching_exercises' as StrategyGenerationPhase,
  DESIGNING_PERIODIZATION: 'designing_periodization' as StrategyGenerationPhase,
  BUILDING_STRATEGY: 'building_strategy' as StrategyGenerationPhase,
  GENERATING_WORKOUTS: 'generating_workouts' as StrategyGenerationPhase,
  OPTIMIZING: 'optimizing' as StrategyGenerationPhase,
  COMPLETE: 'complete' as StrategyGenerationPhase,
} as const;

// ============================================================================
// STRATEGY GENERATION EVENTS (SSE Event Types)
// ============================================================================

/**
 * Event types emitted during AI strategy generation via SSE.
 * Used to distinguish between progress updates, completion, errors, etc.
 */
export const STRATEGY_GENERATION_EVENTS = [
  'progress',
  'complete',
  'clarification_needed',
  'error',
] as const;
export type StrategyGenerationEventType = (typeof STRATEGY_GENERATION_EVENTS)[number];

export const strategyGenerationEventSchema = z.enum(STRATEGY_GENERATION_EVENTS);

/** Constant object for strategy generation event comparisons */
export const STRATEGY_GENERATION_EVENT = {
  PROGRESS: 'progress' as StrategyGenerationEventType,
  COMPLETE: 'complete' as StrategyGenerationEventType,
  CLARIFICATION_NEEDED: 'clarification_needed' as StrategyGenerationEventType,
  ERROR: 'error' as StrategyGenerationEventType,
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
    id: 'mock-phase-id',
    strategyId: 'mock-strategy-id',
    name: 'Foundation Phase',
    order: 0,
    weekCount: 4,
    intensityRange: '60-70%',
    volumeLevel: 'moderate',
    focusAreas: ['strength', 'conditioning'],
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
    id: 'mock-strategy-id',
    userId: 'HH-ABC123',
    name: 'Strength Building Program',
    description: 'A 12-week progressive strength program',
    strategyType: 'linear_progression',
    status: 'active',
    goalCategory: 'fitness',
    startDate: '2024-01-01',
    targetWeeks: 12,
    currentWeek: 1,
    phases: [createMockTrainingPhase()],
    isAIGenerated: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};
