/**
 * @ai-context App review/demo credential contracts | canonical reviewer accounts shared across surfaces
 *
 * Non-sensitive reviewer account metadata (IDs, emails, names, roles) is exported
 * from this module so every surface uses the same canonical records.
 *
 * SECURITY: APP_REVIEW_PASSWORD has been removed from this public contracts package.
 * It was previously hardcoded here and shipped in every consumer bundle. The password
 * is now read exclusively from the APP_REVIEW_PASSWORD environment variable in the
 * server-side seed scripts that need it. Mobile and web-admin consumers must NOT
 * import the password — use the email fields from APP_REVIEW_ACCOUNTS for dev-mode
 * UI hints, and surface credentials only through your server's own auth flow.
 *
 * Production credentials: set APP_REVIEW_PASSWORD in AWS Secrets Manager at
 * hollis-prod/app/secrets (key: APP_REVIEW_PASSWORD) and in the ECS task
 * definition environment for all seed/migration task runs.
 */
import { type UserRole, type UserTier } from "./user.js";
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
export declare const APP_REVIEW_ACCOUNTS: {
    primaryClient: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "CLIENT";
        tier: "CONCIERGE";
        label: string;
    };
    reviewerAdmin: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: "ADMIN";
        tier: "CONCIERGE";
        label: string;
    };
};
//# sourceMappingURL=app-review.d.ts.map