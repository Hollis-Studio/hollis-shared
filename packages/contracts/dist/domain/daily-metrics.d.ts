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
/** Tuple of valid sleep data source values — matches Prisma SleepSource enum */
export declare const SLEEP_SOURCES: readonly ["USER", "ADMIN_ENTERED", "WEARABLE"];
export type SleepSource = z.infer<typeof SleepSourceSchema>;
export declare const SleepSourceSchema: z.ZodEnum<{
    WEARABLE: "WEARABLE";
    USER: "USER";
    ADMIN_ENTERED: "ADMIN_ENTERED";
}>;
export declare const SLEEP_SOURCE: {
    readonly USER: "USER";
    readonly ADMIN_ENTERED: "ADMIN_ENTERED";
    readonly WEARABLE: "WEARABLE";
};
export declare const SLEEP_SOURCE_LABELS: Record<SleepSource, string>;
export declare const dailyMetricsSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    date: z.ZodString;
    tdeeEstimate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tdeeConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    recoveryScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    trainingLoad: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    strainDelta: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sleepScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    readinessScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    caloricBalance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    acuteChronicRatio: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    recommendations: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type DailyMetricsContract = z.infer<typeof dailyMetricsSchema>;
/**
 * Canonical paginated daily metrics list payload.
 */
export declare const dailyMetricsListPayloadSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        date: z.ZodString;
        tdeeEstimate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tdeeConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        recoveryScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        trainingLoad: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        strainDelta: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sleepScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        readinessScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        caloricBalance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        acuteChronicRatio: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        notes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        recommendations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type DailyMetricsListPayload = z.infer<typeof dailyMetricsListPayloadSchema>;
/**
 * Canonical paginated daily metrics list response: { data, pagination }
 */
export declare const dailyMetricsListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        date: z.ZodString;
        tdeeEstimate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tdeeConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        recoveryScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        trainingLoad: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        strainDelta: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sleepScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        readinessScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        caloricBalance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        acuteChronicRatio: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        notes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        recommendations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type DailyMetricsListResponse = z.infer<typeof dailyMetricsListResponseSchema>;
export declare const createMockDailyMetrics: (overrides?: Partial<DailyMetricsContract>) => DailyMetricsContract;
//# sourceMappingURL=daily-metrics.d.ts.map