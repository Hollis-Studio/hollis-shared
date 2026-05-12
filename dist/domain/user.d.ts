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
import { z } from "zod";
/**
 * OAuth provider types supported for social sign-in.
 * Matches the Prisma OAuthProviderType enum (uppercase values).
 *
 * NOTE: This is distinct from the lowercase OAuthProvider type in
 * shared/contracts/constants (which uses "apple" | "google" for URL routing).
 * This type aligns with the DB enum used in the OAuthAccount model.
 */
export declare const OAUTH_PROVIDER: {
    readonly APPLE: "APPLE";
    readonly GOOGLE: "GOOGLE";
};
export declare const OAuthProviderSchema: z.ZodEnum<{
    APPLE: "APPLE";
    GOOGLE: "GOOGLE";
}>;
export type OAuthProviderType = z.infer<typeof OAuthProviderSchema>;
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
export declare const USER_ROLES: readonly ["ADMIN", "CLINICIAN", "TRAINER", "CLIENT"];
export declare const UserRoleSchema: z.ZodEnum<{
    ADMIN: "ADMIN";
    CLINICIAN: "CLINICIAN";
    TRAINER: "TRAINER";
    CLIENT: "CLIENT";
}>;
export type UserRole = z.infer<typeof UserRoleSchema>;
/** Centralized role constants for equality checks */
export declare const USER_ROLE: {
    readonly ADMIN: "ADMIN";
    readonly CLINICIAN: "CLINICIAN";
    readonly TRAINER: "TRAINER";
    readonly CLIENT: "CLIENT";
};
export declare const DEFAULT_USER_ROLE: UserRole;
/** Roles that can access admin features (web-admin, mobile admin panel) */
export declare const ADMIN_ROLES: readonly UserRole[];
/** Roles that can access clinical/PHI data (clinicians and admins, not trainers) */
export declare const CLINICAL_ROLES: readonly UserRole[];
/** Roles that can access training data (trainers and admins, not clinicians unless admin) */
export declare const TRAINING_ROLES: readonly UserRole[];
/** Check if a role has admin portal access (can log into web-admin) */
export declare function isAdminRole(role: string | undefined | null): boolean;
/** Check if a role has clinical/PHI access (ADMIN or CLINICIAN) */
export declare function isClinicalRole(role: string | undefined | null): boolean;
/** Check if a role has training access (ADMIN or TRAINER) */
export declare function isTrainerRole(role: string | undefined | null): boolean;
/** Check if a role is ADMIN (full system access) */
export declare function isSiteAdminRole(role: string | undefined | null): boolean;
/**
 * Permission: Can view financial data (MRR, revenue, sales funnel)
 * Only ADMIN can see business financials - clinicians and trainers cannot
 */
export declare function canViewFinancials(role: string | undefined | null): boolean;
/**
 * Permission: Can manage staff (trainer leaderboard, assignments to other staff)
 * Only ADMIN can manage staff - clinicians and trainers see only their own data
 */
export declare function canManageStaff(role: string | undefined | null): boolean;
/**
 * Permission: Can view sensitive clinical care team notes
 * ADMIN and CLINICIAN can see care team coordination notes
 * TRAINER cannot see clinical diagnoses or care team communications
 */
export declare function canViewCareTeamNotes(role: string | undefined | null): boolean;
/**
 * Permission: Can view lab results and hormone panels
 * ADMIN and CLINICIAN can see full lab data
 * TRAINER should not see raw lab values (only training-relevant summaries)
 */
export declare function canViewLabResults(role: string | undefined | null): boolean;
/**
 * Permission: Can manage registrations and lead pipeline
 * Only ADMIN handles new member onboarding and sales funnel
 */
export declare function canManageRegistrations(role: string | undefined | null): boolean;
/**
 * Human-readable labels for user roles.
 * Note: CLIENT is intentionally "Client" here (formal role reference in matrices/tables).
 * ROLE_BADGE_CONFIG.CLIENT uses "Patient" for patient-facing UI display contexts.
 * Do not unify these — the divergence is intentional.
 */
export declare const USER_ROLE_LABELS: Record<UserRole, string>;
/**
 * Role badge configuration for display in messaging and UI.
 */
export interface RoleBadge {
    label: string;
    color: string;
    bg: string;
}
/**
 * Role badge configuration mapped by user role.
 *
 * This is the cross-platform version used by web-admin and any consumer that cannot
 * depend on @hollis/design-tokens at runtime. Values are kept in sync with the design
 * tokens (see ROLE_BADGE_COLORS above).
 *
 * Mobile app: use ROLE_BADGE_CONFIG from src/contracts/commonEnums.ts instead, which
 * resolves colors via @hollis/design-tokens at runtime for dynamic theming.
 */
export declare const ROLE_BADGE_CONFIG: Record<UserRole, RoleBadge>;
/**
 * Get role badge configuration for display.
 * Returns badge config for known roles, or a default badge for unknown roles.
 * Returns null if role is null/undefined.
 */
export declare function getRoleBadge(role: string | undefined | null): RoleBadge | null;
/**
 * Membership tiers for Hollis Health.
 * - ESSENTIALS ($799/mo): 4 fitness sessions, basic clinical access
 * - CORE ($1599/mo): 8 fitness sessions, enhanced clinical access
 * - CONCIERGE ($2499/mo): 16 fitness sessions, full clinical access
 */
export declare const USER_TIERS: readonly ["ESSENTIALS", "CORE", "CONCIERGE"];
export declare const UserTierSchema: z.ZodEnum<{
    ESSENTIALS: "ESSENTIALS";
    CORE: "CORE";
    CONCIERGE: "CONCIERGE";
}>;
export type UserTier = z.infer<typeof UserTierSchema>;
export declare const USER_TIER: {
    readonly ESSENTIALS: "ESSENTIALS";
    readonly CORE: "CORE";
    readonly CONCIERGE: "CONCIERGE";
};
export declare const DEFAULT_USER_TIER: UserTier;
/** Human-readable labels for membership tiers */
export declare const USER_TIER_LABELS: Record<UserTier, string>;
/**
 * Monthly pricing for each tier in whole dollars.
 * Note: These are dollar amounts (e.g., 799 = $799), not cents.
 * Convert to cents with `USER_TIER_PRICES_DOLLARS[tier] * 100` when needed for Stripe.
 *
 * @example
 * USER_TIER_PRICES_DOLLARS.ESSENTIALS // 799 ($799/month)
 * USER_TIER_PRICES_DOLLARS.ESSENTIALS * 100 // 79900 cents for Stripe
 */
export declare const USER_TIER_PRICES_DOLLARS: Record<UserTier, number>;
/**
 * @deprecated Use USER_TIER_PRICES_DOLLARS instead for clarity about units.
 * This alias is maintained for backwards compatibility but will be removed in a future version.
 */
export declare const USER_TIER_PRICES: Record<"ESSENTIALS" | "CORE" | "CONCIERGE", number>;
/** Tiers that include premium features (CORE and CONCIERGE) */
export declare const PREMIUM_TIERS: readonly UserTier[];
/** Check if a tier has premium features (CORE or CONCIERGE) */
export declare function isPremiumTier(tier: string | undefined | null): boolean;
/** Type guard: checks whether value is a valid UserTier */
export declare function isUserTier(value: string | undefined | null): value is UserTier;
/**
 * Canonical membership contract for user-tier membership records.
 * Used by server aggregation (UserFullData) and admin views.
 */
export declare const MembershipContractSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    startedAt: z.ZodString;
    endedAt: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type MembershipContract = z.infer<typeof MembershipContractSchema>;
