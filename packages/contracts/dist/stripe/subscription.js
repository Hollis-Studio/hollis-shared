/**
 * @ai-context Stripe subscription contracts | Shared types for subscription data
 *
 * These contracts define the shape of subscription data for API responses
 * and frontend consumption.
 *
 * deps: zod, domain/user | consumers: server routes, web-admin
 */
import { z } from "zod";
import { MASTER_OFFER_TERMS } from "../domain/offer-sheet.js";
import { USER_TIERS } from "../domain/user.js";
import { emailSchema } from "../schemas/index.js";
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
];
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
};
/** Human-readable labels for subscription statuses */
export const SUBSCRIPTION_STATUS_LABELS = {
    PENDING: "Pending",
    TRIAL: "Trial",
    ACTIVE: "Active",
    PAUSED: "Paused",
    PAST_DUE: "Past Due",
    CANCELED: "Canceled",
    TERMINATED: "Terminated",
    SUSPENDED: "Suspended",
};
// ============================================================================
// SUBSCRIPTION EVENT TYPE
// ============================================================================
/**
 * All known SubscriptionEvent.eventType values.
 *
 * `SubscriptionEvent.eventType` is a plain String column in Prisma (not a DB
 * enum), so this constant object acts as the single source of truth for every
 * value that may be written to that column. All server code MUST use these
 * constants instead of raw string literals.
 *
 * Naming convention: SCREAMING_SNAKE_CASE key → snake_case value (matching
 * the legacy DB values so no migration is required).
 */
export const SUBSCRIPTION_EVENT_TYPE = {
    // ── Lifecycle ──────────────────────────────────────────────────────────────
    /** Subscription record first created (admin-initiated or checkout). */
    CREATED: "created",
    /** Subscription reactivated after a previous cancellation. */
    REACTIVATED: "reactivated",
    /** Subscription soft-canceled; remains active until period end. */
    CANCELED: "canceled",
    /** Subscription hard-terminated immediately (e.g. delinquency, fraud). */
    TERMINATED: "terminated",
    /** Subscription terminated because the grace period expired. */
    TERMINATED_GRACE_PERIOD_EXPIRED: "terminated_grace_period_expired",
    // ── Trial ──────────────────────────────────────────────────────────────────
    /** Trial period ended and first real payment collected. */
    TRIAL_CONVERTED: "trial_converted",
    // ── Billing ────────────────────────────────────────────────────────────────
    /** Successful recurring invoice paid; subscription renewed. */
    RENEWED: "renewed",
    /** Invoice payment failed. */
    PAYMENT_FAILED: "payment_failed",
    /** Asynchronous payment method failed. */
    ASYNC_PAYMENT_FAILED: "async_payment_failed",
    /** Invoice voided (post session-reset path). */
    INVOICE_VOIDED_POST_RESET: "invoice_voided_post_reset",
    /** Invoice voided (standard path). */
    INVOICE_VOIDED: "invoice_voided",
    /** Charge refunded (post session-reset path). */
    REFUND_POST_RESET: "refund_post_reset",
    /** Charge refunded (standard path). */
    REFUNDED: "refunded",
    // ── Dispute ────────────────────────────────────────────────────────────────
    /** Stripe dispute (chargeback) opened. */
    DISPUTE_CREATED: "dispute_created",
    /** Stripe dispute (chargeback) resolved. */
    DISPUTE_RESOLVED: "dispute_resolved",
    // ── Early termination ──────────────────────────────────────────────────────
    /** Early-termination fee calculated and persisted for the subscriber. */
    EARLY_TERMINATION_QUOTED: "early_termination_quoted",
    // ── Pause / resume ────────────────────────────────────────────────────────
    /** Subscription paused. */
    PAUSED: "paused",
    /** Paused subscription resumed (early or on schedule). */
    RESUMED: "resumed",
    /** A pending tier change was cleared because the subscription was paused. */
    SCHEDULED_TIER_CHANGE_CLEARED: "scheduled_tier_change_cleared",
    // ── Tier changes ──────────────────────────────────────────────────────────
    /** Tier upgraded immediately. */
    TIER_UPGRADED: "tier_upgraded",
    /** Tier downgrade scheduled for next billing boundary. */
    TIER_DOWNGRADE_SCHEDULED: "tier_downgrade_scheduled",
    /** Tier change (scheduled downgrade) cancelled. */
    TIER_CHANGE_CANCELLED: "tier_change_cancelled",
    /** Tier upgraded while subscription is in a grace period. */
    UPGRADE_FROM_GRACE_PERIOD: "upgrade_from_grace_period",
    /**
     * Tier changed (used by the subscriptionUpdated webhook for generic
     * tier-change events detected via Stripe metadata comparison).
     */
    TIER_CHANGED: "tier_changed",
    // ── Status changes ────────────────────────────────────────────────────────
    /** Generic subscription status change detected by the webhook handler. */
    STATUS_CHANGED: "status_changed",
    /** Cancellation scheduled (cancel_at_period_end set via Stripe). */
    CANCEL_SCHEDULED: "cancel_scheduled",
    /** Pending cancellation reversed (cancel_at_period_end cleared). */
    CANCEL_REVERSED: "cancel_reversed",
    // ── Delinquency / enforcement ─────────────────────────────────────────────
    /** User marked delinquent by the delinquency tracking job. */
    MARKED_DELINQUENT: "marked_delinquent",
    /** Grace period warning notification sent to user. */
    GRACE_PERIOD_WARNING_SENT: "grace_period_warning_sent",
};
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
];
/** Lookup object for Stripe subscription schedule statuses */
export const STRIPE_SCHEDULE_STATUS = {
    NOT_STARTED: "not_started",
    ACTIVE: "active",
    COMPLETED: "completed",
    RELEASED: "released",
    CANCELED: "canceled",
};
// ============================================================================
// CONTRACT DURATION
// ============================================================================
export const CONTRACT_DURATIONS = ["MONTH_4", "MONTH_8", "MONTH_12"];
export const ContractDurationSchema = z.enum(CONTRACT_DURATIONS);
/** Map duration to months */
export const CONTRACT_DURATION_MONTHS = {
    MONTH_4: 4,
    MONTH_8: 8,
    MONTH_12: 12,
};
/**
 * Resolve the offer-sheet discount for a contract length in months.
 *
 * Throws at module load when the offer sheet no longer carries a term for a
 * duration this package still advertises — a loud failure is correct here:
 * silently defaulting to 0% would under-bill every member on that term.
 */
