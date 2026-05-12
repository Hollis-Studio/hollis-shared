/**
 * @ai-context Nutrition Plan contracts | coach-assigned nutrition targets and daily targets
 *
 * These types are shared across features:
 * - plans feature (service)
 * - dashboard feature (types)
 * - analytics feature (tiles)
 * - logging feature (targets hook)
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
/**
 * Schema for the NutritionPlan.lifestyleGoals JSON column.
 * Shape: { workoutsPerWeek, sleepHoursTarget, weeklyWeightChangeTarget }
 *
 * Field semantics (confirmed from planHelpers.ts and data migration 005):
 * - workoutsPerWeek: target workout sessions per week (0-14 range)
 * - sleepHoursTarget: nightly sleep hours target (0-24 range)
 * - weeklyWeightChangeTarget: weekly weight delta in kg (positive = gain, negative = loss)
 *
 * All fields are nullable/optional because the column is Json? (nullable) in Prisma
 * and individual values within it may be absent in partially-populated legacy rows.
 */
export declare const lifestyleGoalsSchema: z.ZodOptional<z.ZodNullable<z.ZodObject<{
    workoutsPerWeek: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sleepHoursTarget: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weeklyWeightChangeTarget: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>>>;
export type LifestyleGoals = z.infer<typeof lifestyleGoalsSchema>;
/**
 * A single day's plan within a nutrition plan.
 * Uses `.passthrough()` to avoid breaking existing data with extra fields.
 */
export declare const nutritionPlanDaySchema: z.ZodObject<{
    dayOfWeek: z.ZodOptional<z.ZodNumber>;
    label: z.ZodOptional<z.ZodString>;
    totalCalories: z.ZodOptional<z.ZodNumber>;
    protein: z.ZodOptional<z.ZodNumber>;
    carbs: z.ZodOptional<z.ZodNumber>;
    fat: z.ZodOptional<z.ZodNumber>;
    meals: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        time: z.ZodOptional<z.ZodString>;
        calories: z.ZodOptional<z.ZodNumber>;
        protein: z.ZodOptional<z.ZodNumber>;
        carbs: z.ZodOptional<z.ZodNumber>;
        fat: z.ZodOptional<z.ZodNumber>;
        foods: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            amount: z.ZodOptional<z.ZodString>;
            calories: z.ZodOptional<z.ZodNumber>;
            protein: z.ZodOptional<z.ZodNumber>;
            carbs: z.ZodOptional<z.ZodNumber>;
            fat: z.ZodOptional<z.ZodNumber>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>>;
}, z.core.$loose>;
export type NutritionPlanDay = z.infer<typeof nutritionPlanDaySchema>;
/**
 * Daily nutrition targets within a nutrition plan.
 * Provides day-specific targets that override the plan defaults.
 */
export type DailyNutritionTarget = z.infer<typeof DailyNutritionTargetSchema>;
export declare const DailyNutritionTargetSchema: z.ZodObject<{
    day: z.ZodString;
    calories: z.ZodOptional<z.ZodNumber>;
    protein: z.ZodOptional<z.ZodNumber>;
    carbs: z.ZodOptional<z.ZodNumber>;
    fats: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Nutrition plan assigned by a coach to a patient.
 * Contains macro targets for a date range.
 *
 * Note: This type aligns with the server's NutritionPlanContract in plansService.ts.
 * The dailyTargets field allows for day-specific overrides of the plan defaults.
 */
export declare const NutritionPlanSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    targetCalories: z.ZodNumber;
    targetProtein: z.ZodNumber;
    targetCarbs: z.ZodNumber;
    targetFats: z.ZodNumber;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dailyTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        day: z.ZodString;
        calories: z.ZodOptional<z.ZodNumber>;
        protein: z.ZodOptional<z.ZodNumber>;
        carbs: z.ZodOptional<z.ZodNumber>;
        fats: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    days: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
        label: z.ZodOptional<z.ZodString>;
        totalCalories: z.ZodOptional<z.ZodNumber>;
        protein: z.ZodOptional<z.ZodNumber>;
        carbs: z.ZodOptional<z.ZodNumber>;
        fat: z.ZodOptional<z.ZodNumber>;
        meals: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            time: z.ZodOptional<z.ZodString>;
            calories: z.ZodOptional<z.ZodNumber>;
            protein: z.ZodOptional<z.ZodNumber>;
            carbs: z.ZodOptional<z.ZodNumber>;
            fat: z.ZodOptional<z.ZodNumber>;
            foods: z.ZodOptional<z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                amount: z.ZodOptional<z.ZodString>;
                calories: z.ZodOptional<z.ZodNumber>;
                protein: z.ZodOptional<z.ZodNumber>;
                carbs: z.ZodOptional<z.ZodNumber>;
                fat: z.ZodOptional<z.ZodNumber>;
            }, z.core.$loose>>>;
        }, z.core.$loose>>>;
    }, z.core.$loose>>>>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type NutritionPlan = z.infer<typeof NutritionPlanSchema>;
