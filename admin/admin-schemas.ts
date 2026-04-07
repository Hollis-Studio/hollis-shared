/**
 * @ai-context Admin Zod Schemas | Validation schemas for admin operations
 *
 * This module provides Zod schemas for validating admin-related payloads.
 * Schemas match the types defined in admin-types.ts and can be used for:
 * - Client-side form validation
 * - Server-side request validation
 * - Type inference via z.infer
 *
 * deps: zod, domain types | consumers: web-admin/*, server/src/routes/admin/*
 */

import { z } from "zod";
import {
    AccountStatusSchema,
    ActivityLevelSchema,
    SettableAccountStatusSchema,
    BiologicalSexSchema,
    FitnessExperienceSchema,
    GoalDataSourceSchema,
    LegacyGoalDataSourceSchema,
    PregnancyStatusSchema,
    PrimaryGoalSchema,
    RegistrationStatusSchema,
    StrategyStatusSchema,
    StrategyTypeSchema,
    UserRoleSchema,
    UserTierSchema,
    isoDateSchema,
    normalizeGoalDataSource,
} from "../domain";
import {
    AdminTaskPrioritySchema,
    AdminTaskStatusSchema,
    AdminTaskTypeSchema,
} from "../domain/admin-tasks";
import {
    InjuryRecoveryStatusSchema,
    LimitationSeveritySchema,
    MedicalConditionStatusSchema,
} from "../domain/clinical";
import {
    LabMappingStatusSchema,
    LabMetricCategorySchema,
    LabMetricDirectionalitySchema,
    MetricApprovalStatusSchema,
} from "../domain/labs";
import { createPaginatedListSchema } from "../domain/pagination";
import { DynamicMetricGoalDataSourceSchema } from "../domain/training";
import { VolumeLevelSchema } from "../primitives/volume-level";
import { USER_ID_REGEX, heightCmSchema, weightKgSchema } from "../schemas";
import { FulfillmentStatusSchema } from "../stripe/order";
import { SubscriptionStatusSchema } from "../stripe/subscription";

// ============================================================================
// ADMIN-SPECIFIC ENUMS
// ============================================================================

/**
 * Admin compliance status schema.
 */
export const adminComplianceStatusSchema = z.enum([
  "excellent",
  "good",
  "at-risk",
  "non-compliant",
]);
export type AdminComplianceStatus = z.infer<typeof adminComplianceStatusSchema>;

/**
 * Volume level schema for training phases.
 * @deprecated Use `VolumeLevelSchema` (PascalCase) from `../primitives/volume-level` directly.
 */
export const volumeLevelSchema = VolumeLevelSchema;

/**
 * Limitation severity schema.
 * @deprecated Use `LimitationSeveritySchema` (PascalCase) from `../domain/clinical` directly.
 */
export const limitationSeveritySchema = LimitationSeveritySchema;

/**
 * Injury recovery status schema.
 * @deprecated Use `InjuryRecoveryStatusSchema` (PascalCase) from `../domain/clinical` directly.
 */
export const injuryRecoveryStatusSchema = InjuryRecoveryStatusSchema;

/**
 * Medical condition status schema.
 * @deprecated Use `MedicalConditionStatusSchema` (PascalCase) from `../domain/clinical` directly.
 */
export const medicalConditionStatusSchema = MedicalConditionStatusSchema;

// ============================================================================
// PATIENT MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Patient summary schema.
 */
export const patientSummarySchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  tier: UserTierSchema,
  status: adminComplianceStatusSchema.nullable(),
  complianceScore: z.number().min(0).max(100).nullable(),
  lastLog: z.string().nullable(),
  accountStatus: AccountStatusSchema,
});
export type PatientSummary = z.infer<typeof patientSummarySchema>;

/**
 * Canonical paginated patient list response.
 * Shape: { data: PatientSummary[], pagination: PaginationMeta }
 */
export const patientListResponseSchema =
  createPaginatedListSchema(patientSummarySchema);
export type PatientListResponse = z.infer<typeof patientListResponseSchema>;

/**
 * Admin patient document summary schema used by patient detail responses.
 */
export const patientDocumentSummarySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  type: z.string().min(1).max(100),
  url: z.string().url(),
  uploadedAt: z.string(),
});
export type PatientDocumentSummary = z.infer<
  typeof patientDocumentSummarySchema
>;

/**
 * Admin patient membership summary schema used by patient detail responses.
 */
export const patientMembershipSummarySchema = z.object({
  id: z.string(),
  tier: UserTierSchema,
  startDate: z.string(),
  endDate: z.string().optional(),
});
export type PatientMembershipSummary = z.infer<
  typeof patientMembershipSummarySchema
