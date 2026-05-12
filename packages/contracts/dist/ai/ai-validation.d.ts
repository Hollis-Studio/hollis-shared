/**
 * @ai-context AI Validation Module | Zod schemas for AI request/response validation
 *
 * This module contains all Zod schemas used to validate:
 * - AI function call arguments (from Gemini responses)
 * - AI generation requests (from clients)
 * - AI generation responses (to clients)
 *
 * IMPORTANT: These schemas are used by both server and web-admin.
 * They must remain pure Zod with no platform-specific dependencies.
 *
 * deps: zod, admin/admin-types, domain/training | consumers: server/src/services/ai*, web-admin/services
 */
import { z } from "zod";
/**
 * AI note categories for validation (alias for backward compatibility)
 * Note: AI_NOTE_CATEGORIES and AI_NOTE_CATEGORY are already exported via domain module
 */
export declare const AI_NOTE_CATEGORIES_FOR_VALIDATION: readonly ["INJURY", "PREFERENCE", "LIMITATION", "MEDICAL", "GOAL", "OTHER"];
/**
 * Schema for validating generated exercise from AI
 *
 * CRITICAL: exerciseId is REQUIRED. The AI must use list_and_select_exercise or
 * create_exercise to get a valid UUID before generating workout plans. This
 * enforces canonical exercise references for progression tracking.
 */
