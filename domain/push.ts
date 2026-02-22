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

import { z } from "zod";

// ============================================================================
// PUSH PLATFORMS
// ============================================================================

/** Supported native push token platforms */
export const PUSH_PLATFORMS = ["IOS", "ANDROID"] as const;
export const PushPlatformSchema = z.enum(PUSH_PLATFORMS);
export type PushPlatform = z.infer<typeof PushPlatformSchema>;

export const PUSH_PLATFORM = {
  IOS: "IOS" as PushPlatform,
  ANDROID: "ANDROID" as PushPlatform,
} as const;

export const PUSH_PLATFORM_LABELS: Record<PushPlatform, string> = {
  IOS: "iOS",
  ANDROID: "Android",
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
 * - 'CLIENT': patient-facing tabs
 * - 'ADMIN': staff/admin portal inside the mobile app
 */
export const PUSH_APP_ROLES = ["CLIENT", "ADMIN"] as const;
export const PushAppRoleSchema = z.enum(PUSH_APP_ROLES);
export type PushAppRole = z.infer<typeof PushAppRoleSchema>;

export const PUSH_APP_ROLE = {
  CLIENT: "CLIENT" as PushAppRole,
  ADMIN: "ADMIN" as PushAppRole,
} as const;

export const PUSH_APP_ROLE_LABELS: Record<PushAppRole, string> = {
  CLIENT: "Client",
  ADMIN: "Admin",
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

export const registerDevicePushTokenRequestSchema: z.ZodType<RegisterDevicePushTokenRequest> =
  z.object({
    platform: PushPlatformSchema,
    devicePushToken: z.string().min(10).max(4096),
    deviceId: z.string().uuid().optional(),
    appRole: PushAppRoleSchema.optional(),
  });

/**
 * Unregister a native device push token.
 */
export interface UnregisterDevicePushTokenRequest {
  platform: PushPlatform;
  devicePushToken: string;
  deviceId?: string;
  appRole?: PushAppRole;
}

export const unregisterDevicePushTokenRequestSchema: z.ZodType<UnregisterDevicePushTokenRequest> =
  z.object({
    platform: PushPlatformSchema,
    devicePushToken: z.string().min(10).max(4096),
    deviceId: z.string().uuid().optional(),
    appRole: PushAppRoleSchema.optional(),
  });
