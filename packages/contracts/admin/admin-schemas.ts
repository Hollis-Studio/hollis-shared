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

import { z } from 'zod';
import {
    AccountStatusSchema,
    ActivityLevelSchema,
    BiologicalSexSchema,
    FitnessExperienceSchema,
    GoalDataSourceSchema,
    PregnancyStatusSchema,
    PrimaryGoalSchema,
    StrategyStatusSchema,
    StrategyTypeSchema,
    UserRoleSchema,
    UserTierSchema,
    isoDateSchema,
} from '../domain';
import { LabMappingStatusSchema, LabMetricCategorySchema, LabMetricDirectionalitySchema } from '../domain/labs';

// ============================================================================
// ADMIN-SPECIFIC ENUMS
// ============================================================================

/**
 * Admin compliance status schema.
 */
export const adminComplianceStatusSchema = z.enum(['excellent', 'good', 'at-risk', 'non-compliant']);

/**
 * Volume level schema for training phases.
 */
export const volumeLevelSchema = z.enum(['low', 'moderate', 'high']);

/**
 * Limitation severity schema.
 */
export const limitationSeveritySchema = z.enum(['mild', 'moderate', 'severe']);

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
  status: adminComplianceStatusSchema,
  complianceScore: z.number().min(0).max(100),
  lastLog: z.string(),
});

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

/**
 * Admin limitation schema.
 */
export const adminLimitationSchema = z.object({
  id: z.string(),
  description: z.string().min(1).max(500),
  severity: limitationSeveritySchema.optional(),
  notes: z.string().max(5000).optional(),
});

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
  heightCm: z.number().positive().max(300).optional(),
  weightKg: z.number().positive().max(700).optional(),
  activityLevel: ActivityLevelSchema.nullable().optional(),
  experienceLevel: FitnessExperienceSchema.nullable().optional(),
  primaryGoal: PrimaryGoalSchema.nullable().optional(),
  medications: z.array(adminMedicationSchema).optional(),
  limitations: z.array(adminLimitationSchema).optional(),
});

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

/**
 * Patient admin controls payload schema.
 */
export const patientAdminControlsPayloadSchema = z.object({
  tier: UserTierSchema.nullable().optional(),
  role: UserRoleSchema.nullable().optional(),
  assignedClinicianId: z.string().nullable().optional(),
  assignedTrainerId: z.string().nullable().optional(),
  accountStatus: AccountStatusSchema.optional(),
  timezone: z.string().nullable().optional(),
});

// ============================================================================
// CLINICIAN MANAGEMENT SCHEMAS
// ============================================================================

/**
 * Clinician summary schema.
 */
export const clinicianSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  role: UserRoleSchema,
  specialty: z.string(),
});

/**
 * Availability slot schema.
 */
export const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isAvailable: z.boolean(),
});

/**
 * Clinician availability schema.
 */
export const clinicianAvailabilitySchema = z.object({
  clinicianId: z.string(),
  slots: z.array(availabilitySlotSchema),
});

/**
 * Provider schedule slot schema.
 */
export const providerScheduleSlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startHour: z.number().min(0).max(23),
  endHour: z.number().min(0).max(24),
  isAvailable: z.boolean().optional(),
});

/**
 * Provider schedule data schema.
 */
export const providerScheduleDataSchema = z.object({
  providerId: z.string(),
  slots: z.array(providerScheduleSlotSchema),
});

// ============================================================================
// REGISTRATION SCHEMAS
// ============================================================================

/**
 * Prefilled profile schema.
 */
export const prefilledProfileSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(50).optional(),
  heightCm: z.number().positive().max(300).optional(),
  weightKg: z.number().positive().max(700).optional(),
  dateOfBirth: isoDateSchema.optional(),
  sex: BiologicalSexSchema.optional(),
  goals: z.string().max(1000).optional(),
});

/**
 * Registered user schema.
 */
