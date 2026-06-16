import { z } from "zod";
export declare const PROGRAM_PHASES: readonly ["hypertrophy", "strength", "peaking", "deload", "maintenance"];
export declare const ProgramPhaseSchema: z.ZodEnum<{
    strength: "strength";
    hypertrophy: "hypertrophy";
    peaking: "peaking";
    deload: "deload";
    maintenance: "maintenance";
}>;
export type ProgramPhase = z.infer<typeof ProgramPhaseSchema>;
export declare const RepClassSchema: z.ZodEnum<{
    S: "S";
    H: "H";
    E: "E";
}>;
export type RepClass = z.infer<typeof RepClassSchema>;
export declare const CanonicalizationStatusSchema: z.ZodEnum<{
    matched: "matched";
    unmatched: "unmatched";
    ignored: "ignored";
}>;
export type CanonicalizationStatus = z.infer<typeof CanonicalizationStatusSchema>;
export declare const ExerciseTrackingModeSchema: z.ZodEnum<{
    reps: "reps";
    cardio: "cardio";
    timed: "timed";
    stretch: "stretch";
}>;
export type ExerciseTrackingMode = z.infer<typeof ExerciseTrackingModeSchema>;
/**
 * The mutually-exclusive classification a logged working set produces, judged
 * against the target the user actually saw. Shared by in-session adaptation,
 * persisted set flags, and post-workout judgment so "intentionally easier",
 * "fatigue miss", "true overperformance", and "probably bad data" stay distinct.
 */
export declare const SetSignalSchema: z.ZodEnum<{
    on_target: "on_target";
    overperformance: "overperformance";
    fatigue_miss: "fatigue_miss";
    intentionally_easier: "intentionally_easier";
    suspected_misinput: "suspected_misinput";
}>;
export type SetSignal = z.infer<typeof SetSignalSchema>;
/**
 * Optional one-tap user-reported effort for a working set ("how'd that feel?").
 * Mass-market alternative to a numeric RIR/RPE scale: inferred effort is the
 * default, this is an explicit override the user can tap. Maps onto adaptation
 * headroom (easy → surplus, hard → low headroom) without exposing a numeric scale.
 */
export declare const PerceivedEffortSchema: z.ZodEnum<{
    easy: "easy";
    right: "right";
    hard: "hard";
}>;
export type PerceivedEffort = z.infer<typeof PerceivedEffortSchema>;
/**
 * A snapshot of the prescription a set was judged against. Persisted on the set
 * (the target the user actually faced after live adaptation) and on the exercise
 * (the original, pre-adaptation plan — see SessionExercise.originalTargets).
 */
export declare const SetTargetSnapshotSchema: z.ZodObject<{
    setNumber: z.ZodNumber;
    weightKg: z.ZodNullable<z.ZodNumber>;
    reps: z.ZodNumber;
    rir: z.ZodNumber;
    durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    distanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    paceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isWarmup: z.ZodBoolean;
}, z.core.$strip>;
export type SetTargetSnapshot = z.infer<typeof SetTargetSnapshotSchema>;
/**
 * One in-session target adaptation, recorded for the audit trail and undo. The
 * remaining targets are recomputed from originalTargets + confirmed sets rather
 * than from these events, so an event is a durable record of what changed and why.
 */
