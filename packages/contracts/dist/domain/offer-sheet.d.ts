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
import { type UserTier } from "./user.js";
export declare const OfferSheetStatusSchema: z.ZodEnum<{
    active: "active";
    draft: "draft";
    archived: "archived";
}>;
export type OfferSheetStatus = z.infer<typeof OfferSheetStatusSchema>;
export declare const OfferTermMonthsSchema: z.ZodUnion<readonly [z.ZodLiteral<4>, z.ZodLiteral<8>, z.ZodLiteral<12>]>;
export type OfferTermMonths = z.infer<typeof OfferTermMonthsSchema>;
export declare const OfferTermSchema: z.ZodObject<{
    months: z.ZodUnion<readonly [z.ZodLiteral<4>, z.ZodLiteral<8>, z.ZodLiteral<12>]>;
    discountPercent: z.ZodNumber;
    label: z.ZodString;
}, z.core.$strip>;
export type OfferTerm = z.infer<typeof OfferTermSchema>;
export declare const OfferTierSummarySchema: z.ZodObject<{
    displayName: z.ZodString;
    baseMonthlyPriceDollars: z.ZodNumber;
    tagline: z.ZodString;
    publicDescription: z.ZodString;
    isPopular: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type OfferTierSummary = z.infer<typeof OfferTierSummarySchema>;
export declare const OfferTierMapSchema: z.ZodObject<{
    ESSENTIALS: z.ZodObject<{
        displayName: z.ZodString;
        baseMonthlyPriceDollars: z.ZodNumber;
        tagline: z.ZodString;
        publicDescription: z.ZodString;
        isPopular: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    CORE: z.ZodObject<{
        displayName: z.ZodString;
        baseMonthlyPriceDollars: z.ZodNumber;
        tagline: z.ZodString;
        publicDescription: z.ZodString;
        isPopular: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    CONCIERGE: z.ZodObject<{
        displayName: z.ZodString;
        baseMonthlyPriceDollars: z.ZodNumber;
        tagline: z.ZodString;
        publicDescription: z.ZodString;
        isPopular: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type OfferTierMap = z.infer<typeof OfferTierMapSchema>;
export declare const OfferTierValueMapSchema: z.ZodObject<{
    ESSENTIALS: z.ZodString;
    CORE: z.ZodString;
    CONCIERGE: z.ZodString;
}, z.core.$strip>;
export type OfferTierValueMap = z.infer<typeof OfferTierValueMapSchema>;
export declare const OfferComparisonRowSchema: z.ZodObject<{
    key: z.ZodString;
    category: z.ZodString;
    label: z.ZodString;
    values: z.ZodObject<{
        ESSENTIALS: z.ZodString;
        CORE: z.ZodString;
        CONCIERGE: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type OfferComparisonRow = z.infer<typeof OfferComparisonRowSchema>;
export declare const OfferPolicySetSchema: z.ZodObject<{
    enrollmentScheduleControl: z.ZodString;
    autoRenewal: z.ZodString;
    noticePeriod: z.ZodString;
    pauseRights: z.ZodString;
    earlyTermination: z.ZodString;
    thirdPartyDisclosure: z.ZodString;
    partnerFacilityDisclosure: z.ZodString;
}, z.core.$strip>;
export type OfferPolicySet = z.infer<typeof OfferPolicySetSchema>;
export declare const MasterOfferSheetSchema: z.ZodObject<{
    meta: z.ZodObject<{
        version: z.ZodString;
        effectiveDate: z.ZodString;
        status: z.ZodEnum<{
            active: "active";
            draft: "draft";
            archived: "archived";
        }>;
    }, z.core.$strip>;
    terms: z.ZodArray<z.ZodObject<{
        months: z.ZodUnion<readonly [z.ZodLiteral<4>, z.ZodLiteral<8>, z.ZodLiteral<12>]>;
        discountPercent: z.ZodNumber;
        label: z.ZodString;
    }, z.core.$strip>>;
    policies: z.ZodObject<{
        enrollmentScheduleControl: z.ZodString;
        autoRenewal: z.ZodString;
        noticePeriod: z.ZodString;
        pauseRights: z.ZodString;
        earlyTermination: z.ZodString;
        thirdPartyDisclosure: z.ZodString;
        partnerFacilityDisclosure: z.ZodString;
    }, z.core.$strip>;
    tiers: z.ZodObject<{
        ESSENTIALS: z.ZodObject<{
            displayName: z.ZodString;
            baseMonthlyPriceDollars: z.ZodNumber;
            tagline: z.ZodString;
            publicDescription: z.ZodString;
            isPopular: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        CORE: z.ZodObject<{
            displayName: z.ZodString;
            baseMonthlyPriceDollars: z.ZodNumber;
            tagline: z.ZodString;
            publicDescription: z.ZodString;
            isPopular: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        CONCIERGE: z.ZodObject<{
            displayName: z.ZodString;
            baseMonthlyPriceDollars: z.ZodNumber;
            tagline: z.ZodString;
            publicDescription: z.ZodString;
            isPopular: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    comparisonRows: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        category: z.ZodString;
        label: z.ZodString;
        values: z.ZodObject<{
            ESSENTIALS: z.ZodString;
            CORE: z.ZodString;
            CONCIERGE: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    separatelyBilledThirdPartyItems: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type MasterOfferSheet = z.infer<typeof MasterOfferSheetSchema>;
export declare const MASTER_OFFER_SHEET: MasterOfferSheet;
export declare const MASTER_OFFER_TERMS: {
    months: 12 | 4 | 8;
    discountPercent: number;
    label: string;
}[];
export declare const MASTER_OFFER_ROWS: {
    key: string;
    category: string;
    label: string;
    values: {
        ESSENTIALS: string;
        CORE: string;
        CONCIERGE: string;
    };
}[];
export declare const MASTER_OFFER_TIER_ORDER: readonly UserTier[];
export declare function getMasterOfferTier(tier: UserTier): OfferTierSummary;
export declare function getOfferComparisonValue(rowKey: string, tier: UserTier): string | null;
export declare function getDiscountedMonthlyPriceDollars(baseMonthlyPriceDollars: number, discountPercent: number): number;
export declare function formatUsd(amount: number): string;
export declare function getTierCardHighlights(tier: UserTier): string[];
//# sourceMappingURL=offer-sheet.d.ts.map