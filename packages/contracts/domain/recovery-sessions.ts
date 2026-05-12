/**
 * @ai-context Recovery session contracts | structured recovery modality logging
 *
 * Canonical schemas for sauna, ice bath, red light, and similar recovery sessions.
 * These records are used for longitudinal outcome analysis and admin reporting.
 *
 * deps: zod | consumers: server, web-admin, mobile (read-only as needed)
 */

import { z } from "zod";
import { baseDocumentSchema, isoTimestampSchema } from "./common.js";
import { createPaginatedListSchema } from "./pagination.js";

export const RECOVERY_SESSION_MODALITIES = [
  "SAUNA",
  "ICE_BATH",
  "RED_LIGHT_THERAPY",
  "CRYOTHERAPY",
  "BREATHWORK",
  "MOBILITY",
  "OTHER",
] as const;

export const RecoverySessionModalitySchema = z.enum(RECOVERY_SESSION_MODALITIES);
export type RecoverySessionModality = z.infer<
  typeof RecoverySessionModalitySchema
>;

export const RECOVERY_SESSION_MODALITY = {
  SAUNA: "SAUNA",
  ICE_BATH: "ICE_BATH",
  RED_LIGHT_THERAPY: "RED_LIGHT_THERAPY",
  CRYOTHERAPY: "CRYOTHERAPY",
  BREATHWORK: "BREATHWORK",
  MOBILITY: "MOBILITY",
  OTHER: "OTHER",
} as const satisfies Record<RecoverySessionModality, RecoverySessionModality>;

export const RECOVERY_SESSION_MODALITY_LABELS: Record<
  RecoverySessionModality,
  string
> = {
  SAUNA: "Sauna",
  ICE_BATH: "Ice Bath",
  RED_LIGHT_THERAPY: "Red Light Therapy",
  CRYOTHERAPY: "Cryotherapy",
  BREATHWORK: "Breathwork",
  MOBILITY: "Mobility",
  OTHER: "Other",
};

export const RecoverySessionSchema = baseDocumentSchema.extend({
  id: z.string().uuid().optional(),
  userId: z.string(),
  appointmentId: z.string().uuid().nullable().optional(),
  modality: RecoverySessionModalitySchema,
  performedAt: isoTimestampSchema,
  durationMinutes: z.number().int().positive(),
  temperatureCelsius: z.number().finite().nullable().optional(),
  perceivedBenefitScore: z.number().int().min(1).max(10).nullable().optional(),
  notes: z.string().min(1).max(2000).nullable().optional(),
});

export type RecoverySessionContract = z.infer<typeof RecoverySessionSchema>;

export const RecoverySessionCreatePayloadSchema = z.object({
  modality: RecoverySessionModalitySchema,
  performedAt: isoTimestampSchema,
  durationMinutes: z.number().int().positive(),
  appointmentId: z.string().uuid().nullable().optional(),
  temperatureCelsius: z.number().finite().nullable().optional(),
  perceivedBenefitScore: z.number().int().min(1).max(10).nullable().optional(),
  notes: z.string().min(1).max(2000).nullable().optional(),
});

export type RecoverySessionCreatePayload = z.infer<
  typeof RecoverySessionCreatePayloadSchema
>;

export const RecoverySessionListResponseSchema = createPaginatedListSchema(
  RecoverySessionSchema,
);

export type RecoverySessionListResponse = z.infer<
  typeof RecoverySessionListResponseSchema
>;

export const createMockRecoverySession = (
  overrides: Partial<RecoverySessionContract> = {},
): RecoverySessionContract => ({
  id: overrides.id ?? "11111111-1111-4111-8111-111111111111",
  userId: overrides.userId ?? "HH-ABC123",
  appointmentId:
    overrides.appointmentId !== undefined ? overrides.appointmentId : null,
  modality: overrides.modality ?? RECOVERY_SESSION_MODALITY.SAUNA,
  performedAt: overrides.performedAt ?? new Date().toISOString(),
  durationMinutes: overrides.durationMinutes ?? 45,
  temperatureCelsius:
    overrides.temperatureCelsius !== undefined ? overrides.temperatureCelsius : 85,
  perceivedBenefitScore:
    overrides.perceivedBenefitScore !== undefined
      ? overrides.perceivedBenefitScore
      : 8,
  notes: overrides.notes !== undefined ? overrides.notes : "Great session",
  createdAt: overrides.createdAt ?? new Date().toISOString(),
  updatedAt: overrides.updatedAt ?? new Date().toISOString(),
});
