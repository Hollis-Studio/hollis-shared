/**
 * @ai-context Recovery session contracts | structured recovery modality logging
 *
 * Canonical schemas for sauna, ice bath, red light, and similar recovery sessions.
 * These records are used for longitudinal outcome analysis and admin reporting.
 *
 * deps: zod | consumers: server, web-admin, mobile (read-only as needed)
 */
import { z } from "zod";
export declare const RECOVERY_SESSION_MODALITIES: readonly ["SAUNA", "ICE_BATH", "RED_LIGHT_THERAPY", "CRYOTHERAPY", "BREATHWORK", "MOBILITY", "OTHER"];
export declare const RecoverySessionModalitySchema: z.ZodEnum<{
    OTHER: "OTHER";
    SAUNA: "SAUNA";
    ICE_BATH: "ICE_BATH";
    RED_LIGHT_THERAPY: "RED_LIGHT_THERAPY";
    CRYOTHERAPY: "CRYOTHERAPY";
    BREATHWORK: "BREATHWORK";
    MOBILITY: "MOBILITY";
}>;
export type RecoverySessionModality = z.infer<typeof RecoverySessionModalitySchema>;
export declare const RECOVERY_SESSION_MODALITY: {
    readonly SAUNA: "SAUNA";
    readonly ICE_BATH: "ICE_BATH";
    readonly RED_LIGHT_THERAPY: "RED_LIGHT_THERAPY";
    readonly CRYOTHERAPY: "CRYOTHERAPY";
    readonly BREATHWORK: "BREATHWORK";
    readonly MOBILITY: "MOBILITY";
    readonly OTHER: "OTHER";
};
export declare const RECOVERY_SESSION_MODALITY_LABELS: Record<RecoverySessionModality, string>;
export declare const RecoverySessionSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    modality: z.ZodEnum<{
        OTHER: "OTHER";
        SAUNA: "SAUNA";
        ICE_BATH: "ICE_BATH";
        RED_LIGHT_THERAPY: "RED_LIGHT_THERAPY";
        CRYOTHERAPY: "CRYOTHERAPY";
        BREATHWORK: "BREATHWORK";
        MOBILITY: "MOBILITY";
    }>;
    performedAt: z.ZodString;
    durationMinutes: z.ZodNumber;
    temperatureCelsius: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    perceivedBenefitScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RecoverySessionContract = z.infer<typeof RecoverySessionSchema>;
export declare const RecoverySessionCreatePayloadSchema: z.ZodObject<{
    modality: z.ZodEnum<{
        OTHER: "OTHER";
        SAUNA: "SAUNA";
        ICE_BATH: "ICE_BATH";
        RED_LIGHT_THERAPY: "RED_LIGHT_THERAPY";
        CRYOTHERAPY: "CRYOTHERAPY";
        BREATHWORK: "BREATHWORK";
        MOBILITY: "MOBILITY";
    }>;
    performedAt: z.ZodString;
    durationMinutes: z.ZodNumber;
    appointmentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    temperatureCelsius: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    perceivedBenefitScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RecoverySessionCreatePayload = z.infer<typeof RecoverySessionCreatePayloadSchema>;
export declare const RecoverySessionListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        appointmentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        modality: z.ZodEnum<{
            OTHER: "OTHER";
            SAUNA: "SAUNA";
            ICE_BATH: "ICE_BATH";
            RED_LIGHT_THERAPY: "RED_LIGHT_THERAPY";
            CRYOTHERAPY: "CRYOTHERAPY";
            BREATHWORK: "BREATHWORK";
            MOBILITY: "MOBILITY";
        }>;
        performedAt: z.ZodString;
        durationMinutes: z.ZodNumber;
        temperatureCelsius: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        perceivedBenefitScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
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
export type RecoverySessionListResponse = z.infer<typeof RecoverySessionListResponseSchema>;
export declare const createMockRecoverySession: (overrides?: Partial<RecoverySessionContract>) => RecoverySessionContract;
//# sourceMappingURL=recovery-sessions.d.ts.map