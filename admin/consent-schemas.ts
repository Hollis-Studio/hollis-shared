/**
 * @ai-context Admin Consent Schemas | Zod schemas and constants for legal document signing
 *
 * This module defines all contracts for the consent capture flow used in the
 * ConsultationFlowModal. It covers:
 * - Document type enum + constants
 * - Per-document initials section key constants
 * - Photo/video opt-in type constants
 * - Request/response schemas for the consent submission API
 *
 * PHI note: Signature data URLs are treated as legally sensitive. Never log their values.
 *
 * deps: zod, domain/user | consumers: web-admin/*, server/src/routes/admin/consent.ts
 */

import { z } from "zod";
import { UserTierSchema } from "../domain/user";

// ============================================================================
// CONSENT DOCUMENT TYPE
// ============================================================================

/**
 * All legal document types that may be signed during the onboarding flow.
 * Maps 1:1 to the ConsentDocumentType Prisma enum.
 */
export const CONSENT_DOCUMENT_TYPES = [
  "MEMBERSHIP_AGREEMENT",
  "LIABILITY_WAIVER",
  "INFORMED_CONSENT",
  "ELECTRONIC_COMMS_CONSENT",
  "PHOTO_VIDEO_RELEASE",
] as const;

export const ConsentDocumentTypeSchema = z.enum(CONSENT_DOCUMENT_TYPES);
export type ConsentDocumentType = z.infer<typeof ConsentDocumentTypeSchema>;

/** Centralized consent document type constants for equality checks */
export const CONSENT_DOCUMENT_TYPE = {
  MEMBERSHIP_AGREEMENT: "MEMBERSHIP_AGREEMENT",
  LIABILITY_WAIVER: "LIABILITY_WAIVER",
  INFORMED_CONSENT: "INFORMED_CONSENT",
  ELECTRONIC_COMMS_CONSENT: "ELECTRONIC_COMMS_CONSENT",
  PHOTO_VIDEO_RELEASE: "PHOTO_VIDEO_RELEASE",
} as const satisfies Record<ConsentDocumentType, ConsentDocumentType>;

/**
 * The 4 documents that MUST be signed before payment may proceed.
 * PHOTO_VIDEO_RELEASE is optional and excluded from this list.
 */
export const REQUIRED_CONSENT_DOCS = [
  CONSENT_DOCUMENT_TYPE.MEMBERSHIP_AGREEMENT,
  CONSENT_DOCUMENT_TYPE.LIABILITY_WAIVER,
  CONSENT_DOCUMENT_TYPE.INFORMED_CONSENT,
  CONSENT_DOCUMENT_TYPE.ELECTRONIC_COMMS_CONSENT,
] as const satisfies readonly ConsentDocumentType[];

/**
 * Documents that are optional — the user may skip without blocking payment.
 */
export const OPTIONAL_CONSENT_DOCS = [
  CONSENT_DOCUMENT_TYPE.PHOTO_VIDEO_RELEASE,
] as const satisfies readonly ConsentDocumentType[];

// ============================================================================
// INITIALS SECTION KEY CONSTANTS
// ============================================================================

/**
 * Section keys for initials required in the Membership Agreement.
 * Each key identifies an initialed paragraph in the rendered document.
 */
export const MEMBERSHIP_INITIALS = {
  ASSUMPTION_OF_RISK: "assumption_of_risk",
  BINDING_ARBITRATION: "binding_arbitration",
  CLASS_ACTION_WAIVER: "class_action_waiver",
  EARLY_TERMINATION: "early_termination",
} as const;
export type MembershipInitialsKey =
  (typeof MEMBERSHIP_INITIALS)[keyof typeof MEMBERSHIP_INITIALS];

/**
 * Section keys for initials required in the Liability Waiver.
 */
export const LIABILITY_INITIALS = {
  EXERCISE: "exercise",
  INFRARED_SAUNA: "infrared_sauna",
  COLD_WATER: "cold_water",
  RED_LIGHT: "red_light",
  RELEASE_COVENANT: "release_covenant",
} as const;
export type LiabilityInitialsKey =
  (typeof LIABILITY_INITIALS)[keyof typeof LIABILITY_INITIALS];

/**
 * Section keys for initials required in the Informed Consent document.
 */
export const INFORMED_CONSENT_INITIALS = {
  LAB_TESTING: "lab_testing",
  BIA: "bia",
  DXA: "dxa",
  WELLNESS_SCREENING: "wellness_screening",
  COORDINATION_AUTH: "coordination_auth",
} as const;
export type InformedConsentInitialsKey =
  (typeof INFORMED_CONSENT_INITIALS)[keyof typeof INFORMED_CONSENT_INITIALS];

// ============================================================================
// PHOTO / VIDEO OPT-IN TYPE CONSTANTS
// ============================================================================

/**
 * Opt-in use types for the Photo/Video Release document.
 * Each key represents a specific approved use that the client may independently
 * consent to. Shape when stored: Record<PhotoVideoUseType, boolean>
 */
export const PHOTO_VIDEO_USE_TYPES = {
  MARKETING_SOCIAL: "marketing_social",
  TRAINING_REVIEW: "training_review",
  TESTIMONIAL: "testimonial",
  INTERNAL_RECORDS: "internal_records",
} as const;
export type PhotoVideoUseType =
  (typeof PHOTO_VIDEO_USE_TYPES)[keyof typeof PHOTO_VIDEO_USE_TYPES];

