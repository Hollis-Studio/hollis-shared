/**
 * @ai-context Workouts AI wire contract | Shared Zod schemas for the Hollis
 * Workouts AI HTTP surface (Smart Builder, voice logging, equipment recognition,
 * exercise matching, muscle tagging, gym setup).
 *
 * These are the request/response shapes that BOTH the Workouts Express server
 * (server/src/services/ai/*) and the Workouts mobile client (src/schemas/ai/*)
 * must agree on. They previously lived as two hand-maintained copies that drifted
 * (mismatched numeric bounds, a missing `stretch` tracking mode, a one-sided
 * cardio refinement, prompt-only vocabularies). This module is the single source
 * of truth that makes that drift structurally impossible.
 *
 * IMPORTANT: pure TypeScript + Zod only.
 * - NO Gemini SDK imports (@google/genai). The Gemini structured-output schemas
 *   (Type.OBJECT trees) require the SDK and stay in server/src/services/ai.
 * - NO Node.js-only or platform-specific imports (consumed by React Native).
 *
 * Deliberately NOT centralized (legitimate per-side concerns, not drift):
 * - The voice response ENVELOPE (server validates its output with a non-empty
 *   transcript; the client accepts leniently and runs a legacy→V2 normalizer).
 * - The client-only `userOverride` flag (set in the review UI, never on the wire).
 * - Request-body schemas that only one side validates.
 *
 * deps: zod, domain/muscles | consumers: hollis-workouts server + mobile client
 */
import { z } from "zod";
/** Equipment types catalogued by the gym-setup wizard. Closed set + `other`. */
export declare const GYM_EQUIPMENT_TYPES: readonly ["barbell", "dumbbell", "kettlebell", "cable", "machine", "bodyweight", "resistance_band", "squat_rack", "bench", "pull_up_bar", "plate_loaded_machine", "smith_machine", "treadmill", "stationary_bike", "rowing_machine", "elliptical", "stairmaster", "jump_rope", "other"];
export type GymEquipmentType = (typeof GYM_EQUIPMENT_TYPES)[number];
/**
 * Equipment types the photo recognizer may return. Same as the gym-setup set
 * plus `none` (no equipment detected in the frame).
 */
export declare const RECOGNIZE_EQUIPMENT_TYPES: readonly ["barbell", "dumbbell", "kettlebell", "cable", "machine", "bodyweight", "resistance_band", "squat_rack", "bench", "pull_up_bar", "plate_loaded_machine", "smith_machine", "treadmill", "stationary_bike", "rowing_machine", "elliptical", "stairmaster", "jump_rope", "none", "other"];
export type RecognizeEquipmentType = (typeof RECOGNIZE_EQUIPMENT_TYPES)[number];
/** Flat set shape used inside `add_exercise.sets`. */
export declare const VoiceOpSetSchema: z.ZodObject<{
    weightKg: z.ZodOptional<z.ZodNumber>;
    reps: z.ZodOptional<z.ZodNumber>;
    rir: z.ZodOptional<z.ZodNumber>;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
    distanceKm: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * A single voice-log operation. Gemini structured output cannot emit a
 * discriminated union, so every field is optional except `op`/`confidence`; a
 * superRefine enforces the per-op required fields and narrows into the union.
 */
export declare const VoiceLogOperationSchema: z.ZodObject<{
    op: z.ZodEnum<{
        log_set: "log_set";
        modify_set: "modify_set";
        delete_set: "delete_set";
        skip_set: "skip_set";
        set_rest: "set_rest";
        set_active_exercise: "set_active_exercise";
        add_exercise: "add_exercise";
    }>;
    exerciseIndex: z.ZodOptional<z.ZodNumber>;
    setIndex: z.ZodOptional<z.ZodNumber>;
    weightKg: z.ZodOptional<z.ZodNumber>;
    reps: z.ZodOptional<z.ZodNumber>;
    rir: z.ZodOptional<z.ZodNumber>;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
    distanceKm: z.ZodOptional<z.ZodNumber>;
    restAfterSec: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    exerciseName: z.ZodOptional<z.ZodString>;
    trackingMode: z.ZodOptional<z.ZodEnum<{
        reps: "reps";
        cardio: "cardio";
        timed: "timed";
        stretch: "stretch";
    }>>;
    insertAfterIndex: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        weightKg: z.ZodOptional<z.ZodNumber>;
        reps: z.ZodOptional<z.ZodNumber>;
        rir: z.ZodOptional<z.ZodNumber>;
        durationSeconds: z.ZodOptional<z.ZodNumber>;
        distanceKm: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    confidence: z.ZodNumber;
    explanation: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type VoiceLogOperation = z.infer<typeof VoiceLogOperationSchema>;
/**
 * Backward-compat: coerce old-format exercises (no `exerciseType`) to `lifting`.
 * Note: stretch exercises are slotted as `timed` (a duration-based hold) — the
 * slot model has no dedicated stretch type.
 */
export declare const SlottedExerciseSchema: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
    slotId: z.ZodString;
    canonicalExerciseId: z.ZodString;
    exerciseType: z.ZodLiteral<"lifting">;
    sets: z.ZodNumber;
    reps: z.ZodNumber;
    rir: z.ZodNumber;
    progressionMode: z.ZodEnum<{
        weight_first: "weight_first";
        reps_first: "reps_first";
    }>;
    goalMode: z.ZodOptional<z.ZodEnum<{
        maintain: "maintain";
        progress: "progress";
        track_only: "track_only";
    }>>;
    priorityLevel: z.ZodOptional<z.ZodEnum<{
        primary: "primary";
        secondary: "secondary";
        supporting: "supporting";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    slotId: z.ZodString;
    canonicalExerciseId: z.ZodString;
    exerciseType: z.ZodLiteral<"timed">;
    sets: z.ZodNumber;
    durationSeconds: z.ZodNumber;
    progressionMode: z.ZodLiteral<"duration_first">;
    goalMode: z.ZodOptional<z.ZodEnum<{
        maintain: "maintain";
        progress: "progress";
        track_only: "track_only";
    }>>;
    priorityLevel: z.ZodOptional<z.ZodEnum<{
        primary: "primary";
        secondary: "secondary";
        supporting: "supporting";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    slotId: z.ZodString;
    canonicalExerciseId: z.ZodString;
    exerciseType: z.ZodLiteral<"cardio">;
    durationSeconds: z.ZodNullable<z.ZodNumber>;
    targetDistanceKm: z.ZodNullable<z.ZodNumber>;
    targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
    goalMode: z.ZodOptional<z.ZodEnum<{
        maintain: "maintain";
        progress: "progress";
        track_only: "track_only";
    }>>;
    priorityLevel: z.ZodOptional<z.ZodEnum<{
        primary: "primary";
        secondary: "secondary";
        supporting: "supporting";
    }>>;
}, z.core.$strip>], "exerciseType">>;
export declare const SlottedProgramSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<{
        custom: "custom";
        linear: "linear";
        undulating: "undulating";
        block: "block";
    }>;
    durationWeeks: z.ZodNumber;
    deloadWeekNumbers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    deloadPercent: z.ZodOptional<z.ZodNumber>;
    schedule: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        name: z.ZodString;
        exercises: z.ZodArray<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
            slotId: z.ZodString;
            canonicalExerciseId: z.ZodString;
            exerciseType: z.ZodLiteral<"lifting">;
            sets: z.ZodNumber;
            reps: z.ZodNumber;
            rir: z.ZodNumber;
            progressionMode: z.ZodEnum<{
                weight_first: "weight_first";
                reps_first: "reps_first";
            }>;
            goalMode: z.ZodOptional<z.ZodEnum<{
                maintain: "maintain";
                progress: "progress";
                track_only: "track_only";
            }>>;
            priorityLevel: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                secondary: "secondary";
                supporting: "supporting";
            }>>;
        }, z.core.$strip>, z.ZodObject<{
            slotId: z.ZodString;
            canonicalExerciseId: z.ZodString;
            exerciseType: z.ZodLiteral<"timed">;
            sets: z.ZodNumber;
            durationSeconds: z.ZodNumber;
            progressionMode: z.ZodLiteral<"duration_first">;
            goalMode: z.ZodOptional<z.ZodEnum<{
                maintain: "maintain";
                progress: "progress";
                track_only: "track_only";
            }>>;
            priorityLevel: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                secondary: "secondary";
                supporting: "supporting";
            }>>;
        }, z.core.$strip>, z.ZodObject<{
            slotId: z.ZodString;
            canonicalExerciseId: z.ZodString;
            exerciseType: z.ZodLiteral<"cardio">;
            durationSeconds: z.ZodNullable<z.ZodNumber>;
            targetDistanceKm: z.ZodNullable<z.ZodNumber>;
            targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
            goalMode: z.ZodOptional<z.ZodEnum<{
                maintain: "maintain";
                progress: "progress";
                track_only: "track_only";
            }>>;
            priorityLevel: z.ZodOptional<z.ZodEnum<{
                primary: "primary";
                secondary: "secondary";
                supporting: "supporting";
            }>>;
        }, z.core.$strip>], "exerciseType">>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SlottedProgram = z.infer<typeof SlottedProgramSchema>;