>;

/**
 * Admin medication schema.
 */
export const adminMedicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  dosage: z.string().min(1).max(100),
  frequency: z.string().min(1).max(200),
  notes: z.string().max(5000).optional(),
});
export type AdminMedication = z.infer<typeof adminMedicationSchema>;

/**
 * Admin limitation schema.
 */
export const adminLimitationSchema = z.object({
  id: z.string(),
  description: z.string().min(1).max(500),
  severity: limitationSeveritySchema.optional(),
  notes: z.string().max(5000).optional(),
});
export type AdminLimitation = z.infer<typeof adminLimitationSchema>;

/**
 * Admin injury schema.
 */
export const adminInjurySchema = z.object({
  id: z.string(),
  description: z.string().min(1).max(500),
  bodyPart: z.string().max(100).optional(),
  occurredAt: isoDateSchema.optional(),
  severity: limitationSeveritySchema.optional(),
  recoveryStatus: injuryRecoveryStatusSchema.optional(),
  notes: z.string().max(5000).optional(),
});
export type AdminInjury = z.infer<typeof adminInjurySchema>;

/**
 * Admin medical condition schema.
 */
export const adminMedicalConditionSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  status: medicalConditionStatusSchema,
  diagnosisDate: isoDateSchema.optional(),
  notes: z.string().max(5000).optional(),
});
export type AdminMedicalCondition = z.infer<typeof adminMedicalConditionSchema>;

/**
 * Patient profile update payload schema.
 */
export const patientProfileUpdatePayloadSchema = z.object({
  fullName: z.string().min(1).max(200).optional(),
  preferredName: z.string().max(100).nullable().optional(),
  email: z.string().email().optional(),
  dateOfBirth: isoDateSchema.optional(),
  biologicalSex: BiologicalSexSchema.nullable().optional(),
  pregnancyStatus: PregnancyStatusSchema.nullable().optional(),
  pregnancyDueDate: isoDateSchema.nullable().optional(),
  occupation: z.string().max(200).nullable().optional(),
  bio: z.string().max(5000).nullable().optional(),
  heightCm: heightCmSchema.optional(),
  weightKg: weightKgSchema.optional(),
  activityLevel: ActivityLevelSchema.nullable().optional(),
  experienceLevel: FitnessExperienceSchema.nullable().optional(),
  primaryGoal: PrimaryGoalSchema.nullable().optional(),
  primaryGoalNote: z.string().max(500).nullable().optional(),
  medications: z.array(adminMedicationSchema).optional(),
  limitations: z.array(adminLimitationSchema).optional(),
  injuries: z.array(adminInjurySchema).optional(),
  medicalConditions: z.array(adminMedicalConditionSchema).optional(),
});
export type PatientProfileUpdatePayload = z.infer<
  typeof patientProfileUpdatePayloadSchema
>;

/**
 * Patient goals update payload schema.
 */
export const patientGoalsUpdatePayloadSchema = z.object({
  calorieTarget: z.number().positive().max(10000).optional(),
  proteinTarget: z.number().positive().max(1000).optional(),
  carbTarget: z.number().positive().max(2000).optional(),
  fatTarget: z.number().positive().max(1000).optional(),
  workoutsPerWeek: z.number().min(0).max(14).optional(),
  sleepHoursTarget: z.number().min(4).max(14).optional(),
  weeklyWeightChangeTarget: z.number().min(-5).max(5).optional(),
});
export type PatientGoalsUpdatePayload = z.infer<
  typeof patientGoalsUpdatePayloadSchema
>;

/**
 * Patient admin controls payload schema.
 */
export const patientAdminControlsPayloadSchema = z.object({
  tier: UserTierSchema.nullable().optional(),
  role: UserRoleSchema.nullable().optional(),
  assignedClinicianId: z.string().nullable().optional(),
  assignedTrainerId: z.string().nullable().optional(),
  accountStatus: SettableAccountStatusSchema.optional(),
  timezone: z.string().nullable().optional(),
});
export type PatientAdminControlsPayload = z.infer<
  typeof patientAdminControlsPayloadSchema
>;

// ============================================================================
// CLINICIAN MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Clinician summary schema.
 */
export const clinicianSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  role: UserRoleSchema,
  specialty: z.string(),
});
export type ClinicianSummary = z.infer<typeof clinicianSummarySchema>;

/**
 * Availability slot schema.
 */
export const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isAvailable: z.boolean(),
});
export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>;

/**
 * Clinician availability schema.
 */
export const clinicianAvailabilitySchema = z.object({
  clinicianId: z.string(),
  slots: z.array(availabilitySlotSchema),
});
export type ClinicianAvailability = z.infer<typeof clinicianAvailabilitySchema>;

