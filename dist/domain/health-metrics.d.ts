/**
 * @ai-context Health Metrics Unified Exports | centralized health metric types, utilities, and schemas
 *
 * This module provides a unified export surface for health metric functionality,
 * including contract types for health progress, goals, wearables, and daily summaries.
 *
 * NOTE: GoalMetricKey and the static GOAL_METRIC_DEFINITIONS registry were removed in
 * Phase 6 of the Unified MetricDefinition Migration. Metric identity is now authoritative
 * in the MetricDefinition database table. All metric fields that previously used
 * GoalMetricKey now use string.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
export { getDataPointWeight, SOURCE_WEIGHTS, VERIFICATION_MULTIPLIER } from "./health-progress.js";
/**
 * @deprecated Post-migration, reference ranges live in MetricDefinition records.
 * Use metricDefinitionLookup.getReferenceRanges(code) instead.
 * @returns null (no static ranges available)
 */
export declare function getDefaultReferenceRange(_metricKey: string): {
    low: number;
    high: number;
} | null;
/**
 * Calculate a 0-100 score for how close a value is to the desired range.
 * 100 = centered in range, ~80 at the edges, tapering to 0 as it deviates.
 *
 * @param value - The current value
 * @param rangeLow - Low end of reference range
 * @param rangeHigh - High end of reference range
 * @returns Score from 0-100
 */
export declare function calculateInRangeScore(value: number, rangeLow: number | null, rangeHigh: number | null): number;
/**
 * Tracks change in a single health metric over a period.
 * The metric field is a string (MetricDefinition.code) post-migration.
 */
