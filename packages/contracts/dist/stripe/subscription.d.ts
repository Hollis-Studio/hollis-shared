/**
 * @ai-context Stripe subscription contracts | Shared types for subscription data
 *
 * These contracts define the shape of subscription data for API responses
 * and frontend consumption.
 *
 * deps: zod, domain/user | consumers: server routes, web-admin
 */
import { z } from "zod";
export declare const SUBSCRIPTION_STATUSES: readonly ["PENDING", "TRIAL", "ACTIVE", "PAUSED", "PAST_DUE", "CANCELED", "TERMINATED", "SUSPENDED"];
export declare const SubscriptionStatusSchema: z.ZodEnum<{
    ACTIVE: "ACTIVE";
    PAUSED: "PAUSED";
    PENDING: "PENDING";
    TRIAL: "TRIAL";
    PAST_DUE: "PAST_DUE";
    CANCELED: "CANCELED";
    TERMINATED: "TERMINATED";
    SUSPENDED: "SUSPENDED";
}>;
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
/** Lookup object for subscription statuses (avoids magic strings) */
export declare const SUBSCRIPTION_STATUS: {
    readonly PENDING: "PENDING";
    readonly TRIAL: "TRIAL";
    readonly ACTIVE: "ACTIVE";
    readonly PAUSED: "PAUSED";
    readonly PAST_DUE: "PAST_DUE";
    readonly CANCELED: "CANCELED";
    readonly TERMINATED: "TERMINATED";
    readonly SUSPENDED: "SUSPENDED";
};
/** Human-readable labels for subscription statuses */
export declare const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string>;
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
export declare const SUBSCRIPTION_EVENT_TYPE: {
    /** Subscription record first created (admin-initiated or checkout). */
    readonly CREATED: "created";
    /** Subscription reactivated after a previous cancellation. */
    readonly REACTIVATED: "reactivated";
    /** Subscription soft-canceled; remains active until period end. */
    readonly CANCELED: "canceled";
    /** Subscription hard-terminated immediately (e.g. delinquency, fraud). */
    readonly TERMINATED: "terminated";
    /** Subscription terminated because the grace period expired. */
    readonly TERMINATED_GRACE_PERIOD_EXPIRED: "terminated_grace_period_expired";
    /** Trial period ended and first real payment collected. */
    readonly TRIAL_CONVERTED: "trial_converted";
    /** Successful recurring invoice paid; subscription renewed. */
    readonly RENEWED: "renewed";
    /** Invoice payment failed. */
    readonly PAYMENT_FAILED: "payment_failed";
    /** Asynchronous payment method failed. */
    readonly ASYNC_PAYMENT_FAILED: "async_payment_failed";
    /** Invoice voided (post session-reset path). */
    readonly INVOICE_VOIDED_POST_RESET: "invoice_voided_post_reset";
    /** Invoice voided (standard path). */
    readonly INVOICE_VOIDED: "invoice_voided";
    /** Charge refunded (post session-reset path). */
    readonly REFUND_POST_RESET: "refund_post_reset";
    /** Charge refunded (standard path). */
    readonly REFUNDED: "refunded";
    /** Stripe dispute (chargeback) opened. */
    readonly DISPUTE_CREATED: "dispute_created";
    /** Stripe dispute (chargeback) resolved. */
    readonly DISPUTE_RESOLVED: "dispute_resolved";
    /** Early-termination fee calculated and persisted for the subscriber. */
    readonly EARLY_TERMINATION_QUOTED: "early_termination_quoted";
    /** Subscription paused. */
    readonly PAUSED: "paused";
    /** Paused subscription resumed (early or on schedule). */
    readonly RESUMED: "resumed";
    /** A pending tier change was cleared because the subscription was paused. */
    readonly SCHEDULED_TIER_CHANGE_CLEARED: "scheduled_tier_change_cleared";
    /** Tier upgraded immediately. */
    readonly TIER_UPGRADED: "tier_upgraded";
    /** Tier downgrade scheduled for next billing boundary. */
    readonly TIER_DOWNGRADE_SCHEDULED: "tier_downgrade_scheduled";
    /** Tier change (scheduled downgrade) cancelled. */
    readonly TIER_CHANGE_CANCELLED: "tier_change_cancelled";
    /** Tier upgraded while subscription is in a grace period. */
    readonly UPGRADE_FROM_GRACE_PERIOD: "upgrade_from_grace_period";
    /**
     * Tier changed (used by the subscriptionUpdated webhook for generic
     * tier-change events detected via Stripe metadata comparison).
     */
    readonly TIER_CHANGED: "tier_changed";
    /** Generic subscription status change detected by the webhook handler. */
    readonly STATUS_CHANGED: "status_changed";
    /** Cancellation scheduled (cancel_at_period_end set via Stripe). */
    readonly CANCEL_SCHEDULED: "cancel_scheduled";
    /** Pending cancellation reversed (cancel_at_period_end cleared). */
    readonly CANCEL_REVERSED: "cancel_reversed";
    /** User marked delinquent by the delinquency tracking job. */
    readonly MARKED_DELINQUENT: "marked_delinquent";
    /** Grace period warning notification sent to user. */
    readonly GRACE_PERIOD_WARNING_SENT: "grace_period_warning_sent";
};
/** Union type of all valid SubscriptionEvent.eventType values. */
export type SubscriptionEventType = (typeof SUBSCRIPTION_EVENT_TYPE)[keyof typeof SUBSCRIPTION_EVENT_TYPE];
/**
 * Status values for Stripe SubscriptionSchedule objects.
 * These are Stripe's values, not our internal status.
 * @see https://docs.stripe.com/api/subscription_schedules/object#subscription_schedule_object-status
 */
