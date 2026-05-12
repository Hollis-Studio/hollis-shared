/**
 * @ai-context Analytics contracts | Types for billing analytics
 *
 * deps: zod | consumers: server routes, web-admin
 */
import { z } from "zod";
/** @deprecated Use MRR (derived from MRRSchema) instead */
export type MRRContract = MRR;
export declare const MRRSchema: z.ZodObject<{
    totalMRRCents: z.ZodNumber;
    totalMRRFormatted: z.ZodString;
    byTier: z.ZodArray<z.ZodObject<{
        tier: z.ZodString;
        subscriptionCount: z.ZodNumber;
        mrrCents: z.ZodNumber;
    }, z.core.$strip>>;
    byBillingSource: z.ZodArray<z.ZodObject<{
        source: z.ZodString;
        subscriptionCount: z.ZodNumber;
        mrrCents: z.ZodNumber;
    }, z.core.$strip>>;
    activeSubscriptions: z.ZodNumber;
    pausedSubscriptions: z.ZodNumber;
    pastDueSubscriptions: z.ZodNumber;
    asOfDate: z.ZodString;
}, z.core.$strip>;
export type MRR = z.infer<typeof MRRSchema>;
/** @deprecated Use ChurnMetrics (derived from ChurnMetricsSchema) instead */
export type ChurnMetricsContract = ChurnMetrics;
export declare const ChurnMetricsSchema: z.ZodObject<{
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    startingSubscriptions: z.ZodNumber;
    endingSubscriptions: z.ZodNumber;
    newSubscriptions: z.ZodNumber;
    canceledSubscriptions: z.ZodNumber;
    terminatedEarly: z.ZodNumber;
    churnRate: z.ZodNumber;
    netGrowth: z.ZodNumber;
    cancelReasons: z.ZodArray<z.ZodObject<{
        reason: z.ZodString;
        count: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
type ChurnMetrics = z.infer<typeof ChurnMetricsSchema>;
/** @deprecated Use LTV (derived from LTVSchema) instead */
export type LTVContract = LTV;
export declare const LTVSchema: z.ZodObject<{
    byTier: z.ZodArray<z.ZodObject<{
        tier: z.ZodString;
        averageLTVCents: z.ZodNumber;
        averageLifetimeMonths: z.ZodNumber;
        totalCustomers: z.ZodNumber;
        totalRevenueCents: z.ZodNumber;
    }, z.core.$strip>>;
    overallAverageLTVCents: z.ZodNumber;
    overallAverageLifetimeMonths: z.ZodNumber;
}, z.core.$strip>;
export type LTV = z.infer<typeof LTVSchema>;
/** @deprecated Use InventoryAnalytics (derived from InventoryAnalyticsSchema) instead */
export type InventoryAnalyticsContract = InventoryAnalytics;
export declare const InventoryAnalyticsSchema: z.ZodObject<{
    totalProducts: z.ZodNumber;
    activeProducts: z.ZodNumber;
    lowStockProducts: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        productName: z.ZodString;
        currentStock: z.ZodNumber;
        threshold: z.ZodNumber;
    }, z.core.$strip>>;
    outOfStockProducts: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        productName: z.ZodString;
    }, z.core.$strip>>;
    totalStockValue: z.ZodNumber;
    topSellingProducts: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        productName: z.ZodString;
        unitsSold: z.ZodNumber;
        revenueCents: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type InventoryAnalytics = z.infer<typeof InventoryAnalyticsSchema>;
export {};
//# sourceMappingURL=analytics.d.ts.map