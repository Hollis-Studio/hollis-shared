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

import { z } from 'zod';
import { foodLogEntrySchema, type FoodLogEntryContract } from '../schemas/json-blobs';

// Note: foodLogEntrySchema and FoodLogEntryContract are used internally but NOT re-exported
// to avoid duplicate export errors in barrel files. Import them from @hollis/contracts/schemas.

// ============================================================================
// MEAL TYPES
// ============================================================================

/**
 * Valid meal type values for nutrition logging.
 */
export const MEAL_TYPES = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
  'pre_workout',
  'post_workout',
  'other',
] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export const MealTypeSchema = z.enum(MEAL_TYPES);

/** Centralized meal type constants for equality checks */
export const MEAL_TYPE = {
  BREAKFAST: 'breakfast' as MealType,
  LUNCH: 'lunch' as MealType,
  DINNER: 'dinner' as MealType,
  SNACK: 'snack' as MealType,
  PRE_WORKOUT: 'pre_workout' as MealType,
  POST_WORKOUT: 'post_workout' as MealType,
  OTHER: 'other' as MealType,
} as const;

/** Human-readable labels for meal types */
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
  pre_workout: 'Pre-Workout',
  post_workout: 'Post-Workout',
  other: 'Other',
};

/** Typical time ranges for meal types (24-hour format) */
export const MEAL_TYPE_TIME_RANGES: Record<MealType, { start: number; end: number }> = {
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
export const LOCATION_TYPES = ['home', 'restaurant', 'work', 'travel', 'social_event'] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

export const LocationTypeSchema = z.enum(LOCATION_TYPES);

/** Human-readable labels for location types */
export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  home: 'Home',
  restaurant: 'Restaurant',
  work: 'Work',
  travel: 'Travel',
  social_event: 'Social Event',
};

// ============================================================================
// DIGESTION QUALITY
// ============================================================================

/**
 * Self-reported digestion quality after a meal.
 */
export const DIGESTION_QUALITIES = ['excellent', 'good', 'normal', 'poor', 'very_poor'] as const;
export type DigestionQuality = (typeof DIGESTION_QUALITIES)[number];

export const DigestionQualitySchema = z.enum(DIGESTION_QUALITIES);

/** Human-readable labels for digestion quality */
export const DIGESTION_QUALITY_LABELS: Record<DigestionQuality, string> = {
  excellent: 'Excellent',
  good: 'Good',
  normal: 'Normal',
  poor: 'Poor',
  very_poor: 'Very Poor',
};

// ============================================================================
// ENERGY LEVEL
// ============================================================================

/**
 * Self-reported energy level.
 */
export const ENERGY_LEVELS = ['very_low', 'low', 'normal', 'high', 'very_high'] as const;
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];

export const EnergyLevelSchema = z.enum(ENERGY_LEVELS);

/** Human-readable labels for energy levels */
export const ENERGY_LEVEL_LABELS: Record<EnergyLevel, string> = {
  very_low: 'Very Low',
  low: 'Low',
  normal: 'Normal',
  high: 'High',
  very_high: 'Very High',
};

// ============================================================================
// MOOD LEVEL
// ============================================================================

/**
 * Self-reported mood level.
 */
export const MOOD_LEVELS = ['very_negative', 'negative', 'neutral', 'positive', 'very_positive'] as const;
export type MoodLevel = (typeof MOOD_LEVELS)[number];

export const MoodLevelSchema = z.enum(MOOD_LEVELS);

/** Human-readable labels for mood levels */
export const MOOD_LEVEL_LABELS: Record<MoodLevel, string> = {
  very_negative: 'Very Negative',
  negative: 'Negative',
  neutral: 'Neutral',
  positive: 'Positive',
  very_positive: 'Very Positive',
};

// ============================================================================
// PREPARATION METHOD
// ============================================================================

/**
 * How food was prepared.
 */
export const PREPARATION_METHODS = ['raw', 'boiled', 'fried', 'baked', 'grilled', 'steamed', 'roasted'] as const;
export type PreparationMethod = (typeof PREPARATION_METHODS)[number];

export const PreparationMethodSchema = z.enum(PREPARATION_METHODS);

/** Human-readable labels for preparation methods */
export const PREPARATION_METHOD_LABELS: Record<PreparationMethod, string> = {
  raw: 'Raw',
  boiled: 'Boiled',
  fried: 'Fried',
  baked: 'Baked',
  grilled: 'Grilled',
  steamed: 'Steamed',
  roasted: 'Roasted',
};

// ============================================================================
// FOOD UNITS
// ============================================================================

/**
 * Units for measuring food quantities.
 */
export const FOOD_UNITS = ['grams', 'ounces', 'cups', 'tablespoons', 'teaspoons', 'servings', 'milliliters', 'liters'] as const;
export type FoodUnit = (typeof FOOD_UNITS)[number];

export const FoodUnitSchema = z.enum(FOOD_UNITS);

/** Human-readable labels for food units */
export const FOOD_UNIT_LABELS: Record<FoodUnit, string> = {
  grams: 'Grams',
  ounces: 'Ounces',
  cups: 'Cups',
  tablespoons: 'Tablespoons',
  teaspoons: 'Teaspoons',
  servings: 'Servings',
  milliliters: 'Milliliters',
  liters: 'Liters',
};

// ============================================================================
// MACRONUTRIENT SHORTHAND
// ============================================================================

/**
 * Shorthand macro structure used in database (totalMacros JSON field).
 * This is a compact representation: { p: protein, c: carbs, f: fat }
 *
 * IMPORTANT: The database stores this as JSON string in DailyLog.totalMacros.
 * Always use parseMacroShorthand() and stringifyMacroShorthand() for conversion.
 */
