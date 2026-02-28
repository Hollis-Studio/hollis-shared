/**
 * @ai-context Nutrition domain contracts | meal types, location types, and their labels
 *
 * This module provides the canonical definitions for nutrition-related constants:
 * - Meal types (breakfast, lunch, dinner, snack, etc.)
 * - Location types (home, restaurant, work, etc.)
 * - Digestion quality, energy levels, mood levels
 * - Preparation methods and food units
 *
 * IMPORTANT: All nutrition-related enum values MUST be imported from here.
 * NOTE: FoodLogEntryContract and foodLogEntrySchema are exported from ../schemas/json-blobs.
 *       They are NOT re-exported here to avoid duplicate export errors in barrel files.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from "zod";
import { foodLogEntrySchema } from "../schemas/json-blobs";
import { createPaginatedListSchema } from "./pagination";

// Note: foodLogEntrySchema and FoodLogEntryContract are used internally but NOT re-exported
// to avoid duplicate export errors in barrel files. Import them from @hollis/contracts/schemas.

// ============================================================================
// MEAL TYPES
// ============================================================================

/**
 * Valid meal type values for nutrition logging.
 */
export const MEAL_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "pre_workout",
  "post_workout",
  "other",
] as const;

export type MealType = z.infer<typeof MealTypeSchema>;

export const MealTypeSchema = z.enum(MEAL_TYPES);

/** Centralized meal type constants for equality checks */
export const MEAL_TYPE = {
  BREAKFAST: "breakfast",
  LUNCH: "lunch",
  DINNER: "dinner",
  SNACK: "snack",
  PRE_WORKOUT: "pre_workout",
  POST_WORKOUT: "post_workout",
  OTHER: "other",
} as const satisfies Record<string, MealType>;

/** Human-readable labels for meal types */
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
  pre_workout: "Pre-Workout",
  post_workout: "Post-Workout",
  other: "Other",
};

/** Typical time ranges for meal types (24-hour format) */
export const MEAL_TYPE_TIME_RANGES: Record<
  MealType,
  { start: number; end: number }
> = {
  breakfast: { start: 5, end: 10 },
  lunch: { start: 11, end: 14 },
  dinner: { start: 17, end: 21 },
  snack: { start: 0, end: 24 },
  pre_workout: { start: 0, end: 24 },
  post_workout: { start: 0, end: 24 },
  other: { start: 0, end: 24 },
};

/**
 * Check if a string is a valid meal type
 */
export function isMealType(value: string): value is MealType {
  return (MEAL_TYPES as readonly string[]).includes(value);
}

/**
 * Get the label for a meal type, with fallback
 */
export function getMealTypeLabel(type: string): string {
  if (isMealType(type)) {
    return MEAL_TYPE_LABELS[type];
  }
  return type;
}

// ============================================================================
// LOCATION TYPES
// ============================================================================

/**
 * Where a meal was consumed.
 */
export const LOCATION_TYPES = [
  "home",
  "restaurant",
  "work",
  "travel",
  "social_event",
] as const;
export type LocationType = z.infer<typeof LocationTypeSchema>;

export const LocationTypeSchema = z.enum(LOCATION_TYPES);

/** Human-readable labels for location types */
export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  home: "Home",
  restaurant: "Restaurant",
  work: "Work",
  travel: "Travel",
  social_event: "Social Event",
};

// ============================================================================
// FOOD SOURCES
// ============================================================================

/**
 * How a food entry was logged.
 * - search: Found via food database search
 * - barcode: Scanned from product barcode
 * - custom: User-created custom food
 * - manual: Manual entry without database lookup
 */
export const FOOD_SOURCES = ["search", "barcode", "custom", "manual"] as const;

export type FoodSource = z.infer<typeof FoodSourceSchema>;

export const FoodSourceSchema = z.enum(FOOD_SOURCES);

/** Centralized food source constants for equality checks */
export const FOOD_SOURCE = {
  SEARCH: "search",
  BARCODE: "barcode",
  CUSTOM: "custom",
  MANUAL: "manual",
} as const satisfies Record<string, FoodSource>;

/** Human-readable labels for food sources */
export const FOOD_SOURCE_LABELS: Record<FoodSource, string> = {
  search: "Search",
  barcode: "Barcode Scan",
  custom: "Custom Food",
  manual: "Manual Entry",
};

// ============================================================================
// DIGESTION QUALITY
// ============================================================================

/**
 * Self-reported digestion quality after a meal.
 */