function offerSheetDiscountPercentForMonths(months) {
    const term = MASTER_OFFER_TERMS.find((candidate) => candidate.months === months);
    if (!term) {
        throw new Error(`Master offer sheet has no term for a ${months}-month contract duration. ` +
            "CONTRACT_DURATIONS and offer-sheet.json terms have diverged.");
    }
    return term.discountPercent;
}
/**
 * Map duration to discount percentage.
 *
 * Derived from the master offer sheet (`domain/offer-sheet.json`) — the single
 * source of truth for commercial terms. Editing a term's `discountPercent`
 * there changes billing here with no code edit, and a removed term fails loudly
 * instead of silently reverting to the old hardcoded number.
 */
export const CONTRACT_DURATION_DISCOUNTS = Object.fromEntries(CONTRACT_DURATIONS.map((duration) => [
    duration,
    offerSheetDiscountPercentForMonths(CONTRACT_DURATION_MONTHS[duration]),
]));
/** Constant object for contract duration comparisons (avoids magic strings) */
export const CONTRACT_DURATION = {
    MONTH_4: "MONTH_4",
    MONTH_8: "MONTH_8",
    MONTH_12: "MONTH_12",
};
// ============================================================================
// BILLING SOURCE
// ============================================================================
export const BILLING_SOURCES = ["DIRECT", "ORGANIZATION"];
export const BillingSourceSchema = z.enum(BILLING_SOURCES);
/** Constant object for billing source comparisons (avoids magic strings) */
export const BILLING_SOURCE = {
    DIRECT: "DIRECT",
    ORGANIZATION: "ORGANIZATION",
};
// ============================================================================
// SUBSCRIPTION CONTRACT
// ============================================================================
export const SubscriptionSchema = z.object({
    id: z.string().uuid(),
    /** userId uses HH-XXXXXX barcode format, not UUID */
    userId: z.string().min(1),
    stripeSubscriptionId: z.string(),
    stripeCustomerId: z.string(),
    /** Stripe price ID for this subscription plan. Non-nullable in DB. */
    stripePriceId: z.string(),
    tier: z.enum(USER_TIERS),
    status: SubscriptionStatusSchema,
    contractDuration: ContractDurationSchema,
    contractStartDate: z.string(),
    contractEndDate: z.string(),
    discountPercent: z.coerce.number(),
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
    failedPaymentCount: z.number().int().default(0),
    cancelReason: z.string().nullable().optional(),
    earlyTerminationFee: z.number().int().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// ============================================================================
// PAYMENT INTENT STATUS (off-session confirmation outcome)
// ============================================================================
/**
 * Terminal-or-actionable status of the PaymentIntent the server confirms
 * off-session while creating a subscription.
 *
 * Only "succeeded" means the card was actually charged. "requires_action" means
 * the issuer demanded 3DS, which an off-session confirmation cannot complete —
 * the admin wizard has to finish it on-session with `paymentClientSecret`.
 */
export const PAYMENT_INTENT_STATUSES = [
    "succeeded",
    "requires_action",
    "processing",
    "requires_payment_method",
];
export const PaymentIntentStatusSchema = z.enum(PAYMENT_INTENT_STATUSES);
// ============================================================================
// ADMIN SUBSCRIPTION CREATE / RETRY RESPONSE
// ============================================================================
/**
 * Response payload for:
 * - POST /api/admin/subscriptions        (create)
 * - POST /api/admin/subscriptions/:userId/retry
 *
 * The subscription record, plus optional first-invoice payment outcome fields.
 * Both extras are optional so older servers (which return the bare subscription)
 * still validate.
 *
 * `paymentIntentStatus` exists because a Subscription row can be created while
 * its first invoice was never actually paid — the never-charged-subscription
 * bug. A wizard that only looks at the subscription cannot tell. When the status
 * is "requires_action", `paymentClientSecret` carries the secret the wizard needs
 * to complete 3DS on-session.
 */
export const AdminSubscriptionCreateResponseSchema = SubscriptionSchema.extend({
    /** Status of the off-session first-invoice PaymentIntent, when the server confirmed one. */
    paymentIntentStatus: PaymentIntentStatusSchema.optional(),
    /**
     * client_secret for completing 3DS on-session. Present only when
     * `paymentIntentStatus === "requires_action"`; null/absent otherwise.
     */
    paymentClientSecret: z.string().nullable().optional(),
});
/** Retry returns the same shape as create. */
export const AdminSubscriptionRetryResponseSchema = AdminSubscriptionCreateResponseSchema;
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
    /**
     * S3 key of the composite consent PDF generated after the signing flow.
     * When present, the server links the consent PDF to the created subscription record.
     * Set after a successful POST /api/admin/consent call in the ConsultationFlowModal.
     */
    pendingConsentKey: z.string().min(1),
});
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
// ============================================================================
// PAUSE REQUEST
// ============================================================================
export const PauseSubscriptionRequestSchema = z.object({
    pauseMonths: z.number().int().min(1).max(6),
    reason: z.string().optional(),
});
/**
 * Response for PATCH /api/admin/subscriptions/:id/pause.
 * The server returns the pause bookkeeping, NOT the subscription record.
 */