export declare const generatedExerciseSchema: z.ZodObject<{
    name: z.ZodString;
    exerciseId: z.ZodString;
    sets: z.ZodOptional<z.ZodNumber>;
    reps: z.ZodOptional<z.ZodString>;
    weight: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    link: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GeneratedExerciseInput = z.infer<typeof generatedExerciseSchema>;
/**
 * Schema for validating generated workout section from AI
 */
export declare const generatedSectionSchema: z.ZodObject<{
    type: z.ZodEnum<{
        warmup: "warmup";
        working: "working";
        cooldown: "cooldown";
    }>;
    title: z.ZodString;
    exercises: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        exerciseId: z.ZodString;
        sets: z.ZodOptional<z.ZodNumber>;
        reps: z.ZodOptional<z.ZodString>;
        weight: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        link: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GeneratedSectionInput = z.infer<typeof generatedSectionSchema>;
/**
 * Schema for validating generated workout day from AI
 */
export declare const generatedDaySchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    name: z.ZodString;
    isRestDay: z.ZodBoolean;
    sections: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            warmup: "warmup";
            working: "working";
            cooldown: "cooldown";
        }>;
        title: z.ZodString;
        exercises: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            exerciseId: z.ZodString;
            sets: z.ZodOptional<z.ZodNumber>;
            reps: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodString>;
            duration: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodString>;
            link: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GeneratedDayInput = z.infer<typeof generatedDaySchema>;
/**
 * Schema for validating generate_workout_plan function call arguments from AI
 */
export declare const generateWorkoutPlanArgsSchema: z.ZodObject<{
    days: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        name: z.ZodString;
        isRestDay: z.ZodBoolean;
        sections: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<{
                warmup: "warmup";
                working: "working";
                cooldown: "cooldown";
            }>;
            title: z.ZodString;
            exercises: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                exerciseId: z.ZodString;
                sets: z.ZodOptional<z.ZodNumber>;
                reps: z.ZodOptional<z.ZodString>;
                weight: z.ZodOptional<z.ZodString>;
                duration: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
                link: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    reasoning: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GenerateWorkoutPlanArgs = z.infer<typeof generateWorkoutPlanArgsSchema>;
/**
 * Schema for validating generated workout plan structure
 */
export declare const generatedWorkoutPlanSchema: z.ZodObject<{
    days: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        name: z.ZodString;
        isRestDay: z.ZodBoolean;
        sections: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<{
                warmup: "warmup";
                working: "working";
                cooldown: "cooldown";
            }>;
            title: z.ZodString;
            exercises: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                exerciseId: z.ZodString;
                sets: z.ZodOptional<z.ZodNumber>;
                reps: z.ZodOptional<z.ZodString>;
                weight: z.ZodOptional<z.ZodString>;
                duration: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
                link: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GeneratedWorkoutPlanInput = z.infer<typeof generatedWorkoutPlanSchema>;
/**
 * Schema for unresolved exercise requiring human review
 */
export declare const unresolvedExerciseSchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    dayName: z.ZodString;
    sectionIndex: z.ZodNumber;
    sectionTitle: z.ZodString;
    exerciseIndex: z.ZodNumber;
    exerciseName: z.ZodString;
    reason: z.ZodEnum<{
        missing_id: "missing_id";
        invalid_id: "invalid_id";
        name_mismatch: "name_mismatch";
    }>;
}, z.core.$strip>;
export type UnresolvedExerciseInput = z.infer<typeof unresolvedExerciseSchema>;
/**
 * Schema for workout plan generation result
 */
export declare const workoutPlanGenerationResultSchema: z.ZodObject<{
    plan: z.ZodObject<{
        days: z.ZodArray<z.ZodObject<{
            dayOfWeek: z.ZodNumber;
            name: z.ZodString;
            isRestDay: z.ZodBoolean;
            sections: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<{
                    warmup: "warmup";
                    working: "working";
                    cooldown: "cooldown";
                }>;
                title: z.ZodString;
                exercises: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                    exerciseId: z.ZodString;
                    sets: z.ZodOptional<z.ZodNumber>;
                    reps: z.ZodOptional<z.ZodString>;
                    weight: z.ZodOptional<z.ZodString>;
                    duration: z.ZodOptional<z.ZodString>;
                    notes: z.ZodOptional<z.ZodString>;
                    link: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    newNotes: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodString;
        userId: z.ZodString;
        content: z.ZodString;
        category: z.ZodEnum<{
            OTHER: "OTHER";
            INJURY: "INJURY";
            PREFERENCE: "PREFERENCE";
            LIMITATION: "LIMITATION";
            MEDICAL: "MEDICAL";
            GOAL: "GOAL";
        }>;
        source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            AI_GENERATED: "AI_GENERATED";
            COACH_OBSERVATION: "COACH_OBSERVATION";
            INTAKE_SEEDED: "INTAKE_SEEDED";
            CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED";
        }>>>;
    }, z.core.$strip>>;
    reasoning: z.ZodOptional<z.ZodString>;
    needsReview: z.ZodOptional<z.ZodBoolean>;
    reviewReasons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        dayName: z.ZodString;
        sectionIndex: z.ZodNumber;
        sectionTitle: z.ZodString;
        exerciseIndex: z.ZodNumber;
        exerciseName: z.ZodString;
        reason: z.ZodEnum<{
            missing_id: "missing_id";
            invalid_id: "invalid_id";
            name_mismatch: "name_mismatch";
        }>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type WorkoutPlanGenerationResultInput = z.infer<typeof workoutPlanGenerationResultSchema>;
/**
 * Schema for nutrition plan generation result
 */
export declare const nutritionPlanGenerationResultSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    dailyTargets: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
    }, z.core.$strip>>;
    reasoning: z.ZodString;
    weeklyNotes: z.ZodString;
    newNotes: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodString;
        userId: z.ZodString;
        content: z.ZodString;
        category: z.ZodEnum<{
            OTHER: "OTHER";
            INJURY: "INJURY";
            PREFERENCE: "PREFERENCE";
            LIMITATION: "LIMITATION";
            MEDICAL: "MEDICAL";
            GOAL: "GOAL";
        }>;
        source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            AI_GENERATED: "AI_GENERATED";
            COACH_OBSERVATION: "COACH_OBSERVATION";
            INTAKE_SEEDED: "INTAKE_SEEDED";
            CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED";
        }>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * @deprecated Use NutritionPlanGenerationResult (from ai-types.ts) instead.
 */
export type NutritionPlanGenerationResultInput = z.infer<typeof nutritionPlanGenerationResultSchema>;
/**
 * Schema for validating save_permanent_note function call arguments from AI
 */
export declare const savePermanentNoteArgsSchema: z.ZodObject<{
    content: z.ZodString;
    category: z.ZodEnum<{
        OTHER: "OTHER";
        INJURY: "INJURY";
        PREFERENCE: "PREFERENCE";
        LIMITATION: "LIMITATION";
        MEDICAL: "MEDICAL";
        GOAL: "GOAL";
    }>;
}, z.core.$strip>;
export type SavePermanentNoteArgs = z.infer<typeof savePermanentNoteArgsSchema>;
/**
 * Schema for validating generate_nutrition_targets function call arguments from AI
 */
export declare const generateNutritionTargetsArgsSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    dailyTargets: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
    }, z.core.$strip>>;
    reasoning: z.ZodString;
    weeklyNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GenerateNutritionTargetsArgs = z.infer<typeof generateNutritionTargetsArgsSchema>;
