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

import { z } from 'zod';

// ============================================================================
// CONSTANTS: Metric Categories
// ============================================================================

/**
 * Clinical metric categories for classification and grouping.
 * These align with the existing HEALTH_METRIC_CATEGORIES in training.ts.
 */
export const CLINICAL_METRIC_CATEGORIES = [
  'body_composition',
  'cardiovascular',
  'metabolic',
  'hormonal',
  'performance',
  'hematology',
  'inflammatory',
  'nutritional',
] as const;
export type ClinicalMetricCategory = (typeof CLINICAL_METRIC_CATEGORIES)[number];

export const ClinicalMetricCategorySchema = z.enum(CLINICAL_METRIC_CATEGORIES);

export const CLINICAL_METRIC_CATEGORY = {
  BODY_COMPOSITION: 'body_composition' as ClinicalMetricCategory,
  CARDIOVASCULAR: 'cardiovascular' as ClinicalMetricCategory,
  METABOLIC: 'metabolic' as ClinicalMetricCategory,
  HORMONAL: 'hormonal' as ClinicalMetricCategory,
  PERFORMANCE: 'performance' as ClinicalMetricCategory,
  HEMATOLOGY: 'hematology' as ClinicalMetricCategory,
  INFLAMMATORY: 'inflammatory' as ClinicalMetricCategory,
  NUTRITIONAL: 'nutritional' as ClinicalMetricCategory,
} as const;

export const CLINICAL_METRIC_CATEGORY_LABELS: Record<ClinicalMetricCategory, string> = {
  body_composition: 'Body Composition',
  cardiovascular: 'Cardiovascular',
  metabolic: 'Metabolic',
  hormonal: 'Hormonal',
  performance: 'Performance',
  hematology: 'Hematology',
  inflammatory: 'Inflammatory',
  nutritional: 'Nutritional',
};

// ============================================================================
// CONSTANTS: Metric Directions
// ============================================================================

/**
 * Metric direction indicates whether higher or lower values are desirable.
 * - lower_better: Lower values are healthier (e.g., LDL cholesterol)
 * - higher_better: Higher values are healthier (e.g., HDL cholesterol)
 * - target_range: Value should be within a specific range (e.g., blood glucose)
 */
export const CLINICAL_METRIC_DIRECTIONS = ['lower_better', 'higher_better', 'target_range'] as const;
export type ClinicalMetricDirection = (typeof CLINICAL_METRIC_DIRECTIONS)[number];

export const ClinicalMetricDirectionSchema = z.enum(CLINICAL_METRIC_DIRECTIONS);

export const CLINICAL_METRIC_DIRECTION = {
  LOWER_BETTER: 'lower_better' as ClinicalMetricDirection,
  HIGHER_BETTER: 'higher_better' as ClinicalMetricDirection,
  TARGET_RANGE: 'target_range' as ClinicalMetricDirection,
} as const;

export const CLINICAL_METRIC_DIRECTION_LABELS: Record<ClinicalMetricDirection, string> = {
  lower_better: 'Lower is Better',
  higher_better: 'Higher is Better',
  target_range: 'Target Range',
};

// ============================================================================
// CONSTANTS: Value Types
// ============================================================================

/**
 * Value types for clinical metrics.
 * - numeric: Continuous numeric value (e.g., 5.2 mmol/L)
 * - ratio: Ratio of two values (e.g., 3.5:1)
 * - qualitative: Categorical result (e.g., positive/negative)
 * - calculated: Derived from other metrics (e.g., eGFR)
 */
export const CLINICAL_VALUE_TYPES = ['numeric', 'ratio', 'qualitative', 'calculated'] as const;
export type ClinicalValueType = (typeof CLINICAL_VALUE_TYPES)[number];

export const ClinicalValueTypeSchema = z.enum(CLINICAL_VALUE_TYPES);

