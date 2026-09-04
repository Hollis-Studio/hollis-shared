/**
 * @ai-context Workouts REST envelope | the OUTER wire shape of every
 * `/v1/**` response emitted by the Hollis Workouts server.
 *
 * ─── Namespace decision (hollis-workouts#43) ────────────────────────────────
 * The suite runs TWO different response envelopes, and this package now owns
 * both, under distinct names so neither can shadow the other:
 *
 *   `api/response.ts`          → `{ success: true, data }`  — Hollis Health /
 *                                Identity Service. Unwrap with `unwrapEnvelope`.
 *   `api/workouts-envelope.ts` → `{ ok: true, data }`       — Hollis Workouts
 *                                server. Unwrap with `unwrapWorkoutsEnvelope`.
 *
 * Do NOT unify them here. The two servers are independently deployed and the
 * rename would be a breaking wire change on every route of whichever side
 * moved; this module exists to make the divergence explicit and single-sourced
 * rather than hand-mirrored in four places (it previously was: the Workouts
 * server `utils/response.ts` + `lib/AppError.ts` + `middleware/errorHandler.ts`
 * and the mobile `services/http/apiClient.ts`).
 *
 * Note on `err` vs `error`: the Workouts error envelope nests a `{ code,
 * message }` object under `err`. The Health envelope uses a flat top-level
 * `error` string (see `errors/errorResponseSchema.ts`). Same reasoning applies.
 *
 * deps: zod
 * consumers: hollis-workouts server — `server/src/utils/response.ts`,
 *            `server/src/lib/AppError.ts`, `server/src/middleware/errorHandler.ts`.
 *
 * The mobile `src/services/http/apiClient.ts` deliberately does NOT consume
 * these: it is one client for BOTH backends and reads a permissive union of the
 * two envelopes (`{ success, error } | { ok, err }`, every field optional) so an
 * unexpected body still yields a usable error code rather than a parse failure.
 * Tightening it to this schema would make the client stricter than the servers.
 */
import { z } from "zod";

/**
 * The `err` member of a Workouts failure envelope. `details` is the optional
 * free-form payload `AppError` attaches (Zod issue arrays, conflict context).
 */
export const WorkoutsErrorDetailSchema = z.object({
  code: z.string().min(1),
  message: z.string(),
  details: z.unknown().optional(),
});
export type WorkoutsErrorDetail = z.infer<typeof WorkoutsErrorDetailSchema>;

/**
 * Canonical Workouts failure envelope: `{ ok: false, err: { code, message } }`.
 * Emitted by `AppError.toJSON()`, the error-handler middleware, and
 * `sendError()`. Every non-2xx `/v1/**` body conforms to this.
 */
export const WorkoutsErrorEnvelopeSchema = z.object({
  ok: z.literal(false),
  err: WorkoutsErrorDetailSchema,
});
export type WorkoutsErrorEnvelope = z.infer<typeof WorkoutsErrorEnvelopeSchema>;

/**
 * The canonical Workouts success envelope emitted by `sendSuccess()`.
 *
 * Kept as a generic interface (not only a schema) because the server's send
 * helpers are generic over an already-parsed contract payload — they need the
 * type, not another runtime parse of data they just parsed.
 */
export interface WorkoutsSuccessEnvelope<T> {
  ok: true;
  data: T;
}

/**
 * Builds the runtime schema for `{ ok: true, data }` around a payload schema.
 *
 * Use this on the CLIENT to validate a whole Workouts response body. The server
 * parses the payload through its contract schema and wraps it, so it needs
 * `WorkoutsSuccessEnvelope<T>` rather than this factory.
 */
export function createWorkoutsSuccessEnvelopeSchema<TSchema extends z.ZodTypeAny>(
  dataSchema: TSchema,
): z.ZodObject<{ ok: z.ZodLiteral<true>; data: TSchema }> {
  return z.object({
    ok: z.literal(true),
    data: dataSchema,
  });
}

/**
 * True when `value` is a Workouts failure envelope. Narrow with this before
 * reading `err.code` instead of duck-typing `'err' in value`.
 */
export function isWorkoutsErrorEnvelope(value: unknown): value is WorkoutsErrorEnvelope {
  return WorkoutsErrorEnvelopeSchema.safeParse(value).success;
}

/**
 * Unwraps `{ ok: true, data: T }`, returning the value unchanged when it is not
 * enveloped.
 *
 * Detection requires a boolean `ok` AND a `data` member, which is why a
 * paginated payload (`{ data: [...], pagination: {...} }`) that has already been
 * unwrapped once is returned as-is rather than double-unwrapped.
 *
 * This is the `ok`-flavoured twin of `unwrapEnvelope` in `api/response.ts`; a
 * client that talks to both servers can call whichever matches the base URL.
 */
export function unwrapWorkoutsEnvelope<T>(response: WorkoutsSuccessEnvelope<T> | T): T {
  if (
    response != null &&
    typeof response === "object" &&
    "ok" in response &&
    (response as { ok?: unknown }).ok === true &&
    "data" in response
  ) {
    return (response as WorkoutsSuccessEnvelope<T>).data;
  }
  return response as T;
}
