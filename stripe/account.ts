/**
 * @ai-context Customer-facing account contracts | Read-only billing display types
 *
 * These contracts define the shape of data returned to authenticated customers
 * for self-service billing display. They are deliberately stripped of internal
 * Stripe IDs and admin-only fields.
 *
 * deps: zod, ./subscription, ./payment, ./order | consumers: server/routes/account, mobile, web-public
 */

import { z } from 'zod';
import { USER_TIERS } from '../domain/user';
import {
  BillingSourceSchema,
  ContractDurationSchema,
  SubscriptionStatusSchema,
  type BillingSource,
  type ContractDuration,
  type SubscriptionStatus,
  type SubscriptionContract,
} from './subscription';
import {
  FulfillmentStatusSchema,
  OrderItemSchema,
  ShippingAddressSchema,
  type FulfillmentStatus,
  type OrderItemContract,
  type ShippingAddressContract,
  type OrderContract,
} from './order';
import type { PaymentMethodContract } from './payment';

// ============================================================================
// CUSTOMER SUBSCRIPTION (strips Stripe IDs, signed contract key)
// ============================================================================

export interface CustomerSubscriptionContract {
  id: string;
  tier: string;
  status: SubscriptionStatus;
  contractDuration: ContractDuration;
  contractStartDate: string;
  contractEndDate: string;
  discountPercent: number;
  billingSource: BillingSource;
  monthlyPriceInCents: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  billingAnchorDay: number;
  isInGracePeriod: boolean;
  gracePeriodEndsAt: string | null;
  isPaused: boolean;
  pausedAt: string | null;
  pauseResumeDate: string | null;
  isCanceled: boolean;
  canceledAt: string | null;
  cancelEffectiveDate: string | null;
  scheduledTierChange: string | null;
  tierChangeEffectiveDate: string | null;
  createdAt: string;
}

export const CustomerSubscriptionSchema: z.ZodType<CustomerSubscriptionContract> = z.object({
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

// ============================================================================
// CUSTOMER PAYMENT METHOD (strips Stripe PM id)
// ============================================================================

export interface CustomerPaymentMethodContract {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export const CustomerPaymentMethodSchema = z.object({
  brand: z.string(),
  last4: z.string(),
  expMonth: z.number().int(),
  expYear: z.number().int(),
  isDefault: z.boolean(),
});

// ============================================================================
// CUSTOMER ORDER (strips userId)
// ============================================================================

export interface CustomerOrderContract {
  id: string;
  customerEmail: string;
  customerName: string | null;
  subtotalInCents: number;
  taxInCents: number;
  shippingInCents: number;
  totalInCents: number;
  currency: string;
  items: OrderItemContract[];
  itemCount: number;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress: ShippingAddressContract | null;
  trackingNumber: string | null;
  carrier: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  paymentStatus: string;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const CustomerOrderSchema: z.ZodType<CustomerOrderContract> = z.object({
  id: z.string().uuid(),
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
  paymentStatus: z.string(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================================
// MAPPING HELPERS (server-side: full contract -> customer contract)
// ============================================================================

/** Strip internal fields from a SubscriptionContract for customer display */
export function toCustomerSubscription(sub: SubscriptionContract): CustomerSubscriptionContract {
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
export function toCustomerPaymentMethod(pm: PaymentMethodContract): CustomerPaymentMethodContract {
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
