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

// DEFERRED(audit-#43): [God module] This file is 1203 lines and handles multiple responsibilities
// (user roles, membership tiers, profile enums, notification preferences, onboarding schemas,
// profile update DTOs, and display label maps for all of the above).
// Severity: Medium | Rationale: Functions work correctly. This is a shared contracts file consumed
// by all three surfaces; decomposition must be coordinated across mobile, web-admin, and server.
// Revisit: When adding new user domain concepts. Consider splitting into user/roles.ts,
// user/profile.ts, user/notifications.ts, and user/onboarding.ts sub-modules.

import { z } from "zod";

import {
    injurySchema,
    limitationSchema,
    medicalConditionSchema,
    medicationSchema,
} from "./clinical";

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
export const USER_ROLES = ["ADMIN", "CLINICIAN", "TRAINER", "CLIENT"] as const;

export const UserRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof UserRoleSchema>;

/** Centralized role constants for equality checks */
export const USER_ROLE = {
  ADMIN: "ADMIN",
  CLINICIAN: "CLINICIAN",
  TRAINER: "TRAINER",
  CLIENT: "CLIENT",
} as const satisfies Record<UserRole, UserRole>;

export const DEFAULT_USER_ROLE: UserRole = USER_ROLE.CLIENT;

/** Roles that can access admin features (web-admin, mobile admin panel) */
export const ADMIN_ROLES: readonly UserRole[] = [
  "ADMIN",
  "CLINICIAN",
  "TRAINER",
] as const;

/** Roles that can access clinical/PHI data (clinicians and admins, not trainers) */
export const CLINICAL_ROLES: readonly UserRole[] = [
  "ADMIN",
  "CLINICIAN",
] as const;

/** Roles that can access training data (trainers and admins, not clinicians unless admin) */
export const TRAINING_ROLES: readonly UserRole[] = [
  "ADMIN",
  "TRAINER",
] as const;

/** Check if a role has admin portal access (can log into web-admin) */
export function isAdminRole(role: string | undefined | null): boolean {
  return (
    role === USER_ROLE.ADMIN ||
    role === USER_ROLE.CLINICIAN ||
    role === USER_ROLE.TRAINER
  );
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
export function canManageRegistrations(
  role: string | undefined | null,
): boolean {
  return role === USER_ROLE.ADMIN;
}

/**
 * Human-readable labels for user roles.
 * Note: CLIENT is intentionally "Client" here (formal role reference in matrices/tables).
 * ROLE_BADGE_CONFIG.CLIENT uses "Patient" for patient-facing UI display contexts.
 * Do not unify these — the divergence is intentional.
 */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  CLINICIAN: "Clinician",
  TRAINER: "Trainer",
  CLIENT: "Client",
};

// ============================================================================
// ROLE BADGES (for messaging/display)
// ============================================================================

/**
 * Role badge configuration for display in messaging and UI.
 */
export interface RoleBadge {
  label: string;
  color: string;
  bg: string;
}

/**
 * Role badge colors - inline to avoid design-token dependency in contracts.
 * These values mirror @hollis/design-tokens roleBadgeColors.
 */
const ROLE_BADGE_COLORS = {
  admin: { color: "#7C3AED", bg: "#EDE9FE" },
  clinician: { color: "#059669", bg: "#D1FAE5" },
  trainer: { color: "#F59E0B", bg: "#FEF3C7" },
  client: { color: "#2563EB", bg: "#DBEAFE" },
  default: { color: "#6B7280", bg: "#F3F4F6" },
} as const;

/**
 * Role badge configuration mapped by user role.
 * @deprecated - use ROLE_BADGE_CONFIG from @contracts (src/contracts/commonEnums.ts); this has hardcoded hex values
 */
export const ROLE_BADGE_CONFIG: Record<UserRole, RoleBadge> = {
  ADMIN: {
    label: "Admin",
    color: ROLE_BADGE_COLORS.admin.color,
    bg: ROLE_BADGE_COLORS.admin.bg,
  },
  CLINICIAN: {
    label: "Clinician",
    color: ROLE_BADGE_COLORS.clinician.color,
    bg: ROLE_BADGE_COLORS.clinician.bg,
  },
  TRAINER: {
    label: "Trainer",
    color: ROLE_BADGE_COLORS.trainer.color,
    bg: ROLE_BADGE_COLORS.trainer.bg,
  },
  CLIENT: {
    label: "Patient",
    color: ROLE_BADGE_COLORS.client.color,
    bg: ROLE_BADGE_COLORS.client.bg,
  },
};

/**
 * Get role badge configuration for display.
 * Returns badge config for known roles, or a default badge for unknown roles.
 * Returns null if role is null/undefined.
 */
export function getRoleBadge(
  role: string | undefined | null,
): RoleBadge | null {
  if (!role) return null;
  if (role in ROLE_BADGE_CONFIG) {
    return ROLE_BADGE_CONFIG[role as UserRole];
  }
  return {
    label: role,
    color: ROLE_BADGE_COLORS.default.color,
    bg: ROLE_BADGE_COLORS.default.bg,
  };
}