export declare const STRIPE_SCHEDULE_STATUSES: readonly ["not_started", "active", "completed", "released", "canceled"];
export type StripeScheduleStatus = (typeof STRIPE_SCHEDULE_STATUSES)[number];
/** Lookup object for Stripe subscription schedule statuses */
export declare const STRIPE_SCHEDULE_STATUS: {
    readonly NOT_STARTED: "not_started";
    readonly ACTIVE: "active";
    readonly COMPLETED: "completed";
    readonly RELEASED: "released";
    readonly CANCELED: "canceled";
};
export declare const CONTRACT_DURATIONS: readonly ["MONTH_4", "MONTH_8", "MONTH_12"];
export declare const ContractDurationSchema: z.ZodEnum<{
    MONTH_4: "MONTH_4";
    MONTH_8: "MONTH_8";
    MONTH_12: "MONTH_12";
}>;
export type ContractDuration = z.infer<typeof ContractDurationSchema>;
/** Map duration to months */
export declare const CONTRACT_DURATION_MONTHS: Record<ContractDuration, number>;
/**
 * Map duration to discount percentage.
 *
 * Derived from the master offer sheet (`domain/offer-sheet.json`) — the single
 * source of truth for commercial terms. Editing a term's `discountPercent`
 * there changes billing here with no code edit, and a removed term fails loudly
 * instead of silently reverting to the old hardcoded number.
 */