/**
 * Provider schedule slot schema.
 */
export const providerScheduleSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startHour: z.number().min(0).max(23),
  endHour: z.number().min(0).max(24),
  isAvailable: z.boolean().optional(),
});
export type ProviderScheduleSlot = z.infer<typeof providerScheduleSlotSchema>;

/**
 * Provider schedule data schema.
 */
export const providerScheduleDataSchema = z.object({
  providerId: z.string(),
  slots: z.array(providerScheduleSlotSchema),
});
export type ProviderScheduleData = z.infer<typeof providerScheduleDataSchema>;

// ============================================================================
// REGISTRATION SCHEMAS
// ============================================================================

/**
 * Canonical max length for legacy registration prefill goal text.
 *
 * @deprecated Registration `primaryGoal` now uses `PrimaryGoalSchema` enum
 * validation instead of free-form text. This export remains for backward
 * compatibility with older consumers and generated artifacts.
 */
export const PREFILLED_PROFILE_PRIMARY_GOAL_MAX_LENGTH = 500;

/**
 * Prefilled profile schema.
 *
 * Key names MUST match the keys read by the signup route (auth.ts):
 * - `biologicalSex` (was `sex` — renamed for consistency with ClinicalProfile)
 * - `primaryGoal`   (was `goals` — renamed for consistency with ClinicalProfile)
 */
export const prefilledProfileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  heightCm: heightCmSchema.optional(),
  weightKg: weightKgSchema.optional(),
  dateOfBirth: isoDateSchema.optional(),
  biologicalSex: BiologicalSexSchema.optional(),
  primaryGoal: PrimaryGoalSchema.optional(),
  primaryGoalNote: z.string().max(500).optional(),
  /** Set by admin when rejecting a registration */
  rejectionReason: z.string().optional(),
  /** ISO timestamp when admin rejected the registration */
  rejectedAt: z.string().optional(),
});
export type PrefilledProfile = z.infer<typeof prefilledProfileSchema>;

/**
 * Registered user schema.
 */
export const registeredUserSchema = z.object({
  id: z.string(),
  barcode: z
    .string()
    .regex(USER_ID_REGEX, "Invalid barcode format (expected HH-XXXXXX)"),
  prefilledEmail: z.string().email().nullable().optional(),
  prefilledTier: UserTierSchema.nullable().optional(),
  prefilledProfile: prefilledProfileSchema.nullable().optional(),
  isRegistered: z.boolean(),
  registrationExpiresAt: z.string(),
  createdAt: z.string(),
  status: RegistrationStatusSchema,
  /** Billing status — null for unclaimed registrations or claimed without Stripe setup */
  billingStatus: z.string().nullable().optional(),
  registeredBy: z
    .object({
      id: z.string(),
      email: z.string().email(),
    })
    .nullable()
    .optional(),
});
export type RegisteredUser = z.infer<typeof registeredUserSchema>;

/**
 * Create registration payload schema.
 */
export const createRegistrationPayloadSchema = z.object({
  email: z.string().email().optional(),
  tier: UserTierSchema.optional(),
  profile: prefilledProfileSchema.optional(),
  expiresInDays: z.number().positive().max(365).default(30),
});
export type CreateRegistrationPayload = z.infer<
  typeof createRegistrationPayloadSchema
>;

// ============================================================================
// TRAINING STRATEGY SCHEMAS
// ============================================================================

/**
 * Create phase input schema.
 */
export const createPhaseInputSchema = z.object({
  name: z.string().min(1).max(200),
  order: z.number().min(0),
  weekCount: z.number().positive().max(52),
  intensityRange: z.string().max(100).optional(),
  volumeLevel: volumeLevelSchema.optional(),
  focusAreas: z.array(z.string().max(100)),
  notes: z.string().max(5000).optional(),
  isActive: z.boolean(),
  isCompleted: z.boolean(),
});
export type CreatePhaseInputFromSchema = z.infer<typeof createPhaseInputSchema>;

/**
 * Create goal input schema.
 */
export const createGoalInputSchema = z.object({
  goalMetric: z.string().min(1),
  goalTarget: z.number(),
  baselineValue: z.number().optional(),
  weight: z.number().min(0).max(1).optional(),
  linkedExerciseId: z.string().optional(),
  // DEFERRED [audit-05]: Admin strategy goal payloads still accept legacy goal data-source values to bridge pre-migration requests. Not material at <50 users pre-revenue. Revisit at scale.
  dataSource: z
    .union([GoalDataSourceSchema, LegacyGoalDataSourceSchema])
    .transform(normalizeGoalDataSource)
    .optional(),
  dataKey: z.string().min(1).optional(),
  dynamicMetricDefinition: z
    .object({
      dataSource: DynamicMetricGoalDataSourceSchema,
      dataKey: z.string().min(1),
      label: z.string().min(1),
      unit: z.string().min(1),
      direction: z.string().min(1),
      category: z.string().min(1),
    })
    .optional(),
});
export type CreateGoalInputFromSchema = z.infer<typeof createGoalInputSchema>;

