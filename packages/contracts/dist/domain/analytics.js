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
export const TREND_INDICATORS = ["increasing", "stable", "decreasing"];
export const TrendIndicatorSchema = z.enum(TREND_INDICATORS);
/** Centralized trend indicator constants for equality checks */
export const TREND_INDICATOR = {
    INCREASING: "increasing",
    STABLE: "stable",
    DECREASING: "decreasing",
};
/** Human-readable labels for trend indicators */
export const TREND_INDICATOR_LABELS = {
    increasing: "Increasing",
    stable: "Stable",
    decreasing: "Decreasing",
};
/**
 * Check if a string is a valid trend indicator
 */
export function isTrendIndicator(value) {
    return TREND_INDICATORS.includes(value);
}
// ============================================================================
// WEIGHT TREND
// ============================================================================
/**
 * Weight-specific trend indicators.
 * Used for body composition analytics.
 */
export const WEIGHT_TRENDS = ["gaining", "stable", "losing"];
export const WeightTrendSchema = z.enum(WEIGHT_TRENDS);
/** Centralized weight trend constants for equality checks */
export const WEIGHT_TREND = {
    GAINING: "gaining",
    STABLE: "stable",
    LOSING: "losing",
};
/** Human-readable labels for weight trends */
export const WEIGHT_TREND_LABELS = {
    gaining: "Gaining",
    stable: "Stable",
    losing: "Losing",
};
/**
 * Check if a string is a valid weight trend
 */
export function isWeightTrend(value) {
    return WEIGHT_TRENDS.includes(value);
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
];
export const TrainingStatusSchema = z.enum(TRAINING_STATUSES);
/** Centralized training status constants for equality checks */
export const TRAINING_STATUS = {
    DETRAINING: "detraining",
    RECOVERY: "recovery",
    MAINTENANCE: "maintenance",
    PRODUCTIVE: "productive",
    OVERREACHING: "overreaching",
    OVERTRAINING: "overtraining",
};
/** Human-readable labels for training statuses */
export const TRAINING_STATUS_LABELS = {
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
export function isTrainingStatus(value) {
    return TRAINING_STATUSES.includes(value);
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
];
export const RecoveryStatusSchema = z.enum(RECOVERY_STATUSES);
/** Centralized recovery status constants for equality checks */
export const RECOVERY_STATUS = {
    POOR: "poor",
    LOW: "low",
    MODERATE: "moderate",
    GOOD: "good",
    EXCELLENT: "excellent",
};
/** Human-readable labels for recovery statuses */
export const RECOVERY_STATUS_LABELS = {
    poor: "Poor",
    low: "Low",
    moderate: "Moderate",
    good: "Good",
    excellent: "Excellent",
};
/**
 * Check if a string is a valid recovery status
 */
export function isRecoveryStatus(value) {
    return RECOVERY_STATUSES.includes(value);
}
// ============================================================================
// TRAINING RISK LEVEL
// ============================================================================
/**
 * Training-specific risk levels.
 * Named to avoid collision with churn RiskLevel in other domains.
 */
export const TRAINING_RISK_LEVELS = ["low", "moderate", "high"];
export const TrainingRiskLevelSchema = z.enum(TRAINING_RISK_LEVELS);
/** Centralized training risk level constants for equality checks */
export const TRAINING_RISK_LEVEL = {
    LOW: "low",
    MODERATE: "moderate",
    HIGH: "high",
};
/** Human-readable labels for training risk levels */
export const TRAINING_RISK_LEVEL_LABELS = {
    low: "Low",
    moderate: "Moderate",
    high: "High",
};
/**
 * Check if a string is a valid training risk level
 */
export function isTrainingRiskLevel(value) {
    return TRAINING_RISK_LEVELS.includes(value);
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
];
export const ChartCategorySchema = z.enum(CHART_CATEGORIES);
/** Centralized chart category constants for equality checks */
export const CHART_CATEGORY = {
    BODY_COMPOSITION: "body-composition",
    SLEEP: "sleep",
    HEART_HEALTH: "heart-health",
    NUTRITION: "nutrition",
    ACTIVITY: "activity",
    BIOMETRICS: "biometrics",
};
/** Human-readable labels for chart categories */
export const CHART_CATEGORY_LABELS = {
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
export function isChartCategory(value) {
    return CHART_CATEGORIES.includes(value);
}
// ============================================================================
// TIME RANGE
// ============================================================================
/**
 * Standardized time range format for analytics.
 * Used across all chart and data visualization components.
 */
export const TIME_RANGES = ["1d", "1w", "1m", "6m", "1y"];
export const TimeRangeSchema = z.enum(TIME_RANGES);
/** Centralized time range constants for equality checks */
export const TIME_RANGE = {
    ONE_DAY: "1d",
    ONE_WEEK: "1w",
    ONE_MONTH: "1m",
    SIX_MONTHS: "6m",
    ONE_YEAR: "1y",
};
/** Human-readable labels for time ranges */
export const TIME_RANGE_LABELS = {
    "1d": "1 Day",
    "1w": "1 Week",
    "1m": "1 Month",
    "6m": "6 Months",
    "1y": "1 Year",
};
/** Time range configuration with labels and day counts */
export const TIME_RANGE_CONFIG = {
    "1d": { label: "1 Day", days: 1 },
    "1w": { label: "1 Week", days: 7 },
    "1m": { label: "1 Month", days: 30 },
    "6m": { label: "6 Months", days: 180 },
    "1y": { label: "1 Year", days: 365 },
};
/**
 * Check if a string is a valid time range
 */
export function isTimeRange(value) {
    return TIME_RANGES.includes(value);
}
// ============================================================================
// CHART TYPE
// ============================================================================
/**
 * Supported chart visualization types.
 */
export const CHART_TYPES = ["line", "bar"];
export const ChartTypeSchema = z.enum(CHART_TYPES);
/** Centralized chart type constants for equality checks */
export const CHART_TYPE = {
    LINE: "line",
    BAR: "bar",
};
/** Human-readable labels for chart types */
export const CHART_TYPE_LABELS = {
    line: "Line Chart",
    bar: "Bar Chart",
};
/**
 * Check if a string is a valid chart type
 */
export function isChartType(value) {
    return CHART_TYPES.includes(value);
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
//# sourceMappingURL=analytics.js.map