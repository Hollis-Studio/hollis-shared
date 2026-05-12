/**
 * @ai-context Shared appointment configuration between frontend and backend
 * Single source of truth for appointment types, durations, and timezone settings
 */
import { z } from 'zod';
import { AppointmentType } from './appointments.js';
/** Business timezone for Hollis Health (San Antonio, TX - Central Time) */
export declare const BUSINESS_TIMEZONE = "America/Chicago";
/** Business timezone abbreviations for display */
export declare const BUSINESS_TIMEZONE_ABBR: {
    standard: string;
    daylight: string;
};
/** Duration options in minutes for different appointment types */
export declare const APPOINTMENT_DURATIONS: Record<AppointmentType, number>;
/** Get duration for an appointment type */
export declare function getDurationForType(type: AppointmentType): number;
/** Time slot with timezone info */
export declare const TimeSlotSchema: z.ZodObject<{
    date: z.ZodString;
    time: z.ZodString;
    available: z.ZodBoolean;
    utcOffset: z.ZodString;
}, z.core.$strip>;
export type TimeSlotContract = z.infer<typeof TimeSlotSchema>;
/** Availability response includes timezone metadata */
export declare const AvailabilityResponseSchema: z.ZodObject<{
    slots: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        time: z.ZodString;
        available: z.ZodBoolean;
        utcOffset: z.ZodString;
    }, z.core.$strip>>;
    timezone: z.ZodString;
    timezoneAbbr: z.ZodString;
}, z.core.$strip>;
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;
//# sourceMappingURL=appointment-config.d.ts.map