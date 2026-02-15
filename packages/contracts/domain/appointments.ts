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

import { z } from 'zod';
import { baseDocumentSchema, isoTimestampSchema } from './common';
import { USER_ROLES } from './user';

// ============================================================================
// APPOINTMENT STATUS
// ============================================================================

export const APPOINTMENT_STATUSES = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const AppointmentStatusSchema = z.enum(APPOINTMENT_STATUSES);

/** Centralized appointment status constants for equality checks */
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const satisfies Record<AppointmentStatus, AppointmentStatus>;

/** Human-readable labels for appointment statuses */
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

/**
 * Check if a string is a valid appointment status
 */
export function isAppointmentStatus(value: string): value is AppointmentStatus {
  return (APPOINTMENT_STATUSES as readonly string[]).includes(value);
}

// ============================================================================
// APPOINTMENT TYPES
// ============================================================================

/**
 * Appointment types for Hollis Health scheduling system.
 * Maps to SessionType for session consumption tracking.
 */
export const APPOINTMENT_TYPES = [
  'CHECK_IN',           // → CLINICIAN_FOLLOWUP
  'CONSULTATION',       // → CLINICIAN_INITIAL  
  'TRAINING_SESSION',   // → FITNESS_SESSION
  'ONBOARDING',         // → No session consumed
  'RECOVERY_SESSION',   // → RECOVERY_SESSION (unlimited)
  'LABWORK',            // → LABWORK
  'DXA_SCAN',           // → DXA_SCAN
  'SLEEP_SCREENING',    // → SLEEP_SCREENING
] as const;

export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];

export const AppointmentTypeSchema = z.enum(APPOINTMENT_TYPES);

/** Centralized appointment type constants for equality checks */
export const APPOINTMENT_TYPE = {
  CHECK_IN: 'CHECK_IN',
  CONSULTATION: 'CONSULTATION',
  TRAINING_SESSION: 'TRAINING_SESSION',
  ONBOARDING: 'ONBOARDING',
  RECOVERY_SESSION: 'RECOVERY_SESSION',
  LABWORK: 'LABWORK',
  DXA_SCAN: 'DXA_SCAN',
  SLEEP_SCREENING: 'SLEEP_SCREENING',
} as const satisfies Record<AppointmentType, AppointmentType>;

/** Human-readable labels for appointment types */
export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  CHECK_IN: 'Check-In',
  CONSULTATION: 'Consultation',
  TRAINING_SESSION: 'Training Session',
  ONBOARDING: 'Onboarding',
  RECOVERY_SESSION: 'Recovery Session',
  LABWORK: 'Lab Work',
  DXA_SCAN: 'DXA Scan',
  SLEEP_SCREENING: 'Sleep Screening',
};

/**
 * Check if a string is a valid appointment type
 */
export function isAppointmentType(value: string): value is AppointmentType {
  return (APPOINTMENT_TYPES as readonly string[]).includes(value);
}

// ============================================================================
// BOOKING STEPS
// ============================================================================

/**
 * Steps in the appointment booking flow.
 * Used by mobile app to track wizard progress.
 */
export const BOOKING_STEPS = ['provider', 'type', 'datetime', 'confirm'] as const;

export type BookingStep = (typeof BOOKING_STEPS)[number];

export const BookingStepSchema = z.enum(BOOKING_STEPS);

/** Centralized booking step constants for equality checks */
export const BOOKING_STEP = {
  PROVIDER: 'provider' as BookingStep,
  TYPE: 'type' as BookingStep,
  DATETIME: 'datetime' as BookingStep,
  CONFIRM: 'confirm' as BookingStep,
} as const;

/** Human-readable labels for booking steps */
export const BOOKING_STEP_LABELS: Record<BookingStep, string> = {
  provider: 'Select Provider',
  type: 'Select Type',
  datetime: 'Select Date & Time',
  confirm: 'Confirm Booking',
};

/**
 * Check if a string is a valid booking step
 */
export function isBookingStep(value: string): value is BookingStep {
  return (BOOKING_STEPS as readonly string[]).includes(value);
}

// ============================================================================
// Admin Booking Flow (includes patient selection as first step)
// ============================================================================

/**
 * Steps in the admin appointment booking flow.
 * Admin flow includes patient selection as the first step.
 */
export const ADMIN_BOOKING_STEPS = ['patient', 'provider', 'type', 'datetime', 'confirm'] as const;

export type AdminBookingStep = (typeof ADMIN_BOOKING_STEPS)[number];

export const AdminBookingStepSchema = z.enum(ADMIN_BOOKING_STEPS);

/** Centralized admin booking step constants for equality checks */
export const ADMIN_BOOKING_STEP = {
  PATIENT: 'patient' as AdminBookingStep,
  PROVIDER: 'provider' as AdminBookingStep,
  TYPE: 'type' as AdminBookingStep,
  DATETIME: 'datetime' as AdminBookingStep,
  CONFIRM: 'confirm' as AdminBookingStep,
} as const;

/** Human-readable labels for admin booking steps */
export const ADMIN_BOOKING_STEP_LABELS: Record<AdminBookingStep, string> = {
  patient: 'Patient',
  provider: 'Provider',
  type: 'Type',
  datetime: 'Date/Time',
  confirm: 'Confirm',
};

/**
 * Check if a string is a valid admin booking step
 */
export function isAdminBookingStep(value: string): value is AdminBookingStep {
  return (ADMIN_BOOKING_STEPS as readonly string[]).includes(value);
}

// ============================================================================
// APPOINTMENT SCHEMA
// ============================================================================

export const PatientSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type PatientSummaryContract = z.infer<typeof PatientSummarySchema>;

export const AppointmentSchema = baseDocumentSchema.extend({
  id: z.string().optional(),
  patientId: z.string(),
  providerId: z.string(), // Admin/Clinician ID
  title: z.string(),
  description: z.string().optional(),
  startTime: isoTimestampSchema,
  endTime: isoTimestampSchema,
  status: AppointmentStatusSchema,
  type: AppointmentTypeSchema,
  meetingLink: z.string().url().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  /** Patient info included for admin booking lists */
  patient: PatientSummarySchema.optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const ProviderSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(USER_ROLES).optional(),
  avatarUrl: z.string().url().optional(),
  specialty: z.string().optional(),
});

export type ProviderSummaryContract = z.infer<typeof ProviderSummarySchema>;
