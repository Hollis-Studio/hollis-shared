/**
 * @ai-context Health route request contracts | public API validation schemas
 *
 * Request, query, and parameter schemas for fitness, nutrition, commercial,
 * recovery, security, session, registration, provider, push, and upload routes.
 *
 * deps: zod, domain contracts, shared schemas | consumers: server, mobile, web-admin
 */

import { z } from "zod";
import { OAUTH_PROVIDERS, UPLOAD_LIMITS } from "../../constants/index.js";
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_TYPES,
} from "../../domain/appointments.js";
import { UserEventTypeSchema } from "../../domain/businessAnalytics.js";
import { BiometricSourceSchema } from "../../domain/clinical.js";
import {
  DOCUMENT_CATEGORIES,
  DocumentCategorySchema,
} from "../../domain/documents.js";
import { SleepSourceSchema } from "../../domain/daily-metrics.js";
import {
  DIFFICULTY_LEVELS,
  EQUIPMENT_TYPES,
  EXERCISE_CATEGORIES,
  MOVEMENT_PATTERNS,
  MUSCLE_GROUPS,
  TRACKING_TYPES,
} from "../../domain/exercise.js";
import { GoalDataSourceSchema, STRATEGY_STATUS, STRATEGY_STATUSES, STRATEGY_TYPES } from "../../domain/training.js";
import {
  DigestionQualitySchema,
  EnergyLevelSchema,
  FoodSourceSchema,
  LOCATION_TYPES,
  MEAL_TYPES,
  MoodLevelSchema,
  NutritionFoodEntriesMutationSchema,
  PreparationMethodSchema,
} from "../../domain/nutrition.js";
import { isoDateSchema } from "../../domain/common.js";
import { RecoverySessionCreatePayloadSchema, RecoverySessionModalitySchema } from "../../domain/recovery-sessions.js";
import {
  SESSION_TYPES,
  SessionAdjustmentPayloadSchema,
  SessionTypeSchema,
} from "../../domain/sessions.js";
import {
  BIOLOGICAL_SEXES,
  MESSAGE_RECIPIENT_ROLES,
  PRIMARY_GOALS,
  REGISTRATION_BIOLOGICAL_SEX_OPTIONS,
  USER_TIERS,
  canonicalizeRegistrationBiologicalSex,
} from "../../domain/user.js";
import { MESSAGE_MAX_LENGTH } from "../../domain/messages.js";
import { ASSIGNMENT_STATUS } from "../../domain/mfa.js";
import { WEIGHT_UNITS } from "../../domain/units.js";
import { wearableWorkoutSyncSchema } from "../../domain/workouts.js";
import { passwordSchema } from "../../password/index.js";
import { VOLUME_LEVELS } from "../../primitives/volume-level.js";
import {
  BARCODE_REGEX,
  USER_ID_REGEX,
  bodyWeightKgSchema,
  dateOfBirthSchema,
  emailSchema,
  heightCmSchema,
  phoneSchema,
} from "../../schemas/index.js";
import {
  registerDevicePushTokenRequestSchema,
  sendTestNotificationRequestSchema,
  unregisterDevicePushTokenRequestSchema,
} from "../../domain/push.js";

const caseInsensitiveCanonicalEnum = <
  TValues extends readonly [string, ...string[]],
>(
  values: TValues,
) =>
  z
    .string()
    .transform((value) => value.trim().toUpperCase())
    .pipe(z.enum(values));

// ============================================================================
// Smart Assist / AI Plans
// ============================================================================

export const generateWorkoutPlanBodySchema = z.object({
  userId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)"),
  weekStartDate: isoDateSchema,
  customPrompt: z.string().max(2000, "Custom prompt too long").optional(),
  overwriteMode: z
    .enum(["overwrite", "fillEmpty"])
    .optional()
    .default("fillEmpty"),
});
export type GenerateWorkoutPlanBody = z.infer<
  typeof generateWorkoutPlanBodySchema
>;

export const generateNutritionPlanBodySchema = z.object({
  userId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)"),
  weekStartDate: isoDateSchema,
  customPrompt: z.string().max(2000, "Custom prompt too long").optional(),
});
export type GenerateNutritionPlanBody = z.infer<
  typeof generateNutritionPlanBodySchema
>;

export const generateStrategyBodySchema = z.object({
  userId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)"),
  customPrompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(2000, "Prompt too long"),
});
export type GenerateStrategyBody = z.infer<typeof generateStrategyBodySchema>;

export const continueStrategyGenerationBodySchema = z.object({
  userId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)"),
  requestId: z.string().uuid("Invalid request ID"),
  clarificationResponse: z
    .string()
    .min(1, "Response required")
    .max(2000, "Response too long"),
});
export type ContinueStrategyGenerationBody = z.infer<
  typeof continueStrategyGenerationBodySchema
>;

// ============================================================================
// Appointments
// ============================================================================

export const appointmentTypeSchema = z.enum(APPOINTMENT_TYPES);
export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUSES);

