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
/**
 * Billing account status - indicates payment health and collection stage.
 * - GOOD_STANDING: Account is current, no payment issues
 * - PAST_DUE: Payment overdue but not yet escalated
 * - DELINQUENT: Severely overdue, may suspend service
 * - COLLECTIONS: Sent to collections agency
 * - DISPUTED: Active payment dispute / chargeback filed
 */
export declare const BILLING_STATUSES: readonly ["GOOD_STANDING", "PAST_DUE", "DELINQUENT", "COLLECTIONS", "DISPUTED"];
export type BillingStatus = z.infer<typeof BillingStatusSchema>;
export declare const BillingStatusSchema: z.ZodEnum<{
    DELINQUENT: "DELINQUENT";
    COLLECTIONS: "COLLECTIONS";
    PAST_DUE: "PAST_DUE";
    GOOD_STANDING: "GOOD_STANDING";
    DISPUTED: "DISPUTED";
}>;
/** Centralized billing status constants for equality checks */
export declare const BILLING_STATUS: {
    readonly GOOD_STANDING: "GOOD_STANDING";
    readonly PAST_DUE: "PAST_DUE";
    readonly DELINQUENT: "DELINQUENT";
    readonly COLLECTIONS: "COLLECTIONS";
    readonly DISPUTED: "DISPUTED";
};
/** Human-readable labels for billing statuses */
export declare const BILLING_STATUS_LABELS: Record<BillingStatus, string>;
/**
 * Check if a string is a valid billing status
 */
export declare function isBillingStatus(value: string): value is BillingStatus;
/**
 * Chargeback/dispute lifecycle status.
 * - NEEDS_RESPONSE: Dispute filed, requires our response
 * - UNDER_REVIEW: Response submitted, awaiting decision
 * - WON: Dispute resolved in our favor
 * - LOST: Dispute lost, funds reversed
 */
export declare const DISPUTE_STATUSES: readonly ["NEEDS_RESPONSE", "UNDER_REVIEW", "WON", "LOST"];
export type DisputeStatus = z.infer<typeof DisputeStatusSchema>;
export declare const DisputeStatusSchema: z.ZodEnum<{
    NEEDS_RESPONSE: "NEEDS_RESPONSE";
    UNDER_REVIEW: "UNDER_REVIEW";
    WON: "WON";
    LOST: "LOST";
}>;
/** Centralized dispute status constants for equality checks */
export declare const DISPUTE_STATUS: {
    readonly NEEDS_RESPONSE: "NEEDS_RESPONSE";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly WON: "WON";
    readonly LOST: "LOST";
};
/** Human-readable labels for dispute statuses */
export declare const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string>;
/**
 * Check if a string is a valid dispute status
 */
export declare function isDisputeStatus(value: string): value is DisputeStatus;
/**
 * A user in delinquent or collections billing status.
 * Returned by the admin billing analytics endpoint.
 */
export declare const DelinquentUserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    billingStatus: z.ZodEnum<{
        DELINQUENT: "DELINQUENT";
        COLLECTIONS: "COLLECTIONS";
    }>;
    outstandingAmount: z.ZodNumber;
    daysPastDue: z.ZodNumber;
    sentToCollections: z.ZodBoolean;
    sentToCollectionsAt: z.ZodNullable<z.ZodString>;
    collectionAgency: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    lastTier: z.ZodNullable<z.ZodString>;
    lastPaymentFailedAt: z.ZodNullable<z.ZodString>;
    delinquencyRecordId: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type DelinquentUser = z.infer<typeof DelinquentUserSchema>;
/**
 * Canonical paginated delinquent users response.
 * Shape: { data: DelinquentUser[], pagination: PaginationMeta }
 *
 * @migration Replaced legacy { users, count } shape with canonical paginated shape.
 * Server returns this via createOffsetPaginatedResponse().
 */
export declare const DelinquentUsersResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        billingStatus: z.ZodEnum<{
            DELINQUENT: "DELINQUENT";
            COLLECTIONS: "COLLECTIONS";
        }>;
        outstandingAmount: z.ZodNumber;
        daysPastDue: z.ZodNumber;
        sentToCollections: z.ZodBoolean;
        sentToCollectionsAt: z.ZodNullable<z.ZodString>;
        collectionAgency: z.ZodNullable<z.ZodString>;
        notes: z.ZodNullable<z.ZodString>;
        lastTier: z.ZodNullable<z.ZodString>;
        lastPaymentFailedAt: z.ZodNullable<z.ZodString>;
        delinquencyRecordId: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type DelinquentUsersResponse = z.infer<typeof DelinquentUsersResponseSchema>;
export declare const SendToCollectionsRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    collectionAgency: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SendToCollectionsRequest = z.infer<typeof SendToCollectionsRequestSchema>;
export declare const UpdateDelinquencyNotesRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    notes: z.ZodString;
}, z.core.$strip>;
export type UpdateDelinquencyNotesRequest = z.infer<typeof UpdateDelinquencyNotesRequestSchema>;
export declare const ContractUploadRequestSchema: z.ZodObject<{
    subscriptionId: z.ZodString;
    fileBase64: z.ZodString;
    fileName: z.ZodString;
}, z.core.$strip>;
export type ContractUploadRequest = z.infer<typeof ContractUploadRequestSchema>;
/**
 * Valid SubscriptionInvoice status values (matches Stripe invoice lifecycle).
 * - draft: Invoice not yet finalized
 * - open: Invoice finalized, awaiting payment
 * - paid: Invoice paid in full
 * - void: Invoice voided (cancelled before payment)
 * - uncollectible: Invoice marked uncollectible (bad debt)
 *
 * Matches `SubscriptionInvoice.status` comment in server/prisma/schema.prisma.
 */
export declare const INVOICE_STATUS: {
    readonly DRAFT: "draft";
    readonly OPEN: "open";
    readonly PAID: "paid";
    readonly VOID: "void";
    readonly UNCOLLECTIBLE: "uncollectible";
    readonly REFUNDED: "refunded";
};
export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];
/**
 * Source that initiated a subscription/tier change event.
 * - admin: Admin-initiated action (CRM, dashboard)
 * - system_cron: Automated cron job (grace period, delinquency)
 * - stripe_webhook: Incoming Stripe webhook event
 * - stripe_checkout: Stripe Checkout session completion
 */
export declare const TIER_CHANGE_TRIGGER: readonly ["admin", "system_cron", "stripe_webhook", "stripe_checkout"];
export declare const TierChangeTriggerSchema: z.ZodEnum<{
    admin: "admin";
    system_cron: "system_cron";
    stripe_webhook: "stripe_webhook";
    stripe_checkout: "stripe_checkout";
}>;
export type TierChangeTrigger = z.infer<typeof TierChangeTriggerSchema>;
/** Centralized trigger constants for equality checks */
export declare const TIER_CHANGE_TRIGGER_MAP: {
    readonly ADMIN: "admin";
    readonly SYSTEM_CRON: "system_cron";
    readonly STRIPE_WEBHOOK: "stripe_webhook";
    readonly STRIPE_CHECKOUT: "stripe_checkout";
};
/**
 * Check if a string is a valid tier change trigger
 */
export declare function isTierChangeTrigger(value: string): value is TierChangeTrigger;
//# sourceMappingURL=billing.d.ts.map