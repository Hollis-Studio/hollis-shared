/**
 * @ai-context Biometric Entry Contract | schemas for biometric data ingestion and display
 *
 * Provides the canonical Zod schemas and TypeScript types for BiometricEntry
 * API contracts. The legacy BiometricKey string-enum registry has been removed;
 * metric identity is now expressed via MetricDefinition FK.
 *
 * deps: zod, ./clinical, ./common, ./metric-definition | consumers: all codebases
 */
import { z } from "zod";
import { BiometricSourceSchema } from "./clinical.js";
import { baseDocumentSchema, isoDateSchema } from "./common.js";
import { MetricDefinitionSummarySchema } from "./metric-definition.js";
import { createPaginatedListSchema } from "./pagination.js";
// ============================================================================
// BIOMETRIC ENTRY CONTRACT
// ============================================================================
export const BiometricEntryContractSchema = z.object({
    id: z.string(),
    userId: z.string(),
    date: z.string(),
    /** @computed Derived from metricDefinition.code at serialisation time. Not stored as a DB column. */
    key: z.string().min(1),
    metricDefinitionId: z.string(),
    value: z.number().min(0),
    unit: z.string().max(50),
    source: BiometricSourceSchema,
    isVerified: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
    metricDefinition: MetricDefinitionSummarySchema.nullable().optional(),
    /** Optional clinician/trainer note attached to this reading. Null when absent. */
    notes: z.string().nullable().optional(),
});
/**
 * Backward-compatible schema using baseDocumentSchema.
 * Shares the same domain fields as BiometricEntryContractSchema but uses
 * baseDocumentSchema for createdAt/updatedAt and makes id optional (for creation).
 */
export const biometricEntrySchema = baseDocumentSchema.extend({
    id: z.string().optional(),
    userId: z.string(),
    date: isoDateSchema,
    /** Display key alias (derived from metricDefinition.code). */
    key: z.string().min(1),
    metricDefinitionId: z.string().min(1),
    value: z.number().min(0),
    unit: z.string().min(1).max(50),
    source: BiometricSourceSchema,
    isVerified: z.boolean(),
    metricDefinition: MetricDefinitionSummarySchema.nullable().optional(),
});
/**
 * Canonical paginated biometric list payload.
 * Uses BiometricEntryContractSchema (required id) since list responses
 * return persisted entries that always have server-assigned IDs.
 */
export const biometricListPayloadSchema = createPaginatedListSchema(BiometricEntryContractSchema);
/**
 * Canonical paginated biometric list response: { data, pagination }
 */
export const biometricListResponseSchema = biometricListPayloadSchema;
//# sourceMappingURL=biometrics.js.map