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

import { z } from 'zod';

// ============================================================================
// DOCUMENT CATEGORIES (Domain Constants Pattern)
// ============================================================================

/**
 * Canonical document category values (source of truth).
 * These are used as tags when uploading and filtering documents.
 */
export const DOCUMENT_CATEGORIES = [
  'lab_result',
  'insurance_card',
  'medical_record',
  'imaging',
  'prescription',
  'referral',
  'consent_form',
  'other',
] as const;

/** Single document category type */
export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number];

/** Zod schema for document category validation - derived from tuple */
export const DocumentCategorySchema = z.enum(DOCUMENT_CATEGORIES);

/**
 * Document category constant object for type-safe access.
 * @example DOCUMENT_CATEGORY.LAB_RESULT // 'lab_result'
 */
export const DOCUMENT_CATEGORY = {
  LAB_RESULT: 'lab_result' as DocumentCategory,
  INSURANCE_CARD: 'insurance_card' as DocumentCategory,
  MEDICAL_RECORD: 'medical_record' as DocumentCategory,
  IMAGING: 'imaging' as DocumentCategory,
  PRESCRIPTION: 'prescription' as DocumentCategory,
  REFERRAL: 'referral' as DocumentCategory,
  CONSENT_FORM: 'consent_form' as DocumentCategory,
  OTHER: 'other' as DocumentCategory,
} as const;

/**
 * Human-readable labels for document categories.
 * Used in dropdowns and display text.
 */
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  lab_result: 'Lab Result',
  insurance_card: 'Insurance Card',
  medical_record: 'Medical Record',
  imaging: 'Imaging',
  prescription: 'Prescription',
  referral: 'Referral',
  consent_form: 'Consent Form',
  other: 'Other',
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
  return 'Other';
}
