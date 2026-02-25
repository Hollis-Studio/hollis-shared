/**
 * @ai-context Admin Realtime Notifications | SSE-triggered notifications for admin portal
 *
 * This module provides:
 * - Notification kinds for admin/trainer/clinician realtime alerts
 * - Zod schemas for validation
 * - Event data interfaces
 *
 * Used by:
 * - Web Admin: web-admin/features/notifications
 * - Server: server/src/services/adminRealtimeNotificationsService.ts
 *
 * IMPORTANT: These are intentionally PHI-minimal. Payloads should only include IDs
 * and never names, emails, notes, or clinical details.
 *
 * deps: zod | consumers: web-admin/*, server/src/*
 */

import { z } from "zod";

// ============================================================================
// ADMIN PORTAL REALTIME NOTIFICATIONS (SSE-triggered)
// ============================================================================

export const ADMIN_REALTIME_NOTIFICATION_KINDS = [
  "appointment-booked",
  "appointment-cancelled",
  "appointment-modified",
  "patient-assigned",
  "lab-review-needed",
  "new-registration",
] as const;

export const adminRealtimeNotificationKindSchema = z.enum(
  ADMIN_REALTIME_NOTIFICATION_KINDS,
);
export type AdminRealtimeNotificationKind = z.infer<
  typeof adminRealtimeNotificationKindSchema
>;

export const ADMIN_REALTIME_NOTIFICATION_KIND = {
  APPOINTMENT_BOOKED: "appointment-booked" as AdminRealtimeNotificationKind,
  APPOINTMENT_CANCELLED:
    "appointment-cancelled" as AdminRealtimeNotificationKind,
  APPOINTMENT_MODIFIED: "appointment-modified" as AdminRealtimeNotificationKind,
  PATIENT_ASSIGNED: "patient-assigned" as AdminRealtimeNotificationKind,
  LAB_REVIEW_NEEDED: "lab-review-needed" as AdminRealtimeNotificationKind,
  NEW_REGISTRATION: "new-registration" as AdminRealtimeNotificationKind,
} as const;

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
export type AdminRealtimeNotificationEventData = z.infer<
  typeof adminRealtimeNotificationEventDataSchema
>;