export const CLINICAL_VALUE_TYPE = {
  NUMERIC: 'numeric' as ClinicalValueType,
  RATIO: 'ratio' as ClinicalValueType,
  QUALITATIVE: 'qualitative' as ClinicalValueType,
  CALCULATED: 'calculated' as ClinicalValueType,
} as const;

export const CLINICAL_VALUE_TYPE_LABELS: Record<ClinicalValueType, string> = {
  numeric: 'Numeric',
  ratio: 'Ratio',
  qualitative: 'Qualitative',
  calculated: 'Calculated',
};

// ============================================================================
// CONSTANTS: Age Brackets
// ============================================================================

/**
 * Age brackets for population-specific reference ranges.
 */
export const CLINICAL_AGE_BRACKETS = [
  'pediatric',
  '18-29',
  '30-39',
  '40-49',
  '50-59',
  '60+',
] as const;
export type ClinicalAgeBracket = (typeof CLINICAL_AGE_BRACKETS)[number];

export const ClinicalAgeBracketSchema = z.enum(CLINICAL_AGE_BRACKETS);

export const CLINICAL_AGE_BRACKET = {
  PEDIATRIC: 'pediatric' as ClinicalAgeBracket,
  YOUNG_ADULT: '18-29' as ClinicalAgeBracket,
  THIRTIES: '30-39' as ClinicalAgeBracket,
  FORTIES: '40-49' as ClinicalAgeBracket,
  FIFTIES: '50-59' as ClinicalAgeBracket,
  SENIORS: '60+' as ClinicalAgeBracket,
} as const;

export const CLINICAL_AGE_BRACKET_LABELS: Record<ClinicalAgeBracket, string> = {
  pediatric: 'Pediatric (<18)',
  '18-29': '18-29 years',
  '30-39': '30-39 years',
  '40-49': '40-49 years',
  '50-59': '50-59 years',
  '60+': '60+ years',
};

// ============================================================================
// CONSTANTS: Biological Sex
// ============================================================================

/**
 * Biological sex options for population modifiers.
 * Note: Does not include 'any' as modifiers should be explicit about which sex they apply to.
 */
export const CLINICAL_SEXES = ['male', 'female'] as const;
export type ClinicalSex = (typeof CLINICAL_SEXES)[number];

export const ClinicalSexSchema = z.enum(CLINICAL_SEXES);

export const CLINICAL_SEX = {
  MALE: 'male' as ClinicalSex,
  FEMALE: 'female' as ClinicalSex,
} as const;

export const CLINICAL_SEX_LABELS: Record<ClinicalSex, string> = {
  male: 'Male',
  female: 'Female',
};

// ============================================================================
// CONSTANTS: Pregnancy Status
// ============================================================================

/**
 * Pregnancy status options for population modifiers.
 */
export const CLINICAL_PREGNANCY_STATUSES = [
  'not_pregnant',
  'trimester_1',
  'trimester_2',
  'trimester_3',
  'postpartum',
] as const;
export type ClinicalPregnancyStatus = (typeof CLINICAL_PREGNANCY_STATUSES)[number];

export const ClinicalPregnancyStatusSchema = z.enum(CLINICAL_PREGNANCY_STATUSES);

export const CLINICAL_PREGNANCY_STATUS = {
  NOT_PREGNANT: 'not_pregnant' as ClinicalPregnancyStatus,
  TRIMESTER_1: 'trimester_1' as ClinicalPregnancyStatus,
  TRIMESTER_2: 'trimester_2' as ClinicalPregnancyStatus,
  TRIMESTER_3: 'trimester_3' as ClinicalPregnancyStatus,
  POSTPARTUM: 'postpartum' as ClinicalPregnancyStatus,
} as const;

export const CLINICAL_PREGNANCY_STATUS_LABELS: Record<ClinicalPregnancyStatus, string> = {
  not_pregnant: 'Not Pregnant',
  trimester_1: 'Trimester 1',
  trimester_2: 'Trimester 2',
  trimester_3: 'Trimester 3',
  postpartum: 'Postpartum',
};

// ============================================================================
// CONSTANTS: Modifier Logic Types
// ============================================================================

