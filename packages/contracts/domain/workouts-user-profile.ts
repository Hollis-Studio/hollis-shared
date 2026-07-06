/**
 * @ai-context Workouts user profile | WorkoutsUserProfileSchema, UserSettingsSchema,
 * UserEntitlementsSchema. Named Workouts* to avoid shadowing UserProfileSchema in
 * domain/user.ts (the Health-app clinical identity schema with email/role/tier/biologicalSex).
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// UserEntitlementsSchema
// ---------------------------------------------------------------------------
export const UserEntitlementsSchema = z.object({
  aiTier: z.enum(['free', 'paid']).optional(),
  source: z.enum(['local', 'suite', 'provider']).optional(),
  subscriptionStatus: z.enum(['none', 'active', 'grace_period', 'expired', 'revoked']).optional(),
  subscriptionProvider: z.string().min(1).optional(),
  productId: z.string().min(1).optional(),
  originalTransactionId: z.string().min(1).optional(),
  suiteEntitlementId: z.string().min(1).optional(),
  expiresAt: z.coerce.date().optional(),
  lastValidatedAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).passthrough();
export type UserEntitlements = z.infer<typeof UserEntitlementsSchema>;

// ---------------------------------------------------------------------------
// UserSettingsSchema (embedded in WorkoutsUserProfileSchema.settings)
// Decisions:
//   theme: z.string().min(1)  — wide to accept legacy strings (e.g. 'auto');
//     the app's ThemePreferenceSchema preprocess wrapper stays in src/schemas/user.ts
//   languageTag, gender: wide strings — enum enforcement is app-side
//   notificationSettings.workoutReminder: includes minutesBefore (server accepts it)
// ---------------------------------------------------------------------------
export const UserSettingsSchema = z.object({
  defaultWeightUnit: z.enum(['kg', 'lbs']),
  defaultWeightMode: z.enum(['absolute', 'relative']),
  defaultDistanceUnit: z.enum(['km', 'mi']),
  defaultWeightIncrementKg: z.number().min(0).optional(),
  workoutExperienceLevel: z.enum(['new', 'beginner', 'intermediate', 'advanced']).optional(),
  progressionIncrementKg: z.number().min(0),
  repIncrement: z.number().int().min(1),
  goEasierPercent: z.number().min(0).max(1),
  defaultRestTimerSec: z.number().int().min(0),
  theme: z.string().min(1),
  languageTag: z.string().optional(),
  gender: z.string().optional(),
  appleHealthConnected: z.boolean(),
  repThresholdForWeightJump: z.number().int().min(1),
  cardioProgressionFocus: z.enum(['duration', 'distance', 'pace']),
  notificationsEnabled: z.boolean(),
  dailySummaryTime: z.string().regex(/^\d{2}:\d{2}$/),
  weeklySummaryDay: z.number().int().min(0).max(6),
  timeZone: z.string().min(1).optional(),
  workoutReminderEnabled: z.boolean(),
  workoutReminderTime: z.string().regex(/^\d{2}:\d{2}$/),
  hapticIntensity: z.enum(['light', 'medium', 'heavy', 'off']).optional(),
  defaultRIR: z.number().int().min(0).max(5).optional(),
  dailyNotificationTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  volumeTargets: z.record(z.string(), z.number().int().min(1)).optional(),
  trainingPhase: z.enum(['build', 'maintain', 'cut']).optional(),
  trainingPhaseStartedAt: z.number().optional(),
  phaseEntryBaselines: z.record(z.string(), z.number().min(0)).optional(),
  adaptiveProgression: z.boolean().optional(),
  cardioGoalPreset: z.enum(['none', 'general', 'endurance', 'weight_loss', 'threshold']).optional(),
  cardioWeeklyTargets: z.object({
    z1Min: z.number(),
    z2Min: z.number(),
    z3Min: z.number(),
    z4Min: z.number(),
  }).optional(),
  dateOfBirth: z.number().optional(),
  maxHRBpm: z.number().optional(),
  hrZoneOverrides: z.object({
    z1: z.object({ minBpm: z.number(), maxBpm: z.number() }).optional(),
    z2: z.object({ minBpm: z.number(), maxBpm: z.number() }).optional(),
    z3: z.object({ minBpm: z.number(), maxBpm: z.number() }).optional(),
    z4: z.object({ minBpm: z.number(), maxBpm: z.number() }).optional(),
  }).optional(),
  sundayReview: z.object({
    enabled: z.boolean(),
    dayOfWeek: z.number().int().min(0).max(6),
    hourLocal: z.number().int().min(0).max(23),
    pushEnabled: z.boolean(),
    timeZone: z.string().min(1),
  }).optional(),
  notificationSettings: z.object({
    masterEnabled: z.boolean(),
    workoutReminder: z.object({
      enabled: z.boolean(),
      reminderTime: z.string().regex(/^\d{2}:\d{2}$/),
      minutesBefore: z.number().int().min(0).optional(),
    }),
    restDayPulse: z.object({ enabled: z.boolean() }),
    // Smart (AI) notification channel preferences. MUST be declared here:
    // z.object() strips undeclared keys, and this object's absence silently
    // discarded every smart-channel toggle on both the client-side settings
    // parse and the server's PUT /profile — the whole feature was
    // non-persistent (found 2026-07-05 during the Workouts notification
    // audit). Channel hours are user-local (0-23).
    smart: z.object({
      enabled: z.boolean(),
      preLift: z.object({
        enabled: z.boolean(),
        hourLocal: z.number().int().min(0).max(23),
      }),
      restDayPulse: z.object({
        enabled: z.boolean(),
        hourLocal: z.number().int().min(0).max(23),
      }),
      postWorkoutRecap: z.object({ enabled: z.boolean() }),
      missedSlot: z.object({
        enabled: z.boolean(),
        hourLocal: z.number().int().min(0).max(23),
      }),
      weeklyReview: z.object({
        enabled: z.boolean(),
        hourLocal: z.number().int().min(0).max(23),
      }),
    }).optional(),
  }).optional(),
  simpleModeEnabled: z.boolean().optional(),
}).passthrough();
export type UserSettings = z.infer<typeof UserSettingsSchema>;

// ---------------------------------------------------------------------------
// WorkoutsUserProfileSchema — response shape for GET /v1/profile
// uid is synthetic (= userId), always present on response.
// Request body for PUT uses .omit({uid}).
// Fields nullable because Prisma columns are nullable (AUDIT-2 fix).
// ---------------------------------------------------------------------------
export const WorkoutsUserProfileSchema = z.object({
  uid: z.string().min(1),
  userId: z.string().min(1).optional(),
  displayName: z.string().min(1).max(200),
  email: z.string().email().optional(),
  settings: UserSettingsSchema,
  entitlements: UserEntitlementsSchema.nullable().optional(),
  smartReaderFreeUsesRemaining: z.number().int().min(0).nullable().optional(),
  lastReviewPromptAt: z.coerce.date().nullable().optional(),
  fcmDeviceToken: z.string().nullable().optional(),
  lastFcmTokenUpdate: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});
export type WorkoutsUserProfile = z.infer<typeof WorkoutsUserProfileSchema>;

// Request body for PUT /v1/profile (server strips uid + controls updatedAt)
export const WorkoutsUserProfilePutBodySchema = WorkoutsUserProfileSchema.omit({ uid: true }).extend({
  updatedAt: z.coerce.date().optional(),
});
export type WorkoutsUserProfilePutBody = z.infer<typeof WorkoutsUserProfilePutBodySchema>;
