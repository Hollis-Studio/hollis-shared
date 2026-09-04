/**
 * @ai-context Health and clinical API validation schemas
 *
 * Public request, param, and query contracts for health/clinical routes.
 *
 * deps: zod, ../domain/*, ../schemas/* | consumers: server/src/validation/*
 */

import { z } from "zod";
import { createLabReportPayloadSchema } from "../admin/admin-schemas.js";
import { AINoteCategorySchema } from "../domain/ai-notes.js";
import {
    injuriesSchema,
    limitationsSchema,
    medicalConditionsSchema,
    medicationsSchema,
    NOTE_LIMITS,
} from "../domain/clinical.js";
import { isoDateSchema } from "../domain/common.js";
import { HealthMetricGoalUpsertSchema } from "../domain/health-metrics.js";
import { LabMetricCategorySchema } from "../domain/labs.js";
import {
    ActivityLevelSchema,
    advancedUnitPreferencesSchema,
    BiologicalSexSchema,
    dashboardPreferencesSchema,
    dashboardSectionsSchema,
    DEFAULT_USER_ROLE,
    DEFAULT_USER_TIER,
    FitnessExperienceSchema,
    notificationPreferencesUpdateSchema,
    PregnancyStatusSchema,
    PrimaryGoalSchema,
    SettableAccountStatusSchema,
    SPONSORED_PANEL_STATUSES,
    USER_ROLES,
    USER_TIERS,
} from "../domain/user.js";
import { TIME_FORMATS, UNIT_SYSTEMS } from "../domain/units.js";
import { passwordSchema } from "../password/index.js";
import {
    bodyWeightKgSchema,
    emailSchema,
    heightCmSchema,
    USER_ID_REGEX,
    userIdParamSchema,
    userIdSchema,
} from "../schemas/index.js";

// ============================================================================
// Health Metric Goals
// ============================================================================

export const healthGoalUpsertBodySchema = HealthMetricGoalUpsertSchema;

export const healthGoalParamSchema = userIdParamSchema.extend({
  /** MetricDefinition code string (previously GoalMetricKey) */
  metricKey: z.string().min(1),
});

export const healthGoalQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// ============================================================================
// Client Intake
// ============================================================================

const INTAKE_EXPERIENCE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export const intakeExperienceLevelSchema = z.enum(INTAKE_EXPERIENCE_LEVELS);
export type IntakeExperienceLevel = z.infer<typeof intakeExperienceLevelSchema>;

export { intakeExperienceLevelSchema as experienceLevelSchema };
export type { IntakeExperienceLevel as ExperienceLevel };

export const clientIntakeBodySchema = z.object({
  goals: z.string().min(1, "Goals are required").max(2000, "Goals too long"),
  injuries: z.string().max(2000, "Injuries description too long").optional(),
  preferences: z
    .string()
    .max(2000, "Preferences description too long")
    .optional(),
  experienceLevel: intakeExperienceLevelSchema,
  limitations: z
    .string()
    .max(2000, "Limitations description too long")
    .optional(),
  medications: z
    .string()
    .max(2000, "Medications description too long")
    .optional(),
  medicalConditions: z
    .string()
    .max(2000, "Medical conditions description too long")
    .optional(),
});

export type ClientIntakeBody = z.infer<typeof clientIntakeBodySchema>;

// ============================================================================
// Patient Clinical Intake V1 (clinic-launch self-intake form)
// Added: 2026-05-19 by patient-intake agent
//
// MOVED 2026-08-23 to `domain/clinical.ts` so the admin in-clinic intake
// schemas can reuse these field definitions without creating an
// admin-schemas <-> api/health-clinical-schemas import cycle. Re-exported here
// so every existing import site keeps working unchanged.
// ============================================================================

export {
    ALCOHOL_USE_OPTIONS,
    alcoholUseSchema,
    EXERCISE_FREQUENCY_OPTIONS,
    exerciseFrequencySchema,
    FAMILY_HISTORY_FLAG_OPTIONS,
    familyHistoryFlagSchema,
    familyHistorySchema,
    PAST_MEDICAL_HISTORY_CONDITIONS,
    patientIntakeV1BodySchema,
    patientIntakeV1ResponseSchema,
    TOBACCO_USE_OPTIONS,
    tobaccoUseSchema,
} from "../domain/clinical.js";
export type {
    AlcoholUse,
    ExerciseFrequency,
    FamilyHistory,
    FamilyHistoryFlag,
    PatientIntakeV1Body,
    PatientIntakeV1Response,
    TobaccoUse,
} from "../domain/clinical.js";

// ============================================================================
// Journal
// ============================================================================

export const journalParamsSchema = userIdParamSchema.extend({
  entryId: z.string().min(1),
});

