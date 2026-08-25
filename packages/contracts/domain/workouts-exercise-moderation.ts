/**
 * @ai-context Hollis Workouts user-generated exercise pipeline (#46) wire shapes.
 * Covers the owner-facing submission surface (/v1/exercise-submissions), the
 * admin moderation surface (/v1/exercise-moderation), and the AI dedup-suggestion
 * route (/v1/ai/exercise-dedup-suggestions).
 *
 * The persisted provenance block itself (ownerUserId, submittedForReview,
 * moderationStatus, rejectionReason, supersededBy, …) lives in
 * domain/exercise-workouts.ts as ExerciseProvenanceSchema, because it is a
 * property of every exercise row rather than of this pipeline.
 *
 * deps: zod, domain/exercise-workouts
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
import {
  CanonicalExerciseRecordSchema,
  ExerciseModerationStatusSchema,
  UserExerciseSyncSchema,
} from './exercise-workouts.js';

// ---------------------------------------------------------------------------
// Submission (owner-facing)
// ---------------------------------------------------------------------------

/**
 * Explicit, per-submission consent. Both flags are required-true rather than
 * defaulted so a client cannot submit a user's exercise (and their photo) into
 * a public library by omitting a field.
 */
export const ExerciseSubmissionConsentSchema = z.object({
  /** The owner agreed to publish the exercise's name/taxonomy under the library terms. */
  termsAcknowledged: z.literal(true),
  /** The owner agreed to publish the attached media, if any. False when no media is attached. */
  mediaAcknowledged: z.boolean(),
});
export type ExerciseSubmissionConsent = z.infer<typeof ExerciseSubmissionConsentSchema>;

/**
 * POST /v1/exercise-submissions body.
 *
 * The full exercise payload rides along rather than being looked up by id
 * alone: a custom exercise is created offline-first, so the row may not have
 * reached the server yet when the owner taps "Suggest for public library".
 * The server upserts it under (id, userId) before recording the submission.
 */
export const ExerciseSubmissionCreateSchema = z.object({
  exerciseId: z.string().min(1).max(512),
  exercise: UserExerciseSyncSchema,
  consent: ExerciseSubmissionConsentSchema,
  /** Optional free-text context for the moderator. */
  note: z.string().max(500).optional(),
});
export type ExerciseSubmissionCreate = z.infer<typeof ExerciseSubmissionCreateSchema>;

/**
 * A submission as seen by its owner and by a moderator: the exercise row plus
 * the submitter note. Identical shape either side of the moderation boundary
 * so the owner's status view and the admin queue share one contract.
 */
export const ExerciseSubmissionRecordSchema = CanonicalExerciseRecordSchema.extend({
  note: z.string().max(500).nullable().default(null),
});
export type ExerciseSubmissionRecord = z.infer<typeof ExerciseSubmissionRecordSchema>;

// ---------------------------------------------------------------------------
// Moderation decisions (admin-facing)
// ---------------------------------------------------------------------------

export const EXERCISE_MODERATION_ACTIONS = ['promote', 'merge', 'reject'] as const;
export const ExerciseModerationActionSchema = z.enum(EXERCISE_MODERATION_ACTIONS);
export type ExerciseModerationAction = z.infer<typeof ExerciseModerationActionSchema>;

/**
 * POST /v1/exercise-moderation/:id/decision body.
 *
 * `idempotencyKey` is required, not optional: promote and merge rewrite
 * library membership and reference resolution, so a retried request must be a
 * no-op rather than a second, differently-shaped mutation.
 */
export const ExerciseModerationDecisionSchema = z
  .object({
    action: ExerciseModerationActionSchema,
    /** When true the server computes and returns the effects without writing. */
    dryRun: z.boolean().default(false),
    idempotencyKey: z.string().min(1).max(128),
    /** Surviving exercise id. Required for `merge`, forbidden otherwise. */
    targetExerciseId: z.string().min(1).max(512).optional(),
    /** Required for `reject`; surfaced to the owner verbatim. */
    rejectionReason: z.string().min(1).max(1000).optional(),
    reviewerNote: z.string().max(1000).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.action === 'merge' && value.targetExerciseId === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['targetExerciseId'],
        message: 'targetExerciseId is required for a merge decision',
      });
    }
    if (value.action !== 'merge' && value.targetExerciseId !== undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['targetExerciseId'],
        message: 'targetExerciseId is only valid for a merge decision',
      });
    }
    if (value.action === 'reject' && value.rejectionReason === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['rejectionReason'],
        message: 'rejectionReason is required for a reject decision',
      });
    }
  });
export type ExerciseModerationDecision = z.infer<typeof ExerciseModerationDecisionSchema>;