/**
 * Valid biological sex values for user profiles.
 */
export declare const BIOLOGICAL_SEXES: readonly ["female", "male", "non_binary", "intersex", "prefer_not_to_say"];
export declare const BiologicalSexSchema: z.ZodEnum<{
    female: "female";
    male: "male";
    non_binary: "non_binary";
    intersex: "intersex";
    prefer_not_to_say: "prefer_not_to_say";
}>;
export type BiologicalSex = z.infer<typeof BiologicalSexSchema>;
/** Centralized biological sex constants for equality checks */
export declare const BIOLOGICAL_SEX: {
    readonly FEMALE: BiologicalSex;
    readonly MALE: BiologicalSex;
    readonly NON_BINARY: BiologicalSex;
    readonly INTERSEX: BiologicalSex;
    readonly PREFER_NOT_TO_SAY: BiologicalSex;
};
/** Human-readable labels for biological sex */
export declare const BIOLOGICAL_SEX_LABELS: Record<BiologicalSex, string>;
/**
 * Registration-specific biological sex options exposed on admin/signup flows.
 *
 * These values intentionally keep the simplified UI option `other` while the
 * persisted profile contract remains canonical (`non_binary`). Use the mapping
 * helpers below instead of hand-rolled client/server remaps.
 */
export declare const REGISTRATION_BIOLOGICAL_SEX_OPTIONS: readonly ["female" | "male" | "non_binary" | "intersex" | "prefer_not_to_say", "female" | "male" | "non_binary" | "intersex" | "prefer_not_to_say", "other"];
export declare const RegistrationBiologicalSexSchema: z.ZodEnum<{
    other: "other";
    female: "female";
    male: "male";
    non_binary: "non_binary";
    intersex: "intersex";
    prefer_not_to_say: "prefer_not_to_say";
}>;
export type RegistrationBiologicalSex = z.infer<typeof RegistrationBiologicalSexSchema>;
/** Centralized registration biological sex constants for equality checks */
export declare const REGISTRATION_BIOLOGICAL_SEX: {
    readonly MALE: RegistrationBiologicalSex;
    readonly FEMALE: RegistrationBiologicalSex;
    readonly OTHER: RegistrationBiologicalSex;
};
/** Human-readable labels for admin/signup biological sex options */
export declare const REGISTRATION_BIOLOGICAL_SEX_LABELS: Record<RegistrationBiologicalSex, string>;
/**
 * Canonical mapping from registration/signup values to stored profile values.
 * This prevents cross-surface drift between admin UI selections and backend
 * profile expectations.
 */
export declare const REGISTRATION_BIOLOGICAL_SEX_TO_BIOLOGICAL_SEX: Record<RegistrationBiologicalSex, BiologicalSex>;
export declare const RegistrationBiologicalSexInputSchema: z.ZodUnion<readonly [z.ZodEnum<{
    other: "other";
    female: "female";
    male: "male";
    non_binary: "non_binary";
    intersex: "intersex";
    prefer_not_to_say: "prefer_not_to_say";
}>, z.ZodEnum<{
    female: "female";
    male: "male";
    non_binary: "non_binary";
    intersex: "intersex";
    prefer_not_to_say: "prefer_not_to_say";
}>]>;
export type RegistrationBiologicalSexInput = z.infer<typeof RegistrationBiologicalSexInputSchema>;
/**
 * Normalize a registration biological sex input to the canonical stored
 * BiologicalSex contract.
 */
export declare function canonicalizeRegistrationBiologicalSex(value: RegistrationBiologicalSexInput | null | undefined): BiologicalSex | undefined;
/**
 * Valid activity level values for user profiles.
 */
export declare const ACTIVITY_LEVELS: readonly ["sedentary", "lightly_active", "moderately_active", "very_active", "athlete"];
export declare const ActivityLevelSchema: z.ZodEnum<{
    sedentary: "sedentary";
    lightly_active: "lightly_active";
    moderately_active: "moderately_active";
    very_active: "very_active";
    athlete: "athlete";
}>;
export type ActivityLevel = z.infer<typeof ActivityLevelSchema>;
/** Centralized activity level constants for equality checks */
export declare const ACTIVITY_LEVEL: {
    readonly SEDENTARY: ActivityLevel;
    readonly LIGHTLY_ACTIVE: ActivityLevel;
    readonly MODERATELY_ACTIVE: ActivityLevel;
    readonly VERY_ACTIVE: ActivityLevel;
    readonly ATHLETE: ActivityLevel;
};
/** Human-readable labels for activity levels */
export declare const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string>;
/**
 * Valid primary goal values for user profiles.
 */
export declare const PRIMARY_GOALS: readonly ["lose_weight", "gain_muscle", "maintain", "improve_health", "other"];
export declare const PrimaryGoalSchema: z.ZodEnum<{
    other: "other";
    lose_weight: "lose_weight";
    gain_muscle: "gain_muscle";
    maintain: "maintain";
    improve_health: "improve_health";
}>;
export type PrimaryGoal = z.infer<typeof PrimaryGoalSchema>;
/** Centralized primary goal constants for equality checks */
export declare const PRIMARY_GOAL: {
    readonly LOSE_WEIGHT: PrimaryGoal;
    readonly GAIN_MUSCLE: PrimaryGoal;
    readonly MAINTAIN: PrimaryGoal;
    readonly IMPROVE_HEALTH: PrimaryGoal;
    readonly OTHER: PrimaryGoal;
};
/** Human-readable labels for primary goals */
export declare const PRIMARY_GOAL_LABELS: Record<PrimaryGoal, string>;
/**
 * Valid fitness experience values for user profiles.
 */
export declare const FITNESS_EXPERIENCES: readonly ["beginner", "intermediate", "advanced", "expert"];
export declare const FitnessExperienceSchema: z.ZodEnum<{
    advanced: "advanced";
    beginner: "beginner";
    intermediate: "intermediate";
    expert: "expert";
}>;
export type FitnessExperience = z.infer<typeof FitnessExperienceSchema>;
/** Centralized fitness experience constants for equality checks */
export declare const FITNESS_EXPERIENCE: {
    readonly BEGINNER: FitnessExperience;
    readonly INTERMEDIATE: FitnessExperience;
    readonly ADVANCED: FitnessExperience;
    readonly EXPERT: FitnessExperience;
};
/** Human-readable labels for fitness experience */
export declare const FITNESS_EXPERIENCE_LABELS: Record<FitnessExperience, string>;
/**
 * Valid notification frequency values.
 */
export declare const NOTIFICATION_FREQUENCIES: readonly ["daily", "weekly", "biweekly", "monthly", "custom"];
export declare const NotificationFrequencySchema: z.ZodEnum<{
    custom: "custom";
    daily: "daily";
    weekly: "weekly";
    biweekly: "biweekly";
    monthly: "monthly";
}>;
export type NotificationFrequency = z.infer<typeof NotificationFrequencySchema>;
/** Centralized notification frequency constants for equality checks */
export declare const NOTIFICATION_FREQUENCY: {
    readonly DAILY: NotificationFrequency;
    readonly WEEKLY: NotificationFrequency;
    readonly BIWEEKLY: NotificationFrequency;
    readonly MONTHLY: NotificationFrequency;
    readonly CUSTOM: NotificationFrequency;
};
/** Human-readable labels for notification frequencies */
export declare const NOTIFICATION_FREQUENCY_LABELS: Record<NotificationFrequency, string>;
/**
 * Valid weekday values for scheduling.
 */
