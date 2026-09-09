/**
 * @ai-context Workouts program rotation wire shapes | the per-user singleton
 * behind `GET/PUT /v1/program-rotation` and `POST /v1/program-rotation/advance`
 * on the Hollis Workouts server (hollis-workouts#70).
 *
 * A rotation is a year-long plan: "Fall Bulk, Sep 1 – Nov 30" → "Maintain,
 * Dec 1 – Feb 28" → "Spring Cut, Mar 1 – May 31". Each entry names a program,
 * the training phase to run it in, and a calendar window. The decision spec is
 * `docs/product/decisions/2026-08-19-program-rotation.md` in hollis-workouts;
 * the parts that shape the wire are restated here so the contract is readable
 * on its own.
 *
 * ─── The safety property this contract encodes ─────────────────────────────
 * The server SCHEDULES; it never TRANSITIONS. Nothing on this wire carries a
 * training-phase write. The device evaluates the calendar, prompts the lifter,
 * and — only on an explicit Apply — runs its own phase-transition path, then
 * reports the applied entry back through the advance verb so every other
 * device stops offering the same switch. `currentEntryId` is therefore a
 * server-owned pointer ("the entry the lifter last applied"), not a schedule
 * position the server moves on its own.
 *
 * ─── Dates are local civil dates, never instants ───────────────────────────
 * `startDate` / `endDate` are `YYYY-MM-DD` strings. "Ends Nov 30" means Nov 30
 * on the lifter's own calendar wherever they are; the server stores and echoes
 * the strings and never interprets them in a timezone. Windows are inclusive
 * on both ends.
 *
 * ─── Overlaps and gaps are legal on the wire ───────────────────────────────
 * Entries are accepted as written. Precedence (earliest start wins), gaps
 * (rotation dormant) and swallowed entries are evaluated on the device from
 * the ordered list; the contract only guarantees unique ids and well-formed
 * windows, so a save is never blocked by a scheduling nuance the editor
 * already explains in words.
 *
 * deps: zod, ./common (isoDateSchema)
 * consumers: hollis-workouts server (`server/src/routes/programRotation.ts`,
 *            `server/src/routes/programRotationAdvance.ts`) + mobile client
 *            (`src/schemas/programRotation.ts`, `src/state/programRotation.ts`)
 */
import { z } from "zod";
import { isoDateSchema } from "./common.js";
/**
 * Revision of the rotation document. Bump when an entry field is added or its
 * meaning changes; the server refuses a body whose version it does not know
 * rather than reading fields positionally.
 */
export const PROGRAM_ROTATION_SCHEMA_VERSION = 1;
/** Upper bound on entries per rotation — two years of monthly blocks. */
export const PROGRAM_ROTATION_MAX_ENTRIES = 24;
/** Upper bound on a program-less entry's display label. */
export const PROGRAM_ROTATION_LABEL_MAX_LENGTH = 60;
/**
 * The lifter's training goal for the window. Mirrors `trainingPhase` on
 * `WorkoutsUserProfileSchema.settings` (the field the device's transition path
 * writes); kept as its own schema so a rotation entry cannot drift to a value
 * the profile would reject.
 */
export const ProgramRotationPhaseSchema = z.enum(["build", "maintain", "cut"]);
/**
 * One calendar window on the rotation.
 *
 * `programId` is nullable from day one: an entry may be "a freestyle block at
 * phase X" with no program attached. Making it nullable later would be a
 * breaking bump. When `programId` is null the device shows `label`; when a
 * program is attached the program's own name is displayed and `label` is
 * ignored. A `programId` that no longer resolves (the program was deleted on
 * another device) is tolerated at read time — the entry renders as
 * "program deleted, pick a program" — so this schema never validates it.
 */
export const ProgramRotationEntrySchema = z
    .object({
    /** Client-minted, stable across edits; the advance verb addresses entries by it. */
    id: z.string().min(1).max(64),
    programId: z.string().min(1).nullable(),
    label: z.string().trim().min(1).max(PROGRAM_ROTATION_LABEL_MAX_LENGTH).nullable(),
    phase: ProgramRotationPhaseSchema,
    /** Inclusive local civil date, YYYY-MM-DD. */
    startDate: isoDateSchema,
    /** Inclusive local civil date, YYYY-MM-DD. Never before `startDate`. */
    endDate: isoDateSchema,
})
    .refine((entry) => entry.startDate <= entry.endDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
});
/**
 * The entry list. Order on the wire is the lifter's creation order and is the
 * final tiebreak when two entries share both dates; the device sorts by
 * `startDate`, then `endDate`, then this order before evaluating anything.
 */
export const ProgramRotationEntriesSchema = z
    .array(ProgramRotationEntrySchema)
    .max(PROGRAM_ROTATION_MAX_ENTRIES)
    .superRefine((entries, ctx) => {
    const seen = new Set();
    entries.forEach((entry, index) => {
        if (seen.has(entry.id)) {
            ctx.addIssue({
                code: "custom",
                message: `Duplicate rotation entry id "${entry.id}"`,
                path: [index, "id"],
            });
        }
        seen.add(entry.id);
    });
});
const rotationDocumentFields = {
    schemaVersion: z.literal(PROGRAM_ROTATION_SCHEMA_VERSION),
    /** A disabled rotation keeps its entries but never prompts. */
    enabled: z.boolean(),
    entries: ProgramRotationEntriesSchema,
};
/**
 * `PUT /v1/program-rotation` body — the whole document, client-authored.
 *
 * `currentEntryId`, `currentEntryAppliedAt`, `userId` and `updatedAt` are
 * accepted so a whole-document sync PUT parses, but they are server-owned and
 * the route never reads them from the body: the pointer moves only through the
 * advance verb, and it is cleared server-side when the entry it names is no
 * longer in `entries`. `createdAt` is honoured on first create only.
 */
export const ProgramRotationPutBodySchema = z.object({
    ...rotationDocumentFields,
    userId: z.string().optional(),
    currentEntryId: z.string().nullable().optional(),
    currentEntryAppliedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().nullable().optional(),
});
/**
 * `GET /v1/program-rotation`, `PUT /v1/program-rotation` and
 * `POST /v1/program-rotation/advance` response.
 *
 * A user who has never saved a rotation still gets a `200` with this shape —
 * `enabled: false`, no entries, every server stamp `null` — rather than a
 * `404`. The client mirrors this document through its offline-first document
 * sync, which treats a missing document as a failed hydrate on every pass;
 * an empty document is the honest answer, and `updatedAt: null` tells the
 * client its first write needs no concurrency base.
 */
export const ProgramRotationSchema = z.object({
    userId: z.string().min(1),
    ...rotationDocumentFields,
    /** The entry the lifter last applied, or null when nothing has been applied yet. */
    currentEntryId: z.string().nullable(),
    currentEntryAppliedAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date().nullable(),
    updatedAt: z.coerce.date().nullable(),
});
/**
 * `POST /v1/program-rotation/advance` body.
 *
 * Sent AFTER the device has applied the switch (program activated, phase
 * transitioned through its own path). `expectedCurrentEntryId` is the pointer
 * the device believed was current; a mismatch is a `409` — another device
 * already advanced — and the client's job is to reload and say so, never to
 * force through. `entryId` must name an entry in the stored document.
 */
export const ProgramRotationAdvanceBodySchema = z.object({
    entryId: z.string().min(1),
    expectedCurrentEntryId: z.string().min(1).nullable(),
});
//# sourceMappingURL=workouts-program-rotation.js.map