export const PauseSubscriptionResponseSchema = z.object({
    /** ISO-8601 UTC timestamp the membership auto-resumes. */
    pauseResumeDate: z.string(),
    pauseMonthsUsed: z.number(),
});
// ============================================================================
// RESUME RESPONSE
// ============================================================================
/** Response for PATCH /api/admin/subscriptions/:id/resume. */
export const ResumeSubscriptionResponseSchema = z.object({
    resumed: z.boolean(),
});
// ============================================================================
// TIER CHANGE REQUEST
// ============================================================================
export const TierChangeRequestSchema = z.object({
    newTier: z.enum(USER_TIERS),
    effectiveDate: z.string().optional(),
});
/**
 * Response for PATCH /api/admin/subscriptions/:id/tier.
 *
 * Discriminated on `type`: an upgrade takes effect immediately and returns the
 * session credits prorated onto the new tier; a downgrade is scheduled for the
 * end of the current period.
 */
export const TierChangeResponseSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("upgrade"),
        effectiveImmediately: z.literal(true),
        proratedCredits: z.array(z.object({
            sessionType: z.string(),
            creditAmount: z.number(),
        })),
    }),
    z.object({
        type: z.literal("downgrade"),
        effectiveImmediately: z.literal(false),
        /** ISO-8601 UTC timestamp the downgrade takes effect. */
        effectiveDate: z.string(),
    }),
]);
// ============================================================================
// SUBSCRIPTION LIST
// ============================================================================
export const SubscriptionListParamsSchema = z.object({
    status: z.string().optional(),
    tier: z.string().optional(),
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(200).optional(),
});
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
export const SubscriptionListResponseSchema = z.object({
    subscriptions: z.array(SubscriptionListItemSchema),
    pagination: z.object({
        page: z.number().int(),
        limit: z.number().int(),
        total: z.number().int(),
        pages: z.number().int(),
    }),
});
//# sourceMappingURL=subscription.js.map