export const registeredUserSchema = z.object({
  id: z.string(),
  barcode: z.string().regex(/^HH-[A-HJ-KM-NP-Z2-9]{6}$/),
  prefilledEmail: z.string().email().nullable().optional(),
  prefilledTier: UserTierSchema.nullable().optional(),
  prefilledProfile: prefilledProfileSchema.nullable().optional(),
  isRegistered: z.boolean(),
  registrationExpiresAt: z.string(),
  createdAt: z.string(),
  registeredBy: z.object({
    id: z.string(),
    email: z.string().email(),
  }).nullable().optional(),
});

/**
 * Create registration payload schema.
 */
export const createRegistrationPayloadSchema = z.object({
  email: z.string().email().optional(),
  tier: UserTierSchema.optional(),
  profile: prefilledProfileSchema.optional(),
  expiresInDays: z.number().positive().max(365).optional(),
});

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

/**
 * Create goal input schema.
 */
export const createGoalInputSchema = z.object({
  goalMetric: z.string().min(1).max(100),
  goalTarget: z.number(),
  baselineValue: z.number().optional(),
  weight: z.number().min(0).max(1).optional(),
  linkedExerciseId: z.string().optional(),
});

/**
 * Update goal input schema.
 */
export const updateGoalInputSchema = z.object({
  goalTarget: z.number().optional(),
  baselineValue: z.number().optional(),
  currentValue: z.number().optional(),
  weight: z.number().min(0).max(1).optional(),
});

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

/**
 * Fetch value request schema.
 */
export const fetchValueRequestSchema = z.object({
  dataSource: GoalDataSourceSchema,
  dataKey: z.string().min(1),
  linkedExerciseId: z.string().optional(),
});

/**
 * Fetch value response schema.
 */
export const fetchValueResponseSchema = z.object({
  found: z.boolean(),
  value: z.number().nullable(),
  date: z.string().nullable(),
});

// ============================================================================
// WORKOUT GENERATION SCHEMAS
// ============================================================================

/**
 * Workout generation progress schema.
 */
export const workoutGenerationProgressSchema = z.object({
  step: z.number().min(0),
  totalSteps: z.number().positive(),
  phase: z.string(),
  detail: z.string().optional(),
});

/**
 * Workout plan generation params schema (excludes AbortSignal and callback).
 */
export const workoutPlanGenerationParamsSchema = z.object({
  userId: z.string(),
  weekStartDate: isoDateSchema,
  customPrompt: z.string().max(5000).optional(),
  overwriteMode: z.enum(['overwrite', 'fillEmpty']).optional(),
});

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

/**
 * Macro targets schema.
 */
export const macroTargetsSchema = z.object({
  dailyCalories: z.number().positive().max(10000).optional(),
  proteinGrams: z.number().positive().max(1000).optional(),
  carbsGrams: z.number().positive().max(2000).optional(),
  fatGrams: z.number().positive().max(1000).optional(),
});

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
});

/** Population qualifier for race/ethnicity/sex-specific lab results */
export const LabPopulationQualifierSchema = z.enum(['african', 'non_african', 'male', 'female']).nullable();

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

export const labDataExtractionResultSchema = z.object({
  report: extractedLabReportSchema,
  observations: z.array(extractedLabObservationSchema),
});

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
  metricDefinitionId: z.string().nullable().optional(),
  mappingStatus: LabMappingStatusSchema,
  mappingConfidence: z.number().min(0).max(1).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  tags: z.array(z.string().max(100)).nullable().optional(),
});

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

// ============================================================================
// INTAKE & QUESTIONNAIRE SCHEMAS
// ============================================================================

/**
 * Intake questionnaire response schema.
 */
export const intakeQuestionnaireResponseSchema = z.object({
  userId: z.string(),
  completedAt: z.string().optional(),
  responses: z.record(z.string(), z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
  ])),
});

/**
 * Client intake payload schema.
 */
export const clientIntakePayloadSchema = z.object({
  goals: z.string().min(1).max(5000),
  experienceLevel: z.string().min(1).max(100),
  injuries: z.string().max(5000).optional(),
  preferences: z.string().max(5000).optional(),
  limitations: z.string().max(5000).optional(),
  medicalConditions: z.string().max(5000).optional(),
});

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
