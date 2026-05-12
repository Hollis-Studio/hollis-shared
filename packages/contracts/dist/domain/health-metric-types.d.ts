/**
 * @ai-context Health Metric Shared Types | Base types used by both health-progress and health-metric-definitions
 *
 * This module exists to break circular dependencies between health-progress.ts and health-metric-definitions.ts.
 * It contains only the minimal type definitions needed by both modules.
 *
 * deps: zod | consumers: health-progress.ts, health-metric-definitions.ts
 */
import { z } from "zod";
/**
 * Improvement direction for a metric:
 * - lower_better: Decreasing value = improvement (e.g., A1C, LDL, body fat)
 * - higher_better: Increasing value = improvement (e.g., HDL, grip strength)
 * - context: Direction depends on individual (e.g., weight, testosterone)
 */
export declare const HEALTH_METRIC_DIRECTIONS: readonly ["lower_better", "higher_better", "context"];
export declare const HealthMetricDirectionSchema: z.ZodEnum<{
    lower_better: "lower_better";
    higher_better: "higher_better";
    context: "context";
}>;
export type HealthMetricDirection = z.infer<typeof HealthMetricDirectionSchema>;
/** Health metric categories for grouping and scoring */
export declare const HEALTH_METRIC_CATEGORIES: readonly ["body_composition", "cardiovascular", "metabolic", "hormonal", "performance", "hematology", "inflammatory", "nutritional"];
export declare const HealthMetricCategorySchema: z.ZodEnum<{
    body_composition: "body_composition";
    cardiovascular: "cardiovascular";
    metabolic: "metabolic";
    hormonal: "hormonal";
    performance: "performance";
    hematology: "hematology";
    inflammatory: "inflammatory";
    nutritional: "nutritional";
}>;
export type HealthMetricCategory = z.infer<typeof HealthMetricCategorySchema>;
/** Human-readable category labels */
export declare const HEALTH_METRIC_CATEGORY_LABELS: Record<HealthMetricCategory, string>;
/**
 * Metric category - high-level classification for metrics storage.
 * This aligns with the Prisma MetricCategory enum and represents the source/type
 * of metric data rather than health domain categorization (see HEALTH_METRIC_CATEGORIES).
 *
 * - LAB: Laboratory test results
 * - EXERCISE: Strength training and fitness exercises
 * - BIOMETRIC: Body measurements and vital signs
 * - NUTRITION: Dietary intake and nutrition data
 * - WEARABLE: Data from fitness trackers and smartwatches
 * - COMPUTED: Derived/calculated metrics (health score, training load, etc.)
 */
export declare const METRIC_CATEGORIES: readonly ["LAB", "EXERCISE", "BIOMETRIC", "NUTRITION", "WEARABLE", "COMPUTED"];
export declare const MetricCategorySchema: z.ZodEnum<{
    LAB: "LAB";
    EXERCISE: "EXERCISE";
    BIOMETRIC: "BIOMETRIC";
    NUTRITION: "NUTRITION";
    WEARABLE: "WEARABLE";
    COMPUTED: "COMPUTED";
}>;
export type MetricCategory = z.infer<typeof MetricCategorySchema>;
/** Centralized metric category constants for equality checks */
export declare const METRIC_CATEGORY: {
    readonly LAB: MetricCategory;
    readonly EXERCISE: MetricCategory;
    readonly BIOMETRIC: MetricCategory;
    readonly NUTRITION: MetricCategory;
    readonly WEARABLE: MetricCategory;
    readonly COMPUTED: MetricCategory;
};
/** Human-readable labels for metric categories */
export declare const METRIC_CATEGORY_LABELS: Record<MetricCategory, string>;
/**
 * Check if a string is a valid metric category
 */
export declare function isMetricCategory(value: string): value is MetricCategory;
/**
 * Metric value type - data structure classification.
 *
 * - SCALAR: Single numeric value (weight, glucose, cholesterol)
 * - COMPOUND: Multiple components (exercise: weight + reps + RPE)
 * - DURATION: Time-based values (sleep duration, workout duration)
 * - RATE: Values per unit time (heart rate, calories per day)
 * - PERCENTAGE: Percentage values (body fat %, A1C)
 * - SCORE: Computed scores (health score, recovery score)
 */
export declare const METRIC_VALUE_TYPES: readonly ["SCALAR", "COMPOUND", "DURATION", "RATE", "PERCENTAGE", "SCORE"];
export declare const MetricValueTypeSchema: z.ZodEnum<{
    SCALAR: "SCALAR";
    COMPOUND: "COMPOUND";
    DURATION: "DURATION";
    RATE: "RATE";
    PERCENTAGE: "PERCENTAGE";
    SCORE: "SCORE";
}>;
export type MetricValueType = z.infer<typeof MetricValueTypeSchema>;
/** Centralized metric value type constants for equality checks */
export declare const METRIC_VALUE_TYPE: {
    readonly SCALAR: MetricValueType;
    readonly COMPOUND: MetricValueType;
    readonly DURATION: MetricValueType;
    readonly RATE: MetricValueType;
    readonly PERCENTAGE: MetricValueType;
    readonly SCORE: MetricValueType;
};
/** Human-readable labels for metric value types */
export declare const METRIC_VALUE_TYPE_LABELS: Record<MetricValueType, string>;
/**
 * Check if a string is a valid metric value type
 */
export declare function isMetricValueType(value: string): value is MetricValueType;
/**
 * Trend direction - optimization direction for goals and scoring.
 *
 * - HIGHER_BETTER: Optimize for higher values (HDL, muscle mass, strength)
 * - LOWER_BETTER: Optimize for lower values (LDL, resting HR, body fat)
 * - TARGET_BETTER: Optimize toward a target range (blood pressure, glucose)
 */
export declare const TREND_DIRECTIONS: readonly ["HIGHER_BETTER", "LOWER_BETTER", "TARGET_BETTER"];
export declare const TrendDirectionSchema: z.ZodEnum<{
    HIGHER_BETTER: "HIGHER_BETTER";
    LOWER_BETTER: "LOWER_BETTER";
    TARGET_BETTER: "TARGET_BETTER";
}>;
export type TrendDirection = z.infer<typeof TrendDirectionSchema>;
/** Centralized trend direction constants for equality checks */
export declare const TREND_DIRECTION: {
    readonly HIGHER_BETTER: TrendDirection;
    readonly LOWER_BETTER: TrendDirection;
    readonly TARGET_BETTER: TrendDirection;
};
/** Human-readable labels for trend directions */
export declare const TREND_DIRECTION_LABELS: Record<TrendDirection, string>;
/**
 * Check if a string is a valid trend direction
 */
export declare function isTrendDirection(value: string): value is TrendDirection;
//# sourceMappingURL=health-metric-types.d.ts.map