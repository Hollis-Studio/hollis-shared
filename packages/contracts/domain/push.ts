/**
 * @ai-context Push notification domain contracts | platforms, app roles, token management
 *
 * This module provides the canonical definitions for push notification-related constants:
 * - Push platforms (ios, android)
 * - App roles (client, admin)
 *
 * IMPORTANT: All push-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// PUSH PLATFORMS
// ============================================================================

/** Supported native push token platforms */
export const PUSH_PLATFORMS = ['ios', 'android'] as const;
export type PushPlatform = (typeof PUSH_PLATFORMS)[number];

export const PushPlatformSchema = z.enum(PUSH_PLATFORMS);

export const PUSH_PLATFORM = {
  IOS: 'ios' as PushPlatform,
  ANDROID: 'android' as PushPlatform,
} as const;

export const PUSH_PLATFORM_LABELS: Record<PushPlatform, string> = {
  ios: 'iOS',
  android: 'Android',
};

/**
 * Check if a string is a valid push platform
 */
export function isPushPlatform(value: string): value is PushPlatform {
  return (PUSH_PLATFORMS as readonly string[]).includes(value);
}

// ============================================================================
// PUSH APP ROLES
// ============================================================================

/**
 * App surface role for push routing.
 * - 'client': patient-facing tabs
 * - 'admin': staff/admin portal inside the mobile app
 */
export const PUSH_APP_ROLES = ['client', 'admin'] as const;
export type PushAppRole = (typeof PUSH_APP_ROLES)[number];

export const PushAppRoleSchema = z.enum(PUSH_APP_ROLES);

export const PUSH_APP_ROLE = {
  CLIENT: 'client' as PushAppRole,
  ADMIN: 'admin' as PushAppRole,
} as const;

export const PUSH_APP_ROLE_LABELS: Record<PushAppRole, string> = {
  client: 'Client',
  admin: 'Admin',
};

/**
 * Check if a string is a valid push app role
 */
export function isPushAppRole(value: string): value is PushAppRole {
  return (PUSH_APP_ROLES as readonly string[]).includes(value);
}

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Register a native device push token (APNs/FCM).
 */
export interface RegisterDevicePushTokenRequest {
  platform: PushPlatform;
  devicePushToken: string;
  deviceId?: string;
  appRole?: PushAppRole;
}

export const registerDevicePushTokenRequestSchema: z.ZodType<RegisterDevicePushTokenRequest> = z.object({
  platform: PushPlatformSchema,
  devicePushToken: z.string().min(1),
  deviceId: z.string().min(1).optional(),
  appRole: PushAppRoleSchema.optional(),
});

/**
 * Unregister a native device push token.
 */
export interface UnregisterDevicePushTokenRequest {
  devicePushToken: string;
  deviceId?: string;
  appRole?: PushAppRole;
}

export const unregisterDevicePushTokenRequestSchema: z.ZodType<UnregisterDevicePushTokenRequest> = z.object({
  devicePushToken: z.string().min(1),
  deviceId: z.string().min(1).optional(),
  appRole: PushAppRoleSchema.optional(),
});
