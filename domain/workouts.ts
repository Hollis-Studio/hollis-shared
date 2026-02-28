/**
 * @ai-context Workout contracts | workout session, plan, and set schemas for training features
 */
import { z } from "zod";
import { baseDocumentSchema, isoDateSchema } from "./common";
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
