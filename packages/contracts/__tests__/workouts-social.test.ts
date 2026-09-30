import { ChallengePreviewSchema, CreateChallengeBodySchema, CreatorCodeSchema, SocialDashboardSchema, SocialProfileBodySchema, SocialTokenSchema, WORKOUTS_SOCIAL_ROUTES, isReservedCreatorCode } from '../api/workouts.js';
describe('Workouts social contracts', () => {
  it('validates calendar timezone and immutable weekly goal inputs', () => {
    expect(CreateChallengeBodySchema.parse({ title: 'Team', mode: 'together', weeklyTarget: 3, timeZone: 'America/Chicago' }).weeklyTarget).toBe(3);
    expect(CreateChallengeBodySchema.safeParse({ title: 'Team', mode: 'together', weeklyTarget: 0, timeZone: 'UTC' }).success).toBe(false);
    expect(CreateChallengeBodySchema.safeParse({ title: 'Team', mode: 'together', weeklyTarget: 3, timeZone: 'invalid' }).success).toBe(false);
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
    expect(ChallengePreviewSchema.parse({ ...preview, state: 'open' }).endDate).toBeNull();
    expect(SocialDashboardSchema.parse({ profile: null, friends: [], challenges: [], sharedPrograms: [], creator: null }).blocked).toEqual([]);
    expect(WORKOUTS_SOCIAL_ROUTES.hideChallenge('c1')).toBe('/v1/social/challenges/c1/hide');
    expect(WORKOUTS_SOCIAL_ROUTES.unblock('u1')).toBe(WORKOUTS_SOCIAL_ROUTES.block('u1'));
  });
});
