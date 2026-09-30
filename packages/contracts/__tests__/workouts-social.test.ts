import { ChallengePreviewSchema, CreateChallengeBodySchema, CreatorCodeSchema, SocialDashboardSchema, SocialChallengeSchema, SocialMemberStatsSchema, SocialWorkoutSchema, SocialProfileBodySchema, SocialTokenSchema, WORKOUTS_SOCIAL_ROUTES, isReservedCreatorCode } from '../api/workouts.js';
describe('Workouts social contracts', () => {
  it('validates calendar timezone and immutable weekly goal inputs', () => {
    expect(CreateChallengeBodySchema.parse({ title: 'Team', mode: 'together', weeklyTarget: 3, timeZone: 'America/Chicago' }).weeklyTarget).toBe(3);
    expect(CreateChallengeBodySchema.safeParse({ title: 'Team', mode: 'together', weeklyTarget: 0, timeZone: 'UTC' }).success).toBe(false);
    expect(CreateChallengeBodySchema.safeParse({ title: 'Team', mode: 'together', weeklyTarget: 3, timeZone: 'invalid' }).success).toBe(false);
  });
  it('defaults legacy durations and bounds custom durations to whole weeks', () => {
    const body = { title: 'Team', mode: 'together', weeklyTarget: 3, timeZone: 'UTC' };
    expect(CreateChallengeBodySchema.parse(body).durationWeeks).toBe(4);
    for (const durationWeeks of [1, 12, 52]) expect(CreateChallengeBodySchema.parse({ ...body, durationWeeks }).durationWeeks).toBe(durationWeeks);
    for (const durationWeeks of [0, 53, 1.5]) expect(CreateChallengeBodySchema.safeParse({ ...body, durationWeeks }).success).toBe(false);
  });
  it('preserves legacy progress-only consent and requires an explicit true opt-in', () => {
    const body = { title: 'Team', mode: 'together', weeklyTarget: 3, timeZone: 'UTC' };
    expect(CreateChallengeBodySchema.parse(body).shareWorkoutDetails).toBeUndefined();
    expect(CreateChallengeBodySchema.parse({ ...body, shareWorkoutDetails: true }).shareWorkoutDetails).toBe(true);
    expect(CreateChallengeBodySchema.safeParse({ ...body, shareWorkoutDetails: false }).success).toBe(false);
    const preview = { token: 'a'.repeat(24), title: 'Team', hostName: 'Alex', mode: 'together', weeklyTarget: 3, timeZone: 'UTC', state: 'open', available: true };
    expect(ChallengePreviewSchema.parse(preview).shareWorkoutDetails).toBeUndefined();
    expect(ChallengePreviewSchema.parse({ ...preview, shareWorkoutDetails: false }).shareWorkoutDetails).toBe(false);
    expect(ChallengePreviewSchema.parse({ ...preview, shareWorkoutDetails: true }).shareWorkoutDetails).toBe(true);
  });
  it('limits the full group to five participants', () => {
    const participant = { userId: 'u1', displayName: 'Alex', weeks: [], weeksMet: 0, totalPercent: 0 };
    const challenge = { id: 'c1', title: 'Team', mode: 'together', weeklyTarget: 3, timeZone: 'UTC', startDate: null, endDate: null, status: 'waiting', inviteToken: 'a'.repeat(24), inviteUrl: 'https://example.com/invite', encouragements: [] };
    expect(SocialChallengeSchema.parse({ ...challenge, participants: Array(5).fill(participant) }).durationWeeks).toBe(4);
    expect(SocialChallengeSchema.safeParse({ ...challenge, participants: Array(6).fill(participant) }).success).toBe(false);
  });
  it('validates private member analytics and encodes both identifiers', () => {
    const stats = { userId: 'u1', displayName: 'Alex', latestWorkout: null, weeklyConsistency: { completedDays: 3, workoutCount: 4, target: 3, percent: 100 }, muscleVolumes: [{ muscleGroup: 'chest', volumeKg: 2000, setCount: 8 }] };
    expect(SocialMemberStatsSchema.parse(stats).exerciseNames).toEqual({});
    expect(SocialMemberStatsSchema.safeParse({ ...stats, muscleVolumes: [{ muscleGroup: 'chest', volumeKg: -1, setCount: 8 }] }).success).toBe(false);
    expect(SocialMemberStatsSchema.safeParse({ ...stats, weeklyConsistency: { ...stats.weeklyConsistency, completedDays: 8 } }).success).toBe(false);
    expect(WORKOUTS_SOCIAL_ROUTES.memberStats('c/1', 'u/2')).toBe('/v1/social/challenges/c%2F1/members/u%2F2');
  });
  it('keeps readiness, gym and private AI fields outside shared workout details', () => {
    for (const field of ['questionnaire', 'gymProfileId', 'aiOutlierLabel', 'healthSyncedAt']) {
      expect(Object.keys(SocialWorkoutSchema.shape)).not.toContain(field);
    }
    expect(Object.keys(SocialWorkoutSchema.shape)).toContain('exercises');
  });
  it('normalizes creator codes and strips injected ownership', () => {
    expect(CreatorCodeSchema.parse(' coach_1 ')).toBe('COACH_1');
    expect(SocialProfileBodySchema.parse({ displayName: 'Alex', userId: 'victim' })).toEqual({ displayName: 'Alex' });
  });
  it('rejects path input and encodes URL parameters', () => {
    expect(SocialTokenSchema.safeParse('../secret').success).toBe(false);
    expect(WORKOUTS_SOCIAL_ROUTES.challenge('a/b')).toBe('/v1/social/challenges/a%2Fb');
  });
  it('flags staff-looking creator codes as reserved', () => {
    expect(isReservedCreatorCode('hollis_fit')).toBe(true);
    expect(isReservedCreatorCode(' Support ')).toBe(true);
    expect(isReservedCreatorCode('MODERATOR')).toBe(true);
    expect(isReservedCreatorCode('COACHJANE')).toBe(false);
  });
  it('carries challenge preview state and the blocked list', () => {
    const preview = { token: 'a'.repeat(24), title: 'Fall', hostName: 'Avery', mode: 'together', weeklyTarget: 3, timeZone: 'UTC', available: false };
    expect(ChallengePreviewSchema.safeParse(preview).success).toBe(false);
    expect(ChallengePreviewSchema.parse({ ...preview, state: 'completed', endDate: '2026-10-12' }).state).toBe('completed');
    expect(ChallengePreviewSchema.parse({ ...preview, available: true, state: 'open' }).endDate).toBeNull();
    expect(SocialDashboardSchema.parse({ profile: null, friends: [], challenges: [], sharedPrograms: [], creator: null }).blocked).toEqual([]);
    expect(WORKOUTS_SOCIAL_ROUTES.hideChallenge('c1')).toBe('/v1/social/challenges/c1/hide');
    expect(WORKOUTS_SOCIAL_ROUTES.unblock('u1')).toBe('/v1/social/blocks/u1');
    expect(WORKOUTS_SOCIAL_ROUTES.unblock('u1')).toBe(WORKOUTS_SOCIAL_ROUTES.block('u1'));
  });
});
