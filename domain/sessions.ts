/**
 * @ai-context Sessions domain contracts | session types, reset frequencies
 *
 * Session types map to the services offered by Hollis Health:
 * - FITNESS_SESSION: 1:1 personal training sessions
 * - RECOVERY_SESSION: Sauna, ice bath, red light therapy
 * - LABWORK: Blood panel (CMP + hormones)
 * - CLINICIAN_INITIAL: Initial consultation with PCP/RN
 * - CLINICIAN_FOLLOWUP: Regular PCP check-ins
 * - DXA_SCAN: Body composition DEXA scan
 * - SLEEP_SCREENING: Overnight O2/sleep health screening
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// SESSION TYPES
// ============================================================================

/**
 * All bookable session types in the Hollis Health system
 */
export const SESSION_TYPES = [
  'FITNESS_SESSION',      // 1:1 Training sessions
  'RECOVERY_SESSION',     // Sauna, Ice Bath, Red Light (unlimited in all tiers, but tracked)
  'LABWORK',              // CMP + hormones blood panel
  'CLINICIAN_INITIAL',    // Initial PCP/RN consultation
  'CLINICIAN_FOLLOWUP',   // Regular PCP check-ins
  'DXA_SCAN',             // Body composition DEXA scan
  'SLEEP_SCREENING',      // Overnight O2/sleep health screening
] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export const SessionTypeSchema = z.enum(SESSION_TYPES);

/** Centralized session type constants for equality checks */
export const SESSION_TYPE = {
  FITNESS_SESSION: 'FITNESS_SESSION' as SessionType,
  RECOVERY_SESSION: 'RECOVERY_SESSION' as SessionType,
  LABWORK: 'LABWORK' as SessionType,
  CLINICIAN_INITIAL: 'CLINICIAN_INITIAL' as SessionType,
  CLINICIAN_FOLLOWUP: 'CLINICIAN_FOLLOWUP' as SessionType,
  DXA_SCAN: 'DXA_SCAN' as SessionType,
  SLEEP_SCREENING: 'SLEEP_SCREENING' as SessionType,
} as const;

/** Human-readable labels for session types */
export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  FITNESS_SESSION: 'Fitness Session',
  RECOVERY_SESSION: 'Recovery Session',
  LABWORK: 'Lab Work',
  CLINICIAN_INITIAL: 'Initial Consultation',
  CLINICIAN_FOLLOWUP: 'Follow-up Check-in',
  DXA_SCAN: 'DXA Scan',
  SLEEP_SCREENING: 'Sleep Screening',
};

/**
 * Check if a string is a valid session type
 */
export function isSessionType(value: string): value is SessionType {
  return (SESSION_TYPES as readonly string[]).includes(value);
}

// ============================================================================
// RESET FREQUENCIES
// ============================================================================

/**
 * Reset frequency for session allocations
 * MONTHLY: Resets on billing date each month
 * QUARTERLY: Resets every 3 months from billing date
 * BIANNUAL: Resets every 6 months from billing date
 * ANNUAL: Resets once per year from billing date
 */
export const RESET_FREQUENCIES = [
  'MONTHLY',
  'QUARTERLY',
  'BIANNUAL',
  'ANNUAL',
] as const;

export type ResetFrequency = (typeof RESET_FREQUENCIES)[number];

export const ResetFrequencySchema = z.enum(RESET_FREQUENCIES);

/** Centralized reset frequency constants for equality checks */
export const RESET_FREQUENCY = {
  MONTHLY: 'MONTHLY' as ResetFrequency,
  QUARTERLY: 'QUARTERLY' as ResetFrequency,
  BIANNUAL: 'BIANNUAL' as ResetFrequency,
  ANNUAL: 'ANNUAL' as ResetFrequency,
} as const;

/** Human-readable labels for reset frequencies */
export const RESET_FREQUENCY_LABELS: Record<ResetFrequency, string> = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  BIANNUAL: 'Biannual',
  ANNUAL: 'Annual',
};