export declare const WEEKDAYS: readonly ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
export declare const WeekdaySchema: z.ZodEnum<{
    monday: "monday";
    tuesday: "tuesday";
    wednesday: "wednesday";
    thursday: "thursday";
    friday: "friday";
    saturday: "saturday";
    sunday: "sunday";
}>;
export type Weekday = z.infer<typeof WeekdaySchema>;
/** Centralized weekday constants for equality checks */
export declare const WEEKDAY: {
    readonly MONDAY: Weekday;
    readonly TUESDAY: Weekday;
    readonly WEDNESDAY: Weekday;
    readonly THURSDAY: Weekday;
    readonly FRIDAY: Weekday;
    readonly SATURDAY: Weekday;
    readonly SUNDAY: Weekday;
};
/** Human-readable labels for weekdays */
export declare const WEEKDAY_LABELS: Record<Weekday, string>;
/**
 * Valid account status values.
 * Maps to isActive boolean in DB: 'active' = true, others = false
 */
export declare const ACCOUNT_STATUSES: readonly ["active", "suspended", "inactive", "archived"];
/**
 * Settable account statuses — excludes "archived" which is only set
 * via the dedicated archive endpoint (triggers PII anonymization).
 */
export declare const SETTABLE_ACCOUNT_STATUSES: readonly ["active", "suspended", "inactive"];
export declare const PATIENT_ACCOUNT_STATUS_FILTERS: readonly ["active", "suspended", "inactive", "archived", "all"];
export declare const SettableAccountStatusSchema: z.ZodEnum<{
    active: "active";
    suspended: "suspended";
    inactive: "inactive";
}>;
export type SettableAccountStatus = z.infer<typeof SettableAccountStatusSchema>;
export declare const AccountStatusSchema: z.ZodEnum<{
    active: "active";
    suspended: "suspended";
    inactive: "inactive";
    archived: "archived";
}>;
export type AccountStatus = z.infer<typeof AccountStatusSchema>;
export declare const PatientAccountStatusFilterSchema: z.ZodEnum<{
    active: "active";
    suspended: "suspended";
    inactive: "inactive";
    archived: "archived";
    all: "all";
}>;
export type PatientAccountStatusFilter = z.infer<typeof PatientAccountStatusFilterSchema>;
/** Type alias for backwards compatibility */
export type AccountStatusValue = AccountStatus;
/** Constant object for account status comparisons */
export declare const ACCOUNT_STATUS: {
    readonly ACTIVE: AccountStatus;
    readonly SUSPENDED: AccountStatus;
    readonly INACTIVE: AccountStatus;
    readonly ARCHIVED: AccountStatus;
};
/** Human-readable labels for account statuses */
export declare const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string>;
/** Canonical boolean flags persisted on the User record for account status. */
export interface AccountStatusFlags {
    isActive: boolean;
    accountSuspended: boolean;
}
/**
 * Canonical account state derived from persisted flags.
 * Includes the normalized booleans plus the derived status value.
 */
export interface CanonicalAccountState extends AccountStatusFlags {
    accountStatus: AccountStatus;
}
/**
 * Convert the canonical account status enum to the persisted User flags.
 *
 * Canonical mapping:
 * - active -> isActive=true,  accountSuspended=false
 * - suspended -> isActive=true,  accountSuspended=true
 * - inactive -> isActive=false, accountSuspended=false
 */
export declare function mapAccountStatusToFlags(status: AccountStatusValue): AccountStatusFlags;
/**
 * Returns true if the given account status represents a fully active,
 * unsuspended account.
 */
export declare function isActiveAccountStatus(status: AccountStatusValue): boolean;
/**
 * Derives AccountStatus from isActive and accountSuspended boolean flags.
 * Used by server-side services to compute the display status from DB fields.
 *
 * Logic:
 * - isActive=true, accountSuspended=false → "active"
 * - isActive=true, accountSuspended=true → "suspended"
 * - isActive=false → "inactive"
 *
 * @param isActive Account active flag (from User.isActive)
 * @param accountSuspended Account suspension flag (from User.accountSuspended)
 * @returns Derived AccountStatus value
 */
export declare function deriveAccountStatus(isActive: boolean | undefined, accountSuspended: boolean | undefined, deletedAt?: Date | string | null): AccountStatus;
/**
 * Normalize persisted account flags to the canonical cross-surface representation.
 *
 * This is intentionally lossy for invalid legacy combinations. For example,
 * `isActive=false` + `accountSuspended=true` is normalized to canonical
 * `inactive` => `isActive=false` + `accountSuspended=false`.
 */
export declare function normalizeAccountStatusFlags(isActive: boolean | undefined, accountSuspended: boolean | undefined, deletedAt?: Date | string | null): CanonicalAccountState;
/**
 * Valid pregnancy status values (manual override for clinical profile).
 */
export declare const PREGNANCY_STATUSES: readonly ["not_pregnant", "trimester_1", "trimester_2", "trimester_3", "postpartum"];
export declare const PregnancyStatusSchema: z.ZodEnum<{
    not_pregnant: "not_pregnant";
    trimester_1: "trimester_1";
    trimester_2: "trimester_2";
    trimester_3: "trimester_3";
    postpartum: "postpartum";
}>;
export type PregnancyStatus = z.infer<typeof PregnancyStatusSchema>;
/** Centralized pregnancy status constants for equality checks */
export declare const PREGNANCY_STATUS: {
    readonly NOT_PREGNANT: PregnancyStatus;
    readonly TRIMESTER_1: PregnancyStatus;
    readonly TRIMESTER_2: PregnancyStatus;
    readonly TRIMESTER_3: PregnancyStatus;
    readonly POSTPARTUM: PregnancyStatus;
};
/** Human-readable labels for pregnancy status */
export declare const PREGNANCY_STATUS_LABELS: Record<PregnancyStatus, string>;
/**
 * Calculate trimester from an expected due date (assumes 40-week gestation).
 * T1: 0-13 weeks, T2: 14-27 weeks, T3: 28-40 weeks, postpartum after due date.
 *
 * @param dueDate - The expected due date
 * @param referenceDate - The reference date for calculation (defaults to now)
 * @returns The calculated pregnancy status
 */
export declare function calculateTrimesterFromDueDate(dueDate: Date, referenceDate?: Date): PregnancyStatus;
/**
 * Recipient roles for messaging threads.
 * These are different from UserRoles - they represent logical message destinations.
 * - FITNESS_COORDINATOR: The assigned fitness coordinator/trainer
 * - CLINICIAN: The assigned clinician/healthcare provider
 */
export declare const MESSAGE_RECIPIENT_ROLES: readonly ["FITNESS_COORDINATOR", "CLINICIAN"];
export declare const MessagingRecipientRoleSchema: z.ZodEnum<{
    CLINICIAN: "CLINICIAN";
    FITNESS_COORDINATOR: "FITNESS_COORDINATOR";
}>;
export type MessagingRecipientRole = z.infer<typeof MessagingRecipientRoleSchema>;
/** Centralized messaging recipient role constants for equality checks */
export declare const MESSAGE_RECIPIENT_ROLE: {
    readonly FITNESS_COORDINATOR: MessagingRecipientRole;
    readonly CLINICIAN: MessagingRecipientRole;
};
/** Human-readable labels for messaging recipient roles */
export declare const MESSAGE_RECIPIENT_ROLE_LABELS: Record<MessagingRecipientRole, string>;
/**
 * UNIT_CONVERSION has been moved to shared/contracts/constants/index.ts
 * Import from @hollis/contracts or ../constants instead of this file.
 *
 * This comment remains for backward compatibility references, but the export
 * has been removed to avoid duplicate exports in the barrel file.
 */
/**
 * User profile contract - core user profile information.
 */
