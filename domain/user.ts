/**
 * @ai-context User domain contracts | roles, tiers, profile enums and their labels
 *
 * This module provides the canonical definitions for user-related constants:
 * - User roles (ADMIN, CLINICIAN, CLIENT)
 * - Membership tiers (ESSENTIALS, CORE, CONCIERGE)
 * - Biological sex, activity levels, goals, experience levels
 * - Notification frequencies, weekdays
 *
 * IMPORTANT: All user-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */

import { z } from 'zod';

// ============================================================================
// USER ROLES
// ============================================================================

/**
 * User roles in the Hollis Health system.
 * - ADMIN: Full system access, manages clinicians, trainers and all patients
 * - CLINICIAN: Health coaches, can manage assigned patients
 * - TRAINER: Fitness trainers, can manage assigned clients for training
 * - CLIENT: Regular users/patients
 * 
 * NOTE: Users can have only one role. However, ADMIN role grants full access
 * to all features (clinician + trainer capabilities). For staff who need both
 * clinician and trainer access, assign ADMIN role or use assignment tables.
 */
export const USER_ROLES = ['ADMIN', 'CLINICIAN', 'TRAINER', 'CLIENT'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const UserRoleSchema = z.enum(USER_ROLES);

/** Centralized role constants for equality checks */
export const USER_ROLE = {
  ADMIN: 'ADMIN',
  CLINICIAN: 'CLINICIAN',
  TRAINER: 'TRAINER',
  CLIENT: 'CLIENT',
} as const satisfies Record<UserRole, UserRole>;

export const DEFAULT_USER_ROLE: UserRole = USER_ROLE.CLIENT;

/** Roles that can access admin features (web-admin, mobile admin panel) */
export const ADMIN_ROLES: readonly UserRole[] = ['ADMIN', 'CLINICIAN', 'TRAINER'] as const;

/** Roles that can access clinical/PHI data (clinicians and admins, not trainers) */
export const CLINICAL_ROLES: readonly UserRole[] = ['ADMIN', 'CLINICIAN'] as const;

/** Roles that can access training data (trainers and admins, not clinicians unless admin) */
export const TRAINING_ROLES: readonly UserRole[] = ['ADMIN', 'TRAINER'] as const;

/** Check if a role has admin portal access (can log into web-admin) */
export function isAdminRole(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN || role === USER_ROLE.CLINICIAN || role === USER_ROLE.TRAINER;
}

/** Check if a role has clinical/PHI access (ADMIN or CLINICIAN) */
export function isClinicalRole(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN || role === USER_ROLE.CLINICIAN;
}

/** Check if a role has training access (ADMIN or TRAINER) */
export function isTrainerRole(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN || role === USER_ROLE.TRAINER;
}

/** Check if a role is ADMIN (full system access) */
export function isSiteAdminRole(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN;
}

// ============================================================================
// PERMISSION HELPERS - CRM Access Control
// ============================================================================

/**
 * Permission: Can view financial data (MRR, revenue, sales funnel)
 * Only ADMIN can see business financials - clinicians and trainers cannot
 */
export function canViewFinancials(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN;
}

/**
 * Permission: Can manage staff (trainer leaderboard, assignments to other staff)
 * Only ADMIN can manage staff - clinicians and trainers see only their own data
 */
export function canManageStaff(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN;
}

/**
 * Permission: Can view sensitive clinical care team notes
 * ADMIN and CLINICIAN can see care team coordination notes
 * TRAINER cannot see clinical diagnoses or care team communications
 */
export function canViewCareTeamNotes(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN || role === USER_ROLE.CLINICIAN;
}

/**
 * Permission: Can view lab results and hormone panels
 * ADMIN and CLINICIAN can see full lab data
 * TRAINER should not see raw lab values (only training-relevant summaries)
 */
export function canViewLabResults(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN || role === USER_ROLE.CLINICIAN;
}

/**
 * Permission: Can manage registrations and lead pipeline
 * Only ADMIN handles new member onboarding and sales funnel
 */
export function canManageRegistrations(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN;
}

/** Human-readable labels for user roles */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  CLINICIAN: 'Clinician',
  TRAINER: 'Trainer',
  CLIENT: 'Client',
};

