/**
 * @ai-context Billing domain contracts | billing statuses, dispute statuses
 *
 * This module provides canonical definitions for billing-related constants:
 * - Billing status (GOOD_STANDING, PAST_DUE, DELINQUENT, COLLECTIONS)
 * - Dispute status (NEEDS_RESPONSE, UNDER_REVIEW, WON, LOST)
 *
 * deps: zod | consumers: server, web-admin
 */

import { z } from 'zod';

// ============================================================================
// BILLING STATUS
// ============================================================================

/**
 * Billing account status - indicates payment health and collection stage.
 * - GOOD_STANDING: Account is current, no payment issues
 * - PAST_DUE: Payment overdue but not yet escalated
 * - DELINQUENT: Severely overdue, may suspend service
 * - COLLECTIONS: Sent to collections agency
 */
export const BILLING_STATUSES = [
  'GOOD_STANDING',
  'PAST_DUE',
  'DELINQUENT',
  'COLLECTIONS',
] as const;

export type BillingStatus = (typeof BILLING_STATUSES)[number];

export const BillingStatusSchema = z.enum(BILLING_STATUSES);

/** Centralized billing status constants for equality checks */
export const BILLING_STATUS = {
  GOOD_STANDING: 'GOOD_STANDING' as BillingStatus,
  PAST_DUE: 'PAST_DUE' as BillingStatus,
  DELINQUENT: 'DELINQUENT' as BillingStatus,
  COLLECTIONS: 'COLLECTIONS' as BillingStatus,
} as const;

/** Human-readable labels for billing statuses */
export const BILLING_STATUS_LABELS: Record<BillingStatus, string> = {
  GOOD_STANDING: 'Good Standing',
  PAST_DUE: 'Past Due',
  DELINQUENT: 'Delinquent',
  COLLECTIONS: 'In Collections',
};

/**
 * Check if a string is a valid billing status
 */
export function isBillingStatus(value: string): value is BillingStatus {
  return (BILLING_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// DISPUTE STATUS
// ============================================================================

/**
 * Chargeback/dispute lifecycle status.
 * - NEEDS_RESPONSE: Dispute filed, requires our response
 * - UNDER_REVIEW: Response submitted, awaiting decision
 * - WON: Dispute resolved in our favor
 * - LOST: Dispute lost, funds reversed
 */
export const DISPUTE_STATUSES = [
  'NEEDS_RESPONSE',
  'UNDER_REVIEW',
  'WON',
  'LOST',
] as const;

export type DisputeStatus = (typeof DISPUTE_STATUSES)[number];

export const DisputeStatusSchema = z.enum(DISPUTE_STATUSES);

/** Centralized dispute status constants for equality checks */
export const DISPUTE_STATUS = {
  NEEDS_RESPONSE: 'NEEDS_RESPONSE' as DisputeStatus,
  UNDER_REVIEW: 'UNDER_REVIEW' as DisputeStatus,
  WON: 'WON' as DisputeStatus,
  LOST: 'LOST' as DisputeStatus,
} as const;

/** Human-readable labels for dispute statuses */
export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  NEEDS_RESPONSE: 'Needs Response',
  UNDER_REVIEW: 'Under Review',
  WON: 'Won',
  LOST: 'Lost',
};

/**
 * Check if a string is a valid dispute status
 */
export function isDisputeStatus(value: string): value is DisputeStatus {
  return (DISPUTE_STATUSES as readonly string[]).includes(value);
}
