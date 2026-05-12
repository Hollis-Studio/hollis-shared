/**
 * @ai-context Workout contracts | workout session, plan, and set schemas for training features
 */
import { z } from "zod";
/**
 * Valid workout section types for training plans.
 */
export declare const WORKOUT_SECTION_TYPES: readonly ["warmup", "working", "cooldown"];
export declare const WorkoutSectionTypeSchema: z.ZodEnum<{
    warmup: "warmup";
    working: "working";
    cooldown: "cooldown";
}>;
export type WorkoutSectionType = z.infer<typeof WorkoutSectionTypeSchema>;
/** Centralized workout section type constants for equality checks */
export declare const WORKOUT_SECTION_TYPE: {
    readonly WARMUP: WorkoutSectionType;
    readonly WORKING: WorkoutSectionType;
    readonly COOLDOWN: WorkoutSectionType;
};
/** Human-readable labels for workout section types */
export declare const WORKOUT_SECTION_TYPE_LABELS: Record<WorkoutSectionType, string>;
/**
 * Check if a string is a valid workout section type
 */
export declare function isWorkoutSectionType(value: string): value is WorkoutSectionType;
export declare const workoutSetSchema: z.ZodObject<{
    id: z.ZodString;
    exerciseId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    link: z.ZodOptional<z.ZodString>;
    reps: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    weightUnit: z.ZodOptional<z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>>;
    duration: z.ZodOptional<z.ZodNumber>;
    rpe: z.ZodOptional<z.ZodNumber>;
    restSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WorkoutSetContract = z.infer<typeof workoutSetSchema>;
export declare const workoutSectionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        warmup: "warmup";
        working: "working";
        cooldown: "cooldown";
    }>;
    title: z.ZodString;
    sets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        exerciseId: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        link: z.ZodOptional<z.ZodString>;
        reps: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        weightUnit: z.ZodOptional<z.ZodEnum<{
            kg: "kg";
            lbs: "lbs";
        }>>;
        duration: z.ZodOptional<z.ZodNumber>;
        rpe: z.ZodOptional<z.ZodNumber>;
        restSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WorkoutSectionContract = z.infer<typeof workoutSectionSchema>;
export declare const workoutSessionSchema: z.ZodObject<{
    id: z.ZodString;
    dayOfWeek: z.ZodNumber;
    name: z.ZodString;
    icon: z.ZodString;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            warmup: "warmup";
            working: "working";
            cooldown: "cooldown";
        }>;
        title: z.ZodString;
        sets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            exerciseId: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            link: z.ZodOptional<z.ZodString>;
            reps: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            weightUnit: z.ZodOptional<z.ZodEnum<{
                kg: "kg";
                lbs: "lbs";
            }>>;
            duration: z.ZodOptional<z.ZodNumber>;
            rpe: z.ZodOptional<z.ZodNumber>;
            restSeconds: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    isRestDay: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type WorkoutSessionContract = z.infer<typeof workoutSessionSchema>;
export declare const workoutPlanSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    date: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blocks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            warmup: "warmup";
            working: "working";
            cooldown: "cooldown";
        }>;
        title: z.ZodString;
        sets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            exerciseId: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            link: z.ZodOptional<z.ZodString>;
            reps: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            weightUnit: z.ZodOptional<z.ZodEnum<{
                kg: "kg";
                lbs: "lbs";
            }>>;
            duration: z.ZodOptional<z.ZodNumber>;
            rpe: z.ZodOptional<z.ZodNumber>;
            restSeconds: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    isCompleted: z.ZodDefault<z.ZodBoolean>;
    completedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type WorkoutPlanContract = z.infer<typeof workoutPlanSchema>;
/**
 * Validates a single workout set as entered in the WorkoutPlanBuilder.
 *
 * Rules:
 * - `name` must be non-empty (exercise was selected or typed)
 * - `reps`, if supplied, must be a positive integer
 * - `weight`, if supplied, must be >= 0
 * - `duration`, if supplied, must be a positive integer (seconds)
 * - `link`, if supplied, must be a valid URL
 */