// ============================================================================
// MEMBERSHIP TIERS
// ============================================================================

/**
 * Membership tiers for Hollis Health.
 * - ESSENTIALS ($799/mo): 4 fitness sessions, basic clinical access
 * - CORE ($1199/mo): 8 fitness sessions, enhanced clinical access
 * - CONCIERGE ($1699/mo): 16 fitness sessions, full clinical access
 */
export const USER_TIERS = ['ESSENTIALS', 'CORE', 'CONCIERGE'] as const;
export type UserTier = (typeof USER_TIERS)[number];

export const UserTierSchema = z.enum(USER_TIERS);

export const USER_TIER = {
  ESSENTIALS: 'ESSENTIALS',
  CORE: 'CORE',
  CONCIERGE: 'CONCIERGE',
} as const satisfies Record<UserTier, UserTier>;

export const DEFAULT_USER_TIER: UserTier = USER_TIER.ESSENTIALS;

/** Human-readable labels for membership tiers */
export const USER_TIER_LABELS: Record<UserTier, string> = {
  ESSENTIALS: 'Essentials',
  CORE: 'Core',
  CONCIERGE: 'Concierge',
};

/** Monthly pricing for each tier (in USD) */
export const USER_TIER_PRICES: Record<UserTier, number> = {
  ESSENTIALS: 799,
  CORE: 1199,
  CONCIERGE: 1699,
};

/** Tiers that include premium features (CORE and CONCIERGE) */
export const PREMIUM_TIERS: readonly UserTier[] = ['CORE', 'CONCIERGE'] as const;

/** Check if a tier has premium features (CORE or CONCIERGE) */
export function isPremiumTier(tier: string | undefined | null): boolean {
  return tier === USER_TIER.CORE || tier === USER_TIER.CONCIERGE;
}

// ============================================================================
// BIOLOGICAL SEX
// ============================================================================

/**
 * Valid biological sex values for user profiles.
 */
export const BIOLOGICAL_SEXES = ['female', 'male', 'non_binary', 'intersex', 'prefer_not_to_say'] as const;
export type BiologicalSex = (typeof BIOLOGICAL_SEXES)[number];

export const BiologicalSexSchema = z.enum(BIOLOGICAL_SEXES);

/** Centralized biological sex constants for equality checks */
export const BIOLOGICAL_SEX = {
  FEMALE: 'female' as BiologicalSex,
  MALE: 'male' as BiologicalSex,
  NON_BINARY: 'non_binary' as BiologicalSex,
  INTERSEX: 'intersex' as BiologicalSex,
  PREFER_NOT_TO_SAY: 'prefer_not_to_say' as BiologicalSex,
} as const;

/** Human-readable labels for biological sex */
export const BIOLOGICAL_SEX_LABELS: Record<BiologicalSex, string> = {
  female: 'Female',
  male: 'Male',
  non_binary: 'Non-Binary',
  intersex: 'Intersex',
  prefer_not_to_say: 'Prefer Not to Say',
};

// ============================================================================
// ACTIVITY LEVELS
// ============================================================================

/**
 * Valid activity level values for user profiles.
 */
export const ACTIVITY_LEVELS = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'athlete'] as const;
export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number];

export const ActivityLevelSchema = z.enum(ACTIVITY_LEVELS);

/** Centralized activity level constants for equality checks */
export const ACTIVITY_LEVEL = {
  SEDENTARY: 'sedentary' as ActivityLevel,
  LIGHTLY_ACTIVE: 'lightly_active' as ActivityLevel,
  MODERATELY_ACTIVE: 'moderately_active' as ActivityLevel,
  VERY_ACTIVE: 'very_active' as ActivityLevel,
  ATHLETE: 'athlete' as ActivityLevel,
} as const;

/** Human-readable labels for activity levels */
export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active: 'Very Active',
  athlete: 'Athlete',
};

