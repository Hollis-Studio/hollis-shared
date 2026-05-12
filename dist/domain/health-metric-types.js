/**
 * @ai-context Health Metric Shared Types | Base types used by both health-progress and health-metric-definitions
 *
 * This module exists to break circular dependencies between health-progress.ts and health-metric-definitions.ts.
 * It contains only the minimal type definitions needed by both modules.
 *
 * deps: zod | consumers: health-progress.ts, health-metric-definitions.ts
 */
import { z } from "zod";
// ============================================================================
// HEALTH METRIC DIRECTION
// ============================================================================
/**
 * Improvement direction for a metric:
 * - lower_better: Decreasing value = improvement (e.g., A1C, LDL, body fat)
 * - higher_better: Increasing value = improvement (e.g., HDL, grip strength)
 * - context: Direction depends on individual (e.g., weight, testosterone)
 */
export const HEALTH_METRIC_DIRECTIONS = [
    "lower_better",
    "higher_better",
    "context",
];
export const HealthMetricDirectionSchema = z.enum(HEALTH_METRIC_DIRECTIONS);
// ============================================================================
// HEALTH METRIC CATEGORY
// ============================================================================
/** Health metric categories for grouping and scoring */
export const HEALTH_METRIC_CATEGORIES = [
    "body_composition",
    "cardiovascular",
    "metabolic",
    "hormonal",
    "performance",
    "hematology",
    "inflammatory",
    "nutritional",
];
export const HealthMetricCategorySchema = z.enum(HEALTH_METRIC_CATEGORIES);
/** Human-readable category labels */
export const HEALTH_METRIC_CATEGORY_LABELS = {
    body_composition: "Body Composition",
    cardiovascular: "Cardiovascular",
    metabolic: "Metabolic",
    hormonal: "Hormonal",
    performance: "Performance",
    hematology: "Hematology",
    inflammatory: "Inflammatory",
    nutritional: "Nutritional",
};
// ============================================================================
// METRIC CATEGORY (Prisma Enum Alignment)
// ============================================================================
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
export const METRIC_CATEGORIES = [
    "LAB",
    "EXERCISE",
    "BIOMETRIC",
    "NUTRITION",
    "WEARABLE",
    "COMPUTED",
];
export const MetricCategorySchema = z.enum(METRIC_CATEGORIES);
/** Centralized metric category constants for equality checks */
export const METRIC_CATEGORY = {
    LAB: "LAB",
    EXERCISE: "EXERCISE",
    BIOMETRIC: "BIOMETRIC",
    NUTRITION: "NUTRITION",
    WEARABLE: "WEARABLE",
    COMPUTED: "COMPUTED",
};
/** Human-readable labels for metric categories */
export const METRIC_CATEGORY_LABELS = {
    LAB: "Lab",
    EXERCISE: "Exercise",
    BIOMETRIC: "Biometric",
    NUTRITION: "Nutrition",
    WEARABLE: "Wearable",
    COMPUTED: "Computed",
};
/**
 * Check if a string is a valid metric category
 */
export function isMetricCategory(value) {
    return METRIC_CATEGORIES.includes(value);
}
// ============================================================================
// METRIC VALUE TYPE
// ============================================================================
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
export const METRIC_VALUE_TYPES = [
    "SCALAR",
    "COMPOUND",
    "DURATION",
    "RATE",
    "PERCENTAGE",
    "SCORE",
];
export const MetricValueTypeSchema = z.enum(METRIC_VALUE_TYPES);
/** Centralized metric value type constants for equality checks */
export const METRIC_VALUE_TYPE = {
    SCALAR: "SCALAR",
    COMPOUND: "COMPOUND",
    DURATION: "DURATION",
    RATE: "RATE",
    PERCENTAGE: "PERCENTAGE",
    SCORE: "SCORE",
};
/** Human-readable labels for metric value types */
export const METRIC_VALUE_TYPE_LABELS = {
    SCALAR: "Scalar",
    COMPOUND: "Compound",
    DURATION: "Duration",
    RATE: "Rate",
    PERCENTAGE: "Percentage",
    SCORE: "Score",
};
/**
 * Check if a string is a valid metric value type
 */
export function isMetricValueType(value) {
    return METRIC_VALUE_TYPES.includes(value);
}
// ============================================================================
// TREND DIRECTION
// ============================================================================
/**
 * Trend direction - optimization direction for goals and scoring.
 *
 * - HIGHER_BETTER: Optimize for higher values (HDL, muscle mass, strength)
 * - LOWER_BETTER: Optimize for lower values (LDL, resting HR, body fat)
 * - TARGET_BETTER: Optimize toward a target range (blood pressure, glucose)
 */
export const TREND_DIRECTIONS = [
    "HIGHER_BETTER",
    "LOWER_BETTER",
    "TARGET_BETTER",
];
export const TrendDirectionSchema = z.enum(TREND_DIRECTIONS);
/** Centralized trend direction constants for equality checks */
export const TREND_DIRECTION = {
    HIGHER_BETTER: "HIGHER_BETTER",
    LOWER_BETTER: "LOWER_BETTER",
    TARGET_BETTER: "TARGET_BETTER",
};
/** Human-readable labels for trend directions */
export const TREND_DIRECTION_LABELS = {
    HIGHER_BETTER: "Higher is Better",
    LOWER_BETTER: "Lower is Better",
    TARGET_BETTER: "Target Range is Better",
};
/**
 * Check if a string is a valid trend direction
 */
export function isTrendDirection(value) {
    return TREND_DIRECTIONS.includes(value);
}
//# sourceMappingURL=health-metric-types.js.map