/**
 * Update goal input schema.
 */
export const updateGoalInputSchema = z.object({
  goalTarget: z.number().optional(),
  baselineValue: z.number().optional(),
  currentValue: z.number().optional(),
  weight: z.number().min(0).max(1).optional(),
  /** Optional clinician notes about this metric update. */
  notes: z.string().max(2000).optional(),
});
export type UpdateGoalInputFromSchema = z.infer<typeof updateGoalInputSchema>;

/**
 * Create strategy input schema.
 */
export const createStrategyInputSchema = z.object({
  name: z.string().min(1).max(200),
  type: StrategyTypeSchema,
  goal: z.string().min(1).max(1000),
  description: z.string().max(5000).optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional(),
  status: StrategyStatusSchema.optional(),
  goals: z.array(createGoalInputSchema),
  phases: z.array(createPhaseInputSchema).optional(),
});
export type CreateStrategyInputFromSchema = z.infer<
  typeof createStrategyInputSchema
>;

/**
 * Fetch value request schema.
 */
export const fetchValueRequestSchema = z.object({
  // DEFERRED [audit-05]: Admin fetch-value requests still accept legacy goal data-source values to bridge pre-migration requests. Not material at <50 users pre-revenue. Revisit at scale.
  dataSource: z
    .union([GoalDataSourceSchema, LegacyGoalDataSourceSchema])
    .transform(normalizeGoalDataSource),
  dataKey: z.string().min(1),
  linkedExerciseId: z.string().optional(),
});
export type FetchValueRequest = z.infer<typeof fetchValueRequestSchema>;

/**
 * Fetch value response schema.
 */
export const fetchValueResponseSchema = z.object({
  found: z.boolean(),
  value: z.number().nullable(),
  date: z.string().nullable(),
});
export type FetchValueResponse = z.infer<typeof fetchValueResponseSchema>;

// ============================================================================
// SMART ASSIST PROGRESS SCHEMAS
// ============================================================================

/**
 * Smart Assist agent activity entry schema.
 */
export const smartAssistActivitySchema = z.object({
  timestamp: z.string(),
  type: z.enum([
    "search",
    "create",
    "select",
    "plan",
    "note",
    "thinking",
    "complete",
    "analyze",
  ]),
  message: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
});
export type SmartAssistActivity = z.infer<typeof smartAssistActivitySchema>;

/**
 * Smart Assist progress schema with real-time agent activity.
 */
export const smartAssistProgressSchema = z.object({
  step: z.number().min(0),
  totalSteps: z.number().positive(),
  phase: z.string(),
  detail: z.string().optional(),
  turn: z.number().optional(),
  maxTurns: z.number().optional(),
  activities: z.array(smartAssistActivitySchema).optional(),
  stats: z
    .object({
      exercisesSearched: z.number().optional(),
      exercisesCreated: z.number().optional(),
      exercisesSelected: z.number().optional(),
      notesCreated: z.number().optional(),
      goalsIdentified: z.number().optional(),
      phasesCreated: z.number().optional(),
    })
    .optional(),
});
export type SmartAssistProgress = z.infer<typeof smartAssistProgressSchema>;

/** @deprecated Use smartAssistActivitySchema instead */
// zod-manual: deprecated alias
export const workoutGenerationActivitySchema = smartAssistActivitySchema;
/** @deprecated Use smartAssistProgressSchema instead */
// zod-manual: deprecated alias
export const workoutGenerationProgressSchema = smartAssistProgressSchema;

/**
 * Workout plan generation params schema (excludes AbortSignal and callback).
 */
export const workoutPlanGenerationParamsSchema = z.object({
  userId: z.string(),
  weekStartDate: isoDateSchema,
  customPrompt: z.string().max(5000).optional(),
  overwriteMode: z.enum(["overwrite", "fillEmpty"]).optional(),
});
export type WorkoutPlanGenerationInput = z.infer<
  typeof workoutPlanGenerationParamsSchema
>;

// ============================================================================
// NUTRITION GENERATION SCHEMAS
// ============================================================================

/**
 * Nutrition preferences schema.
 */
