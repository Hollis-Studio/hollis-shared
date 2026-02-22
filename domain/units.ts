/**
 * @ai-context User unit contracts | unit systems, weight, height, food, calories, distance, speed, etc.
 *
 * This module provides canonical definitions for all unit types and conversion constants
 * used across the application.
 *
 * deps: zod | consumers: all codebases (mobile, web-admin, server)
 */
import { z } from "zod";

// ============================================================================
// UNIT SYSTEM PREFERENCES
// ============================================================================

/**
 * Valid unit system preferences for user settings.
 * - metric: All units in metric system
 * - imperial: All units in imperial system
 * - advanced: Custom per-category unit selection
 */
export const UNIT_SYSTEMS = ["metric", "imperial", "advanced"] as const;
export type UnitSystemPreference = (typeof UNIT_SYSTEMS)[number];

export const UnitSystemSchema = z.enum(UNIT_SYSTEMS);
export type UnitSystem = z.infer<typeof UnitSystemSchema>;

/** Centralized unit system constants for equality checks */
export const UNIT_SYSTEM = {
  METRIC: "metric" as UnitSystemPreference,
  IMPERIAL: "imperial" as UnitSystemPreference,
  ADVANCED: "advanced" as UnitSystemPreference,
} as const;

/** Human-readable labels for unit systems */
export const UNIT_SYSTEM_LABELS: Record<UnitSystemPreference, string> = {
  metric: "Metric",
  imperial: "Imperial",
  advanced: "Advanced (Custom)",
};

// ============================================================================
// TIME FORMAT PREFERENCES
// ============================================================================

/**
 * Valid time format preferences.
 * - standard: 12-hour format (AM/PM)
 * - military: 24-hour format
 */
export const TIME_FORMATS = ["standard", "military"] as const;
export type TimeFormatPreference = (typeof TIME_FORMATS)[number];

export const TimeFormatSchema = z.enum(TIME_FORMATS);
export type TimeFormat = z.infer<typeof TimeFormatSchema>;

/** Centralized time format constants for equality checks */
export const TIME_FORMAT = {
  STANDARD: "standard" as TimeFormatPreference,
  MILITARY: "military" as TimeFormatPreference,
} as const;

/** Human-readable labels for time formats */
export const TIME_FORMAT_LABELS: Record<TimeFormatPreference, string> = {
  standard: "12-Hour (AM/PM)",
  military: "24-Hour",
};

// ============================================================================
// WEIGHT UNITS
// ============================================================================

/**
 * Valid weight units for exercise and body measurements.
 */
export const WEIGHT_UNITS = ["kg", "lbs"] as const;
export const WeightUnitSchema = z.enum(WEIGHT_UNITS);
export type WeightUnit = z.infer<typeof WeightUnitSchema>;

/** Centralized weight unit constants for equality checks */
export const WEIGHT_UNIT = {
  KG: "kg" as WeightUnit,
  LBS: "lbs" as WeightUnit,
} as const;

// ============================================================================
// HEIGHT UNITS
// ============================================================================

/**
 * Valid height units for body measurements.
 */
export const HEIGHT_UNITS = ["cm", "ft_in"] as const;
export const HeightUnitSchema = z.enum(HEIGHT_UNITS);
export type HeightUnit = z.infer<typeof HeightUnitSchema>;

/** Centralized height unit constants for equality checks */
export const HEIGHT_UNIT = {
  CM: "cm" as HeightUnit,
  FT_IN: "ft_in" as HeightUnit,
} as const;

// ============================================================================
// FOOD WEIGHT UNITS
// ============================================================================

/**
 * Valid units for food weight measurements.
 */
export const FOOD_WEIGHT_UNITS = ["g", "oz", "lbs"] as const;
export const FoodWeightUnitSchema = z.enum(FOOD_WEIGHT_UNITS);
export type FoodWeightUnit = z.infer<typeof FoodWeightUnitSchema>;

/** Centralized food weight unit constants for equality checks */
export const FOOD_WEIGHT_UNIT = {
  G: "g" as FoodWeightUnit,
  OZ: "oz" as FoodWeightUnit,
  LBS: "lbs" as FoodWeightUnit,
} as const;

// ============================================================================
// FOOD VOLUME UNITS
// ============================================================================

/**
 * Valid units for food volume measurements.
 */
export const FOOD_VOLUME_UNITS = [
  "ml",
  "fl_oz",
  "cups",
  "tbsp",
  "tsp",
] as const;
export const FoodVolumeUnitSchema = z.enum(FOOD_VOLUME_UNITS);
export type FoodVolumeUnit = z.infer<typeof FoodVolumeUnitSchema>;

