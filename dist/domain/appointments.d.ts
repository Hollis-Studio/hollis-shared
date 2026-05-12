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
export declare const APPOINTMENT_STATUSES: readonly ["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"];
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export declare const AppointmentStatusSchema: z.ZodEnum<{
    SCHEDULED: "SCHEDULED";
    COMPLETED: "COMPLETED";
    CANCELLED: "CANCELLED";
    NO_SHOW: "NO_SHOW";
}>;
/** Centralized appointment status constants for equality checks */
export declare const APPOINTMENT_STATUS: {
    readonly SCHEDULED: "SCHEDULED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly NO_SHOW: "NO_SHOW";
};
/** Human-readable labels for appointment statuses */
export declare const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string>;
/**
 * Check if a string is a valid appointment status
 */
export declare function isAppointmentStatus(value: string): value is AppointmentStatus;
/**
 * Appointment types for Hollis Health scheduling system.
 * Maps to SessionType for session consumption tracking.
 */
export declare const APPOINTMENT_TYPES: readonly ["CHECK_IN", "CONSULTATION", "TRAINING_SESSION", "ONBOARDING", "RECOVERY_SESSION", "LABWORK", "DXA_SCAN", "SLEEP_SCREENING"];
export type AppointmentType = z.infer<typeof AppointmentTypeSchema>;
export declare const AppointmentTypeSchema: z.ZodEnum<{
    CHECK_IN: "CHECK_IN";
    CONSULTATION: "CONSULTATION";
    TRAINING_SESSION: "TRAINING_SESSION";
    ONBOARDING: "ONBOARDING";
    RECOVERY_SESSION: "RECOVERY_SESSION";
    LABWORK: "LABWORK";
    DXA_SCAN: "DXA_SCAN";
    SLEEP_SCREENING: "SLEEP_SCREENING";
}>;
/** Centralized appointment type constants for equality checks */
export declare const APPOINTMENT_TYPE: {
    readonly CHECK_IN: "CHECK_IN";
    readonly CONSULTATION: "CONSULTATION";
    readonly TRAINING_SESSION: "TRAINING_SESSION";
    readonly ONBOARDING: "ONBOARDING";
    readonly RECOVERY_SESSION: "RECOVERY_SESSION";
    readonly LABWORK: "LABWORK";
    readonly DXA_SCAN: "DXA_SCAN";
    readonly SLEEP_SCREENING: "SLEEP_SCREENING";
};
/** Human-readable labels for appointment types */
export declare const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string>;
/**
 * Check if a string is a valid appointment type
 */
export declare function isAppointmentType(value: string): value is AppointmentType;
/**
 * Appointment types that require care-coordinator scheduling (not self-bookable).
 *
 * SLEEP_SCREENING intentionally omitted — patient self-schedules device pickup.
 */
export declare const COORDINATOR_ONLY_TYPES: ReadonlySet<AppointmentType>;
/**
 * Steps in the appointment booking flow.
 * Used by mobile app to track wizard progress.
 */
export declare const BOOKING_STEPS: readonly ["provider", "type", "datetime", "confirm"];
export type BookingStep = z.infer<typeof BookingStepSchema>;
export declare const BookingStepSchema: z.ZodEnum<{
    type: "type";
    datetime: "datetime";
    provider: "provider";
    confirm: "confirm";
}>;
/** Centralized booking step constants for equality checks */
export declare const BOOKING_STEP: {
    readonly PROVIDER: "provider";
    readonly TYPE: "type";
    readonly DATETIME: "datetime";
    readonly CONFIRM: "confirm";
};
/** Human-readable labels for booking steps */
export declare const BOOKING_STEP_LABELS: Record<BookingStep, string>;
/**
 * Check if a string is a valid booking step
 */
export declare function isBookingStep(value: string): value is BookingStep;
/**
 * Steps in the admin appointment booking flow.
 * Admin flow includes patient selection as the first step.
 */
export declare const ADMIN_BOOKING_STEPS: readonly ["patient", "provider", "type", "datetime", "confirm"];
export type AdminBookingStep = z.infer<typeof AdminBookingStepSchema>;
export declare const AdminBookingStepSchema: z.ZodEnum<{
    type: "type";
    datetime: "datetime";
    provider: "provider";
    confirm: "confirm";
    patient: "patient";
}>;
/** Centralized admin booking step constants for equality checks */
export declare const ADMIN_BOOKING_STEP: {
    readonly PATIENT: "patient";
    readonly PROVIDER: "provider";
    readonly TYPE: "type";
    readonly DATETIME: "datetime";
    readonly CONFIRM: "confirm";
};
/** Human-readable labels for admin booking steps */
export declare const ADMIN_BOOKING_STEP_LABELS: Record<AdminBookingStep, string>;
/**
 * Check if a string is a valid admin booking step
 */
