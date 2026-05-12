/**
 * @ai-context Sleep domain contracts | sleep entry form validation schemas
 *
 * This module provides Zod schemas for validating sleep-related form inputs
 * in the web-admin.
 *
 * deps: zod | consumers: web-admin
 */
import { z } from "zod";
/**
 * Zod schema for validating sleep metric fields before API submission.
 * Validates parsed numeric values (not raw strings from form inputs).
 *
 * Range constraints match the existing manual validation in SleepEntryForm.
 *
 * @see web-admin/components/admin/SleepEntryForm.tsx
 */
export declare const sleepEntryFormSchema: z.ZodObject<{
    date: z.ZodString;
    sleepHours: z.ZodNumber;
    deepSleepPercent: z.ZodOptional<z.ZodNumber>;
    lightSleepPercent: z.ZodOptional<z.ZodNumber>;
    remSleepPercent: z.ZodOptional<z.ZodNumber>;
    awakeMinutes: z.ZodOptional<z.ZodNumber>;
    restingHeartRate: z.ZodOptional<z.ZodNumber>;
    sleepQuality: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type SleepEntryFormData = z.infer<typeof sleepEntryFormSchema>;
//# sourceMappingURL=sleep.d.ts.map