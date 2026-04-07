/**
 * @ai-context Workout contracts | workout session, plan, and set schemas for training features
 */
import { z } from "zod";
import { baseDocumentSchema, isoDateSchema, isoTimestampSchema } from "./common";
import { WeightUnitSchema } from "./units";

// ============================================================================
// WORKOUT SECTION TYPES
// ============================================================================

/**
 * Valid workout section types for training plans.
 */
export const WORKOUT_SECTION_TYPES = ["warmup", "working", "cooldown"] as const;

export const WorkoutSectionTypeSchema = z.enum(WORKOUT_SECTION_TYPES);
export type WorkoutSectionType = z.infer<typeof WorkoutSectionTypeSchema>;

/** Centralized workout section type constants for equality checks */
export const WORKOUT_SECTION_TYPE = {
  WARMUP: "warmup" as WorkoutSectionType,
  WORKING: "working" as WorkoutSectionType,
  COOLDOWN: "cooldown" as WorkoutSectionType,
} as const;

/** Human-readable labels for workout section types */
export const WORKOUT_SECTION_TYPE_LABELS: Record<WorkoutSectionType, string> = {
  warmup: "Warm-up",
  working: "Working Sets",
  cooldown: "Cool-down",
};

/**
 * Check if a string is a valid workout section type
 */
export function isWorkoutSectionType(
  value: string,
): value is WorkoutSectionType {
  return (WORKOUT_SECTION_TYPES as readonly string[]).includes(value);
}

// --- Sub-components ---

export const workoutSetSchema = z.object({
  id: z.string(),
  exerciseId: z.string().optional(), // Reference to Exercise library item
  name: z.string(),
  description: z.string().optional(),
  link: z.string().url().optional(),
  reps: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  weightUnit: WeightUnitSchema.optional(),
  duration: z.number().int().min(0).optional(),
  rpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().int().min(0).optional(),
});

export type WorkoutSetContract = z.infer<typeof workoutSetSchema>;

export const workoutSectionSchema = z.object({
  id: z.string(),
  type: WorkoutSectionTypeSchema,
  title: z.string(), // Customizable title
  sets: z.array(workoutSetSchema),
});

export type WorkoutSectionContract = z.infer<typeof workoutSectionSchema>;

// --- The Workout Session (One Day) ---

export const workoutSessionSchema = z.object({
  id: z.string(),
  dayOfWeek: z.number().int().min(0).max(6), // 0=Sunday, 1=Monday, etc.
  name: z.string(), // "Leg Day", "Rest", "Cardio"
  icon: z.string(), // Icon name for the UI
  sections: z.array(workoutSectionSchema),
  isRestDay: z.boolean().default(false),
});

export type WorkoutSessionContract = z.infer<typeof workoutSessionSchema>;

// --- The Daily Workout Plan ---

export const workoutPlanSchema = baseDocumentSchema.extend({
  id: z.string().optional(),
  userId: z.string(),
  date: isoDateSchema, // ISO Date YYYY-MM-DD
  title: z.string(),
  description: z.string().nullable().optional(),
  blocks: z.array(workoutSectionSchema),
  isCompleted: z.boolean().default(false),
  completedAt: z.string().nullable().optional(),
});

export type WorkoutPlanContract = z.infer<typeof workoutPlanSchema>;

// ============================================================================
// WORKOUT PLAN BUILDER VALIDATION
// ============================================================================

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
export const workoutBuilderSetSchema = z.object({
  id: z.string().min(1),
  exerciseId: z.string().optional(),
  name: z.string().min(1, "Exercise name is required"),
  description: z.string().optional(),
  link: z.string().url("Link must be a valid URL (http/https)").optional().or(z.literal("")),
  reps: z.number().int().min(1, "Reps must be at least 1").optional(),
  weight: z.number().min(0, "Weight cannot be negative").optional(),
  weightUnit: WeightUnitSchema.optional(),
  duration: z.number().int().min(1, "Duration must be at least 1 second").optional(),
  rpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().int().min(0).optional(),
});

export type WorkoutBuilderSetContract = z.infer<typeof workoutBuilderSetSchema>;

