/**
 * @ai-context Access-token claims contract (alpha.91, hollis-workouts#185, #130)
 *
 * jsonwebtoken checks `exp` only when present, and auth-client trusts this schema for the
 * rest, so an optional `exp` meant a correctly signed token without one never expired.
 */

import { AccessTokenClaimsSchema } from '../domain/auth-tokens';

const identityAccessToken = {
  sub: 'user_123',
  userId: 'user_123',
  type: 'access' as const,
  jti: 'jti_123',
  aud: ['hollis-workouts' as const],
  iat: 1_758_000_000,
  exp: 1_765_776_000,
};

describe('AccessTokenClaimsSchema', () => {
  it('accepts the claims Identity signs', () => {
    expect(AccessTokenClaimsSchema.parse(identityAccessToken)).toEqual(identityAccessToken);
  });

  it('rejects a token without exp', () => {
    expect(AccessTokenClaimsSchema.safeParse({ ...identityAccessToken, exp: undefined }).success).toBe(false);
  });

  it('rejects a token without iat', () => {
    expect(AccessTokenClaimsSchema.safeParse({ ...identityAccessToken, iat: undefined }).success).toBe(false);
  });

  it('rejects a non-numeric exp', () => {
    expect(AccessTokenClaimsSchema.safeParse({ ...identityAccessToken, exp: '1765776000' }).success).toBe(false);
  });

  it('accepts the email claims Identity signs (#130)', () => {
    const claims = { ...identityAccessToken, email: 'isaac@example.com', email_verified: true };
    expect(AccessTokenClaimsSchema.parse(claims)).toEqual(claims);
  });

  it('keeps email claims optional for tokens issued before #130', () => {
    const parsed = AccessTokenClaimsSchema.parse(identityAccessToken);
    expect(parsed.email).toBeUndefined();
    expect(parsed.email_verified).toBeUndefined();
  });

  it('rejects a malformed email claim', () => {
    expect(AccessTokenClaimsSchema.safeParse({ ...identityAccessToken, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects a non-boolean email_verified claim', () => {
    expect(AccessTokenClaimsSchema.safeParse({ ...identityAccessToken, email_verified: 'true' }).success).toBe(false);
  });
});
