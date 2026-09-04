/**
 * @ai-context Workouts account lifecycle wire shapes | the response contract for
 * `DELETE /v1/users/me` on the Hollis Workouts server.
 *
 * ─── Namespace decision (hollis-workouts#43) ────────────────────────────────
 * TWO servers in the suite delete an account, and they delete different things:
 *
 *   Identity Service `DELETE /auth/account` → erases the sign-in credential
 *                                             (email/OAuth) and revokes sessions.
 *   Workouts server  `DELETE /v1/users/me`  → hard-deletes the Workouts-owned
 *                                             training data for that user.
 *
 * The mobile "Delete Account" flow calls BOTH, in that order, and reports a
 * different message depending on which half failed. So these acknowledgements
 * must never share a name: everything here carries the `Workouts` prefix, the
 * same convention `WorkoutsUserProfileSchema` established when it had to avoid
 * shadowing Identity's `UserProfileSchema`.
 *
 * deps: zod
 * consumers: hollis-workouts server (`server/src/routes/users.ts`) + mobile
 *            client (`src/services/auth/identityApi.ts`)
 */
import { z } from "zod";

/**
 * Revision of the deletion acknowledgement shape. Bump when a field is added or
 * its meaning changes, so a client can distinguish "older server" from "newer
 * server that genuinely reported nothing".
 */
export const WORKOUTS_ACCOUNT_DELETION_ACK_VERSION = 1 as const;

/**
 * `DELETE /v1/users/me` success body.
 *
 * This endpoint returned a bare `204 No Content` until #43. A 204 has no body,
 * which meant the one destructive endpoint in the API was also the only one
 * whose response no contract could describe — it was the sole straggler in
 * `wire-contracts-registry.json` and could never be marked clean. It now
 * answers `200` with this acknowledgement instead.
 *
 * `deletedModels` is a count-per-model map rather than a single total because
 * the deletion runs as one Prisma transaction over ~20 user-scoped tables, and
 * "which tables did this actually clear" is the question an erasure audit
 * (GDPR/CCPA, App Store Guideline 5.1.1) asks. Keys are Prisma model names; the
 * map is open-ended so adding a user-scoped table does not break the contract.
 */
export const WorkoutsAccountDeletionAckSchema = z.object({
  /** Always true — a failure is an error envelope, never this shape. */
  deleted: z.literal(true),
  /** The authenticated user whose data was erased, echoed for log correlation. */
  userId: z.string().min(1),
  /** ISO-8601 instant the wipe transaction committed. */
  deletedAt: z.string().datetime(),
  /** Rows deleted per Prisma model, e.g. `{ session: 412, gym: 3 }`. */
  deletedModels: z.record(z.string(), z.number().int().nonnegative()),
  /**
   * Schema revision of this acknowledgement. Lets the client tell "old server,
   * no counts" apart from "new server, genuinely zero rows".
   */
  ackVersion: z.literal(WORKOUTS_ACCOUNT_DELETION_ACK_VERSION),
});
export type WorkoutsAccountDeletionAck = z.infer<typeof WorkoutsAccountDeletionAckSchema>;
