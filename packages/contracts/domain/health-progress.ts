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
import { type BiometricSource } from "./clinical";
import { type HealthMetricDirection } from "./health-metric-types";

// ============================================================================
// HEALTH METRIC DIRECTION
// ============================================================================

/**
 * Improvement direction for a metric:
 * - lower_better: Decreasing value = improvement (e.g., A1C, LDL, body fat)
 * - higher_better: Increasing value = improvement (e.g., HDL, grip strength)
 * - context: Direction depends on individual (e.g., weight, testosterone)
 */
export {
    HEALTH_METRIC_DIRECTIONS,
    HealthMetricDirectionSchema,
    type HealthMetricDirection
} from "./health-metric-types";

// ============================================================================
// HEALTH METRIC CATEGORY
// ============================================================================

/** Health metric categories for grouping and scoring */
export {
    HEALTH_METRIC_CATEGORIES,
    HEALTH_METRIC_CATEGORY_LABELS,
    HealthMetricCategorySchema,
    type HealthMetricCategory
} from "./health-metric-types";

// ============================================================================
// HEALTH METRIC KEY
// ============================================================================

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
export type HealthMetricKey = string;

/** Zod schema for HealthMetricKey — accepts any non-empty string */
export const HealthMetricKeySchema = z.string().min(1);

// ============================================================================
// HEALTH TREND
// ============================================================================

/**
 * Health trend values indicating direction of change.
 */
export const HEALTH_TRENDS = ["improving", "stable", "declining"] as const;
export type HealthTrend = (typeof HEALTH_TRENDS)[number];

export const HealthTrendSchema = z.enum(HEALTH_TRENDS);

/** Centralized trend constants for equality checks */
export const HEALTH_TREND = {
  IMPROVING: "improving",
  STABLE: "stable",
  DECLINING: "declining",
} as const;

/** Human-readable labels for trends */
export const HEALTH_TREND_LABELS: Record<HealthTrend, string> = {
  improving: "Improving",
  stable: "Stable",
  declining: "Declining",
};

/**
 * Check if a string is a valid health trend
 */
export function isHealthTrend(value: string): value is HealthTrend {
  return (HEALTH_TRENDS as readonly string[]).includes(value);
}

// ============================================================================
// DATA WEIGHTING
// ============================================================================

export const SOURCE_WEIGHTS: Record<BiometricSource, number> = {
  LAB_REPORT: 1.0,
  CLINICIAN_ENTRY: 1.0,
  DERIVED: 0.9,
  APPLE_HEALTH: 0.8,
  OURA: 0.75,
  WHOOP: 0.75,
  GOOGLE_FIT: 0.7,
  DEVICE: 0.7,
  USER_LOG: 0.6,
};

export const VERIFICATION_MULTIPLIER = {
  verified: 1.0,
  unverified: 0.7,
} as const;

// ============================================================================
// DATA QUALITY
// ============================================================================

/**
 * Data quality levels indicating confidence in health progress calculations:
 * - sufficient: ≥3 data points per metric, can calculate meaningful trends
 * - sparse: 2 data points, can show change but not trend
 * - insufficient: <2 data points, cannot calculate progress
 */
export const DATA_QUALITY_LEVELS = [
  "sufficient",
  "sparse",
  "insufficient",
] as const;
export type DataQualityLevel = (typeof DATA_QUALITY_LEVELS)[number];

export const DataQualityLevelSchema = z.enum(DATA_QUALITY_LEVELS);

/** Centralized data quality constants for equality checks */
export const DATA_QUALITY = {
  SUFFICIENT: "sufficient" as DataQualityLevel,
  SPARSE: "sparse" as DataQualityLevel,
  INSUFFICIENT: "insufficient" as DataQualityLevel,
} as const;

/** Human-readable labels for data quality levels */
export const DATA_QUALITY_LABELS: Record<DataQualityLevel, string> = {
  sufficient: "Sufficient Data",
  sparse: "Sparse Data",
  insufficient: "Insufficient Data",
};

/**
 * Check if a string is a valid data quality level
 */
export function isDataQualityLevel(value: string): value is DataQualityLevel {
  return (DATA_QUALITY_LEVELS as readonly string[]).includes(value);
}

// ============================================================================
// ADDITIONAL UTILITY FUNCTIONS
// ============================================================================

/**
 * Returns the weight for a data point based on source and verification status.
 */
export function getDataPointWeight(
  source: BiometricSource,
  isVerified: boolean,
): number {
  const base = SOURCE_WEIGHTS[source];
  const verification = isVerified
    ? VERIFICATION_MULTIPLIER.verified
    : VERIFICATION_MULTIPLIER.unverified;
  return Math.min(1, Math.max(0, base * verification));
}

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
export function determineTrendFromDirection(
  direction: HealthMetricDirection,
  percentChange: number | null,
): HealthTrend {
  if (percentChange === null) {
    return HEALTH_TREND.STABLE;
  }

  const STABILITY_THRESHOLD = 3; // ±3% is considered stable

  if (Math.abs(percentChange) < STABILITY_THRESHOLD) {
    return HEALTH_TREND.STABLE;
  }

  if (direction === "context") {
    return HEALTH_TREND.STABLE;
  }

  const isIncreasing = percentChange > 0;

  if (direction === "higher_better") {
    return isIncreasing ? HEALTH_TREND.IMPROVING : HEALTH_TREND.DECLINING;
  } else {
    // lower_better
    return isIncreasing ? HEALTH_TREND.DECLINING : HEALTH_TREND.IMPROVING;
  }
}
