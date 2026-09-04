/**
 * @ai-context Mobile session contracts | Types for mobile session management
 *
 * CONCIERGE tier gets 2 free mobile sessions/month (cap at 4).
 * A-la-carte sessions are $80 each and never expire.
 *
 * deps: zod | consumers: server routes, web-admin
 */
import { z } from "zod";
export declare const MobileSessionBalanceSchema: z.ZodObject<{
    userId: z.ZodString;
    freeAllocationPerMonth: z.ZodNumber;
    freeAvailable: z.ZodNumber;
    freeMaxRollover: z.ZodNumber;
    paidBalance: z.ZodNumber;
    totalAvailable: z.ZodNumber;
    lastFreeResetDate: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type MobileSessionBalanceContract = z.infer<typeof MobileSessionBalanceSchema>;
/** @deprecated Use MobileSessionBalanceContract */
export type MobileSessionBalance = MobileSessionBalanceContract;
export declare const MOBILE_SESSION_SOURCES: readonly ["TIER_ALLOCATION", "A_LA_CARTE"];
export type MobileSessionSource = (typeof MOBILE_SESSION_SOURCES)[number];
export declare const MobileSessionUsageSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    source: z.ZodEnum<{
        TIER_ALLOCATION: "TIER_ALLOCATION";
        A_LA_CARTE: "A_LA_CARTE";
    }>;
    usedAt: z.ZodString;
    appointmentId: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type MobileSessionUsageContract = z.infer<typeof MobileSessionUsageSchema>;
/** @deprecated Use MobileSessionUsageContract */
export type MobileSessionUsage = MobileSessionUsageContract;
export declare const PurchaseMobileSessionsRequestSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, z.core.$strip>;
export type PurchaseMobileSessionsRequest = z.infer<typeof PurchaseMobileSessionsRequestSchema>;
/**
 * Response for POST /api/admin/mobile-sessions/:userId/purchase.
 *
 * The server creates AND confirms the PaymentIntent off-session, so `status` is
 * terminal: anything other than "succeeded" means the card was NOT charged.
 * Kept as a free-form string (not the Stripe enum) because it is passed through
 * from Stripe verbatim.
 */
export declare const PurchaseMobileSessionsResponseSchema: z.ZodObject<{
    paymentIntentId: z.ZodString;
    totalInCents: z.ZodNumber;
    status: z.ZodString;
    requiresAction: z.ZodBoolean;
    newBalance: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export type PurchaseMobileSessionsResponse = z.infer<typeof PurchaseMobileSessionsResponseSchema>;
export declare const MobileSessionPurchaseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    quantity: z.ZodNumber;
    unitPriceInCents: z.ZodNumber;
    totalInCents: z.ZodNumber;
    purchasedAt: z.ZodString;
}, z.core.$strip>;
export type MobileSessionPurchaseContract = z.infer<typeof MobileSessionPurchaseSchema>;
/** @deprecated Use MobileSessionPurchaseContract */
export type MobileSessionPurchase = MobileSessionPurchaseContract;
/** Price per mobile session in cents ($80) */
export declare const MOBILE_SESSION_PRICE_CENTS = 8000;
/** Maximum free mobile sessions that can accumulate */
export declare const MOBILE_SESSION_FREE_MAX = 4;
/** Free mobile sessions per month for CONCIERGE */
export declare const MOBILE_SESSION_CONCIERGE_MONTHLY = 2;
//# sourceMappingURL=mobileSession.d.ts.map