/**
 * Validates a single workout section as entered in the WorkoutPlanBuilder.
 *
 * Rules:
 * - `type` must be one of the defined section types (warmup, working, cooldown)
 * - `title` must be non-empty
 * - `sets` must contain at least one exercise
 */
export const workoutBuilderSectionSchema = z.object({
  id: z.string().min(1),
  type: WorkoutSectionTypeSchema,
  title: z.string().min(1, "Section title is required"),
  sets: z.array(workoutBuilderSetSchema).min(1, "Each section must have at least one exercise"),
});

export type WorkoutBuilderSectionContract = z.infer<typeof workoutBuilderSectionSchema>;

/**
 * Valid day-of-week values (0=Monday … 6=Sunday in builder convention).
 */
export const BUILDER_DAY_OF_WEEK = [0, 1, 2, 3, 4, 5, 6] as const;
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
export const workoutBuilderDaySchema = z.object({
  id: z.string().min(1),
  dayOfWeek: z.number().int().min(0).max(6),
  name: z.string().min(1, "Day name is required"),
  icon: z.string().min(1),
  sections: z.array(workoutBuilderSectionSchema),
  isRestDay: z.boolean(),
}).refine(
  (day) => day.isRestDay || day.sections.length >= 1,
  { message: "A workout day must have at least one section" },
);

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
export const workoutWeekBuilderSchema = z.array(workoutBuilderDaySchema)
  .length(7, "A weekly plan must contain exactly 7 days")
  .refine(
    (days) => {
      const seen = new Set<number>();
      for (const day of days) {
        if (seen.has(day.dayOfWeek)) return false;
        seen.add(day.dayOfWeek);
      }
      return true;
    },
    { message: "Each day must have a unique dayOfWeek value" },
  )
  .refine(
    (days) => days.some((d) => !d.isRestDay),
    { message: "At least one day must be a workout day (not all rest)" },
  );

export type WorkoutWeekBuilderContract = z.infer<typeof workoutWeekBuilderSchema>;

/**
 * Collect human-readable validation errors from a WorkoutWeek parse result.
 * Returns an array of error strings suitable for UI display.
 */
export function collectWorkoutBuilderErrors(
  result: z.ZodSafeParseResult<WorkoutWeekBuilderContract>,
): string[] {
  if (result.success) return [];

  const errors: string[] = [];
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (path) {
      errors.push(`${path}: ${issue.message}`);
    } else {
      errors.push(issue.message);
    }
  }
  return errors;
}

// ============================================================================
// WEARABLE WORKOUT SESSION
// ============================================================================

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
export const wearableWorkoutSessionSchema = z.object({
  /** Unique identifier (UUID) — present on records read from DB, absent on create */
  id: z.string().uuid().optional(),
  userId: z.string(),
  /** Activity type as reported by the wearable (e.g. "running", "cycling") */
  type: z.string().min(1).max(100),
  /** ISO 8601 UTC timestamp for workout start */
  startTime: isoTimestampSchema,
  /** ISO 8601 UTC timestamp for workout end */
  endTime: isoTimestampSchema,
  /** Duration in whole minutes (1–1440) */
  durationMinutes: z.number().int().min(1).max(1440),
  /** Active (exercise) calories burned in kcal */
  activeCaloriesKcal: z.number().int().min(0).max(50000).optional(),
  /** Distance covered in km (normalized from device unit at write time) */
  distanceKm: z.number().min(0).max(1000).optional(),
  /** Device or app source identifier (e.g. "com.apple.health", "whoop") */
  source: z.string().min(1).max(200).optional(),
  createdAt: isoTimestampSchema.optional(),
  updatedAt: isoTimestampSchema.optional(),
});

export type WearableWorkoutSessionContract = z.infer<
  typeof wearableWorkoutSessionSchema
>;

/**
 * Schema used when a wearable client submits workout sessions in a daily sync
 * payload. The `userId` and `id` fields are populated server-side.
 */
export const wearableWorkoutSyncSchema = wearableWorkoutSessionSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type WearableWorkoutSync = z.infer<typeof wearableWorkoutSyncSchema>;