export const createAppointmentBodySchema = z
  .object({
    providerId: z.string().min(1, "providerId is required"),
    title: z.string().min(1, "title is required"),
    startTime: z.string().datetime({
      offset: true,
      message: "Valid ISO datetime required for startTime",
    }),
    type: appointmentTypeSchema,
    duration: z.number().int().positive().optional(),
    location: z.string().max(500).optional(),
    notes: z.string().max(2000).optional(),
    meetingLink: z.string().url().optional(),
  })
  .strip();

export const updateAppointmentBodySchema = z
  .object({
    title: z.string().min(1).optional(),
    startTime: z.string().datetime({ offset: true }).optional(),
    type: appointmentTypeSchema.optional(),
    location: z.string().max(500).optional(),
    notes: z.string().max(2000).optional(),
    meetingLink: z.string().url().optional(),
    status: appointmentStatusSchema.optional(),
  })
  .strip()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const appointmentIdParamSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  appointmentId: z.string().uuid("Invalid appointment ID format"),
});

export const appointmentsQuerySchema = z.object({
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  status: appointmentStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type AppointmentsQuery = z.infer<typeof appointmentsQuerySchema>;
export type CreateAppointmentBody = z.infer<typeof createAppointmentBodySchema>;
export type UpdateAppointmentBody = z.infer<typeof updateAppointmentBodySchema>;

// ============================================================================
// Assignments
// ============================================================================

export const assignmentIdParamSchema = z.object({
  id: z.string().uuid("Invalid assignment ID format"),
});

export const patientIdParamSchema = z.object({
  patientId: z
    .string()
    .regex(USER_ID_REGEX, "patientId must be a valid user ID (HH-XXXXXX)"),
});

export const clinicianIdParamSchema = z.object({
  clinicianId: z
    .string()
    .regex(USER_ID_REGEX, "clinicianId must be a valid user ID (HH-XXXXXX)"),
});

export const assignmentsListQuerySchema = z.object({
  status: z
    .enum([
      ASSIGNMENT_STATUS.ACTIVE,
      ASSIGNMENT_STATUS.REVOKED,
      ASSIGNMENT_STATUS.PENDING,
    ])
    .optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).max(10000).default(0),
});

// ============================================================================
// Auth
// ============================================================================

export const logoutBodySchema = z
  .object({
    refreshToken: z.string().min(1, "Refresh token required").optional(),
  })
  .strip();
export type LogoutBody = z.infer<typeof logoutBodySchema>;

export const forgotPasswordBodySchema = z
  .object({
    email: emailSchema,
  })
  .strip();
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;

export const resetPasswordBodySchema = z
  .object({
    token: z.string().min(20).max(512),
    newPassword: passwordSchema,
  })
  .strip();
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;

export const changePasswordBodySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: passwordSchema,
  })
  .strip();
export type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>;

const oAuthFullNameSchema = z
  .object({
    givenName: z.string().nullable().optional(),
    familyName: z.string().nullable().optional(),
  })
  .optional();

export const oAuthSignInBodySchema = z
  .object({
    provider: z.enum(OAUTH_PROVIDERS),
    idToken: z
      .string()
      .min(1, "id_token is required")
      .max(4096, "id_token too long"),
    nonce: z
      .string()
      .min(16, "OAuth nonce must be at least 16 characters")
      .max(256, "OAuth nonce too long"),
    state: z
      .string()
      .min(16, "OAuth state must be at least 16 characters")
      .max(256, "OAuth state too long"),
    authorizationCode: z.string().optional(),
    fullName: oAuthFullNameSchema,
    accessToken: z.string().optional(),
  })
  .strip();
export type OAuthSignInBody = z.infer<typeof oAuthSignInBodySchema>;

export const oAuthRegisterBodySchema = z
  .object({
    provider: z.enum(OAUTH_PROVIDERS),
    idToken: z
      .string()
      .min(1, "id_token is required")
      .max(4096, "id_token too long"),
    nonce: z
      .string()
      .min(16, "OAuth nonce must be at least 16 characters")
      .max(256, "OAuth nonce too long"),
    state: z
      .string()
      .min(16, "OAuth state must be at least 16 characters")
      .max(256, "OAuth state too long"),
    code: z.string().regex(BARCODE_REGEX, "Invalid barcode format"),
    displayName: z
      .string()
      .min(1, "Display name is required")
      .max(100, "Display name must be 100 characters or less"),
    authorizationCode: z.string().optional(),
    fullName: oAuthFullNameSchema,
    accessToken: z.string().optional(),
  })
  .strip();
export type OAuthRegisterBody = z.infer<typeof oAuthRegisterBodySchema>;

// ============================================================================
// Biometrics
// ============================================================================

export const biometricParamsSchema = z.object({
  userId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)"),
  entryId: z.string().uuid("Invalid entry ID format"),
});

export const biometricQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).default(0),
  metricCode: z.string().min(1).max(100).optional(),
});

