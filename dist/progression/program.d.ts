import { z } from "zod";
export declare const ProgramSetSchema: z.ZodObject<{
    setNumber: z.ZodNumber;
    targetWeightKg: z.ZodNullable<z.ZodNumber>;
    targetReps: z.ZodNumber;
    targetDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    targetRIR: z.ZodNumber;
    isWarmup: z.ZodBoolean;
    setType: z.ZodDefault<z.ZodEnum<{
        normal: "normal";
        warmup: "warmup";
        drop_set: "drop_set";
        rest_pause: "rest_pause";
        superset: "superset";
    }>>;
    setGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    originExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const CardioTargetsSchema: z.ZodObject<{
    targetDurationSeconds: z.ZodNullable<z.ZodNumber>;
    targetDistanceKm: z.ZodNullable<z.ZodNumber>;
    targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
    targetIncline: z.ZodNullable<z.ZodNumber>;
    targetResistance: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export declare const MaintenanceTargetSchema: z.ZodObject<{
    weightKg: z.ZodNumber;
    reps: z.ZodNumber;
}, z.core.$strip>;
export declare const ProgramExerciseSchema: z.ZodPipe<z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    order: z.ZodNumber;
    sets: z.ZodArray<z.ZodObject<{
        setNumber: z.ZodNumber;
        targetWeightKg: z.ZodNullable<z.ZodNumber>;
        targetReps: z.ZodNumber;
        targetDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        targetRIR: z.ZodNumber;
        isWarmup: z.ZodBoolean;
        setType: z.ZodDefault<z.ZodEnum<{
            normal: "normal";
            warmup: "warmup";
            drop_set: "drop_set";
            rest_pause: "rest_pause";
            superset: "superset";
        }>>;
        setGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        originExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    goalMode: z.ZodOptional<z.ZodEnum<{
        maintain: "maintain";
        progress: "progress";
        track_only: "track_only";
    }>>;
    useSmartProgress: z.ZodOptional<z.ZodBoolean>;
    progressionMode: z.ZodEnum<{
        weight_first: "weight_first";
        reps_first: "reps_first";
        duration_first: "duration_first";
    }>;
    repThresholdForWeightJump: z.ZodNullable<z.ZodNumber>;
    cardioTargets: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        targetDurationSeconds: z.ZodNullable<z.ZodNumber>;
        targetDistanceKm: z.ZodNullable<z.ZodNumber>;
        targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
        targetIncline: z.ZodNullable<z.ZodNumber>;
        targetResistance: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>>;
    maintenanceTarget: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        weightKg: z.ZodNumber;
        reps: z.ZodNumber;
    }, z.core.$strip>>>;
    cardioMaintenanceTarget: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        targetDurationSeconds: z.ZodNullable<z.ZodNumber>;
        targetDistanceKm: z.ZodNullable<z.ZodNumber>;
        targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
        targetIncline: z.ZodNullable<z.ZodNumber>;
        targetResistance: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>>;
    priorityLevel: z.ZodOptional<z.ZodEnum<{
        primary: "primary";
        secondary: "secondary";
        supporting: "supporting";
    }>>;
}, z.core.$strip>, z.ZodTransform<{
    readonly goalMode: "maintain" | "progress" | "track_only";
    readonly canonicalExerciseId: string;
    readonly order: number;
    readonly sets: {
        setNumber: number;
        targetWeightKg: number | null;
        targetReps: number;
        targetRIR: number;
        isWarmup: boolean;
        setType: "normal" | "warmup" | "drop_set" | "rest_pause" | "superset";
        targetDurationSeconds?: number | null | undefined;
        setGroupId?: string | null | undefined;
        originExerciseId?: string | null | undefined;
    }[];
    readonly progressionMode: "weight_first" | "reps_first" | "duration_first";
    readonly repThresholdForWeightJump: number | null;
    readonly cardioTargets: {
        targetDurationSeconds: number | null;
        targetDistanceKm: number | null;
        targetSpeedKmh: number | null;
        targetIncline: number | null;
        targetResistance: number | null;
    } | null;
    readonly maintenanceTarget: {
        weightKg: number;
        reps: number;
    } | null;
    readonly cardioMaintenanceTarget: {
        targetDurationSeconds: number | null;
        targetDistanceKm: number | null;
        targetSpeedKmh: number | null;
        targetIncline: number | null;
        targetResistance: number | null;
    } | null;
    readonly priorityLevel?: "primary" | "secondary" | "supporting" | undefined;
}, {
    canonicalExerciseId: string;
    order: number;
    sets: {
        setNumber: number;
        targetWeightKg: number | null;
        targetReps: number;
        targetRIR: number;
        isWarmup: boolean;
        setType: "normal" | "warmup" | "drop_set" | "rest_pause" | "superset";
        targetDurationSeconds?: number | null | undefined;
        setGroupId?: string | null | undefined;
        originExerciseId?: string | null | undefined;
    }[];
    progressionMode: "weight_first" | "reps_first" | "duration_first";
    repThresholdForWeightJump: number | null;
    cardioTargets: {
        targetDurationSeconds: number | null;
        targetDistanceKm: number | null;
        targetSpeedKmh: number | null;
        targetIncline: number | null;
        targetResistance: number | null;
    } | null;
    maintenanceTarget: {
        weightKg: number;
        reps: number;
    } | null;
    cardioMaintenanceTarget: {
        targetDurationSeconds: number | null;
        targetDistanceKm: number | null;
        targetSpeedKmh: number | null;
        targetIncline: number | null;
        targetResistance: number | null;
    } | null;
    goalMode?: "maintain" | "progress" | "track_only" | undefined;
    useSmartProgress?: boolean | undefined;
    priorityLevel?: "primary" | "secondary" | "supporting" | undefined;
}>>;
export declare const ProgramDaySchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    name: z.ZodString;
    exercises: z.ZodArray<z.ZodPipe<z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        order: z.ZodNumber;
        sets: z.ZodArray<z.ZodObject<{
            setNumber: z.ZodNumber;
            targetWeightKg: z.ZodNullable<z.ZodNumber>;
            targetReps: z.ZodNumber;
            targetDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            targetRIR: z.ZodNumber;
            isWarmup: z.ZodBoolean;
            setType: z.ZodDefault<z.ZodEnum<{
                normal: "normal";
                warmup: "warmup";
                drop_set: "drop_set";
                rest_pause: "rest_pause";
                superset: "superset";
            }>>;
            setGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            originExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
        goalMode: z.ZodOptional<z.ZodEnum<{
            maintain: "maintain";
            progress: "progress";
            track_only: "track_only";
        }>>;
        useSmartProgress: z.ZodOptional<z.ZodBoolean>;
        progressionMode: z.ZodEnum<{
            weight_first: "weight_first";
            reps_first: "reps_first";
            duration_first: "duration_first";
        }>;
        repThresholdForWeightJump: z.ZodNullable<z.ZodNumber>;
        cardioTargets: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            targetDurationSeconds: z.ZodNullable<z.ZodNumber>;
            targetDistanceKm: z.ZodNullable<z.ZodNumber>;
            targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
            targetIncline: z.ZodNullable<z.ZodNumber>;
            targetResistance: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strip>>>;
        maintenanceTarget: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            weightKg: z.ZodNumber;
            reps: z.ZodNumber;
        }, z.core.$strip>>>;
        cardioMaintenanceTarget: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            targetDurationSeconds: z.ZodNullable<z.ZodNumber>;
            targetDistanceKm: z.ZodNullable<z.ZodNumber>;
            targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
            targetIncline: z.ZodNullable<z.ZodNumber>;
            targetResistance: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strip>>>;
        priorityLevel: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            secondary: "secondary";
            supporting: "supporting";
        }>>;
    }, z.core.$strip>, z.ZodTransform<{
        readonly goalMode: "maintain" | "progress" | "track_only";
        readonly canonicalExerciseId: string;
        readonly order: number;
        readonly sets: {
            setNumber: number;
            targetWeightKg: number | null;
            targetReps: number;
            targetRIR: number;
            isWarmup: boolean;
            setType: "normal" | "warmup" | "drop_set" | "rest_pause" | "superset";
            targetDurationSeconds?: number | null | undefined;
            setGroupId?: string | null | undefined;
            originExerciseId?: string | null | undefined;
        }[];
        readonly progressionMode: "weight_first" | "reps_first" | "duration_first";
        readonly repThresholdForWeightJump: number | null;
        readonly cardioTargets: {
            targetDurationSeconds: number | null;
            targetDistanceKm: number | null;
            targetSpeedKmh: number | null;
            targetIncline: number | null;
            targetResistance: number | null;
        } | null;
        readonly maintenanceTarget: {
            weightKg: number;
            reps: number;
        } | null;
        readonly cardioMaintenanceTarget: {
            targetDurationSeconds: number | null;
            targetDistanceKm: number | null;
            targetSpeedKmh: number | null;
            targetIncline: number | null;
            targetResistance: number | null;
        } | null;
        readonly priorityLevel?: "primary" | "secondary" | "supporting" | undefined;
    }, {
        canonicalExerciseId: string;
        order: number;
        sets: {
            setNumber: number;
            targetWeightKg: number | null;
            targetReps: number;
            targetRIR: number;
            isWarmup: boolean;
            setType: "normal" | "warmup" | "drop_set" | "rest_pause" | "superset";
            targetDurationSeconds?: number | null | undefined;
            setGroupId?: string | null | undefined;
            originExerciseId?: string | null | undefined;
        }[];
        progressionMode: "weight_first" | "reps_first" | "duration_first";
        repThresholdForWeightJump: number | null;
        cardioTargets: {
            targetDurationSeconds: number | null;
            targetDistanceKm: number | null;
            targetSpeedKmh: number | null;
            targetIncline: number | null;
            targetResistance: number | null;
        } | null;
        maintenanceTarget: {
            weightKg: number;
            reps: number;
        } | null;
        cardioMaintenanceTarget: {
            targetDurationSeconds: number | null;
            targetDistanceKm: number | null;
            targetSpeedKmh: number | null;
            targetIncline: number | null;
            targetResistance: number | null;
        } | null;
        goalMode?: "maintain" | "progress" | "track_only" | undefined;
        useSmartProgress?: boolean | undefined;
        priorityLevel?: "primary" | "secondary" | "supporting" | undefined;
    }>>>;
}, z.core.$strip>;
export declare const ProgramSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        custom: "custom";
        linear: "linear";
        mesocycle: "mesocycle";
    }>;
    startDate: z.ZodCoercedDate<unknown>;
    endDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    durationWeeks: z.ZodNumber;
    isActive: z.ZodBoolean;
    deloadWeekNumbers: z.ZodArray<z.ZodNumber>;
    deloadPercent: z.ZodNumber;
    schedule: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        name: z.ZodString;
        exercises: z.ZodArray<z.ZodPipe<z.ZodObject<{
            canonicalExerciseId: z.ZodString;
            order: z.ZodNumber;
            sets: z.ZodArray<z.ZodObject<{
                setNumber: z.ZodNumber;
                targetWeightKg: z.ZodNullable<z.ZodNumber>;
                targetReps: z.ZodNumber;
                targetDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                targetRIR: z.ZodNumber;
                isWarmup: z.ZodBoolean;
                setType: z.ZodDefault<z.ZodEnum<{
                    normal: "normal";
                    warmup: "warmup";
                    drop_set: "drop_set";
                    rest_pause: "rest_pause";
                    superset: "superset";
                }>>;
                setGroupId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                originExerciseId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>>;
            goalMode: z.ZodOptional<z.ZodEnum<{
                maintain: "maintain";
                progress: "progress";
                track_only: "track_only";
            }>>;
            useSmartProgress: z.ZodOptional<z.ZodBoolean>;
            progressionMode: z.ZodEnum<{
                weight_first: "weight_first";
                reps_first: "reps_first";
                duration_first: "duration_first";
            }>;
            repThresholdForWeightJump: z.ZodNullable<z.ZodNumber>;
            cardioTargets: z.ZodDefault<z.ZodNullable<z.ZodObject<{
                targetDurationSeconds: z.ZodNullable<z.ZodNumber>;
                targetDistanceKm: z.ZodNullable<z.ZodNumber>;
                targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
                targetIncline: z.ZodNullable<z.ZodNumber>;
                targetResistance: z.ZodNullable<z.ZodNumber>;
            }, z.core.$strip>>>;
            maintenanceTarget: z.ZodDefault<z.ZodNullable<z.ZodObject<{
                weightKg: z.ZodNumber;
                reps: z.ZodNumber;
            }, z.core.$strip>>>;
            cardioMaintenanceTarget: z.ZodDefault<z.ZodNullable<z.ZodObject<{
                targetDurationSeconds: z.ZodNullable<z.ZodNumber>;
                targetDistanceKm: z.ZodNullable<z.ZodNumber>;
                targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
                targetIncline: z.ZodNullable<z.ZodNumber>;
                targetResistance: z.ZodNullable<z.ZodNumber>;
            }, z.core.$strip>>>;
            priorityLevel: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                secondary: "secondary";
                supporting: "supporting";
            }>>;
        }, z.core.$strip>, z.ZodTransform<{
            readonly goalMode: "maintain" | "progress" | "track_only";
            readonly canonicalExerciseId: string;
            readonly order: number;
            readonly sets: {
                setNumber: number;
                targetWeightKg: number | null;
                targetReps: number;
                targetRIR: number;
                isWarmup: boolean;
                setType: "normal" | "warmup" | "drop_set" | "rest_pause" | "superset";
                targetDurationSeconds?: number | null | undefined;
                setGroupId?: string | null | undefined;
                originExerciseId?: string | null | undefined;
            }[];
            readonly progressionMode: "weight_first" | "reps_first" | "duration_first";
            readonly repThresholdForWeightJump: number | null;
            readonly cardioTargets: {
                targetDurationSeconds: number | null;
                targetDistanceKm: number | null;
                targetSpeedKmh: number | null;
                targetIncline: number | null;
                targetResistance: number | null;
            } | null;
            readonly maintenanceTarget: {
                weightKg: number;
                reps: number;
            } | null;
            readonly cardioMaintenanceTarget: {
                targetDurationSeconds: number | null;
                targetDistanceKm: number | null;
                targetSpeedKmh: number | null;
                targetIncline: number | null;
                targetResistance: number | null;
            } | null;
            readonly priorityLevel?: "primary" | "secondary" | "supporting" | undefined;
        }, {
            canonicalExerciseId: string;
            order: number;
            sets: {
                setNumber: number;
                targetWeightKg: number | null;
                targetReps: number;
                targetRIR: number;
                isWarmup: boolean;
                setType: "normal" | "warmup" | "drop_set" | "rest_pause" | "superset";
                targetDurationSeconds?: number | null | undefined;
                setGroupId?: string | null | undefined;
                originExerciseId?: string | null | undefined;
            }[];
            progressionMode: "weight_first" | "reps_first" | "duration_first";
            repThresholdForWeightJump: number | null;
            cardioTargets: {
                targetDurationSeconds: number | null;
                targetDistanceKm: number | null;
                targetSpeedKmh: number | null;
                targetIncline: number | null;
                targetResistance: number | null;
            } | null;
            maintenanceTarget: {
                weightKg: number;
                reps: number;
            } | null;
            cardioMaintenanceTarget: {
                targetDurationSeconds: number | null;
                targetDistanceKm: number | null;
                targetSpeedKmh: number | null;
                targetIncline: number | null;
                targetResistance: number | null;
            } | null;
            goalMode?: "maintain" | "progress" | "track_only" | undefined;
            useSmartProgress?: boolean | undefined;
            priorityLevel?: "primary" | "secondary" | "supporting" | undefined;
        }>>>;
    }, z.core.$strip>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    schemaVersion: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type ProgramSet = z.infer<typeof ProgramSetSchema>;
export type ProgramExercise = z.infer<typeof ProgramExerciseSchema>;
export type ProgramDay = z.infer<typeof ProgramDaySchema>;
export type Program = z.infer<typeof ProgramSchema>;
//# sourceMappingURL=program.d.ts.map