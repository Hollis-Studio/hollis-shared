/**
 * Legal documents barrel export for the signing flow.
 *
 * Each document module exports:
 *   - `meta`              — { title, version, effectiveDate }
 *   - `content`           — Full markdown text with {{TEMPLATE_TOKEN}} placeholders
 *   - `initialsSections`  — Array of { key, title, excerpt } (empty for docs with no initials)
 *
 * The photo/video release additionally exports `useTypes` for opt-in checkbox rendering.
 * The enrollment summary exports generator and renderer functions (no static `content`).
 * `renderSignedDocumentContent` performs canonical placeholder substitution
 * for the legal text displayed and signed.
 *
 * NOTE: The five document modules all export identically named bindings (meta, content,
 * initialsSections), so they cannot be re-exported with `export *` from this barrel without
 * causing duplicate-export conflicts. Import via the namespaced module exports or directly
 * from the individual module files.
 *
 * Usage:
 *   import { DOCUMENT_REGISTRY } from "@hollis-studio/contracts/admin/legal-documents";
 *   import { generateEnrollmentSummary } from "@hollis-studio/contracts/admin/legal-documents";
 */

// ---------------------------------------------------------------------------
// Namespaced module exports — use these to access meta/content/initialsSections
// ---------------------------------------------------------------------------

import {
  OPTIONAL_CONSENT_DOCS,
  REQUIRED_CONSENT_DOCS,
  type ConsentDocumentType,
} from "../consent-schemas.js";
import * as ElectronicCommsConsent from "./electronicCommsConsent.js";
import * as InformedConsent from "./informedConsent.js";
import * as LiabilityWaiver from "./liabilityWaiver.js";
import * as MembershipAgreement from "./membershipAgreement.js";
import * as PhotoVideoRelease from "./photoVideoRelease.js";

export * as electronicCommsConsent from "./electronicCommsConsent.js";
export * as informedConsent from "./informedConsent.js";
export * as liabilityWaiver from "./liabilityWaiver.js";
export * as membershipAgreement from "./membershipAgreement.js";
export * as photoVideoRelease from "./photoVideoRelease.js";

export {
  ElectronicCommsConsent,
  InformedConsent,
  LiabilityWaiver,
  MembershipAgreement,
  PhotoVideoRelease,
};

// ---------------------------------------------------------------------------
// Type re-exports (no naming conflicts)
// ---------------------------------------------------------------------------

export type { InformedConsentInitialsKey } from "./informedConsent.js";
export type { LiabilityInitialsKey } from "./liabilityWaiver.js";
export type { MembershipInitialsKey } from "./membershipAgreement.js";
export type { PhotoVideoUseTypeKey } from "./photoVideoRelease.js";

// ---------------------------------------------------------------------------
// Enrollment summary — function exports (no naming conflicts)
// ---------------------------------------------------------------------------

export {
  generateEnrollmentSummary,
  renderEnrollmentSummaryMarkdown
} from "./enrollmentSummary.js";
export type { EnrollmentSummaryData } from "./enrollmentSummary.js";
export {
  renderSignedDocumentContent,
  type SignedDocumentRenderClientInfo,
} from "./rendering.js";

// ---------------------------------------------------------------------------
// Document registry
// ---------------------------------------------------------------------------

/**
 * Maps ConsentDocumentType keys (matching the Prisma enum + consent-schemas.ts)
 * to their corresponding document module. Use this in the signing flow to look
 * up a document by type without needing a switch statement.
 *
 * Example:
 *   const doc = DOCUMENT_REGISTRY["MEMBERSHIP_AGREEMENT"];
 *   // doc.meta.title === "Membership Agreement"
 *   // doc.content    === full markdown string
 *   // doc.initialsSections === [...initials definitions]
 */
export const DOCUMENT_REGISTRY = {
  MEMBERSHIP_AGREEMENT: MembershipAgreement,
  LIABILITY_WAIVER: LiabilityWaiver,
  INFORMED_CONSENT: InformedConsent,
  ELECTRONIC_COMMS_CONSENT: ElectronicCommsConsent,
  PHOTO_VIDEO_RELEASE: PhotoVideoRelease,
} as const;

export type DocumentRegistryKey = keyof typeof DOCUMENT_REGISTRY;

/**
 * Required consent documents that must be signed before payment.
 * Matches REQUIRED_CONSENT_DOCS in shared/contracts/admin/consent-schemas.ts.
 */
export { REQUIRED_CONSENT_DOCS };

/**
 * Optional consent documents that the member may skip.
 * Matches OPTIONAL_CONSENT_DOCS in shared/contracts/admin/consent-schemas.ts.
 */
export { OPTIONAL_CONSENT_DOCS };

/** All consent documents in signing flow order (required first, optional last). */
export const ALL_CONSENT_DOCS = [
  ...REQUIRED_CONSENT_DOCS,
  ...OPTIONAL_CONSENT_DOCS,
] as const satisfies readonly ConsentDocumentType[];