export declare const CONTRACT_DURATION_DISCOUNTS: Record<ContractDuration, number>;
/** Constant object for contract duration comparisons (avoids magic strings) */
export declare const CONTRACT_DURATION: {
    readonly MONTH_4: "MONTH_4";
    readonly MONTH_8: "MONTH_8";
    readonly MONTH_12: "MONTH_12";
};
export declare const BILLING_SOURCES: readonly ["DIRECT", "ORGANIZATION"];
export declare const BillingSourceSchema: z.ZodEnum<{
    DIRECT: "DIRECT";
    ORGANIZATION: "ORGANIZATION";
}>;
export type BillingSource = z.infer<typeof BillingSourceSchema>;
/** Constant object for billing source comparisons (avoids magic strings) */
export declare const BILLING_SOURCE: {
    readonly DIRECT: "DIRECT";
    readonly ORGANIZATION: "ORGANIZATION";
};
export declare const SubscriptionSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    stripeSubscriptionId: z.ZodString;
    stripeCustomerId: z.ZodString;
    stripePriceId: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
        PENDING: "PENDING";
        TRIAL: "TRIAL";
        PAST_DUE: "PAST_DUE";
        CANCELED: "CANCELED";
        TERMINATED: "TERMINATED";
        SUSPENDED: "SUSPENDED";
    }>;
    contractDuration: z.ZodEnum<{
        MONTH_4: "MONTH_4";
        MONTH_8: "MONTH_8";
        MONTH_12: "MONTH_12";
    }>;
    contractStartDate: z.ZodString;
    contractEndDate: z.ZodString;
    discountPercent: z.ZodCoercedNumber<unknown>;
    billingSource: z.ZodEnum<{
        DIRECT: "DIRECT";
        ORGANIZATION: "ORGANIZATION";
    }>;
    billingOrganizationId: z.ZodNullable<z.ZodString>;
    monthlyPriceInCents: z.ZodNumber;
    currentPeriodStart: z.ZodString;
    currentPeriodEnd: z.ZodString;
    billingAnchorDay: z.ZodNumber;
    isInGracePeriod: z.ZodBoolean;
    gracePeriodEndsAt: z.ZodNullable<z.ZodString>;
    isPaused: z.ZodBoolean;
    pausedAt: z.ZodNullable<z.ZodString>;
    pauseResumeDate: z.ZodNullable<z.ZodString>;
    pauseMonthsUsed: z.ZodNumber;
    pauseMonthsRemaining: z.ZodNumber;
    isCanceled: z.ZodBoolean;
    canceledAt: z.ZodNullable<z.ZodString>;
    cancelEffectiveDate: z.ZodNullable<z.ZodString>;
    scheduledTierChange: z.ZodNullable<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    tierChangeEffectiveDate: z.ZodNullable<z.ZodString>;
    signedContractKey: z.ZodNullable<z.ZodString>;
    failedPaymentCount: z.ZodDefault<z.ZodNumber>;
    cancelReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    earlyTerminationFee: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type SubscriptionContract = z.infer<typeof SubscriptionSchema>;
/**
 * Terminal-or-actionable status of the PaymentIntent the server confirms
 * off-session while creating a subscription.
 *
 * Only "succeeded" means the card was actually charged. "requires_action" means
 * the issuer demanded 3DS, which an off-session confirmation cannot complete —
 * the admin wizard has to finish it on-session with `paymentClientSecret`.
 */
export declare const PAYMENT_INTENT_STATUSES: readonly ["succeeded", "requires_action", "processing", "requires_payment_method"];
export declare const PaymentIntentStatusSchema: z.ZodEnum<{
    succeeded: "succeeded";
    requires_action: "requires_action";
    processing: "processing";
    requires_payment_method: "requires_payment_method";
}>;
export type PaymentIntentStatus = z.infer<typeof PaymentIntentStatusSchema>;
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
export declare const AdminSubscriptionCreateResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    stripeSubscriptionId: z.ZodString;
    stripeCustomerId: z.ZodString;
    stripePriceId: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
        PENDING: "PENDING";
        TRIAL: "TRIAL";
        PAST_DUE: "PAST_DUE";
        CANCELED: "CANCELED";
        TERMINATED: "TERMINATED";
        SUSPENDED: "SUSPENDED";
    }>;
    contractDuration: z.ZodEnum<{
        MONTH_4: "MONTH_4";
        MONTH_8: "MONTH_8";
        MONTH_12: "MONTH_12";
    }>;
    contractStartDate: z.ZodString;
    contractEndDate: z.ZodString;
    discountPercent: z.ZodCoercedNumber<unknown>;
    billingSource: z.ZodEnum<{
        DIRECT: "DIRECT";
        ORGANIZATION: "ORGANIZATION";
    }>;
    billingOrganizationId: z.ZodNullable<z.ZodString>;
    monthlyPriceInCents: z.ZodNumber;
    currentPeriodStart: z.ZodString;
    currentPeriodEnd: z.ZodString;
    billingAnchorDay: z.ZodNumber;
    isInGracePeriod: z.ZodBoolean;
    gracePeriodEndsAt: z.ZodNullable<z.ZodString>;
    isPaused: z.ZodBoolean;
    pausedAt: z.ZodNullable<z.ZodString>;
    pauseResumeDate: z.ZodNullable<z.ZodString>;
    pauseMonthsUsed: z.ZodNumber;
    pauseMonthsRemaining: z.ZodNumber;
    isCanceled: z.ZodBoolean;
    canceledAt: z.ZodNullable<z.ZodString>;
    cancelEffectiveDate: z.ZodNullable<z.ZodString>;
    scheduledTierChange: z.ZodNullable<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    tierChangeEffectiveDate: z.ZodNullable<z.ZodString>;
    signedContractKey: z.ZodNullable<z.ZodString>;
    failedPaymentCount: z.ZodDefault<z.ZodNumber>;
    cancelReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    earlyTerminationFee: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    paymentIntentStatus: z.ZodOptional<z.ZodEnum<{
        succeeded: "succeeded";
        requires_action: "requires_action";
        processing: "processing";
        requires_payment_method: "requires_payment_method";
    }>>;
    paymentClientSecret: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type AdminSubscriptionCreateResponse = z.infer<typeof AdminSubscriptionCreateResponseSchema>;
