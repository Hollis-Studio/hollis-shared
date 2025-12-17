/**
 * @ai-context Reference Range domain contracts | types and schemas for clinical reference ranges
 *
 * This module provides the canonical definitions for the Dynamic Clinical Reference Range System:
 * - Age brackets, biological sex, pregnancy status enums
 * - System reference range types and schemas
 * - Modifier types, logic types, and schemas
 * - Hard limits types and schemas
 * - Resolution context and result types
 *
 * IMPORTANT: All reference range operations MUST use these types.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// AGE BRACKETS
// ============================================================================

export const AGE_BRACKETS = ['pediatric', '18-29', '30-39', '40-49', '50-59', '60+'] as const;
export type AgeBracket = (typeof AGE_BRACKETS)[number];

export const AgeBracketSchema = z.enum(AGE_BRACKETS);

export const AGE_BRACKET = {
  PEDIATRIC: 'pediatric' as AgeBracket,
  YOUNG_ADULT: '18-29' as AgeBracket,
  THIRTIES: '30-39' as AgeBracket,
  FORTIES: '40-49' as AgeBracket,
  FIFTIES: '50-59' as AgeBracket,
  SENIORS: '60+' as AgeBracket,
} as const;

export const AGE_BRACKET_LABELS: Record<AgeBracket, string> = {
  pediatric: 'Pediatric (<18)',
  '18-29': '18-29 years',
  '30-39': '30-39 years',
  '40-49': '40-49 years',
  '50-59': '50-59 years',
  '60+': '60+ years',
};

// ============================================================================
// BIOLOGICAL SEX
// ============================================================================

export const REF_RANGE_BIOLOGICAL_SEXES = ['male', 'female', 'any'] as const;
export type RefRangeBiologicalSex = (typeof REF_RANGE_BIOLOGICAL_SEXES)[number];

export const RefRangeBiologicalSexSchema = z.enum(REF_RANGE_BIOLOGICAL_SEXES);

export const REF_RANGE_BIOLOGICAL_SEX = {
  MALE: 'male' as RefRangeBiologicalSex,
  FEMALE: 'female' as RefRangeBiologicalSex,
  ANY: 'any' as RefRangeBiologicalSex,
} as const;

export const REF_RANGE_BIOLOGICAL_SEX_LABELS: Record<RefRangeBiologicalSex, string> = {
  male: 'Male',
  female: 'Female',
  any: 'Any',
};

// ============================================================================
// PREGNANCY STATUS
// ============================================================================

export const REF_RANGE_PREGNANCY_STATUSES = [
  'not_pregnant',
  'trimester_1',
  'trimester_2',
  'trimester_3',
  'postpartum',
] as const;
export type RefRangePregnancyStatus = (typeof REF_RANGE_PREGNANCY_STATUSES)[number];

export const RefRangePregnancyStatusSchema = z.enum(REF_RANGE_PREGNANCY_STATUSES);

export const REF_RANGE_PREGNANCY_STATUS = {
  NOT_PREGNANT: 'not_pregnant' as RefRangePregnancyStatus,
  TRIMESTER_1: 'trimester_1' as RefRangePregnancyStatus,
  TRIMESTER_2: 'trimester_2' as RefRangePregnancyStatus,
  TRIMESTER_3: 'trimester_3' as RefRangePregnancyStatus,
  POSTPARTUM: 'postpartum' as RefRangePregnancyStatus,
} as const;

export const REF_RANGE_PREGNANCY_STATUS_LABELS: Record<RefRangePregnancyStatus, string> = {
  not_pregnant: 'Not Pregnant',
  trimester_1: 'Trimester 1',
  trimester_2: 'Trimester 2',
  trimester_3: 'Trimester 3',
  postpartum: 'Postpartum',
};

// ============================================================================
// REFERENCE RANGE MODIFIER TYPES
// ============================================================================

export const REFERENCE_RANGE_MODIFIER_TYPES = [
  'AGE_BRACKET',
  'BIOLOGICAL_SEX',
  'PREGNANCY_STATUS',
] as const;
export type ReferenceRangeModifierType = (typeof REFERENCE_RANGE_MODIFIER_TYPES)[number];

export const ReferenceRangeModifierTypeSchema = z.enum(REFERENCE_RANGE_MODIFIER_TYPES);

export const REFERENCE_RANGE_MODIFIER_TYPE = {
  AGE_BRACKET: 'AGE_BRACKET' as ReferenceRangeModifierType,
  BIOLOGICAL_SEX: 'BIOLOGICAL_SEX' as ReferenceRangeModifierType,
  PREGNANCY_STATUS: 'PREGNANCY_STATUS' as ReferenceRangeModifierType,
} as const;

export const REFERENCE_RANGE_MODIFIER_TYPE_LABELS: Record<ReferenceRangeModifierType, string> = {
  AGE_BRACKET: 'Age Bracket',
  BIOLOGICAL_SEX: 'Biological Sex',
  PREGNANCY_STATUS: 'Pregnancy Status',
};

// ============================================================================
// REFERENCE RANGE MODIFIER LOGIC TYPES
// ============================================================================

export const REFERENCE_RANGE_MODIFIER_LOGIC_TYPES = ['OVERRIDE', 'OFFSET', 'MULTIPLIER'] as const;
export type ReferenceRangeModifierLogic = (typeof REFERENCE_RANGE_MODIFIER_LOGIC_TYPES)[number];

export const ReferenceRangeModifierLogicSchema = z.enum(REFERENCE_RANGE_MODIFIER_LOGIC_TYPES);

export const REFERENCE_RANGE_MODIFIER_LOGIC = {
  OVERRIDE: 'OVERRIDE' as ReferenceRangeModifierLogic,
  OFFSET: 'OFFSET' as ReferenceRangeModifierLogic,
  MULTIPLIER: 'MULTIPLIER' as ReferenceRangeModifierLogic,
} as const;

export const REFERENCE_RANGE_MODIFIER_LOGIC_LABELS: Record<ReferenceRangeModifierLogic, string> = {
  OVERRIDE: 'Override (replaces range)',
  OFFSET: 'Offset (adds to min/max)',
  MULTIPLIER: 'Multiplier (scales min/max)',
};

// ============================================================================
// SYSTEM REFERENCE RANGE SCHEMAS
// ============================================================================

/**
 * Base reference range values (min/max).
 */
