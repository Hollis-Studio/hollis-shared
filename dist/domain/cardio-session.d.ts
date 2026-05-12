import { z } from "zod";
export declare const CardioIntervalSchema: z.ZodObject<{
    startTimeSec: z.ZodNumber;
    endTimeSec: z.ZodNumber;
    speedKmh: z.ZodNumber;
    inclinePercent: z.ZodNumber;
    resistance: z.ZodNullable<z.ZodNumber>;
    mets: z.ZodNumber;
    modality: z.ZodOptional<z.ZodString>;
    strokesPerMin: z.ZodOptional<z.ZodNumber>;
    strideRatePerMin: z.ZodOptional<z.ZodNumber>;
    stepsPerMin: z.ZodOptional<z.ZodNumber>;
    jumpsPerMin: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const CardioSessionDataSchema: z.ZodObject<{
    durationSeconds: z.ZodNumber;
    distanceKm: z.ZodNullable<z.ZodNumber>;
    avgSpeedKmh: z.ZodNullable<z.ZodNumber>;
    avgHeartRate: z.ZodNullable<z.ZodNumber>;
    maxHeartRate: z.ZodNullable<z.ZodNumber>;
    incline: z.ZodNullable<z.ZodNumber>;
    resistance: z.ZodNullable<z.ZodNumber>;
    caloriesBurned: z.ZodNullable<z.ZodNumber>;
    mets: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    intervals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        startTimeSec: z.ZodNumber;
        endTimeSec: z.ZodNumber;
        speedKmh: z.ZodNumber;
        inclinePercent: z.ZodNumber;
        resistance: z.ZodNullable<z.ZodNumber>;
        mets: z.ZodNumber;
        modality: z.ZodOptional<z.ZodString>;
        strokesPerMin: z.ZodOptional<z.ZodNumber>;
        strideRatePerMin: z.ZodOptional<z.ZodNumber>;
        stepsPerMin: z.ZodOptional<z.ZodNumber>;
        jumpsPerMin: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    z1Minutes: z.ZodOptional<z.ZodNumber>;
    z2Minutes: z.ZodOptional<z.ZodNumber>;
    z3Minutes: z.ZodOptional<z.ZodNumber>;
    z4Minutes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CardioInterval = z.infer<typeof CardioIntervalSchema>;
export type CardioSessionData = z.infer<typeof CardioSessionDataSchema>;
//# sourceMappingURL=cardio-session.d.ts.map