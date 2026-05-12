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
export const UNIT_SYSTEMS = ["metric", "imperial", "advanced"];
export const UnitSystemSchema = z.enum(UNIT_SYSTEMS);
/** Centralized unit system constants for equality checks */
export const UNIT_SYSTEM = {
    METRIC: "metric",
    IMPERIAL: "imperial",
    ADVANCED: "advanced",
};
/** Human-readable labels for unit systems */
export const UNIT_SYSTEM_LABELS = {
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
export const TIME_FORMATS = ["standard", "military"];
export const TimeFormatSchema = z.enum(TIME_FORMATS);
/** Centralized time format constants for equality checks */
export const TIME_FORMAT = {
    STANDARD: "standard",
    MILITARY: "military",
};
/** Human-readable labels for time formats */
export const TIME_FORMAT_LABELS = {
    standard: "12-Hour (AM/PM)",
    military: "24-Hour",
};
// ============================================================================
// WEIGHT UNITS
// ============================================================================
/**
 * Valid weight units for exercise and body measurements.
 */
export const WEIGHT_UNITS = ["kg", "lbs"];
export const WeightUnitSchema = z.enum(WEIGHT_UNITS);
/** Centralized weight unit constants for equality checks */
export const WEIGHT_UNIT = {
    KG: "kg",
    LBS: "lbs",
};
// ============================================================================
// HEIGHT UNITS
// ============================================================================
/**
 * Valid height units for body measurements.
 */
export const HEIGHT_UNITS = ["cm", "ft_in"];
export const HeightUnitSchema = z.enum(HEIGHT_UNITS);
/** Centralized height unit constants for equality checks */
export const HEIGHT_UNIT = {
    CM: "cm",
    FT_IN: "ft_in",
};
// ============================================================================
// FOOD WEIGHT UNITS
// ============================================================================
/**
 * Valid units for food weight measurements.
 */
export const FOOD_WEIGHT_UNITS = ["g", "oz", "lbs"];
export const FoodWeightUnitSchema = z.enum(FOOD_WEIGHT_UNITS);
/** Centralized food weight unit constants for equality checks */
export const FOOD_WEIGHT_UNIT = {
    G: "g",
    OZ: "oz",
    LBS: "lbs",
};
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
];
export const FoodVolumeUnitSchema = z.enum(FOOD_VOLUME_UNITS);
/** Centralized food volume unit constants for equality checks */
export const FOOD_VOLUME_UNIT = {
    ML: "ml",
    FL_OZ: "fl_oz",
    CUPS: "cups",
    TBSP: "tbsp",
    TSP: "tsp",
};
// ============================================================================
// CALORIE UNITS
// ============================================================================
/**
 * Valid units for calorie/energy measurements.
 */
export const CALORIE_UNITS = ["kcal", "kj"];
export const CalorieUnitSchema = z.enum(CALORIE_UNITS);
/** Centralized calorie unit constants for equality checks */
export const CALORIE_UNIT = {
    KCAL: "kcal",
    KJ: "kj",
};
// ============================================================================
// DISTANCE UNITS
// ============================================================================
/**
 * Valid units for distance measurements.
 */
export const DISTANCE_UNITS = ["km", "mi", "m", "ft"];
export const DistanceUnitSchema = z.enum(DISTANCE_UNITS);
/** Centralized distance unit constants for equality checks */
export const DISTANCE_UNIT = {
    KM: "km",
    MI: "mi",
    M: "m",
    FT: "ft",
};
// ============================================================================
// SPEED UNITS
// ============================================================================
/**
 * Valid units for speed measurements.
 */
export const SPEED_UNITS = ["km_h", "mph", "m_s"];
export const SpeedUnitSchema = z.enum(SPEED_UNITS);
/** Centralized speed unit constants for equality checks */
export const SPEED_UNIT = {
    KM_H: "km_h",
    MPH: "mph",
    M_S: "m_s",
};
// ============================================================================
// ALTITUDE UNITS
// ============================================================================
/**
 * Valid units for altitude measurements.
 */
export const ALTITUDE_UNITS = ["m", "ft"];
export const AltitudeUnitSchema = z.enum(ALTITUDE_UNITS);
/** Centralized altitude unit constants for equality checks */
export const ALTITUDE_UNIT = {
    M: "m",
    FT: "ft",
};
// ============================================================================
// TEMPERATURE UNITS
// ============================================================================
/**
 * Valid units for temperature measurements.
 */
export const TEMPERATURE_UNITS = ["celsius", "fahrenheit"];
export const TemperatureUnitSchema = z.enum(TEMPERATURE_UNITS);
/** Centralized temperature unit constants for equality checks */
export const TEMPERATURE_UNIT = {
    CELSIUS: "celsius",
    FAHRENHEIT: "fahrenheit",
};
// ============================================================================
// WATER UNITS
// ============================================================================
/**
 * Valid units for water/liquid measurements.
 */
export const WATER_UNITS = ["ml", "fl_oz", "cups", "l"];
export const WaterUnitSchema = z.enum(WATER_UNITS);
/** Centralized water unit constants for equality checks */
export const WATER_UNIT = {
    ML: "ml",
    FL_OZ: "fl_oz",
    CUPS: "cups",
    L: "l",
};
// ============================================================================
// ADVANCED UNIT PREFERENCES TYPE
// ============================================================================
export const AdvancedUnitPreferencesSchema = z.object({
    weight: WeightUnitSchema,
    height: HeightUnitSchema,
    foodWeight: FoodWeightUnitSchema,
    foodVolume: FoodVolumeUnitSchema,
    calories: CalorieUnitSchema,
    exerciseWeight: WeightUnitSchema,
    distance: DistanceUnitSchema,
    speed: SpeedUnitSchema,
    altitude: AltitudeUnitSchema,
    temperature: TemperatureUnitSchema,
    water: WaterUnitSchema,
});
//# sourceMappingURL=units.js.map