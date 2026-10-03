import { AvatarUploadBodySchema, AvatarResponseSchema, AVATAR_MAX_BYTES, WORKOUTS_AVATAR_ROUTES } from '../api/workouts.js';

describe('avatar wire contracts', () => {
  it('accepts bounded base64 and rejects URL, ownership injection and oversized content', () => {
    expect(AvatarUploadBodySchema.safeParse({ imageBase64: 'YWJjZA==' }).success).toBe(true);
    for (const body of [
      { imageBase64: 'https://internal/image' },
      { imageBase64: 'YWJjZA==', userId: 'victim' },
      { imageBase64: 'A'.repeat(4 * Math.ceil(AVATAR_MAX_BYTES / 3) + 4) },
      { imageBase64: 'a===' },
    ]) expect(AvatarUploadBodySchema.safeParse(body).success).toBe(false);
  });
  it('accepts absence and allows only JPEG output', () => {
    expect(AvatarResponseSchema.parse({ avatar: null })).toEqual({ avatar: null });
    expect(AvatarResponseSchema.safeParse({ avatar: { imageBase64: 'YWJjZA==', mimeType: 'image/svg+xml', version: '1' } }).success).toBe(false);
  });
  it('encodes all member route parameters', () => {
    expect(WORKOUTS_AVATAR_ROUTES.member('a/b', 'c?d')).toBe('/v1/social/challenges/a%2Fb/members/c%3Fd/avatar');
  });
});