/** @deprecated Use NutritionPlan instead. Will be removed after 2026-06-01. */
export type NutritionPlanContract = z.infer<typeof NutritionPlanSchema>;
/**
 * Daily nutrition targets for a user.
 * Used for progress tracking and goal display.
 * Derived from NutritionTargetsSchema for schema↔type consistency.
 * @deprecated Use NutritionTargets instead. Will be removed after 2026-06-01.
 */
export type NutritionTargetsContract = z.infer<typeof NutritionTargetsSchema>;
export declare const NutritionTargetsSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    sugar: z.ZodOptional<z.ZodNumber>;
    sodium: z.ZodOptional<z.ZodNumber>;
    water: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type NutritionTargets = z.infer<typeof NutritionTargetsSchema>;
/**
 * Detailed nutrition with vitamins and minerals.
 * Extends base targets with micronutrients.
 * Derived from DetailedNutritionSchema for schema↔type consistency.
 *
 * Note: Schema uses `.optional().nullable()` for micronutrients,
 * so fields are `number | null | undefined` (vs just `number | undefined` previously).
 * @deprecated Use DetailedNutrition instead. Will be removed after 2026-06-01.
 */
export type DetailedNutritionContract = z.infer<typeof DetailedNutritionSchema>;
export declare const DetailedNutritionSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    sugar: z.ZodOptional<z.ZodNumber>;
    sodium: z.ZodOptional<z.ZodNumber>;
    water: z.ZodOptional<z.ZodNumber>;
    vitaminA: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    vitaminC: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    vitaminD: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    vitaminE: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    vitaminK: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    thiamine: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    riboflavin: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    niacin: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    vitaminB6: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    folate: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    vitaminB12: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    biotin: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    pantothenicAcid: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    calcium: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    iron: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    magnesium: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    phosphorus: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    potassium: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    zinc: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    copper: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    manganese: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    selenium: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    chromium: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    molybdenum: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    cholesterol: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    alcohol: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    caffeine: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export type DetailedNutrition = z.infer<typeof DetailedNutritionSchema>;
/**
 * Progress toward a nutrition target.
 */
export declare const NutritionProgressSchema: z.ZodObject<{
    current: z.ZodNumber;
    target: z.ZodNumber;
    percentage: z.ZodNumber;
    remaining: z.ZodNumber;
}, z.core.$strip>;
export type NutritionProgress = z.infer<typeof NutritionProgressSchema>;
/** @deprecated Use NutritionProgress instead. Will be removed after 2026-06-01. */
export type NutritionProgressContract = z.infer<typeof NutritionProgressSchema>;
/**
 * Calculate progress toward a nutrition target.
 */
export declare function calculateNutritionProgress(current: number, target: number): NutritionProgressContract;
/**
 * Default daily nutrition targets.
 * Used when no coach-assigned plan exists.
 */
export declare const DEFAULT_NUTRITION_TARGETS: NutritionTargetsContract;
//# sourceMappingURL=nutrition-plan.d.ts.map