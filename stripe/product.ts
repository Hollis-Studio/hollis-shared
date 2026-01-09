/**
 * @ai-context Stripe product contracts | types for product catalog and payment links
 *
 * This module defines the product catalog structure for the public website.
 * Products use static Stripe Payment Links rather than dynamic Checkout Sessions
 * for simpler implementation and better static export compatibility.
 *
 * deps: zod | consumers: web-public/app/products/page.tsx
 */

import { z } from 'zod';

// ============================================================================
// PRODUCT CATEGORIES
// ============================================================================

/**
 * Product categories for the Hollis Health store.
 */
export const PRODUCT_CATEGORIES = [
  'SUPPLEMENTS',
  'APPAREL',
  'EQUIPMENT',
  'BOOKS',
  'OTHER',
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const ProductCategorySchema = z.enum(PRODUCT_CATEGORIES);

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  SUPPLEMENTS: 'Supplements',
  APPAREL: 'Apparel',
  EQUIPMENT: 'Equipment',
  BOOKS: 'Books & Guides',
  OTHER: 'Other',
};

// ============================================================================
// SUPPLEMENT TYPES
// ============================================================================

/**
 * Specific supplement categories for filtering.
 */
export const SUPPLEMENT_TYPES = [
  'OMEGA_3',
  'CREATINE',
  'COLLAGEN',
  'WHEY_PROTEIN',
  'VITAMIN_D',
  'MAGNESIUM',
  'MULTIVITAMIN',
  'PROBIOTIC',
  'ELECTROLYTES',
  'OTHER',
] as const;
export type SupplementType = (typeof SUPPLEMENT_TYPES)[number];

export const SupplementTypeSchema = z.enum(SUPPLEMENT_TYPES);

export const SUPPLEMENT_TYPE_LABELS: Record<SupplementType, string> = {
  OMEGA_3: 'Omega-3',
  CREATINE: 'Creatine',
  COLLAGEN: 'Collagen',
  WHEY_PROTEIN: 'Whey Protein',
  VITAMIN_D: 'Vitamin D',
  MAGNESIUM: 'Magnesium',
  MULTIVITAMIN: 'Multivitamin',
  PROBIOTIC: 'Probiotic',
  ELECTROLYTES: 'Electrolytes',
  OTHER: 'Other',
};

// ============================================================================
// PRODUCT SCHEMA
// ============================================================================

/**
 * Product schema for the store catalog.
 */