export const nutritionPreferencesSchema = z.object({
  dietaryRestrictions: z.array(z.string().max(100)).optional(),
  allergies: z.array(z.string().max(100)).optional(),
  mealCount: z.number().min(1).max(10).optional(),
  cuisinePreferences: z.array(z.string().max(100)).optional(),
});
export type NutritionPreferences = z.infer<typeof nutritionPreferencesSchema>;

/**
 * Macro targets schema.
 */
export const macroTargetsSchema = z.object({
  dailyCalories: z.number().positive().max(10000).optional(),
  proteinGrams: z.number().positive().max(1000).optional(),
  carbsGrams: z.number().positive().max(2000).optional(),
  fatGrams: z.number().positive().max(1000).optional(),
});
export type MacroTargets = z.infer<typeof macroTargetsSchema>;

/**
 * Nutrition plan generation request schema.
 */
export const nutritionPlanGenerationRequestSchema = z.object({
  userId: z.string(),
  weekStartDate: isoDateSchema.optional(),
  customPrompt: z.string().max(5000).optional(),
  goals: z.array(z.string().max(200)).optional(),
  preferences: nutritionPreferencesSchema.optional(),
  macroTargets: macroTargetsSchema.optional(),
});
export type NutritionPlanGenerationRequest = z.infer<
  typeof nutritionPlanGenerationRequestSchema
>;

// ============================================================================
// LAB RESULT SCHEMAS (Provenance-First)
// ============================================================================

export const labMetricDefinitionSummarySchema = z.object({
  id: z.string(),
  code: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  category: LabMetricCategorySchema,
  canonicalUnit: z.string().min(1).max(50),
  directionality: LabMetricDirectionalitySchema,
  isCanonical: z.boolean().optional(),
  approvalStatus: MetricApprovalStatusSchema.optional(),
});
export type LabMetricDefinitionSummary = z.infer<
  typeof labMetricDefinitionSummarySchema
>;

/** Population qualifier for race/ethnicity/sex-specific lab results */
export const LabPopulationQualifierSchema = z
  .enum(["african", "non_african", "male", "female"])
  .nullable();
export type LabPopulationQualifier = z.infer<
  typeof LabPopulationQualifierSchema
>;

export const extractedLabObservationSchema = z.object({
  // Core raw fields
  rawAnalyteName: z.string().min(1).max(200),
  rawValueText: z.string().nullable().optional(),
  rawUnit: z.string().nullable().optional(),
  rawReferenceIntervalText: z.string().nullable().optional(),
  rawReferenceIntervalLow: z.number().nullable().optional(),
  rawReferenceIntervalHigh: z.number().nullable().optional(),
  rawFlag: z.string().nullable().optional(),
  observedAt: z.string().nullable().optional(),
  extractionConfidences: z.record(z.string(), z.number()).nullable().optional(),
  extractionFragments: z.record(z.string(), z.string()).nullable().optional(),

  // Extended extraction fields for complex results
  populationQualifier: LabPopulationQualifierSchema.optional(),
  parentAnalyte: z.string().max(200).nullable().optional(),
  isCalculated: z.boolean().nullable().optional(),
  calculationMethod: z.string().max(100).nullable().optional(),
  qualityIndicator: z.string().max(100).nullable().optional(),
  labComment: z.string().max(1000).nullable().optional(),

  // Canonicalization fields
  canonicalValue: z.number().nullable().optional(),
  canonicalUnit: z.string().nullable().optional(),
  metricDefinitionId: z.string().nullable().optional(),
  metricDefinitionCode: z.string().nullable().optional(),
  metricDefinitionName: z.string().nullable().optional(),
  mappingStatus: LabMappingStatusSchema,
  mappingConfidence: z.number().min(0).max(1).nullable().optional(),
});
export type ExtractedLabObservation = z.infer<
  typeof extractedLabObservationSchema
>;

export const extractedLabReportSchema = z.object({
  reportDate: z.string().nullable().optional(),
  labName: z.string().nullable().optional(),
  labLocation: z.string().nullable().optional(),
  specimenType: z.string().nullable().optional(),
  orderingProvider: z.string().nullable().optional(),
  panelName: z.string().nullable().optional(),
  panelCode: z.string().nullable().optional(),
  collectionTime: z.string().nullable().optional(),
  fastingStatus: z.string().nullable().optional(),
  specimenQualityNotes: z.string().max(1000).nullable().optional(),
  extractionConfidences: z.record(z.string(), z.number()).nullable().optional(),
  extractionFragments: z.record(z.string(), z.string()).nullable().optional(),
});
export type ExtractedLabReport = z.infer<typeof extractedLabReportSchema>;

