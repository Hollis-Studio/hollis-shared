/**
 * @ai-context Analytics domain contracts | trends, statuses, chart types, and time ranges
 *
 * This module provides the canonical definitions for analytics-related constants:
 * - Trend indicators (increasing, stable, decreasing)
 * - Weight trends (gaining, stable, losing)
 * - Training status (detraining, recovery, maintenance, productive, overreaching, overtraining)
 * - Recovery status (poor, low, moderate, good, excellent)
 * - Training risk levels (low, moderate, high)
 * - Chart categories and types
 * - Time ranges for data visualization
 *
 * IMPORTANT: All analytics-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from "zod";

// ============================================================================
// TREND INDICATOR
// ============================================================================

/**
 * Universal trend direction for metrics.
 * Used across various analytics visualizations.
 */
export const TREND_INDICATORS = ["increasing", "stable", "decreasing"] as const;
export type TrendIndicator = z.infer<typeof TrendIndicatorSchema>;

export const TrendIndicatorSchema = z.enum(TREND_INDICATORS);

/** Centralized trend indicator constants for equality checks */
export const TREND_INDICATOR = {
  INCREASING: "increasing" as TrendIndicator,
  STABLE: "stable" as TrendIndicator,
  DECREASING: "decreasing" as TrendIndicator,
} as const;

/** Human-readable labels for trend indicators */
export const TREND_INDICATOR_LABELS: Record<TrendIndicator, string> = {
  increasing: "Increasing",
  stable: "Stable",
  decreasing: "Decreasing",
};

/**
 * Check if a string is a valid trend indicator
 */
export function isTrendIndicator(value: string): value is TrendIndicator {
  return (TREND_INDICATORS as readonly string[]).includes(value);
}

// ============================================================================
// WEIGHT TREND
// ============================================================================

/**
 * Weight-specific trend indicators.
 * Used for body composition analytics.
 */
export const WEIGHT_TRENDS = ["gaining", "stable", "losing"] as const;
export type WeightTrend = z.infer<typeof WeightTrendSchema>;

export const WeightTrendSchema = z.enum(WEIGHT_TRENDS);

/** Centralized weight trend constants for equality checks */
export const WEIGHT_TREND = {
  GAINING: "gaining" as WeightTrend,
  STABLE: "stable" as WeightTrend,
  LOSING: "losing" as WeightTrend,
} as const;

/** Human-readable labels for weight trends */
export const WEIGHT_TREND_LABELS: Record<WeightTrend, string> = {
  gaining: "Gaining",
  stable: "Stable",
  losing: "Losing",
};

/**
 * Check if a string is a valid weight trend
 */
export function isWeightTrend(value: string): value is WeightTrend {
  return (WEIGHT_TRENDS as readonly string[]).includes(value);
}

// ============================================================================
// TRAINING STATUS
// ============================================================================

/**
 * Training status levels indicating current training state.
 * Used for training load and adaptation tracking.
 */
export const TRAINING_STATUSES = [
  "detraining",
  "recovery",
  "maintenance",
  "productive",
  "overreaching",
  "overtraining",
] as const;
export type TrainingStatus = z.infer<typeof TrainingStatusSchema>;

export const TrainingStatusSchema = z.enum(TRAINING_STATUSES);

/** Centralized training status constants for equality checks */
export const TRAINING_STATUS = {
  DETRAINING: "detraining" as TrainingStatus,
  RECOVERY: "recovery" as TrainingStatus,
  MAINTENANCE: "maintenance" as TrainingStatus,
  PRODUCTIVE: "productive" as TrainingStatus,
  OVERREACHING: "overreaching" as TrainingStatus,
  OVERTRAINING: "overtraining" as TrainingStatus,
} as const;

/** Human-readable labels for training statuses */
export const TRAINING_STATUS_LABELS: Record<TrainingStatus, string> = {
  detraining: "Detraining",
  recovery: "Recovery",
  maintenance: "Maintenance",
  productive: "Productive",
  overreaching: "Overreaching",
  overtraining: "Overtraining",
};

/**
 * Check if a string is a valid training status
 */
