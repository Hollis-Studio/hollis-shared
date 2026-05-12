/**
 * @ai-context App review/demo credential contracts | canonical reviewer accounts shared across surfaces
 *
 * These credentials are intentionally published for app review and local demo flows.
 * Any seed script, mobile dev helper, or web-admin dev shortcut must import from
 * this module so reviewer credentials cannot drift between surfaces.
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
export declare const APP_REVIEW_PASSWORD = "hollis123";
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
export declare const APP_REVIEW_CREDENTIALS: {
    readonly primaryClient: {
        readonly email: string;
        readonly password: "hollis123";
    };
    readonly reviewerAdmin: {
        readonly email: string;
        readonly password: "hollis123";
    };
};
//# sourceMappingURL=app-review.d.ts.map