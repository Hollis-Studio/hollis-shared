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
/**
 * Organization lifecycle status.
 * Controls what operations are allowed for the organization.
 * - ACTIVE: Normal operation - full access
 * - SUSPENDED: Billing/compliance issue - read-only access
 * - ARCHIVED: Soft-deleted - no access
 * - ONBOARDING: New org being set up - limited access
 */
export declare const ORGANIZATION_STATUSES: readonly ["ACTIVE", "SUSPENDED", "ARCHIVED", "ONBOARDING"];
export type OrganizationStatus = z.infer<typeof OrganizationStatusSchema>;
/**
 * @deprecated Use ORGANIZATION_STATUSES array directly. Kept for backward compatibility.
 */
export declare const ORGANIZATION_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly SUSPENDED: "SUSPENDED";
    readonly ARCHIVED: "ARCHIVED";
    readonly ONBOARDING: "ONBOARDING";
};
/**
 * Display labels for organization statuses.
 */
export declare const ORGANIZATION_STATUS_LABELS: Record<OrganizationStatus, string>;
/**
 * Zod schema for organization status validation.
 */
export declare const OrganizationStatusSchema: z.ZodEnum<{
    ONBOARDING: "ONBOARDING";
    ACTIVE: "ACTIVE";
    SUSPENDED: "SUSPENDED";
    ARCHIVED: "ARCHIVED";
}>;
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
export declare const ORG_FEATURE_FLAGS: readonly ["labs", "training", "nutrition", "crm"];
export type OrgFeatureFlag = (typeof ORG_FEATURE_FLAGS)[number];
export declare const OrgFeatureFlagSchema: z.ZodEnum<{
    nutrition: "nutrition";
    crm: "crm";
    labs: "labs";
    training: "training";
}>;
/**
 * Organization billing info schema.
 */
export declare const OrganizationBillingInfoSchema: z.ZodObject<{
    plan: z.ZodOptional<z.ZodString>;
    billingEmail: z.ZodOptional<z.ZodString>;
    stripeCustomerId: z.ZodOptional<z.ZodString>;
    subscriptionId: z.ZodOptional<z.ZodString>;
    subscriptionStatus: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
        PENDING: "PENDING";
        TRIAL: "TRIAL";
        PAST_DUE: "PAST_DUE";
        CANCELED: "CANCELED";
        TERMINATED: "TERMINATED";
        SUSPENDED: "SUSPENDED";
    }>>;
}, z.core.$strip>;
export type OrganizationBillingInfo = z.infer<typeof OrganizationBillingInfoSchema>;
/**
 * Organization settings schema.
 */
