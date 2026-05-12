/**
 * @ai-context Stripe payment contracts | Types for payment operations
 *
 * deps: zod | consumers: server routes, web-admin
 */
import { z } from "zod";
export const SetupIntentSchema = z.object({
    clientSecret: z.string(),
    customerId: z.string(),
});
export const PaymentMethodSchema = z.object({
    id: z.string(),
    brand: z.string(),
    last4: z.string(),
    expMonth: z.number().int(),
    expYear: z.number().int(),
    isDefault: z.boolean(),
});
// ============================================================================
// STRIPE METADATA
// ============================================================================
/**
 * Stripe metadata validation schema.
 *
 * Stripe API limits:
 * - Each metadata value: max 500 characters
 * - Each metadata object: max 50 keys
 *
 * @see https://stripe.com/docs/api/metadata
 */
export const StripeMetadataSchema = z
    .record(z.string(), z.string().max(500, "Metadata values must be 500 characters or less"))
    .refine((data) => Object.keys(data).length <= 50, "Metadata cannot have more than 50 keys");
// ============================================================================
// COLLECT PAYMENT REQUEST
// ============================================================================
export const CollectPaymentRequestSchema = z.object({
    /** userId uses HH-XXXXXX barcode format, not UUID */
    userId: z.string().min(1),
    // VALIDATION-CONFIRMED: .int().positive() rejects floats, zero, and negative
    // values before amountInCents reaches createPaymentIntent(). Max $5,000 cap
    // prevents accidental over-charge. (audit Cat4 #12)
    amountInCents: z.number().int().positive().max(500_000), // Max $5,000
    description: z.string(),
    metadata: StripeMetadataSchema.optional(),
});
export const StripeConfigSchema = z.object({
    publishableKey: z.string(),
});
// ============================================================================
// REFUND REQUEST
// ============================================================================
export const RefundRequestSchema = z.object({
    paymentIntentId: z.string(),
    amountInCents: z.number().int().positive().max(500_000).optional(), // Max $5,000
    reason: z
        .enum(["requested_by_customer", "duplicate", "fraudulent"])
        .optional(),
    notes: z.string().max(500).optional(),
});
export const refundResponseSchema = z.object({
    refundId: z.string(),
    status: z.string(),
    amount: z.number().int(), // cents
});
// ============================================================================
// PAYMENT HISTORY
// ============================================================================
export const PAYMENT_HISTORY_STATUSES = [
    "paid",
    "pending",
    "failed",
    "refunded",
];
export const PaymentHistoryItemSchema = z.object({
    id: z.string(),
    invoiceId: z.string(),
    amount: z.number().int(), // cents
    status: z.enum(PAYMENT_HISTORY_STATUSES),
    date: z.string(),
    invoicePdfUrl: z.string().nullable(),
    description: z.string(),
});
export const PaymentHistoryResponseSchema = z.object({
    payments: z.array(PaymentHistoryItemSchema),
    hasMore: z.boolean(),
});
// ============================================================================
// TERMINAL READER
// ============================================================================
export const TerminalReaderSchema = z.object({
    id: z.string(),
    label: z.string(),
    status: z.string(),
});
//# sourceMappingURL=payment.js.map