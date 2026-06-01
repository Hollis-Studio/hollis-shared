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
    engineState: z.ZodOptional<z.ZodObject<{
        calibrationState: z.ZodEnum<{
            stable: "stable";
            no_data: "no_data";
            calibrating: "calibrating";
            provisional: "provisional";
        }>;
        rawBaselineKg: z.ZodNullable<z.ZodNumber>;
        capacityEstimateKg: z.ZodNullable<z.ZodNumber>;
        trainingMaxKg: z.ZodNullable<z.ZodNumber>;
        uncertaintyPct: z.ZodNullable<z.ZodNumber>;
        distinctSessionCount: z.ZodNumber;
        lastDecision: z.ZodOptional<z.ZodObject<{
            action: z.ZodEnum<{
                reduce: "reduce";
                maintain: "maintain";
                repeat: "repeat";
                progress: "progress";
                deload: "deload";
                calibrate: "calibrate";
            }>;
            confidence: z.ZodEnum<{
                low: "low";
                high: "high";
                medium: "medium";
            }>;
            targetSummary: z.ZodString;
            drivers: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                category: z.ZodEnum<{
                    context: "context";
                    performance: "performance";
                    cardio: "cardio";
                    equipment: "equipment";
                    effort: "effort";
                    fatigue: "fatigue";
                    consistency: "consistency";
                }>;
                direction: z.ZodEnum<{
                    neutral: "neutral";
                    up: "up";
                    down: "down";
                }>;
                weight: z.ZodNumber;
                contributionPct: z.ZodNumber;
                confidence: z.ZodEnum<{
                    low: "low";
                    high: "high";
                    medium: "medium";
                }>;
                reason: z.ZodString;
                tooltip: z.ZodString;
            }, z.core.$strip>>;
            generatedAt: z.ZodCoercedDate<unknown>;
            schemaVersion: z.ZodNumber;
        }, z.core.$strip>>;
        schemaVersion: z.ZodNumber;
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
    engineState: z.ZodOptional<z.ZodObject<{
        calibrationState: z.ZodEnum<{
            stable: "stable";
            no_data: "no_data";
            calibrating: "calibrating";
            provisional: "provisional";
        }>;
        rawBaselineKg: z.ZodNullable<z.ZodNumber>;
        capacityEstimateKg: z.ZodNullable<z.ZodNumber>;
        trainingMaxKg: z.ZodNullable<z.ZodNumber>;
        uncertaintyPct: z.ZodNullable<z.ZodNumber>;
        distinctSessionCount: z.ZodNumber;
        lastDecision: z.ZodOptional<z.ZodObject<{
            action: z.ZodEnum<{
                reduce: "reduce";
                maintain: "maintain";
                repeat: "repeat";
                progress: "progress";
                deload: "deload";
                calibrate: "calibrate";
            }>;
            confidence: z.ZodEnum<{
                low: "low";
                high: "high";
                medium: "medium";
            }>;
            targetSummary: z.ZodString;
            drivers: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                category: z.ZodEnum<{
                    context: "context";
                    performance: "performance";
                    cardio: "cardio";
                    equipment: "equipment";
                    effort: "effort";
                    fatigue: "fatigue";
                    consistency: "consistency";
                }>;
                direction: z.ZodEnum<{
                    neutral: "neutral";
                    up: "up";
                    down: "down";
                }>;
                weight: z.ZodNumber;
                contributionPct: z.ZodNumber;
                confidence: z.ZodEnum<{
                    low: "low";
                    high: "high";
                    medium: "medium";
                }>;
                reason: z.ZodString;
                tooltip: z.ZodString;
            }, z.core.$strip>>;
            generatedAt: z.ZodCoercedDate<unknown>;
            schemaVersion: z.ZodNumber;
        }, z.core.$strip>>;
        schemaVersion: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type BaselineEntry = z.infer<typeof BaselineEntrySchema>;
export type ProgressionBaseline = z.infer<typeof ProgressionBaselineSchema>;
export type CardioBaselineEntry = z.infer<typeof CardioBaselineEntrySchema>;
export type CardioBaseline = z.infer<typeof CardioBaselineSchema>;
//# sourceMappingURL=baseline.d.ts.map