export const labDataExtractionResultSchema = z.object({
  report: extractedLabReportSchema,
  observations: z.array(extractedLabObservationSchema),
});
export type LabDataExtractionResult = z.infer<
  typeof labDataExtractionResultSchema
>;

/**
 * Canonical MetricDefinition identifier for verified lab observation payloads.
 *
 * When present, this must reference a persisted MetricDefinition UUID.
 * Observations still awaiting review should omit the field or send `null`.
 */
export const labMetricDefinitionIdInputSchema = z
  .string()
  .uuid("metricDefinitionId must be a valid UUID");

export const labObservationInputSchema = z.object({
  rawAnalyteName: z.string().min(1).max(200),
  rawValueText: z.string().nullable().optional(),
  rawUnit: z.string().nullable().optional(),
  rawReferenceIntervalText: z.string().nullable().optional(),
  rawReferenceIntervalLow: z.number().nullable().optional(),
  rawReferenceIntervalHigh: z.number().nullable().optional(),
  rawFlag: z.string().nullable().optional(),
  observedAt: z.string().nullable().optional(),
  canonicalValue: z.number().nullable().optional(),
  canonicalUnit: z.string().nullable().optional(),
  labReferenceIntervalLow: z.number().nullable().optional(),
  labReferenceIntervalHigh: z.number().nullable().optional(),
  labReferenceIntervalText: z.string().nullable().optional(),
  labFlag: z.string().nullable().optional(),
  metricDefinitionId: labMetricDefinitionIdInputSchema.nullable().optional(),
  mappingStatus: LabMappingStatusSchema,
  mappingConfidence: z.number().min(0).max(1).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  tags: z.array(z.string().max(100)).nullable().optional(),
});
// Type exported from admin-types.ts — do not re-export here to avoid TS2308

export const createLabReportPayloadSchema = z.object({
  reportDate: isoDateSchema,
  labName: z.string().max(200).nullable().optional(),
  labLocation: z.string().max(200).nullable().optional(),
  specimenType: z.string().max(200).nullable().optional(),
  orderingProvider: z.string().max(200).nullable().optional(),
  panelName: z.string().max(200).nullable().optional(),
  panelCode: z.string().max(100).nullable().optional(),
  sourceDocumentId: z.string().nullable().optional(),
  extractionConfidences: z.record(z.string(), z.number()).nullable().optional(),
  extractionFragments: z.record(z.string(), z.string()).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  observations: z.array(labObservationInputSchema).min(1),
});
export type CreateLabReportPayload = z.infer<
  typeof createLabReportPayloadSchema
>;

// ============================================================================
// INTAKE & QUESTIONNAIRE SCHEMAS
// ============================================================================

/**
 * Intake questionnaire response schema.
 */
export const intakeQuestionnaireResponseSchema = z.object({
  userId: z.string(),
  completedAt: z.string().optional(),
  responses: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
  ),
});
export type IntakeQuestionnaireResponse = z.infer<
  typeof intakeQuestionnaireResponseSchema
>;

/**
 * Client intake payload schema.
 *
 * Supports both:
 * - Structured data (arrays of objects) - preferred for new submissions
 * - String data (semicolon-separated) - legacy format for backwards compatibility
 *
 * Baseline metrics (height, weight, DOB, sex) update ClinicalProfile directly.
 */
export const clientIntakePayloadSchema = z.object({
  // Goals & Preferences
  goals: z.string().min(1).max(5000),
  experienceLevel: z.string().min(1).max(100),
  preferences: z.string().max(5000).optional(),
  customPreferences: z.string().max(5000).optional(), // Free-form custom preferences

  // Baseline Metrics (stored in ClinicalProfile)
  baselineMetrics: z
    .object({
      heightCm: z.number().positive().optional(),
      weightKg: z.number().positive().optional(),
      dateOfBirth: isoDateSchema.optional(),
      biologicalSex: BiologicalSexSchema.optional(),
    })
    .optional(),

  // Clinical Data - supports both structured arrays and legacy string format
  // Structured format (preferred)
  medicationsData: z.array(adminMedicationSchema).optional(),
  limitationsData: z.array(adminLimitationSchema).optional(),
  injuriesData: z.array(adminInjurySchema).optional(),
  medicalConditionsData: z.array(adminMedicalConditionSchema).optional(),

  // Legacy string format (for backwards compatibility)
  injuries: z.string().max(5000).optional(),
  limitations: z.string().max(5000).optional(),
  medications: z.string().max(5000).optional(),
  medicalConditions: z.string().max(5000).optional(),
});
export type ClientIntakePayload = z.infer<typeof clientIntakePayloadSchema>;

