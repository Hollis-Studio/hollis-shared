/**
 * @ai-context Clinical Registry Schema | Complete Zod schema for clinical-registry.json
 *
 * This module provides the canonical Zod schema for validating the clinical metric registry,
 * which serves as the single source of truth for all clinical metric definitions including:
 * - Core metric identity (key, displayName, description)
 * - Classification (category, direction, valueType, tags)
 * - Units and unit variants
 * - Reference ranges (base and optimal)
 * - Hard limits with safety rationale
 * - Population-specific modifiers (sex, age, pregnancy)
 * - Panel metadata for compound metrics
 * - Clinical flags and audit information
 *
 * IMPORTANT: All clinical metric registry operations MUST use these types.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
/**
 * Clinical metric categories for classification and grouping.
 * These align with the existing HEALTH_METRIC_CATEGORIES in training.ts.
 */
export declare const CLINICAL_METRIC_CATEGORIES: readonly ["body_composition", "cardiovascular", "metabolic", "hormonal", "performance", "hematology", "inflammatory", "nutritional"];
export declare const ClinicalMetricCategorySchema: z.ZodEnum<{
    body_composition: "body_composition";
    cardiovascular: "cardiovascular";
    metabolic: "metabolic";
    hormonal: "hormonal";
    performance: "performance";
    hematology: "hematology";
    inflammatory: "inflammatory";
    nutritional: "nutritional";
}>;
export type ClinicalMetricCategory = z.infer<typeof ClinicalMetricCategorySchema>;
export declare const CLINICAL_METRIC_CATEGORY: {
    readonly BODY_COMPOSITION: ClinicalMetricCategory;
    readonly CARDIOVASCULAR: ClinicalMetricCategory;
    readonly METABOLIC: ClinicalMetricCategory;
    readonly HORMONAL: ClinicalMetricCategory;
    readonly PERFORMANCE: ClinicalMetricCategory;
    readonly HEMATOLOGY: ClinicalMetricCategory;
    readonly INFLAMMATORY: ClinicalMetricCategory;
    readonly NUTRITIONAL: ClinicalMetricCategory;
};
export declare const CLINICAL_METRIC_CATEGORY_LABELS: Record<ClinicalMetricCategory, string>;
/**
 * Metric direction indicates whether higher or lower values are desirable.
 * - lower_better: Lower values are healthier (e.g., LDL cholesterol)
 * - higher_better: Higher values are healthier (e.g., HDL cholesterol)
 * - target_range: Value should be within a specific range (e.g., blood glucose)
 */
export declare const CLINICAL_METRIC_DIRECTIONS: readonly ["lower_better", "higher_better", "target_range"];
export declare const ClinicalMetricDirectionSchema: z.ZodEnum<{
    lower_better: "lower_better";
    higher_better: "higher_better";
    target_range: "target_range";
}>;
export type ClinicalMetricDirection = z.infer<typeof ClinicalMetricDirectionSchema>;
export declare const CLINICAL_METRIC_DIRECTION: {
    readonly LOWER_BETTER: ClinicalMetricDirection;
    readonly HIGHER_BETTER: ClinicalMetricDirection;
    readonly TARGET_RANGE: ClinicalMetricDirection;
};
export declare const CLINICAL_METRIC_DIRECTION_LABELS: Record<ClinicalMetricDirection, string>;
/**
 * Value types for clinical metrics.
 * - numeric: Continuous numeric value (e.g., 5.2 mmol/L)
 * - ratio: Ratio of two values (e.g., 3.5:1)
 * - qualitative: Categorical result (e.g., positive/negative)
 * - calculated: Derived from other metrics (e.g., eGFR)
 */
export declare const CLINICAL_VALUE_TYPES: readonly ["numeric", "ratio", "qualitative", "calculated"];
export declare const ClinicalValueTypeSchema: z.ZodEnum<{
    numeric: "numeric";
    ratio: "ratio";
    qualitative: "qualitative";
    calculated: "calculated";
}>;
export type ClinicalValueType = z.infer<typeof ClinicalValueTypeSchema>;
export declare const CLINICAL_VALUE_TYPE: {
    readonly NUMERIC: ClinicalValueType;
    readonly RATIO: ClinicalValueType;
    readonly QUALITATIVE: ClinicalValueType;
    readonly CALCULATED: ClinicalValueType;
};
export declare const CLINICAL_VALUE_TYPE_LABELS: Record<ClinicalValueType, string>;
/**
 * Age brackets for population-specific reference ranges.
 */