export const DIGESTION_QUALITIES = [
  "excellent",
  "good",
  "normal",
  "poor",
  "very_poor",
] as const;
export type DigestionQuality = z.infer<typeof DigestionQualitySchema>;

export const DigestionQualitySchema = z.enum(DIGESTION_QUALITIES);

/** Human-readable labels for digestion quality */
export const DIGESTION_QUALITY_LABELS: Record<DigestionQuality, string> = {
  excellent: "Excellent",
  good: "Good",
  normal: "Normal",
  poor: "Poor",
  very_poor: "Very Poor",
};

// ============================================================================
// ENERGY LEVEL
// ============================================================================

/**
 * Self-reported energy level.
 */
export const ENERGY_LEVELS = [
  "very_low",
  "low",
  "normal",
  "high",
  "very_high",
] as const;
export type EnergyLevel = z.infer<typeof EnergyLevelSchema>;

export const EnergyLevelSchema = z.enum(ENERGY_LEVELS);

/** Human-readable labels for energy levels */
export const ENERGY_LEVEL_LABELS: Record<EnergyLevel, string> = {
  very_low: "Very Low",
  low: "Low",
  normal: "Normal",
  high: "High",
  very_high: "Very High",
};

// ============================================================================
// MOOD LEVEL
// ============================================================================

/**
 * Self-reported mood level.
 */
export const MOOD_LEVELS = [
  "very_negative",
  "negative",
  "neutral",
  "positive",
  "very_positive",
] as const;
export type MoodLevel = z.infer<typeof MoodLevelSchema>;

export const MoodLevelSchema = z.enum(MOOD_LEVELS);

/** Human-readable labels for mood levels */
export const MOOD_LEVEL_LABELS: Record<MoodLevel, string> = {
  very_negative: "Very Negative",
  negative: "Negative",
  neutral: "Neutral",
  positive: "Positive",
  very_positive: "Very Positive",
};

// ============================================================================
// PREPARATION METHOD
// ============================================================================

/**
 * How food was prepared.
 */
export const PREPARATION_METHODS = [
  "raw",
  "boiled",
  "fried",
  "baked",
  "grilled",
  "steamed",
  "roasted",
] as const;
export type PreparationMethod = z.infer<typeof PreparationMethodSchema>;

export const PreparationMethodSchema = z.enum(PREPARATION_METHODS);

/** Human-readable labels for preparation methods */
export const PREPARATION_METHOD_LABELS: Record<PreparationMethod, string> = {
  raw: "Raw",
  boiled: "Boiled",
  fried: "Fried",
  baked: "Baked",
  grilled: "Grilled",
  steamed: "Steamed",
  roasted: "Roasted",
};

// ============================================================================
// FOOD UNITS
// ============================================================================

/**
 * Units for measuring food quantities.
 */
export const FOOD_UNITS = [
  "grams",
  "ounces",
  "cups",
  "tablespoons",
  "teaspoons",
  "servings",
  "milliliters",
  "liters",
] as const;
export type FoodUnit = z.infer<typeof FoodUnitSchema>;

export const FoodUnitSchema = z.enum(FOOD_UNITS);

/** Human-readable labels for food units */
export const FOOD_UNIT_LABELS: Record<FoodUnit, string> = {
  grams: "Grams",
  ounces: "Ounces",
  cups: "Cups",
  tablespoons: "Tablespoons",
  teaspoons: "Teaspoons",
  servings: "Servings",
  milliliters: "Milliliters",
  liters: "Liters",
};

// ============================================================================
// MACRONUTRIENT SHORTHAND
// ============================================================================

export const MacroShorthandSchema = z.object({
  p: z.number().min(0),
  c: z.number().min(0),
  f: z.number().min(0),
});

export type MacroShorthand = z.infer<typeof MacroShorthandSchema>;

/** Default empty macro shorthand */
export const EMPTY_MACRO_SHORTHAND: MacroShorthand = { p: 0, c: 0, f: 0 };

/**
 * Parse totalMacros from database (JSON string or object).
 * Handles both string and object inputs for backwards compatibility.
 */
export function parseMacroShorthand(
  value: string | MacroShorthand | null | undefined,
): MacroShorthand {
  if (!value) return { ...EMPTY_MACRO_SHORTHAND };

  const parsedValue = (() => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  })();

  const result = MacroShorthandSchema.partial().safeParse(parsedValue);
  if (!result.success) {
    return { ...EMPTY_MACRO_SHORTHAND };
  }

  return {
    p: result.data.p ?? 0,
    c: result.data.c ?? 0,
    f: result.data.f ?? 0,
  };
}