/** Retry returns the same shape as create. */
export declare const AdminSubscriptionRetryResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    stripeSubscriptionId: z.ZodString;
    stripeCustomerId: z.ZodString;
    stripePriceId: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
        PENDING: "PENDING";
        TRIAL: "TRIAL";
        PAST_DUE: "PAST_DUE";
        CANCELED: "CANCELED";
        TERMINATED: "TERMINATED";
        SUSPENDED: "SUSPENDED";
    }>;
    contractDuration: z.ZodEnum<{
        MONTH_4: "MONTH_4";
        MONTH_8: "MONTH_8";
        MONTH_12: "MONTH_12";
    }>;
    contractStartDate: z.ZodString;
    contractEndDate: z.ZodString;
    discountPercent: z.ZodCoercedNumber<unknown>;
    billingSource: z.ZodEnum<{
        DIRECT: "DIRECT";
        ORGANIZATION: "ORGANIZATION";
    }>;
    billingOrganizationId: z.ZodNullable<z.ZodString>;
    monthlyPriceInCents: z.ZodNumber;
    currentPeriodStart: z.ZodString;
    currentPeriodEnd: z.ZodString;
    billingAnchorDay: z.ZodNumber;
    isInGracePeriod: z.ZodBoolean;
    gracePeriodEndsAt: z.ZodNullable<z.ZodString>;
    isPaused: z.ZodBoolean;
    pausedAt: z.ZodNullable<z.ZodString>;
    pauseResumeDate: z.ZodNullable<z.ZodString>;
    pauseMonthsUsed: z.ZodNumber;
    pauseMonthsRemaining: z.ZodNumber;
    isCanceled: z.ZodBoolean;
    canceledAt: z.ZodNullable<z.ZodString>;
    cancelEffectiveDate: z.ZodNullable<z.ZodString>;
    scheduledTierChange: z.ZodNullable<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    tierChangeEffectiveDate: z.ZodNullable<z.ZodString>;
    signedContractKey: z.ZodNullable<z.ZodString>;
    failedPaymentCount: z.ZodDefault<z.ZodNumber>;
    cancelReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    earlyTerminationFee: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    paymentIntentStatus: z.ZodOptional<z.ZodEnum<{
        succeeded: "succeeded";
        requires_action: "requires_action";
        processing: "processing";
        requires_payment_method: "requires_payment_method";
    }>>;
    paymentClientSecret: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type AdminSubscriptionRetryResponse = AdminSubscriptionCreateResponse;
