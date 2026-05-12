/**
 * @ai-context User unit contracts | unit systems, weight, height, food, calories, distance, speed, etc.
 *
 * This module provides canonical definitions for all unit types and conversion constants
 * used across the application.
 *
 * deps: zod | consumers: all codebases (mobile, web-admin, server)
 */
import { z } from "zod";
/**
 * Valid unit system preferences for user settings.
 * - metric: All units in metric system
 * - imperial: All units in imperial system
 * - advanced: Custom per-category unit selection
 */
export declare const UNIT_SYSTEMS: readonly ["metric", "imperial", "advanced"];
export type UnitSystemPreference = (typeof UNIT_SYSTEMS)[number];
export declare const UnitSystemSchema: z.ZodEnum<{
    metric: "metric";
    imperial: "imperial";
    advanced: "advanced";
}>;
export type UnitSystem = z.infer<typeof UnitSystemSchema>;
/** Centralized unit system constants for equality checks */
export declare const UNIT_SYSTEM: {
    readonly METRIC: UnitSystemPreference;
    readonly IMPERIAL: UnitSystemPreference;
    readonly ADVANCED: UnitSystemPreference;
};
/** Human-readable labels for unit systems */
export declare const UNIT_SYSTEM_LABELS: Record<UnitSystemPreference, string>;
/**
 * Valid time format preferences.
 * - standard: 12-hour format (AM/PM)
 * - military: 24-hour format
 */
export declare const TIME_FORMATS: readonly ["standard", "military"];
export type TimeFormatPreference = (typeof TIME_FORMATS)[number];
export declare const TimeFormatSchema: z.ZodEnum<{
    standard: "standard";
    military: "military";
}>;
export type TimeFormat = z.infer<typeof TimeFormatSchema>;
/** Centralized time format constants for equality checks */
export declare const TIME_FORMAT: {
    readonly STANDARD: TimeFormatPreference;
    readonly MILITARY: TimeFormatPreference;
};
/** Human-readable labels for time formats */
export declare const TIME_FORMAT_LABELS: Record<TimeFormatPreference, string>;
/**
 * Valid weight units for exercise and body measurements.
 */
export declare const WEIGHT_UNITS: readonly ["kg", "lbs"];
export declare const WeightUnitSchema: z.ZodEnum<{
    kg: "kg";
    lbs: "lbs";
}>;
export type WeightUnit = z.infer<typeof WeightUnitSchema>;
/** Centralized weight unit constants for equality checks */
export declare const WEIGHT_UNIT: {
    readonly KG: WeightUnit;
    readonly LBS: WeightUnit;
};
/**
 * Valid height units for body measurements.
 */
export declare const HEIGHT_UNITS: readonly ["cm", "ft_in"];
export declare const HeightUnitSchema: z.ZodEnum<{
    cm: "cm";
    ft_in: "ft_in";
}>;
export type HeightUnit = z.infer<typeof HeightUnitSchema>;
/** Centralized height unit constants for equality checks */
export declare const HEIGHT_UNIT: {
    readonly CM: HeightUnit;
    readonly FT_IN: HeightUnit;
};
/**
 * Valid units for food weight measurements.
 */
export declare const FOOD_WEIGHT_UNITS: readonly ["g", "oz", "lbs"];
export declare const FoodWeightUnitSchema: z.ZodEnum<{
    lbs: "lbs";
    g: "g";
    oz: "oz";
}>;
export type FoodWeightUnit = z.infer<typeof FoodWeightUnitSchema>;
/** Centralized food weight unit constants for equality checks */
export declare const FOOD_WEIGHT_UNIT: {
    readonly G: FoodWeightUnit;
    readonly OZ: FoodWeightUnit;
    readonly LBS: FoodWeightUnit;
};
/**
 * Valid units for food volume measurements.
 */
export declare const FOOD_VOLUME_UNITS: readonly ["ml", "fl_oz", "cups", "tbsp", "tsp"];
export declare const FoodVolumeUnitSchema: z.ZodEnum<{
    ml: "ml";
    fl_oz: "fl_oz";
    cups: "cups";
    tbsp: "tbsp";
    tsp: "tsp";
}>;
export type FoodVolumeUnit = z.infer<typeof FoodVolumeUnitSchema>;
/** Centralized food volume unit constants for equality checks */
export declare const FOOD_VOLUME_UNIT: {
    readonly ML: FoodVolumeUnit;
    readonly FL_OZ: FoodVolumeUnit;
    readonly CUPS: FoodVolumeUnit;
    readonly TBSP: FoodVolumeUnit;
    readonly TSP: FoodVolumeUnit;
};
/**
 * Valid units for calorie/energy measurements.
 */