// ============================================================================
// MEMBERSHIP TIERS
// ============================================================================

/**
 * Membership tiers for Hollis Health.
 * - ESSENTIALS ($799/mo): 4 fitness sessions, basic clinical access
 * - CORE ($1349/mo): 8 fitness sessions, enhanced clinical access
 * - CONCIERGE ($1999/mo): 16 fitness sessions, full clinical access
 */
export const USER_TIERS = ["ESSENTIALS", "CORE", "CONCIERGE"] as const;

export const UserTierSchema = z.enum(USER_TIERS);
export type UserTier = z.infer<typeof UserTierSchema>;

export const USER_TIER = {
  ESSENTIALS: "ESSENTIALS",
  CORE: "CORE",
  CONCIERGE: "CONCIERGE",
} as const satisfies Record<UserTier, UserTier>;

export const DEFAULT_USER_TIER: UserTier = USER_TIER.ESSENTIALS;

/** Human-readable labels for membership tiers */
export const USER_TIER_LABELS: Record<UserTier, string> = {
  ESSENTIALS: "Essentials",
  CORE: "Core",
  CONCIERGE: "Concierge",
};

/**
 * Monthly pricing for each tier in whole dollars.
 * Note: These are dollar amounts (e.g., 799 = $799), not cents.
 * Convert to cents with `USER_TIER_PRICES_DOLLARS[tier] * 100` when needed for Stripe.
 *
 * @example
 * USER_TIER_PRICES_DOLLARS.ESSENTIALS // 799 ($799/month)
 * USER_TIER_PRICES_DOLLARS.ESSENTIALS * 100 // 79900 cents for Stripe
 */
export const USER_TIER_PRICES_DOLLARS: Record<UserTier, number> = {
  ESSENTIALS: 799,
  CORE: 1349,
  CONCIERGE: 1999,
};

/**
 * @deprecated Use USER_TIER_PRICES_DOLLARS instead for clarity about units.
 * This alias is maintained for backwards compatibility but will be removed in a future version.
 */
export const USER_TIER_PRICES = USER_TIER_PRICES_DOLLARS;

/** Tiers that include premium features (CORE and CONCIERGE) */
export const PREMIUM_TIERS: readonly UserTier[] = [
  "CORE",
  "CONCIERGE",
] as const;

/** Check if a tier has premium features (CORE or CONCIERGE) */
export function isPremiumTier(tier: string | undefined | null): boolean {
  return tier === USER_TIER.CORE || tier === USER_TIER.CONCIERGE;
}

/** Type guard: checks whether value is a valid UserTier */
export function isUserTier(
  value: string | undefined | null,
): value is UserTier {
  return USER_TIERS.includes(value as UserTier);
}

// ============================================================================
// MEMBERSHIP CONTRACT
// ============================================================================

/**
 * Canonical membership contract for user-tier membership records.
 * Used by server aggregation (UserFullData) and admin views.
 */
export const MembershipContractSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tier: UserTierSchema,
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MembershipContract = z.infer<typeof MembershipContractSchema>;

// ============================================================================
// BIOLOGICAL SEX
// ============================================================================

/**
 * Valid biological sex values for user profiles.
 */
export const BIOLOGICAL_SEXES = [
  "female",
  "male",
  "non_binary",
  "intersex",
  "prefer_not_to_say",
] as const;

export const BiologicalSexSchema = z.enum(BIOLOGICAL_SEXES);
export type BiologicalSex = z.infer<typeof BiologicalSexSchema>;

/** Centralized biological sex constants for equality checks */
export const BIOLOGICAL_SEX = {
  FEMALE: "female" as BiologicalSex,
  MALE: "male" as BiologicalSex,
  NON_BINARY: "non_binary" as BiologicalSex,
  INTERSEX: "intersex" as BiologicalSex,
  PREFER_NOT_TO_SAY: "prefer_not_to_say" as BiologicalSex,
} as const;

/** Human-readable labels for biological sex */
export const BIOLOGICAL_SEX_LABELS: Record<BiologicalSex, string> = {
  female: "Female",
  male: "Male",
  non_binary: "Non-Binary",
  intersex: "Intersex",
  prefer_not_to_say: "Prefer Not to Say",
};

// ============================================================================
// ACTIVITY LEVELS
// ============================================================================

/**
 * Valid activity level values for user profiles.
 */
export const ACTIVITY_LEVELS = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
  "athlete",
] as const;

export const ActivityLevelSchema = z.enum(ACTIVITY_LEVELS);
export type ActivityLevel = z.infer<typeof ActivityLevelSchema>;

/** Centralized activity level constants for equality checks */
export const ACTIVITY_LEVEL = {
  SEDENTARY: "sedentary" as ActivityLevel,
  LIGHTLY_ACTIVE: "lightly_active" as ActivityLevel,
  MODERATELY_ACTIVE: "moderately_active" as ActivityLevel,
  VERY_ACTIVE: "very_active" as ActivityLevel,
  ATHLETE: "athlete" as ActivityLevel,
} as const;