export const ReferenceRangeValuesSchema = z.object({
  min: z.number(),
  max: z.number(),
});
export type ReferenceRangeValues = z.infer<typeof ReferenceRangeValuesSchema>;

/**
 * System reference range - the base range for a metric.
 */
export const SystemReferenceRangeSchema = z.object({
  id: z.string().uuid(),
  metricKey: z.string().min(1),
  unit: z.string().min(1),
  baseMin: z.number(),
  baseMax: z.number(),
  optimalMin: z.number().nullable().optional(),
  optimalMax: z.number().nullable().optional(),
  source: z.string().nullable().optional(),
  effectiveFrom: z.coerce.date(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type SystemReferenceRange = z.infer<typeof SystemReferenceRangeSchema>;

/**
 * Create/update payload for system reference range.
 */
export const SystemReferenceRangeCreateSchema = z.object({
  metricKey: z.string().min(1),
  unit: z.string().min(1),
  baseMin: z.number(),
  baseMax: z.number(),
  optimalMin: z.number().nullable().optional(),
  optimalMax: z.number().nullable().optional(),
  source: z.string().nullable().optional(),
  effectiveFrom: z.coerce.date().optional(),
});
export type SystemReferenceRangeCreate = z.infer<typeof SystemReferenceRangeCreateSchema>;

export const SystemReferenceRangeUpdateSchema = SystemReferenceRangeCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
});
export type SystemReferenceRangeUpdate = z.infer<typeof SystemReferenceRangeUpdateSchema>;

// ============================================================================
// REFERENCE RANGE MODIFIER SCHEMAS
// ============================================================================

/**
 * Reference range modifier - population-specific adjustments.
 */
export const ReferenceRangeModifierSchema = z.object({
  id: z.string().uuid(),
  referenceRangeId: z.string().uuid(),
  modifierType: ReferenceRangeModifierTypeSchema,
  modifierValue: z.string().min(1),
  logicType: ReferenceRangeModifierLogicSchema,
  minAdjustment: z.number().nullable().optional(),
  maxAdjustment: z.number().nullable().optional(),
  source: z.string().nullable().optional(),
  priority: z.number().int().default(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type ReferenceRangeModifier = z.infer<typeof ReferenceRangeModifierSchema>;

/**
 * Create/update payload for reference range modifier.
 */
export const ReferenceRangeModifierCreateSchema = z.object({
  referenceRangeId: z.string().uuid(),
  modifierType: ReferenceRangeModifierTypeSchema,
  modifierValue: z.string().min(1),
  logicType: ReferenceRangeModifierLogicSchema,
  minAdjustment: z.number().nullable().optional(),
  maxAdjustment: z.number().nullable().optional(),
  source: z.string().nullable().optional(),
  priority: z.number().int().optional(),
});
export type ReferenceRangeModifierCreate = z.infer<typeof ReferenceRangeModifierCreateSchema>;

export const ReferenceRangeModifierUpdateSchema = ReferenceRangeModifierCreateSchema.partial();
export type ReferenceRangeModifierUpdate = z.infer<typeof ReferenceRangeModifierUpdateSchema>;

// ============================================================================
// METRIC HARD LIMITS SCHEMAS
// ============================================================================

/**
 * Metric hard limits - absolute clinical safety bounds.
 */
export const MetricHardLimitsSchema = z.object({
  id: z.string().uuid(),
  referenceRangeId: z.string().uuid(),
  hardMin: z.number(),
  hardMax: z.number(),
  rationale: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type MetricHardLimits = z.infer<typeof MetricHardLimitsSchema>;

/**
 * Create/update payload for metric hard limits.
 */
export const MetricHardLimitsCreateSchema = z.object({
  referenceRangeId: z.string().uuid(),
  hardMin: z.number(),
  hardMax: z.number(),
  rationale: z.string().nullable().optional(),
});
export type MetricHardLimitsCreate = z.infer<typeof MetricHardLimitsCreateSchema>;

export const MetricHardLimitsUpdateSchema = MetricHardLimitsCreateSchema.partial();
export type MetricHardLimitsUpdate = z.infer<typeof MetricHardLimitsUpdateSchema>;

// ============================================================================
// RESOLUTION CONTEXT AND RESULT SCHEMAS
// ============================================================================

/**
 * Context for resolving a patient-specific reference range.
 */
export const ReferenceRangeContextSchema = z.object({
  metricKey: z.string().min(1),
  sex: RefRangeBiologicalSexSchema.nullable().optional(),
  age: z.union([AgeBracketSchema, z.number()]).nullable().optional(),
  pregnancyStatus: RefRangePregnancyStatusSchema.nullable().optional(),
  unit: z.string().optional(),
});
export type ReferenceRangeContext = z.infer<typeof ReferenceRangeContextSchema>;

/**
 * Breakdown of how a range was derived (for UI tooltips).
 */
export const RangeDerivationStepSchema = z.object({
  step: z.string(),
  description: z.string(),
  minBefore: z.number().optional(),
  maxBefore: z.number().optional(),
  minAfter: z.number(),
  maxAfter: z.number(),
  modifier: z.string().optional(),
});
export type RangeDerivationStep = z.infer<typeof RangeDerivationStepSchema>;

/**
 * Result of resolving a reference range, including breakdown for transparency.
 */
export const ResolvedReferenceRangeSchema = z.object({
  metricKey: z.string(),
  unit: z.string(),
  
  // Final calculated range (after modifiers, before hard limit clamping)
  calculatedMin: z.number(),
  calculatedMax: z.number(),
  
  // Final range (after hard limit clamping)
  finalMin: z.number(),
  finalMax: z.number(),
  
  // Optional optimal range
  optimalMin: z.number().nullable().optional(),
  optimalMax: z.number().nullable().optional(),
  
  // Hard limits that were applied
  hardLimits: z.object({
    hardMin: z.number(),
    hardMax: z.number(),
    wasMinClamped: z.boolean(),
    wasMaxClamped: z.boolean(),
  }).nullable().optional(),
  
  // Source information
  source: z.string().nullable().optional(),
  
  // Derivation breakdown for UI
  derivation: z.array(RangeDerivationStepSchema),
  
  // Applied modifiers summary
  appliedModifiers: z.array(z.object({
    type: ReferenceRangeModifierTypeSchema,
    value: z.string(),
    logicType: ReferenceRangeModifierLogicSchema,
  })),
});
export type ResolvedReferenceRange = z.infer<typeof ResolvedReferenceRangeSchema>;

// ============================================================================
// AUDIT LOG SCHEMAS
// ============================================================================

export const REFERENCE_RANGE_AUDIT_ACTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'ACTIVATE',
  'DEACTIVATE',
] as const;
export type ReferenceRangeAuditAction = (typeof REFERENCE_RANGE_AUDIT_ACTIONS)[number];

export const ReferenceRangeAuditActionSchema = z.enum(REFERENCE_RANGE_AUDIT_ACTIONS);

export const REFERENCE_RANGE_ENTITY_TYPES = ['SYSTEM_RANGE', 'MODIFIER', 'HARD_LIMIT'] as const;
export type ReferenceRangeEntityType = (typeof REFERENCE_RANGE_ENTITY_TYPES)[number];

export const ReferenceRangeEntityTypeSchema = z.enum(REFERENCE_RANGE_ENTITY_TYPES);

export const ReferenceRangeAuditLogSchema = z.object({
  id: z.string().uuid(),
  referenceRangeId: z.string().uuid().nullable().optional(),
  adminId: z.string(),
  action: ReferenceRangeAuditActionSchema,
  entityType: ReferenceRangeEntityTypeSchema,
  entityId: z.string().nullable().optional(),
  payload: z.record(z.unknown()),
  reason: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
});
export type ReferenceRangeAuditLog = z.infer<typeof ReferenceRangeAuditLogSchema>;

// ============================================================================
// SYSTEM REFERENCE RANGE WITH RELATIONS (for API responses)
// ============================================================================

/**
 * Full system reference range with modifiers and hard limits.
 */
export const SystemReferenceRangeFullSchema = SystemReferenceRangeSchema.extend({
  modifiers: z.array(ReferenceRangeModifierSchema).optional(),
  hardLimits: MetricHardLimitsSchema.nullable().optional(),
});
export type SystemReferenceRangeFull = z.infer<typeof SystemReferenceRangeFullSchema>;

// ============================================================================
// HARD LIMIT BYPASS (for HealthMetricGoal)
// ============================================================================

/**
 * Schema for hard limit bypass request in goal setting.
 */
export const HardLimitBypassRequestSchema = z.object({
  allowHardLimitBypass: z.boolean(),
  bypassJustification: z.string().min(10, 'Justification must be at least 10 characters').nullable(),
}).refine(
  (data) => !data.allowHardLimitBypass || (data.allowHardLimitBypass && data.bypassJustification),
  { message: 'Bypass justification is required when allowing hard limit bypass' }
);
export type HardLimitBypassRequest = z.infer<typeof HardLimitBypassRequestSchema>;