export const journalQuerySchema = z.object({
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type JournalQuery = z.infer<typeof journalQuerySchema>;

const journalAssessmentSchema = z
  .object({
    summary: z.string().min(1),
    themes: z.array(z.string()),
    sentimentScore: z.number().min(-1).max(1),
    recommendedActions: z.array(z.string()).optional(),
  })
  .strip();

export const journalUpsertBodySchema = z
  .object({
    entryDate: isoDateSchema,
    content: z.string().min(1),
    mood: z.coerce.string().optional(),
    energy: z.coerce.string().optional(),
    stressLevel: z.number().int().min(1).max(10).optional(),
    planAdherence: z.number().int().min(1).max(3).optional(),
    motivation: z.number().int().min(1).max(10).optional(),
    tags: z.array(z.string()).optional(),
    aiAssessment: journalAssessmentSchema.optional(),
    attachments: z.array(z.string().url()).optional(),
  })
  .strip();

// ============================================================================
// Labs and Metric Definitions
// ============================================================================

export const labReportCreateBodySchema = createLabReportPayloadSchema.extend({
  userId: userIdSchema.optional(),
});

export const labReportIdParamSchema = z.object({
  reportId: z.string().min(1, "reportId is required"),
});

export const labListQuerySchema = z.object({
  userId: userIdSchema,
  includeReports: z.enum(["true", "false"]).optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type LabListQuery = z.infer<typeof labListQuerySchema>;
export type LabReportCreateBody = z.infer<typeof labReportCreateBodySchema>;

export const labTrendQuerySchema = z.object({
  userId: userIdSchema,
  metricDefinitionId: z.string().optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});

export const metricDefinitionsQuerySchema = z.object({
  search: z.string().optional(),
  category: LabMetricCategorySchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type MetricDefinitionsQuery = z.infer<
  typeof metricDefinitionsQuerySchema
>;

export const metricDefinitionSummariesQuerySchema = z
  .object({
    goalEligible: z.enum(["true", "false"]).optional(),
    limit: z.coerce.number().int().min(1).max(200).default(200),
    offset: z.coerce.number().int().min(0).max(10000).default(0),
  })
  .strict();

export type MetricDefinitionSummariesQuery = z.infer<
  typeof metricDefinitionSummariesQuerySchema
>;

// ============================================================================
// Notes
// ============================================================================

const clinicalNoteTagsSchema = z
  .array(z.string().max(NOTE_LIMITS.MAX_TAG_LENGTH))
  .max(NOTE_LIMITS.MAX_TAGS, `Too many tags (max ${NOTE_LIMITS.MAX_TAGS})`);

export const notesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  patientId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid patient ID format (expected HH-XXXXXX)"),
});

export const noteIdParamSchema = z.object({
  noteId: z.string().uuid("Invalid note ID format"),
});

export const createNoteBodySchema = z.object({
  patientId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid patient ID format (expected HH-XXXXXX)"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(NOTE_LIMITS.USER_CONTENT_MAX, "Content too long"),
  tags: clinicalNoteTagsSchema.optional(),
});

export const updateNoteBodySchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(NOTE_LIMITS.USER_CONTENT_MAX, "Content too long")
    .optional(),
  tags: clinicalNoteTagsSchema.optional(),
});

export type CreateNoteBody = z.infer<typeof createNoteBodySchema>;
export type UpdateNoteBody = z.infer<typeof updateNoteBodySchema>;

// ============================================================================
// Session and Permanent Smart Assist Notes
// ============================================================================

export const createSessionNoteBodySchema = z.object({
  workoutPlanId: z.string().uuid("Invalid workout plan ID format").optional(),
  workoutDate: isoDateSchema,
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content too long"),
});

export type CreateSessionNoteBody = z.infer<typeof createSessionNoteBodySchema>;

export const updateSessionNoteBodySchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content too long"),
});

export type UpdateSessionNoteBody = z.infer<typeof updateSessionNoteBodySchema>;

export const sessionNoteIdParamSchema = z.object({
  noteId: z.string().uuid("Invalid note ID format"),
});

export const sessionNotesQuerySchema = z.object({
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});

export type SessionNotesQuery = z.infer<typeof sessionNotesQuerySchema>;

export const createPermanentNoteBodySchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Content too long"),
  category: AINoteCategorySchema,
  source: z.string().max(500, "Source too long").optional(),
});

export const updatePermanentNoteBodySchema = z.object({
  content: z
    .string()
    .min(1, "Content is required")
    .max(2000, "Content too long")
    .optional(),
  category: AINoteCategorySchema.optional(),
});

export const permanentNoteIdParamSchema = z.object({
  noteId: z.string().uuid("Invalid note ID format"),
});

export type CreatePermanentNoteBody = z.infer<
  typeof createPermanentNoteBodySchema
>;
export type UpdatePermanentNoteBody = z.infer<
  typeof updatePermanentNoteBodySchema
>;

// ============================================================================
// PHI
// ============================================================================

export const phiUserIdQuerySchema = z.object({
  userId: z.string().min(1),
});

export const phiReportIdParamSchema = z.object({
  reportId: z.string().min(1),
});

export const phiMetricCodeParamSchema = z.object({
  metricCode: z.string().min(1),
});

export const phiMemberIdParamSchema = z.object({
  /** Care team member identifier. NOT a userId - distinct identifier for providers. */
  memberId: z.string().min(1),
});

// ============================================================================
// Users
// ============================================================================