export const biometricCreateBodySchema = z.object({
  metricDefinitionId: z.string().uuid(),
  value: z.number().finite().min(0).max(100000),
  unit: z.string().min(1).max(50),
  source: BiometricSourceSchema.default("USER_LOG"),
  date: isoDateSchema,
  notes: z.string().max(500).optional(),
});
export type BiometricCreateBody = z.infer<typeof biometricCreateBodySchema>;

export const biometricAdminBodySchema = biometricCreateBodySchema.extend({
  patientId: z
    .string()
    .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)"),
});
export type BiometricAdminBody = z.infer<typeof biometricAdminBodySchema>;

// ============================================================================
// CRM / Membership
// ============================================================================

const membershipRequestSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  tier: z.enum(USER_TIERS),
  startedAt: z.string().datetime({ offset: true }),
  endedAt: z.string().datetime({ offset: true }).optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

const userEventRequestSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  type: UserEventTypeSchema,
  occurredAt: z.string().datetime({ offset: true }),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const membershipQuerySchema = z.object({
  userId: z.string().min(1, "userId is required"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type MembershipQuery = z.infer<typeof membershipQuerySchema>;

export const membershipBodySchema = membershipRequestSchema
  .pick({
    userId: true,
    tier: true,
    startedAt: true,
    endedAt: true,
    notes: true,
  })
  .extend({
    startedAt: z.string().datetime({ offset: true }).optional(),
    endedAt: z.string().datetime({ offset: true }).optional().nullable(),
    notes: z.string().optional().nullable(),
  });
export type MembershipBody = z.infer<typeof membershipBodySchema>;

export const crmEventsQuerySchema = z.object({
  userId: z.string().min(1, "userId is required"),
  type: UserEventTypeSchema.optional(),
  rangeDays: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type CrmEventsQuery = z.infer<typeof crmEventsQuerySchema>;

export const crmEventBodySchema = userEventRequestSchema
  .pick({
    userId: true,
    type: true,
    occurredAt: true,
    source: true,
    metadata: true,
  })
  .extend({
    occurredAt: z.string().datetime({ offset: true }),
  });
export type CrmEventBody = z.infer<typeof crmEventBodySchema>;

// ============================================================================
// Daily Metrics / Data Export / Documents / Events / Messages
// ============================================================================

export const dailyMetricsQuerySchema = z.object({
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type DailyMetricsQuery = z.infer<typeof dailyMetricsQuerySchema>;

export const dailyMetricsUpdateBodySchema = z.object({
  steps: z.number().int().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  restingHeartRate: z.number().int().min(20).max(250).optional(),
  activeCalories: z.number().int().min(0).optional(),
  flightsClimbed: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  weightUnit: z.enum(WEIGHT_UNITS).default("kg").optional(),
  deepSleepPercent: z.number().min(0).max(100).optional(),
  remSleepPercent: z.number().min(0).max(100).optional(),
  lightSleepPercent: z.number().min(0).max(100).optional(),
  awakeMinutes: z.number().int().min(0).optional(),
  sleepQuality: z.number().int().min(0).max(100).optional(),
  sleepSource: SleepSourceSchema.optional(),
  hrv: z.number().min(0).max(300).optional(),
  hrvSdnn: z.number().min(0).max(300).optional(),
  tdeeEstimate: z.number().int().min(0).optional(),
  tdeeConfidence: z.number().min(0).max(1).optional(),
  recoveryScore: z.number().int().min(0).max(100).optional(),
  trainingLoad: z.number().int().min(0).optional(),
  acuteChronicRatio: z.number().min(0).optional(),
  notes: z.array(z.string()).optional(),
  recommendations: z.array(z.string()).optional(),
  workouts: z.array(wearableWorkoutSyncSchema).optional(),
});
export type DailyMetricsUpdateBody = z.infer<
  typeof dailyMetricsUpdateBodySchema
>;

export const dataExportBodySchema = z
  .object({
    email: z.string().email().max(254),
  })
  .strip();
export type DataExportBody = z.infer<typeof dataExportBodySchema>;

export const documentsQuerySchema = z.object({
  patientId: z.string().min(1, "patientId query parameter is required"),
  category: DocumentCategorySchema.optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});
export type DocumentsQuery = z.infer<typeof documentsQuerySchema>;

export const documentIdParamSchema = z.object({
  id: z.string().uuid("Invalid document ID format"),
});

export const createDocumentBodySchema = z.object({
  patientId: z.string().min(1),
  uploaderId: z.string().optional(),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
  category: DocumentCategorySchema.optional().default("OTHER"),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});
export type CreateDocumentBody = z.infer<typeof createDocumentBodySchema>;

export const sseQuerySchema = z.object({
  sseToken: z.string().optional(),
  token: z.string().optional(),
});

export const messageConversationQuerySchema = z.object({
  userId: z.string().min(1, "userId is required"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type MessageConversationQuery = z.infer<
  typeof messageConversationQuerySchema
>;

export const messageThreadQuerySchema =
  messageConversationQuerySchema.extend({
    partnerId: z.string().min(1, "partnerId is required"),
  });

export const messageUnreadQuerySchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const messageSearchQuerySchema = z.object({
  q: z.string().min(2).optional(),
  type: z.enum(["name", "email"]).optional(),
});

export const messageMarkReadBodySchema = z
  .object({
    userId: z.string().min(1, "userId is required"),
    senderRole: z.enum(MESSAGE_RECIPIENT_ROLES).optional(),
    senderUserId: z.string().optional(),
  })
  .refine((data) => data.senderRole || data.senderUserId, {
    message: "senderRole or senderUserId required",
    path: ["senderRole"],
  });
export type MessageMarkReadBody = z.infer<typeof messageMarkReadBodySchema>;

export const sendMessageBodySchema = z
  .object({
    senderId: z.string().min(1).optional(),
    receiverId: z.string().min(1, "receiverId is required").optional(),
    recipientRole: z.enum(MESSAGE_RECIPIENT_ROLES).optional(),
    content: z
      .string()
      .min(1, "content is required")
      .max(MESSAGE_MAX_LENGTH, "Message content too long"),
    attachmentUrl: z.string().url("Invalid attachment URL").optional(),
  })
  .refine((data) => data.receiverId ?? data.recipientRole, {
    message: "Either receiverId or recipientRole is required",
    path: ["receiverId"],
  });
export type SendMessageBody = z.infer<typeof sendMessageBodySchema>;

export const messageDeleteParamsSchema = z.object({
  messageId: z.string().uuid(),
});

export { DOCUMENT_CATEGORIES, DocumentCategorySchema };

export const createExerciseBodySchema = z.object({
  name: z.string().min(1).max(100),
  aliases: z.array(z.string().max(100)).default([]),
  category: caseInsensitiveCanonicalEnum(EXERCISE_CATEGORIES),
  muscleGroups: z.array(z.enum(MUSCLE_GROUPS)).min(1),
  primaryMuscle: z.enum(MUSCLE_GROUPS).optional(),
  equipment: z.array(z.enum(EQUIPMENT_TYPES)).default([]),
  movementPattern: z.enum(MOVEMENT_PATTERNS).optional(),
  difficulty: caseInsensitiveCanonicalEnum(DIFFICULTY_LEVELS).optional(),
  instructions: z.string().max(2000).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  cues: z.array(z.string().max(200)).default([]),
  trackingType: caseInsensitiveCanonicalEnum(TRACKING_TYPES).default(
    TRACKING_TYPES[0],
  ),
  defaultSets: z.number().int().min(1).max(20).optional(),
  defaultReps: z.string().max(20).optional(),
  tags: z.array(z.string().max(50)).default([]),
});
export type CreateExerciseBody = z.infer<typeof createExerciseBodySchema>;

export const updateExerciseBodySchema = createExerciseBodySchema.partial();
export type UpdateExerciseBody = z.infer<typeof updateExerciseBodySchema>;

export const exerciseQuerySchema = z.object({
  search: z.string().optional(),
  category: caseInsensitiveCanonicalEnum(EXERCISE_CATEGORIES).optional(),
  muscleGroup: z.enum(MUSCLE_GROUPS).optional(),
  equipment: z.enum(EQUIPMENT_TYPES).optional(),
  difficulty: caseInsensitiveCanonicalEnum(DIFFICULTY_LEVELS).optional(),
  tag: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const exerciseIdParamSchema = z.object({
  exerciseId: z.string().uuid(),
});

export const createExerciseLogBodySchema = z
  .object({
    exerciseId: z.string().uuid(),
    workoutPlanId: z.string().uuid().optional(),
    date: isoDateSchema,
    setNumber: z.number().int().min(1),
    reps: z.number().int().min(0).optional(),
    weight: z.number().min(0).optional(),
    weightUnit: z.enum(WEIGHT_UNITS).optional(),
    duration: z.number().int().min(1).optional(),
    distance: z.number().min(0).optional(),
    rpe: z.number().int().min(1).max(10).optional(),
    notes: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    const hasRepsOrWeightSignal = data.reps != null || data.weight != null;
    const hasDurationSignal = data.duration != null;
    const hasDistanceSignal = data.distance != null;

    if (!hasRepsOrWeightSignal && !hasDurationSignal && !hasDistanceSignal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one performance signal is required: reps/weight, duration, or distance",
        path: ["reps"],
      });
    }

    if (data.weightUnit != null && data.weight == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "weightUnit is only allowed when weight is provided",
        path: ["weightUnit"],
      });
    }
  });
export type CreateExerciseLogBody = z.infer<typeof createExerciseLogBodySchema>;

export const exerciseLogQuerySchema = z.object({
  exerciseId: z.string().uuid().optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});

export const exerciseHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

const nutritionIsoDateTimeSchema = z.string().datetime({ offset: true });
const nonNegativeFiniteNumberSchema = z.number().finite().min(0);

const foodEntrySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().trim().min(1, "Food name cannot be empty"),
    quantity: nonNegativeFiniteNumberSchema,
    unit: z.string().trim().min(1),
    calories: nonNegativeFiniteNumberSchema.max(15000),
    protein: nonNegativeFiniteNumberSchema.max(500),
    carbs: nonNegativeFiniteNumberSchema.max(1500),
    fat: nonNegativeFiniteNumberSchema.max(500),
    loggedAt: nutritionIsoDateTimeSchema,
    source: FoodSourceSchema.optional(),
    fiber: nonNegativeFiniteNumberSchema.optional(),
    sugar: nonNegativeFiniteNumberSchema.optional(),
    sodium: nonNegativeFiniteNumberSchema.optional(),
    cholesterol: nonNegativeFiniteNumberSchema.optional(),
    saturatedFat: nonNegativeFiniteNumberSchema.optional(),
    brand: z.string().optional(),
    barcode: z.string().optional(),
    icon: z.string().optional(),
    consumedAt: nutritionIsoDateTimeSchema.optional(),
    nutritionQualityIndex: z.number().finite().min(1).max(100).optional(),
  })
  .strip();

const nutritionPortionSchema = z
  .object({
    id: z.string().optional(),
    foodName: z.string().min(1),
    brand: z.string().optional(),
    quantity: nonNegativeFiniteNumberSchema,
    unit: z.string().min(1),
    macros: z
      .object({
        calories: nonNegativeFiniteNumberSchema,
        protein: nonNegativeFiniteNumberSchema,
        carbs: nonNegativeFiniteNumberSchema,
        fat: nonNegativeFiniteNumberSchema,
        fiber: nonNegativeFiniteNumberSchema.optional(),
        sugar: nonNegativeFiniteNumberSchema.optional(),
        sodium: nonNegativeFiniteNumberSchema.optional(),
      })
      .strip(),
    photoUrl: z.string().url().optional(),
  })
  .strip();

const mealContextSchema = z
  .object({
    location: z.enum(LOCATION_TYPES).optional(),
    mealDuration: nonNegativeFiniteNumberSchema.optional(),
    preparationMethod: PreparationMethodSchema.optional(),
    socialContext: z.string().optional(),
    mealTiming: z
      .object({
        preMealHunger: z.number().min(1).max(10).optional(),
        postMealSatiety: z.number().min(1).max(10).optional(),
        timeSinceLastMeal: nonNegativeFiniteNumberSchema.optional(),
      })
      .strip()
      .optional(),
    hydration: z
      .object({
        waterIntake: nonNegativeFiniteNumberSchema.optional(),
        otherBeverages: z.array(z.string()).optional(),
      })
      .strip()
      .optional(),
  })
  .strip();

const nutritionMealSchema = z
  .object({
    id: z.string().optional(),
    mealType: z.enum(MEAL_TYPES),
    loggedAt: nutritionIsoDateTimeSchema,
    portions: z.array(nutritionPortionSchema),
    notes: z.string().optional(),
    hungerLevel: z.number().min(1).max(10).optional(),
    fullnessLevel: z.number().min(1).max(10).optional(),
    mood: MoodLevelSchema.optional(),
    mealContext: mealContextSchema.optional(),
    digestion: DigestionQualitySchema.optional(),
    energy: EnergyLevelSchema.optional(),
    photoUrls: z.array(z.string()).optional(),
  })
  .strip();

export const nutritionLogBodySchema = z
  .object({
    totals: z
      .object({
        calories: z
          .number()
          .finite()
          .min(0)
          .max(15000, "Calories must be less than 15000")
          .default(0),
        protein: z
          .number()
          .finite()
          .min(0)
          .max(500, "Protein must be less than 500g")
          .default(0),
        carbs: z
          .number()
          .finite()
          .min(0)
          .max(1500, "Carbs must be less than 1500g")
          .default(0),
        fat: z
          .number()
          .finite()
          .min(0)
          .max(500, "Fat must be less than 500g")
          .default(0),
      })
      .strip()
      .optional(),
    foodEntries: z
      .record(z.string().trim().min(1), z.array(foodEntrySchema))
      .optional(),
    timezone: z.string().trim().min(1).optional(),
    meals: z.array(nutritionMealSchema).optional(),
    hydrationMl: nonNegativeFiniteNumberSchema.nullable().optional(),
    supplements: z.array(z.string().trim().min(1)).optional(),
    isVerified: z.boolean().optional(),
  })
  .strip();
export type NutritionLogBody = z.infer<typeof nutritionLogBodySchema>;

const MAX_FOOD_ANALYSIS_IMAGES = 5;
const MAX_IMAGE_BASE64_CHARS = UPLOAD_LIMITS.MAX_IMAGE_BASE64_CHARS;
const MAX_TOTAL_BASE64_CHARS =
  MAX_FOOD_ANALYSIS_IMAGES * MAX_IMAGE_BASE64_CHARS;

export const analyzeBodySchema = z
  .object({
    images: z
      .array(z.string().min(1, "Image data required"))
      .min(1, "At least one image is required")
      .max(
        MAX_FOOD_ANALYSIS_IMAGES,
        `Maximum ${MAX_FOOD_ANALYSIS_IMAGES} images allowed`,
      ),
    text: z
      .string()
      .max(2000, "Description must be 2000 characters or less")
      .default(""),
    userId: z
      .string()
      .regex(USER_ID_REGEX, "Invalid user ID format (expected HH-XXXXXX)")
      .optional(),
  })
  .strip()
  .superRefine((data, ctx) => {
    data.images.forEach((img, i) => {
      const sizeChars = img.replace(/^data:image\/\w+;base64,/, "").length;
      if (sizeChars > MAX_IMAGE_BASE64_CHARS) {
        const approxMB = Math.round((sizeChars * 0.75) / 1_000_000);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["images", i],
          message: `Image ${i + 1} is too large (~${approxMB}MB). Maximum size per image is 10MB.`,
        });
      }
    });

    const totalChars = data.images.reduce(
      (sum, img) => sum + img.replace(/^data:image\/\w+;base64,/, "").length,
      0,
    );
    if (totalChars > MAX_TOTAL_BASE64_CHARS) {
      const approxMB = Math.round((totalChars * 0.75) / 1_000_000);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["images"],
        message: `Total image payload is too large (~${approxMB}MB). Maximum combined size is 50MB.`,
      });
    }
  });
export type AnalyzeBody = z.infer<typeof analyzeBodySchema>;

export const nutritionRangeQuerySchema = z
  .object({
    startDate: isoDateSchema,
    endDate: isoDateSchema,
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(50),
  })
  .strip();
export type NutritionRangeQuery = z.infer<typeof nutritionRangeQuerySchema>;

export const nutritionFoodEntryParamsSchema = z
  .object({
    userId: z
      .string()
      .regex(USER_ID_REGEX, "Invalid user barcode format (expected HH-XXXXXX)"),
    date: isoDateSchema,
    foodId: z.string().trim().min(1).max(200),
  })
  .strip();
export type NutritionFoodEntryParams = z.infer<
  typeof nutritionFoodEntryParamsSchema
>;

export const nutritionFoodEntriesBodySchema =
  NutritionFoodEntriesMutationSchema;
export type NutritionFoodEntriesBody = z.infer<
  typeof nutritionFoodEntriesBodySchema
>;

export const productsListQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ProductsListQuery = z.infer<typeof productsListQuerySchema>;

export const checkoutSessionBodySchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    }),
  ),
  email: emailSchema.optional(),
});
export type CheckoutSessionBody = z.infer<typeof checkoutSessionBodySchema>;