// ============================================================================
// PRIMARY GOALS
// ============================================================================

/**
 * Valid primary goal values for user profiles.
 */
export const PRIMARY_GOALS = ['lose_weight', 'gain_muscle', 'maintain', 'improve_health'] as const;
export type PrimaryGoal = (typeof PRIMARY_GOALS)[number];

export const PrimaryGoalSchema = z.enum(PRIMARY_GOALS);

/** Centralized primary goal constants for equality checks */
export const PRIMARY_GOAL = {
  LOSE_WEIGHT: 'lose_weight' as PrimaryGoal,
  GAIN_MUSCLE: 'gain_muscle' as PrimaryGoal,
  MAINTAIN: 'maintain' as PrimaryGoal,
  IMPROVE_HEALTH: 'improve_health' as PrimaryGoal,
} as const;

/** Human-readable labels for primary goals */
export const PRIMARY_GOAL_LABELS: Record<PrimaryGoal, string> = {
  lose_weight: 'Lose Weight',
  gain_muscle: 'Gain Muscle',
  maintain: 'Maintain',
  improve_health: 'Improve Health',
};

// ============================================================================
// FITNESS EXPERIENCE
// ============================================================================

/**
 * Valid fitness experience values for user profiles.
 */
export const FITNESS_EXPERIENCES = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
export type FitnessExperience = (typeof FITNESS_EXPERIENCES)[number];

export const FitnessExperienceSchema = z.enum(FITNESS_EXPERIENCES);

/** Centralized fitness experience constants for equality checks */
export const FITNESS_EXPERIENCE = {
  BEGINNER: 'beginner' as FitnessExperience,
  INTERMEDIATE: 'intermediate' as FitnessExperience,
  ADVANCED: 'advanced' as FitnessExperience,
  EXPERT: 'expert' as FitnessExperience,
} as const;

/** Human-readable labels for fitness experience */
export const FITNESS_EXPERIENCE_LABELS: Record<FitnessExperience, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

// ============================================================================
// NOTIFICATION FREQUENCIES
// ============================================================================

/**
 * Valid notification frequency values.
 */
export const NOTIFICATION_FREQUENCIES = ['daily', 'weekly', 'biweekly', 'monthly', 'custom'] as const;
export type NotificationFrequency = (typeof NOTIFICATION_FREQUENCIES)[number];

export const NotificationFrequencySchema = z.enum(NOTIFICATION_FREQUENCIES);

/** Centralized notification frequency constants for equality checks */
export const NOTIFICATION_FREQUENCY = {
  DAILY: 'daily' as NotificationFrequency,
  WEEKLY: 'weekly' as NotificationFrequency,
  BIWEEKLY: 'biweekly' as NotificationFrequency,
  MONTHLY: 'monthly' as NotificationFrequency,
  CUSTOM: 'custom' as NotificationFrequency,
} as const;

/** Human-readable labels for notification frequencies */
export const NOTIFICATION_FREQUENCY_LABELS: Record<NotificationFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  monthly: 'Monthly',
  custom: 'Custom',
};

// ============================================================================
// WEEKDAYS
// ============================================================================

/**
 * Valid weekday values for scheduling.
 */
export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const WeekdaySchema = z.enum(WEEKDAYS);

/** Centralized weekday constants for equality checks */
export const WEEKDAY = {
  MONDAY: 'monday' as Weekday,
  TUESDAY: 'tuesday' as Weekday,
  WEDNESDAY: 'wednesday' as Weekday,
  THURSDAY: 'thursday' as Weekday,
  FRIDAY: 'friday' as Weekday,
  SATURDAY: 'saturday' as Weekday,
  SUNDAY: 'sunday' as Weekday,
} as const;

/** Human-readable labels for weekdays */
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// ============================================================================
// ACCOUNT STATUS
// ============================================================================

/**
 * Valid account status values.
 * Maps to isActive boolean in DB: 'active' = true, others = false
 */
export const ACCOUNT_STATUSES = ['active', 'suspended', 'inactive'] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];
/** Type alias for backwards compatibility */
export type AccountStatusValue = AccountStatus;

