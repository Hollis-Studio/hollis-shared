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
/** Supported native push token platforms */
export declare const PUSH_PLATFORMS: readonly ["IOS", "ANDROID"];
export declare const PushPlatformSchema: z.ZodEnum<{
    IOS: "IOS";
    ANDROID: "ANDROID";
}>;
export type PushPlatform = z.infer<typeof PushPlatformSchema>;
export declare const PUSH_PLATFORM: {
    readonly IOS: PushPlatform;
    readonly ANDROID: PushPlatform;
};
export declare const PUSH_PLATFORM_LABELS: Record<PushPlatform, string>;
/**
 * Check if a string is a valid push platform
 */
export declare function isPushPlatform(value: string): value is PushPlatform;
/**
 * App surface role for push routing.
 * - 'CLIENT': patient-facing tabs
 * - 'ADMIN': staff/admin portal inside the mobile app
 */
export declare const PUSH_APP_ROLES: readonly ["CLIENT", "ADMIN"];
export declare const PushAppRoleSchema: z.ZodEnum<{
    ADMIN: "ADMIN";
    CLIENT: "CLIENT";
}>;
export type PushAppRole = z.infer<typeof PushAppRoleSchema>;
export declare const PUSH_APP_ROLE: {
    readonly CLIENT: PushAppRole;
    readonly ADMIN: PushAppRole;
};
export declare const PUSH_APP_ROLE_LABELS: Record<PushAppRole, string>;
/**
 * Check if a string is a valid push app role
 */
export declare function isPushAppRole(value: string): value is PushAppRole;
/**
 * Client-facing notification types (patient-facing app)
 */
export declare const CLIENT_NOTIFICATION_TYPES: readonly ["NEW_WORKOUT_PLAN", "NEW_NUTRITION_PLAN", "NEW_MESSAGE", "APPOINTMENT_REMINDER", "APPOINTMENT_UPDATE", "LAB_RESULTS_READY", "PLAN_UPDATE"];
export declare const ClientNotificationTypeSchema: z.ZodEnum<{
    NEW_WORKOUT_PLAN: "NEW_WORKOUT_PLAN";
    NEW_NUTRITION_PLAN: "NEW_NUTRITION_PLAN";
    NEW_MESSAGE: "NEW_MESSAGE";
    APPOINTMENT_REMINDER: "APPOINTMENT_REMINDER";
    APPOINTMENT_UPDATE: "APPOINTMENT_UPDATE";
    LAB_RESULTS_READY: "LAB_RESULTS_READY";
    PLAN_UPDATE: "PLAN_UPDATE";
}>;
export type ClientNotificationType = z.infer<typeof ClientNotificationTypeSchema>;
/**
 * Admin-facing notification types (staff/trainer/clinician portal)
 *
 * These are sent to admin devices when:
 * - A patient books/modifies/cancels an appointment
 * - A patient is assigned to a staff member
 * - A new registration is completed
 */
