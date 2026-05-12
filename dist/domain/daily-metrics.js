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
import { baseDocumentSchema, isoDateSchema } from "./common.js";
import { createPaginatedListSchema } from "./pagination.js";
// ============================================================================
// SLEEP SOURCE (Domain Constants Pattern)
// ============================================================================
/** Tuple of valid sleep data source values — matches Prisma SleepSource enum */
export const SLEEP_SOURCES = ["USER", "ADMIN_ENTERED", "WEARABLE"];
export const SleepSourceSchema = z.enum(SLEEP_SOURCES);
export const SLEEP_SOURCE = {
    USER: "USER",
    ADMIN_ENTERED: "ADMIN_ENTERED",
    WEARABLE: "WEARABLE",
};
export const SLEEP_SOURCE_LABELS = {
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
    // NOTE: Range constraints (.min/.max) are intentionally absent on these output fields.
    // Validation of acceptable ranges MUST happen at the write/input layer (e.g. route or
    // service validation schemas), not here. Applying range constraints to the read/output
    // schema causes 500 errors when wearable sync data that is already persisted to the DB
    // falls outside the expected range (e.g. a wearable device returns a score of 101).
    tdeeEstimate: z.number().int().nullable().optional(),
    tdeeConfidence: z.number().nullable().optional(),
    recoveryScore: z.number().int().nullable().optional(),
    trainingLoad: z.number().int().nullable().optional(),
    strainDelta: z.number().int().nullable().optional(),
    sleepScore: z.number().int().nullable().optional(),
    readinessScore: z.number().int().nullable().optional(),
    caloricBalance: z.number().int().nullable().optional(),
    acuteChronicRatio: z.number().nullable().optional(),
    notes: z.array(z.string()).optional(),
    recommendations: z.array(z.string()).optional(),
});
/**
 * Canonical paginated daily metrics list payload.
 */
export const dailyMetricsListPayloadSchema = createPaginatedListSchema(dailyMetricsSchema);
/**
 * Canonical paginated daily metrics list response: { data, pagination }
 */
export const dailyMetricsListResponseSchema = dailyMetricsListPayloadSchema;
// ============================================================================
// MOCK FACTORY
// ============================================================================
const nowIso = () => new Date().toISOString();
export const createMockDailyMetrics = (overrides = {}) => {
    const timestamp = nowIso();
    const base = {
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
//# sourceMappingURL=daily-metrics.js.map