export const productIdParamSchema = z.object({
  id: z.string().uuid(),
});
export type ProductIdParam = z.infer<typeof productIdParamSchema>;

export const providerIdParamSchema = z.object({
  providerId: z.string().min(1),
});

export const providerAvailabilityQuerySchema = z.object({
  date: isoDateSchema.optional(),
  days: z.coerce.number().int().min(1).max(30).default(7),
});

export const providerScheduleUpdateBodySchema = z.object({
  slots: z.array(
    z.object({
      dayOfWeek: z.number().int().min(0).max(6),
      startHour: z.number().int().min(0).max(23),
      endHour: z.number().int().min(0).max(24),
      isAvailable: z.boolean().optional(),
    }),
  ),
});
export type ProviderScheduleUpdateBody = z.infer<
  typeof providerScheduleUpdateBodySchema
>;

export const pushRegisterBodySchema = registerDevicePushTokenRequestSchema;
export const pushUnregisterBodySchema = unregisterDevicePushTokenRequestSchema;
export const pushTestBodySchema = sendTestNotificationRequestSchema;

export const recoverySessionCreateBodySchema =
  RecoverySessionCreatePayloadSchema;
export type RecoverySessionCreateBody = z.infer<
  typeof recoverySessionCreateBodySchema
>;

export const recoverySessionListQuerySchema = z.object({
  modality: RecoverySessionModalitySchema.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type RecoverySessionListQuery = z.infer<
  typeof recoverySessionListQuerySchema
>;

const canonicalBiologicalSexSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z
    .union([z.enum(REGISTRATION_BIOLOGICAL_SEX_OPTIONS), z.enum(BIOLOGICAL_SEXES)])
    .transform((value) => canonicalizeRegistrationBiologicalSex(value))
    .pipe(z.enum(BIOLOGICAL_SEXES))
    .optional(),
);

const canonicalPrimaryGoalSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.enum(PRIMARY_GOALS).optional(),
);