export declare const AdaptationEventSchema: z.ZodObject<{
    setIndex: z.ZodNumber;
    signal: z.ZodEnum<{
        on_target: "on_target";
        overperformance: "overperformance";
        fatigue_miss: "fatigue_miss";
        intentionally_easier: "intentionally_easier";
        suspected_misinput: "suspected_misinput";
    }>;
    reason: z.ZodNullable<z.ZodString>;
    occurredAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type AdaptationEvent = z.infer<typeof AdaptationEventSchema>;
export declare const SessionSetSchema: z.ZodObject<{
    setNumber: z.ZodNumber;
    weightKg: z.ZodNumber;
    reps: z.ZodNumber;
    rir: z.ZodNumber;
    durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isWarmup: z.ZodBoolean;
    isOutlier: z.ZodBoolean;
    completedAt: z.ZodCoercedDate<unknown>;
    isConfirmed: z.ZodOptional<z.ZodBoolean>;
    skipped: z.ZodOptional<z.ZodBoolean>;
    restAfterSec: z.ZodNullable<z.ZodNumber>;
    setType: z.ZodDefault<z.ZodEnum<{
        normal: "normal";
        warmup: "warmup";
        drop_set: "drop_set";
        rest_pause: "rest_pause";
        superset: "superset";
    }>>;
    setGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    side: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        right: "right";
        left: "left";
    }>>>;
    originExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    repClass: z.ZodOptional<z.ZodEnum<{
        S: "S";
        H: "H";
        E: "E";
    }>>;
    isMiss: z.ZodOptional<z.ZodBoolean>;
    target: z.ZodOptional<z.ZodObject<{
        setNumber: z.ZodNumber;
        weightKg: z.ZodNullable<z.ZodNumber>;
        reps: z.ZodNumber;
        rir: z.ZodNumber;
        durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        distanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        paceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        isWarmup: z.ZodBoolean;
    }, z.core.$strip>>;
    signal: z.ZodOptional<z.ZodEnum<{
        on_target: "on_target";
        overperformance: "overperformance";
        fatigue_miss: "fatigue_miss";
        intentionally_easier: "intentionally_easier";
        suspected_misinput: "suspected_misinput";
    }>>;
    perceivedEffort: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        easy: "easy";
        right: "right";
        hard: "hard";
    }>>>;
    isSuspectedMisinput: z.ZodOptional<z.ZodBoolean>;
    leftReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rightReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    leftWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rightWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export declare const StretchSetSchema: z.ZodObject<{
    setNumber: z.ZodNumber;
    holdDurationSeconds: z.ZodNumber;
    side: z.ZodEnum<{
        right: "right";
        left: "left";
        both: "both";
    }>;
    completedAt: z.ZodCoercedDate<unknown>;
    isOutlier: z.ZodBoolean;
}, z.core.$strip>;
export declare const StretchSessionDataSchema: z.ZodObject<{
    sets: z.ZodArray<z.ZodObject<{
        setNumber: z.ZodNumber;
        holdDurationSeconds: z.ZodNumber;
        side: z.ZodEnum<{
            right: "right";
            left: "left";
            both: "both";
        }>;
        completedAt: z.ZodCoercedDate<unknown>;
        isOutlier: z.ZodBoolean;
    }, z.core.$strip>>;
    totalDurationSeconds: z.ZodNumber;
}, z.core.$strip>;
export declare const SessionExerciseSchema: z.ZodObject<{
    slotId: z.ZodOptional<z.ZodString>;
    canonicalExerciseId: z.ZodNullable<z.ZodString>;
    freestyleName: z.ZodNullable<z.ZodString>;
    freestyleMuscleGroups: z.ZodNullable<z.ZodArray<z.ZodEnum<{
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
    }>>>;
    gymExerciseInstanceId: z.ZodNullable<z.ZodString>;
    order: z.ZodNumber;
    sets: z.ZodArray<z.ZodObject<{
        setNumber: z.ZodNumber;
        weightKg: z.ZodNumber;
        reps: z.ZodNumber;
        rir: z.ZodNumber;
        durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        isWarmup: z.ZodBoolean;
        isOutlier: z.ZodBoolean;
        completedAt: z.ZodCoercedDate<unknown>;
        isConfirmed: z.ZodOptional<z.ZodBoolean>;
        skipped: z.ZodOptional<z.ZodBoolean>;
        restAfterSec: z.ZodNullable<z.ZodNumber>;
        setType: z.ZodDefault<z.ZodEnum<{
            normal: "normal";
            warmup: "warmup";
            drop_set: "drop_set";
            rest_pause: "rest_pause";
            superset: "superset";
        }>>;
        setGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        side: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            right: "right";
            left: "left";
        }>>>;
        originExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        repClass: z.ZodOptional<z.ZodEnum<{
            S: "S";
            H: "H";
            E: "E";
        }>>;
        isMiss: z.ZodOptional<z.ZodBoolean>;
        target: z.ZodOptional<z.ZodObject<{
            setNumber: z.ZodNumber;
            weightKg: z.ZodNullable<z.ZodNumber>;
            reps: z.ZodNumber;
            rir: z.ZodNumber;
            durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            distanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            paceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            isWarmup: z.ZodBoolean;
        }, z.core.$strip>>;
        signal: z.ZodOptional<z.ZodEnum<{
            on_target: "on_target";
            overperformance: "overperformance";
            fatigue_miss: "fatigue_miss";
            intentionally_easier: "intentionally_easier";
            suspected_misinput: "suspected_misinput";
        }>>;
        perceivedEffort: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            easy: "easy";
            right: "right";
            hard: "hard";
        }>>>;
        isSuspectedMisinput: z.ZodOptional<z.ZodBoolean>;
        leftReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rightReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        leftWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rightWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>;
    isFromProgram: z.ZodBoolean;
    canonicalizationStatus: z.ZodEnum<{
        matched: "matched";
        unmatched: "unmatched";
        ignored: "ignored";
    }>;
    cardioData: z.ZodDefault<z.ZodNullable<z.ZodObject<{
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
    }, z.core.$strip>>>;
    stretchData: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        sets: z.ZodArray<z.ZodObject<{
            setNumber: z.ZodNumber;
            holdDurationSeconds: z.ZodNumber;
            side: z.ZodEnum<{
                right: "right";
                left: "left";
                both: "both";
            }>;
            completedAt: z.ZodCoercedDate<unknown>;
            isOutlier: z.ZodBoolean;
        }, z.core.$strip>>;
        totalDurationSeconds: z.ZodNumber;
    }, z.core.$strip>>>;
    trackingMode: z.ZodOptional<z.ZodEnum<{
        reps: "reps";
        cardio: "cardio";
        timed: "timed";
        stretch: "stretch";
    }>>;
    originalTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        setNumber: z.ZodNumber;
        weightKg: z.ZodNullable<z.ZodNumber>;
        reps: z.ZodNumber;
        rir: z.ZodNumber;
        durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        distanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        paceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        isWarmup: z.ZodBoolean;
    }, z.core.$strip>>>;
    adaptationEvents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        setIndex: z.ZodNumber;
        signal: z.ZodEnum<{
            on_target: "on_target";
            overperformance: "overperformance";
            fatigue_miss: "fatigue_miss";
            intentionally_easier: "intentionally_easier";
            suspected_misinput: "suspected_misinput";
        }>;
        reason: z.ZodNullable<z.ZodString>;
        occurredAt: z.ZodCoercedDate<unknown>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const QuestionnaireResponseSchema: z.ZodObject<{
    sleepHours: z.ZodNumber;
    sleepQuality: z.ZodNumber;
    energyLevel: z.ZodNumber;
    stressLevel: z.ZodNumber;
    sorenessLevel: z.ZodNumber;
    hitMacrosYesterday: z.ZodBoolean;
    hydrationLevel: z.ZodNumber;
    goEasier: z.ZodBoolean;
    goEasierOverridePercent: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    autoFilledSleep: z.ZodBoolean;
    restingHeartRate: z.ZodOptional<z.ZodNumber>;
    hrv: z.ZodOptional<z.ZodNumber>;
    bodyWeightKg: z.ZodOptional<z.ZodNumber>;
    dietaryCalories: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const ActiveTrainingSessionLogSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    programId: z.ZodNullable<z.ZodString>;
    programDayName: z.ZodNullable<z.ZodString>;
    gymProfileId: z.ZodNullable<z.ZodString>;
    startedAt: z.ZodCoercedDate<unknown>;
    completedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    isFreestyle: z.ZodBoolean;
    isSubstitution: z.ZodBoolean;
    status: z.ZodEnum<{
        active: "active";
        completed: "completed";
        abandoned: "abandoned";
    }>;
    questionnaire: z.ZodObject<{
        sleepHours: z.ZodNumber;
        sleepQuality: z.ZodNumber;
        energyLevel: z.ZodNumber;
        stressLevel: z.ZodNumber;
        sorenessLevel: z.ZodNumber;
        hitMacrosYesterday: z.ZodBoolean;
        hydrationLevel: z.ZodNumber;
        goEasier: z.ZodBoolean;
        goEasierOverridePercent: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
        autoFilledSleep: z.ZodBoolean;
        restingHeartRate: z.ZodOptional<z.ZodNumber>;
        hrv: z.ZodOptional<z.ZodNumber>;
        bodyWeightKg: z.ZodOptional<z.ZodNumber>;
        dietaryCalories: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    totalVolumeKg: z.ZodNumber;
    durationMinutes: z.ZodNumber;
    untrackedVolume: z.ZodOptional<z.ZodNumber>;
    aiOutlierLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    schemaVersion: z.ZodOptional<z.ZodNumber>;
    programPhase: z.ZodOptional<z.ZodEnum<{
        strength: "strength";
        hypertrophy: "hypertrophy";
        peaking: "peaking";
        deload: "deload";
        maintenance: "maintenance";
    }>>;
    skippedExerciseIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    exercises: z.ZodArray<z.ZodObject<{
        slotId: z.ZodOptional<z.ZodString>;
        canonicalExerciseId: z.ZodNullable<z.ZodString>;
        freestyleName: z.ZodNullable<z.ZodString>;
        freestyleMuscleGroups: z.ZodNullable<z.ZodArray<z.ZodEnum<{
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
        }>>>;
        gymExerciseInstanceId: z.ZodNullable<z.ZodString>;
        order: z.ZodNumber;
        sets: z.ZodArray<z.ZodObject<{
            setNumber: z.ZodNumber;
            weightKg: z.ZodNumber;
            reps: z.ZodNumber;
            rir: z.ZodNumber;
            durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            isWarmup: z.ZodBoolean;
            isOutlier: z.ZodBoolean;
            completedAt: z.ZodCoercedDate<unknown>;
            isConfirmed: z.ZodOptional<z.ZodBoolean>;
            skipped: z.ZodOptional<z.ZodBoolean>;
            restAfterSec: z.ZodNullable<z.ZodNumber>;
            setType: z.ZodDefault<z.ZodEnum<{
                normal: "normal";
                warmup: "warmup";
                drop_set: "drop_set";
                rest_pause: "rest_pause";
                superset: "superset";
            }>>;
            setGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            side: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                right: "right";
                left: "left";
            }>>>;
            originExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            repClass: z.ZodOptional<z.ZodEnum<{
                S: "S";
                H: "H";
                E: "E";
            }>>;
            isMiss: z.ZodOptional<z.ZodBoolean>;
            target: z.ZodOptional<z.ZodObject<{
                setNumber: z.ZodNumber;
                weightKg: z.ZodNullable<z.ZodNumber>;
                reps: z.ZodNumber;
                rir: z.ZodNumber;
                durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                distanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                paceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                isWarmup: z.ZodBoolean;
            }, z.core.$strip>>;
            signal: z.ZodOptional<z.ZodEnum<{
                on_target: "on_target";
                overperformance: "overperformance";
                fatigue_miss: "fatigue_miss";
                intentionally_easier: "intentionally_easier";
                suspected_misinput: "suspected_misinput";
            }>>;
            perceivedEffort: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                easy: "easy";
                right: "right";
                hard: "hard";
            }>>>;
            isSuspectedMisinput: z.ZodOptional<z.ZodBoolean>;
            leftReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            rightReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            leftWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            rightWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>;
        isFromProgram: z.ZodBoolean;
        canonicalizationStatus: z.ZodEnum<{
            matched: "matched";
            unmatched: "unmatched";
            ignored: "ignored";
        }>;
        cardioData: z.ZodDefault<z.ZodNullable<z.ZodObject<{
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
        }, z.core.$strip>>>;
        stretchData: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            sets: z.ZodArray<z.ZodObject<{
                setNumber: z.ZodNumber;
                holdDurationSeconds: z.ZodNumber;
                side: z.ZodEnum<{
                    right: "right";
                    left: "left";
                    both: "both";
                }>;
                completedAt: z.ZodCoercedDate<unknown>;
                isOutlier: z.ZodBoolean;
            }, z.core.$strip>>;
            totalDurationSeconds: z.ZodNumber;
        }, z.core.$strip>>>;
        trackingMode: z.ZodOptional<z.ZodEnum<{
            reps: "reps";
            cardio: "cardio";
            timed: "timed";
            stretch: "stretch";
        }>>;
        originalTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            setNumber: z.ZodNumber;
            weightKg: z.ZodNullable<z.ZodNumber>;
            reps: z.ZodNumber;
            rir: z.ZodNumber;
            durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            distanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            paceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            isWarmup: z.ZodBoolean;
        }, z.core.$strip>>>;
        adaptationEvents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            setIndex: z.ZodNumber;
            signal: z.ZodEnum<{
                on_target: "on_target";
                overperformance: "overperformance";
                fatigue_miss: "fatigue_miss";
                intentionally_easier: "intentionally_easier";
                suspected_misinput: "suspected_misinput";
            }>;
            reason: z.ZodNullable<z.ZodString>;
            occurredAt: z.ZodCoercedDate<unknown>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const TrainingSessionLogSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    programId: z.ZodNullable<z.ZodString>;
    programDayName: z.ZodNullable<z.ZodString>;
    gymProfileId: z.ZodNullable<z.ZodString>;
    startedAt: z.ZodCoercedDate<unknown>;
    completedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    isFreestyle: z.ZodBoolean;
    isSubstitution: z.ZodBoolean;
    status: z.ZodEnum<{
        active: "active";
        completed: "completed";
        abandoned: "abandoned";
    }>;
    questionnaire: z.ZodObject<{
        sleepHours: z.ZodNumber;
        sleepQuality: z.ZodNumber;
        energyLevel: z.ZodNumber;
        stressLevel: z.ZodNumber;
        sorenessLevel: z.ZodNumber;
        hitMacrosYesterday: z.ZodBoolean;
        hydrationLevel: z.ZodNumber;
        goEasier: z.ZodBoolean;
        goEasierOverridePercent: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
        autoFilledSleep: z.ZodBoolean;
        restingHeartRate: z.ZodOptional<z.ZodNumber>;
        hrv: z.ZodOptional<z.ZodNumber>;
        bodyWeightKg: z.ZodOptional<z.ZodNumber>;
        dietaryCalories: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    totalVolumeKg: z.ZodNumber;
    durationMinutes: z.ZodNumber;
    untrackedVolume: z.ZodOptional<z.ZodNumber>;
    aiOutlierLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    schemaVersion: z.ZodOptional<z.ZodNumber>;
    programPhase: z.ZodOptional<z.ZodEnum<{
        strength: "strength";
        hypertrophy: "hypertrophy";
        peaking: "peaking";
        deload: "deload";
        maintenance: "maintenance";
    }>>;
    skippedExerciseIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    exercises: z.ZodArray<z.ZodObject<{
        slotId: z.ZodOptional<z.ZodString>;
        canonicalExerciseId: z.ZodNullable<z.ZodString>;
        freestyleName: z.ZodNullable<z.ZodString>;
        freestyleMuscleGroups: z.ZodNullable<z.ZodArray<z.ZodEnum<{
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
        }>>>;
        gymExerciseInstanceId: z.ZodNullable<z.ZodString>;
        order: z.ZodNumber;
        sets: z.ZodArray<z.ZodObject<{
            setNumber: z.ZodNumber;
            weightKg: z.ZodNumber;
            reps: z.ZodNumber;
            rir: z.ZodNumber;
            durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            isWarmup: z.ZodBoolean;
            isOutlier: z.ZodBoolean;
            completedAt: z.ZodCoercedDate<unknown>;
            isConfirmed: z.ZodOptional<z.ZodBoolean>;
            skipped: z.ZodOptional<z.ZodBoolean>;
            restAfterSec: z.ZodNullable<z.ZodNumber>;
            setType: z.ZodDefault<z.ZodEnum<{
                normal: "normal";
                warmup: "warmup";
                drop_set: "drop_set";
                rest_pause: "rest_pause";
                superset: "superset";
            }>>;
            setGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            side: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                right: "right";
                left: "left";
            }>>>;
            originExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            repClass: z.ZodOptional<z.ZodEnum<{
                S: "S";
                H: "H";
                E: "E";
            }>>;
            isMiss: z.ZodOptional<z.ZodBoolean>;
            target: z.ZodOptional<z.ZodObject<{
                setNumber: z.ZodNumber;
                weightKg: z.ZodNullable<z.ZodNumber>;
                reps: z.ZodNumber;
                rir: z.ZodNumber;
                durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                distanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                paceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                isWarmup: z.ZodBoolean;
            }, z.core.$strip>>;
            signal: z.ZodOptional<z.ZodEnum<{
                on_target: "on_target";
                overperformance: "overperformance";
                fatigue_miss: "fatigue_miss";
                intentionally_easier: "intentionally_easier";
                suspected_misinput: "suspected_misinput";
            }>>;
            perceivedEffort: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
                easy: "easy";
                right: "right";
                hard: "hard";
            }>>>;
            isSuspectedMisinput: z.ZodOptional<z.ZodBoolean>;
            leftReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            rightReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            leftWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            rightWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>;
        isFromProgram: z.ZodBoolean;
        canonicalizationStatus: z.ZodEnum<{
            matched: "matched";
            unmatched: "unmatched";
            ignored: "ignored";
        }>;
        cardioData: z.ZodDefault<z.ZodNullable<z.ZodObject<{
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
        }, z.core.$strip>>>;
        stretchData: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            sets: z.ZodArray<z.ZodObject<{
                setNumber: z.ZodNumber;
                holdDurationSeconds: z.ZodNumber;
                side: z.ZodEnum<{
                    right: "right";
                    left: "left";
                    both: "both";
                }>;
                completedAt: z.ZodCoercedDate<unknown>;
                isOutlier: z.ZodBoolean;
            }, z.core.$strip>>;
            totalDurationSeconds: z.ZodNumber;
        }, z.core.$strip>>>;
        trackingMode: z.ZodOptional<z.ZodEnum<{
            reps: "reps";
            cardio: "cardio";
            timed: "timed";
            stretch: "stretch";
        }>>;
        originalTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            setNumber: z.ZodNumber;
            weightKg: z.ZodNullable<z.ZodNumber>;
            reps: z.ZodNumber;
            rir: z.ZodNumber;
            durationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            distanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            paceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            isWarmup: z.ZodBoolean;
        }, z.core.$strip>>>;
        adaptationEvents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            setIndex: z.ZodNumber;
            signal: z.ZodEnum<{
                on_target: "on_target";
                overperformance: "overperformance";
                fatigue_miss: "fatigue_miss";
                intentionally_easier: "intentionally_easier";
                suspected_misinput: "suspected_misinput";
            }>;
            reason: z.ZodNullable<z.ZodString>;
            occurredAt: z.ZodCoercedDate<unknown>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type StretchSet = z.infer<typeof StretchSetSchema>;
export type StretchSessionData = z.infer<typeof StretchSessionDataSchema>;
export type SessionSet = z.infer<typeof SessionSetSchema>;
export type SessionExercise = z.infer<typeof SessionExerciseSchema>;
export type QuestionnaireResponse = z.infer<typeof QuestionnaireResponseSchema>;
export type ActiveTrainingSessionLog = z.infer<typeof ActiveTrainingSessionLogSchema>;
export type TrainingSessionLog = z.infer<typeof TrainingSessionLogSchema>;
//# sourceMappingURL=training-session-log.d.ts.map