/** @ai-context Workouts social API: private accountability and explicit public program snapshots. */
import { z } from 'zod';
import { CardioTargetsSchema } from '../progression/program.js';
const id = z.string().min(1).max(200);
export const SocialTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{24,64}$/);
export const CreatorCodeSchema = z.string().trim().toUpperCase().regex(/^[A-Z0-9][A-Z0-9_-]{2,23}$/);
export const SocialProfileSchema = z.object({ userId: id, displayName: z.string().trim().min(1).max(40) });
export const SocialProfileBodySchema = SocialProfileSchema.omit({ userId: true });
export const CreateChallengeBodySchema = z.object({
  title: z.string().trim().min(1).max(80), mode: z.enum(['compete', 'together']),
  weeklyTarget: z.number().int().min(1).max(7),
  timeZone: z.string().max(100).refine(value => { try { new Intl.DateTimeFormat('en', { timeZone: value }); return true; } catch { return false; } }, 'Invalid time zone'),
});
export const SocialWeekSchema = z.object({ week: z.number().int(), completedDays: z.number().int(), target: z.number().int(), percent: z.number() });
export const SocialParticipantSchema = SocialProfileSchema.extend({ weeks: z.array(SocialWeekSchema), weeksMet: z.number().int(), totalPercent: z.number() });
export const EncouragementKindSchema = z.enum(['cheer', 'great_work', 'you_got_this']);
export const EncourageBodySchema = z.object({ toUserId: id, kind: EncouragementKindSchema });
export const SocialEncouragementSchema = EncourageBodySchema.extend({ id, fromUserId: id, createdAt: z.string().datetime() });
export const SocialChallengeSchema = z.object({
  id, title: z.string(), mode: z.enum(['compete', 'together']), weeklyTarget: z.number().int(), timeZone: z.string(),
  startDate: z.string().nullable(), endDate: z.string().nullable(),
  status: z.enum(['waiting', 'active', 'completed', 'left']), inviteToken: SocialTokenSchema, inviteUrl: z.string().url(),
  participants: z.array(SocialParticipantSchema), encouragements: z.array(SocialEncouragementSchema),
});
export const ChallengePreviewSchema = z.object({ token: SocialTokenSchema, title: z.string(), hostName: z.string(), mode: z.enum(['compete', 'together']), weeklyTarget: z.number().int(), timeZone: z.string(), available: z.boolean() });
export const SharedExercisePreviewSchema = z.object({ name: z.string(), sets: z.number().int(), reps: z.number().int().nullable(), durationSeconds: z.number().nullable(), prescriptionSets: z.array(z.object({ reps: z.number().int().nullable(), durationSeconds: z.number().nullable() })).optional(), restSeconds: z.number().nullable().optional(), tempo: z.string().nullable().optional(), cardioDurationSeconds: z.number().nullable().optional(), cardioTargets: CardioTargetsSchema.nullable().optional() });
export const SharedProgramSchema = z.object({
  token: SocialTokenSchema, url: z.string().url(), imageUrl: z.string().url(), name: z.string(), description: z.string(), durationWeeks: z.number().int(),
  creatorName: z.string(), creatorCode: z.string().nullable(), days: z.array(z.object({ name: z.string(), exercises: z.array(SharedExercisePreviewSchema) })),
  createdAt: z.string().datetime(), revokedAt: z.string().datetime().nullable(), importCount: z.number().int(), viewCount: z.number().int(),
});
export const PublishProgramBodySchema = z.object({ programId: id, creatorCode: CreatorCodeSchema.optional() });
export const CreatorProfileBodySchema = z.object({ code: CreatorCodeSchema, displayName: z.string().trim().min(1).max(60) });
export const CreatorProfileSchema = CreatorProfileBodySchema.extend({ imports: z.number().int(), attributedUsers: z.number().int(), activatedUsers: z.number().int(), retainedUsers: z.number().int() });
export const CreatorAttributionBodySchema = z.object({ code: CreatorCodeSchema });
export const CreatorCatalogSchema = z.object({ code: z.string(), displayName: z.string(), programs: z.array(SharedProgramSchema) });
export const SocialDashboardSchema = z.object({ profile: SocialProfileSchema.nullable(), friends: z.array(SocialProfileSchema), challenges: z.array(SocialChallengeSchema), sharedPrograms: z.array(SharedProgramSchema), creator: CreatorProfileSchema.nullable() });
/** HTML/SVG public documents are rendered only from validated public DTOs. */
export const WorkoutsPublicDocumentSchema = z.string().min(1);
export const SocialAckSchema = z.object({ success: z.literal(true) });
export const ImportSharedProgramSchema = z.object({ programId: id });
export const WORKOUTS_SOCIAL_ROUTES = {
  dashboard: '/v1/social', profile: '/v1/social/profile', challenges: '/v1/social/challenges',
  challenge: (value: string) => `/v1/social/challenges/${encodeURIComponent(value)}`,
  joinChallenge: (token: string) => `/v1/social/challenges/join/${encodeURIComponent(token)}`,
  leaveChallenge: (value: string) => `/v1/social/challenges/${encodeURIComponent(value)}/leave`,
  encourage: (value: string) => `/v1/social/challenges/${encodeURIComponent(value)}/encourage`,
  friend: (value: string) => `/v1/social/friends/${encodeURIComponent(value)}`,
  block: (value: string) => `/v1/social/blocks/${encodeURIComponent(value)}`,
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
export type SocialChallenge = z.infer<typeof SocialChallengeSchema>;
export type ChallengePreview = z.infer<typeof ChallengePreviewSchema>;
export type EncourageBody = z.infer<typeof EncourageBodySchema>;
export type SharedProgram = z.infer<typeof SharedProgramSchema>;
export type PublishProgramBody = z.infer<typeof PublishProgramBodySchema>;
export type CreatorProfileBody = z.infer<typeof CreatorProfileBodySchema>;
export type CreatorProfile = z.infer<typeof CreatorProfileSchema>;
export type SocialDashboard = z.infer<typeof SocialDashboardSchema>;
export type CreatorCatalog = z.infer<typeof CreatorCatalogSchema>;