export const AccountStatusSchema = z.enum(ACCOUNT_STATUSES);

/** Constant object for account status comparisons */
export const ACCOUNT_STATUS = {
  ACTIVE: 'active' as AccountStatus,
  SUSPENDED: 'suspended' as AccountStatus,
  INACTIVE: 'inactive' as AccountStatus,
} as const;

/** Human-readable labels for account statuses */
export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  active: 'Active',
  suspended: 'Suspended',
  inactive: 'Inactive',
};

// ============================================================================
// PREGNANCY STATUS
// ============================================================================

/**
 * Valid pregnancy status values (manual override for clinical profile).
 */
export const PREGNANCY_STATUSES = ['not_pregnant', 'trimester_1', 'trimester_2', 'trimester_3', 'postpartum'] as const;
export type PregnancyStatus = (typeof PREGNANCY_STATUSES)[number];

export const PregnancyStatusSchema = z.enum(PREGNANCY_STATUSES);

/** Centralized pregnancy status constants for equality checks */
export const PREGNANCY_STATUS = {
  NOT_PREGNANT: 'not_pregnant' as PregnancyStatus,
  TRIMESTER_1: 'trimester_1' as PregnancyStatus,
  TRIMESTER_2: 'trimester_2' as PregnancyStatus,
  TRIMESTER_3: 'trimester_3' as PregnancyStatus,
  POSTPARTUM: 'postpartum' as PregnancyStatus,
} as const;

/** Human-readable labels for pregnancy status */
export const PREGNANCY_STATUS_LABELS: Record<PregnancyStatus, string> = {
  not_pregnant: 'Not Pregnant',
  trimester_1: 'Trimester 1',
  trimester_2: 'Trimester 2',
  trimester_3: 'Trimester 3',
  postpartum: 'Postpartum',
};

/**
 * Calculate trimester from an expected due date (assumes 40-week gestation).
 * T1: 0-13 weeks, T2: 14-27 weeks, T3: 28-40 weeks, postpartum after due date.
 *
 * @param dueDate - The expected due date
 * @param referenceDate - The reference date for calculation (defaults to now)
 * @returns The calculated pregnancy status
 */
export function calculateTrimesterFromDueDate(dueDate: Date, referenceDate: Date = new Date()): PregnancyStatus {
  if (Number.isNaN(dueDate.getTime()) || Number.isNaN(referenceDate.getTime())) {
    return 'not_pregnant';
  }
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const weeksUntilDue = (dueDate.getTime() - referenceDate.getTime()) / MS_PER_WEEK;
  const gestationalWeeks = 40 - weeksUntilDue;

  if (weeksUntilDue < 0) return 'postpartum';
  if (gestationalWeeks < 0) return 'trimester_1';
  if (gestationalWeeks <= 13) return 'trimester_1';
  if (gestationalWeeks <= 27) return 'trimester_2';
  return 'trimester_3';
}

// ============================================================================
// MESSAGE RECIPIENT ROLES
// ============================================================================

/**
 * Recipient roles for messaging threads.
 * These are different from UserRoles - they represent logical message destinations.
 * - FITNESS_COORDINATOR: The assigned fitness coordinator/trainer
 * - CLINICIAN: The assigned clinician/healthcare provider
 */
export const MESSAGE_RECIPIENT_ROLES = ['FITNESS_COORDINATOR', 'CLINICIAN'] as const;
export type MessagingRecipientRole = (typeof MESSAGE_RECIPIENT_ROLES)[number];

export const MessagingRecipientRoleSchema = z.enum(MESSAGE_RECIPIENT_ROLES);

/** Centralized messaging recipient role constants for equality checks */
export const MESSAGE_RECIPIENT_ROLE = {
  FITNESS_COORDINATOR: 'FITNESS_COORDINATOR' as MessagingRecipientRole,
  CLINICIAN: 'CLINICIAN' as MessagingRecipientRole,
} as const;

