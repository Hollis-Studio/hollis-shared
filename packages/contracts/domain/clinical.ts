/**
 * @ai-context Clinical domain contracts | limitation severities, biometric sources
 *
 * This module provides the canonical definitions for clinical-related constants:
 * - Limitation severities (mild, moderate, severe)
 * - Biometric data sources (LAB_REPORT, CLINICIAN_ENTRY, APPLE_HEALTH, etc.)
 *
 * IMPORTANT: All clinical-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// LIMITATION SEVERITIES
// ============================================================================

export const LIMITATION_SEVERITIES = ['mild', 'moderate', 'severe'] as const;
export type LimitationSeverity = (typeof LIMITATION_SEVERITIES)[number];

export const LimitationSeveritySchema = z.enum(LIMITATION_SEVERITIES);

export const LIMITATION_SEVERITY = {
  MILD: 'mild' as LimitationSeverity,
  MODERATE: 'moderate' as LimitationSeverity,
  SEVERE: 'severe' as LimitationSeverity,
} as const;

export const LIMITATION_SEVERITY_LABELS: Record<LimitationSeverity, string> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
};

// ============================================================================
// BIOMETRIC SOURCES
// ============================================================================

/**
 * Sources from which biometric data can be captured.
 * Used to track data provenance and enable source-specific filtering.
 * 
 * **VERIFICATION RULE**:
 * - VERIFIED (isVerified: true): LAB_REPORT, CLINICIAN_ENTRY
 *   → Manual input from admins/clinicians/trainers or parsed lab reports
 * - UNVERIFIED (isVerified: false): All others (APPLE_HEALTH, USER_LOG, GOOGLE_FIT, OURA, WHOOP, DEVICE)
 *   → Data from wearables or user self-entry - not vetted for accuracy
 */
export const BIOMETRIC_SOURCES = [
  'LAB_REPORT',
  'CLINICIAN_ENTRY',
  'APPLE_HEALTH',
  'USER_LOG',
  'GOOGLE_FIT',
  'OURA',
  'WHOOP',
  'DEVICE',
] as const;
export type BiometricSource = (typeof BIOMETRIC_SOURCES)[number];

export const BiometricSourceSchema = z.enum(BIOMETRIC_SOURCES);

export const BIOMETRIC_SOURCE = {
  LAB_REPORT: 'LAB_REPORT' as BiometricSource,
  CLINICIAN_ENTRY: 'CLINICIAN_ENTRY' as BiometricSource,
  APPLE_HEALTH: 'APPLE_HEALTH' as BiometricSource,
  USER_LOG: 'USER_LOG' as BiometricSource,
  GOOGLE_FIT: 'GOOGLE_FIT' as BiometricSource,
  OURA: 'OURA' as BiometricSource,
  WHOOP: 'WHOOP' as BiometricSource,
  DEVICE: 'DEVICE' as BiometricSource,
} as const;

/** Human-readable labels for biometric sources */
export const BIOMETRIC_SOURCE_LABELS: Record<BiometricSource, string> = {
  LAB_REPORT: 'Lab Report',
  CLINICIAN_ENTRY: 'Clinician Entry',
  APPLE_HEALTH: 'Apple Health',
  USER_LOG: 'User Log',
  GOOGLE_FIT: 'Google Fit',
  OURA: 'Oura',
  WHOOP: 'Whoop',
  DEVICE: 'Device',
};
