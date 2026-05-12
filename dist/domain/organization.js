/**
 * @ai-context Organization/Tenant contracts for MSO multi-tenancy model
 *
 * Defines the Organization entity and related types for tenant isolation.
 * Organizations represent distinct medical practices/clinics in the MSO model.
 *
 * Security: All PHI and user data is scoped to an organization.
 * See: server/src/lib/tenantContext.ts for enforcement mechanism.
 */
import { z } from "zod";
import { SubscriptionStatusSchema } from "../stripe/subscription.js";
// ============================================================================
// Organization Status
// ============================================================================
/**
 * Organization lifecycle status.
 * Controls what operations are allowed for the organization.
 * - ACTIVE: Normal operation - full access
 * - SUSPENDED: Billing/compliance issue - read-only access
 * - ARCHIVED: Soft-deleted - no access
 * - ONBOARDING: New org being set up - limited access
 */
export const ORGANIZATION_STATUSES = [
    "ACTIVE",
    "SUSPENDED",
    "ARCHIVED",
    "ONBOARDING",
];
/**
 * @deprecated Use ORGANIZATION_STATUSES array directly. Kept for backward compatibility.
 */
export const ORGANIZATION_STATUS = {
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
    ARCHIVED: "ARCHIVED",
    ONBOARDING: "ONBOARDING",
};
/**
 * Display labels for organization statuses.
 */
export const ORGANIZATION_STATUS_LABELS = {
    [ORGANIZATION_STATUS.ACTIVE]: "Active",
    [ORGANIZATION_STATUS.SUSPENDED]: "Suspended",
    [ORGANIZATION_STATUS.ARCHIVED]: "Archived",
    [ORGANIZATION_STATUS.ONBOARDING]: "Onboarding",
};
/**
 * Zod schema for organization status validation.
 */
export const OrganizationStatusSchema = z.enum(ORGANIZATION_STATUSES);
// ============================================================================
// Organization Feature Flags
// ============================================================================
/**
 * Valid feature flags for an organization's settings.features array.
 * These control which product modules are enabled for the organization.
 *
 * Values MUST match what is seeded/set in the database.
 * See: server/prisma/seed.ts for reference data.
 *
 * - labs: Lab orders and panel results module
 * - training: Trainer assignment and workout tracking module
 * - nutrition: Nutrition logging and plan module
 * - crm: CRM dashboard and client pipeline module
 */
export const ORG_FEATURE_FLAGS = [
    "labs",
    "training",
    "nutrition",
    "crm",
];
export const OrgFeatureFlagSchema = z.enum(ORG_FEATURE_FLAGS);
// ============================================================================
// Zod Schemas
// ============================================================================
/**
 * Organization billing info schema.
 */
export const OrganizationBillingInfoSchema = z.object({
    plan: z.string().optional(),
    billingEmail: z.string().email().optional(),
    stripeCustomerId: z.string().optional(),
    subscriptionId: z.string().optional(),
    subscriptionStatus: SubscriptionStatusSchema.optional(),
});
/**
 * Organization settings schema.
 */
export const OrganizationSettingsSchema = z.object({
    timezone: z.string().default("America/Chicago"),
    locale: z.string().default("en-US"),
    features: z.array(OrgFeatureFlagSchema).default([]),
    branding: z
        .object({
        primaryColor: z.string().optional(),
        logoUrl: z.string().url().optional(),
    })
        .optional(),
});
/**
 * Organization address schema.
 */
export const OrganizationAddressSchema = z.object({
    street1: z.string().optional(),
    street2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().default("US"),
});
/**
 * Base organization schema (for API responses).
 */
export const OrganizationSchema = z.object({
    id: z.string().uuid(),
    slug: z
        .string()
        .min(3)
        .max(50)
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    name: z.string().min(1).max(255),
    status: OrganizationStatusSchema,
    billingInfo: OrganizationBillingInfoSchema.nullable().optional(),
    settings: OrganizationSettingsSchema.nullable().optional(),
    contactEmail: z.string().email().nullable().optional(),
    contactPhone: z.string().nullable().optional(),
    address: OrganizationAddressSchema.nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
/**
 * Create organization request schema.
 */
export const CreateOrganizationRequestSchema = z.object({
    slug: z
        .string()
        .min(3)
        .max(50)
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    name: z.string().min(1).max(255),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    settings: OrganizationSettingsSchema.optional(),
    address: OrganizationAddressSchema.optional(),
});
/**
 * Update organization request schema.
 */
export const UpdateOrganizationRequestSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    status: OrganizationStatusSchema.optional(),
    contactEmail: z.string().email().nullable().optional(),
    contactPhone: z.string().nullable().optional(),
    settings: OrganizationSettingsSchema.partial().optional(),
    address: OrganizationAddressSchema.partial().optional(),
    billingInfo: OrganizationBillingInfoSchema.partial().optional(),
});
/**
 * Organization summary (for lists, dropdowns).
 */
export const OrganizationSummarySchema = z.object({
    id: z.string().uuid(),
    slug: z.string(),
    name: z.string(),
    status: OrganizationStatusSchema,
});
// ============================================================================
// JWT Claims Extension
// ============================================================================
/**
 * Extended JWT claims including organization context.
 * Added to token during login for tenant-scoped requests.
 */
export const OrganizationJwtClaimsSchema = z.object({
    organizationId: z.string().uuid(),
    organizationSlug: z.string().optional(),
    organizationStatus: OrganizationStatusSchema.optional(),
});
//# sourceMappingURL=organization.js.map