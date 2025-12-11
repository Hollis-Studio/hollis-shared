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
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

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