export declare const ADMIN_NOTIFICATION_TYPES: readonly ["ADMIN_APPOINTMENT_BOOKED", "ADMIN_APPOINTMENT_CANCELLED", "ADMIN_APPOINTMENT_MODIFIED", "ADMIN_PATIENT_ASSIGNED", "ADMIN_NEW_REGISTRATION"];
export declare const AdminNotificationTypeSchema: z.ZodEnum<{
    ADMIN_APPOINTMENT_BOOKED: "ADMIN_APPOINTMENT_BOOKED";
    ADMIN_APPOINTMENT_CANCELLED: "ADMIN_APPOINTMENT_CANCELLED";
    ADMIN_APPOINTMENT_MODIFIED: "ADMIN_APPOINTMENT_MODIFIED";
    ADMIN_PATIENT_ASSIGNED: "ADMIN_PATIENT_ASSIGNED";
    ADMIN_NEW_REGISTRATION: "ADMIN_NEW_REGISTRATION";
}>;
export type AdminNotificationType = z.infer<typeof AdminNotificationTypeSchema>;
/** All notification types */
export declare const NOTIFICATION_TYPES: readonly ["NEW_WORKOUT_PLAN", "NEW_NUTRITION_PLAN", "NEW_MESSAGE", "APPOINTMENT_REMINDER", "APPOINTMENT_UPDATE", "LAB_RESULTS_READY", "PLAN_UPDATE", "ADMIN_APPOINTMENT_BOOKED", "ADMIN_APPOINTMENT_CANCELLED", "ADMIN_APPOINTMENT_MODIFIED", "ADMIN_PATIENT_ASSIGNED", "ADMIN_NEW_REGISTRATION"];
export declare const NotificationTypeSchema: z.ZodEnum<{
    NEW_WORKOUT_PLAN: "NEW_WORKOUT_PLAN";
    NEW_NUTRITION_PLAN: "NEW_NUTRITION_PLAN";
    NEW_MESSAGE: "NEW_MESSAGE";
    APPOINTMENT_REMINDER: "APPOINTMENT_REMINDER";
    APPOINTMENT_UPDATE: "APPOINTMENT_UPDATE";
    LAB_RESULTS_READY: "LAB_RESULTS_READY";
    PLAN_UPDATE: "PLAN_UPDATE";
    ADMIN_APPOINTMENT_BOOKED: "ADMIN_APPOINTMENT_BOOKED";
    ADMIN_APPOINTMENT_CANCELLED: "ADMIN_APPOINTMENT_CANCELLED";
    ADMIN_APPOINTMENT_MODIFIED: "ADMIN_APPOINTMENT_MODIFIED";
    ADMIN_PATIENT_ASSIGNED: "ADMIN_PATIENT_ASSIGNED";
    ADMIN_NEW_REGISTRATION: "ADMIN_NEW_REGISTRATION";
}>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;
export declare const NOTIFICATION_TYPE: {
    readonly NEW_WORKOUT_PLAN: NotificationType;
    readonly NEW_NUTRITION_PLAN: NotificationType;
    readonly NEW_MESSAGE: NotificationType;
    readonly APPOINTMENT_REMINDER: NotificationType;
    readonly APPOINTMENT_UPDATE: NotificationType;
    readonly LAB_RESULTS_READY: NotificationType;
    readonly PLAN_UPDATE: NotificationType;
    readonly ADMIN_APPOINTMENT_BOOKED: NotificationType;
    readonly ADMIN_APPOINTMENT_CANCELLED: NotificationType;
    readonly ADMIN_APPOINTMENT_MODIFIED: NotificationType;
    readonly ADMIN_PATIENT_ASSIGNED: NotificationType;
    readonly ADMIN_NEW_REGISTRATION: NotificationType;
};
/**
 * Check if a string is a valid notification type
 */
export declare function isNotificationType(value: string): value is NotificationType;
export declare function isClientNotificationType(value: string): value is ClientNotificationType;
export declare function isAdminNotificationType(value: string): value is AdminNotificationType;
/**
 * Register a native device push token (APNs/FCM).
 */
export declare const registerDevicePushTokenRequestSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        IOS: "IOS";
        ANDROID: "ANDROID";
    }>;
    devicePushToken: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
    appRole: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        CLIENT: "CLIENT";
    }>>;
}, z.core.$strip>;
export type RegisterDevicePushTokenRequest = z.infer<typeof registerDevicePushTokenRequestSchema>;
/**
 * Unregister a native device push token.
 */
export declare const unregisterDevicePushTokenRequestSchema: z.ZodObject<{
    platform: z.ZodEnum<{
        IOS: "IOS";
        ANDROID: "ANDROID";
    }>;
    devicePushToken: z.ZodString;
    deviceId: z.ZodOptional<z.ZodString>;
    appRole: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        CLIENT: "CLIENT";
    }>>;
}, z.core.$strip>;
export type UnregisterDevicePushTokenRequest = z.infer<typeof unregisterDevicePushTokenRequestSchema>;
/**
 * Send a test push notification (dev/test only).
 */
export declare const sendTestNotificationRequestSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        NEW_WORKOUT_PLAN: "NEW_WORKOUT_PLAN";
        NEW_NUTRITION_PLAN: "NEW_NUTRITION_PLAN";
        NEW_MESSAGE: "NEW_MESSAGE";
        APPOINTMENT_REMINDER: "APPOINTMENT_REMINDER";
        APPOINTMENT_UPDATE: "APPOINTMENT_UPDATE";
        LAB_RESULTS_READY: "LAB_RESULTS_READY";
        PLAN_UPDATE: "PLAN_UPDATE";
        ADMIN_APPOINTMENT_BOOKED: "ADMIN_APPOINTMENT_BOOKED";
        ADMIN_APPOINTMENT_CANCELLED: "ADMIN_APPOINTMENT_CANCELLED";
        ADMIN_APPOINTMENT_MODIFIED: "ADMIN_APPOINTMENT_MODIFIED";
        ADMIN_PATIENT_ASSIGNED: "ADMIN_PATIENT_ASSIGNED";
        ADMIN_NEW_REGISTRATION: "ADMIN_NEW_REGISTRATION";
    }>>;
}, z.core.$strip>;
export type SendTestNotificationRequest = z.infer<typeof sendTestNotificationRequestSchema>;
//# sourceMappingURL=push.d.ts.map