/**
 * Logic types for how modifiers adjust reference ranges.
 * - override: Completely replaces the base range
 * - offset: Adds/subtracts from the base min/max values
 * - multiplier: Scales the base min/max by a factor
 */
export const CLINICAL_MODIFIER_LOGIC_TYPES = ['override', 'offset', 'multiplier'] as const;
export type ClinicalModifierLogic = (typeof CLINICAL_MODIFIER_LOGIC_TYPES)[number];

export const ClinicalModifierLogicSchema = z.enum(CLINICAL_MODIFIER_LOGIC_TYPES);

export const CLINICAL_MODIFIER_LOGIC = {
  OVERRIDE: 'override' as ClinicalModifierLogic,
  OFFSET: 'offset' as ClinicalModifierLogic,
  MULTIPLIER: 'multiplier' as ClinicalModifierLogic,
} as const;

export const CLINICAL_MODIFIER_LOGIC_LABELS: Record<ClinicalModifierLogic, string> = {
  override: 'Override (replaces range)',
  offset: 'Offset (adds to min/max)',
  multiplier: 'Multiplier (scales min/max)',
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Regex pattern for camelCase validation.
 * Matches: glucoseFasting, hbA1c, ldlCholesterol
 * Does not match: GlucoseFasting, glucose_fasting, glucose-fasting
 */
const CAMEL_CASE_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

/**
 * Zod schema for camelCase metric keys.
 */
export const ClinicalMetricKeySchema = z
  .string()
  .min(1, 'Metric key is required')
  .regex(CAMEL_CASE_PATTERN, 'Metric key must be camelCase (start with lowercase, no underscores or hyphens)');

// ============================================================================
// SCHEMA: Unit Variant
// ============================================================================

/**
 * Unit variant schema - defines acceptable unit equivalents.
 * For example, mg/dL and mg/dl are equivalent for glucose.
 */
export const ClinicalUnitVariantSchema = z.object({
  /** The alternative unit string (e.g., "mg/dl") */
  unit: z.string().min(1, 'Unit is required'),
  
  /** Optional conversion factor from base unit (multiply base by this to get variant) */
  conversionFactor: z.number().positive().optional(),
  
  /** Optional note about when this variant is used */
  note: z.string().optional(),
});
export type ClinicalUnitVariant = z.infer<typeof ClinicalUnitVariantSchema>;

// ============================================================================
// SCHEMA: Base Reference Range
// ============================================================================

/**
 * Base reference range schema - the default reference range for a metric.
 */
export const ClinicalBaseRangeSchema = z.object({
  /** Minimum value of the normal reference range */
  min: z.number(),
  
  /** Maximum value of the normal reference range */
  max: z.number(),
  
  /** Source citation for this reference range (e.g., "NCEP ATP III Guidelines") */
  source: z.string().optional(),
}).refine(
  (data) => data.min < data.max,
  { message: 'baseRange.min must be less than baseRange.max' }
);
export type ClinicalBaseRange = z.infer<typeof ClinicalBaseRangeSchema>;

// ============================================================================
// SCHEMA: Optimal Range
// ============================================================================

/**
 * Optimal range schema - the ideal range within the normal reference range.
 * Both min and max are optional to support "optimal below X" or "optimal above X" cases.
 */
export const ClinicalOptimalRangeSchema = z.object({
  /** Optimal minimum value (may be absent for "lower is optimal" metrics) */
  min: z.number().optional(),
  
  /** Optimal maximum value (may be absent for "higher is optimal" metrics) */
  max: z.number().optional(),
  
  /** Source citation for this optimal range */
  source: z.string().optional(),
}).refine(
  (data) => {
    // If both are defined, min must be less than max
    if (data.min !== undefined && data.max !== undefined) {
      return data.min < data.max;
    }
    // At least one must be defined
    return data.min !== undefined || data.max !== undefined;
  },
  { message: 'optimalRange must have at least one of min/max defined, and min must be < max if both are set' }
);
export type ClinicalOptimalRange = z.infer<typeof ClinicalOptimalRangeSchema>;

// ============================================================================
// SCHEMA: Hard Limits
// ============================================================================

/**
 * Hard limits schema - absolute safety bounds for clinical plausibility.
 * Values outside these limits are likely data entry errors or require immediate clinical attention.
 */
export const ClinicalHardLimitsSchema = z.object({
  /** Absolute minimum clinically plausible value */
  min: z.number(),
  
  /** Absolute maximum clinically plausible value */
  max: z.number(),
  
  /** Clinical rationale explaining why these limits were chosen */
  rationale: z.string().optional(),
}).refine(
  (data) => data.min < data.max,
  { message: 'hardLimits.min must be less than hardLimits.max' }
);
export type ClinicalHardLimits = z.infer<typeof ClinicalHardLimitsSchema>;

// ============================================================================
// SCHEMA: Population Modifier Conditions
// ============================================================================

/**
 * Conditions schema - specifies which population a modifier applies to.
 * All conditions are optional; if not specified, the modifier applies to all values of that dimension.
 */
export const ClinicalModifierConditionsSchema = z.object({
  /** Biological sex this modifier applies to */
  sex: ClinicalSexSchema.optional(),
  
  /** Age bracket this modifier applies to */
  ageBracket: ClinicalAgeBracketSchema.optional(),
  
  /** Pregnancy status this modifier applies to */
  pregnancyStatus: ClinicalPregnancyStatusSchema.optional(),
});
export type ClinicalModifierConditions = z.infer<typeof ClinicalModifierConditionsSchema>;

// ============================================================================
// SCHEMA: Population Modifier
// ============================================================================

/**
 * Population modifier schema - adjusts reference ranges for specific populations.
 * Modifiers are applied in priority order (higher priority = applied later).
 */
export const ClinicalPopulationModifierSchema = z.object({
  /** Conditions that must match for this modifier to apply */
  conditions: ClinicalModifierConditionsSchema,
  
  /** How the modifier adjusts the range (override, offset, or multiplier) */
  logic: ClinicalModifierLogicSchema,
  
  /** 
   * Minimum value adjustment.
   * For override: the new min value
   * For offset: added to base min
   * For multiplier: base min is multiplied by this
   */
  min: z.number().optional(),
  
  /** 
   * Maximum value adjustment.
   * For override: the new max value
   * For offset: added to base max
   * For multiplier: base max is multiplied by this
   */
  max: z.number().optional(),
  
  /** Source citation for this modifier */
  source: z.string().optional(),
  
  /** 
   * Priority for modifier application order (higher = applied later).
   * Must be a positive integer.
   */
  priority: z.number().int().positive('Priority must be a positive integer'),
});
export type ClinicalPopulationModifier = z.infer<typeof ClinicalPopulationModifierSchema>;

// ============================================================================
// SCHEMA: Panel Component
// ============================================================================

/**
 * Panel component schema - defines a metric that is part of a compound panel.
 * For example, a "lipid panel" might include totalCholesterol, ldlCholesterol, hdlCholesterol, and triglycerides.
 */
export const ClinicalPanelComponentSchema = z.object({
  /** The metric key of the component */
  metricKey: ClinicalMetricKeySchema,
  
  /** Whether this component is required for the panel to be complete */
  required: z.boolean().default(true),
  
  /** Display order within the panel */
  order: z.number().int().nonnegative().optional(),
});
export type ClinicalPanelComponent = z.infer<typeof ClinicalPanelComponentSchema>;

// ============================================================================
// SCHEMA: Clinical Metric Definition (Main Schema)
// ============================================================================

/**
 * Complete clinical metric definition schema.
 * This is the primary schema for each metric entry in the registry.
 */
export const ClinicalMetricDefinitionSchema = z.object({
  // -------------------------------------------------------------------------
  // Core Identity
  // -------------------------------------------------------------------------
  
  /** 
   * Unique metric key in camelCase (e.g., "glucoseFasting", "ldlCholesterol").
   * This is the canonical identifier used throughout the system.
   */
  key: ClinicalMetricKeySchema,
  
  /** 
   * Human-readable display name (e.g., "Fasting Glucose", "LDL Cholesterol").
   */
  displayName: z.string().min(1, 'Display name is required'),
  
  /** 
   * Detailed description of what this metric measures and its clinical significance.
   */
  description: z.string().optional(),
  
  // -------------------------------------------------------------------------
  // Classification
  // -------------------------------------------------------------------------
  
  /** 
   * Category for grouping metrics (e.g., metabolic, cardiovascular).
   */
  category: ClinicalMetricCategorySchema,
  
  /** 
   * Direction indicating whether higher or lower values are desirable.
   */
  direction: ClinicalMetricDirectionSchema,
  
  /** 
   * Type of value this metric produces.
   */
  valueType: ClinicalValueTypeSchema,
  
  /** 
   * Searchable tags for categorization and filtering (e.g., ["diabetes", "glucose", "fasting"]).
   */
  tags: z.array(z.string()).default([]),
  
  /** 
   * Sort order for display purposes (lower = displayed first).
   */
  sortOrder: z.number().int().nonnegative().optional(),
  
  // -------------------------------------------------------------------------
  // Units
  // -------------------------------------------------------------------------
  
  /** 
   * Primary unit of measurement (e.g., "mg/dL", "mmol/L").
   * This is the canonical unit used for storage and calculations.
   */
  unit: z.string().min(1, 'Unit is required'),
  
  /** 
   * Acceptable unit variants that can be converted to the primary unit.
   */
  unitVariants: z.array(ClinicalUnitVariantSchema).default([]),
  
  // -------------------------------------------------------------------------
  // Reference Ranges
  // -------------------------------------------------------------------------
  
  /** 
   * Base (default) reference range for the general population.
   */
  baseRange: ClinicalBaseRangeSchema,
  
  /** 
   * Optimal range within the normal reference range (if applicable).
   */
  optimalRange: ClinicalOptimalRangeSchema.optional(),
  
  // -------------------------------------------------------------------------
  // Hard Limits
  // -------------------------------------------------------------------------
  
  /** 
   * Absolute clinical safety bounds for data validation.
   */
  hardLimits: ClinicalHardLimitsSchema.optional(),
  
  // -------------------------------------------------------------------------
  // Population Modifiers
  // -------------------------------------------------------------------------
  
  /** 
   * Population-specific adjustments to the base reference range.
   */
  modifiers: z.array(ClinicalPopulationModifierSchema).default([]),
  
  // -------------------------------------------------------------------------
  // Panel Metadata
  // -------------------------------------------------------------------------
  
  /** 
   * If this metric is a compound panel, list its component metrics.
   */
  panelComponents: z.array(ClinicalPanelComponentSchema).optional(),
  
  /** 
   * If this metric is part of a panel, reference the parent panel's metric key.
   */
  parentPanelKey: ClinicalMetricKeySchema.optional(),
  
  // -------------------------------------------------------------------------
  // Clinical Flags
  // -------------------------------------------------------------------------
  
  /** 
   * Whether this metric requires manual verification before use in clinical decisions.
   */
  requiresVerification: z.boolean().default(false),
  
  /** 
   * Whether this metric has special handling during pregnancy.
   */
  isPregnancySensitive: z.boolean().default(false),
  
  /** 
   * Whether this metric is deprecated and should not be used for new data.
   */
  isDeprecated: z.boolean().default(false),
  
  /** 
   * Reason for deprecation (required if isDeprecated is true).
   */
  deprecatedReason: z.string().optional(),
  
  /** 
   * Metric key of the replacement metric (if this one is deprecated).
   */
  replacedBy: ClinicalMetricKeySchema.optional(),
  
  // -------------------------------------------------------------------------
  // Audit Information
  // -------------------------------------------------------------------------
  
  /** 
   * ISO date when this metric definition became effective.
   */
  effectiveFrom: z.string().datetime({ offset: true }).optional(),
  
  /** 
   * Semantic version when this metric was added to the registry.
   */
  addedVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic (e.g., 1.0.0)').optional(),
}).superRefine((data, ctx) => {
  // Validate that hardLimits contain the baseRange
  if (data.hardLimits) {
    if (data.hardLimits.min > data.baseRange.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'hardLimits.min must be <= baseRange.min',
        path: ['hardLimits', 'min'],
      });
    }
    if (data.hardLimits.max < data.baseRange.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'hardLimits.max must be >= baseRange.max',
        path: ['hardLimits', 'max'],
      });
    }
  }
  
  // Validate that optimalRange is within baseRange
  if (data.optimalRange) {
    if (data.optimalRange.min !== undefined && data.optimalRange.min < data.baseRange.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'optimalRange.min must be >= baseRange.min',
        path: ['optimalRange', 'min'],
      });
    }
    if (data.optimalRange.max !== undefined && data.optimalRange.max > data.baseRange.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'optimalRange.max must be <= baseRange.max',
        path: ['optimalRange', 'max'],
      });
    }
  }
  
  // Validate deprecation fields
  if (data.isDeprecated && !data.deprecatedReason) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'deprecatedReason is required when isDeprecated is true',
      path: ['deprecatedReason'],
    });
  }
});
export type ClinicalMetricDefinition = z.infer<typeof ClinicalMetricDefinitionSchema>;

