/**
 * @ai-context Appointment domain contracts | statuses, types, booking steps and their labels
 *
 * This module provides the canonical definitions for appointment-related constants:
 * - Appointment statuses (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
 * - Appointment types (CHECK_IN, CONSULTATION, TRAINING_SESSION, etc.)
 * - Booking workflow steps
 *
 * IMPORTANT: All appointment-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
import { baseDocumentSchema, isoTimestampSchema } from "./common.js";
import { createPaginatedListSchema } from "./pagination.js";
import { USER_ROLES } from "./user.js";
// ============================================================================
// APPOINTMENT STATUS
// ============================================================================
export const APPOINTMENT_STATUSES = [
    "SCHEDULED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
];
export const AppointmentStatusSchema = z.enum(APPOINTMENT_STATUSES);
/** Centralized appointment status constants for equality checks */
export const APPOINTMENT_STATUS = {
    SCHEDULED: "SCHEDULED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    NO_SHOW: "NO_SHOW",
};
/** Human-readable labels for appointment statuses */
export const APPOINTMENT_STATUS_LABELS = {
    SCHEDULED: "Scheduled",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    NO_SHOW: "No Show",
};
/**
 * Check if a string is a valid appointment status
 */
export function isAppointmentStatus(value) {
    return APPOINTMENT_STATUSES.includes(value);
}
// ============================================================================
// APPOINTMENT TYPES
// ============================================================================
/**
 * Appointment types for Hollis Health scheduling system.
 * Maps to SessionType for session consumption tracking.
 */
export const APPOINTMENT_TYPES = [
    "CHECK_IN", // → CLINICIAN_FOLLOWUP
    "CONSULTATION", // → CLINICIAN_INITIAL
    "TRAINING_SESSION", // → FITNESS_SESSION
    "ONBOARDING", // → No session consumed
    "RECOVERY_SESSION", // → RECOVERY_SESSION (unlimited)
    "LABWORK", // → LABWORK
    "DXA_SCAN", // → DXA_SCAN
    "SLEEP_SCREENING", // → SLEEP_SCREENING
];
export const AppointmentTypeSchema = z.enum(APPOINTMENT_TYPES);
/** Centralized appointment type constants for equality checks */
export const APPOINTMENT_TYPE = {
    CHECK_IN: "CHECK_IN",
    CONSULTATION: "CONSULTATION",
    TRAINING_SESSION: "TRAINING_SESSION",
    ONBOARDING: "ONBOARDING",
    RECOVERY_SESSION: "RECOVERY_SESSION",
    LABWORK: "LABWORK",
    DXA_SCAN: "DXA_SCAN",
    SLEEP_SCREENING: "SLEEP_SCREENING",
};
/** Human-readable labels for appointment types */
export const APPOINTMENT_TYPE_LABELS = {
    CHECK_IN: "Check-In",
    CONSULTATION: "Consultation",
    TRAINING_SESSION: "Training Session",
    ONBOARDING: "Onboarding",
    RECOVERY_SESSION: "Recovery Session",
    LABWORK: "Lab Work",
    DXA_SCAN: "DXA Scan",
    SLEEP_SCREENING: "Sleep Screening",
};
/**
 * Check if a string is a valid appointment type
 */
export function isAppointmentType(value) {
    return APPOINTMENT_TYPES.includes(value);
}
/**
 * Appointment types that require care-coordinator scheduling (not self-bookable).
 *
 * SLEEP_SCREENING intentionally omitted — patient self-schedules device pickup.
 */
export const COORDINATOR_ONLY_TYPES = new Set([
    APPOINTMENT_TYPE.CONSULTATION,
    APPOINTMENT_TYPE.CHECK_IN,
    APPOINTMENT_TYPE.LABWORK,
    APPOINTMENT_TYPE.DXA_SCAN,
]);
// ============================================================================
// BOOKING STEPS
// ============================================================================
/**
 * Steps in the appointment booking flow.
 * Used by mobile app to track wizard progress.
 */