/** Human-readable labels for activity levels */
export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  lightly_active: "Lightly Active",
  moderately_active: "Moderately Active",
  very_active: "Very Active",
  athlete: "Athlete",
};

// ============================================================================
// PRIMARY GOALS
// ============================================================================

/**
 * Valid primary goal values for user profiles.
 */
export const PRIMARY_GOALS = [
  "lose_weight",
  "gain_muscle",
  "maintain",
  "improve_health",
] as const;

export const PrimaryGoalSchema = z.enum(PRIMARY_GOALS);
export type PrimaryGoal = z.infer<typeof PrimaryGoalSchema>;

/** Centralized primary goal constants for equality checks */
export const PRIMARY_GOAL = {
  LOSE_WEIGHT: "lose_weight" as PrimaryGoal,
  GAIN_MUSCLE: "gain_muscle" as PrimaryGoal,
  MAINTAIN: "maintain" as PrimaryGoal,
  IMPROVE_HEALTH: "improve_health" as PrimaryGoal,
} as const;

/** Human-readable labels for primary goals */
export const PRIMARY_GOAL_LABELS: Record<PrimaryGoal, string> = {
  lose_weight: "Lose Weight",
  gain_muscle: "Gain Muscle",
  maintain: "Maintain",
  improve_health: "Improve Health",
};

// ============================================================================
// FITNESS EXPERIENCE
// ============================================================================

/**
 * Valid fitness experience values for user profiles.
 */
export const FITNESS_EXPERIENCES = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

export const FitnessExperienceSchema = z.enum(FITNESS_EXPERIENCES);
export type FitnessExperience = z.infer<typeof FitnessExperienceSchema>;

/** Centralized fitness experience constants for equality checks */
export const FITNESS_EXPERIENCE = {
  BEGINNER: "beginner" as FitnessExperience,
  INTERMEDIATE: "intermediate" as FitnessExperience,
  ADVANCED: "advanced" as FitnessExperience,
  EXPERT: "expert" as FitnessExperience,
} as const;

/** Human-readable labels for fitness experience */
export const FITNESS_EXPERIENCE_LABELS: Record<FitnessExperience, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

// ============================================================================
// NOTIFICATION FREQUENCIES
// ============================================================================

/**
 * Valid notification frequency values.
 */
export const NOTIFICATION_FREQUENCIES = [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "custom",
] as const;

export const NotificationFrequencySchema = z.enum(NOTIFICATION_FREQUENCIES);
export type NotificationFrequency = z.infer<typeof NotificationFrequencySchema>;

/** Centralized notification frequency constants for equality checks */
export const NOTIFICATION_FREQUENCY = {
  DAILY: "daily" as NotificationFrequency,
  WEEKLY: "weekly" as NotificationFrequency,
  BIWEEKLY: "biweekly" as NotificationFrequency,
  MONTHLY: "monthly" as NotificationFrequency,
  CUSTOM: "custom" as NotificationFrequency,
} as const;

/** Human-readable labels for notification frequencies */
export const NOTIFICATION_FREQUENCY_LABELS: Record<
  NotificationFrequency,
  string
> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  custom: "Custom",
};

// ============================================================================
// WEEKDAYS
// ============================================================================

/**
 * Valid weekday values for scheduling.
 */
export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const WeekdaySchema = z.enum(WEEKDAYS);
export type Weekday = z.infer<typeof WeekdaySchema>;

/** Centralized weekday constants for equality checks */
export const WEEKDAY = {
  MONDAY: "monday" as Weekday,
  TUESDAY: "tuesday" as Weekday,
  WEDNESDAY: "wednesday" as Weekday,
  THURSDAY: "thursday" as Weekday,
  FRIDAY: "friday" as Weekday,
  SATURDAY: "saturday" as Weekday,
  SUNDAY: "sunday" as Weekday,
} as const;

/** Human-readable labels for weekdays */
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

// ============================================================================
// ACCOUNT STATUS
// ============================================================================

/**
 * Valid account status values.
 * Maps to isActive boolean in DB: 'active' = true, others = false
 */
export const ACCOUNT_STATUSES = ["active", "suspended", "inactive"] as const;

export const AccountStatusSchema = z.enum(ACCOUNT_STATUSES);
export type AccountStatus = z.infer<typeof AccountStatusSchema>;
/** Type alias for backwards compatibility */
export type AccountStatusValue = AccountStatus;

/** Constant object for account status comparisons */
export const ACCOUNT_STATUS = {
  ACTIVE: "active" as AccountStatus,
  SUSPENDED: "suspended" as AccountStatus,
  INACTIVE: "inactive" as AccountStatus,
} as const;

/** Human-readable labels for account statuses */
export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  inactive: "Inactive",
};

/**
 * Returns true if the given account status represents an active account.
 * Only `ACCOUNT_STATUS.ACTIVE` is considered active; suspended and inactive are not.
 * Centralised here so that the active-set can be expanded in one place.
 */
