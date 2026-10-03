/** @ai-context Workouts social API: private accountability and explicit public program snapshots. */
import { z } from 'zod';
import { CardioTargetsSchema } from '../progression/program.js';
import { MuscleGroupSchema } from '../domain/muscles.js';
import { TrainingSessionLogSchema } from '../domain/training-session-log.js';
const id = z.string().min(1).max(200);
export const SocialTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{24,64}$/);
export const CreatorCodeSchema = z.string().trim().toUpperCase().regex(/^[A-Z0-9][A-Z0-9_-]{2,23}$/);
/** Codes that could pass for Hollis staff. The server answers 409 `creator_code_reserved` for these and any HOLLIS* code. */
export const RESERVED_CREATOR_CODES = ['ADMIN', 'SUPPORT', 'OFFICIAL', 'STAFF', 'HELP', 'TEAM', 'COACH', 'HOLLISHEALTH', 'MOD', 'MODERATOR'] as const;
export function isReservedCreatorCode(code: string): boolean { const value = code.trim().toUpperCase(); return value.startsWith('HOLLIS') || (RESERVED_CREATOR_CODES as readonly string[]).includes(value); }
/** `details.reason` on social 409 responses, so clients can show specific copy. */
export const SocialConflictReasonSchema = z.enum(['creator_code_taken', 'creator_code_reserved', 'creator_code_retired', 'creator_code_permanent', 'imported_program']);
export const SocialProfileSchema = z.object({ userId: id, displayName: z.string().trim().min(1).max(40) });
export const SocialProfileBodySchema = SocialProfileSchema.omit({ userId: true });
export const SOCIAL_CHALLENGE_MAX_PARTICIPANTS = 5;
export const SocialChallengeDurationSchema = z.number().int().min(1).max(52);
export const CreateChallengeBodySchema = z.object({
  title: z.string().trim().min(1).max(80), mode: z.enum(['compete', 'together']),
  weeklyTarget: z.number().int().min(1).max(7),
  durationWeeks: SocialChallengeDurationSchema.default(4),
  /** New groups opt in explicitly; absent remains progress-only. */
  shareWorkoutDetails: z.literal(true).optional(),
  timeZone: z.string().max(100).refine(value => { try { new Intl.DateTimeFormat('en', { timeZone: value }); return true; } catch { return false; } }, 'Invalid time zone'),
});
export const SocialWeekSchema = z.object({ week: z.number().int(), completedDays: z.number().int(), target: z.number().int(), percent: z.number() });
export const SocialParticipantSchema = SocialProfileSchema.extend({ weeks: z.array(SocialWeekSchema), weeksMet: z.number().int(), totalPercent: z.number() });
export const EncouragementKindSchema = z.enum(['cheer', 'great_work', 'you_got_this']);
export const EncourageBodySchema = z.object({ toUserId: id, kind: EncouragementKindSchema });
export const SocialEncouragementSchema = EncourageBodySchema.extend({ id, fromUserId: id, createdAt: z.string().datetime() });
export const SocialChallengeSchema = z.object({
  id, title: z.string(), mode: z.enum(['compete', 'together']), weeklyTarget: z.number().int(), timeZone: z.string(),
  durationWeeks: SocialChallengeDurationSchema.default(4),
  maxParticipants: z.literal(SOCIAL_CHALLENGE_MAX_PARTICIPANTS).default(SOCIAL_CHALLENGE_MAX_PARTICIPANTS),
  /** Absent on older groups means workout details were never shared. */
  shareWorkoutDetails: z.boolean().optional(),
  startDate: z.string().nullable(), endDate: z.string().nullable(),
  status: z.enum(['waiting', 'active', 'completed', 'left']), inviteToken: SocialTokenSchema, inviteUrl: z.string().url(),
  participants: z.array(SocialParticipantSchema).max(SOCIAL_CHALLENGE_MAX_PARTICIPANTS), encouragements: z.array(SocialEncouragementSchema),
});
/** open: waiting for group members; active: under way; completed: past endDate; closed: withdrawn (public previews answer 404 for this instead). */
export const ChallengePreviewStateSchema = z.enum(['open', 'active', 'completed', 'closed']);
/** `endDate` is exclusive: the last counted day is the day before it. `available` stays true while open or active and below the five-member capacity. */
export const ChallengePreviewSchema = z.object({ token: SocialTokenSchema, title: z.string(), hostName: z.string(), mode: z.enum(['compete', 'together']), weeklyTarget: z.number().int(), durationWeeks: SocialChallengeDurationSchema.default(4), maxParticipants: z.literal(SOCIAL_CHALLENGE_MAX_PARTICIPANTS).default(SOCIAL_CHALLENGE_MAX_PARTICIPANTS), participantCount: z.number().int().min(1).max(SOCIAL_CHALLENGE_MAX_PARTICIPANTS).default(1), shareWorkoutDetails: z.boolean().optional(), timeZone: z.string(), available: z.boolean(), state: ChallengePreviewStateSchema, endDate: z.string().nullable().default(null) });
/** Workout fields deliberately exclude readiness answers, gym location and private AI notes. */
export const SocialWorkoutSchema = TrainingSessionLogSchema.omit({ questionnaire: true, gymProfileId: true, aiOutlierLabel: true, healthSyncedAt: true });
/** Private group-member detail; authorized only while the viewer shares a non-withdrawn challenge. */
export const SocialMemberStatsSchema = SocialProfileSchema.extend({
  /** Member account gender selects their body SVG; optional for older servers. */
  gender: z.enum(['male', 'female']).optional(),
  latestWorkout: SocialWorkoutSchema.nullable(),
  exerciseNames: z.record(z.string(), z.string()).default({}),
  /** Last seven calendar days, including today, in the challenge time zone. */
  weeklyConsistency: z.object({
    completedDays: z.number().int().min(0).max(7),
    workoutCount: z.number().int().min(0),
    target: z.number().int().min(1).max(7),
    percent: z.number().finite().min(0),
  }),
  /** Completed working-set volume in kg and set counts over the same seven-day period. */
  muscleVolumes: z.array(z.object({ muscleGroup: MuscleGroupSchema, volumeKg: z.number().finite().min(0), setCount: z.number().int().min(0) })),
});
export const SharedExercisePreviewSchema = z.object({ name: z.string(), sets: z.number().int(), reps: z.number().int().nullable(), durationSeconds: z.number().nullable(), prescriptionSets: z.array(z.object({ reps: z.number().int().nullable(), durationSeconds: z.number().nullable() })).optional(), restSeconds: z.number().nullable().optional(), tempo: z.string().nullable().optional(), cardioDurationSeconds: z.number().nullable().optional(), cardioTargets: CardioTargetsSchema.nullable().optional() });
export const SharedProgramSchema = z.object({
  token: SocialTokenSchema, url: z.string().url(), imageUrl: z.string().url(), name: z.string(), description: z.string(), durationWeeks: z.number().int(),
  creatorName: z.string(), creatorCode: z.string().nullable(), days: z.array(z.object({ name: z.string(), exercises: z.array(SharedExercisePreviewSchema) })),
  createdAt: z.string().datetime(), revokedAt: z.string().datetime().nullable(), importCount: z.number().int(), viewCount: z.number().int(),
  /** Owner serialization only: the source program this link was published from. */
  programId: id.optional(),
});
export const PublishProgramBodySchema = z.object({ programId: id, creatorCode: CreatorCodeSchema.optional() });
export const CreatorProfileBodySchema = z.object({ code: CreatorCodeSchema, displayName: z.string().trim().min(1).max(60) });
export const CreatorProfileSchema = CreatorProfileBodySchema.extend({ imports: z.number().int(), attributedUsers: z.number().int(), activatedUsers: z.number().int(), retainedUsers: z.number().int() });
export const CreatorAttributionBodySchema = z.object({ code: CreatorCodeSchema });
export const CreatorCatalogSchema = z.object({ code: z.string(), displayName: z.string(), programs: z.array(SharedProgramSchema) });
/** People the viewer blocked. Unblocking does not restore the friendship. */
export const SocialBlockedUserSchema = z.object({ userId: id, displayName: z.string() });
/** Programs the viewer saved from another member's link; these cannot be republished (409 `imported_program`). */
export const SocialProgramImportSummarySchema = z.object({ token: SocialTokenSchema, programId: id, creatorName: z.string() });
export const SocialDashboardSchema = z.object({ profile: SocialProfileSchema.nullable(), friends: z.array(SocialProfileSchema), challenges: z.array(SocialChallengeSchema), sharedPrograms: z.array(SharedProgramSchema), creator: CreatorProfileSchema.nullable(), blocked: z.array(SocialBlockedUserSchema).default([]), imports: z.array(SocialProgramImportSummarySchema).optional() });
/** HTML/SVG public documents are rendered only from validated public DTOs. */
export const WorkoutsPublicDocumentSchema = z.string().min(1);
export const SocialAckSchema = z.object({ success: z.literal(true) });
export const ImportSharedProgramSchema = z.object({ programId: id });
export const WORKOUTS_SOCIAL_ROUTES = {
  dashboard: '/v1/social', profile: '/v1/social/profile', challenges: '/v1/social/challenges',
  challenge: (value: string) => `/v1/social/challenges/${encodeURIComponent(value)}`,
  memberStats: (challengeId: string, memberUserId: string) => `/v1/social/challenges/${encodeURIComponent(challengeId)}/members/${encodeURIComponent(memberUserId)}`,
  joinChallenge: (token: string) => `/v1/social/challenges/join/${encodeURIComponent(token)}`,
  leaveChallenge: (value: string) => `/v1/social/challenges/${encodeURIComponent(value)}/leave`,
  /** Completed challenges only: removes it from the caller's dashboard without touching the partner's. */
  hideChallenge: (value: string) => `/v1/social/challenges/${encodeURIComponent(value)}/hide`,
  encourage: (value: string) => `/v1/social/challenges/${encodeURIComponent(value)}/encourage`,
  friend: (value: string) => `/v1/social/friends/${encodeURIComponent(value)}`,
  block: (value: string) => `/v1/social/blocks/${encodeURIComponent(value)}`,
  /** DELETE; same path as `block`. */
  unblock: (value: string) => `/v1/social/blocks/${encodeURIComponent(value)}`,
  programs: '/v1/social/programs', revokeProgram: (token: string) => `/v1/social/programs/${encodeURIComponent(token)}`,
  importProgram: (token: string) => `/v1/social/programs/${encodeURIComponent(token)}/import`,
  creatorCatalog: (code: string) => `/share/creator/${encodeURIComponent(code)}/data`,
  creator: '/v1/social/creator', attribution: '/v1/social/attribution',
  programPreview: (token: string) => `/share/program/${encodeURIComponent(token)}/data`,
  challengePreview: (token: string) => `/share/challenge/${encodeURIComponent(token)}/data`,
} as const;
export type SocialProfile = z.infer<typeof SocialProfileSchema>;
export type SocialProfileBody = z.infer<typeof SocialProfileBodySchema>;
export type CreateChallengeBody = z.infer<typeof CreateChallengeBodySchema>;
export type SocialWeek = z.infer<typeof SocialWeekSchema>;
export type SocialParticipant = z.infer<typeof SocialParticipantSchema>;
export type SocialWorkout = z.infer<typeof SocialWorkoutSchema>;
export type SocialMemberStats = z.infer<typeof SocialMemberStatsSchema>;
export type SocialChallenge = z.infer<typeof SocialChallengeSchema>;
export type ChallengePreview = z.infer<typeof ChallengePreviewSchema>;
export type ChallengePreviewState = z.infer<typeof ChallengePreviewStateSchema>;
export type SocialBlockedUser = z.infer<typeof SocialBlockedUserSchema>;
export type SocialProgramImportSummary = z.infer<typeof SocialProgramImportSummarySchema>;
export type SocialConflictReason = z.infer<typeof SocialConflictReasonSchema>;
export type EncourageBody = z.infer<typeof EncourageBodySchema>;
export type SharedProgram = z.infer<typeof SharedProgramSchema>;
export type PublishProgramBody = z.infer<typeof PublishProgramBodySchema>;
export type CreatorProfileBody = z.infer<typeof CreatorProfileBodySchema>;
export type CreatorProfile = z.infer<typeof CreatorProfileSchema>;
export type SocialDashboard = z.infer<typeof SocialDashboardSchema>;
export type CreatorCatalog = z.infer<typeof CreatorCatalogSchema>;