export const ProductSchema = z.object({
  /** Unique product identifier (matches Stripe product ID if synced) */
  id: z.string(),
  
  /** Product name */
  name: z.string(),
  
  /** Short description for cards */
  shortDescription: z.string(),
  
  /** Full description for detail view */
  description: z.string(),
  
  /** Category */
  category: ProductCategorySchema,
  
  /** Supplement type (if category is SUPPLEMENTS) */
  supplementType: SupplementTypeSchema.optional(),
  
  /** Price in cents (USD) */
  priceInCents: z.number().int().positive(),
  
  /** Optional compare-at price for showing discounts */
  compareAtPriceInCents: z.number().int().positive().optional(),
  
  /** Currency code */
  currency: z.string().default('USD'),
  
  /** Product image URL */
  imageUrl: z.string().url().optional(),
  
  /** Additional product images */
  galleryUrls: z.array(z.string().url()).optional(),
  
  /** Stripe Payment Link URL - static link for checkout */
  paymentLinkUrl: z.string().url(),
  
  /** Is the product currently available? */
  isAvailable: z.boolean().default(true),
  
  /** Is this a featured product on the homepage? */
  isFeatured: z.boolean().default(false),
  
  /** Sort order for display */
  sortOrder: z.number().int().default(0),
  
  /** Tags for filtering and search */
  tags: z.array(z.string()).optional(),
  
  /** NSF Certified badge */
  isNsfCertified: z.boolean().optional(),
  
  /** Third-party tested badge */
  isThirdPartyTested: z.boolean().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

// ============================================================================
// PRODUCT CATALOG (Static Data)
// ============================================================================

/**
 * Static product catalog for the public website.
 * 
 * In production, paymentLinkUrl should be replaced with actual Stripe Payment Links.
 * Payment Links can be created in Stripe Dashboard > Products > Payment Links.
 */
export const PRODUCT_CATALOG: Product[] = [
  {
    id: 'omega-3-fish-oil',
    name: 'Premium Omega-3 Fish Oil',
    shortDescription: 'High-potency EPA/DHA for heart and brain health',
    description: 'Our pharmaceutical-grade fish oil provides 2000mg of EPA/DHA per serving. Sourced from wild-caught fish, molecularly distilled for purity, and third-party tested for heavy metals.',
    category: 'SUPPLEMENTS',
    supplementType: 'OMEGA_3',
    priceInCents: 4500,
    currency: 'USD',
    imageUrl: '/images/products/omega-3.jpg',
    paymentLinkUrl: 'https://buy.stripe.com/placeholder-omega3',
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1,
    tags: ['heart-health', 'brain-health', 'anti-inflammatory'],
    isNsfCertified: true,
    isThirdPartyTested: true,
  },
  {
    id: 'creatine-monohydrate',
    name: 'Creatine Monohydrate',
    shortDescription: 'Pure micronized creatine for strength and performance',
    description: 'Creapure® creatine monohydrate - the gold standard for muscle strength, power, and recovery. 5g per serving, unflavored for easy mixing.',
    category: 'SUPPLEMENTS',
    supplementType: 'CREATINE',
    priceInCents: 3500,
    currency: 'USD',
    imageUrl: '/images/products/creatine.jpg',
    paymentLinkUrl: 'https://buy.stripe.com/placeholder-creatine',
    isAvailable: true,
    isFeatured: true,
    sortOrder: 2,
    tags: ['strength', 'performance', 'muscle'],
    isNsfCertified: true,
    isThirdPartyTested: true,
  },
  {
    id: 'collagen-peptides',
    name: 'Grass-Fed Collagen Peptides',
    shortDescription: 'Type I & III collagen for skin, hair, and joints',
    description: 'Hydrolyzed collagen peptides from grass-fed, pasture-raised cattle. Supports skin elasticity, joint health, and gut integrity. Dissolves easily in any beverage.',
    category: 'SUPPLEMENTS',
    supplementType: 'COLLAGEN',
    priceInCents: 4200,
    currency: 'USD',
    imageUrl: '/images/products/collagen.jpg',
    paymentLinkUrl: 'https://buy.stripe.com/placeholder-collagen',
    isAvailable: true,
    isFeatured: true,
    sortOrder: 3,
    tags: ['skin-health', 'joint-health', 'recovery'],
    isThirdPartyTested: true,
  },
  {
    id: 'whey-protein-isolate',
    name: 'Whey Protein Isolate',
    shortDescription: 'Clean protein with 25g per serving, minimal ingredients',
    description: 'Cold-processed whey protein isolate with 25g protein, <1g sugar, and no artificial sweeteners. Grass-fed, hormone-free, and easy to digest.',
    category: 'SUPPLEMENTS',
    supplementType: 'WHEY_PROTEIN',
    priceInCents: 5500,
    currency: 'USD',
    imageUrl: '/images/products/whey-protein.jpg',
    paymentLinkUrl: 'https://buy.stripe.com/placeholder-whey',
    isAvailable: true,
    isFeatured: false,
    sortOrder: 4,
    tags: ['protein', 'muscle', 'recovery'],
    isNsfCertified: true,
    isThirdPartyTested: true,
  },
  {
    id: 'vitamin-d3-k2',
    name: 'Vitamin D3 + K2',
    shortDescription: 'Synergistic duo for bone and cardiovascular health',
    description: '5000 IU Vitamin D3 with 100mcg K2 (MK-7) for optimal calcium metabolism. Essential for bone density, immune function, and cardiovascular health.',
    category: 'SUPPLEMENTS',
    supplementType: 'VITAMIN_D',
    priceInCents: 2800,
    currency: 'USD',
    imageUrl: '/images/products/vitamin-d3-k2.jpg',
    paymentLinkUrl: 'https://buy.stripe.com/placeholder-vitamind',
    isAvailable: true,
    isFeatured: false,
    sortOrder: 5,
    tags: ['bone-health', 'immune', 'cardiovascular'],
    isThirdPartyTested: true,
  },
  {
    id: 'magnesium-glycinate',
    name: 'Magnesium Glycinate',
    shortDescription: 'Highly absorbable magnesium for sleep and recovery',
    description: 'Chelated magnesium glycinate for superior absorption and minimal digestive discomfort. Supports sleep quality, muscle relaxation, and stress response.',
    category: 'SUPPLEMENTS',
    supplementType: 'MAGNESIUM',
    priceInCents: 3200,
    currency: 'USD',
    imageUrl: '/images/products/magnesium.jpg',
    paymentLinkUrl: 'https://buy.stripe.com/placeholder-magnesium',
    isAvailable: true,
    isFeatured: false,
    sortOrder: 6,
    tags: ['sleep', 'recovery', 'stress'],
    isThirdPartyTested: true,
  },
  {
    id: 'electrolyte-mix',
    name: 'Premium Electrolyte Mix',
    shortDescription: 'Zero-sugar hydration with optimal mineral ratios',
    description: 'Science-backed electrolyte formula with sodium, potassium, and magnesium. No sugar, no artificial colors. Perfect for training, fasting, or daily hydration.',
    category: 'SUPPLEMENTS',
    supplementType: 'ELECTROLYTES',
    priceInCents: 3800,
    currency: 'USD',
    imageUrl: '/images/products/electrolytes.jpg',
    paymentLinkUrl: 'https://buy.stripe.com/placeholder-electrolytes',
    isAvailable: true,
    isFeatured: false,
    sortOrder: 7,
    tags: ['hydration', 'performance', 'keto-friendly'],
    isThirdPartyTested: true,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format price in cents to display string.
 */
export function formatPrice(priceInCents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceInCents / 100);
}

/**
 * Get featured products for homepage display.
 */
export function getFeaturedProducts(): Product[] {
  return PRODUCT_CATALOG.filter(p => p.isFeatured && p.isAvailable)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Get products by category.
 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCT_CATALOG.filter(p => p.category === category && p.isAvailable)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