/** Centralized food volume unit constants for equality checks */
export const FOOD_VOLUME_UNIT = {
  ML: "ml" as FoodVolumeUnit,
  FL_OZ: "fl_oz" as FoodVolumeUnit,
  CUPS: "cups" as FoodVolumeUnit,
  TBSP: "tbsp" as FoodVolumeUnit,
  TSP: "tsp" as FoodVolumeUnit,
} as const;

// ============================================================================
// CALORIE UNITS
// ============================================================================

/**
 * Valid units for calorie/energy measurements.
 */
export const CALORIE_UNITS = ["kcal", "kj"] as const;
export const CalorieUnitSchema = z.enum(CALORIE_UNITS);
export type CalorieUnit = z.infer<typeof CalorieUnitSchema>;

/** Centralized calorie unit constants for equality checks */
export const CALORIE_UNIT = {
  KCAL: "kcal" as CalorieUnit,
  KJ: "kj" as CalorieUnit,
} as const;

// ============================================================================
// DISTANCE UNITS
// ============================================================================

/**
 * Valid units for distance measurements.
 */
export const DISTANCE_UNITS = ["km", "mi", "m", "ft"] as const;
export const DistanceUnitSchema = z.enum(DISTANCE_UNITS);
export type DistanceUnit = z.infer<typeof DistanceUnitSchema>;

/** Centralized distance unit constants for equality checks */
export const DISTANCE_UNIT = {
  KM: "km" as DistanceUnit,
  MI: "mi" as DistanceUnit,
  M: "m" as DistanceUnit,
  FT: "ft" as DistanceUnit,
} as const;

// ============================================================================
// SPEED UNITS
// ============================================================================

/**
 * Valid units for speed measurements.
 */
export const SPEED_UNITS = ["km_h", "mph", "m_s"] as const;
export const SpeedUnitSchema = z.enum(SPEED_UNITS);
export type SpeedUnit = z.infer<typeof SpeedUnitSchema>;

/** Centralized speed unit constants for equality checks */
export const SPEED_UNIT = {
  KM_H: "km_h" as SpeedUnit,
  MPH: "mph" as SpeedUnit,
  M_S: "m_s" as SpeedUnit,
} as const;

// ============================================================================
// ALTITUDE UNITS
// ============================================================================

/**
 * Valid units for altitude measurements.
 */
export const ALTITUDE_UNITS = ["m", "ft"] as const;
export const AltitudeUnitSchema = z.enum(ALTITUDE_UNITS);
export type AltitudeUnit = z.infer<typeof AltitudeUnitSchema>;

/** Centralized altitude unit constants for equality checks */
export const ALTITUDE_UNIT = {
  M: "m" as AltitudeUnit,
  FT: "ft" as AltitudeUnit,
} as const;

// ============================================================================
// TEMPERATURE UNITS
// ============================================================================

/**
 * Valid units for temperature measurements.
 */
export const TEMPERATURE_UNITS = ["celsius", "fahrenheit"] as const;
export const TemperatureUnitSchema = z.enum(TEMPERATURE_UNITS);
export type TemperatureUnit = z.infer<typeof TemperatureUnitSchema>;

/** Centralized temperature unit constants for equality checks */
export const TEMPERATURE_UNIT = {
  CELSIUS: "celsius" as TemperatureUnit,
  FAHRENHEIT: "fahrenheit" as TemperatureUnit,
} as const;

// ============================================================================
// WATER UNITS
// ============================================================================

/**
 * Valid units for water/liquid measurements.
 */
export const WATER_UNITS = ["ml", "fl_oz", "cups", "l"] as const;
export const WaterUnitSchema = z.enum(WATER_UNITS);
export type WaterUnit = z.infer<typeof WaterUnitSchema>;

/** Centralized water unit constants for equality checks */
export const WATER_UNIT = {
  ML: "ml" as WaterUnit,
  FL_OZ: "fl_oz" as WaterUnit,
  CUPS: "cups" as WaterUnit,
  L: "l" as WaterUnit,
} as const;

// ============================================================================
// ADVANCED UNIT PREFERENCES TYPE
// ============================================================================

export interface AdvancedUnitPreferencesContract {
  weight: "kg" | "lbs";
  height: "cm" | "ft_in";
  foodWeight: "g" | "oz" | "lbs";
  foodVolume: "ml" | "fl_oz" | "cups" | "tbsp" | "tsp";
  calories: "kcal" | "kj";
  exerciseWeight: "kg" | "lbs";
  distance: "km" | "mi" | "m" | "ft";
  speed: "km_h" | "mph" | "m_s";
  altitude: "m" | "ft";
  temperature: "celsius" | "fahrenheit";
  water: "ml" | "fl_oz" | "cups" | "l";
}
