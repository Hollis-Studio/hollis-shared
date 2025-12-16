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
 * - ADMIN: Full system access, manages clinicians and all patients
 * - CLINICIAN: Health coaches, can manage assigned patients
 * - CLIENT: Regular users/patients
 */
export const USER_ROLES = ['ADMIN', 'CLINICIAN', 'CLIENT'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const UserRoleSchema = z.enum(USER_ROLES);

/** Centralized role constants for equality checks */
export const USER_ROLE = {
  ADMIN: 'ADMIN' as UserRole,
  CLINICIAN: 'CLINICIAN' as UserRole,
  CLIENT: 'CLIENT' as UserRole,
} as const;

export const DEFAULT_USER_ROLE: UserRole = USER_ROLE.CLIENT;

/** Roles that can access admin features (web-admin, mobile admin panel) */
export const ADMIN_ROLES: readonly UserRole[] = ['ADMIN', 'CLINICIAN'] as const;

/** Check if a role has admin privileges */
export function isAdminRole(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN || role === USER_ROLE.CLINICIAN;
}

/** Check if a role is ADMIN (full system access) */
export function isSiteAdminRole(role: string | undefined | null): boolean {
  return role === USER_ROLE.ADMIN;
}

/** Human-readable labels for user roles */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  CLINICIAN: 'Clinician',
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
  ESSENTIALS: 'ESSENTIALS' as UserTier,
  CORE: 'CORE' as UserTier,
  CONCIERGE: 'CONCIERGE' as UserTier,
} as const;

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
 * Centralized conversion factors for unit calculations.
 * All conversions are defined relative to their base units:
 * - Weight: kg
 * - Length/Height: cm, m
 * - Food weight: g
 * - Food/water volume: ml
 * - Temperature: celsius
 */
export const UNIT_CONVERSION = {
  // Weight
  LBS_PER_KG: 2.20462,
  
  // Length
  CM_PER_INCH: 2.54,
  INCHES_PER_FOOT: 12,
  
  // Food weight
  OZ_PER_GRAM: 0.035274,
  LBS_PER_GRAM: 0.00220462,
  
  // Food volume
  FL_OZ_PER_ML: 0.033814,
  CUPS_PER_ML: 0.00422675,
  TBSP_PER_ML: 0.067628,
  TSP_PER_ML: 0.202884,
  
  // Distance
  KM_PER_M: 0.001,
  MI_PER_M: 0.000621371,
  FT_PER_M: 3.28084,
  
  // Water (same as food volume for overlapping units)
  L_PER_ML: 0.001,
} as const;
