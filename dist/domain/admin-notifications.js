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
// ============================================================================
// ADMIN REALTIME NOTIFICATION KINDS
// ============================================================================
export const ADMIN_REALTIME_NOTIFICATION_KINDS = [
    "appointment-booked",
    "appointment-cancelled",
    "appointment-modified",
    "patient-assigned",
    "lab-review-needed",
    "new-registration",
];
export const adminRealtimeNotificationKindSchema = z.enum(ADMIN_REALTIME_NOTIFICATION_KINDS);
export const ADMIN_REALTIME_NOTIFICATION_KIND = {
    APPOINTMENT_BOOKED: "appointment-booked",
    APPOINTMENT_CANCELLED: "appointment-cancelled",
    APPOINTMENT_MODIFIED: "appointment-modified",
    PATIENT_ASSIGNED: "patient-assigned",
    LAB_REVIEW_NEEDED: "lab-review-needed",
    NEW_REGISTRATION: "new-registration",
};
export const adminRealtimeNotificationEventDataSchema = z
    .object({
    kind: adminRealtimeNotificationKindSchema,
    actorUserId: z.string().optional(),
    patientId: z.string().optional(),
    appointmentId: z.string().optional(),
    /** Opaque lab report ID — used by clients to navigate to the lab report. PHI-minimal: ID only. */
    reportId: z.string().optional(),
})
    .strict();
//# sourceMappingURL=admin-notifications.js.map