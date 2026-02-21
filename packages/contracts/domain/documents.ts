/**
 * @ai-context Document domain contracts | Canonical document categories and types
 *
 * This module defines the canonical document categories used across mobile, web-admin, and backend.
 * All document types must use these categories rather than magic strings.
 *
 * IMPORTANT: All document category constants MUST be imported from here.
 *
 * deps: zod | consumers: server/src/services/*, src/features/documents/*, web-admin/services/*
 */

import { z } from "zod";

// ============================================================================
// DOCUMENT CATEGORIES (Domain Constants Pattern)
// ============================================================================

/**
 * Canonical document category values (source of truth).
 * These are used as tags when uploading and filtering documents.
 */
export const DOCUMENT_CATEGORIES = [
  "LAB_RESULT",
  "INSURANCE_CARD",
  "MEDICAL_RECORD",
  "IMAGING",
  "PRESCRIPTION",
  "REFERRAL",
  "CONSENT_FORM",
  "ID_DOCUMENT",
  "INTAKE_FORM",
  "PROGRESS_PHOTO",
  "OTHER",
] as const;

/** Single document category type */
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

/** Zod schema for document category validation - derived from tuple */
export const DocumentCategorySchema = z.enum(DOCUMENT_CATEGORIES);

/**
 * Document category constant object for type-safe access.
 * @example DOCUMENT_CATEGORY.LAB_RESULT // 'LAB_RESULT'
 */
export const DOCUMENT_CATEGORY = {
  LAB_RESULT: "LAB_RESULT",
  INSURANCE_CARD: "INSURANCE_CARD",
  MEDICAL_RECORD: "MEDICAL_RECORD",
  IMAGING: "IMAGING",
  PRESCRIPTION: "PRESCRIPTION",
  REFERRAL: "REFERRAL",
  CONSENT_FORM: "CONSENT_FORM",
  ID_DOCUMENT: "ID_DOCUMENT",
  INTAKE_FORM: "INTAKE_FORM",
  PROGRESS_PHOTO: "PROGRESS_PHOTO",
  OTHER: "OTHER",
} as const satisfies Record<string, DocumentCategory>;

/**
 * Human-readable labels for document categories.
 * Used in dropdowns and display text.
 */
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  LAB_RESULT: "Lab Result",
  INSURANCE_CARD: "Insurance Card",
  MEDICAL_RECORD: "Medical Record",
  IMAGING: "Imaging",
  PRESCRIPTION: "Prescription",
  REFERRAL: "Referral",
  CONSENT_FORM: "Consent Form",
  ID_DOCUMENT: "ID Document",
  INTAKE_FORM: "Intake Form",
  PROGRESS_PHOTO: "Progress Photo",
  OTHER: "Other",
};

/**
 * Type guard to check if a string is a valid document category
 */
export function isDocumentCategory(value: string): value is DocumentCategory {
  return (DOCUMENT_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Get the display label for a document category.
 * Falls back to 'Other' for unknown categories.
 */
export function getDocumentCategoryLabel(category: string): string {
  if (category in DOCUMENT_CATEGORY_LABELS) {
    return DOCUMENT_CATEGORY_LABELS[category as DocumentCategory];
  }
  return "Other";
}