/**
 * Stringify macro shorthand for database storage.
 */
export function stringifyMacroShorthand(macros: MacroShorthand): string {
  const validated = MacroShorthandSchema.parse(macros);
  return JSON.stringify({ p: validated.p, c: validated.c, f: validated.f });
}

// ============================================================================
// NUTRITION MACRO BREAKDOWN
// ============================================================================

export const NutritionMacroBreakdownSchema = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
});

export type NutritionMacroBreakdown = z.infer<
  typeof NutritionMacroBreakdownSchema
>;

// ============================================================================
// NUTRITION PORTION CONTRACT
// ============================================================================

export const NutritionPortionSchema = z.object({
  id: z.string().optional(),
  foodName: z.string().min(1),
  brand: z.string().optional(),
  quantity: z.number().min(0),
  unit: z.string().min(1),
  macros: NutritionMacroBreakdownSchema,
  photoUrl: z.string().url().optional(),
});

export type NutritionPortionContract = z.infer<typeof NutritionPortionSchema>;

// ============================================================================
// MEAL CONTEXT CONTRACT
// ============================================================================

export const MealContextSchema = z.object({
  location: LocationTypeSchema.optional(),
  preparationMethod: PreparationMethodSchema.optional(),
  socialContext: z.string().optional(),
  mealDuration: z.number().min(0).optional(),
});

export type MealContextContract = z.infer<typeof MealContextSchema>;

// ============================================================================
// MEAL LOG CONTRACT
// ============================================================================

export const MealLogSchema = z.object({
  id: z.string().optional(),
  mealType: MealTypeSchema,
  loggedAt: z.string(),
  portions: z.array(NutritionPortionSchema),
  notes: z.string().optional(),
  hungerLevel: z.number().min(1).max(10).optional(),
  fullnessLevel: z.number().min(1).max(10).optional(),
  mood: MoodLevelSchema.optional(),
  mealContext: MealContextSchema.optional(),
  digestion: DigestionQualitySchema.optional(),
  energy: EnergyLevelSchema.optional(),
  photoUrls: z.array(z.string().url()).optional(),
});

export type MealLogContract = z.infer<typeof MealLogSchema>;

// ============================================================================
// DAILY NUTRITION LOG CONTRACT
// ============================================================================

// Note: FoodLogEntryContract is defined in ../schemas/json-blobs.ts
// and re-exported via the schemas barrel. Import from there for use with foodEntries.