/** Human-readable labels for messaging recipient roles */
export const MESSAGE_RECIPIENT_ROLE_LABELS: Record<MessagingRecipientRole, string> = {
  FITNESS_COORDINATOR: 'Fitness Coordinator',
  CLINICIAN: 'Clinician',
};

// ============================================================================
// UNIT CONVERSION CONSTANTS
// ============================================================================

/**
 * UNIT_CONVERSION has been moved to shared/contracts/constants/index.ts
 * Import from @hollis/contracts or ../constants instead of this file.
 * 
 * This comment remains for backward compatibility references, but the export
 * has been removed to avoid duplicate exports in the barrel file.
 */

// ============================================================================
// USER PROFILE CONTRACT
// ============================================================================

/**
 * User profile contract - core user profile information.
 */
export interface UserProfileContract {
  id?: string;
  /**
   * User identifier in HH-XXXXXX barcode format (e.g., HH-ABC123).
   * This IS the patient's barcode - the same value used for QR codes and registration.
   *
   * @format HH-XXXXXX
   */
  userId: string;
  email: string;
  fullName: string;
  preferredName?: string;
  role?: UserRole;
  tier?: UserTier;
  avatarUrl?: string;
  bio?: string;
  occupation?: string;
  primaryGoal?: PrimaryGoal;
  activityLevel?: ActivityLevel;
  experienceLevel?: FitnessExperience;
  dateOfBirth?: string; // IsoDateString
  biologicalSex?: BiologicalSex;
  pregnancyStatus?: PregnancyStatus | null;
  pregnancyDueDate?: string | null; // IsoDateString
  /**
   * @computed Derived from pregnancyStatus (if set) or pregnancyDueDate (if set).
   * If pregnancyStatus is explicitly set, it takes precedence.
   * Otherwise, calculated from pregnancyDueDate using calculateTrimesterFromDueDate.
   * Null if neither pregnancyStatus nor pregnancyDueDate is set.
   */
  calculatedPregnancyStatus?: PregnancyStatus | null;
  heightCm?: number;
  weightKg?: number;
  initialWeightKg?: number;
  timezone?: string;
  assignedClinicianId?: string | null;
  assignedTrainerId?: string | null;
  onboardingCompleted: boolean;
  isActive?: boolean;
  createdAt: string; // IsoTimestampString
  updatedAt: string; // IsoTimestampString
}

export const UserProfileSchema: z.ZodType<UserProfileContract> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  email: z.string().email(),
  fullName: z.string().min(1),
  preferredName: z.string().optional(),
  role: UserRoleSchema.optional(),
  tier: UserTierSchema.optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
  occupation: z.string().optional(),
  primaryGoal: PrimaryGoalSchema.optional(),
  activityLevel: ActivityLevelSchema.optional(),
  experienceLevel: FitnessExperienceSchema.optional(),
  dateOfBirth: z.string().optional(),
  biologicalSex: BiologicalSexSchema.optional(),
  pregnancyStatus: PregnancyStatusSchema.nullable().optional(),
  pregnancyDueDate: z.string().nullable().optional(),
  calculatedPregnancyStatus: PregnancyStatusSchema.nullable().optional(),
  heightCm: z.number().min(0).optional(),
  weightKg: z.number().min(0).optional(),
  initialWeightKg: z.number().min(0).optional(),
  timezone: z.string().optional(),
  assignedClinicianId: z.string().nullable().optional(),
  assignedTrainerId: z.string().nullable().optional(),
  onboardingCompleted: z.boolean(),
  isActive: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================================
// USER GOALS CONTRACT
// ============================================================================

export interface UserGoalsContract {
  id?: string;
  userId: string;
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  weeklyWeightChangeTarget: number; // kg per week
  workoutsPerWeek: number;
  sleepHoursTarget?: number;
  createdAt: string; // IsoTimestampString
  updatedAt: string; // IsoTimestampString
}

export const UserGoalsSchema: z.ZodType<UserGoalsContract> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  calorieTarget: z.number().min(0),
  proteinTarget: z.number().min(0),
  carbTarget: z.number().min(0),
  fatTarget: z.number().min(0),
  weeklyWeightChangeTarget: z.number(),
  workoutsPerWeek: z.number().min(0),
  sleepHoursTarget: z.number().min(0).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ============================================================================
