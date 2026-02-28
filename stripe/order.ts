/**
 * @ai-context Order contracts | Types for product orders and fulfillment
 *
 * deps: zod | consumers: server routes, web-admin, web-public
 */

import { z } from "zod";
import { emailSchema } from "../schemas";

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
  "refunded",
  "partially_refunded",
] as const;

export const OrderPaymentStatusSchema = z.enum(ORDER_PAYMENT_STATUSES);
export type OrderPaymentStatus = z.infer<typeof OrderPaymentStatusSchema>;

export const ORDER_PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  no_payment_required: "No Payment Required",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
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

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  productName: z.string(),
  productImageUrl: z.string().nullable(),
  quantity: z.number().int().positive(),
  unitPriceInCents: z.number().int(),
  totalInCents: z.number().int(),
});
export type OrderItemContract = z.infer<typeof OrderItemSchema>;
/** @deprecated Use OrderItemContract */
export type OrderItem = OrderItemContract;

// ============================================================================
// SHIPPING ADDRESS
// ============================================================================

export const ShippingAddressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});
export type ShippingAddressContract = z.infer<typeof ShippingAddressSchema>;
/** @deprecated Use ShippingAddressContract */
export type ShippingAddress = ShippingAddressContract;

// ============================================================================
// ORDER
// ============================================================================

export const OrderSchema = z.object({
  id: z.string().uuid(),
  /** userId uses HH-XXXXXX barcode format, not UUID */
  userId: z.string().min(1).nullable(),
  customerEmail: emailSchema,
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
export type OrderContract = z.infer<typeof OrderSchema>;

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