export declare const CreateSubscriptionRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    contractDuration: z.ZodEnum<{
        MONTH_4: "MONTH_4";
        MONTH_8: "MONTH_8";
        MONTH_12: "MONTH_12";
    }>;
    billingSource: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        DIRECT: "DIRECT";
        ORGANIZATION: "ORGANIZATION";
    }>>>;
    billingOrganizationId: z.ZodOptional<z.ZodString>;
    paymentMethodId: z.ZodOptional<z.ZodString>;
    pendingConsentKey: z.ZodString;
}, z.core.$strip>;
export type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionRequestSchema>;
export declare const EarlyTerminationQuoteSchema: z.ZodObject<{
    subscriptionId: z.ZodString;
    remainingMonths: z.ZodNumber;
    monthlyPriceInCents: z.ZodNumber;
    remainingDueInCents: z.ZodNumber;
    terminationFeeInCents: z.ZodNumber;
    effectiveImmediately: z.ZodBoolean;
}, z.core.$strip>;
export type EarlyTerminationQuoteContract = z.infer<typeof EarlyTerminationQuoteSchema>;
/** @deprecated Use EarlyTerminationQuoteContract */
export type EarlyTerminationQuote = EarlyTerminationQuoteContract;
export declare const PauseSubscriptionRequestSchema: z.ZodObject<{
    pauseMonths: z.ZodNumber;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PauseSubscriptionRequest = z.infer<typeof PauseSubscriptionRequestSchema>;
/**
 * Response for PATCH /api/admin/subscriptions/:id/pause.
 * The server returns the pause bookkeeping, NOT the subscription record.
 */
export declare const PauseSubscriptionResponseSchema: z.ZodObject<{
    pauseResumeDate: z.ZodString;
    pauseMonthsUsed: z.ZodNumber;
}, z.core.$strip>;
export type PauseSubscriptionResponse = z.infer<typeof PauseSubscriptionResponseSchema>;
/** Response for PATCH /api/admin/subscriptions/:id/resume. */
export declare const ResumeSubscriptionResponseSchema: z.ZodObject<{
    resumed: z.ZodBoolean;
}, z.core.$strip>;
export type ResumeSubscriptionResponse = z.infer<typeof ResumeSubscriptionResponseSchema>;
export declare const TierChangeRequestSchema: z.ZodObject<{
    newTier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    effectiveDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type TierChangeRequest = z.infer<typeof TierChangeRequestSchema>;
/**
 * Response for PATCH /api/admin/subscriptions/:id/tier.
 *
 * Discriminated on `type`: an upgrade takes effect immediately and returns the
 * session credits prorated onto the new tier; a downgrade is scheduled for the
 * end of the current period.
 */
export declare const TierChangeResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"upgrade">;
    effectiveImmediately: z.ZodLiteral<true>;
    proratedCredits: z.ZodArray<z.ZodObject<{
        sessionType: z.ZodString;
        creditAmount: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"downgrade">;
    effectiveImmediately: z.ZodLiteral<false>;
    effectiveDate: z.ZodString;
}, z.core.$strip>], "type">;
export type TierChangeResponse = z.infer<typeof TierChangeResponseSchema>;
export declare const SubscriptionListParamsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodString>;
    tier: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type SubscriptionListParams = z.infer<typeof SubscriptionListParamsSchema>;
/**
 * A subscription entry enriched with basic user info for the admin list view.
 */
export declare const SubscriptionListItemSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    stripeSubscriptionId: z.ZodString;
    stripeCustomerId: z.ZodString;
    stripePriceId: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
        PENDING: "PENDING";
        TRIAL: "TRIAL";
        PAST_DUE: "PAST_DUE";
        CANCELED: "CANCELED";
        TERMINATED: "TERMINATED";
        SUSPENDED: "SUSPENDED";
    }>;
    contractDuration: z.ZodEnum<{
        MONTH_4: "MONTH_4";
        MONTH_8: "MONTH_8";
        MONTH_12: "MONTH_12";
    }>;
    contractStartDate: z.ZodString;
    contractEndDate: z.ZodString;
    discountPercent: z.ZodCoercedNumber<unknown>;
    billingSource: z.ZodEnum<{
        DIRECT: "DIRECT";
        ORGANIZATION: "ORGANIZATION";
    }>;
    billingOrganizationId: z.ZodNullable<z.ZodString>;
    monthlyPriceInCents: z.ZodNumber;
    currentPeriodStart: z.ZodString;
    currentPeriodEnd: z.ZodString;
    billingAnchorDay: z.ZodNumber;
    isInGracePeriod: z.ZodBoolean;
    gracePeriodEndsAt: z.ZodNullable<z.ZodString>;
    isPaused: z.ZodBoolean;
    pausedAt: z.ZodNullable<z.ZodString>;
    pauseResumeDate: z.ZodNullable<z.ZodString>;
    pauseMonthsUsed: z.ZodNumber;
    pauseMonthsRemaining: z.ZodNumber;
    isCanceled: z.ZodBoolean;
    canceledAt: z.ZodNullable<z.ZodString>;
    cancelEffectiveDate: z.ZodNullable<z.ZodString>;
    scheduledTierChange: z.ZodNullable<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    tierChangeEffectiveDate: z.ZodNullable<z.ZodString>;
    signedContractKey: z.ZodNullable<z.ZodString>;
    failedPaymentCount: z.ZodDefault<z.ZodNumber>;
    cancelReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    earlyTerminationFee: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodNullable<z.ZodString>;
        lastName: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SubscriptionListItem = z.infer<typeof SubscriptionListItemSchema>;
