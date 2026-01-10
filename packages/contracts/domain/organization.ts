/**
 * @ai-context Organization/Tenant contracts for MSO multi-tenancy model
 *
 * Defines the Organization entity and related types for tenant isolation.
 * Organizations represent distinct medical practices/clinics in the MSO model.
 *
 * Security: All PHI and user data is scoped to an organization.
 * See: server/src/lib/tenantContext.ts for enforcement mechanism.
 */

import { z } from 'zod';

// ============================================================================
// Organization Status
// ============================================================================

/**
 * Organization lifecycle status.
 * Controls what operations are allowed for the organization.
 */
export const ORGANIZATION_STATUS = {
  /** Normal operation - full access */
  ACTIVE: 'ACTIVE',
  /** Billing/compliance issue - read-only access */
  SUSPENDED: 'SUSPENDED',
  /** Soft-deleted - no access */
  ARCHIVED: 'ARCHIVED',
  /** New org being set up - limited access */
  ONBOARDING: 'ONBOARDING',
} as const;

export type OrganizationStatus = (typeof ORGANIZATION_STATUS)[keyof typeof ORGANIZATION_STATUS];

export const ORGANIZATION_STATUSES = Object.values(ORGANIZATION_STATUS) as readonly OrganizationStatus[];

/**
 * Display labels for organization statuses.
 */
export const ORGANIZATION_STATUS_LABELS: Record<OrganizationStatus, string> = {
  [ORGANIZATION_STATUS.ACTIVE]: 'Active',
  [ORGANIZATION_STATUS.SUSPENDED]: 'Suspended',
  [ORGANIZATION_STATUS.ARCHIVED]: 'Archived',
  [ORGANIZATION_STATUS.ONBOARDING]: 'Onboarding',
};

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
  subscriptionStatus: z.string().optional(),
});

export type OrganizationBillingInfo = z.infer<typeof OrganizationBillingInfoSchema>;

/**
 * Organization settings schema.
 */
export const OrganizationSettingsSchema = z.object({
  timezone: z.string().default('America/Chicago'),
  locale: z.string().default('en-US'),
  features: z.array(z.string()).default([]),
  branding: z.object({
    primaryColor: z.string().optional(),
    logoUrl: z.string().url().optional(),
  }).optional(),
});

export type OrganizationSettings = z.infer<typeof OrganizationSettingsSchema>;

/**
 * Organization address schema.
 */
export const OrganizationAddressSchema = z.object({
  street1: z.string().optional(),
  street2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('US'),
});

export type OrganizationAddress = z.infer<typeof OrganizationAddressSchema>;

/**
 * Base organization schema (for API responses).
 */
export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1).max(255),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED', 'ONBOARDING']),
  billingInfo: OrganizationBillingInfoSchema.nullable().optional(),
  settings: OrganizationSettingsSchema.nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  address: OrganizationAddressSchema.nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Organization = z.infer<typeof OrganizationSchema>;

/**
 * Create organization request schema.
 */
export const CreateOrganizationRequestSchema = z.object({
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: z.string().min(1).max(255),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  settings: OrganizationSettingsSchema.optional(),
  address: OrganizationAddressSchema.optional(),
});

export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;

/**
 * Update organization request schema.
 */
export const UpdateOrganizationRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED', 'ONBOARDING']).optional(),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  settings: OrganizationSettingsSchema.partial().optional(),
  address: OrganizationAddressSchema.partial().optional(),
  billingInfo: OrganizationBillingInfoSchema.partial().optional(),
});

export type UpdateOrganizationRequest = z.infer<typeof UpdateOrganizationRequestSchema>;

/**
 * Organization summary (for lists, dropdowns).
 */
export const OrganizationSummarySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED', 'ONBOARDING']),
});

export type OrganizationSummary = z.infer<typeof OrganizationSummarySchema>;

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
  organizationStatus: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED', 'ONBOARDING']).optional(),
});

export type OrganizationJwtClaims = z.infer<typeof OrganizationJwtClaimsSchema>;
