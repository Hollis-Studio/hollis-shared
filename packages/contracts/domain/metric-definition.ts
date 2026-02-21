/**
 * @ai-context MetricDefinition Summary Contract | lightweight view of MetricDefinition for API responses
 *
 * Provides a portable summary of MetricDefinition data that can be embedded in
 * existing response payloads (biometrics, goals, strategy goals) so frontends
 * can display metric metadata without maintaining hardcoded maps.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from "zod";
import {
    METRIC_CATEGORIES,
    type MetricCategory,
    MetricCategorySchema,
    TrendDirection,
    TrendDirectionSchema,
} from "./health-metric-types";

// Re-export MetricCategory types (canonical source: health-metric-types.ts)
export { METRIC_CATEGORIES, MetricCategorySchema };
export type { MetricCategory };

// ============================================================================
// MetricDefinitionSummary
// ============================================================================

/**
 * Lightweight view of a MetricDefinition record for embedding in API responses.
 * Contains only the fields frontends need for display and form logic.
 */
export interface MetricDefinitionSummary {
  /** Canonical metric code (e.g. 'vo2_max', 'body_weight') */
  code: string;
  /** Human-readable label (e.g. 'VO2 Max', 'Body Weight') */
  displayName: string;
  /** Canonical storage unit (e.g. 'mL/kg/min', 'kg') */
  primaryUnit: string;
  /** Optimization direction: 'HIGHER_BETTER' | 'LOWER_BETTER' | 'TARGET_BETTER' */
  trendDirection: TrendDirection | null;
  /** Top-level classification: 'LAB' | 'BIOMETRIC' | 'EXERCISE' | 'NUTRITION' | 'WEARABLE' | 'COMPUTED' */
  category: MetricCategory;
  /** Sub-category for health grouping (e.g. 'cardiovascular', 'body_composition') */
  healthCategory: string | null;
  /** Detailed description for metric detail views */
  description: string | null;
  /** Whether this metric can be used as a goal target */
  goalEligible: boolean;
}

export const MetricDefinitionSummarySchema = z.object({
  code: z.string(),
  displayName: z.string(),
  primaryUnit: z.string(),
  trendDirection: TrendDirectionSchema.nullable(),
  category: MetricCategorySchema,
  healthCategory: z.string().nullable(),
  description: z.string().nullable(),
  goalEligible: z.boolean(),
});
