/**
 * @ai-context Stripe payment contracts | Types for payment operations
 *
 * deps: zod | consumers: server routes, web-admin
 */

import { z } from "zod";

// ============================================================================
// SETUP INTENT
// ============================================================================

/** @deprecated Use SetupIntent (derived from SetupIntentSchema) instead */
export type SetupIntentContract = SetupIntent;

export const SetupIntentSchema = z.object({
  clientSecret: z.string(),
  customerId: z.string(),
});
export type SetupIntent = z.infer<typeof SetupIntentSchema>;

// ============================================================================
// PAYMENT METHOD
// ============================================================================

/** @deprecated Use PaymentMethod (derived from PaymentMethodSchema) instead */
export type PaymentMethodContract = PaymentMethod;

export const PaymentMethodSchema = z.object({
  id: z.string(),
  brand: z.string(),
  last4: z.string(),
  expMonth: z.number().int(),
  expYear: z.number().int(),
  isDefault: z.boolean(),
});
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

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
  .record(
    z.string(),
    z.string().max(500, "Metadata values must be 500 characters or less"),
  )
  .refine(
    (data) => Object.keys(data).length <= 50,
    "Metadata cannot have more than 50 keys",
  );

export type StripeMetadata = z.infer<typeof StripeMetadataSchema>;

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
export type CollectPaymentRequest = z.infer<typeof CollectPaymentRequestSchema>;

// ============================================================================
// STRIPE CONFIG (for frontend)
// ============================================================================

/** @deprecated Use StripeConfig (derived from StripeConfigSchema) instead */
export type StripeConfigContract = StripeConfig;

export const StripeConfigSchema = z.object({
  publishableKey: z.string(),
});
export type StripeConfig = z.infer<typeof StripeConfigSchema>;

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
export type RefundRequest = z.infer<typeof RefundRequestSchema>;

export const refundResponseSchema = z.object({
  refundId: z.string(),
  status: z.string(),
  amount: z.number().int(), // cents
});

export type RefundResponse = z.infer<typeof refundResponseSchema>;

// ============================================================================
// PAYMENT HISTORY
// ============================================================================

export const PAYMENT_HISTORY_STATUSES = [
  "paid",
  "pending",
  "failed",
  "refunded",
] as const;
export type PaymentHistoryStatus = (typeof PAYMENT_HISTORY_STATUSES)[number];

export const PaymentHistoryItemSchema = z.object({
  id: z.string(),
  invoiceId: z.string(),
  amount: z.number(),
  status: z.enum(PAYMENT_HISTORY_STATUSES),
  date: z.string(),
  invoicePdfUrl: z.string().nullable(),
  description: z.string(),
});
export type PaymentHistoryItem = z.infer<typeof PaymentHistoryItemSchema>;

export const PaymentHistoryResponseSchema = z.object({
  payments: z.array(PaymentHistoryItemSchema),
  hasMore: z.boolean(),
});
export type PaymentHistoryResponse = z.infer<typeof PaymentHistoryResponseSchema>;

// ============================================================================
// TERMINAL READER
// ============================================================================

export const TerminalReaderSchema = z.object({
  id: z.string(),
  label: z.string(),
  status: z.string(),
});
export type TerminalReader = z.infer<typeof TerminalReaderSchema>;
