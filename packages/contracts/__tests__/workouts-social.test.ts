import { CreateChallengeBodySchema, CreatorCodeSchema, SocialProfileBodySchema, SocialTokenSchema, WORKOUTS_SOCIAL_ROUTES } from '../api/workouts.js';
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
});