export declare function isAdminBookingStep(value: string): value is AdminBookingStep;
export declare const PatientSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type PatientSummaryContract = z.infer<typeof PatientSummarySchema>;
export declare const AppointmentSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    patientId: z.ZodString;
    providerId: z.ZodNullable<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    startTime: z.ZodString;
    duration: z.ZodNumber;
    endTime: z.ZodString;
    status: z.ZodEnum<{
        SCHEDULED: "SCHEDULED";
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        NO_SHOW: "NO_SHOW";
    }>;
    type: z.ZodEnum<{
        CHECK_IN: "CHECK_IN";
        CONSULTATION: "CONSULTATION";
        TRAINING_SESSION: "TRAINING_SESSION";
        ONBOARDING: "ONBOARDING";
        RECOVERY_SESSION: "RECOVERY_SESSION";
        LABWORK: "LABWORK";
        DXA_SCAN: "DXA_SCAN";
        SLEEP_SCREENING: "SLEEP_SCREENING";
    }>;
    meetingLink: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    patient: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type Appointment = z.infer<typeof AppointmentSchema>;
/** Type alias for server-side contract consumption */
export type AppointmentContract = Appointment;
/**
 * Canonical paginated appointments list payload.
 */
export declare const appointmentsListPayloadSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        patientId: z.ZodString;
        providerId: z.ZodNullable<z.ZodString>;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        startTime: z.ZodString;
        duration: z.ZodNumber;
        endTime: z.ZodString;
        status: z.ZodEnum<{
            SCHEDULED: "SCHEDULED";
            COMPLETED: "COMPLETED";
            CANCELLED: "CANCELLED";
            NO_SHOW: "NO_SHOW";
        }>;
        type: z.ZodEnum<{
            CHECK_IN: "CHECK_IN";
            CONSULTATION: "CONSULTATION";
            TRAINING_SESSION: "TRAINING_SESSION";
            ONBOARDING: "ONBOARDING";
            RECOVERY_SESSION: "RECOVERY_SESSION";
            LABWORK: "LABWORK";
            DXA_SCAN: "DXA_SCAN";
            SLEEP_SCREENING: "SLEEP_SCREENING";
        }>;
        meetingLink: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        patient: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AppointmentsListPayload = z.infer<typeof appointmentsListPayloadSchema>;
/**
 * Canonical paginated appointments list response: { data, pagination }
 */
export declare const appointmentsListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        patientId: z.ZodString;
        providerId: z.ZodNullable<z.ZodString>;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        startTime: z.ZodString;
        duration: z.ZodNumber;
        endTime: z.ZodString;
        status: z.ZodEnum<{
            SCHEDULED: "SCHEDULED";
            COMPLETED: "COMPLETED";
            CANCELLED: "CANCELLED";
            NO_SHOW: "NO_SHOW";
        }>;
        type: z.ZodEnum<{
            CHECK_IN: "CHECK_IN";
            CONSULTATION: "CONSULTATION";
            TRAINING_SESSION: "TRAINING_SESSION";
            ONBOARDING: "ONBOARDING";
            RECOVERY_SESSION: "RECOVERY_SESSION";
            LABWORK: "LABWORK";
            DXA_SCAN: "DXA_SCAN";
            SLEEP_SCREENING: "SLEEP_SCREENING";
        }>;
        meetingLink: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        patient: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AppointmentsListResponse = z.infer<typeof appointmentsListResponseSchema>;
export declare const ProviderSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    specialty: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ProviderSummaryContract = z.infer<typeof ProviderSummarySchema>;
/**
 * Canonical input schema for creating an appointment.
 * Used by both mobile and server to ensure field parity.
 * Server is authoritative — mobile was missing meetingLink.
 */
export declare const createAppointmentInputSchema: z.ZodObject<{
    providerId: z.ZodString;
    title: z.ZodString;
    startTime: z.ZodString;
    type: z.ZodEnum<{
        CHECK_IN: "CHECK_IN";
        CONSULTATION: "CONSULTATION";
        TRAINING_SESSION: "TRAINING_SESSION";
        ONBOARDING: "ONBOARDING";
        RECOVERY_SESSION: "RECOVERY_SESSION";
        LABWORK: "LABWORK";
        DXA_SCAN: "DXA_SCAN";
        SLEEP_SCREENING: "SLEEP_SCREENING";
    }>;
    duration: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    meetingLink: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentInputSchema>;
//# sourceMappingURL=appointments.d.ts.map