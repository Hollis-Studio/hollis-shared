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
import { type BiometricSource, BiometricSourceSchema } from "./clinical";
import { baseDocumentSchema, isoDateSchema } from "./common";
import { MetricDefinitionSummarySchema } from "./metric-definition";
import { createPaginatedListSchema } from "./pagination";

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

export type BiometricEntry = z.infer<typeof biometricEntrySchema>;

export type BiometricEntryContract = z.infer<
  typeof BiometricEntryContractSchema
>;

/**
 * Canonical paginated biometric list payload.
 * Uses BiometricEntryContractSchema (required id) since list responses
 * return persisted entries that always have server-assigned IDs.
 */
export const biometricListPayloadSchema = createPaginatedListSchema(
  BiometricEntryContractSchema,
);

export type BiometricListPayload = z.infer<typeof biometricListPayloadSchema>;

/**
 * Canonical paginated biometric list response: { data, pagination }
 */
export const biometricListResponseSchema = biometricListPayloadSchema;
export type BiometricListResponse = z.infer<typeof biometricListResponseSchema>;

/**
 * Input type for creating a new biometric entry.
 * Contains only the fields required by the server's create endpoint.
 * Server-generated fields (id, userId, isVerified, createdAt, updatedAt) are excluded.
 *
 * `metricDefinitionId` is required. The legacy `key`-primary path has been removed;
 * the server rejects any payload that omits `metricDefinitionId`.
 * `key` is a read-only display alias derived server-side from `metricDefinition.code`
 * and must not be sent on create.
 */
export type BiometricCreateInput = {
  metricDefinitionId: string;
  value: number;
  unit: string;
  source: BiometricSource;
  date: string; // ISO Date String (yyyy-mm-dd)
};
