/**
 * @ai-context Master offer sheet contract | canonical commercial terms for memberships
 *
 * This module provides the typed source of truth for:
 * - Membership tier pricing and positioning
 * - Contract term discounts
 * - Included-service comparison rows
 * - Standard third-party billing disclosures
 *
 * Consumers:
 * - web-public pricing surfaces
 * - legal document sync scripts
 * - any future sales or ops tooling
 */

import { z } from "zod";

import offerSheetData from "./offer-sheet.json";
import { USER_TIER, type UserTier } from "./user";

export const OfferSheetStatusSchema = z.enum(["draft", "active", "archived"]);
export type OfferSheetStatus = z.infer<typeof OfferSheetStatusSchema>;

export const OfferTermMonthsSchema = z.union([
  z.literal(4),
  z.literal(8),
  z.literal(12),
]);
export type OfferTermMonths = z.infer<typeof OfferTermMonthsSchema>;

export const OfferTermSchema = z.object({
  months: OfferTermMonthsSchema,
  discountPercent: z.number().int().min(0).max(100),
  label: z.string().min(1),
});
export type OfferTerm = z.infer<typeof OfferTermSchema>;

export const OfferTierSummarySchema = z.object({
  displayName: z.string().min(1),
  baseMonthlyPriceDollars: z.number().int().positive(),
  tagline: z.string().min(1),
  publicDescription: z.string().min(1),
  isPopular: z.boolean().optional(),
});
export type OfferTierSummary = z.infer<typeof OfferTierSummarySchema>;

export const OfferTierMapSchema = z.object({
  ESSENTIALS: OfferTierSummarySchema,
  CORE: OfferTierSummarySchema,
  CONCIERGE: OfferTierSummarySchema,
});
export type OfferTierMap = z.infer<typeof OfferTierMapSchema>;

export const OfferTierValueMapSchema = z.object({
  ESSENTIALS: z.string().min(1),
  CORE: z.string().min(1),
  CONCIERGE: z.string().min(1),
});
export type OfferTierValueMap = z.infer<typeof OfferTierValueMapSchema>;

export const OfferComparisonRowSchema = z.object({
  key: z.string().min(1),
  category: z.string().min(1),
  label: z.string().min(1),
  values: OfferTierValueMapSchema,
});
export type OfferComparisonRow = z.infer<typeof OfferComparisonRowSchema>;

export const OfferPolicySetSchema = z.object({
  enrollmentScheduleControl: z.string().min(1),
  autoRenewal: z.string().min(1),
  noticePeriod: z.string().min(1),
  pauseRights: z.string().min(1),
  earlyTermination: z.string().min(1),
  thirdPartyDisclosure: z.string().min(1),
});
export type OfferPolicySet = z.infer<typeof OfferPolicySetSchema>;

export const MasterOfferSheetSchema = z.object({
  meta: z.object({
    version: z.string().min(1),
    effectiveDate: z.string().min(1),
    status: OfferSheetStatusSchema,
  }),
  terms: z.array(OfferTermSchema).min(1),
  policies: OfferPolicySetSchema,
  tiers: OfferTierMapSchema,
  comparisonRows: z.array(OfferComparisonRowSchema).min(1),
  separatelyBilledThirdPartyItems: z.array(z.string().min(1)).min(1),
});
export type MasterOfferSheet = z.infer<typeof MasterOfferSheetSchema>;

export const MASTER_OFFER_SHEET: MasterOfferSheet =
  MasterOfferSheetSchema.parse(offerSheetData);

export const MASTER_OFFER_TERMS = MASTER_OFFER_SHEET.terms;
export const MASTER_OFFER_ROWS = MASTER_OFFER_SHEET.comparisonRows;
export const MASTER_OFFER_TIER_ORDER: readonly UserTier[] = [
  USER_TIER.ESSENTIALS,
  USER_TIER.CORE,
  USER_TIER.CONCIERGE,
];

export function getMasterOfferTier(tier: UserTier): OfferTierSummary {
  return MASTER_OFFER_SHEET.tiers[tier];
}

export function getOfferComparisonValue(
  rowKey: string,
  tier: UserTier,
): string | null {
  const row = MASTER_OFFER_ROWS.find((candidate) => candidate.key === rowKey);
  return row ? row.values[tier] : null;
}

export function getDiscountedMonthlyPriceDollars(
  baseMonthlyPriceDollars: number,
  discountPercent: number,
): number {
  return (baseMonthlyPriceDollars * (100 - discountPercent)) / 100;
}

export function formatUsd(amount: number): string {
  const hasCents = amount % 1 !== 0;

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export function getTierCardHighlights(tier: UserTier): string[] {
  const trainingSessions =
    getOfferComparisonValue("trainingSessionsPerMonth", tier) ??
    MASTER_OFFER_SHEET.tiers[tier].baseMonthlyPriceDollars.toString();
  const recoveryAccess =
    getOfferComparisonValue("recoveryAccess", tier) ?? "Included";
  const nutritionCoaching =
    getOfferComparisonValue("nutritionCoaching", tier) ?? "Included";
  const careCoordination =
    getOfferComparisonValue("careCoordination", tier) ?? "Included";

  return [
    `${trainingSessions} personal training sessions / month`,
    `Recovery modality access: ${recoveryAccess}`,
    `Standard nutrition coaching: ${nutritionCoaching}`,
    `Care coordination support: ${careCoordination}`,
    MASTER_OFFER_SHEET.policies.thirdPartyDisclosure,
  ];
}
