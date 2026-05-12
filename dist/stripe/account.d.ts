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
import { type OrderContract } from "./order.js";
import type { PaymentMethodContract } from "./payment.js";
import { type SubscriptionContract } from "./subscription.js";
export declare const CustomerSubscriptionSchema: z.ZodObject<{
    id: z.ZodString;
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
    discountPercent: z.ZodNumber;
    billingSource: z.ZodEnum<{
        DIRECT: "DIRECT";
        ORGANIZATION: "ORGANIZATION";
    }>;
    monthlyPriceInCents: z.ZodNumber;
    currentPeriodStart: z.ZodString;
    currentPeriodEnd: z.ZodString;
    billingAnchorDay: z.ZodNumber;
    isInGracePeriod: z.ZodBoolean;
    gracePeriodEndsAt: z.ZodNullable<z.ZodString>;
    isPaused: z.ZodBoolean;
    pausedAt: z.ZodNullable<z.ZodString>;
    pauseResumeDate: z.ZodNullable<z.ZodString>;
    isCanceled: z.ZodBoolean;
    canceledAt: z.ZodNullable<z.ZodString>;
    cancelEffectiveDate: z.ZodNullable<z.ZodString>;
    scheduledTierChange: z.ZodNullable<z.ZodString>;
    tierChangeEffectiveDate: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type CustomerSubscriptionContract = z.infer<typeof CustomerSubscriptionSchema>;
export declare const CustomerPaymentMethodSchema: z.ZodObject<{
    brand: z.ZodString;
    last4: z.ZodString;
    expMonth: z.ZodNumber;
    expYear: z.ZodNumber;
    isDefault: z.ZodBoolean;
}, z.core.$strip>;
export type CustomerPaymentMethodContract = z.infer<typeof CustomerPaymentMethodSchema>;
/** @deprecated Use CustomerPaymentMethodContract */
export type CustomerPaymentMethod = CustomerPaymentMethodContract;
export declare const CustomerOrderSchema: z.ZodObject<{
    id: z.ZodString;
    customerEmail: z.ZodString;
    customerName: z.ZodNullable<z.ZodString>;
    subtotalInCents: z.ZodNumber;
    taxInCents: z.ZodNumber;
    shippingInCents: z.ZodNumber;
    totalInCents: z.ZodNumber;
    currency: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        productId: z.ZodString;
        productName: z.ZodString;
        productImageUrl: z.ZodNullable<z.ZodString>;
        quantity: z.ZodNumber;
        unitPriceInCents: z.ZodNumber;
        totalInCents: z.ZodNumber;
    }, z.core.$strip>>;
    itemCount: z.ZodNumber;
    fulfillmentStatus: z.ZodEnum<{
        CANCELLED: "CANCELLED";
        PENDING: "PENDING";
        PROCESSING: "PROCESSING";
        SHIPPED: "SHIPPED";
        DELIVERED: "DELIVERED";
        RETURNED: "RETURNED";
    }>;
    shippingAddress: z.ZodNullable<z.ZodObject<{
        line1: z.ZodString;
        line2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        postalCode: z.ZodString;
        country: z.ZodString;
    }, z.core.$strip>>;
    trackingNumber: z.ZodNullable<z.ZodString>;
    carrier: z.ZodNullable<z.ZodString>;
    shippedAt: z.ZodNullable<z.ZodString>;
    deliveredAt: z.ZodNullable<z.ZodString>;
    paymentStatus: z.ZodEnum<{
        refunded: "refunded";
        paid: "paid";
        unpaid: "unpaid";
        no_payment_required: "no_payment_required";
        partially_refunded: "partially_refunded";
    }>;
    paidAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type CustomerOrderContract = z.infer<typeof CustomerOrderSchema>;
/** Strip internal fields from a SubscriptionContract for customer display */
export declare function toCustomerSubscription(sub: SubscriptionContract): CustomerSubscriptionContract;
/** Strip Stripe PM id from a PaymentMethodContract for customer display */
export declare function toCustomerPaymentMethod(pm: PaymentMethodContract): CustomerPaymentMethodContract;
/** Strip userId from an OrderContract for customer display */
export declare function toCustomerOrder(order: OrderContract): CustomerOrderContract;
//# sourceMappingURL=account.d.ts.map