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
/**
 * Valid meal type values for nutrition logging.
 */
export declare const MEAL_TYPES: readonly ["breakfast", "lunch", "dinner", "snack", "pre_workout", "post_workout", "other"];
export type MealType = z.infer<typeof MealTypeSchema>;
export declare const MealTypeSchema: z.ZodEnum<{
    other: "other";
    breakfast: "breakfast";
    lunch: "lunch";
    dinner: "dinner";
    snack: "snack";
    pre_workout: "pre_workout";
    post_workout: "post_workout";
}>;
/** Centralized meal type constants for equality checks */
export declare const MEAL_TYPE: {
    readonly BREAKFAST: "breakfast";
    readonly LUNCH: "lunch";
    readonly DINNER: "dinner";
    readonly SNACK: "snack";
    readonly PRE_WORKOUT: "pre_workout";
    readonly POST_WORKOUT: "post_workout";
    readonly OTHER: "other";
};
/** Human-readable labels for meal types */
export declare const MEAL_TYPE_LABELS: Record<MealType, string>;
/** Typical time ranges for meal types (24-hour format) */
export declare const MEAL_TYPE_TIME_RANGES: Record<MealType, {
    start: number;
    end: number;
}>;
/**
 * Check if a string is a valid meal type
 */
export declare function isMealType(value: string): value is MealType;
/**
 * Get the label for a meal type, with fallback
 */
export declare function getMealTypeLabel(type: string): string;
/**
 * Where a meal was consumed.
 */
export declare const LOCATION_TYPES: readonly ["home", "restaurant", "work", "travel", "social_event"];
export type LocationType = z.infer<typeof LocationTypeSchema>;
export declare const LocationTypeSchema: z.ZodEnum<{
    home: "home";
    restaurant: "restaurant";
    work: "work";
    travel: "travel";
    social_event: "social_event";
}>;
/** Human-readable labels for location types */
export declare const LOCATION_TYPE_LABELS: Record<LocationType, string>;
/**
 * How a food entry was logged.
 * - search: Found via food database search
 * - barcode: Scanned from product barcode
 * - custom: User-created custom food
 * - manual: Manual entry without database lookup
 * - ai: Logged directly from AI food analysis
 * - ai_edited: AI-analysed then manually edited by user (no quality score / reasoning)
 */
export declare const FOOD_SOURCES: readonly ["search", "barcode", "custom", "manual", "ai", "ai_edited"];
export type FoodSource = z.infer<typeof FoodSourceSchema>;
export declare const FoodSourceSchema: z.ZodEnum<{
    custom: "custom";
    barcode: "barcode";
    search: "search";
    manual: "manual";
    ai: "ai";
    ai_edited: "ai_edited";
}>;
/** Centralized food source constants for equality checks */
export declare const FOOD_SOURCE: {
    readonly SEARCH: "search";
    readonly BARCODE: "barcode";
    readonly CUSTOM: "custom";
    readonly MANUAL: "manual";
    readonly AI: "ai";
    readonly AI_EDITED: "ai_edited";
};
/** Human-readable labels for food sources */
export declare const FOOD_SOURCE_LABELS: Record<FoodSource, string>;
/**
 * Self-reported digestion quality after a meal.
 */
export declare const DIGESTION_QUALITIES: readonly ["excellent", "good", "normal", "poor", "very_poor"];
export type DigestionQuality = z.infer<typeof DigestionQualitySchema>;
export declare const DigestionQualitySchema: z.ZodEnum<{
    excellent: "excellent";
    good: "good";
    normal: "normal";
    poor: "poor";
    very_poor: "very_poor";
}>;
/** Human-readable labels for digestion quality */
export declare const DIGESTION_QUALITY_LABELS: Record<DigestionQuality, string>;
/**
 * Self-reported energy level.
 */
export declare const ENERGY_LEVELS: readonly ["very_low", "low", "normal", "high", "very_high"];
export type EnergyLevel = z.infer<typeof EnergyLevelSchema>;
export declare const EnergyLevelSchema: z.ZodEnum<{
    low: "low";
    high: "high";
    normal: "normal";
    very_low: "very_low";
    very_high: "very_high";
}>;
/** Human-readable labels for energy levels */
export declare const ENERGY_LEVEL_LABELS: Record<EnergyLevel, string>;
/**
 * Self-reported mood level.
 */
export declare const MOOD_LEVELS: readonly ["very_negative", "negative", "neutral", "positive", "very_positive"];
export type MoodLevel = z.infer<typeof MoodLevelSchema>;
export declare const MoodLevelSchema: z.ZodEnum<{
    very_negative: "very_negative";
    negative: "negative";
    neutral: "neutral";
    positive: "positive";
    very_positive: "very_positive";
}>;
/** Human-readable labels for mood levels */
export declare const MOOD_LEVEL_LABELS: Record<MoodLevel, string>;
/**
 * How food was prepared.
 */
export declare const PREPARATION_METHODS: readonly ["raw", "boiled", "fried", "baked", "grilled", "steamed", "roasted"];
export type PreparationMethod = z.infer<typeof PreparationMethodSchema>;
export declare const PreparationMethodSchema: z.ZodEnum<{
    raw: "raw";
    boiled: "boiled";
    fried: "fried";
    baked: "baked";
    grilled: "grilled";
    steamed: "steamed";
    roasted: "roasted";
}>;
/** Human-readable labels for preparation methods */
export declare const PREPARATION_METHOD_LABELS: Record<PreparationMethod, string>;
/**
 * Units for measuring food quantities.
 */