// ============================================================================
// EXERCISE FILTER SCHEMAS
// ============================================================================

/**
 * Exercise filter params schema.
 */
export const exerciseFilterParamsSchema = z.object({
  search: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  muscleGroup: z.string().max(100).optional(),
  equipment: z.string().max(100).optional(),
  difficulty: z.string().max(50).optional(),
  tag: z.string().max(100).optional(),
  limit: z.number().positive().max(100).optional(),
  offset: z.number().min(0).optional(),
});
export type ExerciseFilterParamsFromSchema = z.infer<
  typeof exerciseFilterParamsSchema
>;

// ============================================================================
// ANALYTICS SCHEMAS
// ============================================================================

/**
 * Admin analytics data schema.
 */
export const adminAnalyticsDataSchema = z.object({
  totalPatients: z.number().min(0),
  activePatients: z.number().min(0),
  newPatientsThisMonth: z.number().min(0),
  averageComplianceScore: z.number().min(0).max(100),
  appointmentsToday: z.number().min(0),
  pendingLabReviews: z.number().min(0),
});
export type AdminAnalyticsData = z.infer<typeof adminAnalyticsDataSchema>;

// ============================================================================
// METRIC GOVERNANCE SCHEMAS
// ============================================================================

/**
 * Pending metric review schema - represents a metric awaiting admin review.
 */
export const pendingMetricReviewSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  category: LabMetricCategorySchema,
  canonicalUnit: z.string(),
  directionality: LabMetricDirectionalitySchema,
  aliases: z.array(z.string()),
  approvalStatus: MetricApprovalStatusSchema,
  isCanonical: z.boolean(),
  createdBy: z.string().nullable(),
  createdAt: z.string(),
  observationCount: z.number().min(0),
  suggestedMergeTargets: z
    .array(
      z.object({
        id: z.string(),
        code: z.string(),
        name: z.string(),
        similarity: z.number().min(0).max(1),
      }),
    )
    .optional(),
});
export type PendingMetricReview = z.infer<typeof pendingMetricReviewSchema>;

/**
 * Suggested new metric schema - proposed metric not yet persisted.
 */
export const suggestedNewMetricSchema = z.object({
  suggestedCode: z.string(),
  suggestedName: z.string(),
  suggestedCategory: LabMetricCategorySchema,
  suggestedAliases: z.array(z.string()),
  canonicalUnit: z.string(),
  directionality: LabMetricDirectionalitySchema,
  /** User-facing description of what this metric measures and why it matters for health */
  description: z.string().optional(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().optional(),
  rawAnalyteName: z.string(),
  isPopulationVariant: z.boolean().optional(),
  parentMetricCode: z.string().optional(),
});
export type SuggestedNewMetric = z.infer<typeof suggestedNewMetricSchema>;

/**
 * Self-review summary for governed lab extraction responses.
 */
export const labDataExtractionSelfReviewSummarySchema = z.object({
  iterationsPerformed: z.number().int().min(0),
  duplicatesDetected: z.number().int().min(0),
  garbageFlagged: z.number().int().min(0),
  verifiedCreations: z.number().int().min(0),
});
export type LabDataExtractionSelfReviewSummaryFromSchema = z.infer<
  typeof labDataExtractionSelfReviewSummarySchema
>;

/**
 * Lab data extraction response extended with metric-governance review data.
 * Canonical schema for the governed extraction payload returned after
 * canonicalization and self-review.
 */
export const labDataExtractionResultWithGovernanceSchema =
  labDataExtractionResultSchema.extend({
    suggestedNewMetrics: z.array(suggestedNewMetricSchema),
    selfReviewSummary: labDataExtractionSelfReviewSummarySchema.optional(),
  });
export type LabDataExtractionResultWithGovernanceFromSchema = z.infer<
  typeof labDataExtractionResultWithGovernanceSchema
>;

/**
 * Metric governance action schema - approve/reject a pending metric.
 */
export const metricGovernanceActionSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reviewNotes: z.string().max(2000).optional(),
  setAsCanonical: z.boolean().optional(),
  /** When rejecting a metric with linked records, re-link them to this APPROVED metric first */
  replacementMetricId: z.string().optional(),
});
export type MetricGovernanceAction = z.infer<
  typeof metricGovernanceActionSchema
>;

/**
 * Merge metrics payload schema - merge source metrics into target.
 */
export const mergeMetricsPayloadSchema = z.object({
  sourceMetricIds: z.array(z.string()).min(1),
  targetMetricId: z.string(),
  migrateObservations: z.boolean().default(true),
  reviewNotes: z.string().max(2000).optional(),
});
export type MergeMetricsPayload = z.infer<typeof mergeMetricsPayloadSchema>;

