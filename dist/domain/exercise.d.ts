/**
 * @ai-context Exercise domain contracts | exercise definitions, logs, and performance tracking
 *
 * This module provides the canonical definitions for exercise-related types:
 * - Exercise categories, movement patterns, muscle groups
 * - Equipment types, difficulty levels
 * - Exercise and exercise log contracts with Zod schemas
 *
 * IMPORTANT: All exercise-related types MUST be imported from here.
 *
 * deps: zod, common.ts | consumers: all codebases
 */
import { z } from "zod";
export { EQUIPMENT_TYPE, EQUIPMENT_TYPE_LABELS, EQUIPMENT_TYPES, EquipmentTypeSchema, type EquipmentType, } from "./equipment.js";
export { MUSCLE_GROUP, MUSCLE_GROUP_LABELS, MUSCLE_GROUPS, MuscleGroupSchema, type MuscleGroup, } from "./muscles.js";
export declare const EXERCISE_CATEGORIES: readonly ["COMPOUND", "ISOLATION", "CARDIO", "MOBILITY", "PLYOMETRIC"];
export declare const ExerciseCategorySchema: z.ZodEnum<{
    COMPOUND: "COMPOUND";
    MOBILITY: "MOBILITY";
    ISOLATION: "ISOLATION";
    CARDIO: "CARDIO";
    PLYOMETRIC: "PLYOMETRIC";
}>;
export type ExerciseCategory = z.infer<typeof ExerciseCategorySchema>;
export declare const EXERCISE_CATEGORY: {
    readonly COMPOUND: "COMPOUND";
    readonly ISOLATION: "ISOLATION";
    readonly CARDIO: "CARDIO";
    readonly MOBILITY: "MOBILITY";
    readonly PLYOMETRIC: "PLYOMETRIC";
};
export declare const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string>;
export declare function isExerciseCategory(value: string): value is ExerciseCategory;
export declare const MOVEMENT_PATTERNS: readonly ["squat", "hinge", "push", "pull", "carry", "rotation", "lunge"];
export declare const MovementPatternSchema: z.ZodEnum<{
    push: "push";
    squat: "squat";
    hinge: "hinge";
    pull: "pull";
    carry: "carry";
    rotation: "rotation";
    lunge: "lunge";
}>;
export type MovementPattern = z.infer<typeof MovementPatternSchema>;
export declare const MOVEMENT_PATTERN: {
    readonly SQUAT: MovementPattern;
    readonly HINGE: MovementPattern;
    readonly PUSH: MovementPattern;
    readonly PULL: MovementPattern;
    readonly CARRY: MovementPattern;
    readonly ROTATION: MovementPattern;
    readonly LUNGE: MovementPattern;
};
export declare const MOVEMENT_PATTERN_LABELS: Record<MovementPattern, string>;
export declare const DIFFICULTY_LEVELS: readonly ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
export declare const DifficultyLevelSchema: z.ZodEnum<{
    BEGINNER: "BEGINNER";
    INTERMEDIATE: "INTERMEDIATE";
    ADVANCED: "ADVANCED";
    EXPERT: "EXPERT";
}>;
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;
export declare const DIFFICULTY_LEVEL: {
    readonly BEGINNER: "BEGINNER";
    readonly INTERMEDIATE: "INTERMEDIATE";
    readonly ADVANCED: "ADVANCED";
    readonly EXPERT: "EXPERT";
};
export declare const DIFFICULTY_LEVEL_LABELS: Record<DifficultyLevel, string>;
export declare const EXERCISE_DIFFICULTIES: readonly ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
export type ExerciseDifficulty = (typeof EXERCISE_DIFFICULTIES)[number];
export declare const exerciseDifficultySchema: z.ZodEnum<{
    BEGINNER: "BEGINNER";
    INTERMEDIATE: "INTERMEDIATE";
    ADVANCED: "ADVANCED";
    EXPERT: "EXPERT";
}>;
export declare const EXERCISE_DIFFICULTY: {
    readonly BEGINNER: "BEGINNER";
    readonly INTERMEDIATE: "INTERMEDIATE";
    readonly ADVANCED: "ADVANCED";
    readonly EXPERT: "EXPERT";
};
export declare const TRACKING_TYPES: readonly ["REPS", "TIME", "DISTANCE"];
export declare const TrackingTypeSchema: z.ZodEnum<{
    REPS: "REPS";
    TIME: "TIME";
    DISTANCE: "DISTANCE";
}>;
export type TrackingType = z.infer<typeof TrackingTypeSchema>;
export declare const TRACKING_TYPE: {
    readonly REPS: "REPS";
    readonly TIME: "TIME";
    readonly DISTANCE: "DISTANCE";
};
export declare const TRACKING_TYPE_LABELS: Record<TrackingType, string>;
export declare const EXERCISE_TRACKING_TYPES: readonly ["REPS", "TIME", "DISTANCE"];
export type ExerciseTrackingType = (typeof EXERCISE_TRACKING_TYPES)[number];
export declare const exerciseTrackingTypeSchema: z.ZodEnum<{
    REPS: "REPS";
    TIME: "TIME";
    DISTANCE: "DISTANCE";
}>;
export declare const EXERCISE_TRACKING_TYPE: {
    readonly REPS: "REPS";
    readonly TIME: "TIME";
    readonly DISTANCE: "DISTANCE";
};
export declare const exerciseSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    aliases: z.ZodOptional<z.ZodArray<z.ZodString>>;
    category: z.ZodEnum<{
        COMPOUND: "COMPOUND";
        MOBILITY: "MOBILITY";
        ISOLATION: "ISOLATION";
        CARDIO: "CARDIO";
        PLYOMETRIC: "PLYOMETRIC";
    }>;
    movementPattern: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        push: "push";
        squat: "squat";
        hinge: "hinge";
        pull: "pull";
        carry: "carry";
        rotation: "rotation";
        lunge: "lunge";
    }>>>;
    trackingType: z.ZodOptional<z.ZodEnum<{
        REPS: "REPS";
        TIME: "TIME";
        DISTANCE: "DISTANCE";
    }>>;
    muscleGroups: z.ZodOptional<z.ZodArray<z.ZodString>>;
    primaryMuscle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    primaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodEnum<{
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
    secondaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodEnum<{
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
    equipment: z.ZodArray<z.ZodEnum<{
        other: "other";
        none: "none";
        barbell: "barbell";
        dumbbell: "dumbbell";
        kettlebell: "kettlebell";
        cable: "cable";
        machine: "machine";
        bodyweight: "bodyweight";
        resistance_band: "resistance_band";
        squat_rack: "squat_rack";
        bench: "bench";
        pull_up_bar: "pull_up_bar";
        plate_loaded_machine: "plate_loaded_machine";
        smith_machine: "smith_machine";
        treadmill: "treadmill";
        stationary_bike: "stationary_bike";
        rowing_machine: "rowing_machine";
        elliptical: "elliptical";
        stairmaster: "stairmaster";
        jump_rope: "jump_rope";
    }>>;
    difficulty: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BEGINNER: "BEGINNER";
        INTERMEDIATE: "INTERMEDIATE";
        ADVANCED: "ADVANCED";
        EXPERT: "EXPERT";
    }>>>;
    description: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cues: z.ZodOptional<z.ZodArray<z.ZodString>>;
    videoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    thumbnailUrl: z.ZodOptional<z.ZodString>;
    isCompound: z.ZodOptional<z.ZodBoolean>;
    isUnilateral: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    mergedIntoId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metricDefinitionId: z.ZodOptional<z.ZodString>;
    defaultSets: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    defaultReps: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type ExerciseContract = z.infer<typeof exerciseSchema>;
export declare const exerciseLogSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodString;
    userId: z.ZodString;
    exerciseId: z.ZodString;
    exerciseName: z.ZodOptional<z.ZodString>;
    workoutSessionId: z.ZodOptional<z.ZodString>;
    workoutPlanId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    performedAt: z.ZodOptional<z.ZodString>;
    date: z.ZodString;
    setNumber: z.ZodOptional<z.ZodNumber>;
    sets: z.ZodOptional<z.ZodNumber>;
    reps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weight: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weightUnit: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>>>;
    duration: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    distance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rpe: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metricDefinitionId: z.ZodOptional<z.ZodString>;
    volume: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    estimated1RM: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type ExerciseLogContract = z.infer<typeof exerciseLogSchema>;
export declare const createExerciseSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    category: z.ZodEnum<{
        COMPOUND: "COMPOUND";
        MOBILITY: "MOBILITY";
        ISOLATION: "ISOLATION";
        CARDIO: "CARDIO";
        PLYOMETRIC: "PLYOMETRIC";
    }>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    metricDefinitionId: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    aliases: z.ZodOptional<z.ZodArray<z.ZodString>>;
    movementPattern: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        push: "push";
        squat: "squat";
        hinge: "hinge";
        pull: "pull";
        carry: "carry";
        rotation: "rotation";
        lunge: "lunge";
    }>>>;
    trackingType: z.ZodOptional<z.ZodEnum<{
        REPS: "REPS";
        TIME: "TIME";
        DISTANCE: "DISTANCE";
    }>>;
    muscleGroups: z.ZodOptional<z.ZodArray<z.ZodString>>;
    primaryMuscle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    primaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodEnum<{
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
    secondaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodEnum<{
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
    equipment: z.ZodArray<z.ZodEnum<{
        other: "other";
        none: "none";
        barbell: "barbell";
        dumbbell: "dumbbell";
        kettlebell: "kettlebell";
        cable: "cable";
        machine: "machine";
        bodyweight: "bodyweight";
        resistance_band: "resistance_band";
        squat_rack: "squat_rack";
        bench: "bench";
        pull_up_bar: "pull_up_bar";
        plate_loaded_machine: "plate_loaded_machine";
        smith_machine: "smith_machine";
        treadmill: "treadmill";
        stationary_bike: "stationary_bike";
        rowing_machine: "rowing_machine";
        elliptical: "elliptical";
        stairmaster: "stairmaster";
        jump_rope: "jump_rope";
    }>>;
    difficulty: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BEGINNER: "BEGINNER";
        INTERMEDIATE: "INTERMEDIATE";
        ADVANCED: "ADVANCED";
        EXPERT: "EXPERT";
    }>>>;
    instructions: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cues: z.ZodOptional<z.ZodArray<z.ZodString>>;
    videoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    thumbnailUrl: z.ZodOptional<z.ZodString>;
    isCompound: z.ZodOptional<z.ZodBoolean>;
    isUnilateral: z.ZodOptional<z.ZodBoolean>;
    mergedIntoId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    defaultSets: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    defaultReps: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateExercise = z.infer<typeof createExerciseSchema>;
export declare const updateExerciseSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    category: z.ZodOptional<z.ZodEnum<{
        COMPOUND: "COMPOUND";
        MOBILITY: "MOBILITY";
        ISOLATION: "ISOLATION";
        CARDIO: "CARDIO";
        PLYOMETRIC: "PLYOMETRIC";
    }>>;
    isActive: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    metricDefinitionId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    aliases: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    movementPattern: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        push: "push";
        squat: "squat";
        hinge: "hinge";
        pull: "pull";
        carry: "carry";
        rotation: "rotation";
        lunge: "lunge";
    }>>>>;
    trackingType: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        REPS: "REPS";
        TIME: "TIME";
        DISTANCE: "DISTANCE";
    }>>>;
    muscleGroups: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    primaryMuscle: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    primaryMuscleGroups: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodEnum<{
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
    }>>>>;
    secondaryMuscleGroups: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodEnum<{
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
    }>>>>;
    equipment: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        other: "other";
        none: "none";
        barbell: "barbell";
        dumbbell: "dumbbell";
        kettlebell: "kettlebell";
        cable: "cable";
        machine: "machine";
        bodyweight: "bodyweight";
        resistance_band: "resistance_band";
        squat_rack: "squat_rack";
        bench: "bench";
        pull_up_bar: "pull_up_bar";
        plate_loaded_machine: "plate_loaded_machine";
        smith_machine: "smith_machine";
        treadmill: "treadmill";
        stationary_bike: "stationary_bike";
        rowing_machine: "rowing_machine";
        elliptical: "elliptical";
        stairmaster: "stairmaster";
        jump_rope: "jump_rope";
    }>>>;
    difficulty: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BEGINNER: "BEGINNER";
        INTERMEDIATE: "INTERMEDIATE";
        ADVANCED: "ADVANCED";
        EXPERT: "EXPERT";
    }>>>>;
    instructions: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    cues: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    videoUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    thumbnailUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isCompound: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    isUnilateral: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    mergedIntoId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    createdBy: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    defaultSets: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    defaultReps: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, z.core.$strip>;