export declare const CALORIE_UNITS: readonly ["kcal", "kj"];
export declare const CalorieUnitSchema: z.ZodEnum<{
    kcal: "kcal";
    kj: "kj";
}>;
export type CalorieUnit = z.infer<typeof CalorieUnitSchema>;
/** Centralized calorie unit constants for equality checks */
export declare const CALORIE_UNIT: {
    readonly KCAL: CalorieUnit;
    readonly KJ: CalorieUnit;
};
/**
 * Valid units for distance measurements.
 */
export declare const DISTANCE_UNITS: readonly ["km", "mi", "m", "ft"];
export declare const DistanceUnitSchema: z.ZodEnum<{
    km: "km";
    mi: "mi";
    m: "m";
    ft: "ft";
}>;
export type DistanceUnit = z.infer<typeof DistanceUnitSchema>;
/** Centralized distance unit constants for equality checks */
export declare const DISTANCE_UNIT: {
    readonly KM: DistanceUnit;
    readonly MI: DistanceUnit;
    readonly M: DistanceUnit;
    readonly FT: DistanceUnit;
};
/**
 * Valid units for speed measurements.
 */
export declare const SPEED_UNITS: readonly ["km_h", "mph", "m_s"];
export declare const SpeedUnitSchema: z.ZodEnum<{
    km_h: "km_h";
    mph: "mph";
    m_s: "m_s";
}>;
export type SpeedUnit = z.infer<typeof SpeedUnitSchema>;
/** Centralized speed unit constants for equality checks */
export declare const SPEED_UNIT: {
    readonly KM_H: SpeedUnit;
    readonly MPH: SpeedUnit;
    readonly M_S: SpeedUnit;
};
/**
 * Valid units for altitude measurements.
 */
export declare const ALTITUDE_UNITS: readonly ["m", "ft"];
export declare const AltitudeUnitSchema: z.ZodEnum<{
    m: "m";
    ft: "ft";
}>;
export type AltitudeUnit = z.infer<typeof AltitudeUnitSchema>;
/** Centralized altitude unit constants for equality checks */
export declare const ALTITUDE_UNIT: {
    readonly M: AltitudeUnit;
    readonly FT: AltitudeUnit;
};
/**
 * Valid units for temperature measurements.
 */
export declare const TEMPERATURE_UNITS: readonly ["celsius", "fahrenheit"];
export declare const TemperatureUnitSchema: z.ZodEnum<{
    celsius: "celsius";
    fahrenheit: "fahrenheit";
}>;
export type TemperatureUnit = z.infer<typeof TemperatureUnitSchema>;
/** Centralized temperature unit constants for equality checks */
export declare const TEMPERATURE_UNIT: {
    readonly CELSIUS: TemperatureUnit;
    readonly FAHRENHEIT: TemperatureUnit;
};
/**
 * Valid units for water/liquid measurements.
 */
export declare const WATER_UNITS: readonly ["ml", "fl_oz", "cups", "l"];
export declare const WaterUnitSchema: z.ZodEnum<{
    ml: "ml";
    fl_oz: "fl_oz";
    cups: "cups";
    l: "l";
}>;
export type WaterUnit = z.infer<typeof WaterUnitSchema>;
/** Centralized water unit constants for equality checks */
export declare const WATER_UNIT: {
    readonly ML: WaterUnit;
    readonly FL_OZ: WaterUnit;
    readonly CUPS: WaterUnit;
    readonly L: WaterUnit;
};
export declare const AdvancedUnitPreferencesSchema: z.ZodObject<{
    weight: z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>;
    height: z.ZodEnum<{
        cm: "cm";
        ft_in: "ft_in";
    }>;
    foodWeight: z.ZodEnum<{
        lbs: "lbs";
        g: "g";
        oz: "oz";
    }>;
    foodVolume: z.ZodEnum<{
        ml: "ml";
        fl_oz: "fl_oz";
        cups: "cups";
        tbsp: "tbsp";
        tsp: "tsp";
    }>;
    calories: z.ZodEnum<{
        kcal: "kcal";
        kj: "kj";
    }>;
    exerciseWeight: z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>;
    distance: z.ZodEnum<{
        km: "km";
        mi: "mi";
        m: "m";
        ft: "ft";
    }>;
    speed: z.ZodEnum<{
        km_h: "km_h";
        mph: "mph";
        m_s: "m_s";
    }>;
    altitude: z.ZodEnum<{
        m: "m";
        ft: "ft";
    }>;
    temperature: z.ZodEnum<{
        celsius: "celsius";
        fahrenheit: "fahrenheit";
    }>;
    water: z.ZodEnum<{
        ml: "ml";
        fl_oz: "fl_oz";
        cups: "cups";
        l: "l";
    }>;
}, z.core.$strip>;
export type AdvancedUnitPreferencesContract = z.infer<typeof AdvancedUnitPreferencesSchema>;
//# sourceMappingURL=units.d.ts.map