export function isTrainingStatus(value: string): value is TrainingStatus {
  return (TRAINING_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// RECOVERY STATUS
// ============================================================================

/**
 * Recovery status levels indicating recovery quality.
 * Used for HRV-based and sleep-based recovery tracking.
 */
export const RECOVERY_STATUSES = [
  "poor",
  "low",
  "moderate",
  "good",
  "excellent",
] as const;
export type RecoveryStatus = z.infer<typeof RecoveryStatusSchema>;

export const RecoveryStatusSchema = z.enum(RECOVERY_STATUSES);

/** Centralized recovery status constants for equality checks */
export const RECOVERY_STATUS = {
  POOR: "poor" as RecoveryStatus,
  LOW: "low" as RecoveryStatus,
  MODERATE: "moderate" as RecoveryStatus,
  GOOD: "good" as RecoveryStatus,
  EXCELLENT: "excellent" as RecoveryStatus,
} as const;

/** Human-readable labels for recovery statuses */
export const RECOVERY_STATUS_LABELS: Record<RecoveryStatus, string> = {
  poor: "Poor",
  low: "Low",
  moderate: "Moderate",
  good: "Good",
  excellent: "Excellent",
};

/**
 * Check if a string is a valid recovery status
 */
export function isRecoveryStatus(value: string): value is RecoveryStatus {
  return (RECOVERY_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// TRAINING RISK LEVEL
// ============================================================================

/**
 * Training-specific risk levels.
 * Named to avoid collision with churn RiskLevel in other domains.
 */
export const TRAINING_RISK_LEVELS = ["low", "moderate", "high"] as const;
export type TrainingRiskLevel = z.infer<typeof TrainingRiskLevelSchema>;

export const TrainingRiskLevelSchema = z.enum(TRAINING_RISK_LEVELS);

/** Centralized training risk level constants for equality checks */
export const TRAINING_RISK_LEVEL = {
  LOW: "low" as TrainingRiskLevel,
  MODERATE: "moderate" as TrainingRiskLevel,
  HIGH: "high" as TrainingRiskLevel,
} as const;

/** Human-readable labels for training risk levels */
export const TRAINING_RISK_LEVEL_LABELS: Record<TrainingRiskLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
};

/**
 * Check if a string is a valid training risk level
 */
export function isTrainingRiskLevel(value: string): value is TrainingRiskLevel {
  return (TRAINING_RISK_LEVELS as readonly string[]).includes(value);
}

// ============================================================================
// CHART CATEGORY
// ============================================================================

/**
 * Categories for grouping analytics charts.
 * Used for chart filtering and organization.
 */
export const CHART_CATEGORIES = [
  "body-composition",
  "sleep",
  "heart-health",
  "nutrition",
  "activity",
  "biometrics",
] as const;
export type ChartCategory = z.infer<typeof ChartCategorySchema>;

export const ChartCategorySchema = z.enum(CHART_CATEGORIES);

/** Centralized chart category constants for equality checks */
export const CHART_CATEGORY = {
  BODY_COMPOSITION: "body-composition" as ChartCategory,
  SLEEP: "sleep" as ChartCategory,
  HEART_HEALTH: "heart-health" as ChartCategory,
  NUTRITION: "nutrition" as ChartCategory,
  ACTIVITY: "activity" as ChartCategory,
  BIOMETRICS: "biometrics" as ChartCategory,
} as const;

/** Human-readable labels for chart categories */
export const CHART_CATEGORY_LABELS: Record<ChartCategory, string> = {
  "body-composition": "Body Composition",
  sleep: "Sleep",
  "heart-health": "Heart Health",
  nutrition: "Nutrition",
  activity: "Activity",
  biometrics: "Biometrics",
};

/**
 * Check if a string is a valid chart category
 */
export function isChartCategory(value: string): value is ChartCategory {
  return (CHART_CATEGORIES as readonly string[]).includes(value);
}

// ============================================================================
// TIME RANGE
// ============================================================================

/**
 * Standardized time range format for analytics.
 * Used across all chart and data visualization components.
 */
export const TIME_RANGES = ["1d", "1w", "1m", "6m", "1y"] as const;
export type TimeRange = z.infer<typeof TimeRangeSchema>;

export const TimeRangeSchema = z.enum(TIME_RANGES);

/** Centralized time range constants for equality checks */
export const TIME_RANGE = {
  ONE_DAY: "1d" as TimeRange,
  ONE_WEEK: "1w" as TimeRange,
  ONE_MONTH: "1m" as TimeRange,
  SIX_MONTHS: "6m" as TimeRange,
  ONE_YEAR: "1y" as TimeRange,
} as const;

/** Human-readable labels for time ranges */
export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "1d": "1 Day",
  "1w": "1 Week",
  "1m": "1 Month",
  "6m": "6 Months",
  "1y": "1 Year",
};

/** Time range configuration with labels and day counts */
export const TIME_RANGE_CONFIG: Record<
  TimeRange,
  { label: string; days: number }
> = {
  "1d": { label: "1 Day", days: 1 },
  "1w": { label: "1 Week", days: 7 },
  "1m": { label: "1 Month", days: 30 },
  "6m": { label: "6 Months", days: 180 },
  "1y": { label: "1 Year", days: 365 },
};

/**
 * Check if a string is a valid time range
 */
export function isTimeRange(value: string): value is TimeRange {
  return (TIME_RANGES as readonly string[]).includes(value);
}

// ============================================================================
// CHART TYPE
// ============================================================================

/**
 * Supported chart visualization types.
 */
export const CHART_TYPES = ["line", "bar"] as const;
export type ChartType = z.infer<typeof ChartTypeSchema>;

export const ChartTypeSchema = z.enum(CHART_TYPES);

/** Centralized chart type constants for equality checks */
export const CHART_TYPE = {
  LINE: "line" as ChartType,
  BAR: "bar" as ChartType,
} as const;

/** Human-readable labels for chart types */
export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  line: "Line Chart",
  bar: "Bar Chart",
};

/**
 * Check if a string is a valid chart type
 */
export function isChartType(value: string): value is ChartType {
  return (CHART_TYPES as readonly string[]).includes(value);
}

// ============================================================================
// CHART DATA STRUCTURES
// ============================================================================

/**
 * A single data point for chart visualization.
 */
export const ChartDataPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;

/**
 * A complete chart item with metadata and data points.
 */
export const ChartItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  data: z.array(ChartDataPointSchema),
  type: ChartTypeSchema,
  yAxisSuffix: z.string().optional(),
  color: z.string().optional(),
  category: ChartCategorySchema.optional(),
});
export type ChartItem = z.infer<typeof ChartItemSchema>;
