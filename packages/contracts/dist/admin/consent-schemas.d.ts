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
/**
 * All legal document types that may be signed during the onboarding flow.
 * Maps 1:1 to the ConsentDocumentType Prisma enum.
 */
export declare const CONSENT_DOCUMENT_TYPES: readonly ["MEMBERSHIP_AGREEMENT", "LIABILITY_WAIVER", "INFORMED_CONSENT", "ELECTRONIC_COMMS_CONSENT", "PHOTO_VIDEO_RELEASE"];
export declare const ConsentDocumentTypeSchema: z.ZodEnum<{
    MEMBERSHIP_AGREEMENT: "MEMBERSHIP_AGREEMENT";
    LIABILITY_WAIVER: "LIABILITY_WAIVER";
    INFORMED_CONSENT: "INFORMED_CONSENT";
    ELECTRONIC_COMMS_CONSENT: "ELECTRONIC_COMMS_CONSENT";
    PHOTO_VIDEO_RELEASE: "PHOTO_VIDEO_RELEASE";
}>;
export type ConsentDocumentType = z.infer<typeof ConsentDocumentTypeSchema>;
/** Centralized consent document type constants for equality checks */
export declare const CONSENT_DOCUMENT_TYPE: {
    readonly MEMBERSHIP_AGREEMENT: "MEMBERSHIP_AGREEMENT";
    readonly LIABILITY_WAIVER: "LIABILITY_WAIVER";
    readonly INFORMED_CONSENT: "INFORMED_CONSENT";
    readonly ELECTRONIC_COMMS_CONSENT: "ELECTRONIC_COMMS_CONSENT";
    readonly PHOTO_VIDEO_RELEASE: "PHOTO_VIDEO_RELEASE";
};
/**
 * The 4 documents that MUST be signed before payment may proceed.
 * PHOTO_VIDEO_RELEASE is optional and excluded from this list.
 */
export declare const REQUIRED_CONSENT_DOCS: readonly ["MEMBERSHIP_AGREEMENT", "LIABILITY_WAIVER", "INFORMED_CONSENT", "ELECTRONIC_COMMS_CONSENT"];
/**
 * Documents that are optional — the user may skip without blocking payment.
 */
export declare const OPTIONAL_CONSENT_DOCS: readonly ["PHOTO_VIDEO_RELEASE"];
/**
 * Section keys for initials required in the Membership Agreement.
 * Each key identifies an initialed paragraph in the rendered document.
 */
export declare const MEMBERSHIP_INITIALS: {
    readonly ASSUMPTION_OF_RISK: "assumption_of_risk";
    readonly BINDING_ARBITRATION: "binding_arbitration";
    readonly CLASS_ACTION_WAIVER: "class_action_waiver";
    readonly EARLY_TERMINATION: "early_termination";
};
export type MembershipInitialsKey = (typeof MEMBERSHIP_INITIALS)[keyof typeof MEMBERSHIP_INITIALS];
/**
 * Section keys for initials required in the Liability Waiver.
 */
export declare const LIABILITY_INITIALS: {
    readonly EXERCISE: "exercise";
    readonly INFRARED_SAUNA: "infrared_sauna";
    readonly COLD_WATER: "cold_water";
    readonly RED_LIGHT: "red_light";
    readonly RELEASE_COVENANT: "release_covenant";
};
export type LiabilityInitialsKey = (typeof LIABILITY_INITIALS)[keyof typeof LIABILITY_INITIALS];
/**
 * Section keys for initials required in the Informed Consent document.
 */
export declare const INFORMED_CONSENT_INITIALS: {
    readonly LAB_TESTING: "lab_testing";
    readonly BIA: "bia";
    readonly DXA: "dxa";
    readonly WELLNESS_SCREENING: "wellness_screening";
    readonly COORDINATION_AUTH: "coordination_auth";
};
export type InformedConsentInitialsKey = (typeof INFORMED_CONSENT_INITIALS)[keyof typeof INFORMED_CONSENT_INITIALS];
/**
 * Opt-in use types for the Photo/Video Release document.
 * Each key represents a specific approved use that the client may independently
 * consent to. Shape when stored: Record<PhotoVideoUseType, boolean>
 */
