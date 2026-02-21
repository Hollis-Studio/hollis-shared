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

// ============================================================================
// NUTRITION PLAN (Coach-Assigned)
// ============================================================================

// ============================================================================
// NUTRITION PLAN DAY (structured daily plan from JSON column)
// ============================================================================

/**
 * A food item within a meal in a daily nutrition plan.
 */
const nutritionPlanFoodSchema = z
  .object({
    name: z.string().max(200),
    amount: z.string().max(100).optional(),
    calories: z.number().nonnegative().optional(),
    protein: z.number().nonnegative().optional(),
    carbs: z.number().nonnegative().optional(),
    fat: z.number().nonnegative().optional(),
  })
  .passthrough();

/**
 * A meal within a daily nutrition plan.
 */
const nutritionPlanMealSchema = z
  .object({
    name: z.string().max(200).optional(),
    time: z.string().max(50).optional(),
    calories: z.number().nonnegative().optional(),
    protein: z.number().nonnegative().optional(),
    carbs: z.number().nonnegative().optional(),
    fat: z.number().nonnegative().optional(),
    foods: z.array(nutritionPlanFoodSchema).optional(),
  })
  .passthrough();

/**
 * A single day's plan within a nutrition plan.
 * Uses `.passthrough()` to avoid breaking existing data with extra fields.
 */
export const nutritionPlanDaySchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6).optional(),
    label: z.string().max(100).optional(),
    totalCalories: z.number().nonnegative().optional(),
    protein: z.number().nonnegative().optional(),
    carbs: z.number().nonnegative().optional(),
    fat: z.number().nonnegative().optional(),
    meals: z.array(nutritionPlanMealSchema).optional(),
  })
  .passthrough();

export type NutritionPlanDay = z.infer<typeof nutritionPlanDaySchema>;

// ============================================================================
// DAILY NUTRITION TARGET
// ============================================================================

/**
 * Daily nutrition targets within a nutrition plan.
 * Provides day-specific targets that override the plan defaults.
 */
export interface DailyNutritionTarget {
  day: string; // ISO date or day name (e.g., 'monday')
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
}

