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

import { OAUTH_PROVIDERS } from "../constants/index.js";
import { passwordSchema } from "../password/index.js";
import { UserRoleSchema } from "./user.js";

/** How an Identity account signs in: its password, else its linked OAuth provider. */
export const IDENTITY_ACCOUNT_PROVIDERS = ["password", ...OAUTH_PROVIDERS] as const;
export const IdentityAccountProviderSchema = z.enum(IDENTITY_ACCOUNT_PROVIDERS);
export type IdentityAccountProvider = z.infer<typeof IdentityAccountProviderSchema>;

/** `GET /auth/me` success `data`. */
export const IdentityMeResponseSchema = z.object({
  userId: z.string().min(1),
  email: z.string().min(1),
  /** `User.displayName`, falling back to the e-mail local part (same rule as refresh). */
  displayName: z.string().min(1),
  role: UserRoleSchema,
  organizationId: z.string().nullable(),
  emailVerified: z.boolean(),
  /** Account-level sign-in method; see the module note. */
  provider: IdentityAccountProviderSchema,
  /** Cross-device "Reset Onboarding" epoch; null when none was ever requested. */
  onboardingResetAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type IdentityMeResponse = z.infer<typeof IdentityMeResponseSchema>;

/**
 * `POST /auth/logout` body. Both fields optional: Identity revokes the refresh token (by
 * hash) and denylists the access token's jti for whichever is supplied. No Bearer header.
 */
export const IdentityLogoutRequestSchema = z.object({
  refreshToken: z.string().min(1).optional(),
  accessToken: z.string().min(1).optional(),
});
export type IdentityLogoutRequest = z.infer<typeof IdentityLogoutRequestSchema>;

/** `POST /auth/logout` success `data`. */
export const IdentityLogoutResponseSchema = z.object({ ok: z.literal(true) });
export type IdentityLogoutResponse = z.infer<typeof IdentityLogoutResponseSchema>;

/** Suite app that asked Identity for an e-mail link (`"workouts"`, …). */
export const IdentitySourceAppSchema = z.string().trim().min(1).max(64);
export type IdentitySourceApp = z.infer<typeof IdentitySourceAppSchema>;

/** `POST /auth/forgot-password` body. Identity always answers `{ ok: true }` (anti-enumeration). */
export const IdentityForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
  sourceApp: IdentitySourceAppSchema.optional(),
});
export type IdentityForgotPasswordRequest = z.infer<typeof IdentityForgotPasswordRequestSchema>;

/** Bounds of the single-use reset token Identity e-mails (URL-safe base64). */
export const IdentityResetTokenSchema = z.string().min(20).max(512);

/** `POST /auth/reset-password` body. No Bearer header: the token is the credential. */
export const IdentityResetPasswordRequestSchema = z.object({
  token: IdentityResetTokenSchema,
  newPassword: passwordSchema,
});
export type IdentityResetPasswordRequest = z.infer<typeof IdentityResetPasswordRequestSchema>;

/**
 * `POST /auth/reset-password` success `data`. `email` is the account's address, so the client
 * that holds the token can sign in with the new password through the normal login route (and
 * its MFA challenge) instead of asking for the address again. The reset revokes every session.
 */
export const IdentityResetPasswordResponseSchema = z.object({
  ok: z.literal(true),
  email: z.string().min(1),
});
export type IdentityResetPasswordResponse = z.infer<typeof IdentityResetPasswordResponseSchema>;
