/**
 * @ai-context Stripe payment contracts | Types for payment operations
 *
 * deps: zod | consumers: server routes, web-admin
 */
import { z } from "zod";
/** @deprecated Use SetupIntent (derived from SetupIntentSchema) instead */
export type SetupIntentContract = SetupIntent;
export declare const SetupIntentSchema: z.ZodObject<{
    clientSecret: z.ZodString;
    customerId: z.ZodString;
}, z.core.$strip>;
export type SetupIntent = z.infer<typeof SetupIntentSchema>;
/** @deprecated Use PaymentMethod (derived from PaymentMethodSchema) instead */
export type PaymentMethodContract = PaymentMethod;
export declare const PaymentMethodSchema: z.ZodObject<{
    id: z.ZodString;
    brand: z.ZodString;
    last4: z.ZodString;
    expMonth: z.ZodNumber;
    expYear: z.ZodNumber;
    isDefault: z.ZodBoolean;
}, z.core.$strip>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
/**
 * Stripe metadata validation schema.
 *
 * Stripe API limits:
 * - Each metadata value: max 500 characters
 * - Each metadata object: max 50 keys
 *
 * @see https://stripe.com/docs/api/metadata
 */
export declare const StripeMetadataSchema: z.ZodRecord<z.ZodString, z.ZodString>;
export type StripeMetadata = z.infer<typeof StripeMetadataSchema>;
export declare const CollectPaymentRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    amountInCents: z.ZodNumber;
    paymentPurpose: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        one_time_payment: "one_time_payment";
    }>>>;
    description: z.ZodOptional<z.ZodNever>;
    metadata: z.ZodOptional<z.ZodNever>;
}, z.core.$strip>;
export type CollectPaymentRequest = z.infer<typeof CollectPaymentRequestSchema>;
/** @deprecated Use StripeConfig (derived from StripeConfigSchema) instead */
export type StripeConfigContract = StripeConfig;
export declare const StripeConfigSchema: z.ZodObject<{
    publishableKey: z.ZodString;
}, z.core.$strip>;
export type StripeConfig = z.infer<typeof StripeConfigSchema>;
export declare const RefundRequestSchema: z.ZodObject<{
    paymentIntentId: z.ZodString;
    amountInCents: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodOptional<z.ZodEnum<{
        requested_by_customer: "requested_by_customer";
        duplicate: "duplicate";
        fraudulent: "fraudulent";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RefundRequest = z.infer<typeof RefundRequestSchema>;
export declare const refundResponseSchema: z.ZodObject<{
    refundId: z.ZodString;
    status: z.ZodString;
    amount: z.ZodNumber;
}, z.core.$strip>;
export type RefundResponse = z.infer<typeof refundResponseSchema>;
export declare const PAYMENT_HISTORY_STATUSES: readonly ["paid", "pending", "failed", "refunded"];
export type PaymentHistoryStatus = (typeof PAYMENT_HISTORY_STATUSES)[number];
export declare const PaymentHistoryItemSchema: z.ZodObject<{
    id: z.ZodString;
    invoiceId: z.ZodString;
    amount: z.ZodNumber;
    status: z.ZodEnum<{
        pending: "pending";
        refunded: "refunded";
        paid: "paid";
        failed: "failed";
    }>;
    date: z.ZodString;
    invoicePdfUrl: z.ZodNullable<z.ZodString>;
    description: z.ZodString;
}, z.core.$strip>;
export type PaymentHistoryItem = z.infer<typeof PaymentHistoryItemSchema>;
export declare const PaymentHistoryResponseSchema: z.ZodObject<{
    payments: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        invoiceId: z.ZodString;
        amount: z.ZodNumber;
        status: z.ZodEnum<{
            pending: "pending";
            refunded: "refunded";
            paid: "paid";
            failed: "failed";
        }>;
        date: z.ZodString;
        invoicePdfUrl: z.ZodNullable<z.ZodString>;
        description: z.ZodString;
    }, z.core.$strip>>;
    hasMore: z.ZodBoolean;
}, z.core.$strip>;
export type PaymentHistoryResponse = z.infer<typeof PaymentHistoryResponseSchema>;
export declare const TerminalReaderSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    status: z.ZodString;
}, z.core.$strip>;
export type TerminalReader = z.infer<typeof TerminalReaderSchema>;
//# sourceMappingURL=payment.d.ts.map