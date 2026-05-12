/**
 * @ai-context Admin Notifications domain contracts | SSE-triggered realtime notification types
 *
 * Notification kinds for admin/trainer/clinician realtime alerts.
 * This is the canonical source of truth for admin realtime notification kinds,
 * schemas, and event payload contracts.
 *
 * NOTE: These are intentionally PHI-minimal. Payloads should only include IDs
 * and never names, emails, notes, or clinical details.
 *
 * deps: zod | consumers: web-admin, server
 */
import { z } from "zod";
export declare const ADMIN_REALTIME_NOTIFICATION_KINDS: readonly ["appointment-booked", "appointment-cancelled", "appointment-modified", "patient-assigned", "lab-review-needed", "new-registration"];
export declare const adminRealtimeNotificationKindSchema: z.ZodEnum<{
    "appointment-booked": "appointment-booked";
    "appointment-cancelled": "appointment-cancelled";
    "appointment-modified": "appointment-modified";
    "patient-assigned": "patient-assigned";
    "lab-review-needed": "lab-review-needed";
    "new-registration": "new-registration";
}>;
export type AdminRealtimeNotificationKind = z.infer<typeof adminRealtimeNotificationKindSchema>;
export declare const ADMIN_REALTIME_NOTIFICATION_KIND: {
    readonly APPOINTMENT_BOOKED: AdminRealtimeNotificationKind;
    readonly APPOINTMENT_CANCELLED: AdminRealtimeNotificationKind;
    readonly APPOINTMENT_MODIFIED: AdminRealtimeNotificationKind;
    readonly PATIENT_ASSIGNED: AdminRealtimeNotificationKind;
    readonly LAB_REVIEW_NEEDED: AdminRealtimeNotificationKind;
    readonly NEW_REGISTRATION: AdminRealtimeNotificationKind;
};
export declare const adminRealtimeNotificationEventDataSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        "appointment-booked": "appointment-booked";
        "appointment-cancelled": "appointment-cancelled";
        "appointment-modified": "appointment-modified";
        "patient-assigned": "patient-assigned";
        "lab-review-needed": "lab-review-needed";
        "new-registration": "new-registration";
    }>;
    actorUserId: z.ZodOptional<z.ZodString>;
    patientId: z.ZodOptional<z.ZodString>;
    appointmentId: z.ZodOptional<z.ZodString>;
    reportId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export type AdminRealtimeNotificationEventData = z.infer<typeof adminRealtimeNotificationEventDataSchema>;
//# sourceMappingURL=admin-notifications.d.ts.map