export const DailyNutritionTargetSchema = z.object({
  day: z.string(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fats: z.number().min(0).optional(),
  notes: z.string().optional(),
});

/**
 * Nutrition plan assigned by a coach to a patient.
 * Contains macro targets for a date range.
 *
 * Note: This interface aligns with the server's NutritionPlanContract in plansService.ts.
 * The dailyTargets field allows for day-specific overrides of the plan defaults.
 */
export interface NutritionPlanContract {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string | null;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  notes?: string | null;
  /** Day-specific target overrides */
  dailyTargets?: DailyNutritionTarget[];
  /** Structured daily plan data (JSON from database) */
  days?: NutritionPlanDay[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export const NutritionPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  startDate: z.string(),
  endDate: z.string().nullish(),
  targetCalories: z.number().int().min(0),
  targetProtein: z.number().int().min(0),
  targetCarbs: z.number().int().min(0),
  targetFats: z.number().int().min(0),
  notes: z.string().nullish(),
  dailyTargets: z.array(DailyNutritionTargetSchema).optional(),
  days: z.array(nutritionPlanDaySchema).nullish(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// ============================================================================
// NUTRITION TARGETS (Daily Targets)
// ============================================================================

/**
 * Daily nutrition targets for a user.
 * Used for progress tracking and goal display.
 */
export interface NutritionTargetsContract {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  water?: number; // in ml
}

export const NutritionTargetsSchema = z.object({
  calories: z.number().int().min(0),
  protein: z.number().int().min(0),
  carbs: z.number().int().min(0),
  fat: z.number().int().min(0),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
  water: z.number().min(0).optional(),
});

/**
 * Detailed nutrition with vitamins and minerals.
 * Extends base targets with micronutrients.
 */
export interface DetailedNutritionContract extends NutritionTargetsContract {
  // Vitamins
  vitaminA?: number; // IU
  vitaminC?: number; // mg
  vitaminD?: number; // IU
  vitaminE?: number; // mg
  vitaminK?: number; // mcg
  thiamine?: number; // mg
  riboflavin?: number; // mg
  niacin?: number; // mg
  vitaminB6?: number; // mg
  folate?: number; // mcg
  vitaminB12?: number; // mcg
  biotin?: number; // mcg
  pantothenicAcid?: number; // mg

  // Minerals
  calcium?: number; // mg
  iron?: number; // mg
  magnesium?: number; // mg
  phosphorus?: number; // mg
  potassium?: number; // mg
  zinc?: number; // mg
  copper?: number; // mg
  manganese?: number; // mg
  selenium?: number; // mcg
  chromium?: number; // mcg
  molybdenum?: number; // mcg

  // Other
  cholesterol?: number; // mg
  alcohol?: number; // g
  caffeine?: number; // mg
}

export const DetailedNutritionSchema = NutritionTargetsSchema.extend({
  // Vitamins
  vitaminA: z.number().min(0).optional().nullable(),
  vitaminC: z.number().min(0).optional().nullable(),
  vitaminD: z.number().min(0).optional().nullable(),
  vitaminE: z.number().min(0).optional().nullable(),
  vitaminK: z.number().min(0).optional().nullable(),
  thiamine: z.number().min(0).optional().nullable(),
  riboflavin: z.number().min(0).optional().nullable(),
  niacin: z.number().min(0).optional().nullable(),
  vitaminB6: z.number().min(0).optional().nullable(),
  folate: z.number().min(0).optional().nullable(),
  vitaminB12: z.number().min(0).optional().nullable(),
  biotin: z.number().min(0).optional().nullable(),
  pantothenicAcid: z.number().min(0).optional().nullable(),
  // Minerals
  calcium: z.number().min(0).optional().nullable(),
  iron: z.number().min(0).optional().nullable(),
  magnesium: z.number().min(0).optional().nullable(),
  phosphorus: z.number().min(0).optional().nullable(),
  potassium: z.number().min(0).optional().nullable(),
  zinc: z.number().min(0).optional().nullable(),
  copper: z.number().min(0).optional().nullable(),
  manganese: z.number().min(0).optional().nullable(),
  selenium: z.number().min(0).optional().nullable(),
  chromium: z.number().min(0).optional().nullable(),
  molybdenum: z.number().min(0).optional().nullable(),
  // Other
  cholesterol: z.number().min(0).optional().nullable(),
  alcohol: z.number().min(0).optional().nullable(),
  caffeine: z.number().min(0).optional().nullable(),
});
export type DetailedNutrition = z.infer<typeof DetailedNutritionSchema>;

// ============================================================================
// NUTRITION PROGRESS
// ============================================================================

/**
 * Progress toward a nutrition target.
 */
export interface NutritionProgressContract {
  current: number;
  target: number;
  percentage: number;
  remaining: number;
}

export const NutritionProgressSchema = z.object({
  current: z.number(),
  target: z.number(),
  percentage: z.number().min(0).max(100),
  remaining: z.number().min(0),
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate progress toward a nutrition target.
 */
export function calculateNutritionProgress(
  current: number,
  target: number,
): NutritionProgressContract {
  const safeTarget = Math.max(1, target);
  return {
    current,
    target: safeTarget,
    percentage: Math.round((current / safeTarget) * 100),
    remaining: Math.max(0, safeTarget - current),
  };
}

/**
 * Default daily nutrition targets.
 * Used when no coach-assigned plan exists.
 */
export const DEFAULT_NUTRITION_TARGETS: NutritionTargetsContract = {
  calories: 2200,
  protein: 165, // ~30% of calories
  carbs: 275, // ~50% of calories
  fat: 73, // ~30% of calories
  fiber: 35,
  sugar: 50,
  sodium: 2300,
  water: 2500,
};