/**
 * Schema for strategy goal input
 *
 * goalMetric is a MetricDefinition code string. The AI must use a valid code
 * from the MetricDefinition registry (retrieved at runtime from the DB).
 */
export declare const createStrategyGoalArgsSchema: z.ZodObject<{
    goalMetric: z.ZodString;
    goalTarget: z.ZodNumber;
    linkedExerciseId: z.ZodOptional<z.ZodString>;
    weight: z.ZodDefault<z.ZodNumber>;
    baselineValue: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateStrategyGoalArgs = z.infer<typeof createStrategyGoalArgsSchema>;
/**
 * Schema for training phase input
 */
export declare const createPhaseArgsSchema: z.ZodObject<{
    name: z.ZodString;
    order: z.ZodNumber;
    weekCount: z.ZodNumber;
    intensityRange: z.ZodOptional<z.ZodString>;
    volumeLevel: z.ZodOptional<z.ZodEnum<{
        low: "low";
        moderate: "moderate";
        high: "high";
    }>>;
    focusAreas: z.ZodDefault<z.ZodArray<z.ZodString>>;
    notes: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    isCompleted: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type CreatePhaseArgs = z.infer<typeof createPhaseArgsSchema>;
/**
 * Schema for validating request_clarification function call arguments from AI
 */
export declare const requestClarificationArgsSchema: z.ZodObject<{
    questions: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type RequestClarificationArgs = z.infer<typeof requestClarificationArgsSchema>;
/**
 * Schema for validating generate_training_strategy function call arguments from AI
 */
export declare const generateStrategyArgsSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        CUSTOM: "CUSTOM";
        LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
        UNDULATING: "UNDULATING";
        BLOCK: "BLOCK";
        MESOCYCLE: "MESOCYCLE";
        DELOAD: "DELOAD";
    }>;
    goal: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
    }>>;
    goals: z.ZodArray<z.ZodObject<{
        goalMetric: z.ZodString;
        goalTarget: z.ZodNumber;
        linkedExerciseId: z.ZodOptional<z.ZodString>;
        weight: z.ZodDefault<z.ZodNumber>;
        baselineValue: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        order: z.ZodNumber;
        weekCount: z.ZodNumber;
        intensityRange: z.ZodOptional<z.ZodString>;
        volumeLevel: z.ZodOptional<z.ZodEnum<{
            low: "low";
            moderate: "moderate";
            high: "high";
        }>>;
        focusAreas: z.ZodDefault<z.ZodArray<z.ZodString>>;
        notes: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        isCompleted: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    reasoning: z.ZodString;
}, z.core.$strip>;
export type GenerateStrategyArgs = z.infer<typeof generateStrategyArgsSchema>;
/**
 * Schema for create_exercise function call arguments
 */
export declare const createExerciseArgsSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodString;
    muscleGroups: z.ZodArray<z.ZodString>;
    primaryMuscle: z.ZodOptional<z.ZodString>;
    equipment: z.ZodDefault<z.ZodArray<z.ZodString>>;
    movementPattern: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodString>;
    cues: z.ZodDefault<z.ZodArray<z.ZodString>>;
    defaultSets: z.ZodOptional<z.ZodNumber>;
    defaultReps: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateExerciseArgs = z.infer<typeof createExerciseArgsSchema>;
/**
 * Schema for workout plan generation request
 */
/**
 * Schema for strategy generation request (AI-specific, not in admin)
 *
 * @param userId - Patient identifier in HH-XXXXXX barcode format
 * @param customPrompt - User's training goal description
 * @param requestId - Optional UUID for multi-turn conversations
 * @param clarificationAnswers - Optional answers to clarification questions
 */
export declare const strategyGenerationRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    customPrompt: z.ZodString;
    requestId: z.ZodOptional<z.ZodString>;
    clarificationAnswers: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type StrategyGenerationRequest = z.infer<typeof strategyGenerationRequestSchema>;
//# sourceMappingURL=ai-validation.d.ts.map