/**
 * Metric governance result schema - response from governance actions.
 */
export const metricGovernanceResultSchema = z.object({
  success: z.boolean(),
  metricId: z.string(),
  action: z.enum(["approved", "rejected", "merged", "promoted"]),
  observationsMigrated: z.number().optional(),
  message: z.string().optional(),
});
export type MetricGovernanceResult = z.infer<
  typeof metricGovernanceResultSchema
>;

// ============================================================================
// TRAINER SUMMARY SCHEMA
// ============================================================================

/**
 * Trainer summary schema - summary view of a fitness trainer.
 */
export const trainerSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  role: UserRoleSchema,
});
export type TrainerSummaryFromSchema = z.infer<typeof trainerSummarySchema>;

// ============================================================================
// LAB METRIC SEARCH RESPONSE SCHEMA
// ============================================================================

/**
 * Response schema for lab metric semantic search endpoint.
 */
export const labMetricSearchResponseSchema = z.object({
  results: z.array(labMetricDefinitionSummarySchema),
});
export type LabMetricSearchResponseFromSchema = z.infer<
  typeof labMetricSearchResponseSchema
>;

// ============================================================================
// PENDING METRICS RESPONSE SCHEMA
// ============================================================================

/**
 * Response schema for the pending metrics governance endpoint.
 */
export const pendingMetricsResponseSchema = z.object({
  metrics: z.array(pendingMetricReviewSchema),
  total: z.number().int().min(0),
});
export type PendingMetricsResponseFromSchema = z.infer<
  typeof pendingMetricsResponseSchema
>;
// PendingMetricsResponse alias is exported from admin/labs.ts for backwards compatibility.

// ============================================================================
// ADMIN TASK ACTION REQUEST SCHEMAS
// ============================================================================

/**
 * Schema for resolving an admin task (optional resolution notes).
 */
export const resolveTaskBodySchema = z.object({
  notes: z.string().max(2000).optional(),
});
export type ResolveTaskBody = z.infer<typeof resolveTaskBodySchema>;

/**
 * Schema for dismissing an admin task (reason is required).
 */
export const dismissTaskBodySchema = z.object({
  reason: z.string().min(1, "reason is required").max(2000),
});
export type DismissTaskBody = z.infer<typeof dismissTaskBodySchema>;

/**
 * Schema for assigning an admin task to an admin user.
 */
export const assignTaskBodySchema = z.object({
  assigneeId: z.string().min(1, "assigneeId is required"),
});
export type AssignTaskBody = z.infer<typeof assignTaskBodySchema>;

// ============================================================================
// ADMIN TASK SCHEMAS
// ============================================================================

/**
 * Admin task schema — mirrors the AdminTask interface in tasksService.ts.
 */
export const adminTaskSchema = z.object({
  id: z.string(),
  taskType: AdminTaskTypeSchema,
  title: z.string(),
  description: z.string().nullable().optional(),
  priority: AdminTaskPrioritySchema,
  status: AdminTaskStatusSchema,
  assignedTo: z.string().nullable().optional(),
  resolvedAt: z.string().nullable().optional(),
  resolvedBy: z.string().nullable().optional(),
  resolution: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string().nullable().optional(),
  subscriptionId: z.string().nullable().optional(),
  orderId: z.string().nullable().optional(),
  user: z
    .object({
      id: z.string(),
      email: z.string(),
      firstName: z.string().nullable().optional(),
      lastName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  subscription: z
    .object({
      id: z.string(),
      tier: z.string(),
      status: SubscriptionStatusSchema,
    })
    .nullable()
    .optional(),
  order: z
    .object({
      id: z.string(),
      totalInCents: z.number().int(),
      fulfillmentStatus: FulfillmentStatusSchema,
    })
    .nullable()
    .optional(),
});
export type AdminTaskFromSchema = z.infer<typeof adminTaskSchema>;

/**
 * Admin task list response schema — canonical paginated shape.
 * Wire format: { data: AdminTask[], pagination: { limit, total, hasMore, ... } }
 * The tasksService remaps this to { tasks, total } for consumers.
 */
export const adminTaskListResponseSchema =
  createPaginatedListSchema(adminTaskSchema);
export type AdminTaskListResponseFromSchema = z.infer<
  typeof adminTaskListResponseSchema
>;

/**
 * Admin task single-item response schema.
 * Wire format: { task: AdminTask }
 */
export const adminTaskDetailResponseSchema = z.object({
  task: adminTaskSchema,
});
export type AdminTaskDetailResponseFromSchema = z.infer<
  typeof adminTaskDetailResponseSchema
>;
