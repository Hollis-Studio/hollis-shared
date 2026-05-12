import { z } from "zod";
import { CardioSessionDataSchema } from "./cardio-session.js";
import { MuscleGroupSchema } from "./muscles.js";
export const PROGRAM_PHASES = [
    "hypertrophy",
    "strength",
    "peaking",
    "deload",
    "maintenance",
];
export const SessionSetSchema = z.object({
    setNumber: z.number().int().min(1),
    weightKg: z.number().min(0),
    reps: z.number().int().min(0),
    rir: z.number().int().min(0).max(10),
    durationSeconds: z.number().min(0).nullable().optional(),
    isWarmup: z.boolean(),
    isOutlier: z.boolean(),
    completedAt: z.coerce.date(),
    isConfirmed: z.boolean().optional(),
    restAfterSec: z.number().int().min(0).nullable(),
    setType: z.enum(["normal", "warmup", "drop_set", "rest_pause", "superset"]).default("normal"),
    setGroupId: z.string().nullable().optional(),
    side: z.enum(["left", "right"]).nullable().optional(),
    originExerciseId: z.string().nullable().optional(),
    repClass: z.enum(["S", "H", "E"]).optional(),
    isMiss: z.boolean().optional(),
    leftReps: z.number().int().min(0).nullable().optional(),
    rightReps: z.number().int().min(0).nullable().optional(),
    leftWeightKg: z.number().min(0).nullable().optional(),
    rightWeightKg: z.number().min(0).nullable().optional(),
});
export const StretchSetSchema = z.object({
    setNumber: z.number().int().min(1),
    holdDurationSeconds: z.number().min(1),
    side: z.enum(["left", "right", "both"]),
    completedAt: z.coerce.date(),
    isOutlier: z.boolean(),
});
export const StretchSessionDataSchema = z.object({
    sets: z.array(StretchSetSchema),
    totalDurationSeconds: z.number().min(0),
});
export const SessionExerciseSchema = z
    .object({
    canonicalExerciseId: z.string().min(1).nullable(),
    freestyleName: z.string().nullable(),
    freestyleMuscleGroups: z.array(MuscleGroupSchema).nullable(),
    gymExerciseInstanceId: z.string().min(1).nullable(),
    order: z.number().int().min(0),
    sets: z.array(SessionSetSchema),
    isFromProgram: z.boolean(),
    canonicalizationStatus: z.enum(["matched", "unmatched", "ignored"]),
    cardioData: CardioSessionDataSchema.nullable().default(null),
    stretchData: StretchSessionDataSchema.nullable().default(null),
    trackingMode: z.enum(["reps", "timed", "cardio", "stretch"]).optional(),
})
    .refine((data) => {
    if (data.canonicalizationStatus === "matched") {
        return data.canonicalExerciseId != null;
    }
    if (data.canonicalizationStatus === "unmatched") {
        return data.canonicalExerciseId == null;
    }
    return true;
}, {
    message: 'canonicalExerciseId must be defined when status is "matched" and null/undefined when "unmatched"',
});
export const QuestionnaireResponseSchema = z.object({
    sleepHours: z.number().min(0),
    sleepQuality: z.number().int().min(0).max(5),
    energyLevel: z.number().int().min(0).max(5),
    stressLevel: z.number().int().min(0).max(5),
    sorenessLevel: z.number().int().min(0).max(5),
    hitMacrosYesterday: z.boolean(),
    hydrationLevel: z.number().int().min(0).max(5),
    goEasier: z.boolean(),
    goEasierOverridePercent: z.number().int().min(5).max(30).optional(),
    notes: z.string().optional(),
    autoFilledSleep: z.boolean(),
    restingHeartRate: z.number().optional(),
    hrv: z.number().optional(),
    bodyWeightKg: z.number().optional(),
    dietaryCalories: z.number().optional(),
});
const TrainingSessionLogBaseSchema = z.object({
    id: z.string().min(1),
    userId: z.string().min(1),
    programId: z.string().min(1).nullable(),
    programDayName: z.string().nullable(),
    gymProfileId: z.string().min(1).nullable(),
    startedAt: z.coerce.date(),
    completedAt: z.coerce.date().nullable(),
    updatedAt: z.coerce.date().optional(),
    isFreestyle: z.boolean(),
    isSubstitution: z.boolean(),
    status: z.enum(["active", "completed", "abandoned"]),
    questionnaire: QuestionnaireResponseSchema,
    totalVolumeKg: z.number().min(0),
    durationMinutes: z.number().min(0),
    untrackedVolume: z.number().min(0).optional(),
    aiOutlierLabel: z.string().nullable().optional(),
    schemaVersion: z.number().optional(),
    programPhase: z.enum(PROGRAM_PHASES).optional(),
    skippedExerciseIds: z.array(z.string()).optional(),
});
export const ActiveTrainingSessionLogSchema = TrainingSessionLogBaseSchema.extend({
    exercises: z.array(SessionExerciseSchema).min(0),
});
export const TrainingSessionLogSchema = TrainingSessionLogBaseSchema.extend({
    exercises: z.array(SessionExerciseSchema).min(1),
});
//# sourceMappingURL=training-session-log.js.map