export type MetricChange = z.infer<typeof MetricChangeSchema>;
export declare const MetricChangeSchema: z.ZodObject<{
    metric: z.ZodString;
    unit: z.ZodString;
    startValue: z.ZodNullable<z.ZodNumber>;
    endValue: z.ZodNullable<z.ZodNumber>;
    percentChange: z.ZodNullable<z.ZodNumber>;
    trend: z.ZodEnum<{
        improving: "improving";
        stable: "stable";
        declining: "declining";
    }>;
    isWithinNormalRange: z.ZodBoolean;
    dataConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    inRangeScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
/**
 * Area of concern showing which metrics have declining patients.
 */
export type ConcernArea = z.infer<typeof ConcernAreaSchema>;
export declare const ConcernAreaSchema: z.ZodObject<{
    metric: z.ZodString;
    patientsDeclined: z.ZodNumber;
}, z.core.$strip>;
/**
 * Metric with average change across patients.
 */
export type MetricAggregate = z.infer<typeof MetricAggregateSchema>;
export declare const MetricAggregateSchema: z.ZodObject<{
    metric: z.ZodString;
    avgChange: z.ZodNumber;
}, z.core.$strip>;
/**
 * Point on the health improvement sparkline.
 */
export type HealthImprovementPoint = z.infer<typeof HealthImprovementPointSchema>;
export declare const HealthImprovementPointSchema: z.ZodObject<{
    date: z.ZodString;
    percentChange: z.ZodNumber;
    score: z.ZodNumber;
}, z.core.$strip>;
/**
 * Lightweight view for monthly improvement badge.
 */
export type HealthProgressImprovement = z.infer<typeof HealthProgressImprovementSchema>;
export declare const HealthProgressImprovementSchema: z.ZodObject<{
    periodDays: z.ZodNumber;
    startScore: z.ZodNullable<z.ZodNumber>;
    endScore: z.ZodNullable<z.ZodNumber>;
    percentChange: z.ZodNullable<z.ZodNumber>;
    points: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        percentChange: z.ZodNumber;
        score: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Aggregate health progress view for admin dashboard.
 */
export type HealthProgressOverview = z.infer<typeof HealthProgressOverviewSchema>;
export declare const HealthProgressOverviewSchema: z.ZodObject<{
    totalPatients: z.ZodNumber;
    improving: z.ZodNumber;
    stable: z.ZodNumber;
    declining: z.ZodNumber;
    avgScore: z.ZodNumber;
    topImprovingMetrics: z.ZodArray<z.ZodObject<{
        metric: z.ZodString;
        avgChange: z.ZodNumber;
    }, z.core.$strip>>;
    concernAreas: z.ZodArray<z.ZodObject<{
        metric: z.ZodString;
        patientsDeclined: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Historical snapshot of health progress for a user.
 */
export type HealthProgressSnapshot = z.infer<typeof HealthProgressSnapshotSchema>;
export declare const HealthProgressSnapshotSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    calculatedAt: z.ZodString;
    periodMonths: z.ZodNumber;
    overallScore: z.ZodNumber;
    overallTrend: z.ZodEnum<{
        improving: "improving";
        stable: "stable";
        declining: "declining";
    }>;
    dataConfidence: z.ZodNullable<z.ZodNumber>;
    categoryScores: z.ZodObject<{
        body_composition: z.ZodNumber;
        cardiovascular: z.ZodNumber;
        metabolic: z.ZodNumber;
        hormonal: z.ZodNumber;
        performance: z.ZodNumber;
        hematology: z.ZodNumber;
        inflammatory: z.ZodNumber;
        nutritional: z.ZodNumber;
    }, z.core.$strip>;
    metricChanges: z.ZodArray<z.ZodObject<{
        metric: z.ZodString;
        unit: z.ZodString;
        startValue: z.ZodNullable<z.ZodNumber>;
        endValue: z.ZodNullable<z.ZodNumber>;
        percentChange: z.ZodNullable<z.ZodNumber>;
        trend: z.ZodEnum<{
            improving: "improving";
            stable: "stable";
            declining: "declining";
        }>;
        isWithinNormalRange: z.ZodBoolean;
        dataConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        inRangeScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Complete health progress report for a single patient over a time period.
 */
export type PatientHealthProgress = z.infer<typeof PatientHealthProgressSchema>;
export declare const PatientHealthProgressSchema: z.ZodObject<{
    patientId: z.ZodString;
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    overallTrend: z.ZodEnum<{
        improving: "improving";
        stable: "stable";
        declining: "declining";
    }>;
    overallScore: z.ZodNumber;
    categoryScores: z.ZodObject<{
        body_composition: z.ZodNumber;
        cardiovascular: z.ZodNumber;
        metabolic: z.ZodNumber;
        hormonal: z.ZodNumber;
        performance: z.ZodNumber;
        hematology: z.ZodNumber;
        inflammatory: z.ZodNumber;
        nutritional: z.ZodNumber;
    }, z.core.$strip>;
    metricChanges: z.ZodArray<z.ZodObject<{
        metric: z.ZodString;
        unit: z.ZodString;
        startValue: z.ZodNullable<z.ZodNumber>;
        endValue: z.ZodNullable<z.ZodNumber>;
        percentChange: z.ZodNullable<z.ZodNumber>;
        trend: z.ZodEnum<{
            improving: "improving";
            stable: "stable";
            declining: "declining";
        }>;
        isWithinNormalRange: z.ZodBoolean;
        dataConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        inRangeScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>;
    dataQuality: z.ZodEnum<{
        sufficient: "sufficient";
        sparse: "sparse";
        insufficient: "insufficient";
    }>;
    overallDataConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    monthlyImprovement: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        periodDays: z.ZodNumber;
        startScore: z.ZodNullable<z.ZodNumber>;
        endScore: z.ZodNullable<z.ZodNumber>;
        percentChange: z.ZodNullable<z.ZodNumber>;
        points: z.ZodArray<z.ZodObject<{
            date: z.ZodString;
            percentChange: z.ZodNumber;
            score: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/**
 * Patient context for clinical reference range lookup.
 */
export type PatientClinicalContext = z.infer<typeof PatientClinicalContextSchema>;
export declare const PatientClinicalContextSchema: z.ZodObject<{
    sex: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        female: "female";
        male: "male";
        non_binary: "non_binary";
        intersex: "intersex";
        prefer_not_to_say: "prefer_not_to_say";
    }>>>;
    age: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    pregnancyStatus: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RangeDerivationStep = z.infer<typeof RangeDerivationStepSchema>;
export type RangeDerivationModifier = z.infer<typeof RangeDerivationModifierSchema>;
export type RangeDerivation = z.infer<typeof RangeDerivationSchema>;
export declare const RangeDerivationStepSchema: z.ZodObject<{
    step: z.ZodString;
    modifier: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    minBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    maxBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minAfter: z.ZodNumber;
    maxAfter: z.ZodNumber;
}, z.core.$strip>;
export declare const RangeDerivationModifierSchema: z.ZodObject<{
    type: z.ZodString;
    value: z.ZodString;
    logicType: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const RangeDerivationSchema: z.ZodObject<{
    source: z.ZodNullable<z.ZodString>;
    appliedModifiers: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        value: z.ZodString;
        logicType: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    steps: z.ZodArray<z.ZodObject<{
        step: z.ZodString;
        modifier: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        maxBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minAfter: z.ZodNumber;
        maxAfter: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const HealthMetricGoalSchema: z.ZodObject<{
    metric: z.ZodString;
    targetValue: z.ZodNullable<z.ZodNumber>;
    targetDirection: z.ZodEnum<{
        lower_better: "lower_better";
        higher_better: "higher_better";
        context: "context";
    }>;
    referenceRangeLow: z.ZodNullable<z.ZodNumber>;
    referenceRangeHigh: z.ZodNullable<z.ZodNumber>;
    defaultReferenceRangeLow: z.ZodNullable<z.ZodNumber>;
    defaultReferenceRangeHigh: z.ZodNullable<z.ZodNumber>;
    labReferenceRangeLow: z.ZodNullable<z.ZodNumber>;
    labReferenceRangeHigh: z.ZodNullable<z.ZodNumber>;
    isCustom: z.ZodBoolean;
    setById: z.ZodNullable<z.ZodString>;
    currentValue: z.ZodNullable<z.ZodNumber>;
    currentValueDate: z.ZodNullable<z.ZodString>;
    currentValueUnit: z.ZodNullable<z.ZodString>;
    needsTargetSetting: z.ZodBoolean;
    hasMissingRange: z.ZodBoolean;
    isDerivedRange: z.ZodBoolean;
    isPregnancyAdjusted: z.ZodBoolean;
    rangeSource: z.ZodEnum<{
        custom: "custom";
        lab: "lab";
        guideline: "guideline";
        derived: "derived";
        missing: "missing";
        "dynamic-db": "dynamic-db";
    }>;
    rangeDerivation: z.ZodNullable<z.ZodObject<{
        source: z.ZodNullable<z.ZodString>;
        appliedModifiers: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            value: z.ZodString;
            logicType: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        steps: z.ZodArray<z.ZodObject<{
            step: z.ZodString;
            modifier: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            minBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            maxBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minAfter: z.ZodNumber;
            maxAfter: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    metricDefinition: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        displayName: z.ZodString;
        primaryUnit: z.ZodString;
        trendDirection: z.ZodNullable<z.ZodEnum<{
            HIGHER_BETTER: "HIGHER_BETTER";
            LOWER_BETTER: "LOWER_BETTER";
            TARGET_BETTER: "TARGET_BETTER";
        }>>;
        category: z.ZodEnum<{
            LAB: "LAB";
            EXERCISE: "EXERCISE";
            BIOMETRIC: "BIOMETRIC";
            NUTRITION: "NUTRITION";
            WEARABLE: "WEARABLE";
            COMPUTED: "COMPUTED";
        }>;
        healthCategory: z.ZodNullable<z.ZodString>;
        description: z.ZodNullable<z.ZodString>;
        goalEligible: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type HealthMetricGoal = z.infer<typeof HealthMetricGoalSchema>;
/** Health metric goal with clinician overrides, guideline defaults, and range derivation. */
export type HealthMetricGoalContract = z.infer<typeof HealthMetricGoalSchema>;
export declare const HealthMetricGoalUpsertSchema: z.ZodObject<{
    targetValue: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    targetDirection: z.ZodOptional<z.ZodEnum<{
        lower_better: "lower_better";
        higher_better: "higher_better";
        context: "context";
    }>>;
    referenceRangeLow: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    referenceRangeHigh: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
export type HealthMetricGoalUpsert = z.infer<typeof HealthMetricGoalUpsertSchema>;
/**
 * Canonical paginated health goals list payload: { data, pagination }
 */
export declare const healthGoalsListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        metric: z.ZodString;
        targetValue: z.ZodNullable<z.ZodNumber>;
        targetDirection: z.ZodEnum<{
            lower_better: "lower_better";
            higher_better: "higher_better";
            context: "context";
        }>;
        referenceRangeLow: z.ZodNullable<z.ZodNumber>;
        referenceRangeHigh: z.ZodNullable<z.ZodNumber>;
        defaultReferenceRangeLow: z.ZodNullable<z.ZodNumber>;
        defaultReferenceRangeHigh: z.ZodNullable<z.ZodNumber>;
        labReferenceRangeLow: z.ZodNullable<z.ZodNumber>;
        labReferenceRangeHigh: z.ZodNullable<z.ZodNumber>;
        isCustom: z.ZodBoolean;
        setById: z.ZodNullable<z.ZodString>;
        currentValue: z.ZodNullable<z.ZodNumber>;
        currentValueDate: z.ZodNullable<z.ZodString>;
        currentValueUnit: z.ZodNullable<z.ZodString>;
        needsTargetSetting: z.ZodBoolean;
        hasMissingRange: z.ZodBoolean;
        isDerivedRange: z.ZodBoolean;
        isPregnancyAdjusted: z.ZodBoolean;
        rangeSource: z.ZodEnum<{
            custom: "custom";
            lab: "lab";
            guideline: "guideline";
            derived: "derived";
            missing: "missing";
            "dynamic-db": "dynamic-db";
        }>;
        rangeDerivation: z.ZodNullable<z.ZodObject<{
            source: z.ZodNullable<z.ZodString>;
            appliedModifiers: z.ZodArray<z.ZodObject<{
                type: z.ZodString;
                value: z.ZodString;
                logicType: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            steps: z.ZodArray<z.ZodObject<{
                step: z.ZodString;
                modifier: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                minBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                maxBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minAfter: z.ZodNumber;
                maxAfter: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        metricDefinition: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            displayName: z.ZodString;
            primaryUnit: z.ZodString;
            trendDirection: z.ZodNullable<z.ZodEnum<{
                HIGHER_BETTER: "HIGHER_BETTER";
                LOWER_BETTER: "LOWER_BETTER";
                TARGET_BETTER: "TARGET_BETTER";
            }>>;
            category: z.ZodEnum<{
                LAB: "LAB";
                EXERCISE: "EXERCISE";
                BIOMETRIC: "BIOMETRIC";
                NUTRITION: "NUTRITION";
                WEARABLE: "WEARABLE";
                COMPUTED: "COMPUTED";
            }>;
            healthCategory: z.ZodNullable<z.ZodString>;
            description: z.ZodNullable<z.ZodString>;
            goalEligible: z.ZodBoolean;
        }, z.core.$strip>>;
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
export type HealthGoalsListResponse = z.infer<typeof healthGoalsListResponseSchema>;
export declare const WearablesDataSchema: z.ZodObject<{
    steps: z.ZodOptional<z.ZodNumber>;
    sleepHours: z.ZodOptional<z.ZodNumber>;
    deepSleepPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lightSleepPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    remSleepPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    awakeMinutes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    restingHeartRate: z.ZodOptional<z.ZodNumber>;
    activeCalories: z.ZodOptional<z.ZodNumber>;
    flightsClimbed: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    heartRateVariability: z.ZodOptional<z.ZodNumber>;
    hrvSdnn: z.ZodOptional<z.ZodNumber>;
    oxygenSaturation: z.ZodOptional<z.ZodNumber>;
    respiratoryRate: z.ZodOptional<z.ZodNumber>;
    source: z.ZodOptional<z.ZodEnum<{
        LAB_REPORT: "LAB_REPORT";
        CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
        DERIVED: "DERIVED";
        APPLE_HEALTH: "APPLE_HEALTH";
        USER_LOG: "USER_LOG";
        GOOGLE_FIT: "GOOGLE_FIT";
        OURA: "OURA";
        WHOOP: "WHOOP";
        DEVICE: "DEVICE";
    }>>;
    isVerified: z.ZodBoolean;
    syncedAt: z.ZodOptional<z.ZodString>;
    rawSources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        source: z.ZodEnum<{
            LAB_REPORT: "LAB_REPORT";
            CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
            DERIVED: "DERIVED";
            APPLE_HEALTH: "APPLE_HEALTH";
            USER_LOG: "USER_LOG";
            GOOGLE_FIT: "GOOGLE_FIT";
            OURA: "OURA";
            WHOOP: "WHOOP";
            DEVICE: "DEVICE";
        }>;
        data: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>>;
        isVerified: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type WearablesData = z.infer<typeof WearablesDataSchema>;
export type WearablesDataContract = z.infer<typeof WearablesDataSchema>;
/**
 * Daily summary aggregating wearables, nutrition, journal, metrics, and documents.
 */
export declare const DailySummarySchema: z.ZodObject<{
    date: z.ZodString;
    userId: z.ZodString;
    wearables: z.ZodObject<{
        steps: z.ZodOptional<z.ZodNumber>;
        sleepHours: z.ZodOptional<z.ZodNumber>;
        deepSleepPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        lightSleepPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        remSleepPercent: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        awakeMinutes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        restingHeartRate: z.ZodOptional<z.ZodNumber>;
        activeCalories: z.ZodOptional<z.ZodNumber>;
        flightsClimbed: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        heartRateVariability: z.ZodOptional<z.ZodNumber>;
        hrvSdnn: z.ZodOptional<z.ZodNumber>;
        oxygenSaturation: z.ZodOptional<z.ZodNumber>;
        respiratoryRate: z.ZodOptional<z.ZodNumber>;
        source: z.ZodOptional<z.ZodEnum<{
            LAB_REPORT: "LAB_REPORT";
            CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
            DERIVED: "DERIVED";
            APPLE_HEALTH: "APPLE_HEALTH";
            USER_LOG: "USER_LOG";
            GOOGLE_FIT: "GOOGLE_FIT";
            OURA: "OURA";
            WHOOP: "WHOOP";
            DEVICE: "DEVICE";
        }>>;
        isVerified: z.ZodBoolean;
        syncedAt: z.ZodOptional<z.ZodString>;
        rawSources: z.ZodOptional<z.ZodArray<z.ZodObject<{
            source: z.ZodEnum<{
                LAB_REPORT: "LAB_REPORT";
                CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
                DERIVED: "DERIVED";
                APPLE_HEALTH: "APPLE_HEALTH";
                USER_LOG: "USER_LOG";
                GOOGLE_FIT: "GOOGLE_FIT";
                OURA: "OURA";
                WHOOP: "WHOOP";
                DEVICE: "DEVICE";
            }>;
            data: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>>;
            isVerified: z.ZodBoolean;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
    nutrition: z.ZodObject<{
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
    journal: z.ZodOptional<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        entryDate: z.ZodString;
        content: z.ZodString;
        mood: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            very_negative: "very_negative";
            negative: "negative";
            neutral: "neutral";
            positive: "positive";
            very_positive: "very_positive";
        }>>>>;
        energy: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            low: "low";
            high: "high";
            medium: "medium";
            very_low: "very_low";
            very_high: "very_high";
        }>>>>;
        stressLevel: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        planAdherence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        motivation: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        aiAssessment: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            summary: z.ZodString;
            themes: z.ZodArray<z.ZodString>;
            sentimentScore: z.ZodNumber;
            recommendedActions: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>>;
        attachments: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    }, z.core.$strip>>;
    metrics: z.ZodOptional<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        date: z.ZodString;
        tdeeEstimate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        tdeeConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        recoveryScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        trainingLoad: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        strainDelta: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sleepScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        readinessScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        caloricBalance: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        acuteChronicRatio: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        notes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        recommendations: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    documents: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        category: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        uploadedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type DailySummaryContract = z.infer<typeof DailySummarySchema>;
/**
 * Unified summary row for a single tracked metric.
 * Merges MetricDefinition metadata, the latest reading, optional goal data,
 * and a simple two-point trend into one response item for admin UI consumption.
 *
 * Used by: GET /api/admin/patients/:userId/health-metrics/summary
 */
export declare const HealthMetricSummarySchema: z.ZodObject<{
    metricCode: z.ZodString;
    metricDefinitionId: z.ZodString;
    displayName: z.ZodString;
    primaryUnit: z.ZodString;
    healthCategory: z.ZodNullable<z.ZodString>;
    category: z.ZodString;
    goalEligible: z.ZodBoolean;
    trendDirection: z.ZodNullable<z.ZodEnum<{
        lower_better: "lower_better";
        higher_better: "higher_better";
        context: "context";
    }>>;
    currentValue: z.ZodNullable<z.ZodNumber>;
    currentValueDate: z.ZodNullable<z.ZodString>;
    currentValueUnit: z.ZodNullable<z.ZodString>;
    currentValueSource: z.ZodNullable<z.ZodString>;
    goalData: z.ZodNullable<z.ZodObject<{
        metric: z.ZodString;
        targetValue: z.ZodNullable<z.ZodNumber>;
        targetDirection: z.ZodEnum<{
            lower_better: "lower_better";
            higher_better: "higher_better";
            context: "context";
        }>;
        referenceRangeLow: z.ZodNullable<z.ZodNumber>;
        referenceRangeHigh: z.ZodNullable<z.ZodNumber>;
        defaultReferenceRangeLow: z.ZodNullable<z.ZodNumber>;
        defaultReferenceRangeHigh: z.ZodNullable<z.ZodNumber>;
        labReferenceRangeLow: z.ZodNullable<z.ZodNumber>;
        labReferenceRangeHigh: z.ZodNullable<z.ZodNumber>;
        isCustom: z.ZodBoolean;
        setById: z.ZodNullable<z.ZodString>;
        currentValue: z.ZodNullable<z.ZodNumber>;
        currentValueDate: z.ZodNullable<z.ZodString>;
        currentValueUnit: z.ZodNullable<z.ZodString>;
        needsTargetSetting: z.ZodBoolean;
        hasMissingRange: z.ZodBoolean;
        isDerivedRange: z.ZodBoolean;
        isPregnancyAdjusted: z.ZodBoolean;
        rangeSource: z.ZodEnum<{
            custom: "custom";
            lab: "lab";
            guideline: "guideline";
            derived: "derived";
            missing: "missing";
            "dynamic-db": "dynamic-db";
        }>;
        rangeDerivation: z.ZodNullable<z.ZodObject<{
            source: z.ZodNullable<z.ZodString>;
            appliedModifiers: z.ZodArray<z.ZodObject<{
                type: z.ZodString;
                value: z.ZodString;
                logicType: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            steps: z.ZodArray<z.ZodObject<{
                step: z.ZodString;
                modifier: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                minBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                maxBefore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minAfter: z.ZodNumber;
                maxAfter: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        metricDefinition: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            displayName: z.ZodString;
            primaryUnit: z.ZodString;
            trendDirection: z.ZodNullable<z.ZodEnum<{
                HIGHER_BETTER: "HIGHER_BETTER";
                LOWER_BETTER: "LOWER_BETTER";
                TARGET_BETTER: "TARGET_BETTER";
            }>>;
            category: z.ZodEnum<{
                LAB: "LAB";
                EXERCISE: "EXERCISE";
                BIOMETRIC: "BIOMETRIC";
                NUTRITION: "NUTRITION";
                WEARABLE: "WEARABLE";
                COMPUTED: "COMPUTED";
            }>;
            healthCategory: z.ZodNullable<z.ZodString>;
            description: z.ZodNullable<z.ZodString>;
            goalEligible: z.ZodBoolean;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    recentTrend: z.ZodNullable<z.ZodEnum<{
        improving: "improving";
        stable: "stable";
        declining: "declining";
    }>>;
    recentChangePercent: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export type HealthMetricSummaryContract = z.infer<typeof HealthMetricSummarySchema>;
//# sourceMappingURL=health-metrics.d.ts.map