export interface MacroShorthand {
  p: number; // protein in grams
  c: number; // carbs in grams
  f: number; // fat in grams
}

export const MacroShorthandSchema = z.object({
  p: z.number().min(0),
  c: z.number().min(0),
  f: z.number().min(0),
}) satisfies z.ZodType<MacroShorthand>;

/** Default empty macro shorthand */
export const EMPTY_MACRO_SHORTHAND: MacroShorthand = { p: 0, c: 0, f: 0 };

/**
 * Parse totalMacros from database (JSON string or object).
 * Handles both string and object inputs for backwards compatibility.
 */
export function parseMacroShorthand(value: string | MacroShorthand | null | undefined): MacroShorthand {
  if (!value) return { ...EMPTY_MACRO_SHORTHAND };

  const parsedValue = (() => {
    if (typeof value !== 'string') return value;
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

/**
 * Full macro breakdown for meal/daily totals.
 */
export interface NutritionMacroBreakdown {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export const NutritionMacroBreakdownSchema: z.ZodType<NutritionMacroBreakdown> = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
});

// ============================================================================
// NUTRITION PORTION CONTRACT
// ============================================================================

export interface NutritionPortionContract {
  id?: string;
  foodName: string;
  brand?: string;
  quantity: number;
  unit: string;
  macros: NutritionMacroBreakdown;
  photoUrl?: string;
}

export const NutritionPortionSchema: z.ZodType<NutritionPortionContract> = z.object({
  id: z.string().optional(),
  foodName: z.string().min(1),
  brand: z.string().optional(),
  quantity: z.number().min(0),
  unit: z.string().min(1),
  macros: NutritionMacroBreakdownSchema,
  photoUrl: z.string().url().optional(),
});

// ============================================================================
// MEAL CONTEXT CONTRACT
// ============================================================================

export interface MealContextContract {
  location?: LocationType;
  preparationMethod?: PreparationMethod;
  socialContext?: string;
  mealDuration?: number; // minutes
}

export const MealContextSchema: z.ZodType<MealContextContract> = z.object({
  location: LocationTypeSchema.optional(),
  preparationMethod: PreparationMethodSchema.optional(),
  socialContext: z.string().optional(),
  mealDuration: z.number().min(0).optional(),
});

// ============================================================================
// MEAL LOG CONTRACT
// ============================================================================

/**
 * Meal log contract - represents a single meal entry.
 */
export interface MealLogContract {
  id?: string;
  mealType: MealType;
  loggedAt: string; // IsoTimestampString
  portions: NutritionPortionContract[];
  notes?: string;
  hungerLevel?: number; // 1-10
  fullnessLevel?: number; // 1-10
  mood?: MoodLevel;
  mealContext?: MealContextContract;
  digestion?: DigestionQuality;
  energy?: EnergyLevel;
  photoUrls?: string[];
}

export const MealLogSchema: z.ZodType<MealLogContract> = z.object({
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

// ============================================================================
// DAILY NUTRITION LOG CONTRACT
// ============================================================================

// Note: FoodLogEntryContract is defined in ../schemas/json-blobs.ts
// and re-exported via the schemas barrel. Import from there for use with foodEntries.

/**
 * Daily nutrition log contract - aggregated nutrition data for a single day.
 */
export interface DailyNutritionLogContract {
  id?: string; // defaults to date
  /**
   * User identifier in HH-XXXXXX barcode format.
   * References the patient this nutrition log belongs to.
   *
   * @format HH-XXXXXX
   */
  userId: string;
  date: string; // IsoDateString
  timezone: string;
  meals: MealLogContract[];
  /**
   * @computed Calculated by aggregateDailyTotals() summing all meal portion macros.
   */
  totals: NutritionMacroBreakdown;
  hydrationMl?: number;
  supplements?: string[];
  foodEntries?: {
    [hour: string]: FoodLogEntryContract[];
  };
  isVerified: boolean; // AI processed entries are verified
  createdAt: string; // IsoTimestampString
  updatedAt: string; // IsoTimestampString
}

export const DailyNutritionLogSchema: z.ZodType<DailyNutritionLogContract> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  date: z.string(),
  timezone: z.string(),
  meals: z.array(MealLogSchema),
  totals: NutritionMacroBreakdownSchema,
  hydrationMl: z.number().min(0).optional(),
  supplements: z.array(z.string()).optional(),
  foodEntries: z.record(z.string(), z.array(foodLogEntrySchema)).optional(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

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
  id: 'mock-meal-id',
  mealType: 'lunch',
  loggedAt: nowIso(),
  portions: [
    {
      id: 'mock-portion-id',
      foodName: 'Grilled Chicken Salad',
      quantity: 1,
      unit: 'servings',
      macros: createMockNutritionMacroBreakdown(),
    },
  ],
  notes: 'Enjoyed at home',
  hungerLevel: 7,
  fullnessLevel: 8,
  ...overrides,
});

export const createMockDailyNutritionLog = (
  overrides: Partial<DailyNutritionLogContract> = {},
): DailyNutritionLogContract => {
  const timestamp = nowIso();
  return {
    id: overrides.date ?? '2024-01-01',
    userId: 'HH-ABC123',
    date: '2024-01-01',
    timezone: 'America/New_York',
    meals: [createMockMealLog()],
    totals: createMockNutritionMacroBreakdown({ calories: 2000, protein: 120, carbs: 200, fat: 80 }),
    hydrationMl: 2500,
    supplements: ['Vitamin D', 'Fish Oil'],
    isVerified: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};
