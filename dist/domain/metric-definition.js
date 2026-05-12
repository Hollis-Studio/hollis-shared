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
import { METRIC_CATEGORIES, MetricCategorySchema, TrendDirectionSchema } from "./health-metric-types.js";
// Re-export MetricCategory types (canonical source: health-metric-types.ts)
export { METRIC_CATEGORIES, MetricCategorySchema };
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
//# sourceMappingURL=metric-definition.js.map