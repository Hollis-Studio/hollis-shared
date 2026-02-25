/**
 * @ai-context Stripe subscription contracts | Shared types for subscription data
 *
 * These contracts define the shape of subscription data for API responses
 * and frontend consumption.
 *
 * deps: zod, domain/user | consumers: server routes, web-admin
 */

import { z } from "zod";
import { USER_TIERS } from "../domain/user";
import { emailSchema } from "../schemas";

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

export const SubscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

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

export const ContractDurationSchema = z.enum(CONTRACT_DURATIONS);
export type ContractDuration = z.infer<typeof ContractDurationSchema>;

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

export const BillingSourceSchema = z.enum(BILLING_SOURCES);
export type BillingSource = z.infer<typeof BillingSourceSchema>;

// ============================================================================
// SUBSCRIPTION CONTRACT
// ============================================================================

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1),
  stripeSubscriptionId: z.string(),
  stripeCustomerId: z.string(),
  /** @enrichment from Stripe */
  stripePriceId: z.string().nullable().optional(),
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
  /** @computed */
  isInGracePeriod: z.boolean(),
  gracePeriodEndsAt: z.string().nullable(),
  /** @computed */
  isPaused: z.boolean(),
  pausedAt: z.string().nullable(),
  pauseResumeDate: z.string().nullable(),
  pauseMonthsUsed: z.number().int(),
  /** @computed */
  pauseMonthsRemaining: z.number().int(),
  /** @computed */
  isCanceled: z.boolean(),
  canceledAt: z.string().nullable(),
  cancelEffectiveDate: z.string().nullable(),
  scheduledTierChange: z.enum(USER_TIERS).nullable(),
  tierChangeEffectiveDate: z.string().nullable(),
  signedContractKey: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type SubscriptionContract = z.infer<typeof SubscriptionSchema>;

// ============================================================================
// CREATE SUBSCRIPTION REQUEST
// ============================================================================

export const CreateSubscriptionRequestSchema = z.object({
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1),
  tier: z.enum(USER_TIERS),
  contractDuration: ContractDurationSchema,
  billingSource: BillingSourceSchema.optional().default("DIRECT"),
  billingOrganizationId: z.string().uuid().optional(),
  paymentMethodId: z.string().optional(),
});
export type CreateSubscriptionRequest = z.infer<
  typeof CreateSubscriptionRequestSchema
>;

// ============================================================================
// EARLY TERMINATION QUOTE
// ============================================================================

export const EarlyTerminationQuoteSchema = z.object({
  subscriptionId: z.string().uuid(),
  remainingMonths: z.number(),
  monthlyPriceInCents: z.number().int(),
  remainingDueInCents: z.number().int(),
  terminationFeeInCents: z.number().int(),
  effectiveImmediately: z.boolean(),
});
export type EarlyTerminationQuoteContract = z.infer<
  typeof EarlyTerminationQuoteSchema
>;
/** @deprecated Use EarlyTerminationQuoteContract */
export type EarlyTerminationQuote = EarlyTerminationQuoteContract;

// ============================================================================
// PAUSE REQUEST
// ============================================================================

export const PauseSubscriptionRequestSchema = z.object({
  pauseMonths: z.number().int().min(1).max(6),
  reason: z.string().optional(),
});
export type PauseSubscriptionRequest = z.infer<
  typeof PauseSubscriptionRequestSchema
>;

// ============================================================================
// TIER CHANGE REQUEST
// ============================================================================

export const TierChangeRequestSchema = z.object({
  newTier: z.enum(USER_TIERS),
  effectiveDate: z.string().optional(),
});
export type TierChangeRequest = z.infer<typeof TierChangeRequestSchema>;

// ============================================================================
// SUBSCRIPTION LIST
// ============================================================================

export const SubscriptionListParamsSchema = z.object({
  status: z.string().optional(),
  tier: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(200).optional(),
});
export type SubscriptionListParams = z.infer<
  typeof SubscriptionListParamsSchema
>;

/**
 * A subscription entry enriched with basic user info for the admin list view.
 */
export const SubscriptionListItemSchema = SubscriptionSchema.extend({
  user: z.object({
    id: z.string(),
    email: emailSchema,
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
  }),
});
export type SubscriptionListItem = z.infer<typeof SubscriptionListItemSchema>;

export const SubscriptionListResponseSchema = z.object({
  subscriptions: z.array(SubscriptionListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    pages: z.number().int(),
  }),
});
export type SubscriptionListResponse = z.infer<
  typeof SubscriptionListResponseSchema
>;
