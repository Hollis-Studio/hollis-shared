/**
 * @ai-context Compliance domain contracts | tier-aware compliance tracking statuses
 *
 * BUSINESS CONTEXT:
 * Hollis Health has 3 membership tiers with different engagement expectations.
 * This file enables tier-specific compliance tracking so admins can identify:
 * - High-paying clients underutilizing their membership (churn risk)
 * - Clients who are thriving and getting full value
 * - Where specifically a client is falling short
 *
 * IMPORTANT: All compliance-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// COMPLIANCE STATUS
// ============================================================================

/**
 * Granular compliance status levels (replaces binary "compliant/non-compliant").
 * - excellent (≥90%): Client is crushing it, fully engaged
 * - good (≥70%): On track, meeting most expectations
 * - at-risk (≥50%): Needs proactive outreach before they disengage
 * - non-compliant (<50%): Intervention needed, significant churn risk
 */
export const COMPLIANCE_STATUSES = ['excellent', 'good', 'at-risk', 'non-compliant'] as const;
export type ComplianceStatus = (typeof COMPLIANCE_STATUSES)[number];

export const ComplianceStatusSchema = z.enum(COMPLIANCE_STATUSES);

/** Centralized compliance status constants for equality checks */
export const COMPLIANCE_STATUS = {
  EXCELLENT: 'excellent' as ComplianceStatus,
  GOOD: 'good' as ComplianceStatus,
  AT_RISK: 'at-risk' as ComplianceStatus,
  NON_COMPLIANT: 'non-compliant' as ComplianceStatus,
} as const;

/** Human-readable labels for compliance statuses */
export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  excellent: 'Excellent',
  good: 'Good',
  'at-risk': 'At Risk',
  'non-compliant': 'Non-Compliant',
};

/** Score thresholds for each compliance status */
export const COMPLIANCE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  AT_RISK: 50,
  // Below 50 = non-compliant
} as const;

/**
 * Derive compliance status from a numeric score (0-100).
 */
export function getComplianceStatusFromScore(score: number): ComplianceStatus {
  if (score >= COMPLIANCE_THRESHOLDS.EXCELLENT) return COMPLIANCE_STATUS.EXCELLENT;
  if (score >= COMPLIANCE_THRESHOLDS.GOOD) return COMPLIANCE_STATUS.GOOD;
  if (score >= COMPLIANCE_THRESHOLDS.AT_RISK) return COMPLIANCE_STATUS.AT_RISK;
  return COMPLIANCE_STATUS.NON_COMPLIANT;
}

/**
 * Check if a string is a valid compliance status
 */
export function isComplianceStatus(value: string): value is ComplianceStatus {
  return (COMPLIANCE_STATUSES as readonly string[]).includes(value);
}
