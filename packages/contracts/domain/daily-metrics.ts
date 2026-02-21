/**
 * @ai-context Daily metrics domain contracts | TDEE, recovery, training load schemas
 *
 * This module provides the canonical definitions for daily metrics:
 * - TDEE estimates, recovery scores, training load
 * - Sleep performance, readiness scores
 * - Caloric balance, strain metrics
 *
 * IMPORTANT: All daily metrics types MUST be imported from here.
 *
 * deps: zod, common.ts | consumers: all codebases
 */

import { z } from "zod";
import { baseDocumentSchema, isoDateSchema } from "./common";
import { createPaginatedListSchema } from "./pagination";

// ============================================================================
// SLEEP SOURCE (Domain Constants Pattern)
// ============================================================================

/** Tuple of valid sleep data source values — matches Prisma SleepSource enum */
export const SLEEP_SOURCES = ["USER", "ADMIN_ENTERED", "WEARABLE"] as const;
export type SleepSource = (typeof SLEEP_SOURCES)[number];

export const SleepSourceSchema = z.enum(SLEEP_SOURCES);

export const SLEEP_SOURCE = {
  USER: "USER",
  ADMIN_ENTERED: "ADMIN_ENTERED",
  WEARABLE: "WEARABLE",
} as const satisfies Record<SleepSource, SleepSource>;

export const SLEEP_SOURCE_LABELS: Record<SleepSource, string> = {
  USER: "User Reported",
  ADMIN_ENTERED: "Admin Entered",
  WEARABLE: "Wearable Device",
};

// ============================================================================
// DAILY METRICS CONTRACT
// ============================================================================

export const dailyMetricsSchema = baseDocumentSchema.extend({
  id: z.string().optional(),
  userId: z.string(),
  date: isoDateSchema,
  tdeeEstimate: z.number().int().min(0).nullable().optional(),
  tdeeConfidence: z.number().min(0).max(1).optional().nullable(),
  recoveryScore: z.number().int().min(0).max(100).nullable().optional(),
  trainingLoad: z.number().int().min(0).nullable().optional(),
  strainDelta: z.number().int().optional(),
  sleepScore: z.number().int().min(0).max(100).optional(),
  readinessScore: z.number().int().min(0).max(100).optional(),
  caloricBalance: z.number().int().optional(),
  acuteChronicRatio: z.number().min(0).optional(),
  notes: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
});

export type DailyMetricsContract = z.infer<typeof dailyMetricsSchema>;

/**
 * Canonical paginated daily metrics list payload.
 */
export const dailyMetricsListPayloadSchema =
  createPaginatedListSchema(dailyMetricsSchema);

/**
 * Backward-compatible daily metrics list payload:
 * - canonical paginated payload: { data, pagination }
 * - legacy array payload: DailyMetrics[]
 */
export const dailyMetricsListResponseSchema = z.union([
  dailyMetricsListPayloadSchema,
  z.array(dailyMetricsSchema),
]);

export type DailyMetricsListPayload = z.infer<
  typeof dailyMetricsListPayloadSchema
>;
export type DailyMetricsListResponse = z.infer<
  typeof dailyMetricsListResponseSchema
>;

// ============================================================================
// MOCK FACTORY
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockDailyMetrics = (
  overrides: Partial<DailyMetricsContract> = {},
): DailyMetricsContract => {
  const timestamp = nowIso();
  const base: DailyMetricsContract = {
    id: overrides.id ?? overrides.date ?? "2024-01-01",
    userId: overrides.userId ?? "HH-ABC123",
    date: overrides.date ?? "2024-01-01",
    tdeeEstimate: overrides.tdeeEstimate ?? 2150,
    tdeeConfidence: overrides.tdeeConfidence ?? 0.72,
    recoveryScore: overrides.recoveryScore ?? 82,
    trainingLoad: overrides.trainingLoad ?? 45,
    strainDelta: overrides.strainDelta ?? -5,
    sleepScore: overrides.sleepScore ?? 78,
    readinessScore: overrides.readinessScore ?? 80,
    caloricBalance: overrides.caloricBalance ?? -250,
    acuteChronicRatio: overrides.acuteChronicRatio ?? 1.05,
    notes: overrides.notes ?? ["Maintain hydration throughout the day."],
    recommendations: overrides.recommendations ?? [
      "Consider a light recovery ride.",
    ],
    createdAt: overrides.createdAt ?? timestamp,
    updatedAt: overrides.updatedAt ?? timestamp,
  };
  return { ...base, ...overrides };
};
