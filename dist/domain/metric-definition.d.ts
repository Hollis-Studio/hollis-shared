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
import { METRIC_CATEGORIES, type MetricCategory, MetricCategorySchema } from "./health-metric-types.js";
export { METRIC_CATEGORIES, MetricCategorySchema };
export type { MetricCategory };
/**
 * Lightweight view of a MetricDefinition record for embedding in API responses.
 * Contains only the fields frontends need for display and form logic.
 */
export type MetricDefinitionSummary = z.infer<typeof MetricDefinitionSummarySchema>;
export declare const MetricDefinitionSummarySchema: z.ZodObject<{
    code: z.ZodString;
    displayName: z.ZodString;
    primaryUnit: z.ZodString;
    trendDirection: z.ZodNullable<z.ZodEnum<{
        HIGHER_BETTER: "HIGHER_BETTER";
        LOWER_BETTER: "LOWER_BETTER";
        TARGET_BETTER: "TARGET_BETTER";
    }>>;
    category: z.ZodEnum<{
        LAB: "LAB";
        EXERCISE: "EXERCISE";
        BIOMETRIC: "BIOMETRIC";
        NUTRITION: "NUTRITION";
        WEARABLE: "WEARABLE";
        COMPUTED: "COMPUTED";
    }>;
    healthCategory: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    goalEligible: z.ZodBoolean;
}, z.core.$strip>;
//# sourceMappingURL=metric-definition.d.ts.map