// USER METRICS CONTRACT
// ============================================================================

export interface UserMetricsContract {
  tdee: number;
  bmr: number;
  recoveryScore: number;
  trainingLoad?: number;
  currentWeight?: number;
  weeklyWeightChange?: number;
  monthlyWeightChange?: number;
  currentBodyFat?: number;
  currentMuscleMass?: number;
  sleepPerformance: number;
  averageSleepDuration?: number;
  averageSleepQuality?: number;
  averageHRV?: number;
  averageRestingHR?: number;
  stressScore?: number;
  todaysStrain: number;
  weeklyStrain?: number;
  monthlyStrain?: number;
  stepCount?: number;
  activeMinutes?: number;
  loggedCalories: number;
  weeklyCalorieAverage?: number;
  macroAdherence?: number;
  workoutStreak?: number;
  loggingStreak?: number;
  adherenceScore?: number;
  lastUpdated: string; // IsoTimestampString
}

export const UserMetricsSchema: z.ZodType<UserMetricsContract> = z.object({
  tdee: z.number().min(0),
  bmr: z.number().min(0),
  recoveryScore: z.number().min(0).max(100),
  trainingLoad: z.number().optional(),
  currentWeight: z.number().optional(),
  weeklyWeightChange: z.number().optional(),
  monthlyWeightChange: z.number().optional(),
  currentBodyFat: z.number().optional(),
  currentMuscleMass: z.number().optional(),
  sleepPerformance: z.number().min(0).max(100),
  averageSleepDuration: z.number().optional(),
  averageSleepQuality: z.number().optional(),
  averageHRV: z.number().optional(),
  averageRestingHR: z.number().optional(),
  stressScore: z.number().optional(),
  todaysStrain: z.number().min(0),
  weeklyStrain: z.number().optional(),
  monthlyStrain: z.number().optional(),
  stepCount: z.number().optional(),
  activeMinutes: z.number().optional(),
  loggedCalories: z.number().min(0),
  weeklyCalorieAverage: z.number().optional(),
  macroAdherence: z.number().optional(),
  workoutStreak: z.number().optional(),
  loggingStreak: z.number().optional(),
  adherenceScore: z.number().optional(),
  lastUpdated: z.string(),
});

// ============================================================================
// USER ACCOUNT CONTRACT (AGGREGATE)
// ============================================================================

/**
 * User account contract - aggregate of profile, preferences, goals, and metrics.
 */
export interface UserAccountContract {
  profile: UserProfileContract;
  preferences?: UserPreferencesContract;
  goals?: UserGoalsContract;
  metrics?: UserMetricsContract;
}

export interface UserPreferencesContract {
  id?: string;
  userId: string;
  unitSystem: 'imperial' | 'metric' | 'advanced';
  timeFormat: 'standard' | 'military';
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export const UserPreferencesSchema: z.ZodType<UserPreferencesContract> = z.object({
  id: z.string().optional(),
  userId: z.string(),
  unitSystem: z.enum(['imperial', 'metric', 'advanced']),
  timeFormat: z.enum(['standard', 'military']),
  locale: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserAccountSchema: z.ZodType<UserAccountContract> = z.object({
  profile: UserProfileSchema,
  preferences: UserPreferencesSchema.optional(),
  goals: UserGoalsSchema.optional(),
  metrics: UserMetricsSchema.optional(),
});

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockUserProfile = (
  overrides: Partial<UserProfileContract> = {},
): UserProfileContract => {
  const timestamp = nowIso();
  return {
    userId: 'HH-ABC123',
    email: 'user@example.com',
    fullName: 'John Doe',
    role: 'CLIENT',
    tier: 'CORE',
    onboardingCompleted: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};

export const createMockUserAccount = (
  overrides: Partial<UserAccountContract> = {},
): UserAccountContract => ({
  profile: createMockUserProfile(overrides.profile),
  ...overrides,
});
