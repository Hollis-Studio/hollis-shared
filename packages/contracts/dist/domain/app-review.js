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
import { USER_ROLE, USER_TIER } from "./user.js";
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
};
//# sourceMappingURL=app-review.js.map