/**
 * @ai-context API Routes Barrel | re-exports all route definitions
 *
 * This barrel file provides backward compatibility by re-exporting all
 * domain-specific route files. Import from here or from the specific
 * domain file as needed.
 *
 * deps: ./routes/* | consumers: src/services/*, web-admin/services/*, server/src/*
 */

// Imports for aggregated API_ROUTES object
import { ADMIN_ROUTE_METADATA, ADMIN_ROUTES, CRM_ROUTES, DOCUMENTS_ROUTES, UPLOAD_ROUTES } from './admin';
import { APPOINTMENTS_ROUTES, PROVIDERS_ROUTES } from './appointments';
import { AUTH_ROUTES } from './auth';
import { BIOMETRICS_ROUTES } from './biometrics';
import { LABS_ROUTES } from './labs';
import { MESSAGES_ROUTES, PUSH_ROUTES, SSE_ROUTES } from './messaging';
import { ASSIGNMENT_ROUTES, MFA_ROUTES } from './mfa';
import { NUTRITION_ROUTES } from './nutrition';
import { DAILY_METRICS_ROUTES, DAILY_SUMMARY_ROUTES, JOURNAL_ROUTES, SESSIONS_ROUTES, USER_ROUTES } from './users';
import { PLANS_ROUTES, STRATEGIES_ROUTES } from './workouts';

import type { RouteMetadata } from './types';

// Type definitions
export * from './types';

// Domain-specific routes
export * from './admin';
export * from './ai';
export * from './appointments';
export * from './auth';
export * from './biometrics';
export * from './labs';
export * from './messaging';
export * from './mfa';
export * from './nutrition';
export * from './users';
export * from './workouts';

// Utility functions
export * from './utils';

// ============================================================================
// AGGREGATED API ROUTES
// ============================================================================

/**
 * Complete API routes registry.
 * Use this for centralized access to all route definitions.
 *
 * @example
 * ```ts
 * import { API_ROUTES } from '@hollis/contracts/api';
 *
 * // Static route
 * await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);
 *
 * // Dynamic route
 * await apiClient.get(API_ROUTES.USERS.get(userId));
 * ```
 */
export const API_ROUTES = {
  AUTH: AUTH_ROUTES,
  USERS: USER_ROUTES,
  DAILY_METRICS: DAILY_METRICS_ROUTES,
  DAILY_SUMMARY: DAILY_SUMMARY_ROUTES,
  BIOMETRICS: BIOMETRICS_ROUTES,
  JOURNAL: JOURNAL_ROUTES,
  NUTRITION: NUTRITION_ROUTES,
  PLANS: PLANS_ROUTES,
  STRATEGIES: STRATEGIES_ROUTES,
  APPOINTMENTS: APPOINTMENTS_ROUTES,
  LABS: LABS_ROUTES,
  MESSAGES: MESSAGES_ROUTES,
  UPLOAD: UPLOAD_ROUTES,
  ADMIN: ADMIN_ROUTES,
  CRM: CRM_ROUTES,
  SESSIONS: SESSIONS_ROUTES,
  PROVIDERS: PROVIDERS_ROUTES,
  DOCUMENTS: DOCUMENTS_ROUTES,
  PUSH: PUSH_ROUTES,
  SSE: SSE_ROUTES,
  MFA: MFA_ROUTES,
  ASSIGNMENTS: ASSIGNMENT_ROUTES,
} as const;

// ============================================================================
// ROUTE METADATA (for documentation/validation)
// ============================================================================

/**
 * Route metadata registry for documentation and validation.
 * Maps route paths to their metadata.
 *
 * Note: This is primarily for documentation purposes and can be used
 * by the server to validate route definitions match expected patterns.
 */
export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  // Auth routes
  [AUTH_ROUTES.LOGIN]: {
    method: 'POST',
    description: 'Authenticate user with email/password',
    requiresAuth: false,
  },
  [AUTH_ROUTES.SIGNUP]: {
    method: 'POST',
    description: 'Create new user account with password',
    requiresAuth: false,
  },
  [AUTH_ROUTES.REFRESH]: {
    method: 'POST',
    description: 'Refresh access token using refresh token',
    requiresAuth: false,
  },
  [AUTH_ROUTES.LINK]: {
    method: 'POST',
    description: 'Link OAuth credentials to existing account',
    requiresAuth: true,
  },
  [AUTH_ROUTES.LOGOUT]: {
    method: 'POST',
    description: 'Sign out current session',
    requiresAuth: true,
  },
  [AUTH_ROUTES.FORGOT_PASSWORD]: {
    method: 'POST',
    description: 'Request password reset email (rate limited)',
    requiresAuth: false,
  },
  [AUTH_ROUTES.RESET_PASSWORD]: {
    method: 'POST',
    description: 'Reset password using token from email',
    requiresAuth: false,
  },
  [AUTH_ROUTES.CHANGE_PASSWORD]: {
    method: 'POST',
    description: 'Change password for authenticated user',
    requiresAuth: true,
  },
  // Include admin route metadata
  ...ADMIN_ROUTE_METADATA,
} as const;
