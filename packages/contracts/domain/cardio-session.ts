import { z } from "zod";

export const CardioIntervalSchema = z.object({
  startTimeSec: z.number().min(0),
  endTimeSec: z.number().min(0),
  speedKmh: z.number().min(0),
  inclinePercent: z.number().min(0).max(40),
  resistance: z.number().min(0).nullable(),
  mets: z.number().min(0),
  modality: z.string().optional(),
  strokesPerMin: z.number().min(0).optional(),
  strideRatePerMin: z.number().min(0).optional(),
  stepsPerMin: z.number().min(0).optional(),
  jumpsPerMin: z.number().min(0).optional(),
});

export const CardioSessionDataSchema = z.object({
  durationSeconds: z.number().min(1),
  distanceKm: z.number().min(0).nullable(),
  avgSpeedKmh: z.number().min(0).nullable(),
  avgHeartRate: z.number().int().min(30).max(250).nullable(),
  maxHeartRate: z.number().int().min(30).max(250).nullable(),
  incline: z.number().min(0).max(40).nullable(),
  resistance: z.number().min(0).nullable(),
  caloriesBurned: z.number().min(0).nullable(),
  mets: z.number().min(0).nullable().default(null),
  intervals: z.array(CardioIntervalSchema).optional(),
  z1Minutes: z.number().min(0).optional(),
  z2Minutes: z.number().min(0).optional(),
  z3Minutes: z.number().min(0).optional(),
  z4Minutes: z.number().min(0).optional(),
  // ── Machine-specific metrics (modality-profiled; null when not applicable) ──
  /** Total steps taken (stairmaster, elliptical). */
  steps: z.number().int().min(0).nullable().optional(),
  /** Floors / flights climbed (stairmaster). */
  floors: z.number().min(0).nullable().optional(),
  /** Total jumps (jump rope). */
  jumps: z.number().int().min(0).nullable().optional(),
  /** Average power output in watts (bike, rower). */
  avgWatts: z.number().min(0).nullable().optional(),
  /** Average stroke rate in strokes per minute (rower). */
  strokeRateSpm: z.number().min(0).nullable().optional(),
  /** Machine resistance level / gear setting (stairmaster, elliptical, bike). */
  level: z.number().min(0).nullable().optional(),
  /** Rowing split: seconds per 500m (logged or derived from distance + duration). */
  splitSecondsPer500m: z.number().min(0).nullable().optional(),
});

export type CardioInterval = z.infer<typeof CardioIntervalSchema>;
export type CardioSessionData = z.infer<typeof CardioSessionDataSchema>;