export declare const UserProfileSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    email: z.ZodString;
    fullName: z.ZodString;
    preferredName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>>;
    tier: z.ZodOptional<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    occupation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    primaryGoal: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        other: "other";
        lose_weight: "lose_weight";
        gain_muscle: "gain_muscle";
        maintain: "maintain";
        improve_health: "improve_health";
    }>>>;
    primaryGoalNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    activityLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        sedentary: "sedentary";
        lightly_active: "lightly_active";
        moderately_active: "moderately_active";
        very_active: "very_active";
        athlete: "athlete";
    }>>>;
    experienceLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        advanced: "advanced";
        beginner: "beginner";
        intermediate: "intermediate";
        expert: "expert";
    }>>>;
    dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    biologicalSex: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        female: "female";
        male: "male";
        non_binary: "non_binary";
        intersex: "intersex";
        prefer_not_to_say: "prefer_not_to_say";
    }>>>;
    pregnancyStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        not_pregnant: "not_pregnant";
        trimester_1: "trimester_1";
        trimester_2: "trimester_2";
        trimester_3: "trimester_3";
        postpartum: "postpartum";
    }>>>;
    pregnancyDueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    calculatedPregnancyStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        not_pregnant: "not_pregnant";
        trimester_1: "trimester_1";
        trimester_2: "trimester_2";
        trimester_3: "trimester_3";
        postpartum: "postpartum";
    }>>>;
    heightCm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    initialWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    timezone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fitness: z.ZodOptional<z.ZodObject<{
        defaultWeightUnit: z.ZodOptional<z.ZodEnum<{
            kg: "kg";
            lbs: "lbs";
        }>>;
        defaultWeightMode: z.ZodOptional<z.ZodEnum<{
            absolute: "absolute";
            relative: "relative";
        }>>;
        defaultDistanceUnit: z.ZodOptional<z.ZodEnum<{
            km: "km";
            mi: "mi";
        }>>;
        progressionIncrementKg: z.ZodOptional<z.ZodNumber>;
        repIncrement: z.ZodOptional<z.ZodNumber>;
        goEasierPercent: z.ZodOptional<z.ZodNumber>;
        defaultRestTimerSec: z.ZodOptional<z.ZodNumber>;
        trainingPhase: z.ZodOptional<z.ZodEnum<{
            maintain: "maintain";
            build: "build";
            cut: "cut";
        }>>;
        adaptiveProgression: z.ZodOptional<z.ZodBoolean>;
        cardioProgressionFocus: z.ZodOptional<z.ZodEnum<{
            distance: "distance";
            duration: "duration";
            pace: "pace";
        }>>;
        cardioGoalPreset: z.ZodOptional<z.ZodEnum<{
            none: "none";
            general: "general";
            endurance: "endurance";
            weight_loss: "weight_loss";
            threshold: "threshold";
        }>>;
        appleHealthConnected: z.ZodOptional<z.ZodBoolean>;
        maxHRBpm: z.ZodOptional<z.ZodNumber>;
        hapticIntensity: z.ZodOptional<z.ZodEnum<{
            light: "light";
            medium: "medium";
            heavy: "heavy";
            off: "off";
        }>>;
        defaultRIR: z.ZodOptional<z.ZodNumber>;
    }, z.core.$loose>>;
    assignedClinicianId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assignedTrainerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    medications: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        dosage: z.ZodString;
        frequency: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    limitations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            moderate: "moderate";
            mild: "mild";
            severe: "severe";
        }>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    injuries: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        bodyPart: z.ZodOptional<z.ZodString>;
        occurredAt: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<{
            moderate: "moderate";
            mild: "mild";
            severe: "severe";
        }>>;
        recoveryStatus: z.ZodOptional<z.ZodEnum<{
            active: "active";
            recovering: "recovering";
            healed: "healed";
            chronic: "chronic";
        }>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    medicalConditions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        status: z.ZodEnum<{
            active: "active";
            managed: "managed";
            resolved: "resolved";
            monitoring: "monitoring";
        }>;
        diagnosisDate: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    onboardingCompleted: z.ZodBoolean;
    isActive: z.ZodOptional<z.ZodBoolean>;
    accountSuspended: z.ZodOptional<z.ZodBoolean>;
    recordRetentionDate: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    deletionRequestedAt: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    deletionReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    stateOfResidence: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type UserProfileContract = z.infer<typeof UserProfileSchema>;
/**
 * Validates PHI fields submitted from PersonalInfoSection before persisting.
 * All fields are optional (partial update). Uses `.passthrough()` so that
 * unrecognised FormDataRecord keys are preserved without causing a parse error.
 */
export declare const personalInfoFormSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    preferredName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    biologicalSex: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        female: "female";
        male: "male";
        non_binary: "non_binary";
        intersex: "intersex";
        prefer_not_to_say: "prefer_not_to_say";
    }>>>;
    occupation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
export type PersonalInfoFormData = z.infer<typeof personalInfoFormSchema>;
/**
 * Validates PHI physical-stats fields **after** unit conversion to metric.
 * Called in PhysicalStatsSection.handleSaveWithConversion before persisting.
 * Uses `.passthrough()` so non-validated FormDataRecord keys are preserved.
 */
export declare const physicalStatsFormSchema: z.ZodObject<{
    heightCm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    activityLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        sedentary: "sedentary";
        lightly_active: "lightly_active";
        moderately_active: "moderately_active";
        very_active: "very_active";
        athlete: "athlete";
    }>>>;
    experienceLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        advanced: "advanced";
        beginner: "beginner";
        intermediate: "intermediate";
        expert: "expert";
    }>>>;
    primaryGoal: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        other: "other";
        lose_weight: "lose_weight";
        gain_muscle: "gain_muscle";
        maintain: "maintain";
        improve_health: "improve_health";
    }>>>;
    primaryGoalNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
export type PhysicalStatsFormData = z.infer<typeof physicalStatsFormSchema>;
/**
 * @warning Fields in this contract are backed by a NutritionPlan.notes JSON blob, not standalone DB columns.
 * Migration to dedicated columns is recommended. See audit-04.
 */