export declare const OrganizationSettingsSchema: z.ZodObject<{
    timezone: z.ZodDefault<z.ZodString>;
    locale: z.ZodDefault<z.ZodString>;
    features: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        nutrition: "nutrition";
        crm: "crm";
        labs: "labs";
        training: "training";
    }>>>;
    branding: z.ZodOptional<z.ZodObject<{
        primaryColor: z.ZodOptional<z.ZodString>;
        logoUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type OrganizationSettings = z.infer<typeof OrganizationSettingsSchema>;
/**
 * Organization address schema.
 */
export declare const OrganizationAddressSchema: z.ZodObject<{
    street1: z.ZodOptional<z.ZodString>;
    street2: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    country: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type OrganizationAddress = z.infer<typeof OrganizationAddressSchema>;
/**
 * Base organization schema (for API responses).
 */
export declare const OrganizationSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    status: z.ZodEnum<{
        ONBOARDING: "ONBOARDING";
        ACTIVE: "ACTIVE";
        SUSPENDED: "SUSPENDED";
        ARCHIVED: "ARCHIVED";
    }>;
    billingInfo: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        plan: z.ZodOptional<z.ZodString>;
        billingEmail: z.ZodOptional<z.ZodString>;
        stripeCustomerId: z.ZodOptional<z.ZodString>;
        subscriptionId: z.ZodOptional<z.ZodString>;
        subscriptionStatus: z.ZodOptional<z.ZodEnum<{
            ACTIVE: "ACTIVE";
            PAUSED: "PAUSED";
            PENDING: "PENDING";
            TRIAL: "TRIAL";
            PAST_DUE: "PAST_DUE";
            CANCELED: "CANCELED";
            TERMINATED: "TERMINATED";
            SUSPENDED: "SUSPENDED";
        }>>;
    }, z.core.$strip>>>;
    settings: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        timezone: z.ZodDefault<z.ZodString>;
        locale: z.ZodDefault<z.ZodString>;
        features: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            nutrition: "nutrition";
            crm: "crm";
            labs: "labs";
            training: "training";
        }>>>;
        branding: z.ZodOptional<z.ZodObject<{
            primaryColor: z.ZodOptional<z.ZodString>;
            logoUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    contactEmail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    contactPhone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        street1: z.ZodOptional<z.ZodString>;
        street2: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        country: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type Organization = z.infer<typeof OrganizationSchema>;
/**
 * Create organization request schema.
 */
export declare const CreateOrganizationRequestSchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    contactEmail: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodString>;
    settings: z.ZodOptional<z.ZodObject<{
        timezone: z.ZodDefault<z.ZodString>;
        locale: z.ZodDefault<z.ZodString>;
        features: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            nutrition: "nutrition";
            crm: "crm";
            labs: "labs";
            training: "training";
        }>>>;
        branding: z.ZodOptional<z.ZodObject<{
            primaryColor: z.ZodOptional<z.ZodString>;
            logoUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    address: z.ZodOptional<z.ZodObject<{
        street1: z.ZodOptional<z.ZodString>;
        street2: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodString>;
        country: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;
/**
 * Update organization request schema.
 */
export declare const UpdateOrganizationRequestSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ONBOARDING: "ONBOARDING";
        ACTIVE: "ACTIVE";
        SUSPENDED: "SUSPENDED";
        ARCHIVED: "ARCHIVED";
    }>>;
    contactEmail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    contactPhone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    settings: z.ZodOptional<z.ZodObject<{
        timezone: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        locale: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        features: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodEnum<{
            nutrition: "nutrition";
            crm: "crm";
            labs: "labs";
            training: "training";
        }>>>>;
        branding: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            primaryColor: z.ZodOptional<z.ZodString>;
            logoUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    address: z.ZodOptional<z.ZodObject<{
        street1: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        street2: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        state: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        postalCode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        country: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    }, z.core.$strip>>;
    billingInfo: z.ZodOptional<z.ZodObject<{
        plan: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        billingEmail: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        stripeCustomerId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        subscriptionId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        subscriptionStatus: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
            ACTIVE: "ACTIVE";
            PAUSED: "PAUSED";
            PENDING: "PENDING";
            TRIAL: "TRIAL";
            PAST_DUE: "PAST_DUE";
            CANCELED: "CANCELED";
            TERMINATED: "TERMINATED";
            SUSPENDED: "SUSPENDED";
        }>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type UpdateOrganizationRequest = z.infer<typeof UpdateOrganizationRequestSchema>;
/**
 * Organization summary (for lists, dropdowns).
 */
export declare const OrganizationSummarySchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    name: z.ZodString;
    status: z.ZodEnum<{
        ONBOARDING: "ONBOARDING";
        ACTIVE: "ACTIVE";
        SUSPENDED: "SUSPENDED";
        ARCHIVED: "ARCHIVED";
    }>;
}, z.core.$strip>;
export type OrganizationSummary = z.infer<typeof OrganizationSummarySchema>;
/**
 * Extended JWT claims including organization context.
 * Added to token during login for tenant-scoped requests.
 */
export declare const OrganizationJwtClaimsSchema: z.ZodObject<{
    organizationId: z.ZodString;
    organizationSlug: z.ZodOptional<z.ZodString>;
    organizationStatus: z.ZodOptional<z.ZodEnum<{
        ONBOARDING: "ONBOARDING";
        ACTIVE: "ACTIVE";
        SUSPENDED: "SUSPENDED";
        ARCHIVED: "ARCHIVED";
    }>>;
}, z.core.$strip>;
export type OrganizationJwtClaims = z.infer<typeof OrganizationJwtClaimsSchema>;
//# sourceMappingURL=organization.d.ts.map