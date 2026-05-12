import { z } from "zod";
export declare const BaselineEntrySchema: z.ZodObject<{
    sessionId: z.ZodString;
    date: z.ZodCoercedDate<unknown>;
    weightKg: z.ZodNumber;
    reps: z.ZodNumber;
    rir: z.ZodNumber;
    e1rm: z.ZodNumber;
    e1rmFormula: z.ZodEnum<{
        epley: "epley";
        wathan: "wathan";
    }>;
    isOutlier: z.ZodBoolean;
    goEasier: z.ZodBoolean;
    sessionMix: z.ZodOptional<z.ZodObject<{
        s: z.ZodNumber;
        h: z.ZodNumber;
        e: z.ZodNumber;
    }, z.core.$strip>>;
    isMiss: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const ProgressionBaselineSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    userId: z.ZodString;
    currentE1RM_Kg: z.ZodNumber;
    topSetWeightKg: z.ZodNumber;
    topSetReps: z.ZodNumber;
    topSetRIR: z.ZodNumber;
    lastUpdated: z.ZodCoercedDate<unknown>;
    history: z.ZodArray<z.ZodObject<{
        sessionId: z.ZodString;
        date: z.ZodCoercedDate<unknown>;
        weightKg: z.ZodNumber;
        reps: z.ZodNumber;
        rir: z.ZodNumber;
        e1rm: z.ZodNumber;
        e1rmFormula: z.ZodEnum<{
            epley: "epley";
            wathan: "wathan";
        }>;
        isOutlier: z.ZodBoolean;
        goEasier: z.ZodBoolean;
        sessionMix: z.ZodOptional<z.ZodObject<{
            s: z.ZodNumber;
            h: z.ZodNumber;
            e: z.ZodNumber;
        }, z.core.$strip>>;
        isMiss: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    phaseExitE1RM_Kg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    phaseExitDate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    classMix: z.ZodOptional<z.ZodObject<{
        s: z.ZodNumber;
        h: z.ZodNumber;
        e: z.ZodNumber;
    }, z.core.$strip>>;
    trendE1RM_Kg: z.ZodOptional<z.ZodNumber>;
    trendTopSetWeightKg: z.ZodOptional<z.ZodNumber>;
    trendTopSetReps: z.ZodOptional<z.ZodNumber>;
    trendTopSetRIR: z.ZodOptional<z.ZodNumber>;
    missStreak: z.ZodOptional<z.ZodNumber>;
    autoDeloadPercent: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<0>, z.ZodLiteral<0.05>, z.ZodLiteral<0.1>]>>;
    plateauDeloadUntil: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    plateauDeloadReductionPercent: z.ZodOptional<z.ZodNumber>;
    lastPlateauAlertedAt: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    schemaVersion: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const CardioBaselineEntrySchema: z.ZodObject<{
    sessionId: z.ZodString;
    date: z.ZodCoercedDate<unknown>;
    durationSeconds: z.ZodNumber;
    distanceKm: z.ZodNullable<z.ZodNumber>;
    avgSpeedKmh: z.ZodNullable<z.ZodNumber>;
    paceSecondsPerKm: z.ZodNullable<z.ZodNumber>;
    avgHeartRate: z.ZodNullable<z.ZodNumber>;
    incline: z.ZodNullable<z.ZodNumber>;
    resistance: z.ZodNullable<z.ZodNumber>;
    mets: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    isOutlier: z.ZodBoolean;
    goEasier: z.ZodBoolean;
}, z.core.$strip>;
export declare const CardioBaselineSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    userId: z.ZodString;
    bestDurationSeconds: z.ZodNumber;
    bestDistanceKm: z.ZodNullable<z.ZodNumber>;
    bestPaceSecondsPerKm: z.ZodNullable<z.ZodNumber>;
    bestMETs: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    lowestHRAtPace: z.ZodNullable<z.ZodNumber>;
    lastDurationSeconds: z.ZodNumber;
    lastDistanceKm: z.ZodNullable<z.ZodNumber>;
    lastAvgSpeedKmh: z.ZodNullable<z.ZodNumber>;
    lastPaceSecondsPerKm: z.ZodNullable<z.ZodNumber>;
    lastIncline: z.ZodNullable<z.ZodNumber>;
    lastResistance: z.ZodNullable<z.ZodNumber>;
    lastAvgHeartRate: z.ZodNullable<z.ZodNumber>;
    lastUpdated: z.ZodCoercedDate<unknown>;
    history: z.ZodArray<z.ZodObject<{
        sessionId: z.ZodString;
        date: z.ZodCoercedDate<unknown>;
        durationSeconds: z.ZodNumber;
        distanceKm: z.ZodNullable<z.ZodNumber>;
        avgSpeedKmh: z.ZodNullable<z.ZodNumber>;
        paceSecondsPerKm: z.ZodNullable<z.ZodNumber>;
        avgHeartRate: z.ZodNullable<z.ZodNumber>;
        incline: z.ZodNullable<z.ZodNumber>;
        resistance: z.ZodNullable<z.ZodNumber>;
        mets: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
        isOutlier: z.ZodBoolean;
        goEasier: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BaselineEntry = z.infer<typeof BaselineEntrySchema>;
export type ProgressionBaseline = z.infer<typeof ProgressionBaselineSchema>;
export type CardioBaselineEntry = z.infer<typeof CardioBaselineEntrySchema>;
export type CardioBaseline = z.infer<typeof CardioBaselineSchema>;
//# sourceMappingURL=baseline.d.ts.map