export declare const UserGoalsSchema: z.ZodObject<{
    userId: z.ZodString;
    calorieTarget: z.ZodNumber;
    proteinTarget: z.ZodNumber;
    carbTarget: z.ZodNumber;
    fatTarget: z.ZodNumber;
    weeklyWeightChangeTarget: z.ZodNumber;
    workoutsPerWeek: z.ZodNumber;
    sleepHoursTarget: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type UserGoalsContract = z.infer<typeof UserGoalsSchema>;
export declare const UserMetricsSchema: z.ZodObject<{
    tdee: z.ZodNumber;
    bmr: z.ZodNumber;
    recoveryScore: z.ZodNumber;
    trainingLoad: z.ZodOptional<z.ZodNumber>;
    currentWeight: z.ZodOptional<z.ZodNumber>;
    weeklyWeightChange: z.ZodOptional<z.ZodNumber>;
    monthlyWeightChange: z.ZodOptional<z.ZodNumber>;
    currentBodyFat: z.ZodOptional<z.ZodNumber>;
    currentMuscleMass: z.ZodOptional<z.ZodNumber>;
    sleepPerformance: z.ZodNumber;
    averageSleepDuration: z.ZodOptional<z.ZodNumber>;
    averageSleepQuality: z.ZodOptional<z.ZodNumber>;
    averageHRV: z.ZodOptional<z.ZodNumber>;
    averageRestingHR: z.ZodOptional<z.ZodNumber>;
    stressScore: z.ZodOptional<z.ZodNumber>;
    todaysStrain: z.ZodNumber;
    weeklyStrain: z.ZodOptional<z.ZodNumber>;
    monthlyStrain: z.ZodOptional<z.ZodNumber>;
    stepCount: z.ZodOptional<z.ZodNumber>;
    activeMinutes: z.ZodOptional<z.ZodNumber>;
    loggedCalories: z.ZodNumber;
    weeklyCalorieAverage: z.ZodOptional<z.ZodNumber>;
    macroAdherence: z.ZodOptional<z.ZodNumber>;
    workoutStreak: z.ZodOptional<z.ZodNumber>;
    loggingStreak: z.ZodOptional<z.ZodNumber>;
    adherenceScore: z.ZodOptional<z.ZodNumber>;
    lastUpdated: z.ZodString;
}, z.core.$strip>;
export type UserMetricsContract = z.infer<typeof UserMetricsSchema>;
export declare const createMockUserProfile: (overrides?: Partial<UserProfileContract>) => UserProfileContract;
/**
 * Default notification preferences factory
 */
export declare const defaultNotifications: () => NotificationPreferencesContract;
/**
 * Default advanced unit preferences factory
 */
export declare const defaultAdvancedUnits: () => import("./units.js").AdvancedUnitPreferencesContract;
/**
 * Create a mock UserPreferencesContract for testing
 */
export declare const createMockUserPreferences: (overrides?: Partial<UserPreferencesContract>) => UserPreferencesContract;
/**
 * Create a mock UserGoalsContract for testing
 */
export declare const createMockUserGoals: (overrides?: Partial<UserGoalsContract>) => UserGoalsContract;
/**
 * Create a mock UserMetricsContract for testing
 */
export declare const createMockUserMetrics: (overrides?: Partial<UserMetricsContract>) => UserMetricsContract;
export declare const createMockUserAccount: (overrides?: {
    profile?: Partial<UserProfileContract>;
    preferences?: Partial<UserPreferencesContract>;
    goals?: Partial<UserGoalsContract> | null;
    metrics?: Partial<UserMetricsContract> | null;
}) => UserAccountContract;
/**
 * HH:MM 24-hour time string (e.g., "09:30", "23:59").
 * Used for notification times, schedule times, etc.
 */
export declare const timeStringSchema: z.ZodString;
export type TimeString = z.infer<typeof timeStringSchema>;
export declare const timeOfDaySchema: z.ZodString;
export type TimeOfDay = z.infer<typeof timeOfDaySchema>;
export declare const advancedUnitPreferencesSchema: z.ZodObject<{
    weight: z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>;
    height: z.ZodEnum<{
        cm: "cm";
        ft_in: "ft_in";
    }>;
    foodWeight: z.ZodEnum<{
        lbs: "lbs";
        g: "g";
        oz: "oz";
    }>;
    foodVolume: z.ZodEnum<{
        ml: "ml";
        fl_oz: "fl_oz";
        cups: "cups";
        tbsp: "tbsp";
        tsp: "tsp";
    }>;
    calories: z.ZodEnum<{
        kcal: "kcal";
        kj: "kj";
    }>;
    exerciseWeight: z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>;
    distance: z.ZodEnum<{
        km: "km";
        mi: "mi";
        m: "m";
        ft: "ft";
    }>;
    speed: z.ZodEnum<{
        km_h: "km_h";
        mph: "mph";
        m_s: "m_s";
    }>;
    altitude: z.ZodEnum<{
        m: "m";
        ft: "ft";
    }>;
    temperature: z.ZodEnum<{
        celsius: "celsius";
        fahrenheit: "fahrenheit";
    }>;
    water: z.ZodEnum<{
        ml: "ml";
        fl_oz: "fl_oz";
        cups: "cups";
        l: "l";
    }>;
}, z.core.$strip>;
export type AdvancedUnitPreferences = z.infer<typeof advancedUnitPreferencesSchema>;
export declare const dashboardPreferencesSchema: z.ZodObject<{
    sectionOrder: z.ZodDefault<z.ZodArray<z.ZodString>>;
    hiddenSections: z.ZodDefault<z.ZodArray<z.ZodString>>;
    pinnedSections: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type DashboardPreferences = z.infer<typeof dashboardPreferencesSchema>;
export type DashboardPreferencesContract = z.infer<typeof dashboardPreferencesSchema>;
export declare const dashboardSectionsSchema: z.ZodObject<{
    order: z.ZodArray<z.ZodString>;
    visibility: z.ZodRecord<z.ZodString, z.ZodBoolean>;
}, z.core.$strip>;
export type DashboardSectionsContract = z.infer<typeof dashboardSectionsSchema>;
export declare const dailyNotificationSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    time: z.ZodString;
    autoLearn: z.ZodOptional<z.ZodBoolean>;
    customMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DailyNotificationContract = z.infer<typeof dailyNotificationSchema>;
export declare const weeklyNotificationSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    time: z.ZodString;
    day: z.ZodEnum<{
        monday: "monday";
        tuesday: "tuesday";
        wednesday: "wednesday";
        thursday: "thursday";
        friday: "friday";
        saturday: "saturday";
        sunday: "sunday";
    }>;
}, z.core.$strip>;
export type WeeklyNotification = z.infer<typeof weeklyNotificationSchema>;
export type WeeklyNotificationContract = z.infer<typeof weeklyNotificationSchema>;
export declare const frequencyNotificationSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    time: z.ZodString;
    frequency: z.ZodEnum<{
        custom: "custom";
        daily: "daily";
        weekly: "weekly";
        biweekly: "biweekly";
        monthly: "monthly";
    }>;
    intelligentMode: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type FrequencyNotification = z.infer<typeof frequencyNotificationSchema>;
export type FrequencyNotificationContract = z.infer<typeof frequencyNotificationSchema>;
export declare const nutritionNotificationSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    breakfastTime: z.ZodString;
    lunchTime: z.ZodString;
    dinnerTime: z.ZodString;
}, z.core.$strip>;
export type NutritionNotification = z.infer<typeof nutritionNotificationSchema>;
export type NutritionNotificationContract = z.infer<typeof nutritionNotificationSchema>;
export declare const adminPortalNotificationPreferencesSchema: z.ZodObject<{
    appointmentBookedByOthers: z.ZodBoolean;
    appointmentCancelledByOthers: z.ZodBoolean;
    appointmentModifiedByOthers: z.ZodBoolean;
    patientAssignedToMe: z.ZodBoolean;
}, z.core.$strip>;
export type AdminPortalNotificationPreferences = z.infer<typeof adminPortalNotificationPreferencesSchema>;
export type AdminPortalNotificationPreferencesContract = z.infer<typeof adminPortalNotificationPreferencesSchema>;
export declare const notificationPreferencesSchema: z.ZodObject<{
    morningBriefing: z.ZodObject<{
        enabled: z.ZodBoolean;
        time: z.ZodString;
        autoLearn: z.ZodOptional<z.ZodBoolean>;
        customMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    eveningCheckIn: z.ZodObject<{
        enabled: z.ZodBoolean;
        time: z.ZodString;
        autoLearn: z.ZodOptional<z.ZodBoolean>;
        customMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    weeklyInsights: z.ZodObject<{
        enabled: z.ZodBoolean;
        time: z.ZodString;
        day: z.ZodEnum<{
            monday: "monday";
            tuesday: "tuesday";
            wednesday: "wednesday";
            thursday: "thursday";
            friday: "friday";
            saturday: "saturday";
            sunday: "sunday";
        }>;
    }, z.core.$strip>;
    coPilotCheckIns: z.ZodObject<{
        enabled: z.ZodBoolean;
        time: z.ZodString;
        frequency: z.ZodEnum<{
            custom: "custom";
            daily: "daily";
            weekly: "weekly";
            biweekly: "biweekly";
            monthly: "monthly";
        }>;
        intelligentMode: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    trainingGuidance: z.ZodObject<{
        enabled: z.ZodBoolean;
        time: z.ZodString;
        frequency: z.ZodEnum<{
            custom: "custom";
            daily: "daily";
            weekly: "weekly";
            biweekly: "biweekly";
            monthly: "monthly";
        }>;
        intelligentMode: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    nutritionCoaching: z.ZodObject<{
        enabled: z.ZodBoolean;
        breakfastTime: z.ZodString;
        lunchTime: z.ZodString;
        dinnerTime: z.ZodString;
    }, z.core.$strip>;
    adminPortal: z.ZodObject<{
        appointmentBookedByOthers: z.ZodBoolean;
        appointmentCancelledByOthers: z.ZodBoolean;
        appointmentModifiedByOthers: z.ZodBoolean;
        patientAssignedToMe: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;
export type NotificationPreferencesContract = z.infer<typeof notificationPreferencesSchema>;
export declare const dailyNotificationUpdateSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    time: z.ZodOptional<z.ZodString>;
    autoLearn: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    customMessage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const weeklyNotificationUpdateSchema: z.ZodPipe<z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    time: z.ZodOptional<z.ZodString>;
    day: z.ZodOptional<z.ZodEnum<{
        monday: "monday";
        tuesday: "tuesday";
        wednesday: "wednesday";
        thursday: "thursday";
        friday: "friday";
        saturday: "saturday";
        sunday: "sunday";
    }>>;
    dayOfWeek: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodTransform<{
    day?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | undefined;
    enabled?: boolean | undefined;
    time?: string | undefined;
}, {
    enabled?: boolean | undefined;
    time?: string | undefined;
    day?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | undefined;
    dayOfWeek?: number | undefined;
}>>;
export declare const frequencyNotificationUpdateSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    time: z.ZodOptional<z.ZodString>;
    frequency: z.ZodOptional<z.ZodEnum<{
        custom: "custom";
        daily: "daily";
        weekly: "weekly";
        biweekly: "biweekly";
        monthly: "monthly";
    }>>;
    intelligentMode: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const nutritionNotificationUpdateSchema: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    breakfastTime: z.ZodOptional<z.ZodString>;
    lunchTime: z.ZodOptional<z.ZodString>;
    dinnerTime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export declare const adminPortalNotificationPreferencesUpdateSchema: z.ZodObject<{
    appointmentBookedByOthers: z.ZodOptional<z.ZodBoolean>;
    appointmentCancelledByOthers: z.ZodOptional<z.ZodBoolean>;
    appointmentModifiedByOthers: z.ZodOptional<z.ZodBoolean>;
    patientAssignedToMe: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const notificationPreferencesUpdateSchema: z.ZodObject<{
    morningBriefing: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        time: z.ZodOptional<z.ZodString>;
        autoLearn: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        customMessage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    eveningCheckIn: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        time: z.ZodOptional<z.ZodString>;
        autoLearn: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
        customMessage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    weeklyInsights: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        time: z.ZodOptional<z.ZodString>;
        day: z.ZodOptional<z.ZodEnum<{
            monday: "monday";
            tuesday: "tuesday";
            wednesday: "wednesday";
            thursday: "thursday";
            friday: "friday";
            saturday: "saturday";
            sunday: "sunday";
        }>>;
        dayOfWeek: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>, z.ZodTransform<{
        day?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | undefined;
        enabled?: boolean | undefined;
        time?: string | undefined;
    }, {
        enabled?: boolean | undefined;
        time?: string | undefined;
        day?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday" | undefined;
        dayOfWeek?: number | undefined;
    }>>>>;
    coPilotCheckIns: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        time: z.ZodOptional<z.ZodString>;
        frequency: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            daily: "daily";
            weekly: "weekly";
            biweekly: "biweekly";
            monthly: "monthly";
        }>>;
        intelligentMode: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
    trainingGuidance: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        time: z.ZodOptional<z.ZodString>;
        frequency: z.ZodOptional<z.ZodEnum<{
            custom: "custom";
            daily: "daily";
            weekly: "weekly";
            biweekly: "biweekly";
            monthly: "monthly";
        }>>;
        intelligentMode: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
    nutritionCoaching: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        breakfastTime: z.ZodOptional<z.ZodString>;
        lunchTime: z.ZodOptional<z.ZodString>;
        dinnerTime: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    adminPortal: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        appointmentBookedByOthers: z.ZodOptional<z.ZodBoolean>;
        appointmentCancelledByOthers: z.ZodOptional<z.ZodBoolean>;
        appointmentModifiedByOthers: z.ZodOptional<z.ZodBoolean>;
        patientAssignedToMe: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type NotificationPreferencesUpdate = z.infer<typeof notificationPreferencesUpdateSchema>;
export type NotificationPreferencesUpdateContract = z.infer<typeof notificationPreferencesUpdateSchema>;
export declare function normalizeNotificationPreferences(value: unknown, fallback?: NotificationPreferencesContract): NotificationPreferencesContract;
export declare function mergeNotificationPreferences(base: unknown, update: unknown): NotificationPreferencesContract;
export declare const UserPreferencesSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
    unitSystem: z.ZodEnum<{
        metric: "metric";
        imperial: "imperial";
        advanced: "advanced";
    }>;
    timeFormat: z.ZodEnum<{
        standard: "standard";
        military: "military";
    }>;
    locale: z.ZodString;
    dashboard: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        sectionOrder: z.ZodDefault<z.ZodArray<z.ZodString>>;
        hiddenSections: z.ZodDefault<z.ZodArray<z.ZodString>>;
        pinnedSections: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>>;
    advancedUnits: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        weight: z.ZodEnum<{
            kg: "kg";
            lbs: "lbs";
        }>;
        height: z.ZodEnum<{
            cm: "cm";
            ft_in: "ft_in";
        }>;
        foodWeight: z.ZodEnum<{
            lbs: "lbs";
            g: "g";
            oz: "oz";
        }>;
        foodVolume: z.ZodEnum<{
            ml: "ml";
            fl_oz: "fl_oz";
            cups: "cups";
            tbsp: "tbsp";
            tsp: "tsp";
        }>;
        calories: z.ZodEnum<{
            kcal: "kcal";
            kj: "kj";
        }>;
        exerciseWeight: z.ZodEnum<{
            kg: "kg";
            lbs: "lbs";
        }>;
        distance: z.ZodEnum<{
            km: "km";
            mi: "mi";
            m: "m";
            ft: "ft";
        }>;
        speed: z.ZodEnum<{
            km_h: "km_h";
            mph: "mph";
            m_s: "m_s";
        }>;
        altitude: z.ZodEnum<{
            m: "m";
            ft: "ft";
        }>;
        temperature: z.ZodEnum<{
            celsius: "celsius";
            fahrenheit: "fahrenheit";
        }>;
        water: z.ZodEnum<{
            ml: "ml";
            fl_oz: "fl_oz";
            cups: "cups";
            l: "l";
        }>;
    }, z.core.$strip>>>;
    notifications: z.ZodDefault<z.ZodNullable<z.ZodObject<{
        morningBriefing: z.ZodObject<{
            enabled: z.ZodBoolean;
            time: z.ZodString;
            autoLearn: z.ZodOptional<z.ZodBoolean>;
            customMessage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        eveningCheckIn: z.ZodObject<{
            enabled: z.ZodBoolean;
            time: z.ZodString;
            autoLearn: z.ZodOptional<z.ZodBoolean>;
            customMessage: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        weeklyInsights: z.ZodObject<{
            enabled: z.ZodBoolean;
            time: z.ZodString;
            day: z.ZodEnum<{
                monday: "monday";
                tuesday: "tuesday";
                wednesday: "wednesday";
                thursday: "thursday";
                friday: "friday";
                saturday: "saturday";
                sunday: "sunday";
            }>;
        }, z.core.$strip>;
        coPilotCheckIns: z.ZodObject<{
            enabled: z.ZodBoolean;
            time: z.ZodString;
            frequency: z.ZodEnum<{
                custom: "custom";
                daily: "daily";
                weekly: "weekly";
                biweekly: "biweekly";
                monthly: "monthly";
            }>;
            intelligentMode: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        trainingGuidance: z.ZodObject<{
            enabled: z.ZodBoolean;
            time: z.ZodString;
            frequency: z.ZodEnum<{
                custom: "custom";
                daily: "daily";
                weekly: "weekly";
                biweekly: "biweekly";
                monthly: "monthly";
            }>;
            intelligentMode: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        nutritionCoaching: z.ZodObject<{
            enabled: z.ZodBoolean;
            breakfastTime: z.ZodString;
            lunchTime: z.ZodString;
            dinnerTime: z.ZodString;
        }, z.core.$strip>;
        adminPortal: z.ZodObject<{
            appointmentBookedByOthers: z.ZodBoolean;
            appointmentCancelledByOthers: z.ZodBoolean;
            appointmentModifiedByOthers: z.ZodBoolean;
            patientAssignedToMe: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>>>;
    units: z.ZodOptional<z.ZodEnum<{
        metric: "metric";
        imperial: "imperial";
        advanced: "advanced";
    }>>;
    dashboardCardOrder: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    dashboardSections: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        order: z.ZodArray<z.ZodString>;
        visibility: z.ZodRecord<z.ZodString, z.ZodBoolean>;
    }, z.core.$strip>>>;
    hiddenDashboardCards: z.ZodOptional<z.ZodArray<z.ZodString>>;
    eveningReminderEnabled: z.ZodOptional<z.ZodBoolean>;
    eveningReminderTime: z.ZodOptional<z.ZodString>;
    customReminderMessage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type UserPreferencesContract = z.infer<typeof UserPreferencesSchema>;
export declare const UserAccountSchema: z.ZodObject<{
    profile: z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        email: z.ZodString;
        fullName: z.ZodString;
        preferredName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        role: z.ZodOptional<z.ZodEnum<{
            ADMIN: "ADMIN";
            CLINICIAN: "CLINICIAN";
            TRAINER: "TRAINER";
            CLIENT: "CLIENT";
        }>>;
        tier: z.ZodOptional<z.ZodEnum<{
            ESSENTIALS: "ESSENTIALS";
            CORE: "CORE";
            CONCIERGE: "CONCIERGE";
        }>>;
        avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        occupation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        primaryGoal: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            other: "other";
            lose_weight: "lose_weight";
            gain_muscle: "gain_muscle";
            maintain: "maintain";
            improve_health: "improve_health";
        }>>>;
        primaryGoalNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        activityLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            sedentary: "sedentary";
            lightly_active: "lightly_active";
            moderately_active: "moderately_active";
            very_active: "very_active";
            athlete: "athlete";
        }>>>;
        experienceLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            advanced: "advanced";
            beginner: "beginner";
            intermediate: "intermediate";
            expert: "expert";
        }>>>;
        dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        biologicalSex: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            female: "female";
            male: "male";
            non_binary: "non_binary";
            intersex: "intersex";
            prefer_not_to_say: "prefer_not_to_say";
        }>>>;
        pregnancyStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            not_pregnant: "not_pregnant";
            trimester_1: "trimester_1";
            trimester_2: "trimester_2";
            trimester_3: "trimester_3";
            postpartum: "postpartum";
        }>>>;
        pregnancyDueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        calculatedPregnancyStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            not_pregnant: "not_pregnant";
            trimester_1: "trimester_1";
            trimester_2: "trimester_2";
            trimester_3: "trimester_3";
            postpartum: "postpartum";
        }>>>;
        heightCm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        weightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        initialWeightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        timezone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fitness: z.ZodOptional<z.ZodObject<{
            defaultWeightUnit: z.ZodOptional<z.ZodEnum<{
                kg: "kg";
                lbs: "lbs";
            }>>;
            defaultWeightMode: z.ZodOptional<z.ZodEnum<{
                absolute: "absolute";
                relative: "relative";
            }>>;
            defaultDistanceUnit: z.ZodOptional<z.ZodEnum<{
                km: "km";
                mi: "mi";
            }>>;
            progressionIncrementKg: z.ZodOptional<z.ZodNumber>;
            repIncrement: z.ZodOptional<z.ZodNumber>;
            goEasierPercent: z.ZodOptional<z.ZodNumber>;
            defaultRestTimerSec: z.ZodOptional<z.ZodNumber>;
            trainingPhase: z.ZodOptional<z.ZodEnum<{
                maintain: "maintain";
                build: "build";
                cut: "cut";
            }>>;
            adaptiveProgression: z.ZodOptional<z.ZodBoolean>;
            cardioProgressionFocus: z.ZodOptional<z.ZodEnum<{
                distance: "distance";
                duration: "duration";
                pace: "pace";
            }>>;
            cardioGoalPreset: z.ZodOptional<z.ZodEnum<{
                none: "none";
                general: "general";
                endurance: "endurance";
                weight_loss: "weight_loss";
                threshold: "threshold";
            }>>;
            appleHealthConnected: z.ZodOptional<z.ZodBoolean>;
            maxHRBpm: z.ZodOptional<z.ZodNumber>;
            hapticIntensity: z.ZodOptional<z.ZodEnum<{
                light: "light";
                medium: "medium";
                heavy: "heavy";
                off: "off";
            }>>;
            defaultRIR: z.ZodOptional<z.ZodNumber>;
        }, z.core.$loose>>;
        assignedClinicianId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        assignedTrainerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        medications: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            dosage: z.ZodString;
            frequency: z.ZodString;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>>;
        limitations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            severity: z.ZodOptional<z.ZodEnum<{
                moderate: "moderate";
                mild: "mild";
                severe: "severe";
            }>>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>>;
        injuries: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            description: z.ZodString;
            bodyPart: z.ZodOptional<z.ZodString>;
            occurredAt: z.ZodOptional<z.ZodString>;
            severity: z.ZodOptional<z.ZodEnum<{
                moderate: "moderate";
                mild: "mild";
                severe: "severe";
            }>>;
            recoveryStatus: z.ZodOptional<z.ZodEnum<{
                active: "active";
                recovering: "recovering";
                healed: "healed";
                chronic: "chronic";
            }>>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>>;
        medicalConditions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            status: z.ZodEnum<{
                active: "active";
                managed: "managed";
                resolved: "resolved";
                monitoring: "monitoring";
            }>;
            diagnosisDate: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>>;
        onboardingCompleted: z.ZodBoolean;
        isActive: z.ZodOptional<z.ZodBoolean>;
        accountSuspended: z.ZodOptional<z.ZodBoolean>;
        recordRetentionDate: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
        deletionRequestedAt: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
        deletionReason: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        stateOfResidence: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>;
    preferences: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        userId: z.ZodString;
        unitSystem: z.ZodEnum<{
            metric: "metric";
            imperial: "imperial";
            advanced: "advanced";
        }>;
        timeFormat: z.ZodEnum<{
            standard: "standard";
            military: "military";
        }>;
        locale: z.ZodString;
        dashboard: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            sectionOrder: z.ZodDefault<z.ZodArray<z.ZodString>>;
            hiddenSections: z.ZodDefault<z.ZodArray<z.ZodString>>;
            pinnedSections: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>>;
        advancedUnits: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            weight: z.ZodEnum<{
                kg: "kg";
                lbs: "lbs";
            }>;
            height: z.ZodEnum<{
                cm: "cm";
                ft_in: "ft_in";
            }>;
            foodWeight: z.ZodEnum<{
                lbs: "lbs";
                g: "g";
                oz: "oz";
            }>;
            foodVolume: z.ZodEnum<{
                ml: "ml";
                fl_oz: "fl_oz";
                cups: "cups";
                tbsp: "tbsp";
                tsp: "tsp";
            }>;
            calories: z.ZodEnum<{
                kcal: "kcal";
                kj: "kj";
            }>;
            exerciseWeight: z.ZodEnum<{
                kg: "kg";
                lbs: "lbs";
            }>;
            distance: z.ZodEnum<{
                km: "km";
                mi: "mi";
                m: "m";
                ft: "ft";
            }>;
            speed: z.ZodEnum<{
                km_h: "km_h";
                mph: "mph";
                m_s: "m_s";
            }>;
            altitude: z.ZodEnum<{
                m: "m";
                ft: "ft";
            }>;
            temperature: z.ZodEnum<{
                celsius: "celsius";
                fahrenheit: "fahrenheit";
            }>;
            water: z.ZodEnum<{
                ml: "ml";
                fl_oz: "fl_oz";
                cups: "cups";
                l: "l";
            }>;
        }, z.core.$strip>>>;
        notifications: z.ZodDefault<z.ZodNullable<z.ZodObject<{
            morningBriefing: z.ZodObject<{
                enabled: z.ZodBoolean;
                time: z.ZodString;
                autoLearn: z.ZodOptional<z.ZodBoolean>;
                customMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            eveningCheckIn: z.ZodObject<{
                enabled: z.ZodBoolean;
                time: z.ZodString;
                autoLearn: z.ZodOptional<z.ZodBoolean>;
                customMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            weeklyInsights: z.ZodObject<{
                enabled: z.ZodBoolean;
                time: z.ZodString;
                day: z.ZodEnum<{
                    monday: "monday";
                    tuesday: "tuesday";
                    wednesday: "wednesday";
                    thursday: "thursday";
                    friday: "friday";
                    saturday: "saturday";
                    sunday: "sunday";
                }>;
            }, z.core.$strip>;
            coPilotCheckIns: z.ZodObject<{
                enabled: z.ZodBoolean;
                time: z.ZodString;
                frequency: z.ZodEnum<{
                    custom: "custom";
                    daily: "daily";
                    weekly: "weekly";
                    biweekly: "biweekly";
                    monthly: "monthly";
                }>;
                intelligentMode: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>;
            trainingGuidance: z.ZodObject<{
                enabled: z.ZodBoolean;
                time: z.ZodString;
                frequency: z.ZodEnum<{
                    custom: "custom";
                    daily: "daily";
                    weekly: "weekly";
                    biweekly: "biweekly";
                    monthly: "monthly";
                }>;
                intelligentMode: z.ZodOptional<z.ZodBoolean>;
            }, z.core.$strip>;
            nutritionCoaching: z.ZodObject<{
                enabled: z.ZodBoolean;
                breakfastTime: z.ZodString;
                lunchTime: z.ZodString;
                dinnerTime: z.ZodString;
            }, z.core.$strip>;
            adminPortal: z.ZodObject<{
                appointmentBookedByOthers: z.ZodBoolean;
                appointmentCancelledByOthers: z.ZodBoolean;
                appointmentModifiedByOthers: z.ZodBoolean;
                patientAssignedToMe: z.ZodBoolean;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        units: z.ZodOptional<z.ZodEnum<{
            metric: "metric";
            imperial: "imperial";
            advanced: "advanced";
        }>>;
        dashboardCardOrder: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        dashboardSections: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            order: z.ZodArray<z.ZodString>;
            visibility: z.ZodRecord<z.ZodString, z.ZodBoolean>;
        }, z.core.$strip>>>;
        hiddenDashboardCards: z.ZodOptional<z.ZodArray<z.ZodString>>;
        eveningReminderEnabled: z.ZodOptional<z.ZodBoolean>;
        eveningReminderTime: z.ZodOptional<z.ZodString>;
        customReminderMessage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    goals: z.ZodOptional<z.ZodObject<{
        userId: z.ZodString;
        calorieTarget: z.ZodNumber;
        proteinTarget: z.ZodNumber;
        carbTarget: z.ZodNumber;
        fatTarget: z.ZodNumber;
        weeklyWeightChangeTarget: z.ZodNumber;
        workoutsPerWeek: z.ZodNumber;
        sleepHoursTarget: z.ZodOptional<z.ZodNumber>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>;
    metrics: z.ZodOptional<z.ZodObject<{
        tdee: z.ZodNumber;
        bmr: z.ZodNumber;
        recoveryScore: z.ZodNumber;
        trainingLoad: z.ZodOptional<z.ZodNumber>;
        currentWeight: z.ZodOptional<z.ZodNumber>;
        weeklyWeightChange: z.ZodOptional<z.ZodNumber>;
        monthlyWeightChange: z.ZodOptional<z.ZodNumber>;
        currentBodyFat: z.ZodOptional<z.ZodNumber>;
        currentMuscleMass: z.ZodOptional<z.ZodNumber>;
        sleepPerformance: z.ZodNumber;
        averageSleepDuration: z.ZodOptional<z.ZodNumber>;
        averageSleepQuality: z.ZodOptional<z.ZodNumber>;
        averageHRV: z.ZodOptional<z.ZodNumber>;
        averageRestingHR: z.ZodOptional<z.ZodNumber>;
        stressScore: z.ZodOptional<z.ZodNumber>;
        todaysStrain: z.ZodNumber;
        weeklyStrain: z.ZodOptional<z.ZodNumber>;
        monthlyStrain: z.ZodOptional<z.ZodNumber>;
        stepCount: z.ZodOptional<z.ZodNumber>;
        activeMinutes: z.ZodOptional<z.ZodNumber>;
        loggedCalories: z.ZodNumber;
        weeklyCalorieAverage: z.ZodOptional<z.ZodNumber>;
        macroAdherence: z.ZodOptional<z.ZodNumber>;
        workoutStreak: z.ZodOptional<z.ZodNumber>;
        loggingStreak: z.ZodOptional<z.ZodNumber>;
        adherenceScore: z.ZodOptional<z.ZodNumber>;
        lastUpdated: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type UserAccountContract = z.infer<typeof UserAccountSchema>;
/**
 * Zod schema for the admin portal profile-settings form.
 * Validates the two editable fields before calling the profile service.
 */
export declare const adminProfileFormSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export type AdminProfileFormInput = z.infer<typeof adminProfileFormSchema>;
/**
 * Input schema for a patient-initiated account deletion request.
 *
 * Satisfies GDPR Art. 17 (right to erasure) and CCPA § 1798.105.
 * The `reason` field is optional — patients are not required to justify their
 * erasure request under either regulation.
 *
 * Consumed by: POST /api/account/deletion-request (mobile, web-public)
 */
export declare const DeletionRequestInputSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DeletionRequestInput = z.infer<typeof DeletionRequestInputSchema>;
export declare const buildVisibilityMap: (order: string[], hidden: string[], existing?: Record<string, boolean>) => Record<string, boolean>;
//# sourceMappingURL=user.d.ts.map