export declare const FOOD_UNITS: readonly ["grams", "ounces", "cups", "tablespoons", "teaspoons", "servings", "milliliters", "liters"];
export type FoodUnit = z.infer<typeof FoodUnitSchema>;
export declare const FoodUnitSchema: z.ZodEnum<{
    cups: "cups";
    grams: "grams";
    ounces: "ounces";
    tablespoons: "tablespoons";
    teaspoons: "teaspoons";
    servings: "servings";
    milliliters: "milliliters";
    liters: "liters";
}>;
/** Human-readable labels for food units */
export declare const FOOD_UNIT_LABELS: Record<FoodUnit, string>;
export declare const MacroShorthandSchema: z.ZodObject<{
    p: z.ZodNumber;
    c: z.ZodNumber;
    f: z.ZodNumber;
}, z.core.$strip>;
export type MacroShorthand = z.infer<typeof MacroShorthandSchema>;
/** Default empty macro shorthand */
export declare const EMPTY_MACRO_SHORTHAND: MacroShorthand;
/**
 * Parse totalMacros from database (JSON string or object).
 * Handles both string and object inputs for backwards compatibility.
 */
export declare function parseMacroShorthand(value: string | MacroShorthand | null | undefined): MacroShorthand;
/**
 * Stringify macro shorthand for database storage.
 */
export declare function stringifyMacroShorthand(macros: MacroShorthand): string;
export declare const NutritionMacroBreakdownSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    sugar: z.ZodOptional<z.ZodNumber>;
    sodium: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type NutritionMacroBreakdown = z.infer<typeof NutritionMacroBreakdownSchema>;
export declare const NutritionPortionSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    foodName: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    unit: z.ZodString;
    macros: z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    photoUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type NutritionPortionContract = z.infer<typeof NutritionPortionSchema>;