export declare const CLINICAL_AGE_BRACKETS: readonly ["pediatric", "18-29", "30-39", "40-49", "50-59", "60+"];
export declare const ClinicalAgeBracketSchema: z.ZodEnum<{
    pediatric: "pediatric";
    "18-29": "18-29";
    "30-39": "30-39";
    "40-49": "40-49";
    "50-59": "50-59";
    "60+": "60+";
}>;
export type ClinicalAgeBracket = z.infer<typeof ClinicalAgeBracketSchema>;
export declare const CLINICAL_AGE_BRACKET: {
    readonly PEDIATRIC: ClinicalAgeBracket;
    readonly YOUNG_ADULT: ClinicalAgeBracket;
    readonly THIRTIES: ClinicalAgeBracket;
    readonly FORTIES: ClinicalAgeBracket;
    readonly FIFTIES: ClinicalAgeBracket;
    readonly SENIORS: ClinicalAgeBracket;
};
export declare const CLINICAL_AGE_BRACKET_LABELS: Record<ClinicalAgeBracket, string>;
/**
 * Biological sex options for population modifiers.
 * Note: Does not include 'any' as modifiers should be explicit about which sex they apply to.
 */
export declare const CLINICAL_SEXES: readonly ["male", "female"];
export declare const ClinicalSexSchema: z.ZodEnum<{
    female: "female";
    male: "male";
}>;
export type ClinicalSex = z.infer<typeof ClinicalSexSchema>;
export declare const CLINICAL_SEX: {
    readonly MALE: ClinicalSex;
    readonly FEMALE: ClinicalSex;
};
export declare const CLINICAL_SEX_LABELS: Record<ClinicalSex, string>;
/**
 * Pregnancy status options for population modifiers.
 */
export declare const CLINICAL_PREGNANCY_STATUSES: readonly ["not_pregnant", "trimester_1", "trimester_2", "trimester_3", "postpartum"];
export declare const ClinicalPregnancyStatusSchema: z.ZodEnum<{
    not_pregnant: "not_pregnant";
    trimester_1: "trimester_1";
    trimester_2: "trimester_2";
    trimester_3: "trimester_3";
    postpartum: "postpartum";
}>;
export type ClinicalPregnancyStatus = z.infer<typeof ClinicalPregnancyStatusSchema>;
export declare const CLINICAL_PREGNANCY_STATUS: {
    readonly NOT_PREGNANT: ClinicalPregnancyStatus;
    readonly TRIMESTER_1: ClinicalPregnancyStatus;
    readonly TRIMESTER_2: ClinicalPregnancyStatus;
    readonly TRIMESTER_3: ClinicalPregnancyStatus;
    readonly POSTPARTUM: ClinicalPregnancyStatus;
};
export declare const CLINICAL_PREGNANCY_STATUS_LABELS: Record<ClinicalPregnancyStatus, string>;
/**
 * Logic types for how modifiers adjust reference ranges.
 * - override: Completely replaces the base range
 * - offset: Adds/subtracts from the base min/max values
 * - multiplier: Scales the base min/max by a factor
 */
export declare const CLINICAL_MODIFIER_LOGIC_TYPES: readonly ["override", "offset", "multiplier"];
export declare const ClinicalModifierLogicSchema: z.ZodEnum<{
    offset: "offset";
    override: "override";
    multiplier: "multiplier";
}>;
export type ClinicalModifierLogic = z.infer<typeof ClinicalModifierLogicSchema>;
export declare const CLINICAL_MODIFIER_LOGIC: {
    readonly OVERRIDE: ClinicalModifierLogic;
    readonly OFFSET: ClinicalModifierLogic;
    readonly MULTIPLIER: ClinicalModifierLogic;
};
export declare const CLINICAL_MODIFIER_LOGIC_LABELS: Record<ClinicalModifierLogic, string>;
/**
 * Zod schema for camelCase metric keys.
 */