export const BOOKING_STEPS = [
    "provider",
    "type",
    "datetime",
    "confirm",
];
export const BookingStepSchema = z.enum(BOOKING_STEPS);
/** Centralized booking step constants for equality checks */
export const BOOKING_STEP = {
    PROVIDER: "provider",
    TYPE: "type",
    DATETIME: "datetime",
    CONFIRM: "confirm",
};
/** Human-readable labels for booking steps */
export const BOOKING_STEP_LABELS = {
    provider: "Select Provider",
    type: "Select Type",
    datetime: "Select Date & Time",
    confirm: "Confirm Booking",
};
/**
 * Check if a string is a valid booking step
 */
export function isBookingStep(value) {
    return BOOKING_STEPS.includes(value);
}
// ============================================================================
// Admin Booking Flow (includes patient selection as first step)
// ============================================================================
/**
 * Steps in the admin appointment booking flow.
 * Admin flow includes patient selection as the first step.
 */
export const ADMIN_BOOKING_STEPS = [
    "patient",
    "provider",
    "type",
    "datetime",
    "confirm",
];
export const AdminBookingStepSchema = z.enum(ADMIN_BOOKING_STEPS);
/** Centralized admin booking step constants for equality checks */
export const ADMIN_BOOKING_STEP = {
    PATIENT: "patient",
    PROVIDER: "provider",
    TYPE: "type",
    DATETIME: "datetime",
    CONFIRM: "confirm",
};
/** Human-readable labels for admin booking steps */
export const ADMIN_BOOKING_STEP_LABELS = {
    patient: "Patient",
    provider: "Provider",
    type: "Type",
    datetime: "Date/Time",
    confirm: "Confirm",
};
/**
 * Check if a string is a valid admin booking step
 */
export function isAdminBookingStep(value) {
    return ADMIN_BOOKING_STEPS.includes(value);
}
// ============================================================================
// APPOINTMENT SCHEMA
// ============================================================================
export const PatientSummarySchema = z.object({
    id: z.string(),
    name: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
});
export const AppointmentSchema = baseDocumentSchema.extend({
    id: z.string().optional(),
    /** @mapped-from Appointment.userId */
    patientId: z.string(),
    providerId: z.string().nullable(), // Admin/Clinician ID
    title: z.string().max(200),
    /** @mapped-from Appointment.notes @deprecated Use `notes` field instead */
    description: z.string().optional(),
    /** @mapped-from Appointment.date */
    startTime: isoTimestampSchema,
    /** Duration of the appointment in minutes (stored in database as integer). */
    duration: z.number().int().positive(),
    /** @computed: date + duration * 60000ms */
    endTime: isoTimestampSchema,
    status: AppointmentStatusSchema,
    type: AppointmentTypeSchema,
    // Plain string (no .url()) to accept legacy DB values that may lack an
    // https:// scheme. URL format is enforced on CREATE input via
    // createAppointmentInputSchema.meetingLink which uses z.string().url().
    meetingLink: z.string().max(2000).nullable().optional(),
    location: z.string().max(500).nullable().optional(),
    notes: z.string().max(5000).nullable().optional(),
    /** Patient info included for admin booking lists */
    patient: PatientSummarySchema.nullable().optional(),
});
/**
 * Canonical paginated appointments list payload.
 */
export const appointmentsListPayloadSchema = createPaginatedListSchema(AppointmentSchema);
/**
 * Canonical paginated appointments list response: { data, pagination }
 */
export const appointmentsListResponseSchema = appointmentsListPayloadSchema;
export const ProviderSummarySchema = z.object({
    id: z.string(),
    name: z.string(),
    role: z.enum(USER_ROLES).optional(),
    avatarUrl: z.string().url().optional(),
    specialty: z.string().optional(),
});
// ============================================================================
// CREATE APPOINTMENT INPUT
// ============================================================================
/**
 * Canonical input schema for creating an appointment.
 * Used by both mobile and server to ensure field parity.
 * Server is authoritative — mobile was missing meetingLink.
 */
export const createAppointmentInputSchema = z.object({
    providerId: z.string(),
    title: z.string().max(200),
    startTime: z.string(),
    type: AppointmentTypeSchema,
    duration: z.number().int().positive().optional(),
    location: z.string().max(500).optional(),
    notes: z.string().max(2000).optional(),
    meetingLink: z.string().url().max(2000).optional(),
});
//# sourceMappingURL=appointments.js.map