// ============================================================================
// SCHEMA: Clinical Metric Registry (Top-Level)
// ============================================================================

/**
 * Top-level clinical metric registry schema.
 * This is the complete schema for the clinical-registry.json file.
 */
export const ClinicalMetricRegistrySchema = z.object({
  /** 
   * Optional JSON Schema reference for external validation tools.
   */
  $schema: z.string().optional(),
  
  /** 
   * Semantic version of this registry (e.g., "1.0.0").
   */
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic (e.g., 1.0.0)'),
  
  /** 
   * ISO datetime of last update to the registry.
   */
  lastUpdated: z.string().datetime({ offset: true }),
  
  /** 
   * Map of metric keys to their definitions.
   * Keys must match the key field within each definition.
   */
  metrics: z.record(ClinicalMetricKeySchema, ClinicalMetricDefinitionSchema),
}).superRefine((data, ctx) => {
  // Validate that record keys match the key field in definitions
  for (const [recordKey, definition] of Object.entries(data.metrics)) {
    if (recordKey !== definition.key) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Record key "${recordKey}" must match definition key "${definition.key}"`,
        path: ['metrics', recordKey],
      });
    }
  }
  
  // Validate unique modifier conditions within each metric
  for (const [metricKey, definition] of Object.entries(data.metrics)) {
    const conditionSignatures = new Set<string>();
    for (let i = 0; i < definition.modifiers.length; i++) {
      const modifier = definition.modifiers[i];
      const signature = JSON.stringify({
        sex: modifier.conditions.sex ?? null,
        ageBracket: modifier.conditions.ageBracket ?? null,
        pregnancyStatus: modifier.conditions.pregnancyStatus ?? null,
      });
      
      if (conditionSignatures.has(signature)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate modifier conditions found in metric "${metricKey}"`,
          path: ['metrics', metricKey, 'modifiers', i],
        });
      }
      conditionSignatures.add(signature);
    }
  }
  
  // Validate panel component references exist
  for (const [metricKey, definition] of Object.entries(data.metrics)) {
    if (definition.panelComponents) {
      for (let i = 0; i < definition.panelComponents.length; i++) {
        const component = definition.panelComponents[i];
        if (!(component.metricKey in data.metrics)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Panel component "${component.metricKey}" references non-existent metric`,
            path: ['metrics', metricKey, 'panelComponents', i, 'metricKey'],
          });
        }
      }
    }
    
    // Validate replacedBy references exist
    if (definition.replacedBy && !(definition.replacedBy in data.metrics)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `replacedBy "${definition.replacedBy}" references non-existent metric`,
        path: ['metrics', metricKey, 'replacedBy'],
      });
    }
    
    // Validate parentPanelKey references exist and is a panel
    if (definition.parentPanelKey) {
      if (!(definition.parentPanelKey in data.metrics)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `parentPanelKey "${definition.parentPanelKey}" references non-existent metric`,
          path: ['metrics', metricKey, 'parentPanelKey'],
        });
      } else {
        const parentMetric = data.metrics[definition.parentPanelKey];
        if (!parentMetric.panelComponents || parentMetric.panelComponents.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `parentPanelKey "${definition.parentPanelKey}" references a metric that is not a panel`,
            path: ['metrics', metricKey, 'parentPanelKey'],
          });
        }
      }
    }
  }
});
export type ClinicalMetricRegistry = z.infer<typeof ClinicalMetricRegistrySchema>;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a string is a valid clinical metric category.
 */
export function isClinicalMetricCategory(value: string): value is ClinicalMetricCategory {
  return (CLINICAL_METRIC_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Type guard to check if a string is a valid clinical metric direction.
 */
export function isClinicalMetricDirection(value: string): value is ClinicalMetricDirection {
  return (CLINICAL_METRIC_DIRECTIONS as readonly string[]).includes(value);
}

/**
 * Type guard to check if a string is a valid clinical value type.
 */
export function isClinicalValueType(value: string): value is ClinicalValueType {
  return (CLINICAL_VALUE_TYPES as readonly string[]).includes(value);
}

/**
 * Type guard to check if a string is a valid clinical age bracket.
 */
export function isClinicalAgeBracket(value: string): value is ClinicalAgeBracket {
  return (CLINICAL_AGE_BRACKETS as readonly string[]).includes(value);
}

/**
 * Type guard to check if a string is a valid clinical sex.
 */
export function isClinicalSex(value: string): value is ClinicalSex {
  return (CLINICAL_SEXES as readonly string[]).includes(value);
}

/**
 * Type guard to check if a string is a valid clinical pregnancy status.
 */
export function isClinicalPregnancyStatus(value: string): value is ClinicalPregnancyStatus {
  return (CLINICAL_PREGNANCY_STATUSES as readonly string[]).includes(value);
}

/**
 * Type guard to check if a string is a valid clinical modifier logic type.
 */
export function isClinicalModifierLogic(value: string): value is ClinicalModifierLogic {
  return (CLINICAL_MODIFIER_LOGIC_TYPES as readonly string[]).includes(value);
}

/**
 * Type guard to check if a string is a valid camelCase metric key.
 */
export function isClinicalMetricKey(value: string): boolean {
  return CAMEL_CASE_PATTERN.test(value);
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates a clinical metric registry object and returns typed result.
 * @param data - The data to validate
 * @returns Parsed and validated registry or throws ZodError
 */
export function parseClinicalMetricRegistry(data: unknown): ClinicalMetricRegistry {
  return ClinicalMetricRegistrySchema.parse(data);
}

/**
 * Safely validates a clinical metric registry object.
 * @param data - The data to validate
 * @returns Safe parse result with success flag and data/error
 */
export function safeParseClinicalMetricRegistry(data: unknown) {
  return ClinicalMetricRegistrySchema.safeParse(data);
}

/**
 * Validates a single clinical metric definition.
 * @param data - The data to validate
 * @returns Parsed and validated metric definition or throws ZodError
 */
export function parseClinicalMetricDefinition(data: unknown): ClinicalMetricDefinition {
  return ClinicalMetricDefinitionSchema.parse(data);
}

/**
 * Safely validates a single clinical metric definition.
 * @param data - The data to validate
 * @returns Safe parse result with success flag and data/error
 */
export function safeParseClinicalMetricDefinition(data: unknown) {
  return ClinicalMetricDefinitionSchema.safeParse(data);
}
