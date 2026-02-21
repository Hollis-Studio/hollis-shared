/**
 * @ai-context Stripe subscription contracts | Shared types for subscription data
 *
 * These contracts define the shape of subscription data for API responses
 * and frontend consumption.
 *
 * deps: zod, domain/user | consumers: server routes, web-admin
 */

import { z } from "zod";
import { USER_TIERS, type UserTier } from "../domain/user";

// ============================================================================
// SUBSCRIPTION STATUS
// ============================================================================

export const SUBSCRIPTION_STATUSES = [
  "PENDING",
  "TRIAL",
  "ACTIVE",
  "PAUSED",
  "PAST_DUE",
  "CANCELED",
  "TERMINATED",
  "SUSPENDED",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const SubscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);

/** Lookup object for subscription statuses (avoids magic strings) */
export const SUBSCRIPTION_STATUS = {
  PENDING: "PENDING",
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
  TERMINATED: "TERMINATED",
  SUSPENDED: "SUSPENDED",
} as const satisfies Record<SubscriptionStatus, SubscriptionStatus>;

// ============================================================================
// STRIPE SUBSCRIPTION SCHEDULE STATUS (external Stripe values)
// ============================================================================

/**
 * Status values for Stripe SubscriptionSchedule objects.
 * These are Stripe's values, not our internal status.
 * @see https://docs.stripe.com/api/subscription_schedules/object#subscription_schedule_object-status
 */
export const STRIPE_SCHEDULE_STATUSES = [
  "not_started",
  "active",
  "completed",
  "released",
  "canceled",
] as const;

export type StripeScheduleStatus = (typeof STRIPE_SCHEDULE_STATUSES)[number];

/** Lookup object for Stripe subscription schedule statuses */
export const STRIPE_SCHEDULE_STATUS = {
  NOT_STARTED: "not_started",
  ACTIVE: "active",
  COMPLETED: "completed",
  RELEASED: "released",
  CANCELED: "canceled",
} as const satisfies Record<string, StripeScheduleStatus>;

// ============================================================================
// CONTRACT DURATION
// ============================================================================

export const CONTRACT_DURATIONS = ["MONTH_4", "MONTH_8", "MONTH_12"] as const;

export type ContractDuration = (typeof CONTRACT_DURATIONS)[number];

export const ContractDurationSchema = z.enum(CONTRACT_DURATIONS);

/** Map duration to months */
export const CONTRACT_DURATION_MONTHS: Record<ContractDuration, number> = {
  MONTH_4: 4,
  MONTH_8: 8,
  MONTH_12: 12,
};

/** Map duration to discount percentage */
export const CONTRACT_DURATION_DISCOUNTS: Record<ContractDuration, number> = {
  MONTH_4: 0,
  MONTH_8: 5,
  MONTH_12: 10,
};

// ============================================================================
// BILLING SOURCE
// ============================================================================

export const BILLING_SOURCES = ["DIRECT", "ORGANIZATION"] as const;

export type BillingSource = (typeof BILLING_SOURCES)[number];

export const BillingSourceSchema = z.enum(BILLING_SOURCES);

// ============================================================================
// SUBSCRIPTION CONTRACT
// ============================================================================

export interface SubscriptionContract {
  id: string;
  userId: string;

  // Stripe IDs
  stripeSubscriptionId: string;
  stripeCustomerId: string;

  // Membership
  tier: UserTier;
  status: SubscriptionStatus;

  // Contract
  contractDuration: ContractDuration;
  contractStartDate: string; // ISO date
  contractEndDate: string; // ISO date
  discountPercent: number;

  // Billing
  billingSource: BillingSource;
  billingOrganizationId: string | null;
  monthlyPriceInCents: number;

  // Current period
  currentPeriodStart: string;
  currentPeriodEnd: string;
  billingAnchorDay: number;

  // Grace period (7 days after failed payment)
  isInGracePeriod: boolean;
  gracePeriodEndsAt: string | null;