/** Patchable per-slot training parameters. All optional; bounds match the slot schemas. */
export declare const EditParamsSchema: z.ZodObject<{
    sets: z.ZodOptional<z.ZodNumber>;
    reps: z.ZodOptional<z.ZodNumber>;
    rir: z.ZodOptional<z.ZodNumber>;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
    targetDistanceKm: z.ZodOptional<z.ZodNumber>;
    targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
    progressionMode: z.ZodOptional<z.ZodEnum<{
        weight_first: "weight_first";
        reps_first: "reps_first";
        duration_first: "duration_first";
    }>>;
}, z.core.$strip>;
export type EditParams = z.infer<typeof EditParamsSchema>;
/** Address a program day by exactly one of: name (preferred), positional index, or dayOfWeek. */
export declare const DayRefSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    index: z.ZodOptional<z.ZodNumber>;
    dayOfWeek: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type DayRef = z.infer<typeof DayRefSchema>;
/** Identify an exercise within a day by canonical id (preferred) or display name. */
export declare const ExerciseRefSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ExerciseRef = z.infer<typeof ExerciseRefSchema>;
/** Address a slot by its stable slotId, or by (day + exercise) when the id is unknown. */
export declare const SlotRefSchema: z.ZodUnion<readonly [z.ZodObject<{
    slotId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    day: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        index: z.ZodOptional<z.ZodNumber>;
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    exercise: z.ZodObject<{
        canonicalExerciseId: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>]>;
export type SlotRef = z.infer<typeof SlotRefSchema>;
/** A single robust, semantically-addressed program edit operation. */
export declare const EditOperationSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"replace_exercise">;
    slot: z.ZodUnion<readonly [z.ZodObject<{
        slotId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        day: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        exercise: z.ZodObject<{
            canonicalExerciseId: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>]>;
    newExerciseId: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        sets: z.ZodOptional<z.ZodNumber>;
        reps: z.ZodOptional<z.ZodNumber>;
        rir: z.ZodOptional<z.ZodNumber>;
        durationSeconds: z.ZodOptional<z.ZodNumber>;
        targetDistanceKm: z.ZodOptional<z.ZodNumber>;
        targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
        progressionMode: z.ZodOptional<z.ZodEnum<{
            weight_first: "weight_first";
            reps_first: "reps_first";
            duration_first: "duration_first";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"update_set_params">;
    slot: z.ZodUnion<readonly [z.ZodObject<{
        slotId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        day: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        exercise: z.ZodObject<{
            canonicalExerciseId: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>]>;
    params: z.ZodObject<{
        sets: z.ZodOptional<z.ZodNumber>;
        reps: z.ZodOptional<z.ZodNumber>;
        rir: z.ZodOptional<z.ZodNumber>;
        durationSeconds: z.ZodOptional<z.ZodNumber>;
        targetDistanceKm: z.ZodOptional<z.ZodNumber>;
        targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
        progressionMode: z.ZodOptional<z.ZodEnum<{
            weight_first: "weight_first";
            reps_first: "reps_first";
            duration_first: "duration_first";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"remove_exercise">;
    slot: z.ZodUnion<readonly [z.ZodObject<{
        slotId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        day: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        exercise: z.ZodObject<{
            canonicalExerciseId: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"add_exercise">;
    day: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        index: z.ZodOptional<z.ZodNumber>;
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    canonicalExerciseId: z.ZodString;
    exerciseType: z.ZodEnum<{
        cardio: "cardio";
        timed: "timed";
        lifting: "lifting";
    }>;
    insertAfterSlotId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    params: z.ZodOptional<z.ZodObject<{
        sets: z.ZodOptional<z.ZodNumber>;
        reps: z.ZodOptional<z.ZodNumber>;
        rir: z.ZodOptional<z.ZodNumber>;
        durationSeconds: z.ZodOptional<z.ZodNumber>;
        targetDistanceKm: z.ZodOptional<z.ZodNumber>;
        targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
        progressionMode: z.ZodOptional<z.ZodEnum<{
            weight_first: "weight_first";
            reps_first: "reps_first";
            duration_first: "duration_first";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"move_or_swap_days">;
    fromDay: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        index: z.ZodOptional<z.ZodNumber>;
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    toDay: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        index: z.ZodOptional<z.ZodNumber>;
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    mode: z.ZodEnum<{
        swap: "swap";
        move: "move";
    }>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"reorder_within_day">;
    day: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        index: z.ZodOptional<z.ZodNumber>;
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    orderedSlots: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        slotId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        day: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        exercise: z.ZodObject<{
            canonicalExerciseId: z.ZodOptional<z.ZodString>;
            name: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>]>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"rename_or_reschedule_day">;
    day: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        index: z.ZodOptional<z.ZodNumber>;
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    newName: z.ZodOptional<z.ZodString>;
    newDayOfWeek: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"apply_to_all_days">;
    fromExerciseId: z.ZodString;
    toExerciseId: z.ZodString;
    params: z.ZodOptional<z.ZodObject<{
        sets: z.ZodOptional<z.ZodNumber>;
        reps: z.ZodOptional<z.ZodNumber>;
        rir: z.ZodOptional<z.ZodNumber>;
        durationSeconds: z.ZodOptional<z.ZodNumber>;
        targetDistanceKm: z.ZodOptional<z.ZodNumber>;
        targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
        progressionMode: z.ZodOptional<z.ZodEnum<{
            weight_first: "weight_first";
            reps_first: "reps_first";
            duration_first: "duration_first";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"add_day">;
    name: z.ZodString;
    dayOfWeek: z.ZodNumber;
    exercises: z.ZodArray<z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        exerciseType: z.ZodEnum<{
            cardio: "cardio";
            timed: "timed";
            lifting: "lifting";
        }>;
        params: z.ZodOptional<z.ZodObject<{
            sets: z.ZodOptional<z.ZodNumber>;
            reps: z.ZodOptional<z.ZodNumber>;
            rir: z.ZodOptional<z.ZodNumber>;
            durationSeconds: z.ZodOptional<z.ZodNumber>;
            targetDistanceKm: z.ZodOptional<z.ZodNumber>;
            targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
            progressionMode: z.ZodOptional<z.ZodEnum<{
                weight_first: "weight_first";
                reps_first: "reps_first";
                duration_first: "duration_first";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>], "op">;
export type EditOperation = z.infer<typeof EditOperationSchema>;
/**
 * @deprecated Legacy 5-op program-edit union (slotId-only addressing, no bounds
 * on the update fields). Replaced by {@link EditOperationSchema}. Kept exported
 * for one deprecation cycle so the server can accept old-format edits while the
 * client rolls over to the new union.
 */
export declare const LegacyProgramEditSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"replace_exercise">;
    slotId: z.ZodString;
    newExerciseId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"update_sets">;
    slotId: z.ZodString;
    sets: z.ZodOptional<z.ZodNumber>;
    reps: z.ZodOptional<z.ZodNumber>;
    rir: z.ZodOptional<z.ZodNumber>;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
    progressionMode: z.ZodOptional<z.ZodEnum<{
        weight_first: "weight_first";
        reps_first: "reps_first";
        duration_first: "duration_first";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"remove_exercise">;
    slotId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"add_exercise">;
    dayOfWeek: z.ZodNumber;
    newSlotId: z.ZodString;
    canonicalExerciseId: z.ZodString;
    exerciseType: z.ZodDefault<z.ZodEnum<{
        cardio: "cardio";
        timed: "timed";
        lifting: "lifting";
    }>>;
    sets: z.ZodOptional<z.ZodNumber>;
    reps: z.ZodOptional<z.ZodNumber>;
    rir: z.ZodOptional<z.ZodNumber>;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
    targetDistanceKm: z.ZodOptional<z.ZodNumber>;
    targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
    progressionMode: z.ZodOptional<z.ZodEnum<{
        weight_first: "weight_first";
        reps_first: "reps_first";
        duration_first: "duration_first";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"swap_days">;
    fromDayOfWeek: z.ZodNumber;
    toDayOfWeek: z.ZodNumber;
}, z.core.$strip>], "op">;
export type LegacyProgramEdit = z.infer<typeof LegacyProgramEditSchema>;
/** Discriminated union of every Smart Builder turn the server can return. */
export declare const SmartBuilderResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"questions">;
    message: z.ZodOptional<z.ZodString>;
    groups: z.ZodArray<z.ZodObject<{
        topic: z.ZodString;
        questions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            question: z.ZodString;
            type: z.ZodEnum<{
                text: "text";
                chips: "chips";
                slider: "slider";
                toggle: "toggle";
            }>;
            options: z.ZodOptional<z.ZodArray<z.ZodString>>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            step: z.ZodOptional<z.ZodNumber>;
            defaultValue: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            placeholder: z.ZodOptional<z.ZodString>;
            multiline: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"ready">;
    message: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"program">;
    message: z.ZodOptional<z.ZodString>;
    program: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        type: z.ZodEnum<{
            custom: "custom";
            linear: "linear";
            undulating: "undulating";
            block: "block";
        }>;
        durationWeeks: z.ZodNumber;
        deloadWeekNumbers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        deloadPercent: z.ZodOptional<z.ZodNumber>;
        schedule: z.ZodArray<z.ZodObject<{
            dayOfWeek: z.ZodNumber;
            name: z.ZodString;
            exercises: z.ZodArray<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
                slotId: z.ZodString;
                canonicalExerciseId: z.ZodString;
                exerciseType: z.ZodLiteral<"lifting">;
                sets: z.ZodNumber;
                reps: z.ZodNumber;
                rir: z.ZodNumber;
                progressionMode: z.ZodEnum<{
                    weight_first: "weight_first";
                    reps_first: "reps_first";
                }>;
                goalMode: z.ZodOptional<z.ZodEnum<{
                    maintain: "maintain";
                    progress: "progress";
                    track_only: "track_only";
                }>>;
                priorityLevel: z.ZodOptional<z.ZodEnum<{
                    primary: "primary";
                    secondary: "secondary";
                    supporting: "supporting";
                }>>;
            }, z.core.$strip>, z.ZodObject<{
                slotId: z.ZodString;
                canonicalExerciseId: z.ZodString;
                exerciseType: z.ZodLiteral<"timed">;
                sets: z.ZodNumber;
                durationSeconds: z.ZodNumber;
                progressionMode: z.ZodLiteral<"duration_first">;
                goalMode: z.ZodOptional<z.ZodEnum<{
                    maintain: "maintain";
                    progress: "progress";
                    track_only: "track_only";
                }>>;
                priorityLevel: z.ZodOptional<z.ZodEnum<{
                    primary: "primary";
                    secondary: "secondary";
                    supporting: "supporting";
                }>>;
            }, z.core.$strip>, z.ZodObject<{
                slotId: z.ZodString;
                canonicalExerciseId: z.ZodString;
                exerciseType: z.ZodLiteral<"cardio">;
                durationSeconds: z.ZodNullable<z.ZodNumber>;
                targetDistanceKm: z.ZodNullable<z.ZodNumber>;
                targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
                goalMode: z.ZodOptional<z.ZodEnum<{
                    maintain: "maintain";
                    progress: "progress";
                    track_only: "track_only";
                }>>;
                priorityLevel: z.ZodOptional<z.ZodEnum<{
                    primary: "primary";
                    secondary: "secondary";
                    supporting: "supporting";
                }>>;
            }, z.core.$strip>], "exerciseType">>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"edits">;
    edits: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        op: z.ZodLiteral<"replace_exercise">;
        slot: z.ZodUnion<readonly [z.ZodObject<{
            slotId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            day: z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                index: z.ZodOptional<z.ZodNumber>;
                dayOfWeek: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            exercise: z.ZodObject<{
                canonicalExerciseId: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        }, z.core.$strip>]>;
        newExerciseId: z.ZodString;
        params: z.ZodOptional<z.ZodObject<{
            sets: z.ZodOptional<z.ZodNumber>;
            reps: z.ZodOptional<z.ZodNumber>;
            rir: z.ZodOptional<z.ZodNumber>;
            durationSeconds: z.ZodOptional<z.ZodNumber>;
            targetDistanceKm: z.ZodOptional<z.ZodNumber>;
            targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
            progressionMode: z.ZodOptional<z.ZodEnum<{
                weight_first: "weight_first";
                reps_first: "reps_first";
                duration_first: "duration_first";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"update_set_params">;
        slot: z.ZodUnion<readonly [z.ZodObject<{
            slotId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            day: z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                index: z.ZodOptional<z.ZodNumber>;
                dayOfWeek: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            exercise: z.ZodObject<{
                canonicalExerciseId: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        }, z.core.$strip>]>;
        params: z.ZodObject<{
            sets: z.ZodOptional<z.ZodNumber>;
            reps: z.ZodOptional<z.ZodNumber>;
            rir: z.ZodOptional<z.ZodNumber>;
            durationSeconds: z.ZodOptional<z.ZodNumber>;
            targetDistanceKm: z.ZodOptional<z.ZodNumber>;
            targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
            progressionMode: z.ZodOptional<z.ZodEnum<{
                weight_first: "weight_first";
                reps_first: "reps_first";
                duration_first: "duration_first";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"remove_exercise">;
        slot: z.ZodUnion<readonly [z.ZodObject<{
            slotId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            day: z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                index: z.ZodOptional<z.ZodNumber>;
                dayOfWeek: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            exercise: z.ZodObject<{
                canonicalExerciseId: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"add_exercise">;
        day: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        canonicalExerciseId: z.ZodString;
        exerciseType: z.ZodEnum<{
            cardio: "cardio";
            timed: "timed";
            lifting: "lifting";
        }>;
        insertAfterSlotId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        params: z.ZodOptional<z.ZodObject<{
            sets: z.ZodOptional<z.ZodNumber>;
            reps: z.ZodOptional<z.ZodNumber>;
            rir: z.ZodOptional<z.ZodNumber>;
            durationSeconds: z.ZodOptional<z.ZodNumber>;
            targetDistanceKm: z.ZodOptional<z.ZodNumber>;
            targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
            progressionMode: z.ZodOptional<z.ZodEnum<{
                weight_first: "weight_first";
                reps_first: "reps_first";
                duration_first: "duration_first";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"move_or_swap_days">;
        fromDay: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        toDay: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        mode: z.ZodEnum<{
            swap: "swap";
            move: "move";
        }>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"reorder_within_day">;
        day: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        orderedSlots: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
            slotId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            day: z.ZodObject<{
                name: z.ZodOptional<z.ZodString>;
                index: z.ZodOptional<z.ZodNumber>;
                dayOfWeek: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            exercise: z.ZodObject<{
                canonicalExerciseId: z.ZodOptional<z.ZodString>;
                name: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
        }, z.core.$strip>]>>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"rename_or_reschedule_day">;
        day: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            index: z.ZodOptional<z.ZodNumber>;
            dayOfWeek: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        newName: z.ZodOptional<z.ZodString>;
        newDayOfWeek: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"apply_to_all_days">;
        fromExerciseId: z.ZodString;
        toExerciseId: z.ZodString;
        params: z.ZodOptional<z.ZodObject<{
            sets: z.ZodOptional<z.ZodNumber>;
            reps: z.ZodOptional<z.ZodNumber>;
            rir: z.ZodOptional<z.ZodNumber>;
            durationSeconds: z.ZodOptional<z.ZodNumber>;
            targetDistanceKm: z.ZodOptional<z.ZodNumber>;
            targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
            progressionMode: z.ZodOptional<z.ZodEnum<{
                weight_first: "weight_first";
                reps_first: "reps_first";
                duration_first: "duration_first";
            }>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"add_day">;
        name: z.ZodString;
        dayOfWeek: z.ZodNumber;
        exercises: z.ZodArray<z.ZodObject<{
            canonicalExerciseId: z.ZodString;
            exerciseType: z.ZodEnum<{
                cardio: "cardio";
                timed: "timed";
                lifting: "lifting";
            }>;
            params: z.ZodOptional<z.ZodObject<{
                sets: z.ZodOptional<z.ZodNumber>;
                reps: z.ZodOptional<z.ZodNumber>;
                rir: z.ZodOptional<z.ZodNumber>;
                durationSeconds: z.ZodOptional<z.ZodNumber>;
                targetDistanceKm: z.ZodOptional<z.ZodNumber>;
                targetSpeedKmh: z.ZodOptional<z.ZodNumber>;
                progressionMode: z.ZodOptional<z.ZodEnum<{
                    weight_first: "weight_first";
                    reps_first: "reps_first";
                    duration_first: "duration_first";
                }>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>], "op">>;
    message: z.ZodString;
}, z.core.$strip>], "type">;
export type SmartBuilderResponse = z.infer<typeof SmartBuilderResponseSchema>;
/** Lightweight profile facts that shape program design. */
export declare const UserProfileContextSchema: z.ZodObject<{
    experienceLevel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    trainingPhase: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    trainingPhaseStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    gender: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ageYears: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    bodyweightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    displayUnit: z.ZodOptional<z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>>;
    progressionIncrementKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    repIncrement: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    adaptiveProgression: z.ZodOptional<z.ZodBoolean>;
    defaultRir: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type UserProfileContext = z.infer<typeof UserProfileContextSchema>;
/** Per-exercise strength + progression state, keyed by canonical exercise id. */
export declare const ExerciseStrengthStateSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    exerciseName: z.ZodString;
    currentE1RMKg: z.ZodNullable<z.ZodNumber>;
    workingWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    workingReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    adaptiveRateKgPerSession: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lastLoggedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    calibrationState: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    missStreak: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isInPlateauDeload: z.ZodOptional<z.ZodBoolean>;
    plateauDeloadPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lastDecision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastDecisionSummary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type ExerciseStrengthState = z.infer<typeof ExerciseStrengthStateSchema>;
/** Summary of the user's currently-active program and their progress through it. */
export declare const ActiveProgramSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    durationWeeks: z.ZodNumber;
    startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    currentWeek: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isDeloadWeek: z.ZodOptional<z.ZodBoolean>;
    completedSessionCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    days: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        name: z.ZodString;
        exerciseNames: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ActiveProgramSummary = z.infer<typeof ActiveProgramSummarySchema>;
/** Per-exercise cardio personal bests / recency, keyed by canonical exercise id. */
export declare const CardioBaselineSummarySchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    exerciseName: z.ZodString;
    bestDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    bestDistanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    bestPaceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lastDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lastUpdatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CardioBaselineSummary = z.infer<typeof CardioBaselineSummarySchema>;
/** Per-machine configuration the user has set at a gym. */
export declare const GymExerciseConfigSchema: z.ZodObject<{
    canonicalExerciseId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    baseWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weightUnit: z.ZodOptional<z.ZodString>;
    weightMode: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type GymExerciseConfig = z.infer<typeof GymExerciseConfigSchema>;
/** The user's gym: how exercises are selected, available equipment, and gym-available exercise ids. */
export declare const GymContextSchema: z.ZodObject<{
    exerciseSelectionMode: z.ZodEnum<{
        equipment_based: "equipment_based";
        exercise: "exercise";
    }>;
    equipment: z.ZodArray<z.ZodString>;
    equipmentIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    gymExerciseConfigs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        baseWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        weightUnit: z.ZodOptional<z.ZodString>;
        weightMode: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
    gymAvailableExerciseIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type GymContext = z.infer<typeof GymContextSchema>;
/** An active injury/restriction the program must respect. */
export declare const InjuryContextSchema: z.ZodObject<{
    muscleGroup: z.ZodString;
    description: z.ZodString;
}, z.core.$strip>;
export type InjuryContext = z.infer<typeof InjuryContextSchema>;
/** A condensed completed-session summary used to convey recent training. */
export declare const WorkoutSummarySchema: z.ZodObject<{
    date: z.ZodString;
    programDayName: z.ZodNullable<z.ZodString>;
    isFreestyle: z.ZodBoolean;
    totalVolumeKg: z.ZodNumber;
    durationMinutes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    exercises: z.ZodArray<z.ZodObject<{
        exerciseId: z.ZodString;
        exerciseName: z.ZodString;
        sets: z.ZodNumber;
        topWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        reps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        setDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
            weightKg: z.ZodNumber;
            reps: z.ZodNumber;
            rir: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    muscleGroupsHit: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type WorkoutSummary = z.infer<typeof WorkoutSummarySchema>;
/** Recent readiness signal derived from questionnaire correlations. */
export declare const ReadinessContextSchema: z.ZodObject<{
    score: z.ZodNumber;
    confidence: z.ZodNumber;
}, z.core.$strip>;
export type ReadinessContext = z.infer<typeof ReadinessContextSchema>;
/** One entry of the equipment-filtered exercise library the agent may choose from. */
export declare const ExerciseLibraryEntrySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    subcategory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    primaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodString>>;
    secondaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodString>>;
    equipmentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isBodyweight: z.ZodOptional<z.ZodBoolean>;
    isUnilateral: z.ZodOptional<z.ZodBoolean>;
    trackingMode: z.ZodOptional<z.ZodString>;
    requiredEquipment: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type ExerciseLibraryEntry = z.infer<typeof ExerciseLibraryEntrySchema>;
/**
 * The user's explicitly-configured training goals/targets. Distinct from the
 * implicit `trainingPhase` enum — these are concrete numbers the user set, so
 * the builder can size weekly volume and cardio to what the user is aiming for.
 */
export declare const TrainingGoalsContextSchema: z.ZodObject<{
    volumeTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        muscleGroup: z.ZodString;
        weeklySets: z.ZodNumber;
    }, z.core.$strip>>>;
    cardioGoalPreset: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cardioWeeklyZoneMinutes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        z1: z.ZodNumber;
        z2: z.ZodNumber;
        z3: z.ZodNumber;
        z4: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type TrainingGoalsContext = z.infer<typeof TrainingGoalsContextSchema>;
/** The complete, typed context the Smart Builder agent reasons over. */
export declare const UserTrainingContextSchema: z.ZodObject<{
    profile: z.ZodObject<{
        experienceLevel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        trainingPhase: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        trainingPhaseStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        gender: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        ageYears: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        bodyweightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        displayUnit: z.ZodOptional<z.ZodEnum<{
            kg: "kg";
            lbs: "lbs";
        }>>;
        progressionIncrementKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        repIncrement: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        adaptiveProgression: z.ZodOptional<z.ZodBoolean>;
        defaultRir: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>;
    exerciseStrengthStates: z.ZodArray<z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        exerciseName: z.ZodString;
        currentE1RMKg: z.ZodNullable<z.ZodNumber>;
        workingWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        workingReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        adaptiveRateKgPerSession: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        lastLoggedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        calibrationState: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        missStreak: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        isInPlateauDeload: z.ZodOptional<z.ZodBoolean>;
        plateauDeloadPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        lastDecision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lastDecisionSummary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    recentWorkouts: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        programDayName: z.ZodNullable<z.ZodString>;
        isFreestyle: z.ZodBoolean;
        totalVolumeKg: z.ZodNumber;
        durationMinutes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        exercises: z.ZodArray<z.ZodObject<{
            exerciseId: z.ZodString;
            exerciseName: z.ZodString;
            sets: z.ZodNumber;
            topWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            reps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            setDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
                weightKg: z.ZodNumber;
                reps: z.ZodNumber;
                rir: z.ZodNumber;
            }, z.core.$strip>>>;
        }, z.core.$strip>>;
        muscleGroupsHit: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    activeProgram: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodString;
        durationWeeks: z.ZodNumber;
        startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        currentWeek: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        isDeloadWeek: z.ZodOptional<z.ZodBoolean>;
        completedSessionCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        days: z.ZodArray<z.ZodObject<{
            dayOfWeek: z.ZodNumber;
            name: z.ZodString;
            exerciseNames: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
    readiness: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        score: z.ZodNumber;
        confidence: z.ZodNumber;
    }, z.core.$strip>>>;
    injuries: z.ZodArray<z.ZodObject<{
        muscleGroup: z.ZodString;
        description: z.ZodString;
    }, z.core.$strip>>;
    gym: z.ZodObject<{
        exerciseSelectionMode: z.ZodEnum<{
            equipment_based: "equipment_based";
            exercise: "exercise";
        }>;
        equipment: z.ZodArray<z.ZodString>;
        equipmentIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        gymExerciseConfigs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            canonicalExerciseId: z.ZodString;
            name: z.ZodOptional<z.ZodString>;
            baseWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            weightUnit: z.ZodOptional<z.ZodString>;
            weightMode: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        gymAvailableExerciseIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    cardioBaselines: z.ZodArray<z.ZodObject<{
        canonicalExerciseId: z.ZodString;
        exerciseName: z.ZodString;
        bestDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        bestDistanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        bestPaceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        lastDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        lastUpdatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    exerciseLibrary: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        category: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        subcategory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        primaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodString>>;
        secondaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodString>>;
        equipmentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isBodyweight: z.ZodOptional<z.ZodBoolean>;
        isUnilateral: z.ZodOptional<z.ZodBoolean>;
        trackingMode: z.ZodOptional<z.ZodString>;
        requiredEquipment: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    goals: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        volumeTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            muscleGroup: z.ZodString;
            weeklySets: z.ZodNumber;
        }, z.core.$strip>>>;
        cardioGoalPreset: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        cardioWeeklyZoneMinutes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            z1: z.ZodNumber;
            z2: z.ZodNumber;
            z3: z.ZodNumber;
            z4: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type UserTrainingContext = z.infer<typeof UserTrainingContextSchema>;
/** Which program a refine targets: a saved program by id, the in-flight draft, or a brand-new program. */
export declare const ProgramRefSchema: z.ZodUnion<readonly [z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    draft: z.ZodLiteral<true>;
}, z.core.$strip>, z.ZodObject<{}, z.core.$strip>]>;
export type ProgramRef = z.infer<typeof ProgramRefSchema>;
/** One conversational turn between the user and the Smart Builder agent. */
export declare const ConversationMessageSchema: z.ZodObject<{
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
    }>;
    content: z.ZodString;
}, z.core.$strip>;
export type ConversationMessage = z.infer<typeof ConversationMessageSchema>;
/**
 * Unified Smart Builder request. `userContext` is now the fully-typed
 * {@link UserTrainingContextSchema} (was `z.record(string, unknown)`).
 * `currentProgram` carries the slotted program being refined (a draft, or a
 * saved program projected into slotted form) when `action === "refine"` and the
 * server cannot resolve it from `programRef.id`.
 */
export declare const SmartBuilderRequestSchema: z.ZodObject<{
    action: z.ZodEnum<{
        converse: "converse";
        generate: "generate";
        refine: "refine";
    }>;
    conversationHistory: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodString;
    }, z.core.$strip>>;
    userContext: z.ZodObject<{
        profile: z.ZodObject<{
            experienceLevel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            trainingPhase: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            trainingPhaseStartedAtMs: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            gender: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            ageYears: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            bodyweightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            displayUnit: z.ZodOptional<z.ZodEnum<{
                kg: "kg";
                lbs: "lbs";
            }>>;
            progressionIncrementKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            repIncrement: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            adaptiveProgression: z.ZodOptional<z.ZodBoolean>;
            defaultRir: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>;
        exerciseStrengthStates: z.ZodArray<z.ZodObject<{
            canonicalExerciseId: z.ZodString;
            exerciseName: z.ZodString;
            currentE1RMKg: z.ZodNullable<z.ZodNumber>;
            workingWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            workingReps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            adaptiveRateKgPerSession: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            lastLoggedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            calibrationState: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            missStreak: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            isInPlateauDeload: z.ZodOptional<z.ZodBoolean>;
            plateauDeloadPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            lastDecision: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lastDecisionSummary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
        recentWorkouts: z.ZodArray<z.ZodObject<{
            date: z.ZodString;
            programDayName: z.ZodNullable<z.ZodString>;
            isFreestyle: z.ZodBoolean;
            totalVolumeKg: z.ZodNumber;
            durationMinutes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            exercises: z.ZodArray<z.ZodObject<{
                exerciseId: z.ZodString;
                exerciseName: z.ZodString;
                sets: z.ZodNumber;
                topWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                reps: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                setDetails: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    weightKg: z.ZodNumber;
                    reps: z.ZodNumber;
                    rir: z.ZodNumber;
                }, z.core.$strip>>>;
            }, z.core.$strip>>;
            muscleGroupsHit: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
        activeProgram: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            type: z.ZodString;
            durationWeeks: z.ZodNumber;
            startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            currentWeek: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            isDeloadWeek: z.ZodOptional<z.ZodBoolean>;
            completedSessionCount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            days: z.ZodArray<z.ZodObject<{
                dayOfWeek: z.ZodNumber;
                name: z.ZodString;
                exerciseNames: z.ZodArray<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>>;
        readiness: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            score: z.ZodNumber;
            confidence: z.ZodNumber;
        }, z.core.$strip>>>;
        injuries: z.ZodArray<z.ZodObject<{
            muscleGroup: z.ZodString;
            description: z.ZodString;
        }, z.core.$strip>>;
        gym: z.ZodObject<{
            exerciseSelectionMode: z.ZodEnum<{
                equipment_based: "equipment_based";
                exercise: "exercise";
            }>;
            equipment: z.ZodArray<z.ZodString>;
            equipmentIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
            gymExerciseConfigs: z.ZodOptional<z.ZodArray<z.ZodObject<{
                canonicalExerciseId: z.ZodString;
                name: z.ZodOptional<z.ZodString>;
                baseWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                weightUnit: z.ZodOptional<z.ZodString>;
                weightMode: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>>>;
            gymAvailableExerciseIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
        cardioBaselines: z.ZodArray<z.ZodObject<{
            canonicalExerciseId: z.ZodString;
            exerciseName: z.ZodString;
            bestDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            bestDistanceKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            bestPaceSecondsPerKm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            lastDurationSeconds: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            lastUpdatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
        exerciseLibrary: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            category: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            subcategory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            primaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodString>>;
            secondaryMuscleGroups: z.ZodOptional<z.ZodArray<z.ZodString>>;
            equipmentType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            isBodyweight: z.ZodOptional<z.ZodBoolean>;
            isUnilateral: z.ZodOptional<z.ZodBoolean>;
            trackingMode: z.ZodOptional<z.ZodString>;
            requiredEquipment: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
        goals: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            volumeTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
                muscleGroup: z.ZodString;
                weeklySets: z.ZodNumber;
            }, z.core.$strip>>>;
            cardioGoalPreset: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            cardioWeeklyZoneMinutes: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                z1: z.ZodNumber;
                z2: z.ZodNumber;
                z3: z.ZodNumber;
                z4: z.ZodNumber;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
    programRef: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        draft: z.ZodLiteral<true>;
    }, z.core.$strip>, z.ZodObject<{}, z.core.$strip>]>>;
    currentProgram: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        type: z.ZodEnum<{
            custom: "custom";
            linear: "linear";
            undulating: "undulating";
            block: "block";
        }>;
        durationWeeks: z.ZodNumber;
        deloadWeekNumbers: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        deloadPercent: z.ZodOptional<z.ZodNumber>;
        schedule: z.ZodArray<z.ZodObject<{
            dayOfWeek: z.ZodNumber;
            name: z.ZodString;
            exercises: z.ZodArray<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodDiscriminatedUnion<[z.ZodObject<{
                slotId: z.ZodString;
                canonicalExerciseId: z.ZodString;
                exerciseType: z.ZodLiteral<"lifting">;
                sets: z.ZodNumber;
                reps: z.ZodNumber;
                rir: z.ZodNumber;
                progressionMode: z.ZodEnum<{
                    weight_first: "weight_first";
                    reps_first: "reps_first";
                }>;
                goalMode: z.ZodOptional<z.ZodEnum<{
                    maintain: "maintain";
                    progress: "progress";
                    track_only: "track_only";
                }>>;
                priorityLevel: z.ZodOptional<z.ZodEnum<{
                    primary: "primary";
                    secondary: "secondary";
                    supporting: "supporting";
                }>>;
            }, z.core.$strip>, z.ZodObject<{
                slotId: z.ZodString;
                canonicalExerciseId: z.ZodString;
                exerciseType: z.ZodLiteral<"timed">;
                sets: z.ZodNumber;
                durationSeconds: z.ZodNumber;
                progressionMode: z.ZodLiteral<"duration_first">;
                goalMode: z.ZodOptional<z.ZodEnum<{
                    maintain: "maintain";
                    progress: "progress";
                    track_only: "track_only";
                }>>;
                priorityLevel: z.ZodOptional<z.ZodEnum<{
                    primary: "primary";
                    secondary: "secondary";
                    supporting: "supporting";
                }>>;
            }, z.core.$strip>, z.ZodObject<{
                slotId: z.ZodString;
                canonicalExerciseId: z.ZodString;
                exerciseType: z.ZodLiteral<"cardio">;
                durationSeconds: z.ZodNullable<z.ZodNumber>;
                targetDistanceKm: z.ZodNullable<z.ZodNumber>;
                targetSpeedKmh: z.ZodNullable<z.ZodNumber>;
                goalMode: z.ZodOptional<z.ZodEnum<{
                    maintain: "maintain";
                    progress: "progress";
                    track_only: "track_only";
                }>>;
                priorityLevel: z.ZodOptional<z.ZodEnum<{
                    primary: "primary";
                    secondary: "secondary";
                    supporting: "supporting";
                }>>;
            }, z.core.$strip>], "exerciseType">>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SmartBuilderRequest = z.infer<typeof SmartBuilderRequestSchema>;
export declare const ExerciseMatchSchema: z.ZodObject<{
    freestyleName: z.ZodString;
    canonicalExerciseId: z.ZodNullable<z.ZodString>;
    confidence: z.ZodNumber;
    suggestedCategory: z.ZodNullable<z.ZodString>;
    suggestedMuscleGroups: z.ZodArray<z.ZodString>;
    suggestedEquipmentType: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const MatchExercisesResponseSchema: z.ZodObject<{
    matches: z.ZodArray<z.ZodObject<{
        freestyleName: z.ZodString;
        canonicalExerciseId: z.ZodNullable<z.ZodString>;
        confidence: z.ZodNumber;
        suggestedCategory: z.ZodNullable<z.ZodString>;
        suggestedMuscleGroups: z.ZodArray<z.ZodString>;
        suggestedEquipmentType: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type MatchExercisesResponse = z.infer<typeof MatchExercisesResponseSchema>;
export declare const RecognizeEquipmentResponseSchema: z.ZodObject<{
    equipmentType: z.ZodEnum<{
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
    suggestedExerciseName: z.ZodString;
    confidence: z.ZodNumber;
    clarifyingQuestions: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type RecognizeEquipmentResponse = z.infer<typeof RecognizeEquipmentResponseSchema>;
export declare const TagExerciseMusclesResponseSchema: z.ZodObject<{
    tags: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        muscleGroups: z.ZodArray<z.ZodEnum<{
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
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type TagExerciseMusclesResponse = z.infer<typeof TagExerciseMusclesResponseSchema>;
export declare const GymSetupResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"questions">;
    message: z.ZodOptional<z.ZodString>;
    groups: z.ZodArray<z.ZodObject<{
        topic: z.ZodString;
        questions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            question: z.ZodString;
            type: z.ZodEnum<{
                text: "text";
                chips: "chips";
                slider: "slider";
                toggle: "toggle";
                multi_chips: "multi_chips";
            }>;
            options: z.ZodOptional<z.ZodArray<z.ZodString>>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            step: z.ZodOptional<z.ZodNumber>;
            defaultValue: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            placeholder: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"confirm">;
    message: z.ZodString;
    equipment: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            other: "other";
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
        variant: z.ZodOptional<z.ZodString>;
        weightStackKg: z.ZodOptional<z.ZodNumber>;
        incrementKg: z.ZodOptional<z.ZodNumber>;
        count: z.ZodDefault<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"update">;
    message: z.ZodOptional<z.ZodString>;
    equipment: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            other: "other";
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
        variant: z.ZodOptional<z.ZodString>;
        weightStackKg: z.ZodOptional<z.ZodNumber>;
        incrementKg: z.ZodOptional<z.ZodNumber>;
        count: z.ZodDefault<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    groups: z.ZodOptional<z.ZodArray<z.ZodObject<{
        topic: z.ZodString;
        questions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            question: z.ZodString;
            type: z.ZodEnum<{
                text: "text";
                chips: "chips";
                slider: "slider";
                toggle: "toggle";
                multi_chips: "multi_chips";
            }>;
            options: z.ZodOptional<z.ZodArray<z.ZodString>>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            step: z.ZodOptional<z.ZodNumber>;
            defaultValue: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            placeholder: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>], "type">;
export type GymSetupResponse = z.infer<typeof GymSetupResponseSchema>;
export declare const PrescriptionNarrationRequestSchema: z.ZodObject<{
    exerciseName: z.ZodString;
    dropSteps: z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            anchor: "anchor";
            driver: "driver";
        }>;
        label: z.ZodString;
        pctChange: z.ZodNumber;
        reason: z.ZodString;
    }, z.core.$strip>>;
    action: z.ZodEnum<{
        reduce: "reduce";
        maintain: "maintain";
        repeat: "repeat";
        progress: "progress";
        deload: "deload";
        calibrate: "calibrate";
    }>;
    targetSummary: z.ZodString;
    displayUnit: z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>;
}, z.core.$strip>;
export type PrescriptionNarrationRequest = z.infer<typeof PrescriptionNarrationRequestSchema>;
export declare const PrescriptionNarrationResponseSchema: z.ZodObject<{
    shortReason: z.ZodString;
    fullNarration: z.ZodString;
    confidence: z.ZodEnum<{
        low: "low";
        high: "high";
        medium: "medium";
    }>;
}, z.core.$strip>;
export type PrescriptionNarrationResponse = z.infer<typeof PrescriptionNarrationResponseSchema>;
export declare const SetSignalTiebreakerRequestSchema: z.ZodObject<{
    exerciseName: z.ZodString;
    targetWeightKg: z.ZodNullable<z.ZodNumber>;
    targetReps: z.ZodNullable<z.ZodNumber>;
    targetRIR: z.ZodNullable<z.ZodNumber>;
    actualWeightKg: z.ZodNullable<z.ZodNumber>;
    actualReps: z.ZodNumber;
    actualRir: z.ZodNullable<z.ZodNumber>;
    historicalMaxWeightKg: z.ZodNullable<z.ZodNumber>;
    ambiguityReason: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type SetSignalTiebreakerRequest = z.infer<typeof SetSignalTiebreakerRequestSchema>;
export declare const SetSignalTiebreakerResponseSchema: z.ZodObject<{
    signal: z.ZodEnum<{
        on_target: "on_target";
        overperformance: "overperformance";
        fatigue_miss: "fatigue_miss";
        intentionally_easier: "intentionally_easier";
        suspected_misinput: "suspected_misinput";
    }>;
    confidence: z.ZodEnum<{
        low: "low";
        high: "high";
        medium: "medium";
    }>;
    reason: z.ZodString;
}, z.core.$strip>;
export type SetSignalTiebreakerResponse = z.infer<typeof SetSignalTiebreakerResponseSchema>;
export declare const CrossModalContextRequestSchema: z.ZodObject<{
    exerciseName: z.ZodString;
    acuteCardioLoadRatio: z.ZodNullable<z.ZodNumber>;
    suggestedGoEasierPercent: z.ZodNullable<z.ZodNumber>;
    trainingPhase: z.ZodNullable<z.ZodString>;
    recentSessionSummary: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type CrossModalContextRequest = z.infer<typeof CrossModalContextRequestSchema>;
export declare const CrossModalContextResponseSchema: z.ZodObject<{
    contributionPct: z.ZodNumber;
    reason: z.ZodString;
    confidence: z.ZodEnum<{
        low: "low";
        high: "high";
        medium: "medium";
    }>;
}, z.core.$strip>;
export type CrossModalContextResponse = z.infer<typeof CrossModalContextResponseSchema>;
export declare const RecognizeEquipmentBodySchema: z.ZodObject<{
    imageBase64: z.ZodString;
    userDescription: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RecognizeEquipmentBody = z.infer<typeof RecognizeEquipmentBodySchema>;
export declare const ExerciseSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodString;
    primaryMuscleGroups: z.ZodArray<z.ZodString>;
    equipmentType: z.ZodString;
}, z.core.$strip>;
export type ExerciseSummary = z.infer<typeof ExerciseSummarySchema>;
export declare const MatchExercisesBodySchema: z.ZodObject<{
    freestyleNames: z.ZodArray<z.ZodString>;
    availableExercises: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        category: z.ZodString;
        primaryMuscleGroups: z.ZodArray<z.ZodString>;
        equipmentType: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type MatchExercisesBody = z.infer<typeof MatchExercisesBodySchema>;
declare const GymSetupConversationMessageSchema: z.ZodObject<{
    role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
    }>;
    content: z.ZodString;
}, z.core.$strip>;
export type GymSetupConversationMessage = z.infer<typeof GymSetupConversationMessageSchema>;
export declare const GymSetupChatBodySchema: z.ZodObject<{
    conversationHistory: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodString;
    }, z.core.$strip>>;
    currentEquipment: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    gymName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GymSetupChatBody = z.infer<typeof GymSetupChatBodySchema>;
export declare const TagExerciseMusclesBodySchema: z.ZodObject<{
    exerciseNames: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type TagExerciseMusclesBody = z.infer<typeof TagExerciseMusclesBodySchema>;
export declare const SemanticScoreExerciseSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    searchText: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SemanticScoreExercise = z.infer<typeof SemanticScoreExerciseSchema>;
export declare const ExerciseSearchSemanticScoresBodySchema: z.ZodObject<{
    query: z.ZodString;
    exercises: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        searchText: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ExerciseSearchSemanticScoresBody = z.infer<typeof ExerciseSearchSemanticScoresBodySchema>;
export declare const ExerciseSearchSemanticScoresResponseSchema: z.ZodObject<{
    scoresByExerciseId: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
export type ExerciseSearchSemanticScoresResponse = z.infer<typeof ExerciseSearchSemanticScoresResponseSchema>;
export declare const LoggedSetContextSchema: z.ZodObject<{
    setIndex: z.ZodNumber;
    weightKg: z.ZodNullable<z.ZodNumber>;
    reps: z.ZodNullable<z.ZodNumber>;
    rir: z.ZodNullable<z.ZodNumber>;
    durationSeconds: z.ZodNullable<z.ZodNumber>;
    isConfirmed: z.ZodBoolean;
    isWarmup: z.ZodBoolean;
}, z.core.$strip>;
export type LoggedSetContext = z.infer<typeof LoggedSetContextSchema>;
export declare const AudioExerciseContextSchema: z.ZodObject<{
    exerciseIndex: z.ZodNumber;
    exerciseName: z.ZodString;
    canonicalExerciseId: z.ZodNullable<z.ZodString>;
    trackingMode: z.ZodEnum<{
        reps: "reps";
        cardio: "cardio";
        timed: "timed";
        stretch: "stretch";
    }>;
    targetSetCount: z.ZodNumber;
    isActive: z.ZodOptional<z.ZodBoolean>;
    loggedSets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        setIndex: z.ZodNumber;
        weightKg: z.ZodNullable<z.ZodNumber>;
        reps: z.ZodNullable<z.ZodNumber>;
        rir: z.ZodNullable<z.ZodNumber>;
        durationSeconds: z.ZodNullable<z.ZodNumber>;
        isConfirmed: z.ZodBoolean;
        isWarmup: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type AudioExerciseContext = z.infer<typeof AudioExerciseContextSchema>;
export declare const LogWorkoutAudioBodySchema: z.ZodObject<{
    audioBase64: z.ZodString;
    mimeType: z.ZodEnum<{
        "audio/m4a": "audio/m4a";
        "audio/mp4": "audio/mp4";
        "audio/wav": "audio/wav";
        "audio/webm": "audio/webm";
    }>;
    defaultWeightUnit: z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>;
    hideRirControls: z.ZodOptional<z.ZodBoolean>;
    protocolVersion: z.ZodOptional<z.ZodLiteral<2>>;
    exercises: z.ZodArray<z.ZodObject<{
        exerciseIndex: z.ZodNumber;
        exerciseName: z.ZodString;
        canonicalExerciseId: z.ZodNullable<z.ZodString>;
        trackingMode: z.ZodEnum<{
            reps: "reps";
            cardio: "cardio";
            timed: "timed";
            stretch: "stretch";
        }>;
        targetSetCount: z.ZodNumber;
        isActive: z.ZodOptional<z.ZodBoolean>;
        loggedSets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            setIndex: z.ZodNumber;
            weightKg: z.ZodNullable<z.ZodNumber>;
            reps: z.ZodNullable<z.ZodNumber>;
            rir: z.ZodNullable<z.ZodNumber>;
            durationSeconds: z.ZodNullable<z.ZodNumber>;
            isConfirmed: z.ZodBoolean;
            isWarmup: z.ZodBoolean;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type LogWorkoutAudioBody = z.infer<typeof LogWorkoutAudioBodySchema>;
export declare const LogWorkoutAudioResponseV2Schema: z.ZodObject<{
    summary: z.ZodString;
    transcript: z.ZodDefault<z.ZodString>;
    operations: z.ZodArray<z.ZodObject<{
        op: z.ZodEnum<{
            log_set: "log_set";
            modify_set: "modify_set";
            delete_set: "delete_set";
            skip_set: "skip_set";
            set_rest: "set_rest";
            set_active_exercise: "set_active_exercise";
            add_exercise: "add_exercise";
        }>;
        exerciseIndex: z.ZodOptional<z.ZodNumber>;
        setIndex: z.ZodOptional<z.ZodNumber>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        reps: z.ZodOptional<z.ZodNumber>;
        rir: z.ZodOptional<z.ZodNumber>;
        durationSeconds: z.ZodOptional<z.ZodNumber>;
        distanceKm: z.ZodOptional<z.ZodNumber>;
        restAfterSec: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        exerciseName: z.ZodOptional<z.ZodString>;
        trackingMode: z.ZodOptional<z.ZodEnum<{
            reps: "reps";
            cardio: "cardio";
            timed: "timed";
            stretch: "stretch";
        }>>;
        insertAfterIndex: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            weightKg: z.ZodOptional<z.ZodNumber>;
            reps: z.ZodOptional<z.ZodNumber>;
            rir: z.ZodOptional<z.ZodNumber>;
            durationSeconds: z.ZodOptional<z.ZodNumber>;
            distanceKm: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        confidence: z.ZodNumber;
        explanation: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    unmatched: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type LogWorkoutAudioResponseV2 = z.infer<typeof LogWorkoutAudioResponseV2Schema>;
export declare const ExerciseTopLevelCategorySchema: z.ZodEnum<{
    cardio: "cardio";
    weightlifting: "weightlifting";
    stretching: "stretching";
}>;
export type ExerciseTopLevelCategory = z.infer<typeof ExerciseTopLevelCategorySchema>;
export declare const ExerciseFineGrainedModeSchema: z.ZodEnum<{
    reps: "reps";
    cardio: "cardio";
    timed: "timed";
    stretch: "stretch";
}>;
export type ExerciseFineGrainedMode = z.infer<typeof ExerciseFineGrainedModeSchema>;
export declare const BuildExerciseProfileBodySchema: z.ZodObject<{
    exerciseName: z.ZodString;
    hint: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BuildExerciseProfileBody = z.infer<typeof BuildExerciseProfileBodySchema>;
export declare const BuildExerciseProfileResponseSchema: z.ZodObject<{
    category: z.ZodEnum<{
        cardio: "cardio";
        weightlifting: "weightlifting";
        stretching: "stretching";
    }>;
    trackingMode: z.ZodEnum<{
        reps: "reps";
        cardio: "cardio";
        timed: "timed";
        stretch: "stretch";
    }>;
    primaryMuscleGroups: z.ZodArray<z.ZodEnum<{
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
    }>>;
    secondaryMuscleGroups: z.ZodArray<z.ZodEnum<{
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
    }>>;
    equipmentType: z.ZodEnum<{
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
}, z.core.$strip>;
export type BuildExerciseProfileResponse = z.infer<typeof BuildExerciseProfileResponseSchema>;
export declare const SmartReaderUsageResponseSchema: z.ZodObject<{
    used: z.ZodNumber;
    limit: z.ZodNumber;
    remaining: z.ZodNumber;
}, z.core.$strip>;
export type SmartReaderUsageResponse = z.infer<typeof SmartReaderUsageResponseSchema>;
export {};
//# sourceMappingURL=workout-ai-wire.d.ts.map