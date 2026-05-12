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
/**
 * Universal trend direction for metrics.
 * Used across various analytics visualizations.
 */
export declare const TREND_INDICATORS: readonly ["increasing", "stable", "decreasing"];
export type TrendIndicator = z.infer<typeof TrendIndicatorSchema>;
export declare const TrendIndicatorSchema: z.ZodEnum<{
    stable: "stable";
    increasing: "increasing";
    decreasing: "decreasing";
}>;
/** Centralized trend indicator constants for equality checks */
export declare const TREND_INDICATOR: {
    readonly INCREASING: TrendIndicator;
    readonly STABLE: TrendIndicator;
    readonly DECREASING: TrendIndicator;
};
/** Human-readable labels for trend indicators */
export declare const TREND_INDICATOR_LABELS: Record<TrendIndicator, string>;
/**
 * Check if a string is a valid trend indicator
 */
export declare function isTrendIndicator(value: string): value is TrendIndicator;
/**
 * Weight-specific trend indicators.
 * Used for body composition analytics.
 */
export declare const WEIGHT_TRENDS: readonly ["gaining", "stable", "losing"];
export type WeightTrend = z.infer<typeof WeightTrendSchema>;
export declare const WeightTrendSchema: z.ZodEnum<{
    stable: "stable";
    gaining: "gaining";
    losing: "losing";
}>;
/** Centralized weight trend constants for equality checks */
export declare const WEIGHT_TREND: {
    readonly GAINING: WeightTrend;
    readonly STABLE: WeightTrend;
    readonly LOSING: WeightTrend;
};
/** Human-readable labels for weight trends */
export declare const WEIGHT_TREND_LABELS: Record<WeightTrend, string>;
/**
 * Check if a string is a valid weight trend
 */
export declare function isWeightTrend(value: string): value is WeightTrend;
/**
 * Training status levels indicating current training state.
 * Used for training load and adaptation tracking.
 */
export declare const TRAINING_STATUSES: readonly ["detraining", "recovery", "maintenance", "productive", "overreaching", "overtraining"];
export type TrainingStatus = z.infer<typeof TrainingStatusSchema>;
export declare const TrainingStatusSchema: z.ZodEnum<{
    recovery: "recovery";
    maintenance: "maintenance";
    detraining: "detraining";
    productive: "productive";
    overreaching: "overreaching";
    overtraining: "overtraining";
}>;
/** Centralized training status constants for equality checks */
export declare const TRAINING_STATUS: {
    readonly DETRAINING: TrainingStatus;
    readonly RECOVERY: TrainingStatus;
    readonly MAINTENANCE: TrainingStatus;
    readonly PRODUCTIVE: TrainingStatus;
    readonly OVERREACHING: TrainingStatus;
    readonly OVERTRAINING: TrainingStatus;
};
/** Human-readable labels for training statuses */
export declare const TRAINING_STATUS_LABELS: Record<TrainingStatus, string>;
/**
 * Check if a string is a valid training status
 */
export declare function isTrainingStatus(value: string): value is TrainingStatus;
/**
 * Recovery status levels indicating recovery quality.
 * Used for HRV-based and sleep-based recovery tracking.
 */
export declare const RECOVERY_STATUSES: readonly ["poor", "low", "moderate", "good", "excellent"];
export type RecoveryStatus = z.infer<typeof RecoveryStatusSchema>;
export declare const RecoveryStatusSchema: z.ZodEnum<{
    low: "low";
    moderate: "moderate";
    excellent: "excellent";
    good: "good";
    poor: "poor";
}>;
/** Centralized recovery status constants for equality checks */
export declare const RECOVERY_STATUS: {
    readonly POOR: RecoveryStatus;
    readonly LOW: RecoveryStatus;
    readonly MODERATE: RecoveryStatus;
    readonly GOOD: RecoveryStatus;
    readonly EXCELLENT: RecoveryStatus;
};
/** Human-readable labels for recovery statuses */
export declare const RECOVERY_STATUS_LABELS: Record<RecoveryStatus, string>;
/**
 * Check if a string is a valid recovery status
 */
export declare function isRecoveryStatus(value: string): value is RecoveryStatus;
/**
 * Training-specific risk levels.
 * Named to avoid collision with churn RiskLevel in other domains.
 */
export declare const TRAINING_RISK_LEVELS: readonly ["low", "moderate", "high"];
export type TrainingRiskLevel = z.infer<typeof TrainingRiskLevelSchema>;
export declare const TrainingRiskLevelSchema: z.ZodEnum<{
    low: "low";
    moderate: "moderate";
    high: "high";
}>;
/** Centralized training risk level constants for equality checks */
export declare const TRAINING_RISK_LEVEL: {
    readonly LOW: TrainingRiskLevel;
    readonly MODERATE: TrainingRiskLevel;
    readonly HIGH: TrainingRiskLevel;
};
/** Human-readable labels for training risk levels */
export declare const TRAINING_RISK_LEVEL_LABELS: Record<TrainingRiskLevel, string>;
/**
 * Check if a string is a valid training risk level
 */
export declare function isTrainingRiskLevel(value: string): value is TrainingRiskLevel;
/**
 * Categories for grouping analytics charts.
 * Used for chart filtering and organization.
 */