export const DailyNutritionLogSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format"),
  timezone: z.string(),
  meals: z.array(MealLogSchema),
  totals: NutritionMacroBreakdownSchema,
  hydrationMl: z.number().int().min(0).nullable().optional(),
  supplements: z.array(z.string()).optional(),
  foodEntries: z.record(z.string(), z.array(foodLogEntrySchema)).optional(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type DailyNutritionLogContract = z.infer<typeof DailyNutritionLogSchema>;

// ============================================================================
// FOOD ITEM CONTRACT
// ============================================================================

export const FoodItemSchema = z.object({
  name: z.string().min(1),
  brand: z.string().optional(),
  barcode: z.string().optional(),
  calories: z.number().int().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  addedSugar: z.number().min(0).optional(),
  sugarAlcohols: z.number().min(0).optional(),
  starch: z.number().min(0).optional(),
  saturatedFat: z.number().min(0).optional(),
  transFat: z.number().min(0).optional(),
  monounsaturatedFat: z.number().min(0).optional(),
  polyunsaturatedFat: z.number().min(0).optional(),
  omega3: z.number().min(0).optional(),
  omega6: z.number().min(0).optional(),
  cholesterol: z.number().min(0).optional(),
  vitamins: z.record(z.string(), z.number()).optional(),
  minerals: z.record(z.string(), z.number()).optional(),
  alcohol: z.number().min(0).optional(),
  caffeine: z.number().min(0).optional(),
  water: z.number().min(0).optional(),
  portionWeightG: z.number().min(0).optional(),
  glycemicIndex: z.number().min(0).max(100).optional(),
  glycemicLoad: z.number().min(0).optional(),
  foodGroup: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type FoodItem = z.infer<typeof FoodItemSchema>;
/** Backward-compat alias — prefer `FoodItem` for new code. */
export type FoodItemContract = FoodItem;

// ============================================================================
// MICRONUTRIENTS
// ============================================================================

export const micronutrientsSchema = z.object({
  vitaminA: z.number().optional(),
  vitaminC: z.number().optional(),
  vitaminD: z.number().optional(),
  vitaminE: z.number().optional(),
  vitaminK: z.number().optional(),
  thiamin: z.number().optional(),
  riboflavin: z.number().optional(),
  niacin: z.number().optional(),
  vitaminB6: z.number().optional(),
  folate: z.number().optional(),
  vitaminB12: z.number().optional(),
  biotin: z.number().optional(),
  pantothenicAcid: z.number().optional(),
  calcium: z.number().optional(),
  iron: z.number().optional(),
  magnesium: z.number().optional(),
  phosphorus: z.number().optional(),
  potassium: z.number().optional(),
  zinc: z.number().optional(),
  copper: z.number().optional(),
  manganese: z.number().optional(),
  selenium: z.number().optional(),
  iodine: z.number().optional(),
  chromium: z.number().optional(),
  molybdenum: z.number().optional(),
  chloride: z.number().optional(),
  choline: z.number().optional(),
  lycopene: z.number().optional(),
  lutein: z.number().optional(),
});

export type Micronutrients = z.infer<typeof micronutrientsSchema>;

// ============================================================================
// AI ANALYSIS RESULT
// ============================================================================

export const aiAnalysisResultSchema = z.object({
  foodName: z.string(),
  description: z.string(),
  macros: NutritionMacroBreakdownSchema,
  micros: micronutrientsSchema.optional(),
  nutritionQualityIndex: z.number().min(1).max(100),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
});

export type AIAnalysisResult = z.infer<typeof aiAnalysisResultSchema>;

// ============================================================================
// SCHEMA ALIASES (backwards compatibility with camelCase names)
// ============================================================================

/** @deprecated Use NutritionMacroBreakdownSchema instead. Remove after 2026-05-01 */
// zod-manual: deprecated alias
export const macrosSchema = NutritionMacroBreakdownSchema;

/** @deprecated Use MealContextSchema instead. Remove after 2026-05-01 */
// zod-manual: deprecated alias
export const mealContextSchema = MealContextSchema;

/** @deprecated Use DailyNutritionLogSchema instead. Remove after 2026-05-01 */
// zod-manual: deprecated alias
export const dailyNutritionLogSchema = DailyNutritionLogSchema;

/**
 * Canonical paginated nutrition list response: { data, pagination }
 */
export const nutritionListResponseSchema = createPaginatedListSchema(
  DailyNutritionLogSchema,
);

export type NutritionListResponse = z.infer<typeof nutritionListResponseSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sum macros across an array of portions.
 */
export const sumMacros = (
  portions: NutritionPortionContract[],
): NutritionMacroBreakdown =>
  portions.reduce<NutritionMacroBreakdown>(
    (acc, portion) => ({
      calories: acc.calories + portion.macros.calories,
      protein: acc.protein + portion.macros.protein,
      carbs: acc.carbs + portion.macros.carbs,
      fat: acc.fat + portion.macros.fat,
      fiber: (acc.fiber ?? 0) + (portion.macros.fiber ?? 0),
      sugar: (acc.sugar ?? 0) + (portion.macros.sugar ?? 0),
      sodium: (acc.sodium ?? 0) + (portion.macros.sodium ?? 0),
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    },
  );

/**
 * Aggregate daily totals across an array of meals.
 */
export const aggregateDailyTotals = (
  meals: MealLogContract[],
): NutritionMacroBreakdown =>
  meals.reduce<NutritionMacroBreakdown>(
    (acc, meal) => {
      const mealTotals = sumMacros(meal.portions);
      return {
        calories: acc.calories + mealTotals.calories,
        protein: acc.protein + mealTotals.protein,
        carbs: acc.carbs + mealTotals.carbs,
        fat: acc.fat + mealTotals.fat,
        fiber: (acc.fiber ?? 0) + (mealTotals.fiber ?? 0),
        sugar: (acc.sugar ?? 0) + (mealTotals.sugar ?? 0),
        sodium: (acc.sodium ?? 0) + (mealTotals.sodium ?? 0),
      };
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    },
  );

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockNutritionMacroBreakdown = (
  overrides: Partial<NutritionMacroBreakdown> = {},
): NutritionMacroBreakdown => ({
  calories: 500,
  protein: 30,
  carbs: 50,
  fat: 20,
  fiber: 5,
  ...overrides,
});

export const createMockMealLog = (
  overrides: Partial<MealLogContract> = {},
): MealLogContract => ({
  id: "mock-meal-id",
  mealType: "lunch",
  loggedAt: nowIso(),
  portions: [
    {
      id: "mock-portion-id",
      foodName: "Grilled Chicken Salad",
      quantity: 1,
      unit: "servings",
      macros: createMockNutritionMacroBreakdown(),
    },
  ],
  notes: "Enjoyed at home",
  hungerLevel: 7,
  fullnessLevel: 8,
  ...overrides,
});

export const createMockNutritionPortion = (
  overrides: Partial<NutritionPortionContract> = {},
): NutritionPortionContract => ({
  id: overrides.id ?? `portion-${Math.random().toString(36).slice(2, 8)}`,
  foodName: overrides.foodName ?? "Greek Yogurt",
  brand: overrides.brand ?? "Chobani",
  quantity: overrides.quantity ?? 1,
  unit: overrides.unit ?? "cup",
  macros: overrides.macros ?? {
    calories: 140,
    protein: 15,
    carbs: 12,
    fat: 4,
    fiber: 0,
    sugar: 7,
    sodium: 65,
  },
  photoUrl: overrides.photoUrl,
});

// ============================================================================
// CALORIE ENTRY FORM SCHEMA
// ============================================================================

/**
 * Zod schema for the quick calorie-logging form (log-calories modal).
 * Validates PHI nutrition inputs before they are sent to the API.
 *
 * Bounds match the manual validation enforced in the submit handler:
 *   - totalCalories: integer, 0–10 000 kcal
 *   - protein / carbs / fat: optional grams, 0–500 g
 */
export const calorieEntryFormSchema = z.object({
  totalCalories: z
    .number({ error: "Calories must be a number" })
    .int("Calories must be a whole number")
    .min(0, "Calories cannot be negative")
    .max(10000, "Calories must be 10,000 kcal or less"),
  protein: z
    .number({ error: "Protein must be a number" })
    .min(0, "Protein cannot be negative")
    .max(500, "Protein must be 500g or less")
    .optional(),
  carbs: z
    .number({ error: "Carbohydrates must be a number" })
    .min(0, "Carbohydrates cannot be negative")
    .max(500, "Carbohydrates must be 500g or less")
    .optional(),
  fat: z
    .number({ error: "Fat must be a number" })
    .min(0, "Fat cannot be negative")
    .max(500, "Fat must be 500g or less")
    .optional(),
});

export type CalorieEntryFormInput = z.infer<typeof calorieEntryFormSchema>;

// ============================================================================
// NUTRITION PLAN BUILDER FORM SCHEMAS
// ============================================================================

/**
 * Zod schema for per-day macro targets in the NutritionPlanBuilder form.
 * Validates PHI nutrition plan inputs before submission.
 *
 * Bounds mirror MACRO_LIMITS in NutritionPlanBuilder.tsx:
 *   - calories: integer, 0–10 000 kcal
 *   - protein / carbs / fats: 0–1 000 g
 */
export const nutritionDayTargetSchema = z.object({
  calories: z
    .number()
    .int("Calories must be a whole number")
    .min(0, "Calories cannot be negative")
    .max(10000, "Calories must be 10,000 kcal or less"),
  protein: z
    .number()
    .min(0, "Protein cannot be negative")
    .max(1000, "Protein must be 1,000g or less"),
  carbs: z
    .number()
    .min(0, "Carbohydrates cannot be negative")
    .max(1000, "Carbohydrates must be 1,000g or less"),
  fats: z
    .number()
    .min(0, "Fats cannot be negative")
    .max(1000, "Fats must be 1,000g or less"),
});

export type NutritionDayTarget = z.infer<typeof nutritionDayTargetSchema>;

/**
 * Zod schema for NutritionPlanBuilder form-level fields.
 * Validates customPrompt to enforce a max-length contract and mitigate
 * prompt-injection risk (defence-in-depth alongside the textarea maxLength).
 */
export const nutritionPlanFormSchema = z.object({
  customPrompt: z
    .string()
    .max(2000, "Custom prompt must be under 2000 characters")
    .optional(),
});

export type NutritionPlanFormInput = z.infer<typeof nutritionPlanFormSchema>;

export const createMockDailyNutritionLog = (
  overrides: Partial<DailyNutritionLogContract> = {},
): DailyNutritionLogContract => {
  const timestamp = nowIso();
  const meals = overrides.meals ?? [createMockMealLog()];
  const totals = overrides.totals ?? aggregateDailyTotals(meals);
  return {
    id: overrides.date ?? "2024-01-01",
    userId: "HH-ABC123",
    date: "2024-01-01",
    timezone: "America/New_York",
    meals,
    totals,
    hydrationMl: 2500,
    supplements: ["Vitamin D", "Fish Oil"],
    isVerified: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};
