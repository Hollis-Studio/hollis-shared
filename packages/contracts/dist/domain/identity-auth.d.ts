/**
 * @ai-context Hollis Identity session wire shapes | `GET /auth/me` and `POST /auth/logout`
 * on the Identity Service (`https://identity.hollis.health/v1`).
 *
 * Both routes answer inside Identity's `{ success: true, data }` envelope; these schemas
 * describe `data`. Objects are non-strict (unknown keys are stripped) so Identity can add a
 * field without failing an older client's parse.
 *
 * `provider` is ACCOUNT-level, not session-level. Access tokens carry no sign-in method, so
 * Identity derives it from the account: "password" when the account has a password,
 * otherwise the OAuth provider linked first (the one it was created with). That is what the
 * provider-gated client UI asks (Change Password, account-deletion re-auth, signup-method
 * telemetry) — hollis-workouts#129/#246.
 *
 * deps: zod, ../constants (OAUTH_PROVIDERS), ./user (UserRoleSchema)
 * consumers: hollis-identity (`src/routes/auth.ts` GET /me, POST /logout) + hollis-workouts
 *            mobile client (`src/services/auth/sessionRestore.ts`, `identityApi.ts`)
 */
import * as z from "zod";
/** How an Identity account signs in: its password, else its linked OAuth provider. */
export declare const IDENTITY_ACCOUNT_PROVIDERS: readonly ["password", "apple", "google"];
export declare const IdentityAccountProviderSchema: z.ZodEnum<{
    password: "password";
    apple: "apple";
    google: "google";
}>;
export type IdentityAccountProvider = z.infer<typeof IdentityAccountProviderSchema>;
/** `GET /auth/me` success `data`. */
export declare const IdentityMeResponseSchema: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodString;
    displayName: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>;
    organizationId: z.ZodNullable<z.ZodString>;
    emailVerified: z.ZodBoolean;
    provider: z.ZodEnum<{
        password: "password";
        apple: "apple";
        google: "google";
    }>;
    onboardingResetAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type IdentityMeResponse = z.infer<typeof IdentityMeResponseSchema>;
/**
 * `POST /auth/logout` body. Both fields optional: Identity revokes the refresh token (by
 * hash) and denylists the access token's jti for whichever is supplied. No Bearer header.
 */
export declare const IdentityLogoutRequestSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
    accessToken: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type IdentityLogoutRequest = z.infer<typeof IdentityLogoutRequestSchema>;
/** `POST /auth/logout` success `data`. */
export declare const IdentityLogoutResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
}, z.core.$strip>;
export type IdentityLogoutResponse = z.infer<typeof IdentityLogoutResponseSchema>;
//# sourceMappingURL=identity-auth.d.ts.map