export declare const workoutBuilderSetSchema: z.ZodObject<{
    id: z.ZodString;
    exerciseId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    link: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    reps: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    weightUnit: z.ZodOptional<z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>>;
    duration: z.ZodOptional<z.ZodNumber>;
    rpe: z.ZodOptional<z.ZodNumber>;
    restSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WorkoutBuilderSetContract = z.infer<typeof workoutBuilderSetSchema>;
/**
 * Validates a single workout section as entered in the WorkoutPlanBuilder.
 *
 * Rules:
 * - `type` must be one of the defined section types (warmup, working, cooldown)
 * - `title` must be non-empty
 * - `sets` must contain at least one exercise
 */
export declare const workoutBuilderSectionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        warmup: "warmup";
        working: "working";
        cooldown: "cooldown";
    }>;
    title: z.ZodString;
    sets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        exerciseId: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        link: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        reps: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        weightUnit: z.ZodOptional<z.ZodEnum<{
            kg: "kg";
            lbs: "lbs";
        }>>;
        duration: z.ZodOptional<z.ZodNumber>;
        rpe: z.ZodOptional<z.ZodNumber>;
        restSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type WorkoutBuilderSectionContract = z.infer<typeof workoutBuilderSectionSchema>;
/**
 * Valid day-of-week values (0=Monday … 6=Sunday in builder convention).
 */
export declare const BUILDER_DAY_OF_WEEK: readonly [0, 1, 2, 3, 4, 5, 6];
export type BuilderDayOfWeek = (typeof BUILDER_DAY_OF_WEEK)[number];
/**
 * Validates a single workout day (session) as composed in the WorkoutPlanBuilder.
 *
 * Rules:
 * - `dayOfWeek` must be 0–6
 * - `name` must be non-empty
 * - A non-rest day must have at least one section
 * - A rest day may have zero sections (optional stretching/mobility is allowed)
 */
export declare const workoutBuilderDaySchema: z.ZodObject<{
    id: z.ZodString;
    dayOfWeek: z.ZodNumber;
    name: z.ZodString;
    icon: z.ZodString;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            warmup: "warmup";
            working: "working";
            cooldown: "cooldown";
        }>;
        title: z.ZodString;
        sets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            exerciseId: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            link: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            reps: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            weightUnit: z.ZodOptional<z.ZodEnum<{
                kg: "kg";
                lbs: "lbs";
            }>>;
            duration: z.ZodOptional<z.ZodNumber>;
            rpe: z.ZodOptional<z.ZodNumber>;
            restSeconds: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    isRestDay: z.ZodBoolean;
}, z.core.$strip>;
export type WorkoutBuilderDayContract = z.infer<typeof workoutBuilderDaySchema>;
/**
 * Validates the full weekly plan as built by WorkoutPlanBuilder before save.
 *
 * Rules:
 * - Must be an array of exactly 7 days
 * - Each day must have a unique dayOfWeek value (0–6)
 * - At least one day must be a non-rest day (so empty all-rest plans are rejected)
 * - Each non-rest day must contain at least one section with at least one exercise
 */
export declare const workoutWeekBuilderSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    dayOfWeek: z.ZodNumber;
    name: z.ZodString;
    icon: z.ZodString;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            warmup: "warmup";
            working: "working";
            cooldown: "cooldown";
        }>;
        title: z.ZodString;
        sets: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            exerciseId: z.ZodOptional<z.ZodString>;
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            link: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            reps: z.ZodOptional<z.ZodNumber>;
            weight: z.ZodOptional<z.ZodNumber>;
            weightUnit: z.ZodOptional<z.ZodEnum<{
                kg: "kg";
                lbs: "lbs";
            }>>;
            duration: z.ZodOptional<z.ZodNumber>;
            rpe: z.ZodOptional<z.ZodNumber>;
            restSeconds: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    isRestDay: z.ZodBoolean;
}, z.core.$strip>>;
export type WorkoutWeekBuilderContract = z.infer<typeof workoutWeekBuilderSchema>;
/**
 * Collect human-readable validation errors from a WorkoutWeek parse result.
 * Returns an array of error strings suitable for UI display.
 */
export declare function collectWorkoutBuilderErrors(result: z.ZodSafeParseResult<WorkoutWeekBuilderContract>): string[];
/**
 * A single workout activity recorded by a wearable device (e.g., Apple Watch,
 * Garmin, Whoop). Free-form sessions that do not map to structured exercise
 * logs — stored in `wearable_workout_sessions` for longitudinal activity
 * analytics and future AI context.
 *
 * Units contract:
 * - `durationMinutes`: integer minutes (1–1440)
 * - `activeCaloriesKcal`: integer kcal (0–50000)
 * - `distanceKm`: decimal km (0–1000) — always stored in km regardless of device unit
 */
