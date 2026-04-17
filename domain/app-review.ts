/**
 * @ai-context App review/demo credential contracts | canonical reviewer accounts shared across surfaces
 *
 * These credentials are intentionally published for app review and local demo flows.
 * Any seed script, mobile dev helper, or web-admin dev shortcut must import from
 * this module so reviewer credentials cannot drift between surfaces.
 */

import { USER_ROLE, USER_TIER, type UserRole, type UserTier } from "./user";

export type AppReviewAccountKey = "primaryClient" | "reviewerAdmin";

export type AppReviewAccountConfig = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tier: UserTier;
  label: string;
};

export const APP_REVIEW_PASSWORD = "hollis123"; // secret-ok: App Store reviewer demo account credential

export const APP_REVIEW_ACCOUNTS = {
  primaryClient: {
    id: "HH-REV001",
    email: "testuser@hollis.health",
    firstName: "John",
    lastName: "Doe",
    role: USER_ROLE.CLIENT,
    tier: USER_TIER.CONCIERGE,
    label: "App review test user",
  },
  reviewerAdmin: {
    id: "HH-REV002",
    email: "testadmin@hollis.health",
    firstName: "Test",
    lastName: "Admin",
    role: USER_ROLE.ADMIN,
    tier: USER_TIER.CONCIERGE,
    label: "App review admin",
  },
} satisfies Record<AppReviewAccountKey, AppReviewAccountConfig>;

export const APP_REVIEW_CREDENTIALS = {
  primaryClient: {
    email: APP_REVIEW_ACCOUNTS.primaryClient.email,
    password: APP_REVIEW_PASSWORD,
  },
  reviewerAdmin: {
    email: APP_REVIEW_ACCOUNTS.reviewerAdmin.email,
    password: APP_REVIEW_PASSWORD,
  },
} as const;
