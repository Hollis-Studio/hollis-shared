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

import { OAUTH_PROVIDERS } from "../constants/index.js";
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
