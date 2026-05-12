/**
 * @ai-context Order contracts | Types for product orders and fulfillment
 *
 * deps: zod | consumers: server routes, web-admin, web-public
 */
import { z } from "zod";
/**
 * Stripe Checkout Session payment_status values.
 * @see https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-payment_status
 */
export declare const ORDER_PAYMENT_STATUSES: readonly ["paid", "unpaid", "no_payment_required", "refunded", "partially_refunded"];
export declare const OrderPaymentStatusSchema: z.ZodEnum<{
    refunded: "refunded";
    paid: "paid";
    unpaid: "unpaid";
    no_payment_required: "no_payment_required";
    partially_refunded: "partially_refunded";
}>;
export type OrderPaymentStatus = z.infer<typeof OrderPaymentStatusSchema>;
export declare const ORDER_PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string>;
/** Lookup object for order payment statuses (avoids magic strings) */
export declare const ORDER_PAYMENT_STATUS: {
    readonly PAID: "paid";
    readonly UNPAID: "unpaid";
    readonly NO_PAYMENT_REQUIRED: "no_payment_required";
    readonly REFUNDED: "refunded";
    readonly PARTIALLY_REFUNDED: "partially_refunded";
};
export declare const FULFILLMENT_STATUSES: readonly ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];
export declare const FulfillmentStatusSchema: z.ZodEnum<{
    CANCELLED: "CANCELLED";
    PENDING: "PENDING";
    PROCESSING: "PROCESSING";
    SHIPPED: "SHIPPED";
    DELIVERED: "DELIVERED";
    RETURNED: "RETURNED";
}>;
export type FulfillmentStatus = z.infer<typeof FulfillmentStatusSchema>;
/** Constant object for fulfillment status comparisons (avoids magic strings) */
export declare const FULFILLMENT_STATUS: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
    readonly RETURNED: "RETURNED";
};
/** Human-readable labels for fulfillment statuses */
export declare const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string>;
export declare const OrderItemSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    productName: z.ZodString;
    productImageUrl: z.ZodNullable<z.ZodString>;
    quantity: z.ZodNumber;
    unitPriceInCents: z.ZodNumber;
    totalInCents: z.ZodNumber;
}, z.core.$strip>;
export type OrderItemContract = z.infer<typeof OrderItemSchema>;
/** @deprecated Use OrderItemContract */
export type OrderItem = OrderItemContract;
export declare const ShippingAddressSchema: z.ZodObject<{
    line1: z.ZodString;
    line2: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    state: z.ZodString;
    postalCode: z.ZodString;
    country: z.ZodString;
}, z.core.$strip>;
export type ShippingAddressContract = z.infer<typeof ShippingAddressSchema>;
/** @deprecated Use ShippingAddressContract */
export type ShippingAddress = ShippingAddressContract;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodNullable<z.ZodString>;
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
export type OrderContract = z.infer<typeof OrderSchema>;
export declare const UpdateFulfillmentRequestSchema: z.ZodObject<{
    status: z.ZodEnum<{
        CANCELLED: "CANCELLED";
        PENDING: "PENDING";
        PROCESSING: "PROCESSING";
        SHIPPED: "SHIPPED";
        DELIVERED: "DELIVERED";
        RETURNED: "RETURNED";
    }>;
    trackingNumber: z.ZodOptional<z.ZodString>;
    carrier: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateFulfillmentRequest = z.infer<typeof UpdateFulfillmentRequestSchema>;
//# sourceMappingURL=order.d.ts.map