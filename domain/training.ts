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

/** Human-readable labels for goal categories */
export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
  fitness: 'Fitness',
  body_composition: 'Body Composition',
  cardiovascular: 'Cardiovascular',
  metabolic: 'Metabolic',
  hormonal: 'Hormonal',
  performance: 'Performance',
};

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

/** Human-readable labels for data sources */
export const GOAL_DATA_SOURCE_LABELS: Record<GoalDataSource, string> = {
  biometric: 'Biometric',
  lab: 'Lab Result',
  exercise_log: 'Exercise Log',
  manual: 'Manual Entry',
};

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