export declare const MealContextSchema: z.ZodObject<{
    location: z.ZodOptional<z.ZodEnum<{
        home: "home";
        restaurant: "restaurant";
        work: "work";
        travel: "travel";
        social_event: "social_event";
    }>>;
    preparationMethod: z.ZodOptional<z.ZodEnum<{
        raw: "raw";
        boiled: "boiled";
        fried: "fried";
        baked: "baked";
        grilled: "grilled";
        steamed: "steamed";
        roasted: "roasted";
    }>>;
    socialContext: z.ZodOptional<z.ZodString>;
    mealDuration: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type MealContextContract = z.infer<typeof MealContextSchema>;
export declare const MealLogSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    mealType: z.ZodEnum<{
        other: "other";
        breakfast: "breakfast";
        lunch: "lunch";
        dinner: "dinner";
        snack: "snack";
        pre_workout: "pre_workout";
        post_workout: "post_workout";
    }>;
    loggedAt: z.ZodString;
    portions: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        foodName: z.ZodString;
        brand: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        unit: z.ZodString;
        macros: z.ZodObject<{
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        photoUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    notes: z.ZodOptional<z.ZodString>;
    hungerLevel: z.ZodOptional<z.ZodNumber>;
    fullnessLevel: z.ZodOptional<z.ZodNumber>;
    mood: z.ZodOptional<z.ZodEnum<{
        very_negative: "very_negative";
        negative: "negative";
        neutral: "neutral";
        positive: "positive";
        very_positive: "very_positive";
    }>>;
    mealContext: z.ZodOptional<z.ZodObject<{
        location: z.ZodOptional<z.ZodEnum<{
            home: "home";
            restaurant: "restaurant";
            work: "work";
            travel: "travel";
            social_event: "social_event";
        }>>;
        preparationMethod: z.ZodOptional<z.ZodEnum<{
            raw: "raw";
            boiled: "boiled";
            fried: "fried";
            baked: "baked";
            grilled: "grilled";
            steamed: "steamed";
            roasted: "roasted";
        }>>;
        socialContext: z.ZodOptional<z.ZodString>;
        mealDuration: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    digestion: z.ZodOptional<z.ZodEnum<{
        excellent: "excellent";
        good: "good";
        normal: "normal";
        poor: "poor";
        very_poor: "very_poor";
    }>>;
    energy: z.ZodOptional<z.ZodEnum<{
        low: "low";
        high: "high";
        normal: "normal";
        very_low: "very_low";
        very_high: "very_high";
    }>>;
    photoUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type MealLogContract = z.infer<typeof MealLogSchema>;
export declare const DailyNutritionLogSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    date: z.ZodString;
    timezone: z.ZodString;
    meals: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        mealType: z.ZodEnum<{
            other: "other";
            breakfast: "breakfast";
            lunch: "lunch";
            dinner: "dinner";
            snack: "snack";
            pre_workout: "pre_workout";
            post_workout: "post_workout";
        }>;
        loggedAt: z.ZodString;
        portions: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            foodName: z.ZodString;
            brand: z.ZodOptional<z.ZodString>;
            quantity: z.ZodNumber;
            unit: z.ZodString;
            macros: z.ZodObject<{
                calories: z.ZodNumber;
                protein: z.ZodNumber;
                carbs: z.ZodNumber;
                fat: z.ZodNumber;
                fiber: z.ZodOptional<z.ZodNumber>;
                sugar: z.ZodOptional<z.ZodNumber>;
                sodium: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            photoUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        notes: z.ZodOptional<z.ZodString>;
        hungerLevel: z.ZodOptional<z.ZodNumber>;
        fullnessLevel: z.ZodOptional<z.ZodNumber>;
        mood: z.ZodOptional<z.ZodEnum<{
            very_negative: "very_negative";
            negative: "negative";
            neutral: "neutral";
            positive: "positive";
            very_positive: "very_positive";
        }>>;
        mealContext: z.ZodOptional<z.ZodObject<{
            location: z.ZodOptional<z.ZodEnum<{
                home: "home";
                restaurant: "restaurant";
                work: "work";
                travel: "travel";
                social_event: "social_event";
            }>>;
            preparationMethod: z.ZodOptional<z.ZodEnum<{
                raw: "raw";
                boiled: "boiled";
                fried: "fried";
                baked: "baked";
                grilled: "grilled";
                steamed: "steamed";
                roasted: "roasted";
            }>>;
            socialContext: z.ZodOptional<z.ZodString>;
            mealDuration: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        digestion: z.ZodOptional<z.ZodEnum<{
            excellent: "excellent";
            good: "good";
            normal: "normal";
            poor: "poor";
            very_poor: "very_poor";
        }>>;
        energy: z.ZodOptional<z.ZodEnum<{
            low: "low";
            high: "high";
            normal: "normal";
            very_low: "very_low";
            very_high: "very_high";
        }>>;
        photoUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    totals: z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    hydrationMl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    supplements: z.ZodOptional<z.ZodArray<z.ZodString>>;
    foodEntries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        quantity: z.ZodNumber;
        unit: z.ZodString;
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        loggedAt: z.ZodString;
        consumedAt: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            barcode: "barcode";
            search: "search";
            manual: "manual";
            ai: "ai";
            ai_edited: "ai_edited";
        }>>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        cholesterol: z.ZodOptional<z.ZodNumber>;
        saturatedFat: z.ZodOptional<z.ZodNumber>;
        nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>>;
    isVerified: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type DailyNutritionLogContract = z.infer<typeof DailyNutritionLogSchema>;
/**
 * Request body for adding one or more food entries to an hourly food log bucket.
 * The server owns merge, idempotency, and totals recalculation.
 */
export declare const NutritionFoodEntriesMutationSchema: z.ZodObject<{
    hour: z.ZodNumber;
    entries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        quantity: z.ZodNumber;
        unit: z.ZodString;
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        loggedAt: z.ZodString;
        consumedAt: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            barcode: "barcode";
            search: "search";
            manual: "manual";
            ai: "ai";
            ai_edited: "ai_edited";
        }>>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        cholesterol: z.ZodOptional<z.ZodNumber>;
        saturatedFat: z.ZodOptional<z.ZodNumber>;
        nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    timezone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type NutritionFoodEntriesMutationContract = z.infer<typeof NutritionFoodEntriesMutationSchema>;
export declare const FoodItemSchema: z.ZodObject<{
    name: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    barcode: z.ZodOptional<z.ZodString>;
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    sugar: z.ZodOptional<z.ZodNumber>;
    addedSugar: z.ZodOptional<z.ZodNumber>;
    sugarAlcohols: z.ZodOptional<z.ZodNumber>;
    starch: z.ZodOptional<z.ZodNumber>;
    saturatedFat: z.ZodOptional<z.ZodNumber>;
    transFat: z.ZodOptional<z.ZodNumber>;
    monounsaturatedFat: z.ZodOptional<z.ZodNumber>;
    polyunsaturatedFat: z.ZodOptional<z.ZodNumber>;
    omega3: z.ZodOptional<z.ZodNumber>;
    omega6: z.ZodOptional<z.ZodNumber>;
    cholesterol: z.ZodOptional<z.ZodNumber>;
    vitamins: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    minerals: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    alcohol: z.ZodOptional<z.ZodNumber>;
    caffeine: z.ZodOptional<z.ZodNumber>;
    water: z.ZodOptional<z.ZodNumber>;
    portionWeightG: z.ZodOptional<z.ZodNumber>;
    glycemicIndex: z.ZodOptional<z.ZodNumber>;
    glycemicLoad: z.ZodOptional<z.ZodNumber>;
    foodGroup: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type FoodItem = z.infer<typeof FoodItemSchema>;
/** Backward-compat alias — prefer `FoodItem` for new code. */
export type FoodItemContract = FoodItem;
/**
 * Reusable food data stored in a named meal template.
 * Runtime identifiers and timestamps are regenerated whenever the template is used.
 */
export declare const MealTemplateFoodSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    brand: z.ZodOptional<z.ZodString>;
    barcode: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        barcode: "barcode";
        search: "search";
        manual: "manual";
        ai: "ai";
        ai_edited: "ai_edited";
    }>>;
    sugar: z.ZodOptional<z.ZodNumber>;
    sodium: z.ZodOptional<z.ZodNumber>;
    cholesterol: z.ZodOptional<z.ZodNumber>;
    saturatedFat: z.ZodOptional<z.ZodNumber>;
    nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    quantity: z.ZodNumber;
    unit: z.ZodString;
}, z.core.$strip>;
export type MealTemplateFood = z.infer<typeof MealTemplateFoodSchema>;
export declare const MealTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    foods: z.ZodArray<z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            barcode: "barcode";
            search: "search";
            manual: "manual";
            ai: "ai";
            ai_edited: "ai_edited";
        }>>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        cholesterol: z.ZodOptional<z.ZodNumber>;
        saturatedFat: z.ZodOptional<z.ZodNumber>;
        nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
        name: z.ZodString;
        quantity: z.ZodNumber;
        unit: z.ZodString;
    }, z.core.$strip>>;
    defaultHour: z.ZodNullable<z.ZodNumber>;
    isFavorite: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type MealTemplate = z.infer<typeof MealTemplateSchema>;
export declare const CreateMealTemplateBodySchema: z.ZodObject<{
    name: z.ZodString;
    foods: z.ZodArray<z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            barcode: "barcode";
            search: "search";
            manual: "manual";
            ai: "ai";
            ai_edited: "ai_edited";
        }>>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        cholesterol: z.ZodOptional<z.ZodNumber>;
        saturatedFat: z.ZodOptional<z.ZodNumber>;
        nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
        name: z.ZodString;
        quantity: z.ZodNumber;
        unit: z.ZodString;
    }, z.core.$strip>>;
    defaultHour: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isFavorite: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateMealTemplateBody = z.infer<typeof CreateMealTemplateBodySchema>;
export declare const UpdateMealTemplateBodySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    foods: z.ZodOptional<z.ZodArray<z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            barcode: "barcode";
            search: "search";
            manual: "manual";
            ai: "ai";
            ai_edited: "ai_edited";
        }>>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        cholesterol: z.ZodOptional<z.ZodNumber>;
        saturatedFat: z.ZodOptional<z.ZodNumber>;
        nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
        name: z.ZodString;
        quantity: z.ZodNumber;
        unit: z.ZodString;
    }, z.core.$strip>>>;
    defaultHour: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isFavorite: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateMealTemplateBody = z.infer<typeof UpdateMealTemplateBodySchema>;
export declare const MealTemplateListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    favoritesOnly: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean | undefined, "true" | "false" | undefined>>;
}, z.core.$strip>;
export type MealTemplateListQuery = z.infer<typeof MealTemplateListQuerySchema>;
export declare const MealTemplateListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        userId: z.ZodString;
        name: z.ZodString;
        foods: z.ZodArray<z.ZodObject<{
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            brand: z.ZodOptional<z.ZodString>;
            barcode: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                barcode: "barcode";
                search: "search";
                manual: "manual";
                ai: "ai";
                ai_edited: "ai_edited";
            }>>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
            cholesterol: z.ZodOptional<z.ZodNumber>;
            saturatedFat: z.ZodOptional<z.ZodNumber>;
            nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
            name: z.ZodString;
            quantity: z.ZodNumber;
            unit: z.ZodString;
        }, z.core.$strip>>;
        defaultHour: z.ZodNullable<z.ZodNumber>;
        isFavorite: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type MealTemplateListResponse = z.infer<typeof MealTemplateListResponseSchema>;
