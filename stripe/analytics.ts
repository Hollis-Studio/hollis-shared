/**
 * @ai-context Analytics contracts | Types for billing analytics
 *
 * deps: zod | consumers: server routes, web-admin
 */

import { z } from 'zod';

// ============================================================================
// MRR (Monthly Recurring Revenue)
// ============================================================================

export interface MRRContract {
  totalMRRCents: number;
  totalMRRFormatted: string;

  byTier: {
    tier: string;
    subscriptionCount: number;
    mrrCents: number;
  }[];

  byBillingSource: {
    source: string;
    subscriptionCount: number;
    mrrCents: number;
  }[];

  activeSubscriptions: number;
  pausedSubscriptions: number;
  pastDueSubscriptions: number;

  asOfDate: string;
}

export const MRRSchema = z.object({
  totalMRRCents: z.number().int(),
  totalMRRFormatted: z.string(),
  byTier: z.array(z.object({
    tier: z.string(),
    subscriptionCount: z.number().int(),
    mrrCents: z.number().int(),
  })),
  byBillingSource: z.array(z.object({
    source: z.string(),
    subscriptionCount: z.number().int(),
    mrrCents: z.number().int(),
  })),
  activeSubscriptions: z.number().int(),
  pausedSubscriptions: z.number().int(),
  pastDueSubscriptions: z.number().int(),
  asOfDate: z.string(),
});

// ============================================================================
// CHURN METRICS
// ============================================================================

export interface ChurnMetricsContract {
  periodStart: string;
  periodEnd: string;

  startingSubscriptions: number;
  endingSubscriptions: number;

  newSubscriptions: number;
  canceledSubscriptions: number;
  terminatedEarly: number;

  churnRate: number;        // Percentage
  netGrowth: number;        // New - canceled

  cancelReasons: {
    reason: string;
    count: number;
  }[];
}

export const ChurnMetricsSchema = z.object({
  periodStart: z.string(),
  periodEnd: z.string(),
  startingSubscriptions: z.number().int(),
  endingSubscriptions: z.number().int(),
  newSubscriptions: z.number().int(),
  canceledSubscriptions: z.number().int(),
  terminatedEarly: z.number().int(),
  churnRate: z.number(),
  netGrowth: z.number().int(),
  cancelReasons: z.array(z.object({
    reason: z.string(),
    count: z.number().int(),
  })),
});

// ============================================================================
// LIFETIME VALUE
// ============================================================================

export interface LTVContract {
  byTier: {
    tier: string;
    averageLTVCents: number;
    averageLifetimeMonths: number;
    totalCustomers: number;
    totalRevenueCents: number;
  }[];

  overallAverageLTVCents: number;
  overallAverageLifetimeMonths: number;
}

export const LTVSchema = z.object({
  byTier: z.array(z.object({
    tier: z.string(),
    averageLTVCents: z.number().int(),
    averageLifetimeMonths: z.number(),
    totalCustomers: z.number().int(),
    totalRevenueCents: z.number().int(),
  })),
  overallAverageLTVCents: z.number().int(),
  overallAverageLifetimeMonths: z.number(),
});

// ============================================================================
// INVENTORY ANALYTICS
// ============================================================================

export interface InventoryAnalyticsContract {
  totalProducts: number;
  activeProducts: number;

  lowStockProducts: {
    productId: string;
    productName: string;
    currentStock: number;
    threshold: number;
  }[];

  outOfStockProducts: {
    productId: string;
    productName: string;
  }[];

  totalStockValue: number; // Sum of (stock * price) for all products

  topSellingProducts: {
    productId: string;
    productName: string;
    unitsSold: number;
    revenueCents: number;
  }[];
}

export const InventoryAnalyticsSchema = z.object({
  totalProducts: z.number().int(),
  activeProducts: z.number().int(),
  lowStockProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    currentStock: z.number().int(),
    threshold: z.number().int(),
  })),
  outOfStockProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
  })),
  totalStockValue: z.number().int(),
  topSellingProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    unitsSold: z.number().int(),
    revenueCents: z.number().int(),
  })),
});