export function isActiveAccountStatus(status: AccountStatusValue): boolean {
  return status === ACCOUNT_STATUS.ACTIVE;
}

// ============================================================================
// PREGNANCY STATUS
// ============================================================================

/**
 * Valid pregnancy status values (manual override for clinical profile).
 */
export const PREGNANCY_STATUSES = [
  "not_pregnant",
  "trimester_1",
  "trimester_2",
  "trimester_3",
  "postpartum",
] as const;

export const PregnancyStatusSchema = z.enum(PREGNANCY_STATUSES);
export type PregnancyStatus = z.infer<typeof PregnancyStatusSchema>;

/** Centralized pregnancy status constants for equality checks */
export const PREGNANCY_STATUS = {
  NOT_PREGNANT: "not_pregnant" as PregnancyStatus,
  TRIMESTER_1: "trimester_1" as PregnancyStatus,
  TRIMESTER_2: "trimester_2" as PregnancyStatus,
  TRIMESTER_3: "trimester_3" as PregnancyStatus,
  POSTPARTUM: "postpartum" as PregnancyStatus,
} as const;

/** Human-readable labels for pregnancy status */
export const PREGNANCY_STATUS_LABELS: Record<PregnancyStatus, string> = {
  not_pregnant: "Not Pregnant",
  trimester_1: "Trimester 1",
  trimester_2: "Trimester 2",
  trimester_3: "Trimester 3",
  postpartum: "Postpartum",
};

/**
 * Calculate trimester from an expected due date (assumes 40-week gestation).
 * T1: 0-13 weeks, T2: 14-27 weeks, T3: 28-40 weeks, postpartum after due date.
 *
 * @param dueDate - The expected due date
 * @param referenceDate - The reference date for calculation (defaults to now)
 * @returns The calculated pregnancy status
 */
