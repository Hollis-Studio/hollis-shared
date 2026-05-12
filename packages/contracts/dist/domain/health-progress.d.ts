/**
 * @ai-context Health Progress domain contracts | shared enums and constants for health tracking
 *
 * This module provides the canonical definitions for health progress-related constants:
 * - Health trends (improving, stable, declining)
 * - Data quality levels (sufficient, sparse, insufficient)
 * - Health metric directions and categories
 * - HealthMetricKey type (string alias post-MetricDefinition migration)
 *
 * BUSINESS CONTEXT:
 * Hollis Health differentiates from standard gyms by tracking actual HEALTH OUTCOMES,
 * not just activity metrics. This enables:
 * - Demonstrating ROI to clients (is their A1C actually improving?)
 * - Identifying clients whose health is declining despite activity
 * - Providing data to referring physicians
 * - Justifying premium pricing through measurable outcomes
 *
 * ============================================================================
 * CRITICAL DATA INVARIANTS (Enforced by tests)
 * ============================================================================
 *
 * 1. METRIC-ONLY STORAGE:
 *    - Weight: ALWAYS stored in kg (never lbs)
 *    - Height: ALWAYS stored in cm (never inches/feet)
 *    - Temperature: ALWAYS stored in °C (never °F)
 *
 * 2. US LAB UNITS (not international SI):
 *    - Glucose: mg/dL (NOT mmol/L - would be 18x wrong!)
 *    - Testosterone: ng/dL (NOT nmol/L - would be 28x wrong!)
 *    - Cholesterol: mg/dL (NOT mmol/L)
 *    - HbA1c: % (NOT mmol/mol)
 *
 * 3. UNIT VALIDATION:
 *    - Data with mismatched units is REJECTED, not auto-converted
 *
 * CRITICAL: Mixing units could show false "improvement" when health is declining!
 *
 * IMPORTANT: All health trend and data quality enum values MUST be imported from here.
 *
 * NOTE: The static HEALTH_METRIC_DEFINITIONS registry was removed in Phase 6 of the
 * Unified MetricDefinition Migration. MetricDefinition records in the database are now
 * the authoritative source. HealthMetricKey is widened to string accordingly.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
import { type BiometricSource } from "./clinical.js";
import { type HealthMetricDirection } from "./health-metric-types.js";
/**
 * Improvement direction for a metric:
 * - lower_better: Decreasing value = improvement (e.g., A1C, LDL, body fat)
 * - higher_better: Increasing value = improvement (e.g., HDL, grip strength)
 * - context: Direction depends on individual (e.g., weight, testosterone)
 */
export { HEALTH_METRIC_DIRECTIONS, HealthMetricDirectionSchema, type HealthMetricDirection } from "./health-metric-types.js";
/** Health metric categories for grouping and scoring */
export { HEALTH_METRIC_CATEGORIES, HEALTH_METRIC_CATEGORY_LABELS, HealthMetricCategorySchema, type HealthMetricCategory } from "./health-metric-types.js";
/**
 * Health metric key type.
 *
 * NOTE: Previously a narrowed string-literal type derived from the static
 * HEALTH_METRIC_DEFINITIONS registry. Post-Phase-6 migration, metric identity
 * is authoritative in the MetricDefinition table. This type is widened to string
 * to support dynamic, DB-driven metric codes without compile-time enumeration.
 *
 * Consumers that previously relied on the exhaustive literal union should migrate
 * to runtime validation via MetricDefinition.code lookup.
 */
export type HealthMetricKey = z.infer<typeof HealthMetricKeySchema>;
/** Zod schema for HealthMetricKey — accepts any non-empty string */
export declare const HealthMetricKeySchema: z.ZodString;
/**
 * Health trend values indicating direction of change.
 */
export declare const HEALTH_TRENDS: readonly ["improving", "stable", "declining"];
export declare const HealthTrendSchema: z.ZodEnum<{
    improving: "improving";
    stable: "stable";
    declining: "declining";
}>;
export type HealthTrend = z.infer<typeof HealthTrendSchema>;
/** Centralized trend constants for equality checks */
export declare const HEALTH_TREND: {
    readonly IMPROVING: "improving";
    readonly STABLE: "stable";
    readonly DECLINING: "declining";
};
/** Human-readable labels for trends */
export declare const HEALTH_TREND_LABELS: Record<HealthTrend, string>;
/**
 * Check if a string is a valid health trend
 */
export declare function isHealthTrend(value: string): value is HealthTrend;
export declare const SOURCE_WEIGHTS: Record<BiometricSource, number>;
export declare const VERIFICATION_MULTIPLIER: {
    readonly verified: 1;
    readonly unverified: 0.7;
};
/**
 * Data quality levels indicating confidence in health progress calculations:
 * - sufficient: ≥3 data points per metric, can calculate meaningful trends
 * - sparse: 2 data points, can show change but not trend
 * - insufficient: <2 data points, cannot calculate progress
 */
export declare const DATA_QUALITY_LEVELS: readonly ["sufficient", "sparse", "insufficient"];
export declare const DataQualityLevelSchema: z.ZodEnum<{
    sufficient: "sufficient";
    sparse: "sparse";
    insufficient: "insufficient";
}>;
export type DataQualityLevel = z.infer<typeof DataQualityLevelSchema>;
/** Centralized data quality constants for equality checks */
export declare const DATA_QUALITY: {
    readonly SUFFICIENT: DataQualityLevel;
    readonly SPARSE: DataQualityLevel;
    readonly INSUFFICIENT: DataQualityLevel;
};
/** Human-readable labels for data quality levels */
export declare const DATA_QUALITY_LABELS: Record<DataQualityLevel, string>;
/**
 * Check if a string is a valid data quality level
 */
export declare function isDataQualityLevel(value: string): value is DataQualityLevel;
/**
 * Returns the weight for a data point based on source and verification status.
 */
export declare function getDataPointWeight(source: BiometricSource, isVerified: boolean): number;
/**
 * Determines the health trend based on percent change and an explicit metric direction.
 * Use this function when the direction is retrieved from a MetricDefinition record.
 *
 * A change of less than 3% in either direction is considered stable.
 *
 * @param direction - The improvement direction from MetricDefinition
 * @param percentChange - The percent change (can be negative)
 * @returns The health trend
 */
export declare function determineTrendFromDirection(direction: HealthMetricDirection, percentChange: number | null): HealthTrend;
//# sourceMappingURL=health-progress.d.ts.map