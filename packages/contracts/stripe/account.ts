/**
 * @ai-context Customer-facing account contracts | Read-only billing display types
 *
 * These contracts define the shape of data returned to authenticated customers
 * for self-service billing display. They are deliberately stripped of internal
 * Stripe IDs and admin-only fields.
 *
 * deps: zod, ./subscription, ./payment, ./order | consumers: server/routes/account, mobile, web-public
 */

import { z } from "zod";
import { USER_TIERS } from "../domain/user";
import { emailSchema } from "../schemas";
import {
    FulfillmentStatusSchema,
    OrderItemSchema,
    OrderPaymentStatusSchema,
    ShippingAddressSchema,
    type OrderContract,
} from "./order";
import type { PaymentMethodContract } from "./payment";
import {
    BillingSourceSchema,
    ContractDurationSchema,
    SubscriptionStatusSchema,
    type SubscriptionContract,
} from "./subscription";

// ============================================================================
// CUSTOMER SUBSCRIPTION (strips Stripe IDs, signed contract key)
// ============================================================================

export const CustomerSubscriptionSchema = z.object({
  id: z.string().uuid(),
  tier: z.enum(USER_TIERS),
  status: SubscriptionStatusSchema,
  contractDuration: ContractDurationSchema,
  contractStartDate: z.string(),
  contractEndDate: z.string(),
  discountPercent: z.number(),
  billingSource: BillingSourceSchema,
  monthlyPriceInCents: z.number().int(),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  billingAnchorDay: z.number().int().min(1).max(28),
  isInGracePeriod: z.boolean(),
  gracePeriodEndsAt: z.string().nullable(),
  isPaused: z.boolean(),
  pausedAt: z.string().nullable(),
  pauseResumeDate: z.string().nullable(),
  isCanceled: z.boolean(),
  canceledAt: z.string().nullable(),
  cancelEffectiveDate: z.string().nullable(),
  scheduledTierChange: z.string().nullable(),
  tierChangeEffectiveDate: z.string().nullable(),
  createdAt: z.string(),
});
export type CustomerSubscriptionContract = z.infer<
  typeof CustomerSubscriptionSchema
>;

// ============================================================================
// CUSTOMER PAYMENT METHOD (strips Stripe PM id)
// ============================================================================

export const CustomerPaymentMethodSchema = z.object({
  brand: z.string(),
  last4: z.string(),
  expMonth: z.number().int(),
  expYear: z.number().int(),
  isDefault: z.boolean(),
});
export type CustomerPaymentMethodContract = z.infer<
  typeof CustomerPaymentMethodSchema
>;
/** @deprecated Use CustomerPaymentMethodContract */
export type CustomerPaymentMethod = CustomerPaymentMethodContract;

// ============================================================================
// CUSTOMER ORDER (strips userId)
// ============================================================================

export const CustomerOrderSchema = z.object({
  id: z.string().uuid(),
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
export type CustomerOrderContract = z.infer<typeof CustomerOrderSchema>;

// ============================================================================
// MAPPING HELPERS (server-side: full contract -> customer contract)
// ============================================================================

/** Strip internal fields from a SubscriptionContract for customer display */
export function toCustomerSubscription(
  sub: SubscriptionContract,
): CustomerSubscriptionContract {
  return {
    id: sub.id,
    tier: sub.tier,
    status: sub.status,
    contractDuration: sub.contractDuration,
    contractStartDate: sub.contractStartDate,
    contractEndDate: sub.contractEndDate,
    discountPercent: sub.discountPercent,
    billingSource: sub.billingSource,
    monthlyPriceInCents: sub.monthlyPriceInCents,
    currentPeriodStart: sub.currentPeriodStart,
    currentPeriodEnd: sub.currentPeriodEnd,
    billingAnchorDay: sub.billingAnchorDay,
    isInGracePeriod: sub.isInGracePeriod,
    gracePeriodEndsAt: sub.gracePeriodEndsAt,
    isPaused: sub.isPaused,
    pausedAt: sub.pausedAt,
    pauseResumeDate: sub.pauseResumeDate,
    isCanceled: sub.isCanceled,
    canceledAt: sub.canceledAt,
    cancelEffectiveDate: sub.cancelEffectiveDate,
    scheduledTierChange: sub.scheduledTierChange,
    tierChangeEffectiveDate: sub.tierChangeEffectiveDate,
    createdAt: sub.createdAt,
  };
}

/** Strip Stripe PM id from a PaymentMethodContract for customer display */
export function toCustomerPaymentMethod(
  pm: PaymentMethodContract,
): CustomerPaymentMethodContract {
  return {
    brand: pm.brand,
    last4: pm.last4,
    expMonth: pm.expMonth,
    expYear: pm.expYear,
    isDefault: pm.isDefault,
  };
}

/** Strip userId from an OrderContract for customer display */
export function toCustomerOrder(order: OrderContract): CustomerOrderContract {
  return {
    id: order.id,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    subtotalInCents: order.subtotalInCents,
    taxInCents: order.taxInCents,
    shippingInCents: order.shippingInCents,
    totalInCents: order.totalInCents,
    currency: order.currency,
    items: order.items,
    itemCount: order.itemCount,
    fulfillmentStatus: order.fulfillmentStatus,
    shippingAddress: order.shippingAddress,
    trackingNumber: order.trackingNumber,
    carrier: order.carrier,
    shippedAt: order.shippedAt,
    deliveredAt: order.deliveredAt,
    paymentStatus: order.paymentStatus,
    paidAt: order.paidAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