export function calculateTrimesterFromDueDate(
  dueDate: Date,
  referenceDate: Date = new Date(),
): PregnancyStatus {
  if (
    Number.isNaN(dueDate.getTime()) ||
    Number.isNaN(referenceDate.getTime())
  ) {
    return "not_pregnant";
  }
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const weeksUntilDue =
    (dueDate.getTime() - referenceDate.getTime()) / MS_PER_WEEK;
  const gestationalWeeks = 40 - weeksUntilDue;

  if (weeksUntilDue < 0) return "postpartum";
  if (gestationalWeeks < 0) return "trimester_1";
  if (gestationalWeeks <= 13) return "trimester_1";
  if (gestationalWeeks <= 27) return "trimester_2";
  return "trimester_3";
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
export const MESSAGE_RECIPIENT_ROLES = [
  "FITNESS_COORDINATOR",
  "CLINICIAN",
] as const;

export const MessagingRecipientRoleSchema = z.enum(MESSAGE_RECIPIENT_ROLES);
export type MessagingRecipientRole = z.infer<
  typeof MessagingRecipientRoleSchema
>;

/** Centralized messaging recipient role constants for equality checks */
export const MESSAGE_RECIPIENT_ROLE = {
  FITNESS_COORDINATOR: "FITNESS_COORDINATOR" as MessagingRecipientRole,
  CLINICIAN: "CLINICIAN" as MessagingRecipientRole,
} as const;

/** Human-readable labels for messaging recipient roles */
export const MESSAGE_RECIPIENT_ROLE_LABELS: Record<
  MessagingRecipientRole,
  string
> = {
  FITNESS_COORDINATOR: "Fitness Coordinator",
  CLINICIAN: "Clinician",
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
export const UserProfileSchema = z.object({
  /** @deprecated Use `userId` instead. Alias for backward compatibility. */
  id: z.string().optional(),
  userId: z.string().max(20),
  email: z.string().email().max(255),
  /** @computed Assembled from User.firstName + " " + User.lastName, falls back to email if both are null */
  fullName: z.string().min(1).max(200),
  preferredName: z.string().nullable().optional(),
  role: UserRoleSchema.optional(),
  tier: UserTierSchema.optional(),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  occupation: z.string().nullable().optional(),
  primaryGoal: PrimaryGoalSchema.nullable().optional(),
  activityLevel: ActivityLevelSchema.nullable().optional(),
  experienceLevel: FitnessExperienceSchema.nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  biologicalSex: BiologicalSexSchema.nullable().optional(),
  pregnancyStatus: PregnancyStatusSchema.nullable().optional(),
  pregnancyDueDate: z.string().nullable().optional(),
  calculatedPregnancyStatus: PregnancyStatusSchema.nullable().optional(),
  heightCm: z.number().min(0).max(300).nullable().optional(),
  /**
   * @computed Latest BiometricEntry for weight metric, falls back to ClinicalProfile.startWeight
   * Current weight in kilograms. Updated as new measurements are taken.
   * Distinct from Prisma's `startWeight` which captures the initial onboarding weight.
   * Requires null-safe access — may be absent for users who haven't set a weight.
   */
  weightKg: z.number().min(0).max(500).nullable().optional(),
  /** Initial weight at onboarding (kg). Null-safe — may be absent for legacy users. */
  initialWeightKg: z.number().min(0).nullable().optional(),
  /** IANA timezone identifier. Null-safe — defaults to organization timezone if absent. */
  timezone: z.string().nullable().optional(),
  /** Assigned clinician ID. Null when no clinician is assigned. */
  assignedClinicianId: z.string().nullable().optional(),
  /** @computed Primary active TrainerAssignment.trainerId for this user. Null when no trainer is assigned. */
  assignedTrainerId: z.string().nullable().optional(),
  medications: z.array(medicationSchema).nullable().optional(),
  limitations: z.array(limitationSchema).nullable().optional(),
  injuries: z.array(injurySchema).nullable().optional(),
  medicalConditions: z.array(medicalConditionSchema).nullable().optional(),
  onboardingCompleted: z.boolean(),
  isActive: z.boolean().optional(),
  // ── Data Retention (GDPR / CCPA / HIPAA) ─────────────────────────────────
  /** Earliest date on which PHI records may be permanently purged. Set on soft-delete. */
  recordRetentionDate: z.coerce.date().nullable().optional(),
  /** Timestamp of the deletion/anonymisation request that initiated account removal. */
  deletionRequestedAt: z.coerce.date().nullable().optional(),
  /** Human-readable reason for deletion (e.g. "admin_initiated", "user_request"). */
  deletionReason: z.string().nullable().optional(),
  /** ISO 3166-2 subdivision code (e.g. "TX", "CA", "NY"). Determines retention period. */
  stateOfResidence: z.string().max(10).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserProfileContract = z.infer<typeof UserProfileSchema>;

// ============================================================================
// PROFILE EDIT FORM SCHEMAS
// ============================================================================

/**
 * Validates PHI fields submitted from PersonalInfoSection before persisting.
 * All fields are optional (partial update). Uses `.passthrough()` so that
 * unrecognised FormDataRecord keys are preserved without causing a parse error.
 */
export const personalInfoFormSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name must not be empty")
      .max(200, "Full name must be at most 200 characters")
      .optional(),
    preferredName: z.string().max(200).nullable().optional(),
    dateOfBirth: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Date of birth must be in YYYY-MM-DD format",
      )
      .nullable()
      .optional(),
    biologicalSex: BiologicalSexSchema.nullable().optional(),
    occupation: z.string().max(200).nullable().optional(),
    bio: z.string().max(2000).nullable().optional(),
  })
  .passthrough();

export type PersonalInfoFormData = z.infer<typeof personalInfoFormSchema>;

/**
 * Validates PHI physical-stats fields **after** unit conversion to metric.
 * Called in PhysicalStatsSection.handleSaveWithConversion before persisting.
 * Uses `.passthrough()` so non-validated FormDataRecord keys are preserved.
 */
export const physicalStatsFormSchema = z
  .object({
    heightCm: z
      .number()
      .positive("Height must be a positive number")
      .max(300, "Height must be at most 300 cm")
      .nullable()
      .optional(),
    weightKg: z
      .number()
      .positive("Weight must be a positive number")
      .max(500, "Weight must be at most 500 kg")
      .nullable()
      .optional(),
    activityLevel: ActivityLevelSchema.nullable().optional(),
    experienceLevel: FitnessExperienceSchema.nullable().optional(),
    primaryGoal: PrimaryGoalSchema.nullable().optional(),
  })
  .passthrough();

export type PhysicalStatsFormData = z.infer<typeof physicalStatsFormSchema>;

// ============================================================================
// USER GOALS CONTRACT
// ============================================================================

/**
 * @warning Fields in this contract are backed by a NutritionPlan.notes JSON blob, not standalone DB columns.
 * Migration to dedicated columns is recommended. See audit-04.
 */
// DEFERRED(schema): UserGoalsContract is backed by a JSON blob in the DB rather than normalized columns.
// Migrating to structured columns requires a schema migration and data backfill.
// Revisit post-launch once goals data model is stable.
export const UserGoalsSchema = z.object({
  id: z.string().optional(),
  userId: z.string().max(20),
  calorieTarget: z.number().min(0),
  proteinTarget: z.number().min(0),
  carbTarget: z.number().min(0),
  fatTarget: z.number().min(0),
  /** @stored-in NutritionPlan.notes JSON blob ("weeklyWeightChangeTarget" key). Not a standalone DB column. */
  weeklyWeightChangeTarget: z.number(),
  /** @stored-in NutritionPlan.notes JSON blob ("workoutsPerWeek" key). Not a standalone DB column. */
  workoutsPerWeek: z.number().min(0),
  /** @stored-in NutritionPlan.notes JSON blob ("sleepHoursTarget" key). Not a standalone DB column. */
  sleepHoursTarget: z.number().min(0).max(24).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserGoalsContract = z.infer<typeof UserGoalsSchema>;

// ============================================================================
// USER METRICS CONTRACT
// ============================================================================

export const UserMetricsSchema = z.object({
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
  /** @computed Set at serialization time from the most recent metric update. */
  lastUpdated: z.string(),
});

export type UserMetricsContract = z.infer<typeof UserMetricsSchema>;

// ============================================================================
// USER ACCOUNT CONTRACT (AGGREGATE)
// ============================================================================

// UserPreferencesContract, UserAccountContract are derived from schemas below (after dashboard/notification schemas)

// ============================================================================
// MOCK FACTORIES
// ============================================================================

const nowIso = () => new Date().toISOString();

export const createMockUserProfile = (
  overrides: Partial<UserProfileContract> = {},
): UserProfileContract => {
  const timestamp = nowIso();
  return {
    userId: "mock-user",
    email: "mock.user@example.com",
    fullName: "Mock User",
    role: "CLIENT",
    tier: "CORE",
    heightCm: 175,
    weightKg: 72,
    onboardingCompleted: true,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
};

/**
 * Default notification preferences factory
 */
export const defaultNotifications = (): NotificationPreferencesContract => ({
  morningBriefing: { enabled: true, time: "07:00", autoLearn: true },
  eveningCheckIn: { enabled: true, time: "20:00", autoLearn: true },
  weeklyInsights: { enabled: true, time: "09:00", day: "monday" },
  coPilotCheckIns: { enabled: false, time: "10:00", frequency: "weekly" },
  trainingGuidance: {
    enabled: true,
    time: "08:00",
    frequency: "daily",
    intelligentMode: true,
  },
  nutritionCoaching: {
    enabled: false,
    breakfastTime: "08:00",
    lunchTime: "12:30",
    dinnerTime: "19:00",
  },
  adminPortal: {
    appointmentBookedByOthers: false,
    appointmentCancelledByOthers: false,
    appointmentModifiedByOthers: false,
    patientAssignedToMe: false,
  },
});

/**
 * Default advanced unit preferences factory
 */
export const defaultAdvancedUnits =
  (): import("./units").AdvancedUnitPreferencesContract => ({
    weight: "kg",
    height: "cm",
    foodWeight: "g",
    foodVolume: "ml",
    calories: "kcal",
    exerciseWeight: "kg",
    distance: "km",
    speed: "km_h",
    altitude: "m",
    temperature: "celsius",
    water: "ml",
  });

/** Default card order for mock preferences */
const DEFAULT_MOCK_CARD_ORDER = [
  "dailySummary",
  "nutrition",
  "workout",
  "recovery",
] as const;

/**
 * Create a mock UserPreferencesContract for testing
 */
export const createMockUserPreferences = (
  overrides: Partial<UserPreferencesContract> = {},
): UserPreferencesContract => {
  const timestamp = nowIso();
  const defaultOrder = [...DEFAULT_MOCK_CARD_ORDER];
  const base: UserPreferencesContract = {
    id: overrides.id,
    userId: overrides.userId ?? "mock-user",
    unitSystem: overrides.unitSystem ?? "metric",
    timeFormat: overrides.timeFormat ?? "standard",
    locale: overrides.locale ?? "en-US",
    dashboard: overrides.dashboard ?? {
      sectionOrder: defaultOrder,
      hiddenSections: [],
      pinnedSections: [DEFAULT_MOCK_CARD_ORDER[0]],
    },
    advancedUnits: overrides.advancedUnits ?? defaultAdvancedUnits(),
    notifications: overrides.notifications ?? defaultNotifications(),
    units: overrides.units ?? overrides.unitSystem ?? "metric",
    dashboardCardOrder:
      overrides.dashboardCardOrder ??
      overrides.dashboard?.sectionOrder ??
      defaultOrder,
    dashboardSections: overrides.dashboardSections ?? {
      order: overrides.dashboard?.sectionOrder ?? defaultOrder,
      visibility: {
        [DEFAULT_MOCK_CARD_ORDER[0]]: true,
        [DEFAULT_MOCK_CARD_ORDER[1]]: true,
        [DEFAULT_MOCK_CARD_ORDER[2]]: true,
        [DEFAULT_MOCK_CARD_ORDER[3]]: true,
      },
    },
    hiddenDashboardCards:
      overrides.hiddenDashboardCards ??
      overrides.dashboard?.hiddenSections ??
      [],
    createdAt: overrides.createdAt ?? timestamp,
    updatedAt: overrides.updatedAt ?? timestamp,
  };
  return { ...base, ...overrides };
};

/**
 * Create a mock UserGoalsContract for testing
 */
export const createMockUserGoals = (
  overrides: Partial<UserGoalsContract> = {},
): UserGoalsContract => {
  const timestamp = nowIso();
  const base: UserGoalsContract = {
    id: overrides.id,
    userId: overrides.userId ?? "mock-user",
    calorieTarget: overrides.calorieTarget ?? 2200,
    proteinTarget: overrides.proteinTarget ?? 150,
    carbTarget: overrides.carbTarget ?? 200,
    fatTarget: overrides.fatTarget ?? 65,
    weeklyWeightChangeTarget: overrides.weeklyWeightChangeTarget ?? -0.25,
    workoutsPerWeek: overrides.workoutsPerWeek ?? 4,
    sleepHoursTarget: overrides.sleepHoursTarget ?? 7.5,
    createdAt: overrides.createdAt ?? timestamp,
    updatedAt: overrides.updatedAt ?? timestamp,
  };
  return { ...base, ...overrides };
};

/**
 * Create a mock UserMetricsContract for testing
 */
export const createMockUserMetrics = (
  overrides: Partial<UserMetricsContract> = {},
): UserMetricsContract => ({
  tdee: 2200,
  bmr: 1700,
  recoveryScore: 75,
  trainingLoad: 250,
  currentWeight: 72,
  weeklyWeightChange: -0.2,
  monthlyWeightChange: -0.8,
  currentBodyFat: 18,
  currentMuscleMass: 32,
  sleepPerformance: 80,
  averageSleepDuration: 7.5,
  averageSleepQuality: 82,
  averageHRV: 65,
  averageRestingHR: 58,
  stressScore: 35,
  todaysStrain: 12,
  weeklyStrain: 80,
  monthlyStrain: 320,
  stepCount: 8500,
  activeMinutes: 45,
  loggedCalories: 2100,
  weeklyCalorieAverage: 2150,
  macroAdherence: 85,
  workoutStreak: 5,
  loggingStreak: 12,
  adherenceScore: 88,
  lastUpdated: nowIso(),
  ...overrides,
});

export const createMockUserAccount = (
  overrides: {
    profile?: Partial<UserProfileContract>;
    preferences?: Partial<UserPreferencesContract>;
    goals?: Partial<UserGoalsContract> | null;
    metrics?: Partial<UserMetricsContract> | null;
  } = {},
): UserAccountContract => ({
  profile: createMockUserProfile(overrides.profile),
  preferences: createMockUserPreferences(overrides.preferences),
  goals:
    overrides.goals === null
      ? undefined
      : createMockUserGoals(overrides.goals ?? {}),
  metrics:
    overrides.metrics === null
      ? undefined
      : createMockUserMetrics(overrides.metrics ?? {}),
});

// ============================================================================
// DASHBOARD PREFERENCES
// ============================================================================

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

// ============================================================================
// PREFERENCES SCHEMAS
// ============================================================================

/**
 * HH:MM 24-hour time string (e.g., "09:30", "23:59").
 * Used for notification times, schedule times, etc.
 */
export const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/u, "Time must be in HH:MM 24-hour format");
export type TimeString = z.infer<typeof timeStringSchema>;

export const timeOfDaySchema = timeStringSchema;
export type TimeOfDay = z.infer<typeof timeOfDaySchema>;

export const advancedUnitPreferencesSchema = z.object({
  weight: z.enum(["kg", "lbs"]),
  height: z.enum(["cm", "ft_in"]),
  foodWeight: z.enum(["g", "oz", "lbs"]),
  foodVolume: z.enum(["ml", "fl_oz", "cups", "tbsp", "tsp"]),
  calories: z.enum(["kcal", "kj"]),
  exerciseWeight: z.enum(["kg", "lbs"]),
  distance: z.enum(["km", "mi", "m", "ft"]),
  speed: z.enum(["km_h", "mph", "m_s"]),
  altitude: z.enum(["m", "ft"]),
  temperature: z.enum(["celsius", "fahrenheit"]),
  water: z.enum(["ml", "fl_oz", "cups", "l"]),
});
export type AdvancedUnitPreferences = z.infer<
  typeof advancedUnitPreferencesSchema
>;

export const dashboardPreferencesSchema = z.object({
  sectionOrder: z.array(z.string()),
  hiddenSections: z.array(z.string()),
  pinnedSections: z.array(z.string()),
});
export type DashboardPreferences = z.infer<typeof dashboardPreferencesSchema>;

export type DashboardPreferencesContract = z.infer<
  typeof dashboardPreferencesSchema
>;

export const dashboardSectionsSchema = z.object({
  order: z.array(z.string()),
  visibility: z.record(z.string(), z.boolean()),
});

export type DashboardSectionsContract = z.infer<typeof dashboardSectionsSchema>;

export const dailyNotificationSchema = z.object({
  enabled: z.boolean(),
  time: timeOfDaySchema,
  autoLearn: z.boolean().optional(),
  customMessage: z.string().max(120).optional(),
});

export type DailyNotificationContract = z.infer<typeof dailyNotificationSchema>;

export const weeklyNotificationSchema = z.object({
  enabled: z.boolean(),
  time: timeOfDaySchema,
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
});
export type WeeklyNotification = z.infer<typeof weeklyNotificationSchema>;

export type WeeklyNotificationContract = z.infer<
  typeof weeklyNotificationSchema
>;

export const frequencyNotificationSchema = z.object({
  enabled: z.boolean(),
  time: timeOfDaySchema,
  frequency: z.enum(["daily", "weekly", "biweekly", "monthly", "custom"]),
  intelligentMode: z.boolean().optional(),
});
export type FrequencyNotification = z.infer<typeof frequencyNotificationSchema>;

export type FrequencyNotificationContract = z.infer<
  typeof frequencyNotificationSchema
>;

export const nutritionNotificationSchema = z.object({
  enabled: z.boolean(),
  breakfastTime: timeOfDaySchema,
  lunchTime: timeOfDaySchema,
  dinnerTime: timeOfDaySchema,
});
export type NutritionNotification = z.infer<typeof nutritionNotificationSchema>;

export type NutritionNotificationContract = z.infer<
  typeof nutritionNotificationSchema
>;

export const adminPortalNotificationPreferencesSchema = z.object({
  appointmentBookedByOthers: z.boolean(),
  appointmentCancelledByOthers: z.boolean(),
  appointmentModifiedByOthers: z.boolean(),
  patientAssignedToMe: z.boolean(),
});
export type AdminPortalNotificationPreferences = z.infer<
  typeof adminPortalNotificationPreferencesSchema
>;

export type AdminPortalNotificationPreferencesContract = z.infer<
  typeof adminPortalNotificationPreferencesSchema
>;

export const notificationPreferencesSchema = z.object({
  morningBriefing: dailyNotificationSchema,
  eveningCheckIn: dailyNotificationSchema,
  weeklyInsights: weeklyNotificationSchema,
  coPilotCheckIns: frequencyNotificationSchema,
  trainingGuidance: frequencyNotificationSchema,
  nutritionCoaching: nutritionNotificationSchema,
  adminPortal: adminPortalNotificationPreferencesSchema,
});
export type NotificationPreferences = z.infer<
  typeof notificationPreferencesSchema
>;

export type NotificationPreferencesContract = z.infer<
  typeof notificationPreferencesSchema
>;

// ============================================================================
// USER PREFERENCES SCHEMA (defined here after dashboard/notification schemas)
// ============================================================================

export const UserPreferencesSchema = z.object({
  id: z.string().optional(),
  userId: z.string().max(20),
  unitSystem: z.enum(["imperial", "metric", "advanced"]),
  timeFormat: z.enum(["standard", "military"]),
  locale: z.string(),
  dashboard: dashboardPreferencesSchema.default({
    sectionOrder: ["dailySummary", "nutrition", "workout", "recovery"],
    hiddenSections: [],
    pinnedSections: [],
  }),
  advancedUnits: advancedUnitPreferencesSchema.default(defaultAdvancedUnits()),
  notifications: notificationPreferencesSchema.default(defaultNotifications()),
  /** @deprecated Alias for `unitSystem`. No standalone DB column. Use `unitSystem` instead. Will be removed in a future contract cleanup. */
  units: z.enum(["imperial", "metric", "advanced"]).optional(),
  dashboardCardOrder: z.array(z.string()).optional(),
  dashboardSections: dashboardSectionsSchema.optional(),
  /** @stored-in UserPreferences.dashboard JSON blob as dashboard.hiddenSections. Not a standalone DB column. Derive from dashboard.hiddenSections at serialisation time. */
  hiddenDashboardCards: z.array(z.string()).optional(),
  eveningReminderEnabled: z.boolean().optional(),
  eveningReminderTime: timeStringSchema.optional(),
  customReminderMessage: z.string().max(120).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserPreferencesContract = z.infer<typeof UserPreferencesSchema>;

export const UserAccountSchema = z.object({
  profile: UserProfileSchema,
  preferences: UserPreferencesSchema.optional(),
  goals: UserGoalsSchema.optional(),
  metrics: UserMetricsSchema.optional(),
});

export type UserAccountContract = z.infer<typeof UserAccountSchema>;

// ============================================================================
// ADMIN FORM SCHEMAS
// ============================================================================

/**
 * Zod schema for the admin portal profile-settings form.
 * Validates the two editable fields before calling the profile service.
 */
export const adminProfileFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  email: z.string().email("Invalid email address"),
});
export type AdminProfileFormInput = z.infer<typeof adminProfileFormSchema>;

// ============================================================================
// GDPR / CCPA DELETION REQUEST CONTRACT
// ============================================================================

/**
 * Input schema for a patient-initiated account deletion request.
 *
 * Satisfies GDPR Art. 17 (right to erasure) and CCPA § 1798.105.
 * The `reason` field is optional — patients are not required to justify their
 * erasure request under either regulation.
 *
 * Consumed by: POST /api/account/deletion-request (mobile, web-public)
 */
export const DeletionRequestInputSchema = z.object({
  reason: z.string().max(500).optional(),
});

export type DeletionRequestInput = z.infer<typeof DeletionRequestInputSchema>;

// ============================================================================
// HELPER UTILITIES
// ============================================================================

export const buildVisibilityMap = (
  order: string[],
  hidden: string[],
  existing?: Record<string, boolean>,
): Record<string, boolean> =>
  order.reduce<Record<string, boolean>>((acc, id) => {
    acc[id] = existing?.[id] ?? !hidden.includes(id);
    return acc;
  }, {});
