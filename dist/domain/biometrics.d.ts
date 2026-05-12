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
import { type BiometricSource } from "./clinical.js";
export declare const BiometricEntryContractSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    date: z.ZodString;
    key: z.ZodString;
    metricDefinitionId: z.ZodString;
    value: z.ZodNumber;
    unit: z.ZodString;
    source: z.ZodEnum<{
        LAB_REPORT: "LAB_REPORT";
        CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
        DERIVED: "DERIVED";
        APPLE_HEALTH: "APPLE_HEALTH";
        USER_LOG: "USER_LOG";
        GOOGLE_FIT: "GOOGLE_FIT";
        OURA: "OURA";
        WHOOP: "WHOOP";
        DEVICE: "DEVICE";
    }>;
    isVerified: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    metricDefinition: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
    }, z.core.$strip>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Backward-compatible schema using baseDocumentSchema.
 * Shares the same domain fields as BiometricEntryContractSchema but uses
 * baseDocumentSchema for createdAt/updatedAt and makes id optional (for creation).
 */
export declare const biometricEntrySchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    date: z.ZodString;
    key: z.ZodString;
    metricDefinitionId: z.ZodString;
    value: z.ZodNumber;
    unit: z.ZodString;
    source: z.ZodEnum<{
        LAB_REPORT: "LAB_REPORT";
        CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
        DERIVED: "DERIVED";
        APPLE_HEALTH: "APPLE_HEALTH";
        USER_LOG: "USER_LOG";
        GOOGLE_FIT: "GOOGLE_FIT";
        OURA: "OURA";
        WHOOP: "WHOOP";
        DEVICE: "DEVICE";
    }>;
    isVerified: z.ZodBoolean;
    metricDefinition: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type BiometricEntry = z.infer<typeof biometricEntrySchema>;
export type BiometricEntryContract = z.infer<typeof BiometricEntryContractSchema>;
/**
 * Canonical paginated biometric list payload.
 * Uses BiometricEntryContractSchema (required id) since list responses
 * return persisted entries that always have server-assigned IDs.
 */
export declare const biometricListPayloadSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        date: z.ZodString;
        key: z.ZodString;
        metricDefinitionId: z.ZodString;
        value: z.ZodNumber;
        unit: z.ZodString;
        source: z.ZodEnum<{
            LAB_REPORT: "LAB_REPORT";
            CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
            DERIVED: "DERIVED";
            APPLE_HEALTH: "APPLE_HEALTH";
            USER_LOG: "USER_LOG";
            GOOGLE_FIT: "GOOGLE_FIT";
            OURA: "OURA";
            WHOOP: "WHOOP";
            DEVICE: "DEVICE";
        }>;
        isVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        metricDefinition: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
        }, z.core.$strip>>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
export type BiometricListPayload = z.infer<typeof biometricListPayloadSchema>;
/**
 * Canonical paginated biometric list response: { data, pagination }
 */
export declare const biometricListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        date: z.ZodString;
        key: z.ZodString;
        metricDefinitionId: z.ZodString;
        value: z.ZodNumber;
        unit: z.ZodString;
        source: z.ZodEnum<{
            LAB_REPORT: "LAB_REPORT";
            CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
            DERIVED: "DERIVED";
            APPLE_HEALTH: "APPLE_HEALTH";
            USER_LOG: "USER_LOG";
            GOOGLE_FIT: "GOOGLE_FIT";
            OURA: "OURA";
            WHOOP: "WHOOP";
            DEVICE: "DEVICE";
        }>;
        isVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        metricDefinition: z.ZodOptional<z.ZodNullable<z.ZodObject<{
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
        }, z.core.$strip>>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
    date: string;
};
//# sourceMappingURL=biometrics.d.ts.map