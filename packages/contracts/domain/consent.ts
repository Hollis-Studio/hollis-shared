/**
 * @ai-context Consent domain contracts | patient consent record types and response schemas
 *
 * Used by:
 * - server/src/routes/consent.ts (patient-scoped download and list endpoints)
 * - server/src/routes/admin/consent.ts (admin-scoped consent management)
 *
 * PHI note: Signature blobs (signatureDataUrl, initialsData) are intentionally
 * excluded from all response schemas in this module. Only metadata is exposed.
 *
 * deps: zod | consumers: server/src/routes/consent.ts, web-admin consent pages
 */

import { z } from "zod";

// ============================================================================
// PATIENT CONSENT ENDPOINT CONSTANTS
// ============================================================================

/**
 * GET /api/consent/me/pdf — Patient downloads their own signed consent PDF.
 * Returns a presigned S3 URL. Requires authentication; userId is derived from
 * the session token (req.user.userId) so patients cannot spoof another user.
 */
export const CONSENT_PATIENT_PDF_ENDPOINT = "/api/consent/me/pdf" as const;

/**
 * GET /api/consent/me — Patient lists their own consent record metadata.
 * Returns metadata only; PHI signature blobs are excluded.
 * Requires authentication; userId is derived from the session token.
 */
export const CONSENT_PATIENT_LIST_ENDPOINT = "/api/consent/me" as const;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Response schema for GET /api/consent/me/pdf.
 *
 * url        — Presigned S3 URL (time-limited); MUST NOT be logged.
 * expiresAt  — ISO 8601 UTC timestamp at which the URL expires.
 *              Computed from service-returned expiresIn seconds.
 * fileName   — Suggested file name for the downloaded PDF (no PHI in the name).
 */
export const ConsentPdfDownloadResponseSchema = z.object({
  url: z.string(),
  expiresAt: z.string(), // ISO 8601 UTC
  fileName: z.string(),
});

export type ConsentPdfDownloadResponse = z.infer<
  typeof ConsentPdfDownloadResponseSchema
>;

/**
 * Schema for a single consent record metadata item returned in list responses.
 *
 * Intentionally excludes signatureDataUrl and initialsData to prevent
 * inadvertent logging or transmission of large base64 PHI blobs.
 */
export const ConsentRecordMetadataSchema = z.object({
  id: z.string(),
  documentType: z.string(),
  documentVersion: z.string(),
  signedAt: z.string(), // ISO 8601 UTC (serialized from Date by route layer)
  compositeContractKey: z.string().nullable(),
  contentHash: z.string().nullable(),
});

export type ConsentRecordMetadata = z.infer<typeof ConsentRecordMetadataSchema>;

/**
 * Response schema for GET /api/consent/me.
 *
 * Returns a metadata-only array of consent records.
 * PHI signature blobs are excluded at the service layer.
 */
export const ConsentRecordListResponseSchema = z.array(
  ConsentRecordMetadataSchema,
);

export type ConsentRecordListResponse = z.infer<
  typeof ConsentRecordListResponseSchema
>;
