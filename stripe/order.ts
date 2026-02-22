/**
 * @ai-context Order contracts | Types for product orders and fulfillment
 *
 * deps: zod | consumers: server routes, web-admin, web-public
 */

import { z } from "zod";

// ============================================================================
// PAYMENT STATUS
// ============================================================================

/**
 * Stripe Checkout Session payment_status values.
 * @see https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-payment_status
 */
export const ORDER_PAYMENT_STATUSES = [
  "paid",
  "unpaid",
  "no_payment_required",
] as const;

export const OrderPaymentStatusSchema = z.enum(ORDER_PAYMENT_STATUSES);
export type OrderPaymentStatus = z.infer<typeof OrderPaymentStatusSchema>;

export const ORDER_PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  no_payment_required: "No Payment Required",
};

// ============================================================================
// FULFILLMENT STATUS
// ============================================================================

export const FULFILLMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const;

export const FulfillmentStatusSchema = z.enum(FULFILLMENT_STATUSES);
export type FulfillmentStatus = z.infer<typeof FulfillmentStatusSchema>;

// ============================================================================
// ORDER ITEM
// ============================================================================

export interface OrderItemContract {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string | null;
  quantity: number;
  unitPriceInCents: number;
  totalInCents: number;
}

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  productName: z.string(),
  productImageUrl: z.string().nullable(),
  quantity: z.number().int().positive(),
  unitPriceInCents: z.number().int(),
  totalInCents: z.number().int(),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

// ============================================================================
// SHIPPING ADDRESS
// ============================================================================

export interface ShippingAddressContract {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const ShippingAddressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

// ============================================================================
// ORDER
// ============================================================================

export interface OrderContract {
  id: string;

  // Customer
  userId: string | null;
  customerEmail: string;
  customerName: string | null;

  // Totals
  subtotalInCents: number;
  taxInCents: number;
  shippingInCents: number;
  totalInCents: number;
  currency: string;

  // Items
  items: OrderItemContract[];
  itemCount: number;

  // Fulfillment
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress: ShippingAddressContract | null;
  trackingNumber: string | null;
  carrier: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;

  // Payment
  paymentStatus: OrderPaymentStatus;
  paidAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export const OrderSchema: z.ZodType<OrderContract> = z.object({
  id: z.string().uuid(),
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1).nullable(),
  customerEmail: z.string().email(),
  customerName: z.string().nullable(),
  subtotalInCents: z.number().int(),
  taxInCents: z.number().int(),
  shippingInCents: z.number().int(),
  totalInCents: z.number().int(),
  currency: z.string(),
  items: z.array(OrderItemSchema),
  itemCount: z.number().int(),
  fulfillmentStatus: FulfillmentStatusSchema,
  shippingAddress: ShippingAddressSchema.nullable(),
  trackingNumber: z.string().nullable(),
  carrier: z.string().nullable(),
  shippedAt: z.string().nullable(),
  deliveredAt: z.string().nullable(),
  paymentStatus: OrderPaymentStatusSchema,
  paidAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================================
// UPDATE FULFILLMENT REQUEST
// ============================================================================

export const UpdateFulfillmentRequestSchema = z.object({
  status: FulfillmentStatusSchema,
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  notes: z.string().optional(),
});
export type UpdateFulfillmentRequest = z.infer<
  typeof UpdateFulfillmentRequestSchema
>;
