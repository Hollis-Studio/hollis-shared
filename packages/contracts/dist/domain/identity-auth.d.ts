/**
 * @ai-context Hollis Identity session wire shapes | `GET /auth/me`, `POST /auth/logout`,
 * `POST /auth/forgot-password` and `POST /auth/reset-password` on the Identity Service
 * (`https://identity.hollis.health/v1`).
 *
 * These routes answer inside Identity's `{ success: true, data }` envelope; these schemas
 * describe `data`. Objects are non-strict (unknown keys are stripped) so Identity can add a
 * field without failing an older client's parse.
 *
 * `provider` is ACCOUNT-level, not session-level. Access tokens carry no sign-in method, so
 * Identity derives it from the account: "password" when the account has a password,
 * otherwise the OAuth provider linked first (the one it was created with). That is what the
 * provider-gated client UI asks (Change Password, account-deletion re-auth, signup-method
 * telemetry) — hollis-workouts#129/#246.
 *
 * `sourceApp` names the suite app that asked for an e-mail. Identity uses it to pick the
 * link host, so a Workouts user's reset link opens Hollis Workouts rather than Hollis Health.
 * Absent means the suite default.
 *
 * deps: zod, ../constants (OAUTH_PROVIDERS), ../password (passwordSchema), ./user (UserRoleSchema)
 * consumers: hollis-identity (`src/routes/auth.ts` GET /me, POST /logout, forgot/reset
 *            password) + hollis-workouts mobile client (`src/services/auth/sessionRestore.ts`,
 *            `identityApi.ts`)
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
/** Suite app that asked Identity for an e-mail link (`"workouts"`, …). */
export declare const IdentitySourceAppSchema: z.ZodString;
export type IdentitySourceApp = z.infer<typeof IdentitySourceAppSchema>;
/** `POST /auth/forgot-password` body. Identity always answers `{ ok: true }` (anti-enumeration). */
export declare const IdentityForgotPasswordRequestSchema: z.ZodObject<{
    email: z.ZodString;
    sourceApp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type IdentityForgotPasswordRequest = z.infer<typeof IdentityForgotPasswordRequestSchema>;
/** Bounds of the single-use reset token Identity e-mails (URL-safe base64). */
export declare const IdentityResetTokenSchema: z.ZodString;
/** `POST /auth/reset-password` body. No Bearer header: the token is the credential. */
export declare const IdentityResetPasswordRequestSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
export type IdentityResetPasswordRequest = z.infer<typeof IdentityResetPasswordRequestSchema>;
/**
 * `POST /auth/reset-password` success `data`. `email` is the account's address, so the client
 * that holds the token can sign in with the new password through the normal login route (and
 * its MFA challenge) instead of asking for the address again. The reset revokes every session.
 */
export declare const IdentityResetPasswordResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    email: z.ZodString;
}, z.core.$strip>;
export type IdentityResetPasswordResponse = z.infer<typeof IdentityResetPasswordResponseSchema>;
//# sourceMappingURL=identity-auth.d.ts.map