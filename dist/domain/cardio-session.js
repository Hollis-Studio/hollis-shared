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
});
//# sourceMappingURL=cardio-session.js.map