export declare const FOOD_CATALOG_PROVIDER: {
    readonly OPEN_FOOD_FACTS: "open_food_facts";
};
export declare const FoodCatalogItemSchema: z.ZodObject<{
    id: z.ZodString;
    provider: z.ZodLiteral<"open_food_facts">;
    name: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    barcode: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    unit: z.ZodString;
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    sugar: z.ZodOptional<z.ZodNumber>;
    sodium: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FoodCatalogItem = z.infer<typeof FoodCatalogItemSchema>;
export declare const FoodCatalogSearchQuerySchema: z.ZodObject<{
    q: z.ZodString;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type FoodCatalogSearchQuery = z.infer<typeof FoodCatalogSearchQuerySchema>;
export declare const FoodCatalogListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        provider: z.ZodLiteral<"open_food_facts">;
        name: z.ZodString;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        quantity: z.ZodNumber;
        unit: z.ZodString;
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        imageUrl: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type FoodCatalogListResponse = z.infer<typeof FoodCatalogListResponseSchema>;
export declare const NutritionFoodEntryMoveBodySchema: z.ZodObject<{
    targetDate: z.ZodString;
    targetHour: z.ZodNumber;
    entry: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        quantity: z.ZodNumber;
        unit: z.ZodString;
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        loggedAt: z.ZodString;
        consumedAt: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            barcode: "barcode";
            search: "search";
            manual: "manual";
            ai: "ai";
            ai_edited: "ai_edited";
        }>>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        cholesterol: z.ZodOptional<z.ZodNumber>;
        saturatedFat: z.ZodOptional<z.ZodNumber>;
        nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    timezone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type NutritionFoodEntryMoveBody = z.infer<typeof NutritionFoodEntryMoveBodySchema>;
export declare const NutritionFoodEntryMoveResponseSchema: z.ZodObject<{
    source: z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        date: z.ZodString;
        timezone: z.ZodString;
        meals: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            mealType: z.ZodEnum<{
                other: "other";
                breakfast: "breakfast";
                lunch: "lunch";
                dinner: "dinner";
                snack: "snack";
                pre_workout: "pre_workout";
                post_workout: "post_workout";
            }>;
            loggedAt: z.ZodString;
            portions: z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                foodName: z.ZodString;
                brand: z.ZodOptional<z.ZodString>;
                quantity: z.ZodNumber;
                unit: z.ZodString;
                macros: z.ZodObject<{
                    calories: z.ZodNumber;
                    protein: z.ZodNumber;
                    carbs: z.ZodNumber;
                    fat: z.ZodNumber;
                    fiber: z.ZodOptional<z.ZodNumber>;
                    sugar: z.ZodOptional<z.ZodNumber>;
                    sodium: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>;
                photoUrl: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodString>;
            hungerLevel: z.ZodOptional<z.ZodNumber>;
            fullnessLevel: z.ZodOptional<z.ZodNumber>;
            mood: z.ZodOptional<z.ZodEnum<{
                very_negative: "very_negative";
                negative: "negative";
                neutral: "neutral";
                positive: "positive";
                very_positive: "very_positive";
            }>>;
            mealContext: z.ZodOptional<z.ZodObject<{
                location: z.ZodOptional<z.ZodEnum<{
                    home: "home";
                    restaurant: "restaurant";
                    work: "work";
                    travel: "travel";
                    social_event: "social_event";
                }>>;
                preparationMethod: z.ZodOptional<z.ZodEnum<{
                    raw: "raw";
                    boiled: "boiled";
                    fried: "fried";
                    baked: "baked";
                    grilled: "grilled";
                    steamed: "steamed";
                    roasted: "roasted";
                }>>;
                socialContext: z.ZodOptional<z.ZodString>;
                mealDuration: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            digestion: z.ZodOptional<z.ZodEnum<{
                excellent: "excellent";
                good: "good";
                normal: "normal";
                poor: "poor";
                very_poor: "very_poor";
            }>>;
            energy: z.ZodOptional<z.ZodEnum<{
                low: "low";
                high: "high";
                normal: "normal";
                very_low: "very_low";
                very_high: "very_high";
            }>>;
            photoUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
        totals: z.ZodObject<{
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        hydrationMl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        supplements: z.ZodOptional<z.ZodArray<z.ZodString>>;
        foodEntries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            quantity: z.ZodNumber;
            unit: z.ZodString;
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            brand: z.ZodOptional<z.ZodString>;
            barcode: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            loggedAt: z.ZodString;
            consumedAt: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                barcode: "barcode";
                search: "search";
                manual: "manual";
                ai: "ai";
                ai_edited: "ai_edited";
            }>>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
            cholesterol: z.ZodOptional<z.ZodNumber>;
            saturatedFat: z.ZodOptional<z.ZodNumber>;
            nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>>;
        isVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    target: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        date: z.ZodString;
        timezone: z.ZodString;
        meals: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            mealType: z.ZodEnum<{
                other: "other";
                breakfast: "breakfast";
                lunch: "lunch";
                dinner: "dinner";
                snack: "snack";
                pre_workout: "pre_workout";
                post_workout: "post_workout";
            }>;
            loggedAt: z.ZodString;
            portions: z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                foodName: z.ZodString;
                brand: z.ZodOptional<z.ZodString>;
                quantity: z.ZodNumber;
                unit: z.ZodString;
                macros: z.ZodObject<{
                    calories: z.ZodNumber;
                    protein: z.ZodNumber;
                    carbs: z.ZodNumber;
                    fat: z.ZodNumber;
                    fiber: z.ZodOptional<z.ZodNumber>;
                    sugar: z.ZodOptional<z.ZodNumber>;
                    sodium: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>;
                photoUrl: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodString>;
            hungerLevel: z.ZodOptional<z.ZodNumber>;
            fullnessLevel: z.ZodOptional<z.ZodNumber>;
            mood: z.ZodOptional<z.ZodEnum<{
                very_negative: "very_negative";
                negative: "negative";
                neutral: "neutral";
                positive: "positive";
                very_positive: "very_positive";
            }>>;
            mealContext: z.ZodOptional<z.ZodObject<{
                location: z.ZodOptional<z.ZodEnum<{
                    home: "home";
                    restaurant: "restaurant";
                    work: "work";
                    travel: "travel";
                    social_event: "social_event";
                }>>;
                preparationMethod: z.ZodOptional<z.ZodEnum<{
                    raw: "raw";
                    boiled: "boiled";
                    fried: "fried";
                    baked: "baked";
                    grilled: "grilled";
                    steamed: "steamed";
                    roasted: "roasted";
                }>>;
                socialContext: z.ZodOptional<z.ZodString>;
                mealDuration: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            digestion: z.ZodOptional<z.ZodEnum<{
                excellent: "excellent";
                good: "good";
                normal: "normal";
                poor: "poor";
                very_poor: "very_poor";
            }>>;
            energy: z.ZodOptional<z.ZodEnum<{
                low: "low";
                high: "high";
                normal: "normal";
                very_low: "very_low";
                very_high: "very_high";
            }>>;
            photoUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
        totals: z.ZodObject<{
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        hydrationMl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        supplements: z.ZodOptional<z.ZodArray<z.ZodString>>;
        foodEntries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            quantity: z.ZodNumber;
            unit: z.ZodString;
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            brand: z.ZodOptional<z.ZodString>;
            barcode: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            loggedAt: z.ZodString;
            consumedAt: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                barcode: "barcode";
                search: "search";
                manual: "manual";
                ai: "ai";
                ai_edited: "ai_edited";
            }>>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
            cholesterol: z.ZodOptional<z.ZodNumber>;
            saturatedFat: z.ZodOptional<z.ZodNumber>;
            nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>>;
        isVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>;
    movedEntry: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        quantity: z.ZodNumber;
        unit: z.ZodString;
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        loggedAt: z.ZodString;
        consumedAt: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            barcode: "barcode";
            search: "search";
            manual: "manual";
            ai: "ai";
            ai_edited: "ai_edited";
        }>>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        cholesterol: z.ZodOptional<z.ZodNumber>;
        saturatedFat: z.ZodOptional<z.ZodNumber>;
        nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type NutritionFoodEntryMoveResponse = z.infer<typeof NutritionFoodEntryMoveResponseSchema>;
export declare const micronutrientsSchema: z.ZodObject<{
    vitaminA: z.ZodOptional<z.ZodNumber>;
    vitaminC: z.ZodOptional<z.ZodNumber>;
    vitaminD: z.ZodOptional<z.ZodNumber>;
    vitaminE: z.ZodOptional<z.ZodNumber>;
    vitaminK: z.ZodOptional<z.ZodNumber>;
    thiamin: z.ZodOptional<z.ZodNumber>;
    riboflavin: z.ZodOptional<z.ZodNumber>;
    niacin: z.ZodOptional<z.ZodNumber>;
    vitaminB6: z.ZodOptional<z.ZodNumber>;
    folate: z.ZodOptional<z.ZodNumber>;
    vitaminB12: z.ZodOptional<z.ZodNumber>;
    biotin: z.ZodOptional<z.ZodNumber>;
    pantothenicAcid: z.ZodOptional<z.ZodNumber>;
    calcium: z.ZodOptional<z.ZodNumber>;
    iron: z.ZodOptional<z.ZodNumber>;
    magnesium: z.ZodOptional<z.ZodNumber>;
    phosphorus: z.ZodOptional<z.ZodNumber>;
    potassium: z.ZodOptional<z.ZodNumber>;
    zinc: z.ZodOptional<z.ZodNumber>;
    copper: z.ZodOptional<z.ZodNumber>;
    manganese: z.ZodOptional<z.ZodNumber>;
    selenium: z.ZodOptional<z.ZodNumber>;
    iodine: z.ZodOptional<z.ZodNumber>;
    chromium: z.ZodOptional<z.ZodNumber>;
    molybdenum: z.ZodOptional<z.ZodNumber>;
    chloride: z.ZodOptional<z.ZodNumber>;
    choline: z.ZodOptional<z.ZodNumber>;
    lycopene: z.ZodOptional<z.ZodNumber>;
    lutein: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type Micronutrients = z.infer<typeof micronutrientsSchema>;
export declare const aiAnalyzedFoodSchema: z.ZodObject<{
    foodName: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    quantity: z.ZodDefault<z.ZodNumber>;
    unit: z.ZodDefault<z.ZodString>;
    macros: z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    micros: z.ZodOptional<z.ZodObject<{
        vitaminA: z.ZodOptional<z.ZodNumber>;
        vitaminC: z.ZodOptional<z.ZodNumber>;
        vitaminD: z.ZodOptional<z.ZodNumber>;
        vitaminE: z.ZodOptional<z.ZodNumber>;
        vitaminK: z.ZodOptional<z.ZodNumber>;
        thiamin: z.ZodOptional<z.ZodNumber>;
        riboflavin: z.ZodOptional<z.ZodNumber>;
        niacin: z.ZodOptional<z.ZodNumber>;
        vitaminB6: z.ZodOptional<z.ZodNumber>;
        folate: z.ZodOptional<z.ZodNumber>;
        vitaminB12: z.ZodOptional<z.ZodNumber>;
        biotin: z.ZodOptional<z.ZodNumber>;
        pantothenicAcid: z.ZodOptional<z.ZodNumber>;
        calcium: z.ZodOptional<z.ZodNumber>;
        iron: z.ZodOptional<z.ZodNumber>;
        magnesium: z.ZodOptional<z.ZodNumber>;
        phosphorus: z.ZodOptional<z.ZodNumber>;
        potassium: z.ZodOptional<z.ZodNumber>;
        zinc: z.ZodOptional<z.ZodNumber>;
        copper: z.ZodOptional<z.ZodNumber>;
        manganese: z.ZodOptional<z.ZodNumber>;
        selenium: z.ZodOptional<z.ZodNumber>;
        iodine: z.ZodOptional<z.ZodNumber>;
        chromium: z.ZodOptional<z.ZodNumber>;
        molybdenum: z.ZodOptional<z.ZodNumber>;
        chloride: z.ZodOptional<z.ZodNumber>;
        choline: z.ZodOptional<z.ZodNumber>;
        lycopene: z.ZodOptional<z.ZodNumber>;
        lutein: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    nutritionQualityIndex: z.ZodNumber;
    confidence: z.ZodNumber;
    reasoning: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AIAnalyzedFood = z.infer<typeof aiAnalyzedFoodSchema>;
export declare const aiAnalysisResultSchema: z.ZodObject<{
    rejected: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    foodName: z.ZodString;
    description: z.ZodString;
    macros: z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    micros: z.ZodOptional<z.ZodObject<{
        vitaminA: z.ZodOptional<z.ZodNumber>;
        vitaminC: z.ZodOptional<z.ZodNumber>;
        vitaminD: z.ZodOptional<z.ZodNumber>;
        vitaminE: z.ZodOptional<z.ZodNumber>;
        vitaminK: z.ZodOptional<z.ZodNumber>;
        thiamin: z.ZodOptional<z.ZodNumber>;
        riboflavin: z.ZodOptional<z.ZodNumber>;
        niacin: z.ZodOptional<z.ZodNumber>;
        vitaminB6: z.ZodOptional<z.ZodNumber>;
        folate: z.ZodOptional<z.ZodNumber>;
        vitaminB12: z.ZodOptional<z.ZodNumber>;
        biotin: z.ZodOptional<z.ZodNumber>;
        pantothenicAcid: z.ZodOptional<z.ZodNumber>;
        calcium: z.ZodOptional<z.ZodNumber>;
        iron: z.ZodOptional<z.ZodNumber>;
        magnesium: z.ZodOptional<z.ZodNumber>;
        phosphorus: z.ZodOptional<z.ZodNumber>;
        potassium: z.ZodOptional<z.ZodNumber>;
        zinc: z.ZodOptional<z.ZodNumber>;
        copper: z.ZodOptional<z.ZodNumber>;
        manganese: z.ZodOptional<z.ZodNumber>;
        selenium: z.ZodOptional<z.ZodNumber>;
        iodine: z.ZodOptional<z.ZodNumber>;
        chromium: z.ZodOptional<z.ZodNumber>;
        molybdenum: z.ZodOptional<z.ZodNumber>;
        chloride: z.ZodOptional<z.ZodNumber>;
        choline: z.ZodOptional<z.ZodNumber>;
        lycopene: z.ZodOptional<z.ZodNumber>;
        lutein: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    nutritionQualityIndex: z.ZodNumber;
    confidence: z.ZodNumber;
    reasoning: z.ZodOptional<z.ZodString>;
    foods: z.ZodOptional<z.ZodArray<z.ZodObject<{
        foodName: z.ZodString;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        quantity: z.ZodDefault<z.ZodNumber>;
        unit: z.ZodDefault<z.ZodString>;
        macros: z.ZodObject<{
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        micros: z.ZodOptional<z.ZodObject<{
            vitaminA: z.ZodOptional<z.ZodNumber>;
            vitaminC: z.ZodOptional<z.ZodNumber>;
            vitaminD: z.ZodOptional<z.ZodNumber>;
            vitaminE: z.ZodOptional<z.ZodNumber>;
            vitaminK: z.ZodOptional<z.ZodNumber>;
            thiamin: z.ZodOptional<z.ZodNumber>;
            riboflavin: z.ZodOptional<z.ZodNumber>;
            niacin: z.ZodOptional<z.ZodNumber>;
            vitaminB6: z.ZodOptional<z.ZodNumber>;
            folate: z.ZodOptional<z.ZodNumber>;
            vitaminB12: z.ZodOptional<z.ZodNumber>;
            biotin: z.ZodOptional<z.ZodNumber>;
            pantothenicAcid: z.ZodOptional<z.ZodNumber>;
            calcium: z.ZodOptional<z.ZodNumber>;
            iron: z.ZodOptional<z.ZodNumber>;
            magnesium: z.ZodOptional<z.ZodNumber>;
            phosphorus: z.ZodOptional<z.ZodNumber>;
            potassium: z.ZodOptional<z.ZodNumber>;
            zinc: z.ZodOptional<z.ZodNumber>;
            copper: z.ZodOptional<z.ZodNumber>;
            manganese: z.ZodOptional<z.ZodNumber>;
            selenium: z.ZodOptional<z.ZodNumber>;
            iodine: z.ZodOptional<z.ZodNumber>;
            chromium: z.ZodOptional<z.ZodNumber>;
            molybdenum: z.ZodOptional<z.ZodNumber>;
            chloride: z.ZodOptional<z.ZodNumber>;
            choline: z.ZodOptional<z.ZodNumber>;
            lycopene: z.ZodOptional<z.ZodNumber>;
            lutein: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        nutritionQualityIndex: z.ZodNumber;
        confidence: z.ZodNumber;
        reasoning: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type AIAnalysisResult = z.infer<typeof aiAnalysisResultSchema>;
/** @deprecated Use NutritionMacroBreakdownSchema instead. Remove after 2026-05-01 */
export declare const macrosSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fat: z.ZodNumber;
    fiber: z.ZodOptional<z.ZodNumber>;
    sugar: z.ZodOptional<z.ZodNumber>;
    sodium: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/** @deprecated Use MealContextSchema instead. Remove after 2026-05-01 */
export declare const mealContextSchema: z.ZodObject<{
    location: z.ZodOptional<z.ZodEnum<{
        home: "home";
        restaurant: "restaurant";
        work: "work";
        travel: "travel";
        social_event: "social_event";
    }>>;
    preparationMethod: z.ZodOptional<z.ZodEnum<{
        raw: "raw";
        boiled: "boiled";
        fried: "fried";
        baked: "baked";
        grilled: "grilled";
        steamed: "steamed";
        roasted: "roasted";
    }>>;
    socialContext: z.ZodOptional<z.ZodString>;
    mealDuration: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/** @deprecated Use DailyNutritionLogSchema instead. Remove after 2026-05-01 */
export declare const dailyNutritionLogSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    date: z.ZodString;
    timezone: z.ZodString;
    meals: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        mealType: z.ZodEnum<{
            other: "other";
            breakfast: "breakfast";
            lunch: "lunch";
            dinner: "dinner";
            snack: "snack";
            pre_workout: "pre_workout";
            post_workout: "post_workout";
        }>;
        loggedAt: z.ZodString;
        portions: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            foodName: z.ZodString;
            brand: z.ZodOptional<z.ZodString>;
            quantity: z.ZodNumber;
            unit: z.ZodString;
            macros: z.ZodObject<{
                calories: z.ZodNumber;
                protein: z.ZodNumber;
                carbs: z.ZodNumber;
                fat: z.ZodNumber;
                fiber: z.ZodOptional<z.ZodNumber>;
                sugar: z.ZodOptional<z.ZodNumber>;
                sodium: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            photoUrl: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        notes: z.ZodOptional<z.ZodString>;
        hungerLevel: z.ZodOptional<z.ZodNumber>;
        fullnessLevel: z.ZodOptional<z.ZodNumber>;
        mood: z.ZodOptional<z.ZodEnum<{
            very_negative: "very_negative";
            negative: "negative";
            neutral: "neutral";
            positive: "positive";
            very_positive: "very_positive";
        }>>;
        mealContext: z.ZodOptional<z.ZodObject<{
            location: z.ZodOptional<z.ZodEnum<{
                home: "home";
                restaurant: "restaurant";
                work: "work";
                travel: "travel";
                social_event: "social_event";
            }>>;
            preparationMethod: z.ZodOptional<z.ZodEnum<{
                raw: "raw";
                boiled: "boiled";
                fried: "fried";
                baked: "baked";
                grilled: "grilled";
                steamed: "steamed";
                roasted: "roasted";
            }>>;
            socialContext: z.ZodOptional<z.ZodString>;
            mealDuration: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        digestion: z.ZodOptional<z.ZodEnum<{
            excellent: "excellent";
            good: "good";
            normal: "normal";
            poor: "poor";
            very_poor: "very_poor";
        }>>;
        energy: z.ZodOptional<z.ZodEnum<{
            low: "low";
            high: "high";
            normal: "normal";
            very_low: "very_low";
            very_high: "very_high";
        }>>;
        photoUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    totals: z.ZodObject<{
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    hydrationMl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    supplements: z.ZodOptional<z.ZodArray<z.ZodString>>;
    foodEntries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        quantity: z.ZodNumber;
        unit: z.ZodString;
        calories: z.ZodNumber;
        protein: z.ZodNumber;
        carbs: z.ZodNumber;
        fat: z.ZodNumber;
        fiber: z.ZodOptional<z.ZodNumber>;
        brand: z.ZodOptional<z.ZodString>;
        barcode: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        loggedAt: z.ZodString;
        consumedAt: z.ZodOptional<z.ZodString>;
        source: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            barcode: "barcode";
            search: "search";
            manual: "manual";
            ai: "ai";
            ai_edited: "ai_edited";
        }>>;
        sugar: z.ZodOptional<z.ZodNumber>;
        sodium: z.ZodOptional<z.ZodNumber>;
        cholesterol: z.ZodOptional<z.ZodNumber>;
        saturatedFat: z.ZodOptional<z.ZodNumber>;
        nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>>;
    isVerified: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
/**
 * Canonical paginated nutrition list response: { data, pagination }
 */
export declare const nutritionListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        date: z.ZodString;
        timezone: z.ZodString;
        meals: z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            mealType: z.ZodEnum<{
                other: "other";
                breakfast: "breakfast";
                lunch: "lunch";
                dinner: "dinner";
                snack: "snack";
                pre_workout: "pre_workout";
                post_workout: "post_workout";
            }>;
            loggedAt: z.ZodString;
            portions: z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodString>;
                foodName: z.ZodString;
                brand: z.ZodOptional<z.ZodString>;
                quantity: z.ZodNumber;
                unit: z.ZodString;
                macros: z.ZodObject<{
                    calories: z.ZodNumber;
                    protein: z.ZodNumber;
                    carbs: z.ZodNumber;
                    fat: z.ZodNumber;
                    fiber: z.ZodOptional<z.ZodNumber>;
                    sugar: z.ZodOptional<z.ZodNumber>;
                    sodium: z.ZodOptional<z.ZodNumber>;
                }, z.core.$strip>;
                photoUrl: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            notes: z.ZodOptional<z.ZodString>;
            hungerLevel: z.ZodOptional<z.ZodNumber>;
            fullnessLevel: z.ZodOptional<z.ZodNumber>;
            mood: z.ZodOptional<z.ZodEnum<{
                very_negative: "very_negative";
                negative: "negative";
                neutral: "neutral";
                positive: "positive";
                very_positive: "very_positive";
            }>>;
            mealContext: z.ZodOptional<z.ZodObject<{
                location: z.ZodOptional<z.ZodEnum<{
                    home: "home";
                    restaurant: "restaurant";
                    work: "work";
                    travel: "travel";
                    social_event: "social_event";
                }>>;
                preparationMethod: z.ZodOptional<z.ZodEnum<{
                    raw: "raw";
                    boiled: "boiled";
                    fried: "fried";
                    baked: "baked";
                    grilled: "grilled";
                    steamed: "steamed";
                    roasted: "roasted";
                }>>;
                socialContext: z.ZodOptional<z.ZodString>;
                mealDuration: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            digestion: z.ZodOptional<z.ZodEnum<{
                excellent: "excellent";
                good: "good";
                normal: "normal";
                poor: "poor";
                very_poor: "very_poor";
            }>>;
            energy: z.ZodOptional<z.ZodEnum<{
                low: "low";
                high: "high";
                normal: "normal";
                very_low: "very_low";
                very_high: "very_high";
            }>>;
            photoUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
        totals: z.ZodObject<{
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        hydrationMl: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        supplements: z.ZodOptional<z.ZodArray<z.ZodString>>;
        foodEntries: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            quantity: z.ZodNumber;
            unit: z.ZodString;
            calories: z.ZodNumber;
            protein: z.ZodNumber;
            carbs: z.ZodNumber;
            fat: z.ZodNumber;
            fiber: z.ZodOptional<z.ZodNumber>;
            brand: z.ZodOptional<z.ZodString>;
            barcode: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            loggedAt: z.ZodString;
            consumedAt: z.ZodOptional<z.ZodString>;
            source: z.ZodOptional<z.ZodEnum<{
                custom: "custom";
                barcode: "barcode";
                search: "search";
                manual: "manual";
                ai: "ai";
                ai_edited: "ai_edited";
            }>>;
            sugar: z.ZodOptional<z.ZodNumber>;
            sodium: z.ZodOptional<z.ZodNumber>;
            cholesterol: z.ZodOptional<z.ZodNumber>;
            saturatedFat: z.ZodOptional<z.ZodNumber>;
            nutritionQualityIndex: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>>;
        isVerified: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type NutritionListResponse = z.infer<typeof nutritionListResponseSchema>;
/**
 * Sum macros across an array of portions.
 */
export declare const sumMacros: (portions: NutritionPortionContract[]) => NutritionMacroBreakdown;
/**
 * Aggregate daily totals across an array of meals.
 */
export declare const aggregateDailyTotals: (meals: MealLogContract[]) => NutritionMacroBreakdown;
export declare const createMockNutritionMacroBreakdown: (overrides?: Partial<NutritionMacroBreakdown>) => NutritionMacroBreakdown;
export declare const createMockMealLog: (overrides?: Partial<MealLogContract>) => MealLogContract;
export declare const createMockNutritionPortion: (overrides?: Partial<NutritionPortionContract>) => NutritionPortionContract;
/**
 * Zod schema for the quick calorie-logging form (log-calories modal).
 * Validates PHI nutrition inputs before they are sent to the API.
 *
 * Bounds match the manual validation enforced in the submit handler:
 *   - totalCalories: integer, 0–10 000 kcal
 *   - protein / carbs / fat: optional grams, 0–500 g
 */
export declare const calorieEntryFormSchema: z.ZodObject<{
    totalCalories: z.ZodNumber;
    protein: z.ZodOptional<z.ZodNumber>;
    carbs: z.ZodOptional<z.ZodNumber>;
    fat: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CalorieEntryFormInput = z.infer<typeof calorieEntryFormSchema>;
/**
 * Zod schema for per-day macro targets in the NutritionPlanBuilder form.
 * Validates PHI nutrition plan inputs before submission.
 *
 * Bounds mirror MACRO_LIMITS in NutritionPlanBuilder.tsx:
 *   - calories: integer, 0–10 000 kcal
 *   - protein / carbs / fats: 0–1 000 g
 */
export declare const nutritionDayTargetSchema: z.ZodObject<{
    calories: z.ZodNumber;
    protein: z.ZodNumber;
    carbs: z.ZodNumber;
    fats: z.ZodNumber;
}, z.core.$strip>;
export type NutritionDayTarget = z.infer<typeof nutritionDayTargetSchema>;
/**
 * Zod schema for NutritionPlanBuilder form-level fields.
 * Validates customPrompt to enforce a max-length contract and mitigate
 * prompt-injection risk (defence-in-depth alongside the textarea maxLength).
 */
export declare const nutritionPlanFormSchema: z.ZodObject<{
    customPrompt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type NutritionPlanFormInput = z.infer<typeof nutritionPlanFormSchema>;
export declare const createMockDailyNutritionLog: (overrides?: Partial<DailyNutritionLogContract>) => DailyNutritionLogContract;
//# sourceMappingURL=nutrition.d.ts.map