export const userProfileUpdateBodySchema = z
  .object({
    fullName: z.string().min(1).optional(),
    preferredName: z.string().optional().nullable(),
    email: emailSchema.optional(),
    avatarUrl: z.string().url().optional().nullable(),
    dateOfBirth: isoDateSchema.optional().nullable(),
    biologicalSex: BiologicalSexSchema.optional().nullable(),
    pregnancyStatus: PregnancyStatusSchema.optional().nullable(),
    pregnancyDueDate: isoDateSchema.optional().nullable(),
    occupation: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    heightCm: heightCmSchema.nullable().optional(),
    weightKg: bodyWeightKgSchema.nullable().optional(),
    activityLevel: ActivityLevelSchema.optional().nullable(),
    experienceLevel: FitnessExperienceSchema.optional().nullable(),
    primaryGoal: PrimaryGoalSchema.optional().nullable(),
    primaryGoalNote: z.string().max(500).optional().nullable(),
    medications: medicationsSchema.optional(),
    limitations: limitationsSchema.optional(),
    injuries: injuriesSchema.optional(),
    medicalConditions: medicalConditionsSchema.optional(),
    onboardingCompleted: z.boolean().optional(),
  })
  .strip()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const userGoalsUpdateBodySchema = z
  .object({
    calorieTarget: z.number().int().min(0).max(10000).optional(),
    proteinTarget: z.number().int().min(0).max(1000).optional(),
    carbTarget: z.number().int().min(0).max(2000).optional(),
    fatTarget: z.number().int().min(0).max(1000).optional(),
    workoutsPerWeek: z.number().int().min(0).max(14).optional(),
    sleepHoursTarget: z.number().min(4).max(14).optional(),
    weeklyWeightChangeTarget: z.number().min(-5).max(5).optional(),
  })
  .strip();

export const userAdminUpdateBodySchema = z
  .object({
    role: z.enum(USER_ROLES).optional().nullable(),
    tier: z.enum(USER_TIERS).optional().nullable(),
    accountStatus: SettableAccountStatusSchema.optional(),
    timezone: z.string().optional().nullable(),
    assignedClinicianId: z.string().regex(USER_ID_REGEX).optional().nullable(),
    assignedTrainerId: z.string().regex(USER_ID_REGEX).optional().nullable(),
  })
  .strip()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/**
 * Sponsored blood biomarker panel tracking (admin-managed).
 *
 * Tracks only whether Hollis is paying for the member's third-party testing
 * membership. Deliberately models nothing clinical: no panel contents, no draw
 * dates, no results. Cadence and scheduling are governed by the testing
 * company's terms, not ours.
 *
 * `enrolledAt` and `renewalDate` are ISO date strings. `tierAtEnrollment` is a
 * historical snapshot — it records the tier that justified the sponsorship at
 * the time, and must not be recomputed from the member's current tier.
 */
export const sponsoredPanelUpdateBodySchema = z
  .object({
    status: z.enum(SPONSORED_PANEL_STATUSES).optional(),
    enrolledAt: isoDateSchema.optional().nullable(),
    renewalDate: isoDateSchema.optional().nullable(),
    tierAtEnrollment: z.enum(USER_TIERS).optional().nullable(),
    notes: z.string().max(500).optional().nullable(),
  })
  .strip()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const createPatientBodySchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(USER_ROLES).default(DEFAULT_USER_ROLE),
    tier: z.enum(USER_TIERS).default(DEFAULT_USER_TIER),
  })
  .strip();

const dashboardPreferencesUpdateSchema = dashboardPreferencesSchema.partial();
const dashboardSectionsUpdateSchema = dashboardSectionsSchema.partial();

export const userPreferencesUpdateBodySchema = z
  .object({
    unitSystem: z.enum(UNIT_SYSTEMS).optional(),
    timeFormat: z.enum(TIME_FORMATS).optional(),
    locale: z.string().optional(),
    dashboard: dashboardPreferencesUpdateSchema.optional(),
    dashboardCardOrder: z.array(z.string()).optional(),
    dashboardSections: dashboardSectionsUpdateSchema.optional(),
    notifications: notificationPreferencesUpdateSchema.optional(),
    eveningReminderEnabled: z.boolean().optional(),
    eveningReminderTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/u, "Must be HH:mm format (00:00-23:59)")
      .optional(),
    customReminderMessage: z.string().max(120).optional(),
    advancedUnits: advancedUnitPreferencesSchema.partial().optional(),
  })
  .strip();

export type UserProfileUpdateBody = z.infer<typeof userProfileUpdateBodySchema>;
export type UserGoalsUpdateBody = z.infer<typeof userGoalsUpdateBodySchema>;
export type UserAdminUpdateBody = z.infer<typeof userAdminUpdateBodySchema>;
export type SponsoredPanelUpdateBody = z.infer<
  typeof sponsoredPanelUpdateBodySchema
>;
export type CreatePatientBody = z.infer<typeof createPatientBodySchema>;
export type UserPreferencesUpdateBody = z.infer<
  typeof userPreferencesUpdateBodySchema
>;