export declare const ClinicalMetricKeySchema: z.ZodString;
export type ClinicalMetricKey = z.infer<typeof ClinicalMetricKeySchema>;
/**
 * Unit variant schema - defines acceptable unit equivalents.
 * For example, mg/dL and mg/dl are equivalent for glucose.
 */
export declare const ClinicalUnitVariantSchema: z.ZodObject<{
    unit: z.ZodString;
    conversionFactor: z.ZodOptional<z.ZodNumber>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ClinicalUnitVariant = z.infer<typeof ClinicalUnitVariantSchema>;
/**
 * Base reference range schema - the default reference range for a metric.
 */
export declare const ClinicalBaseRangeSchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodNumber;
    source: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ClinicalBaseRange = z.infer<typeof ClinicalBaseRangeSchema>;
/**
 * Optimal range schema - the ideal range within the normal reference range.
 * Both min and max are optional to support "optimal below X" or "optimal above X" cases.
 */
export declare const ClinicalOptimalRangeSchema: z.ZodObject<{
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    source: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ClinicalOptimalRange = z.infer<typeof ClinicalOptimalRangeSchema>;
/**
 * Hard limits schema - absolute safety bounds for clinical plausibility.
 * Values outside these limits are likely data entry errors or require immediate clinical attention.
 */
export declare const ClinicalHardLimitsSchema: z.ZodObject<{
    min: z.ZodNumber;
    max: z.ZodNumber;
    rationale: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ClinicalHardLimits = z.infer<typeof ClinicalHardLimitsSchema>;
/**
 * Conditions schema - specifies which population a modifier applies to.
 * All conditions are optional; if not specified, the modifier applies to all values of that dimension.
 */
export declare const ClinicalModifierConditionsSchema: z.ZodObject<{
    sex: z.ZodOptional<z.ZodEnum<{
        female: "female";
        male: "male";
    }>>;
    ageBracket: z.ZodOptional<z.ZodEnum<{
        pediatric: "pediatric";
        "18-29": "18-29";
        "30-39": "30-39";
        "40-49": "40-49";
        "50-59": "50-59";
        "60+": "60+";
    }>>;
    pregnancyStatus: z.ZodOptional<z.ZodEnum<{
        not_pregnant: "not_pregnant";
        trimester_1: "trimester_1";
        trimester_2: "trimester_2";
        trimester_3: "trimester_3";
        postpartum: "postpartum";
    }>>;
}, z.core.$strip>;
export type ClinicalModifierConditions = z.infer<typeof ClinicalModifierConditionsSchema>;
/**
 * Population modifier schema - adjusts reference ranges for specific populations.
 * Modifiers are applied in priority order (higher priority = applied later).
 */
export declare const ClinicalPopulationModifierSchema: z.ZodObject<{
    conditions: z.ZodObject<{
        sex: z.ZodOptional<z.ZodEnum<{
            female: "female";
            male: "male";
        }>>;
        ageBracket: z.ZodOptional<z.ZodEnum<{
            pediatric: "pediatric";
            "18-29": "18-29";
            "30-39": "30-39";
            "40-49": "40-49";
            "50-59": "50-59";
            "60+": "60+";
        }>>;
        pregnancyStatus: z.ZodOptional<z.ZodEnum<{
            not_pregnant: "not_pregnant";
            trimester_1: "trimester_1";
            trimester_2: "trimester_2";
            trimester_3: "trimester_3";
            postpartum: "postpartum";
        }>>;
    }, z.core.$strip>;
    logic: z.ZodEnum<{
        offset: "offset";
        override: "override";
        multiplier: "multiplier";
    }>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    source: z.ZodOptional<z.ZodString>;
    priority: z.ZodNumber;
}, z.core.$strip>;
export type ClinicalPopulationModifier = z.infer<typeof ClinicalPopulationModifierSchema>;
/**
 * Panel component schema - defines a metric that is part of a compound panel.
 * For example, a "lipid panel" might include totalCholesterol, ldlCholesterol, hdlCholesterol, and triglycerides.
 */
export declare const ClinicalPanelComponentSchema: z.ZodObject<{
    metricKey: z.ZodString;
    required: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type ClinicalPanelComponent = z.infer<typeof ClinicalPanelComponentSchema>;
/**
 * Complete clinical metric definition schema.
 * This is the primary schema for each metric entry in the registry.
 */
export declare const ClinicalMetricDefinitionSchema: z.ZodObject<{
    key: z.ZodString;
    displayName: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodEnum<{
        body_composition: "body_composition";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        hormonal: "hormonal";
        performance: "performance";
        hematology: "hematology";
        inflammatory: "inflammatory";
        nutritional: "nutritional";
    }>;
    direction: z.ZodEnum<{
        lower_better: "lower_better";
        higher_better: "higher_better";
        target_range: "target_range";
    }>;
    valueType: z.ZodEnum<{
        numeric: "numeric";
        ratio: "ratio";
        qualitative: "qualitative";
        calculated: "calculated";
    }>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
    unit: z.ZodString;
    unitVariants: z.ZodDefault<z.ZodArray<z.ZodObject<{
        unit: z.ZodString;
        conversionFactor: z.ZodOptional<z.ZodNumber>;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    baseRange: z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
        source: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    optimalRange: z.ZodOptional<z.ZodObject<{
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        source: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    hardLimits: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
        rationale: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    modifiers: z.ZodDefault<z.ZodArray<z.ZodObject<{
        conditions: z.ZodObject<{
            sex: z.ZodOptional<z.ZodEnum<{
                female: "female";
                male: "male";
            }>>;
            ageBracket: z.ZodOptional<z.ZodEnum<{
                pediatric: "pediatric";
                "18-29": "18-29";
                "30-39": "30-39";
                "40-49": "40-49";
                "50-59": "50-59";
                "60+": "60+";
            }>>;
            pregnancyStatus: z.ZodOptional<z.ZodEnum<{
                not_pregnant: "not_pregnant";
                trimester_1: "trimester_1";
                trimester_2: "trimester_2";
                trimester_3: "trimester_3";
                postpartum: "postpartum";
            }>>;
        }, z.core.$strip>;
        logic: z.ZodEnum<{
            offset: "offset";
            override: "override";
            multiplier: "multiplier";
        }>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        source: z.ZodOptional<z.ZodString>;
        priority: z.ZodNumber;
    }, z.core.$strip>>>;
    panelComponents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        metricKey: z.ZodString;
        required: z.ZodDefault<z.ZodBoolean>;
        order: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    parentPanelKey: z.ZodOptional<z.ZodString>;
    requiresVerification: z.ZodDefault<z.ZodBoolean>;
    isPregnancySensitive: z.ZodDefault<z.ZodBoolean>;
    isDeprecated: z.ZodDefault<z.ZodBoolean>;
    deprecatedReason: z.ZodOptional<z.ZodString>;
    replacedBy: z.ZodOptional<z.ZodString>;
    effectiveFrom: z.ZodOptional<z.ZodString>;
    addedVersion: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ClinicalMetricDefinition = z.infer<typeof ClinicalMetricDefinitionSchema>;
/**
 * Top-level clinical metric registry schema.
 * This is the complete schema for the clinical-registry.json file.
 */
export declare const ClinicalMetricRegistrySchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    lastUpdated: z.ZodString;
    metrics: z.ZodRecord<z.ZodString, z.ZodObject<{
        key: z.ZodString;
        displayName: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        category: z.ZodEnum<{
            body_composition: "body_composition";
            cardiovascular: "cardiovascular";
            metabolic: "metabolic";
            hormonal: "hormonal";
            performance: "performance";
            hematology: "hematology";
            inflammatory: "inflammatory";
            nutritional: "nutritional";
        }>;
        direction: z.ZodEnum<{
            lower_better: "lower_better";
            higher_better: "higher_better";
            target_range: "target_range";
        }>;
        valueType: z.ZodEnum<{
            numeric: "numeric";
            ratio: "ratio";
            qualitative: "qualitative";
            calculated: "calculated";
        }>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
        sortOrder: z.ZodOptional<z.ZodNumber>;
        unit: z.ZodString;
        unitVariants: z.ZodDefault<z.ZodArray<z.ZodObject<{
            unit: z.ZodString;
            conversionFactor: z.ZodOptional<z.ZodNumber>;
            note: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        baseRange: z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            source: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        optimalRange: z.ZodOptional<z.ZodObject<{
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            source: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        hardLimits: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            rationale: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        modifiers: z.ZodDefault<z.ZodArray<z.ZodObject<{
            conditions: z.ZodObject<{
                sex: z.ZodOptional<z.ZodEnum<{
                    female: "female";
                    male: "male";
                }>>;
                ageBracket: z.ZodOptional<z.ZodEnum<{
                    pediatric: "pediatric";
                    "18-29": "18-29";
                    "30-39": "30-39";
                    "40-49": "40-49";
                    "50-59": "50-59";
                    "60+": "60+";
                }>>;
                pregnancyStatus: z.ZodOptional<z.ZodEnum<{
                    not_pregnant: "not_pregnant";
                    trimester_1: "trimester_1";
                    trimester_2: "trimester_2";
                    trimester_3: "trimester_3";
                    postpartum: "postpartum";
                }>>;
            }, z.core.$strip>;
            logic: z.ZodEnum<{
                offset: "offset";
                override: "override";
                multiplier: "multiplier";
            }>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            source: z.ZodOptional<z.ZodString>;
            priority: z.ZodNumber;
        }, z.core.$strip>>>;
        panelComponents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            metricKey: z.ZodString;
            required: z.ZodDefault<z.ZodBoolean>;
            order: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        parentPanelKey: z.ZodOptional<z.ZodString>;
        requiresVerification: z.ZodDefault<z.ZodBoolean>;
        isPregnancySensitive: z.ZodDefault<z.ZodBoolean>;
        isDeprecated: z.ZodDefault<z.ZodBoolean>;
        deprecatedReason: z.ZodOptional<z.ZodString>;
        replacedBy: z.ZodOptional<z.ZodString>;
        effectiveFrom: z.ZodOptional<z.ZodString>;
        addedVersion: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ClinicalMetricRegistry = z.infer<typeof ClinicalMetricRegistrySchema>;
/**
 * Type guard to check if a string is a valid clinical metric category.
 */
export declare function isClinicalMetricCategory(value: string): value is ClinicalMetricCategory;
/**
 * Type guard to check if a string is a valid clinical metric direction.
 */
export declare function isClinicalMetricDirection(value: string): value is ClinicalMetricDirection;
/**
 * Type guard to check if a string is a valid clinical value type.
 */
export declare function isClinicalValueType(value: string): value is ClinicalValueType;
/**
 * Type guard to check if a string is a valid clinical age bracket.
 */
export declare function isClinicalAgeBracket(value: string): value is ClinicalAgeBracket;
/**
 * Type guard to check if a string is a valid clinical sex.
 */
export declare function isClinicalSex(value: string): value is ClinicalSex;
/**
 * Type guard to check if a string is a valid clinical pregnancy status.
 */
export declare function isClinicalPregnancyStatus(value: string): value is ClinicalPregnancyStatus;
/**
 * Type guard to check if a string is a valid clinical modifier logic type.
 */
export declare function isClinicalModifierLogic(value: string): value is ClinicalModifierLogic;
/**
 * Type guard to check if a string is a valid camelCase metric key.
 */
export declare function isClinicalMetricKey(value: string): boolean;
/**
 * Validates a clinical metric registry object and returns typed result.
 * @param data - The data to validate
 * @returns Parsed and validated registry or throws ZodError
 */
export declare function parseClinicalMetricRegistry(data: unknown): ClinicalMetricRegistry;
/**
 * Safely validates a clinical metric registry object.
 * @param data - The data to validate
 * @returns Safe parse result with success flag and data/error
 */
export declare function safeParseClinicalMetricRegistry(data: unknown): z.ZodSafeParseResult<{
    version: string;
    lastUpdated: string;
    metrics: Record<string, {
        key: string;
        displayName: string;
        category: "body_composition" | "cardiovascular" | "metabolic" | "hormonal" | "performance" | "hematology" | "inflammatory" | "nutritional";
        direction: "lower_better" | "higher_better" | "target_range";
        valueType: "numeric" | "ratio" | "qualitative" | "calculated";
        tags: string[];
        unit: string;
        unitVariants: {
            unit: string;
            conversionFactor?: number | undefined;
            note?: string | undefined;
        }[];
        baseRange: {
            min: number;
            max: number;
            source?: string | undefined;
        };
        modifiers: {
            conditions: {
                sex?: "female" | "male" | undefined;
                ageBracket?: "pediatric" | "18-29" | "30-39" | "40-49" | "50-59" | "60+" | undefined;
                pregnancyStatus?: "not_pregnant" | "trimester_1" | "trimester_2" | "trimester_3" | "postpartum" | undefined;
            };
            logic: "offset" | "override" | "multiplier";
            priority: number;
            min?: number | undefined;
            max?: number | undefined;
            source?: string | undefined;
        }[];
        requiresVerification: boolean;
        isPregnancySensitive: boolean;
        isDeprecated: boolean;
        description?: string | undefined;
        sortOrder?: number | undefined;
        optimalRange?: {
            min?: number | undefined;
            max?: number | undefined;
            source?: string | undefined;
        } | undefined;
        hardLimits?: {
            min: number;
            max: number;
            rationale?: string | undefined;
        } | undefined;
        panelComponents?: {
            metricKey: string;
            required: boolean;
            order?: number | undefined;
        }[] | undefined;
        parentPanelKey?: string | undefined;
        deprecatedReason?: string | undefined;
        replacedBy?: string | undefined;
        effectiveFrom?: string | undefined;
        addedVersion?: string | undefined;
    }>;
    $schema?: string | undefined;
}>;
/**
 * Validates a single clinical metric definition.
 * @param data - The data to validate
 * @returns Parsed and validated metric definition or throws ZodError
 */
export declare function parseClinicalMetricDefinition(data: unknown): ClinicalMetricDefinition;
/**
 * Safely validates a single clinical metric definition.
 * @param data - The data to validate
 * @returns Safe parse result with success flag and data/error
 */
export declare function safeParseClinicalMetricDefinition(data: unknown): z.ZodSafeParseResult<{
    key: string;
    displayName: string;
    category: "body_composition" | "cardiovascular" | "metabolic" | "hormonal" | "performance" | "hematology" | "inflammatory" | "nutritional";
    direction: "lower_better" | "higher_better" | "target_range";
    valueType: "numeric" | "ratio" | "qualitative" | "calculated";
    tags: string[];
    unit: string;
    unitVariants: {
        unit: string;
        conversionFactor?: number | undefined;
        note?: string | undefined;
    }[];
    baseRange: {
        min: number;
        max: number;
        source?: string | undefined;
    };
    modifiers: {
        conditions: {
            sex?: "female" | "male" | undefined;
            ageBracket?: "pediatric" | "18-29" | "30-39" | "40-49" | "50-59" | "60+" | undefined;
            pregnancyStatus?: "not_pregnant" | "trimester_1" | "trimester_2" | "trimester_3" | "postpartum" | undefined;
        };
        logic: "offset" | "override" | "multiplier";
        priority: number;
        min?: number | undefined;
        max?: number | undefined;
        source?: string | undefined;
    }[];
    requiresVerification: boolean;
    isPregnancySensitive: boolean;
    isDeprecated: boolean;
    description?: string | undefined;
    sortOrder?: number | undefined;
    optimalRange?: {
        min?: number | undefined;
        max?: number | undefined;
        source?: string | undefined;
    } | undefined;
    hardLimits?: {
        min: number;
        max: number;
        rationale?: string | undefined;
    } | undefined;
    panelComponents?: {
        metricKey: string;
        required: boolean;
        order?: number | undefined;
    }[] | undefined;
    parentPanelKey?: string | undefined;
    deprecatedReason?: string | undefined;
    replacedBy?: string | undefined;
    effectiveFrom?: string | undefined;
    addedVersion?: string | undefined;
}>;
//# sourceMappingURL=clinical-registry.schema.d.ts.map