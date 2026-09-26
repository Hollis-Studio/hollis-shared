/**
 * @ai-context One AUTH_ROUTES object, Identity paths, and auth ROUTE_METADATA
 * (alpha.91, hollis-workouts#178/#223/#246)
 */

import { API_ROUTES, AUTH_ROUTES, ROUTE_METADATA } from '../api';
import { AUTH_ROUTES as SUBPATH_AUTH_ROUTES } from '../api/routes/auth';
import { ROUTE_METADATA as MODULAR_ROUTE_METADATA } from '../api/routes/index';

describe('AUTH_ROUTES', () => {
  it('is one object behind every entry point (the copies drifted before)', () => {
    expect(AUTH_ROUTES).toBe(SUBPATH_AUTH_ROUTES);
    expect(API_ROUTES.AUTH).toBe(SUBPATH_AUTH_ROUTES);
  });

  it('names the Identity routes by the paths Identity mounts', () => {
    expect(AUTH_ROUTES.REGISTER).toBe('/auth/register');
    expect(AUTH_ROUTES.ME).toBe('/auth/me');
    expect(AUTH_ROUTES.LOGOUT).toBe('/auth/logout');
    expect(AUTH_ROUTES.ONBOARDING_RESET).toBe('/auth/onboarding/reset');
    expect(AUTH_ROUTES.ACCOUNT_DELETION_AUTHORIZATION).toBe('/auth/account/deletion-authorization');
    expect(AUTH_ROUTES.ACCOUNT).toBe('/auth/account');
  });

  it('keeps SIGNUP on the Health server barcode route', () => {
    expect(AUTH_ROUTES.SIGNUP).toBe('/auth/signup');
  });
});

describe.each([
  ['api ROUTE_METADATA', ROUTE_METADATA],
  ['modular ROUTE_METADATA', MODULAR_ROUTE_METADATA],
])('%s', (_label, metadata) => {
  it('does not require a Bearer on logout (tokens travel in the body)', () => {
    expect(metadata[AUTH_ROUTES.LOGOUT]).toEqual({
      method: 'POST',
      description: 'Sign out current session',
      requiresAuth: false,
    });
  });

  it('describes the Identity account routes', () => {
    expect(metadata[AUTH_ROUTES.REGISTER]).toMatchObject({ method: 'POST', requiresAuth: false });
    expect(metadata[AUTH_ROUTES.ME]).toMatchObject({ method: 'GET', requiresAuth: true });
    expect(metadata[AUTH_ROUTES.ONBOARDING_RESET]).toMatchObject({ method: 'POST', requiresAuth: true });
    expect(metadata[AUTH_ROUTES.ACCOUNT_DELETION_AUTHORIZATION]).toMatchObject({
      method: 'POST',
      requiresAuth: true,
    });
    expect(metadata[AUTH_ROUTES.ACCOUNT]).toMatchObject({ method: 'DELETE', requiresAuth: true });
  });
});