export declare const wearableWorkoutSessionSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    type: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    durationMinutes: z.ZodNumber;
    activeCaloriesKcal: z.ZodOptional<z.ZodNumber>;
    distanceKm: z.ZodOptional<z.ZodNumber>;
    source: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WearableWorkoutSessionContract = z.infer<typeof wearableWorkoutSessionSchema>;
/**
 * Schema used when a wearable client submits workout sessions in a daily sync
 * payload. The `userId` and `id` fields are populated server-side.
 */
export declare const wearableWorkoutSyncSchema: z.ZodObject<{
    type: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
    startTime: z.ZodString;
    endTime: z.ZodString;
    durationMinutes: z.ZodNumber;
    activeCaloriesKcal: z.ZodOptional<z.ZodNumber>;
    distanceKm: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WearableWorkoutSync = z.infer<typeof wearableWorkoutSyncSchema>;
/**
 * Represents a single set's draft state during active session logging.
 * This is a client-side-only type — the feature service maps completed
 * entries to `LogPerformanceSetInput` (filtering incomplete, stripping nulls)
 * before calling the API.
 *
 * Defaults: weightUnit = "lbs" (converted to kg on submit per storage invariant).
 */
export declare const exerciseLogEntryDraftSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    setNumber: z.ZodNumber;
    reps: z.ZodNullable<z.ZodNumber>;
    weight: z.ZodNullable<z.ZodNumber>;
    weightUnit: z.ZodDefault<z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>>;
    rpe: z.ZodNullable<z.ZodNumber>;
    isComplete: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type ExerciseLogEntryDraft = z.infer<typeof exerciseLogEntryDraftSchema>;
/**
 * Query parameters for the admin wearable sessions list endpoint.
 * GET /api/admin/patients/:userId/wearable-sessions
 */
export declare const WearableSessionListQuerySchema: z.ZodObject<{
    page: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    limit: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WearableSessionListQuery = z.infer<typeof WearableSessionListQuerySchema>;
/**
 * A single wearable session row in the admin list response.
 * Contains only fields present in the current DB schema — no HR, GPS, or effort score.
 */
export declare const WearableSessionItemSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    type: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    durationMinutes: z.ZodNumber;
    activeCaloriesKcal: z.ZodNullable<z.ZodNumber>;
    distanceKm: z.ZodNullable<z.ZodNumber>;
    source: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type WearableSessionItem = z.infer<typeof WearableSessionItemSchema>;
/**
 * Paginated response for the admin wearable sessions list endpoint.
 * Shape: { data: WearableSessionItem[], pagination: { page, limit, total, totalPages, hasMore } }
 */
export declare const WearableSessionListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        type: z.ZodString;
        startTime: z.ZodString;
        endTime: z.ZodString;
        durationMinutes: z.ZodNumber;
        activeCaloriesKcal: z.ZodNullable<z.ZodNumber>;
        distanceKm: z.ZodNullable<z.ZodNumber>;
        source: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasMore: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export type WearableSessionListResponse = z.infer<typeof WearableSessionListResponseSchema>;
/**
 * Aggregated activity data for a single calendar day.
 * Used in the CSS bar chart (ActivitySummaryChart).
 */
export declare const WearableActivityDaySummarySchema: z.ZodObject<{
    date: z.ZodString;
    totalActiveMins: z.ZodNumber;
    totalCalories: z.ZodNumber;
    sessionCount: z.ZodNumber;
}, z.core.$strip>;
export type WearableActivityDaySummary = z.infer<typeof WearableActivityDaySummarySchema>;
/**
 * Response for the admin wearable activity summary endpoint.
 * GET /api/admin/patients/:userId/wearable-activity-summary
 */
export declare const WearableActivitySummaryResponseSchema: z.ZodObject<{
    days: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        totalActiveMins: z.ZodNumber;
        totalCalories: z.ZodNumber;
        sessionCount: z.ZodNumber;
    }, z.core.$strip>>;
    periodDays: z.ZodNumber;
}, z.core.$strip>;
export type WearableActivitySummaryResponse = z.infer<typeof WearableActivitySummaryResponseSchema>;
//# sourceMappingURL=workouts.d.ts.map