/** What a decision did (or, for a dry run, what it would do). */
export const ExerciseModerationEffectsSchema = z.object({
  /** Rows in canonical_exercises written (0 on a dry run or a no-op replay). */
  canonicalRowsWritten: z.number().int().min(0),
  /** Rows in user_exercises whose moderation mirror was updated. */
  userExerciseRowsWritten: z.number().int().min(0),
  /** Resulting supersededBy value, if any. */
  supersededBy: z.string().nullable(),
  /**
   * Count of existing rows that resolve through the redirect after a merge —
   * gym instances + aliases pointing at the merged id. Reported, never
   * rewritten: the stored ids stay put and resolve one hop through
   * supersededBy, which is what keeps promotion/merge free of silent ID loss.
   */
  referencesRedirected: z.number().int().min(0),
});
export type ExerciseModerationEffects = z.infer<typeof ExerciseModerationEffectsSchema>;

export const ExerciseModerationDecisionResultSchema = z.object({
  exerciseId: z.string().min(1),
  action: ExerciseModerationActionSchema,
  dryRun: z.boolean(),
  /** False for a dry run and for an idempotent replay of an already-applied key. */
  applied: z.boolean(),
  /** True when this exact idempotencyKey had already been applied. */
  replayed: z.boolean(),
  moderationStatus: ExerciseModerationStatusSchema,
  targetExerciseId: z.string().nullable(),
  effects: ExerciseModerationEffectsSchema,
  auditEventId: z.string().nullable(),
  /** Non-fatal conditions a moderator should see (e.g. target itself superseded). */
  warnings: z.array(z.string()),
});
export type ExerciseModerationDecisionResult = z.infer<
  typeof ExerciseModerationDecisionResultSchema
>;

/** One row of the append-only moderation audit trail. */
export const ExerciseModerationAuditEventSchema = z.object({
  id: z.string().min(1),
  exerciseId: z.string().min(1),
  moderatorUserId: z.string().min(1),
  ownerUserId: z.string().nullable(),
  action: ExerciseModerationActionSchema,
  fromStatus: ExerciseModerationStatusSchema.nullable(),
  toStatus: ExerciseModerationStatusSchema,
  targetExerciseId: z.string().nullable(),
  reason: z.string().nullable(),
  reviewerNote: z.string().nullable(),
  idempotencyKey: z.string().min(1),
  effects: ExerciseModerationEffectsSchema,
  createdAt: z.coerce.date(),
});
export type ExerciseModerationAuditEvent = z.infer<typeof ExerciseModerationAuditEventSchema>;

// ---------------------------------------------------------------------------
// AI dedup suggestions (admin-facing)
// ---------------------------------------------------------------------------

export const EXERCISE_DEDUP_VERDICTS = ['duplicate', 'variant', 'distinct'] as const;
export const ExerciseDedupVerdictSchema = z.enum(EXERCISE_DEDUP_VERDICTS);
export type ExerciseDedupVerdict = z.infer<typeof ExerciseDedupVerdictSchema>;

/** A candidate the moderator screen renders as dedup evidence. */
export const ExerciseDedupSuggestionSchema = z.object({
  canonicalExerciseId: z.string().min(1),
  canonicalExerciseName: z.string().min(1),
  verdict: ExerciseDedupVerdictSchema,
  /** Model confidence, 0–1. */
  confidence: z.number().min(0).max(1),
  /** One-sentence justification shown next to the candidate. */
  rationale: z.string().min(1).max(400),
});
export type ExerciseDedupSuggestion = z.infer<typeof ExerciseDedupSuggestionSchema>;

/** The model's raw structured output, before the route adds provenance. */
export const ExerciseDedupSuggestionListSchema = z.object({
  suggestions: z.array(ExerciseDedupSuggestionSchema).max(10),
});
export type ExerciseDedupSuggestionList = z.infer<typeof ExerciseDedupSuggestionListSchema>;

export const ExerciseDedupSuggestionsRequestSchema = z.object({
  exerciseId: z.string().min(1).max(512),
});
export type ExerciseDedupSuggestionsRequest = z.infer<
  typeof ExerciseDedupSuggestionsRequestSchema
>;

export const ExerciseDedupSuggestionsResponseSchema = z.object({
  exerciseId: z.string().min(1),
  suggestions: z.array(ExerciseDedupSuggestionSchema).max(10),
  /** Number of canonical candidates that were shortlisted for the model. */
  candidatesConsidered: z.number().int().min(0),
  /** True when no model was reachable and the response is the lexical shortlist only. */
  degraded: z.boolean(),
});
export type ExerciseDedupSuggestionsResponse = z.infer<
  typeof ExerciseDedupSuggestionsResponseSchema
>;
