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
// NOTIFICATION TYPES
// ============================================================================

/**
 * Client-facing notification types (patient-facing app)
 */
export const CLIENT_NOTIFICATION_TYPES = [
  "NEW_WORKOUT_PLAN",
  "NEW_NUTRITION_PLAN",
  "NEW_MESSAGE",
  "APPOINTMENT_REMINDER",
  "APPOINTMENT_UPDATE",
  "LAB_RESULTS_READY",
  "PLAN_UPDATE",
] as const;
export const ClientNotificationTypeSchema = z.enum(CLIENT_NOTIFICATION_TYPES);
export type ClientNotificationType = z.infer<
  typeof ClientNotificationTypeSchema
>;

/**
 * Admin-facing notification types (staff/trainer/clinician portal)
 *
 * These are sent to admin devices when:
 * - A patient books/modifies/cancels an appointment
 * - A patient is assigned to a staff member
 * - A new registration is completed
 */
export const ADMIN_NOTIFICATION_TYPES = [
  "ADMIN_APPOINTMENT_BOOKED",
  "ADMIN_APPOINTMENT_CANCELLED",
  "ADMIN_APPOINTMENT_MODIFIED",
  "ADMIN_PATIENT_ASSIGNED",
  "ADMIN_NEW_REGISTRATION",
] as const;
export const AdminNotificationTypeSchema = z.enum(ADMIN_NOTIFICATION_TYPES);
export type AdminNotificationType = z.infer<
  typeof AdminNotificationTypeSchema
>;

/** All notification types */
export const NOTIFICATION_TYPES = [
  ...CLIENT_NOTIFICATION_TYPES,
  ...ADMIN_NOTIFICATION_TYPES,
] as const satisfies readonly [string, ...string[]];

export const NotificationTypeSchema = z.enum(NOTIFICATION_TYPES);
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NOTIFICATION_TYPE = {
  // Client notifications
  NEW_WORKOUT_PLAN: "NEW_WORKOUT_PLAN" as NotificationType,
  NEW_NUTRITION_PLAN: "NEW_NUTRITION_PLAN" as NotificationType,
  NEW_MESSAGE: "NEW_MESSAGE" as NotificationType,
  APPOINTMENT_REMINDER: "APPOINTMENT_REMINDER" as NotificationType,
  APPOINTMENT_UPDATE: "APPOINTMENT_UPDATE" as NotificationType,
  LAB_RESULTS_READY: "LAB_RESULTS_READY" as NotificationType,
  PLAN_UPDATE: "PLAN_UPDATE" as NotificationType,
  // Admin notifications
  ADMIN_APPOINTMENT_BOOKED: "ADMIN_APPOINTMENT_BOOKED" as NotificationType,
  ADMIN_APPOINTMENT_CANCELLED:
    "ADMIN_APPOINTMENT_CANCELLED" as NotificationType,
  ADMIN_APPOINTMENT_MODIFIED: "ADMIN_APPOINTMENT_MODIFIED" as NotificationType,
  ADMIN_PATIENT_ASSIGNED: "ADMIN_PATIENT_ASSIGNED" as NotificationType,
  ADMIN_NEW_REGISTRATION: "ADMIN_NEW_REGISTRATION" as NotificationType,
} as const;

/**
 * Check if a string is a valid notification type
 */
export function isNotificationType(value: string): value is NotificationType {
  return (NOTIFICATION_TYPES as readonly string[]).includes(value);
}

export function isClientNotificationType(
  value: string,
): value is ClientNotificationType {
  return (CLIENT_NOTIFICATION_TYPES as readonly string[]).includes(value);
}

export function isAdminNotificationType(
  value: string,
): value is AdminNotificationType {
  return (ADMIN_NOTIFICATION_TYPES as readonly string[]).includes(value);
}

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Register a native device push token (APNs/FCM).
 */
export const registerDevicePushTokenRequestSchema = z.object({
  platform: PushPlatformSchema,
  devicePushToken: z.string().min(10).max(4096),
  deviceId: z.string().uuid().optional(),
  appRole: PushAppRoleSchema.optional(),
});
export type RegisterDevicePushTokenRequest = z.infer<
  typeof registerDevicePushTokenRequestSchema
>;

/**
 * Unregister a native device push token.
 */
export const unregisterDevicePushTokenRequestSchema = z.object({
  platform: PushPlatformSchema,
  devicePushToken: z.string().min(10).max(4096),
  deviceId: z.string().uuid().optional(),
  appRole: PushAppRoleSchema.optional(),
});
export type UnregisterDevicePushTokenRequest = z.infer<
  typeof unregisterDevicePushTokenRequestSchema
>;

/**
 * Send a test push notification (dev/test only).
 */
export const sendTestNotificationRequestSchema = z.object({
  type: NotificationTypeSchema.optional(),
});
export type SendTestNotificationRequest = z.infer<
  typeof sendTestNotificationRequestSchema
>;
