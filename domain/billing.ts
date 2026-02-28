/**
 * @ai-context Billing domain contracts | billing statuses, dispute statuses
 *
 * This module provides canonical definitions for billing-related constants:
 * - Billing status (GOOD_STANDING, PAST_DUE, DELINQUENT, COLLECTIONS)
 * - Dispute status (NEEDS_RESPONSE, UNDER_REVIEW, WON, LOST)
 *
 * deps: zod | consumers: server, web-admin
 */

import { z } from "zod";

// ============================================================================
// BILLING STATUS
// ============================================================================

/**
 * Billing account status - indicates payment health and collection stage.
 * - GOOD_STANDING: Account is current, no payment issues
 * - PAST_DUE: Payment overdue but not yet escalated
 * - DELINQUENT: Severely overdue, may suspend service
 * - COLLECTIONS: Sent to collections agency
 * - DISPUTED: Active payment dispute / chargeback filed
 */
export const BILLING_STATUSES = [
  "GOOD_STANDING",
  "PAST_DUE",
  "DELINQUENT",
  "COLLECTIONS",
  "DISPUTED",
] as const;

export type BillingStatus = z.infer<typeof BillingStatusSchema>;

export const BillingStatusSchema = z.enum(BILLING_STATUSES);

/** Centralized billing status constants for equality checks */
export const BILLING_STATUS = {
  GOOD_STANDING: "GOOD_STANDING",
  PAST_DUE: "PAST_DUE",
  DELINQUENT: "DELINQUENT",
  COLLECTIONS: "COLLECTIONS",
  DISPUTED: "DISPUTED",
} as const satisfies Record<BillingStatus, BillingStatus>;

/** Human-readable labels for billing statuses */
export const BILLING_STATUS_LABELS: Record<BillingStatus, string> = {
  GOOD_STANDING: "Good Standing",
  PAST_DUE: "Past Due",
  DELINQUENT: "Delinquent",
  COLLECTIONS: "In Collections",
  DISPUTED: "Disputed",
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
  "NEEDS_RESPONSE",
  "UNDER_REVIEW",
  "WON",
  "LOST",
] as const;

export type DisputeStatus = z.infer<typeof DisputeStatusSchema>;

export const DisputeStatusSchema = z.enum(DISPUTE_STATUSES);

/** Centralized dispute status constants for equality checks */
export const DISPUTE_STATUS = {
  NEEDS_RESPONSE: "NEEDS_RESPONSE",
  UNDER_REVIEW: "UNDER_REVIEW",
  WON: "WON",
  LOST: "LOST",
} as const satisfies Record<DisputeStatus, DisputeStatus>;

/** Human-readable labels for dispute statuses */
export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  NEEDS_RESPONSE: "Needs Response",
  UNDER_REVIEW: "Under Review",
  WON: "Won",
  LOST: "Lost",
};

/**
 * Check if a string is a valid dispute status
 */
export function isDisputeStatus(value: string): value is DisputeStatus {
  return (DISPUTE_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// DELINQUENT USER
// ============================================================================

/**
 * A user in delinquent or collections billing status.
 * Returned by the admin billing analytics endpoint.
 */
export const DelinquentUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  billingStatus: z.enum(["DELINQUENT", "COLLECTIONS"]),
  outstandingAmount: z.number(),
  daysPastDue: z.number().int(),
  sentToCollections: z.boolean(),
  sentToCollectionsAt: z.string().nullable(),
  collectionAgency: z.string().nullable(),
  notes: z.string().nullable(),
  lastTier: z.string().nullable(),
  lastPaymentFailedAt: z.string().nullable(),
  delinquencyRecordId: z.string().nullable(),
});
export type DelinquentUser = z.infer<typeof DelinquentUserSchema>;

export const DelinquentUsersResponseSchema = z.object({
  users: z.array(DelinquentUserSchema),
  count: z.number().int(),
});
export type DelinquentUsersResponse = z.infer<
  typeof DelinquentUsersResponseSchema
>;

export const SendToCollectionsRequestSchema = z.object({
  userId: z.string(),
  collectionAgency: z.string().optional(),
  notes: z.string().optional(),
});
export type SendToCollectionsRequest = z.infer<
  typeof SendToCollectionsRequestSchema
>;

export const UpdateDelinquencyNotesRequestSchema = z.object({
  userId: z.string(),
  notes: z.string(),
});
export type UpdateDelinquencyNotesRequest = z.infer<
  typeof UpdateDelinquencyNotesRequestSchema
>;

// ============================================================================
// CONTRACT UPLOAD
// ============================================================================

export const ContractUploadRequestSchema = z.object({
  subscriptionId: z.string(),
  fileBase64: z.string(),
  fileName: z.string(),
});
export type ContractUploadRequest = z.infer<typeof ContractUploadRequestSchema>;

// ============================================================================
// TIER CHANGE TRIGGER
// ============================================================================

/**
 * Source that initiated a subscription/tier change event.
 * - admin: Admin-initiated action (CRM, dashboard)
 * - system_cron: Automated cron job (grace period, delinquency)
 * - stripe_webhook: Incoming Stripe webhook event
 * - stripe_checkout: Stripe Checkout session completion
 */
export const TIER_CHANGE_TRIGGER = [
  "admin",
  "system_cron",
  "stripe_webhook",
  "stripe_checkout",
] as const;

export const TierChangeTriggerSchema = z.enum(TIER_CHANGE_TRIGGER);

export type TierChangeTrigger = z.infer<typeof TierChangeTriggerSchema>;

/** Centralized trigger constants for equality checks */
export const TIER_CHANGE_TRIGGER_MAP = {
  ADMIN: "admin",
  SYSTEM_CRON: "system_cron",
  STRIPE_WEBHOOK: "stripe_webhook",
  STRIPE_CHECKOUT: "stripe_checkout",
} as const satisfies Record<string, TierChangeTrigger>;

/**
 * Check if a string is a valid tier change trigger
 */
export function isTierChangeTrigger(value: string): value is TierChangeTrigger {
  return (TIER_CHANGE_TRIGGER as readonly string[]).includes(value);
}
