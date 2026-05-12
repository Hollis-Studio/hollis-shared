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
export const PUSH_PLATFORMS = ["IOS", "ANDROID"];
export const PushPlatformSchema = z.enum(PUSH_PLATFORMS);
export const PUSH_PLATFORM = {
    IOS: "IOS",
    ANDROID: "ANDROID",
};
export const PUSH_PLATFORM_LABELS = {
    IOS: "iOS",
    ANDROID: "Android",
};
/**
 * Check if a string is a valid push platform
 */
export function isPushPlatform(value) {
    return PUSH_PLATFORMS.includes(value);
}
// ============================================================================
// PUSH APP ROLES
// ============================================================================
/**
 * App surface role for push routing.
 * - 'CLIENT': patient-facing tabs
 * - 'ADMIN': staff/admin portal inside the mobile app
 */
export const PUSH_APP_ROLES = ["CLIENT", "ADMIN"];
export const PushAppRoleSchema = z.enum(PUSH_APP_ROLES);
export const PUSH_APP_ROLE = {
    CLIENT: "CLIENT",
    ADMIN: "ADMIN",
};
export const PUSH_APP_ROLE_LABELS = {
    CLIENT: "Client",
    ADMIN: "Admin",
};
/**
 * Check if a string is a valid push app role
 */
export function isPushAppRole(value) {
    return PUSH_APP_ROLES.includes(value);
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
];
export const ClientNotificationTypeSchema = z.enum(CLIENT_NOTIFICATION_TYPES);
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
];
export const AdminNotificationTypeSchema = z.enum(ADMIN_NOTIFICATION_TYPES);
/** All notification types */
export const NOTIFICATION_TYPES = [
    ...CLIENT_NOTIFICATION_TYPES,
    ...ADMIN_NOTIFICATION_TYPES,
];
export const NotificationTypeSchema = z.enum(NOTIFICATION_TYPES);
export const NOTIFICATION_TYPE = {
    // Client notifications
    NEW_WORKOUT_PLAN: "NEW_WORKOUT_PLAN",
    NEW_NUTRITION_PLAN: "NEW_NUTRITION_PLAN",
    NEW_MESSAGE: "NEW_MESSAGE",
    APPOINTMENT_REMINDER: "APPOINTMENT_REMINDER",
    APPOINTMENT_UPDATE: "APPOINTMENT_UPDATE",
    LAB_RESULTS_READY: "LAB_RESULTS_READY",
    PLAN_UPDATE: "PLAN_UPDATE",
    // Admin notifications
    ADMIN_APPOINTMENT_BOOKED: "ADMIN_APPOINTMENT_BOOKED",
    ADMIN_APPOINTMENT_CANCELLED: "ADMIN_APPOINTMENT_CANCELLED",
    ADMIN_APPOINTMENT_MODIFIED: "ADMIN_APPOINTMENT_MODIFIED",
    ADMIN_PATIENT_ASSIGNED: "ADMIN_PATIENT_ASSIGNED",
    ADMIN_NEW_REGISTRATION: "ADMIN_NEW_REGISTRATION",
};
/**
 * Check if a string is a valid notification type
 */
export function isNotificationType(value) {
    return NOTIFICATION_TYPES.includes(value);
}
export function isClientNotificationType(value) {
    return CLIENT_NOTIFICATION_TYPES.includes(value);
}
export function isAdminNotificationType(value) {
    return ADMIN_NOTIFICATION_TYPES.includes(value);
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
/**
 * Unregister a native device push token.
 */
export const unregisterDevicePushTokenRequestSchema = z.object({
    platform: PushPlatformSchema,
    devicePushToken: z.string().min(10).max(4096),
    deviceId: z.string().uuid().optional(),
    appRole: PushAppRoleSchema.optional(),
});
/**
 * Send a test push notification (dev/test only).
 */
export const sendTestNotificationRequestSchema = z.object({
    type: NotificationTypeSchema.optional(),
});
//# sourceMappingURL=push.js.map