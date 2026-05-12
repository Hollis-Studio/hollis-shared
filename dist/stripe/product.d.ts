/**
 * @ai-context Stripe product contracts | types for product catalog and payment links
 *
 * This module defines the product catalog structure for the public website.
 * Products use static Stripe Payment Links rather than dynamic Checkout Sessions
 * for simpler implementation and better static export compatibility.
 *
 * deps: zod | consumers: web-public/app/products/page.tsx
 */
import { z } from "zod";
/**
 * Product categories for the Hollis Health store.
 */
export declare const PRODUCT_CATEGORIES: readonly ["SUPPLEMENTS", "APPAREL", "EQUIPMENT", "BOOKS", "OTHER"];
export declare const ProductCategorySchema: z.ZodEnum<{
    OTHER: "OTHER";
    SUPPLEMENTS: "SUPPLEMENTS";
    APPAREL: "APPAREL";
    EQUIPMENT: "EQUIPMENT";
    BOOKS: "BOOKS";
}>;
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export declare const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string>;
/**
 * Specific supplement categories for filtering.
 */
export declare const SUPPLEMENT_TYPES: readonly ["OMEGA_3", "CREATINE", "COLLAGEN", "WHEY_PROTEIN", "VITAMIN_D", "MAGNESIUM", "MULTIVITAMIN", "PROBIOTIC", "ELECTROLYTES", "OTHER"];
export declare const SupplementTypeSchema: z.ZodEnum<{
    OTHER: "OTHER";
    OMEGA_3: "OMEGA_3";
    CREATINE: "CREATINE";
    COLLAGEN: "COLLAGEN";
    WHEY_PROTEIN: "WHEY_PROTEIN";
    VITAMIN_D: "VITAMIN_D";
    MAGNESIUM: "MAGNESIUM";
    MULTIVITAMIN: "MULTIVITAMIN";
    PROBIOTIC: "PROBIOTIC";
    ELECTROLYTES: "ELECTROLYTES";
}>;
export type SupplementType = z.infer<typeof SupplementTypeSchema>;
export declare const SUPPLEMENT_TYPE_LABELS: Record<SupplementType, string>;
/**
 * Product schema for the store catalog.
 */
export declare const ProductSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    shortDescription: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<{
        OTHER: "OTHER";
        SUPPLEMENTS: "SUPPLEMENTS";
        APPAREL: "APPAREL";
        EQUIPMENT: "EQUIPMENT";
        BOOKS: "BOOKS";
    }>;
    supplementType: z.ZodOptional<z.ZodEnum<{
        OTHER: "OTHER";
        OMEGA_3: "OMEGA_3";
        CREATINE: "CREATINE";
        COLLAGEN: "COLLAGEN";
        WHEY_PROTEIN: "WHEY_PROTEIN";
        VITAMIN_D: "VITAMIN_D";
        MAGNESIUM: "MAGNESIUM";
        MULTIVITAMIN: "MULTIVITAMIN";
        PROBIOTIC: "PROBIOTIC";
        ELECTROLYTES: "ELECTROLYTES";
    }>>;
    priceInCents: z.ZodNumber;
    compareAtPriceInCents: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    galleryUrls: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodString]>>>;
    paymentLinkUrl: z.ZodOptional<z.ZodString>;
    isAvailable: z.ZodDefault<z.ZodBoolean>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isNsfCertified: z.ZodOptional<z.ZodBoolean>;
    isThirdPartyTested: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type Product = z.infer<typeof ProductSchema>;
/**
 * Static product catalog for the public website.
 *
 * In production, paymentLinkUrl should be replaced with actual Stripe Payment Links.
 * Payment Links can be created in Stripe Dashboard > Products > Payment Links.
 */
export declare const PRODUCT_CATALOG: Product[];
/**
 * Format price in cents to display string.
 */
export declare function formatPrice(priceInCents: number, currency?: string): string;
/**
 * Get featured products for homepage display.
 */
export declare function getFeaturedProducts(): Product[];
/**
 * Get products by category. By default only returns products with `isAvailable`
 * set; pass `includeUnavailable: true` to surface upcoming products that the
 * public catalog wants to render as "Coming Soon".
 */
export declare function getProductsByCategory(category: ProductCategory, { includeUnavailable }?: {
    includeUnavailable?: boolean;
}): Product[];
/**
 * A product is purchasable when it is marked available AND has a live Stripe
 * payment link. Both the storefront grid and individual card components must
 * agree on this predicate so "Coming Soon" never disagrees with the Buy Now CTA.
 */
export declare function isProductPurchasable(product: Product): boolean;
//# sourceMappingURL=product.d.ts.map