export declare const PHOTO_VIDEO_USE_TYPES: {
    readonly MARKETING_SOCIAL: "marketing_social";
    readonly TRAINING_REVIEW: "training_review";
    readonly TESTIMONIAL: "testimonial";
    readonly INTERNAL_RECORDS: "internal_records";
};
export type PhotoVideoUseType = (typeof PHOTO_VIDEO_USE_TYPES)[keyof typeof PHOTO_VIDEO_USE_TYPES];
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
export declare const SignedDocumentPayloadSchema: z.ZodObject<{
    documentType: z.ZodEnum<{
        MEMBERSHIP_AGREEMENT: "MEMBERSHIP_AGREEMENT";
        LIABILITY_WAIVER: "LIABILITY_WAIVER";
        INFORMED_CONSENT: "INFORMED_CONSENT";
        ELECTRONIC_COMMS_CONSENT: "ELECTRONIC_COMMS_CONSENT";
        PHOTO_VIDEO_RELEASE: "PHOTO_VIDEO_RELEASE";
    }>;
    documentVersion: z.ZodString;
    signatureDataUrl: z.ZodString;
    initialsData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    optInSelections: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
    contentHash: z.ZodOptional<z.ZodString>;
    documentContent: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SignedDocumentPayload = z.infer<typeof SignedDocumentPayloadSchema>;
/**
 * Enrollment Summary (Exhibit A of the Membership Agreement).
 * Generated from the tier + contract duration selections made earlier in the flow.
 * Embedded in the composite PDF cover page.
 */
export declare const EnrollmentSummarySchema: z.ZodObject<{
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    contractDuration: z.ZodNumber;
    startDate: z.ZodString;
    endDate: z.ZodString;
    monthlyRateCents: z.ZodNumber;
    discountPercent: z.ZodNumber;
    totalContractCents: z.ZodNumber;
    includedServices: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type EnrollmentSummary = z.infer<typeof EnrollmentSummarySchema>;
/**
 * Request body for POST /api/admin/consent.
 * Submits all signed documents for a user in a single atomic operation.
 * All required documents must be present before the server will accept.
 */
export declare const SubmitConsentRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    signedDocuments: z.ZodArray<z.ZodObject<{
        documentType: z.ZodEnum<{
            MEMBERSHIP_AGREEMENT: "MEMBERSHIP_AGREEMENT";
            LIABILITY_WAIVER: "LIABILITY_WAIVER";
            INFORMED_CONSENT: "INFORMED_CONSENT";
            ELECTRONIC_COMMS_CONSENT: "ELECTRONIC_COMMS_CONSENT";
            PHOTO_VIDEO_RELEASE: "PHOTO_VIDEO_RELEASE";
        }>;
        documentVersion: z.ZodString;
        signatureDataUrl: z.ZodString;
        initialsData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        optInSelections: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
        contentHash: z.ZodOptional<z.ZodString>;
        documentContent: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    enrollmentSummary: z.ZodObject<{
        tier: z.ZodEnum<{
            ESSENTIALS: "ESSENTIALS";
            CORE: "CORE";
            CONCIERGE: "CONCIERGE";
        }>;
        contractDuration: z.ZodNumber;
        startDate: z.ZodString;
        endDate: z.ZodString;
        monthlyRateCents: z.ZodNumber;
        discountPercent: z.ZodNumber;
        totalContractCents: z.ZodNumber;
        includedServices: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SubmitConsentRequest = z.infer<typeof SubmitConsentRequestSchema>;
/**
 * Response shape for a single consent record returned by the API.
 * Omits PHI fields (signatureDataUrl, initialsData) from the response — callers
 * only need the record identifiers and metadata.
 */
export declare const ConsentRecordResponseSchema: z.ZodObject<{
    id: z.ZodString;
    documentType: z.ZodEnum<{
        MEMBERSHIP_AGREEMENT: "MEMBERSHIP_AGREEMENT";
        LIABILITY_WAIVER: "LIABILITY_WAIVER";
        INFORMED_CONSENT: "INFORMED_CONSENT";
        ELECTRONIC_COMMS_CONSENT: "ELECTRONIC_COMMS_CONSENT";
        PHOTO_VIDEO_RELEASE: "PHOTO_VIDEO_RELEASE";
    }>;
    documentVersion: z.ZodString;
    signedAt: z.ZodString;
    compositeContractKey: z.ZodNullable<z.ZodString>;
    contentHash: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type ConsentRecordResponse = z.infer<typeof ConsentRecordResponseSchema>;
/**
 * Response shape for POST /api/admin/consent.
 * Returns the IDs of all created records plus the S3 key for the composite PDF.
 */
export declare const SubmitConsentResponseSchema: z.ZodObject<{
    recordIds: z.ZodArray<z.ZodString>;
    compositeContractKey: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type SubmitConsentResponse = z.infer<typeof SubmitConsentResponseSchema>;
/**
 * Response shape for GET /api/admin/consent/:userId/pdf.
 * Returns a presigned S3 URL for downloading the composite consent PDF.
 * PHI note: The URL grants temporary access to a PHI document — treat as sensitive.
 */
export declare const ConsentPdfResponseSchema: z.ZodObject<{
    url: z.ZodString;
    expiresIn: z.ZodNumber;
}, z.core.$strip>;
export type ConsentPdfResponse = z.infer<typeof ConsentPdfResponseSchema>;
//# sourceMappingURL=consent-schemas.d.ts.map