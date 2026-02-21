/**
 * @ai-context Stripe payment contracts | Types for payment operations
 *
 * deps: zod | consumers: server routes, web-admin
 */

import { z } from "zod";

// ============================================================================
// SETUP INTENT
// ============================================================================

export interface SetupIntentContract {
  clientSecret: string;
  customerId: string;
}

export const SetupIntentSchema = z.object({
  clientSecret: z.string(),
  customerId: z.string(),
});

// ============================================================================
// PAYMENT METHOD
// ============================================================================

export interface PaymentMethodContract {
  id: string;
  brand: string; // visa, mastercard, amex, etc.
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

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

export interface CollectPaymentRequest {
  userId: string;
  amountInCents: number;
  description: string;
  metadata?: Record<string, string>;
}

export const CollectPaymentRequestSchema = z.object({
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1),
  amountInCents: z.number().int().positive().max(500_000), // Max $5,000
  description: z.string(),
  metadata: StripeMetadataSchema.optional(),
});

// ============================================================================
// STRIPE CONFIG (for frontend)
// ============================================================================

export interface StripeConfigContract {
  publishableKey: string;
}

export const StripeConfigSchema = z.object({
  publishableKey: z.string(),
});

// ============================================================================
// REFUND REQUEST
// ============================================================================

export interface RefundRequest {
  paymentIntentId: string;
  amountInCents?: number; // Partial refund; omit for full
  reason?: "requested_by_customer" | "duplicate" | "fraudulent";
  notes?: string;
}

export const RefundRequestSchema = z.object({
  paymentIntentId: z.string(),
  amountInCents: z.number().int().positive().max(500_000).optional(), // Max $5,000
  reason: z
    .enum(["requested_by_customer", "duplicate", "fraudulent"])
    .optional(),
  notes: z.string().max(500).optional(),
});

export interface RefundResponse {
  refundId: string;
  status: string;
  amount: number; // cents
}
