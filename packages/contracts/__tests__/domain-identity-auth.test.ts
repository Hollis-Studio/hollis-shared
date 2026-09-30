/**
 * @ai-context Hollis Identity GET /auth/me + POST /auth/logout wire (alpha.91,
 * hollis-workouts#246/#129/#223), forgot/reset password wire (alpha.96)
 */

import {
  IDENTITY_ACCOUNT_PROVIDERS,
  IdentityForgotPasswordRequestSchema,
  IdentityLogoutRequestSchema,
  IdentityLogoutResponseSchema,
  IdentityMeResponseSchema,
  IdentityResetPasswordRequestSchema,
  IdentityResetPasswordResponseSchema,
} from '../domain/identity-auth';

const me = {
  userId: 'user_123',
  email: 'sam@example.com',
  displayName: 'Sam',
  role: 'CLIENT' as const,
  organizationId: null,
  emailVerified: true,
  provider: 'password' as const,
  onboardingResetAt: null,
  createdAt: '2026-01-02T03:04:05.000Z',
  updatedAt: '2026-09-25T10:00:00.000Z',
};

describe('IdentityMeResponseSchema', () => {
  it('accepts the /me body Identity sends', () => {
    expect(IdentityMeResponseSchema.parse(me)).toEqual(me);
  });

  it.each(IDENTITY_ACCOUNT_PROVIDERS)('accepts provider %s', (provider) => {
    expect(IdentityMeResponseSchema.parse({ ...me, provider }).provider).toBe(provider);
  });

  it('rejects the pre-alpha.91 Identity body (no provider, no displayName)', () => {
    // The Workouts client falls back to cached auth on this failure, so Identity must
    // ship the two fields before a client that parses /me does.
    const { provider: _provider, displayName: _displayName, ...legacy } = me;
    expect(IdentityMeResponseSchema.safeParse(legacy).success).toBe(false);
  });

  it('rejects an unknown provider', () => {
    expect(IdentityMeResponseSchema.safeParse({ ...me, provider: 'facebook' }).success).toBe(false);
  });

  it('accepts a pending onboarding reset and an organization', () => {
    const parsed = IdentityMeResponseSchema.parse({
      ...me,
      onboardingResetAt: '2026-09-20T12:00:00.000Z',
      organizationId: 'org_1',
    });
    expect(parsed.onboardingResetAt).toBe('2026-09-20T12:00:00.000Z');
  });

  it('strips fields it does not know, so Identity can add one without breaking clients', () => {
    expect(IdentityMeResponseSchema.parse({ ...me, linkedProviders: ['google'] })).toEqual(me);
  });
});

describe('IdentityLogout wire', () => {
  it('accepts an empty body and either token', () => {
    expect(IdentityLogoutRequestSchema.parse({})).toEqual({});
    expect(IdentityLogoutRequestSchema.parse({ refreshToken: 'r', accessToken: 'a' })).toEqual({
      refreshToken: 'r',
      accessToken: 'a',
    });
  });

  it('acknowledges with ok: true', () => {
    expect(IdentityLogoutResponseSchema.parse({ ok: true })).toEqual({ ok: true });
    expect(IdentityLogoutResponseSchema.safeParse({ ok: false }).success).toBe(false);
  });
});

describe('IdentityForgotPasswordRequestSchema', () => {
  it('accepts an e-mail alone, as Hollis Health sends it', () => {
    expect(IdentityForgotPasswordRequestSchema.parse({ email: 'sam@example.com' })).toEqual({
      email: 'sam@example.com',
    });
  });

  it('accepts and trims a source app', () => {
    expect(
      IdentityForgotPasswordRequestSchema.parse({ email: 'sam@example.com', sourceApp: ' workouts ' })
        .sourceApp,
    ).toBe('workouts');
  });

  it('rejects a blank or oversized source app and a malformed e-mail', () => {
    expect(
      IdentityForgotPasswordRequestSchema.safeParse({ email: 'sam@example.com', sourceApp: ' ' })
        .success,
    ).toBe(false);
    expect(
      IdentityForgotPasswordRequestSchema.safeParse({
        email: 'sam@example.com',
        sourceApp: 'x'.repeat(65),
      }).success,
    ).toBe(false);
    expect(IdentityForgotPasswordRequestSchema.safeParse({ email: 'not-an-email' }).success).toBe(
      false,
    );
  });
});

describe('IdentityResetPassword wire', () => {
  const token = 'a'.repeat(43);

  it('accepts a token and a policy-length password', () => {
    expect(
      IdentityResetPasswordRequestSchema.parse({ token, newPassword: 'correct horse battery' }),
    ).toEqual({ token, newPassword: 'correct horse battery' });
  });

  it('rejects a token outside 20..512 characters and a short password', () => {
    const parse = (body: unknown) => IdentityResetPasswordRequestSchema.safeParse(body).success;
    expect(parse({ token: 'a'.repeat(19), newPassword: 'correct horse battery' })).toBe(false);
    expect(parse({ token: 'a'.repeat(513), newPassword: 'correct horse battery' })).toBe(false);
    expect(parse({ token, newPassword: 'short' })).toBe(false);
  });

  it('acknowledges with ok: true and the account e-mail', () => {
    const ack = { ok: true, email: 'sam@example.com' };
    expect(IdentityResetPasswordResponseSchema.parse(ack)).toEqual(ack);
    expect(IdentityResetPasswordResponseSchema.safeParse({ ok: true }).success).toBe(false);
  });
});
