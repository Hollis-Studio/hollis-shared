/**
 * @ai-context Shared appointment configuration between frontend and backend
 * Single source of truth for appointment types, durations, and timezone settings
 */

import { z } from 'zod';
import { AppointmentType } from './appointments.js';

/** Business timezone for Hollis Health (San Antonio, TX - Central Time) */
export const BUSINESS_TIMEZONE = 'America/Chicago';

/** Business timezone abbreviations for display */
export const BUSINESS_TIMEZONE_ABBR = {
  standard: 'CST',
  daylight: 'CDT',
};

/** Duration options in minutes for different appointment types */
export const APPOINTMENT_DURATIONS: Record<AppointmentType, number> = {
  CHECK_IN: 30,
  CONSULTATION: 60,
  TRAINING_SESSION: 60,
  ONBOARDING: 45,
  RECOVERY_SESSION: 60,  // Sauna, ice bath, red light
  LABWORK: 30,           // Blood draw
  DXA_SCAN: 30,          // Body composition scan
  SLEEP_SCREENING: 15,   // Device pickup/dropoff
};

/** Get duration for an appointment type */
export function getDurationForType(type: AppointmentType): number {
  return APPOINTMENT_DURATIONS[type];
}

/** Time slot with timezone info */
export const TimeSlotSchema = z.object({
  date: z.string(),
  time: z.string(),
  available: z.boolean(),
  utcOffset: z.string(),
});
export type TimeSlotContract = z.infer<typeof TimeSlotSchema>;

/** Availability response includes timezone metadata */
export const AvailabilityResponseSchema = z.object({
  slots: z.array(TimeSlotSchema),
  timezone: z.string(),
  timezoneAbbr: z.string(),
});
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;