  // Pause info
  isPaused: boolean;
  pausedAt: string | null;
  pauseResumeDate: string | null;
  pauseMonthsUsed: number;
  pauseMonthsRemaining: number; // 6 - pauseMonthsUsed

  // Cancellation
  isCanceled: boolean;
  canceledAt: string | null;
  cancelEffectiveDate: string | null;

  // Scheduled changes
  scheduledTierChange: UserTier | null;
  tierChangeEffectiveDate: string | null;

  // Contract document
  signedContractKey: string | null;

  createdAt: string;
  updatedAt: string;
}

export const SubscriptionSchema: z.ZodType<SubscriptionContract> = z.object({
  id: z.string().uuid(),
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1),
  stripeSubscriptionId: z.string(),
  stripeCustomerId: z.string(),
  tier: z.enum(USER_TIERS),
  status: SubscriptionStatusSchema,
  contractDuration: ContractDurationSchema,
  contractStartDate: z.string(),
  contractEndDate: z.string(),
  discountPercent: z.number(),
  billingSource: BillingSourceSchema,
  billingOrganizationId: z.string().nullable(),
  monthlyPriceInCents: z.number().int(),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  billingAnchorDay: z.number().int().min(1).max(28),
  isInGracePeriod: z.boolean(),
  gracePeriodEndsAt: z.string().nullable(),
  isPaused: z.boolean(),
  pausedAt: z.string().nullable(),
  pauseResumeDate: z.string().nullable(),
  pauseMonthsUsed: z.number().int(),
  pauseMonthsRemaining: z.number().int(),
  isCanceled: z.boolean(),
  canceledAt: z.string().nullable(),
  cancelEffectiveDate: z.string().nullable(),
  scheduledTierChange: z.enum(USER_TIERS).nullable(),
  tierChangeEffectiveDate: z.string().nullable(),
  signedContractKey: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================================
// CREATE SUBSCRIPTION REQUEST
// ============================================================================

export interface CreateSubscriptionRequest {
  userId: string;
  tier: UserTier;
  contractDuration: ContractDuration;
  billingSource?: BillingSource;
  billingOrganizationId?: string;
  paymentMethodId?: string; // If already have payment method
}

export const CreateSubscriptionRequestSchema = z.object({
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1),
  tier: z.enum(USER_TIERS),
  contractDuration: ContractDurationSchema,
  billingSource: BillingSourceSchema.optional().default("DIRECT"),
  billingOrganizationId: z.string().uuid().optional(),
  paymentMethodId: z.string().optional(),
});

// ============================================================================
// EARLY TERMINATION QUOTE
// ============================================================================

export interface EarlyTerminationQuoteContract {
  subscriptionId: string;
  remainingMonths: number;
  monthlyPriceInCents: number;
  remainingDueInCents: number;
  terminationFeeInCents: number; // 50% of remaining
  effectiveImmediately: boolean;
}

export const EarlyTerminationQuoteSchema = z.object({
  subscriptionId: z.string().uuid(),
  remainingMonths: z.number(),
  monthlyPriceInCents: z.number().int(),
  remainingDueInCents: z.number().int(),
  terminationFeeInCents: z.number().int(),
  effectiveImmediately: z.boolean(),
});

// ============================================================================
// PAUSE REQUEST
// ============================================================================

export interface PauseSubscriptionRequest {
  pauseMonths: number; // 1-6, must not exceed remaining
  reason?: string;
}

export const PauseSubscriptionRequestSchema = z.object({
  pauseMonths: z.number().int().min(1).max(6),
  reason: z.string().optional(),
});

// ============================================================================
// TIER CHANGE REQUEST
// ============================================================================

export interface TierChangeRequest {
  newTier: UserTier;
  effectiveDate?: string; // For downgrades, must be at least 7 days before billing
}

export const TierChangeRequestSchema = z.object({
  newTier: z.enum(USER_TIERS),
  effectiveDate: z.string().optional(),
});