// ============================================================================
// SIGNED DOCUMENT PAYLOAD SCHEMA
// ============================================================================

/**
 * Shape of a single signed document submitted from the client.
 * One of these is produced per completed signing step.
 *
 * @field signatureDataUrl - Base64 PNG data URL of the drawn signature.
 *   Never log this value.
 * @field initialsData - Optional map of section key → base64 PNG data URL.
 *   Present for documents that require per-section initials.
 * @field optInSelections - Optional map of use type → boolean.
 *   Present for PHOTO_VIDEO_RELEASE only.
 * @field contentHash - Optional SHA-256 hash of the document content at signing time.
 *   Enables tamper-detection post-signing.
 * @field documentContent - Optional full substituted document text at signing time.
 *   Sent by the client so the server can embed the actual text in the PDF and
 *   compute the content hash. Treated as legally sensitive — never log.
 */
export const SignedDocumentPayloadSchema = z.object({
  documentType: ConsentDocumentTypeSchema,
  documentVersion: z.string().min(1).max(20),
  signatureDataUrl: z
    .string()
    .min(1)
    .regex(
      /^data:image\/png;base64,[A-Za-z0-9+/]+=*$/,
      "Must be a base64 PNG data URL",
    ),
  initialsData: z.record(z.string(), z.string()).optional(),
  optInSelections: z.record(z.string(), z.boolean()).optional(),
  contentHash: z.string().optional(), // SHA-256 hash of document content at signing time
  documentContent: z.string().optional(), // Full substituted document text at signing time
});
export type SignedDocumentPayload = z.infer<typeof SignedDocumentPayloadSchema>;

// ============================================================================
// ENROLLMENT SUMMARY SCHEMA
// ============================================================================

/**
 * Enrollment Summary (Exhibit A of the Membership Agreement).
 * Generated from the tier + contract duration selections made earlier in the flow.
 * Embedded in the composite PDF cover page.
 */
export const EnrollmentSummarySchema = z.object({
  tier: UserTierSchema,
  /** Contract commitment length in months (4, 8, or 12). */
  contractDuration: z.number().int().positive(),
  /** ISO date string for the anticipated start date (e.g. "2026-04-01"). */
  startDate: z.string().min(1),
  /** ISO date string for the calculated end date (startDate + contractDuration months). */
  endDate: z.string().min(1),
  /** Monthly membership rate in cents (integer, no floats). */
  monthlyRateCents: z.number().int().nonnegative(),
  /** Discount percentage applied for the chosen contract duration (0–100). */
  discountPercent: z.number().nonnegative().max(100),
  /** Total contract value in cents (monthlyRateCents * contractDuration after discount). */
  totalContractCents: z.number().int().nonnegative(),
  /** Human-readable list of services included in this tier. */
  includedServices: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    })
  ),
});
export type EnrollmentSummary = z.infer<typeof EnrollmentSummarySchema>;

// ============================================================================
// SUBMIT CONSENT REQUEST SCHEMA
// ============================================================================

/**
 * Request body for POST /api/admin/consent.
 * Submits all signed documents for a user in a single atomic operation.
 * All required documents must be present before the server will accept.
 */
export const SubmitConsentRequestSchema = z.object({
  userId: z.string().min(1),
  signedDocuments: z.array(SignedDocumentPayloadSchema).min(1),
  enrollmentSummary: EnrollmentSummarySchema,
});
export type SubmitConsentRequest = z.infer<typeof SubmitConsentRequestSchema>;

// ============================================================================
// CONSENT RECORD RESPONSE SCHEMA
// ============================================================================

/**
 * Response shape for a single consent record returned by the API.
 * Omits PHI fields (signatureDataUrl, initialsData) from the response — callers
 * only need the record identifiers and metadata.
 */
export const ConsentRecordResponseSchema = z.object({
  id: z.string(),
  documentType: ConsentDocumentTypeSchema,
  documentVersion: z.string(),
  signedAt: z.string(),
  compositeContractKey: z.string().nullable(),
  contentHash: z.string().nullable().optional(), // SHA-256 hash of document content at signing time
});
export type ConsentRecordResponse = z.infer<typeof ConsentRecordResponseSchema>;

/**
 * Response shape for POST /api/admin/consent.
 * Returns the IDs of all created records plus the S3 key for the composite PDF.
 */
export const SubmitConsentResponseSchema = z.object({
  recordIds: z.array(z.string()),
  compositeContractKey: z.string().nullable(),
});
export type SubmitConsentResponse = z.infer<typeof SubmitConsentResponseSchema>;

// ============================================================================
// CONSENT PDF RESPONSE SCHEMA
// ============================================================================

/**
 * Response shape for GET /api/admin/consent/:userId/pdf.
 * Returns a presigned S3 URL for downloading the composite consent PDF.
 * PHI note: The URL grants temporary access to a PHI document — treat as sensitive.
 */
export const ConsentPdfResponseSchema = z.object({
  url: z.string(),
  expiresIn: z.number(), // seconds until URL expires
});
export type ConsentPdfResponse = z.infer<typeof ConsentPdfResponseSchema>;