export declare const SubscriptionListResponseSchema: z.ZodObject<{
    subscriptions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        stripeSubscriptionId: z.ZodString;
        stripeCustomerId: z.ZodString;
        stripePriceId: z.ZodString;
        tier: z.ZodEnum<{
            ESSENTIALS: "ESSENTIALS";
            CORE: "CORE";
            CONCIERGE: "CONCIERGE";
        }>;
        status: z.ZodEnum<{
            ACTIVE: "ACTIVE";
            PAUSED: "PAUSED";
            PENDING: "PENDING";
            TRIAL: "TRIAL";
            PAST_DUE: "PAST_DUE";
            CANCELED: "CANCELED";
            TERMINATED: "TERMINATED";
            SUSPENDED: "SUSPENDED";
        }>;
        contractDuration: z.ZodEnum<{
            MONTH_4: "MONTH_4";
            MONTH_8: "MONTH_8";
            MONTH_12: "MONTH_12";
        }>;
        contractStartDate: z.ZodString;
        contractEndDate: z.ZodString;
        discountPercent: z.ZodCoercedNumber<unknown>;
        billingSource: z.ZodEnum<{
            DIRECT: "DIRECT";
            ORGANIZATION: "ORGANIZATION";
        }>;
        billingOrganizationId: z.ZodNullable<z.ZodString>;
        monthlyPriceInCents: z.ZodNumber;
        currentPeriodStart: z.ZodString;
        currentPeriodEnd: z.ZodString;
        billingAnchorDay: z.ZodNumber;
        isInGracePeriod: z.ZodBoolean;
        gracePeriodEndsAt: z.ZodNullable<z.ZodString>;
        isPaused: z.ZodBoolean;
        pausedAt: z.ZodNullable<z.ZodString>;
        pauseResumeDate: z.ZodNullable<z.ZodString>;
        pauseMonthsUsed: z.ZodNumber;
        pauseMonthsRemaining: z.ZodNumber;
        isCanceled: z.ZodBoolean;
        canceledAt: z.ZodNullable<z.ZodString>;
        cancelEffectiveDate: z.ZodNullable<z.ZodString>;
        scheduledTierChange: z.ZodNullable<z.ZodEnum<{
            ESSENTIALS: "ESSENTIALS";
            CORE: "CORE";
            CONCIERGE: "CONCIERGE";
        }>>;
        tierChangeEffectiveDate: z.ZodNullable<z.ZodString>;
        signedContractKey: z.ZodNullable<z.ZodString>;
        failedPaymentCount: z.ZodDefault<z.ZodNumber>;
        cancelReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        earlyTerminationFee: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        user: z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            firstName: z.ZodNullable<z.ZodString>;
            lastName: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        pages: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SubscriptionListResponse = z.infer<typeof SubscriptionListResponseSchema>;
//# sourceMappingURL=subscription.d.ts.map