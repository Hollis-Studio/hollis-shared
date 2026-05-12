import { z } from "zod";
export declare const MetricGateRejectReasonSchema: z.ZodEnum<{
    reps_out_of_range: "reps_out_of_range";
    rir_too_high: "rir_too_high";
    rir_missing: "rir_missing";
    insufficient_qualifying_sets: "insufficient_qualifying_sets";
}>;
export declare const GatedE1RMSampleSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    sessionId: z.ZodString;
    setIndex: z.ZodNumber;
    weightKg: z.ZodNumber;
    reps: z.ZodNumber;
    rir: z.ZodNumber;
    e1rmKg: z.ZodNumber;
    recordedAt: z.ZodCoercedDate<unknown>;
    qualifying: z.ZodBoolean;
    gateReason: z.ZodOptional<z.ZodEnum<{
        reps_out_of_range: "reps_out_of_range";
        rir_too_high: "rir_too_high";
        rir_missing: "rir_missing";
        insufficient_qualifying_sets: "insufficient_qualifying_sets";
    }>>;
}, z.core.$strip>;
export declare const BestQualifyingSetSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    windowDays: z.ZodNumber;
    weightKg: z.ZodNumber;
    reps: z.ZodNumber;
    rir: z.ZodNumber;
    sessionId: z.ZodString;
    setIndex: z.ZodNumber;
    recordedAt: z.ZodCoercedDate<unknown>;
    e1rmKg: z.ZodNumber;
}, z.core.$strip>;
export declare const WeeklyHardSetsEntrySchema: z.ZodObject<{
    muscleGroup: z.ZodEnum<{
        chest: "chest";
        back: "back";
        shoulders: "shoulders";
        biceps: "biceps";
        triceps: "triceps";
        forearms: "forearms";
        quadriceps: "quadriceps";
        hamstrings: "hamstrings";
        glutes: "glutes";
        calves: "calves";
        core: "core";
        traps: "traps";
        lats: "lats";
        anterior_deltoids: "anterior_deltoids";
        lateral_deltoids: "lateral_deltoids";
        posterior_deltoids: "posterior_deltoids";
        hip_flexors: "hip_flexors";
        adductors: "adductors";
        abductors: "abductors";
        neck: "neck";
        obliques: "obliques";
        lower_back: "lower_back";
        upper_back: "upper_back";
    }>;
    weekStart: z.ZodCoercedDate<unknown>;
    hardSetCount: z.ZodNumber;
    totalSetCount: z.ZodNumber;
}, z.core.$strip>;
export declare const RelativeStrengthScoreSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    recordedAt: z.ZodCoercedDate<unknown>;
    e1rmKg: z.ZodNumber;
    bodyWeightKg: z.ZodNumber;
    score: z.ZodNumber;
    bodyWeightSourceAgeDays: z.ZodNumber;
}, z.core.$strip>;
export declare const RepRangePivotSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    detectedAt: z.ZodCoercedDate<unknown>;
    priorMedianReps: z.ZodNumber;
    currentMedianReps: z.ZodNumber;
    deltaReps: z.ZodNumber;
    windowDays: z.ZodLiteral<28>;
    acknowledged: z.ZodBoolean;
}, z.core.$strip>;
export declare const ConfidenceBandSchema: z.ZodObject<{
    value: z.ZodNumber;
    lowerKg: z.ZodNumber;
    upperKg: z.ZodNumber;
    sampleCount: z.ZodNumber;
    widthKg: z.ZodNumber;
}, z.core.$strip>;
export declare const MetricBasketSnapshotSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    capturedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    e1rmGated: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        current: z.ZodNumber;
        band: z.ZodObject<{
            value: z.ZodNumber;
            lowerKg: z.ZodNumber;
            upperKg: z.ZodNumber;
            sampleCount: z.ZodNumber;
            widthKg: z.ZodNumber;
        }, z.core.$strip>;
        samples: z.ZodNumber;
    }, z.core.$strip>>>;
    bestQualifyingSet: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        exerciseId: z.ZodString;
        windowDays: z.ZodNumber;
        weightKg: z.ZodNumber;
        reps: z.ZodNumber;
        rir: z.ZodNumber;
        sessionId: z.ZodString;
        setIndex: z.ZodNumber;
        recordedAt: z.ZodCoercedDate<unknown>;
        e1rmKg: z.ZodNumber;
    }, z.core.$strip>>>;
    relativeStrengthScore: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        exerciseId: z.ZodString;
        recordedAt: z.ZodCoercedDate<unknown>;
        e1rmKg: z.ZodNumber;
        bodyWeightKg: z.ZodNumber;
        score: z.ZodNumber;
        bodyWeightSourceAgeDays: z.ZodNumber;
    }, z.core.$strip>>>;
    repRangePivot: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        exerciseId: z.ZodString;
        detectedAt: z.ZodCoercedDate<unknown>;
        priorMedianReps: z.ZodNumber;
        currentMedianReps: z.ZodNumber;
        deltaReps: z.ZodNumber;
        windowDays: z.ZodLiteral<28>;
        acknowledged: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type GatedE1RMSample = z.infer<typeof GatedE1RMSampleSchema>;
export type BestQualifyingSet = z.infer<typeof BestQualifyingSetSchema>;
export type WeeklyHardSetsEntry = z.infer<typeof WeeklyHardSetsEntrySchema>;
export type RelativeStrengthScore = z.infer<typeof RelativeStrengthScoreSchema>;
export type RepRangePivot = z.infer<typeof RepRangePivotSchema>;
export type ConfidenceBand = z.infer<typeof ConfidenceBandSchema>;
export type MetricBasketSnapshot = z.infer<typeof MetricBasketSnapshotSchema>;
//# sourceMappingURL=metrics.d.ts.map