export type UpdateExercise = z.infer<typeof updateExerciseSchema>;
/**
 * Zod schema for the ExerciseModal create/edit form.
 * Validates the critical user-facing fields before calling the exercise service.
 * Optional enum fields accept an empty string to represent "not selected".
 */
export declare const exerciseFormSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<{
        COMPOUND: "COMPOUND";
        MOBILITY: "MOBILITY";
        ISOLATION: "ISOLATION";
        CARDIO: "CARDIO";
        PLYOMETRIC: "PLYOMETRIC";
    }>;
    primaryMuscle: z.ZodString;
    muscleGroups: z.ZodArray<z.ZodString>;
    movementPattern: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        push: "push";
        squat: "squat";
        hinge: "hinge";
        pull: "pull";
        carry: "carry";
        rotation: "rotation";
        lunge: "lunge";
    }>, z.ZodLiteral<"">]>>;
    difficulty: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        BEGINNER: "BEGINNER";
        INTERMEDIATE: "INTERMEDIATE";
        ADVANCED: "ADVANCED";
        EXPERT: "EXPERT";
    }>, z.ZodLiteral<"">]>>;
}, z.core.$strip>;
export type ExerciseFormInput = z.infer<typeof exerciseFormSchema>;
export declare const createExerciseLogSchema: z.ZodObject<{
    date: z.ZodString;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    weight: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    distance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    userId: z.ZodString;
    duration: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    estimated1RM: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    reps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    exerciseId: z.ZodString;
    weightUnit: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>>>;
    rpe: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sets: z.ZodOptional<z.ZodNumber>;
    setNumber: z.ZodOptional<z.ZodNumber>;
    performedAt: z.ZodOptional<z.ZodString>;
    metricDefinitionId: z.ZodOptional<z.ZodString>;
    workoutPlanId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    exerciseName: z.ZodOptional<z.ZodString>;
    workoutSessionId: z.ZodOptional<z.ZodString>;
    volume: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type CreateExerciseLog = z.infer<typeof createExerciseLogSchema>;
/** @deprecated Use ExerciseCategorySchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const exerciseCategorySchema: z.ZodEnum<{
    COMPOUND: "COMPOUND";
    MOBILITY: "MOBILITY";
    ISOLATION: "ISOLATION";
    CARDIO: "CARDIO";
    PLYOMETRIC: "PLYOMETRIC";
}>;
/** @deprecated Use MovementPatternSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const movementPatternSchema: z.ZodEnum<{
    push: "push";
    squat: "squat";
    hinge: "hinge";
    pull: "pull";
    carry: "carry";
    rotation: "rotation";
    lunge: "lunge";
}>;
/** @deprecated Use MuscleGroupSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const muscleGroupSchema: z.ZodEnum<{
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
/** @deprecated Use EquipmentTypeSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const equipmentTypeSchema: z.ZodEnum<{
    other: "other";
    none: "none";
    barbell: "barbell";
    dumbbell: "dumbbell";
    kettlebell: "kettlebell";
    cable: "cable";
    machine: "machine";
    bodyweight: "bodyweight";
    resistance_band: "resistance_band";
    squat_rack: "squat_rack";
    bench: "bench";
    pull_up_bar: "pull_up_bar";
    plate_loaded_machine: "plate_loaded_machine";
    smith_machine: "smith_machine";
    treadmill: "treadmill";
    stationary_bike: "stationary_bike";
    rowing_machine: "rowing_machine";
    elliptical: "elliptical";
    stairmaster: "stairmaster";
    jump_rope: "jump_rope";
}>;
/** @deprecated Use DifficultyLevelSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const difficultyLevelSchema: z.ZodEnum<{
    BEGINNER: "BEGINNER";
    INTERMEDIATE: "INTERMEDIATE";
    ADVANCED: "ADVANCED";
    EXPERT: "EXPERT";
}>;
/** @deprecated Use TrackingTypeSchema instead. Remove after 2026-05-01
 *  @removal-deadline 2026-05-01 */
export declare const trackingTypeSchema: z.ZodEnum<{
    REPS: "REPS";
    TIME: "TIME";
    DISTANCE: "DISTANCE";
}>;
export declare const createMockExercise: (overrides?: Partial<ExerciseContract>) => ExerciseContract;
export declare const createMockExerciseLog: (overrides?: Partial<ExerciseLogContract>) => ExerciseLogContract;
//# sourceMappingURL=exercise.d.ts.map