export const registerBodySchema = z.object({
  email: emailSchema.optional(),
  tier: z.enum(USER_TIERS).optional(),
  profile: z
    .object({
      firstName: z.string().max(100).optional(),
      lastName: z.string().max(100).optional(),
      phone: phoneSchema.optional(),
      heightCm: heightCmSchema.optional(),
      weightKg: bodyWeightKgSchema.optional(),
      dateOfBirth: dateOfBirthSchema.optional(),
      biologicalSex: canonicalBiologicalSexSchema,
      primaryGoal: canonicalPrimaryGoalSchema,
      primaryGoalNote: z.string().max(500).optional(),
    })
    .optional(),
  expiresInDays: z.number().int().min(1).max(365).default(30),
});
export type RegisterBody = z.infer<typeof registerBodySchema>;

export const barcodeParamSchema = z.object({
  barcode: z.string().regex(BARCODE_REGEX, "Invalid barcode format"),
});
export type BarcodeParam = z.infer<typeof barcodeParamSchema>;

export const registrationQuerySchema = z.object({
  includeExpired: z.coerce.boolean().default(false),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type RegistrationQuery = z.infer<typeof registrationQuerySchema>;

const SECURITY_REPORT_ENVIRONMENTS = [
  "production",
  "staging",
  "development",
] as const;

const SECURITY_ANOMALY_EVENT_TYPES = [
  "token_reuse_suspected",
  "unexpected_auth_failure",
  "suspicious_redirect",
  "integrity_check_failed",
  "other",
] as const;

export const pinFailureReportSchema = z.object({
  timestamp: z.string().datetime().optional(),
  domain: z.string().min(1).max(255),
  expectedPins: z.array(z.string().max(30)).max(5),
  receivedPinPrefix: z.string().max(30).optional(),
  errorDetails: z.string().max(500).optional(),
  appVersion: z.string().max(20).optional(),
  environment: z.enum(SECURITY_REPORT_ENVIRONMENTS).optional(),
  reportOnly: z.boolean().optional(),
});
export type PinFailureReport = z.infer<typeof pinFailureReportSchema>;

export const anomalyReportSchema = z.object({
  timestamp: z.string().datetime().optional(),
  eventType: z.enum(SECURITY_ANOMALY_EVENT_TYPES),
  description: z.string().max(500),
  appVersion: z.string().max(20).optional(),
  environment: z.enum(SECURITY_REPORT_ENVIRONMENTS).optional(),
  metadata: z.record(z.string(), z.string().max(100)).optional(),
});
export type SecurityAnomalyReport = z.infer<typeof anomalyReportSchema>;

export const sessionTypeSchema = z.enum(SESSION_TYPES);

export const useSessionBodySchema = z.object({
  sessionType: sessionTypeSchema,
  appointmentId: z.string().optional(),
  notes: z.string().optional(),
});
export type UseSessionBody = z.infer<typeof useSessionBodySchema>;

export const adjustSessionBodySchema = SessionAdjustmentPayloadSchema;
export type AdjustSessionBody = z.infer<typeof adjustSessionBodySchema>;

export const checkSessionBodySchema = z.object({
  sessionType: sessionTypeSchema,
});
export type CheckSessionBody = z.infer<typeof checkSessionBodySchema>;

export const updateBillingDateBodySchema = z.object({
  newBillingAnchorDate: isoDateSchema,
  reason: z.string().optional(),
});
export type UpdateBillingDateBody = z.infer<
  typeof updateBillingDateBodySchema
>;

export const tierChangeBodySchema = z.object({
  newTier: z.enum(USER_TIERS),
  effectiveDate: z.string().datetime().optional(),
  prorateSessions: z.boolean().optional(),
  reason: z.string().optional(),
});
export type TierChangeBody = z.infer<typeof tierChangeBodySchema>;

export const sessionHistoryQuerySchema = z.object({
  sessionType: SessionTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const createTrainingPhaseBodySchema = z.object({
  name: z.string().min(1).max(100),
  order: z.number().int().min(0),
  weekCount: z.number().int().min(1).max(52),
  intensityRange: z.string().max(50).optional(),
  volumeLevel: z.enum(VOLUME_LEVELS).optional(),
  focusAreas: z.array(z.string().max(50)).default([]),
  notes: z.string().max(1000).optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
  isActive: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
});
export type CreateTrainingPhaseBody = z.infer<
  typeof createTrainingPhaseBodySchema
>;

export const updateTrainingPhaseBodySchema =
  createTrainingPhaseBodySchema.partial();
export type UpdateTrainingPhaseBody = z.infer<
  typeof updateTrainingPhaseBodySchema
>;

const goalMetricKeySchema = z.string().min(1);

export const createStrategyGoalSchema = z.object({
  goalMetric: goalMetricKeySchema,
  goalTarget: z.number(),
  linkedExerciseId: z
    .string()
    .uuid()
    .nullish()
    .transform((value) => value ?? undefined),
  dataSource: GoalDataSourceSchema.optional(),
  dataKey: z.string().min(1).optional(),
  weight: z.number().min(0.1).max(10).default(1.0),
  baselineValue: z.number().optional(),
  notes: z.string().max(2000).optional(),
  dynamicMetricDefinition: z
    .object({
      dataSource: z.enum(["lab", "biometric"]),
      dataKey: z.string().min(1),
      label: z.string().min(1),
      unit: z.string().min(1),
      direction: z.string().min(1),
      category: z.string().min(1),
    })
    .optional(),
});

export const addStrategyGoalBodySchema = createStrategyGoalSchema;
export type AddStrategyGoalBody = z.infer<typeof addStrategyGoalBodySchema>;

export const updateStrategyGoalBodySchema = z.object({
  goalTarget: z.number().optional(),
  baselineValue: z.number().optional(),
  currentValue: z.number().optional(),
  weight: z.number().min(0.1).max(10).optional(),
  notes: z.string().max(2000).optional(),
});
export type UpdateStrategyGoalBody = z.infer<
  typeof updateStrategyGoalBodySchema
>;

export const goalIdParamSchema = z.object({
  strategyId: z.string().uuid(),
  goalId: z.string().uuid(),
});

export const createTrainingStrategyBodySchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(STRATEGY_TYPES),
  goal: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  startDate: isoDateSchema,
  endDate: isoDateSchema.optional(),
  status: z.enum(STRATEGY_STATUSES).default(STRATEGY_STATUS.ACTIVE),
  goals: z.array(createStrategyGoalSchema).min(1),
  phases: z.array(createTrainingPhaseBodySchema).optional(),
});
export type CreateTrainingStrategyBody = z.infer<
  typeof createTrainingStrategyBodySchema
>;

export const updateTrainingStrategyBodySchema =
  createTrainingStrategyBodySchema.partial().extend({
    goals: z.array(createStrategyGoalSchema).min(1).optional(),
  });
export type UpdateTrainingStrategyBody = z.infer<
  typeof updateTrainingStrategyBodySchema
>;

export const updateProgressBodySchema = z.object({
  currentValue: z.number(),
});

export const strategyProgressUpdateBodySchema = z.object({
  goalId: z.string().uuid().optional(),
  currentValue: z.number(),
});
export type StrategyProgressUpdateBody = z.infer<
  typeof strategyProgressUpdateBodySchema
>;

export const fetchGoalValueBodySchema = z.object({
  dataSource: GoalDataSourceSchema,
  dataKey: z.string().min(1),
  linkedExerciseId: z.string().uuid().optional(),
});
export type FetchGoalValueBody = z.infer<typeof fetchGoalValueBodySchema>;

export const strategyIdParamSchema = z.object({
  strategyId: z.string().uuid(),
});

export const phaseIdParamSchema = z.object({
  phaseId: z.string().uuid(),
});

export const strategyQuerySchema = z.object({
  status: z.enum(STRATEGY_STATUSES).optional(),
  type: z.enum(STRATEGY_TYPES).optional(),
  includePhases: z.coerce.boolean().default(true),
});

const PATH_TRAVERSAL_PATTERNS = [
  "..",
  "/",
  "\\",
  "%2e",
  "%2f",
  "%5c",
  "\0",
  "%00",
] as const;

export const UPLOAD_ALLOWED_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".heic",
  ".heif",
  ".webp",
  ".mp4",
  ".mov",
  ".txt",
  ".csv",
] as const;

const MAX_BASE64_SIZES: Record<string, number> = {
  ".png": 13_500_000,
  ".jpg": 13_500_000,
  ".jpeg": 13_500_000,
  ".heic": 13_500_000,
  ".heif": 13_500_000,
  ".webp": 13_500_000,
  ".pdf": 33_500_000,
  ".txt": 33_500_000,
  ".csv": 33_500_000,
  ".mp4": 67_000_000,
  ".mov": 67_000_000,
};

const DEFAULT_MAX_BASE64_SIZE = 33_500_000;

function hasPathTraversalPattern(value: string): boolean {
  const lowerValue = value.toLowerCase();
  return PATH_TRAVERSAL_PATTERNS.some((pattern) =>
    lowerValue.includes(pattern.toLowerCase()),
  );
}

function hasAllowedExtension(value: string): boolean {
  const ext = value.toLowerCase().slice(value.lastIndexOf("."));
  return (UPLOAD_ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

function getExtension(fileName: string): string {
  return fileName.toLowerCase().slice(fileName.lastIndexOf("."));
}

function getMaxBase64Size(extension: string): number {
  return MAX_BASE64_SIZES[extension.toLowerCase()] ?? DEFAULT_MAX_BASE64_SIZE;
}

export const uploadBodySchema = z
  .object({
    fileBase64: z
      .string()
      .min(1, "fileBase64 is required")
      .min(10, "fileBase64 appears to be invalid"),
    fileName: z
      .string()
      .min(1, "fileName is required")
      .max(100, "fileName is too long")
      .regex(/^[a-zA-Z0-9._\s-]+$/, "fileName contains invalid characters")
      .refine(
        (val) => !hasPathTraversalPattern(val),
        "fileName contains invalid path characters",
      )
      .refine((val) => hasAllowedExtension(val), "File type not allowed"),
  })
  .superRefine((data, ctx) => {
    const ext = getExtension(data.fileName);
    const maxSize = getMaxBase64Size(ext);
    if (data.fileBase64.length > maxSize) {
      const approxMaxFileSizeMB = Math.round((maxSize * 0.75) / 1_000_000);
      const approxActualSizeMB = Math.round(
        (data.fileBase64.length * 0.75) / 1_000_000,
      );
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File too large. Maximum size for ${ext} files is ${approxMaxFileSizeMB}MB, received approximately ${approxActualSizeMB}MB`,
        path: ["fileBase64"],
      });
    }
  });