export declare const CHART_CATEGORIES: readonly ["body-composition", "sleep", "heart-health", "nutrition", "activity", "biometrics"];
export type ChartCategory = z.infer<typeof ChartCategorySchema>;
export declare const ChartCategorySchema: z.ZodEnum<{
    nutrition: "nutrition";
    "body-composition": "body-composition";
    sleep: "sleep";
    "heart-health": "heart-health";
    activity: "activity";
    biometrics: "biometrics";
}>;
/** Centralized chart category constants for equality checks */
export declare const CHART_CATEGORY: {
    readonly BODY_COMPOSITION: ChartCategory;
    readonly SLEEP: ChartCategory;
    readonly HEART_HEALTH: ChartCategory;
    readonly NUTRITION: ChartCategory;
    readonly ACTIVITY: ChartCategory;
    readonly BIOMETRICS: ChartCategory;
};
/** Human-readable labels for chart categories */
export declare const CHART_CATEGORY_LABELS: Record<ChartCategory, string>;
/**
 * Check if a string is a valid chart category
 */
export declare function isChartCategory(value: string): value is ChartCategory;
/**
 * Standardized time range format for analytics.
 * Used across all chart and data visualization components.
 */
export declare const TIME_RANGES: readonly ["1d", "1w", "1m", "6m", "1y"];
export type TimeRange = z.infer<typeof TimeRangeSchema>;
export declare const TimeRangeSchema: z.ZodEnum<{
    "1d": "1d";
    "1w": "1w";
    "1m": "1m";
    "6m": "6m";
    "1y": "1y";
}>;
/** Centralized time range constants for equality checks */
export declare const TIME_RANGE: {
    readonly ONE_DAY: TimeRange;
    readonly ONE_WEEK: TimeRange;
    readonly ONE_MONTH: TimeRange;
    readonly SIX_MONTHS: TimeRange;
    readonly ONE_YEAR: TimeRange;
};
/** Human-readable labels for time ranges */
export declare const TIME_RANGE_LABELS: Record<TimeRange, string>;
/** Time range configuration with labels and day counts */
export declare const TIME_RANGE_CONFIG: Record<TimeRange, {
    label: string;
    days: number;
}>;
/**
 * Check if a string is a valid time range
 */
export declare function isTimeRange(value: string): value is TimeRange;
/**
 * Supported chart visualization types.
 */
export declare const CHART_TYPES: readonly ["line", "bar"];
export type ChartType = z.infer<typeof ChartTypeSchema>;
export declare const ChartTypeSchema: z.ZodEnum<{
    line: "line";
    bar: "bar";
}>;
/** Centralized chart type constants for equality checks */
export declare const CHART_TYPE: {
    readonly LINE: ChartType;
    readonly BAR: ChartType;
};
/** Human-readable labels for chart types */
export declare const CHART_TYPE_LABELS: Record<ChartType, string>;
/**
 * Check if a string is a valid chart type
 */
export declare function isChartType(value: string): value is ChartType;
/**
 * A single data point for chart visualization.
 */
export declare const ChartDataPointSchema: z.ZodObject<{
    label: z.ZodString;
    value: z.ZodNumber;
}, z.core.$strip>;
export type ChartDataPoint = z.infer<typeof ChartDataPointSchema>;
/**
 * A complete chart item with metadata and data points.
 */
export declare const ChartItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    data: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodNumber;
    }, z.core.$strip>>;
    type: z.ZodEnum<{
        line: "line";
        bar: "bar";
    }>;
    yAxisSuffix: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        nutrition: "nutrition";
        "body-composition": "body-composition";
        sleep: "sleep";
        "heart-health": "heart-health";
        activity: "activity";
        biometrics: "biometrics";
    }>>;
}, z.core.$strip>;
export type ChartItem = z.infer<typeof ChartItemSchema>;
/** Revenue trend data point for period-over-period comparisons */
export interface RevenueTrendPoint {
    period: string;
    revenue: number;
}
/** Churn metrics response */
export interface ChurnMetrics {
    churnRate: number;
    canceledCount: number;
    newCount: number;
    netGrowth: number;
}
/** LTV metrics response */
export interface LTVMetrics {
    averageLTV: number;
    averageLifetimeMonths: number;
    byTier: {
        tier: string;
        averageLTV: number;
        count: number;
    }[];
}
/** Delinquent user item */
export interface DelinquentUserItem {
    id: string;
    email: string;
    name: string;
    billingStatus: "DELINQUENT" | "COLLECTIONS";
    outstandingAmount: number;
    daysPastDue: number;
    sentToCollections: boolean;
    sentToCollectionsAt: string | null;
    collectionAgency: string | null;
    notes: string | null;
    lastTier: string | null;
    lastPaymentFailedAt: string | null;
    delinquencyRecordId: string | null;
}
/** Dispute item */
export interface DisputeItem {
    id: string;
    stripeDisputeId: string;
    stripeChargeId: string;
    status: "NEEDS_RESPONSE" | "UNDER_REVIEW" | "WON" | "LOST";
    reason: string;
    amount: number;
    userId: string;
    userName: string | null;
    userEmail: string | null;
    subscriptionId: string | null;
    subscriptionTier: string | null;
    subscriptionStatus: string | null;
    accountSuspendedAt: string | null;
    accountRestoredAt: string | null;
    resolution: string | null;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=analytics.d.ts.map