/**
 * @ai-context User Domain Contracts Tests | validates all user domain contracts
 *
 * This test suite verifies:
 * 1. USER_TIERS tuple contains all tier names
 * 2. USER_TIER_PRICES_DOLLARS has correct prices per tier
 * 3. User-related Zod schemas validate correctly
 * 4. UserRole related types/tuples are correct
 * 5. Role helper functions work correctly
 * 6. Account status, biological sex, activity levels, etc. are complete
 * 7. Edge cases: empty strings, missing fields, null/undefined
 *
 * Run: npx jest shared/contracts/__tests__/domain-user.test.ts
 */

import { TIER_MONTHLY_PRICE, TIER_MONTHLY_PRICE_DOLLARS } from "../constants";
import {
    ACCOUNT_STATUS,
    // Account Status
    ACCOUNT_STATUSES,
    ACCOUNT_STATUS_LABELS,
    ACTIVITY_LEVEL,
    // Activity Levels
    ACTIVITY_LEVELS,
    ACTIVITY_LEVEL_LABELS,
    ADMIN_ROLES,
    AccountStatusSchema,
    ActivityLevelSchema,
    BIOLOGICAL_SEX,
    // Biological Sex
    BIOLOGICAL_SEXES,
    BIOLOGICAL_SEX_LABELS,
    BiologicalSexSchema,
    CLINICAL_ROLES,
    DEFAULT_USER_ROLE,
    DEFAULT_USER_TIER,
    FITNESS_EXPERIENCE,
    // Fitness Experience
    FITNESS_EXPERIENCES,
    FITNESS_EXPERIENCE_LABELS,
    FitnessExperienceSchema,
    MESSAGE_RECIPIENT_ROLE,
    // Message Recipient Roles
    MESSAGE_RECIPIENT_ROLES,
    MESSAGE_RECIPIENT_ROLE_LABELS,
    MessagingRecipientRoleSchema,
    // Notification Frequencies
    NOTIFICATION_FREQUENCIES,
    NOTIFICATION_FREQUENCY,
    NOTIFICATION_FREQUENCY_LABELS,
    NotificationFrequencySchema,
    PREGNANCY_STATUS,
    // Pregnancy Status
    PREGNANCY_STATUSES,
    PREGNANCY_STATUS_LABELS,
    PREMIUM_TIERS,
    PRIMARY_GOAL,
    // Primary Goals
    PRIMARY_GOALS,
    PRIMARY_GOAL_LABELS,
    PregnancyStatusSchema,
    PrimaryGoalSchema,
    // Role Badges
    ROLE_BADGE_CONFIG,
    TRAINING_ROLES,
    USER_ROLE,
    // User Roles
    USER_ROLES,
    USER_ROLE_LABELS,
    USER_TIER,
    // Membership Tiers
    USER_TIERS,
    USER_TIER_LABELS,
    USER_TIER_PRICES,
    USER_TIER_PRICES_DOLLARS,
    UserAccountSchema,
    UserGoalsSchema,
    UserMetricsSchema,
    UserPreferencesSchema,
    // User Profile Schema
    UserProfileSchema,
    UserRoleSchema,
    UserTierSchema,
    WEEKDAY,
    // Weekdays
    WEEKDAYS,
    WEEKDAY_LABELS,
    WeekdaySchema,
    calculateTrimesterFromDueDate,
    canManageRegistrations,
    canManageStaff,
    canViewCareTeamNotes,
    // Permission Helpers
    canViewFinancials,
    canViewLabResults,
    createMockUserAccount,
    // Mock Factory
    createMockUserProfile,
    deriveAccountStatus,
    getRoleBadge,
    isActiveAccountStatus,
    isAdminRole,
    isClinicalRole,
    isPremiumTier,
    isSiteAdminRole,
    isTrainerRole,
    mapAccountStatusToFlags,
    normalizeAccountStatusFlags,
    normalizeNotificationPreferences,
    notificationPreferencesUpdateSchema,
} from "../domain/user";

// ============================================================================
// HELPERS
// ============================================================================

const NOW_ISO = new Date().toISOString();

// ============================================================================
// USER ROLES TESTS
// ============================================================================

describe("User Domain Contracts", () => {
  describe("UserRole", () => {
    describe("tuple values", () => {
      it("should contain exactly 4 roles", () => {
        expect(USER_ROLES).toHaveLength(4);
      });

      it("should contain all expected roles", () => {
        expect(USER_ROLES).toContain("ADMIN");
        expect(USER_ROLES).toContain("CLINICIAN");
        expect(USER_ROLES).toContain("TRAINER");
        expect(USER_ROLES).toContain("CLIENT");
      });
    });

    describe("schema validation", () => {
      it.each(USER_ROLES)("should accept valid role: %s", (value) => {
        const result = UserRoleSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it("should reject invalid values", () => {
        expect(UserRoleSchema.safeParse("INVALID").success).toBe(false);
        expect(UserRoleSchema.safeParse("admin").success).toBe(false); // lowercase
        expect(UserRoleSchema.safeParse("").success).toBe(false);
        expect(UserRoleSchema.safeParse(123).success).toBe(false);
        expect(UserRoleSchema.safeParse(null).success).toBe(false);
        expect(UserRoleSchema.safeParse(undefined).success).toBe(false);
      });
    });

    describe("constants object", () => {
      it("should have keys that map to tuple values", () => {
        expect(USER_ROLE.ADMIN).toBe("ADMIN");
        expect(USER_ROLE.CLINICIAN).toBe("CLINICIAN");
        expect(USER_ROLE.TRAINER).toBe("TRAINER");
        expect(USER_ROLE.CLIENT).toBe("CLIENT");
      });

      it("should have all values present in tuple", () => {
        const constantValues = Object.values(USER_ROLE);
        expect(constantValues).toHaveLength(4);
        for (const value of constantValues) {
          expect(USER_ROLES).toContain(value);
        }
      });
    });

    describe("labels map", () => {
      it("should have a label for every role", () => {
        for (const value of USER_ROLES) {
          expect(USER_ROLE_LABELS[value]).toBeDefined();
          expect(typeof USER_ROLE_LABELS[value]).toBe("string");
          expect(USER_ROLE_LABELS[value].length).toBeGreaterThan(0);
        }
      });

      it("should have correct labels", () => {
        expect(USER_ROLE_LABELS.ADMIN).toBe("Admin");
        expect(USER_ROLE_LABELS.CLINICIAN).toBe("Clinician");
        expect(USER_ROLE_LABELS.TRAINER).toBe("Performance Coach");
        expect(USER_ROLE_LABELS.CLIENT).toBe("Client");
      });
    });

    describe("DEFAULT_USER_ROLE", () => {
      it("should be CLIENT", () => {
        expect(DEFAULT_USER_ROLE).toBe("CLIENT");
      });
    });

    describe("ADMIN_ROLES", () => {
      it("should contain ADMIN, CLINICIAN, and TRAINER", () => {
        expect(ADMIN_ROLES).toContain("ADMIN");
        expect(ADMIN_ROLES).toContain("CLINICIAN");
        expect(ADMIN_ROLES).toContain("TRAINER");
      });

      it("should NOT contain CLIENT", () => {
        expect(ADMIN_ROLES).not.toContain("CLIENT");
      });
    });

    describe("CLINICAL_ROLES", () => {
      it("should contain ADMIN and CLINICIAN", () => {
        expect(CLINICAL_ROLES).toContain("ADMIN");
        expect(CLINICAL_ROLES).toContain("CLINICIAN");
      });

      it("should NOT contain TRAINER or CLIENT", () => {
        expect(CLINICAL_ROLES).not.toContain("TRAINER");
        expect(CLINICAL_ROLES).not.toContain("CLIENT");
      });
    });

    describe("TRAINING_ROLES", () => {
      it("should contain ADMIN and TRAINER", () => {
        expect(TRAINING_ROLES).toContain("ADMIN");
        expect(TRAINING_ROLES).toContain("TRAINER");
      });

      it("should NOT contain CLINICIAN or CLIENT", () => {
        expect(TRAINING_ROLES).not.toContain("CLINICIAN");
        expect(TRAINING_ROLES).not.toContain("CLIENT");
      });
    });
  });

  // ============================================================================
  // ROLE HELPER FUNCTIONS
  // ============================================================================

  describe("Role helper functions", () => {
    describe("isAdminRole", () => {
      it("should return true for ADMIN, CLINICIAN, TRAINER", () => {
        expect(isAdminRole("ADMIN")).toBe(true);
        expect(isAdminRole("CLINICIAN")).toBe(true);
        expect(isAdminRole("TRAINER")).toBe(true);
      });

      it("should return false for CLIENT", () => {
        expect(isAdminRole("CLIENT")).toBe(false);
      });

      it("should return false for null/undefined/empty", () => {
        expect(isAdminRole(null)).toBe(false);
        expect(isAdminRole(undefined)).toBe(false);
        expect(isAdminRole("")).toBe(false);
      });
    });

    describe("isSiteAdminRole", () => {
      it("should return true only for ADMIN", () => {
        expect(isSiteAdminRole("ADMIN")).toBe(true);
      });

      it("should return false for CLINICIAN, TRAINER, CLIENT", () => {
        expect(isSiteAdminRole("CLINICIAN")).toBe(false);
        expect(isSiteAdminRole("TRAINER")).toBe(false);
        expect(isSiteAdminRole("CLIENT")).toBe(false);
      });

      it("should return false for null/undefined", () => {
        expect(isSiteAdminRole(null)).toBe(false);
        expect(isSiteAdminRole(undefined)).toBe(false);
      });
    });

    describe("isClinicalRole", () => {
      it("should return true for ADMIN and CLINICIAN", () => {
        expect(isClinicalRole("ADMIN")).toBe(true);
        expect(isClinicalRole("CLINICIAN")).toBe(true);
      });

      it("should return false for TRAINER and CLIENT", () => {
        expect(isClinicalRole("TRAINER")).toBe(false);
        expect(isClinicalRole("CLIENT")).toBe(false);
      });
    });

    describe("isTrainerRole", () => {
      it("should return true for ADMIN and TRAINER", () => {
        expect(isTrainerRole("ADMIN")).toBe(true);
        expect(isTrainerRole("TRAINER")).toBe(true);
      });

      it("should return false for CLINICIAN and CLIENT", () => {
        expect(isTrainerRole("CLINICIAN")).toBe(false);
        expect(isTrainerRole("CLIENT")).toBe(false);
      });
    });
  });

  // ============================================================================
  // PERMISSION HELPERS
  // ============================================================================

  describe("Permission helpers", () => {
    describe("canViewFinancials", () => {
      it("should return true only for ADMIN", () => {
        expect(canViewFinancials("ADMIN")).toBe(true);
        expect(canViewFinancials("CLINICIAN")).toBe(false);
        expect(canViewFinancials("TRAINER")).toBe(false);
        expect(canViewFinancials("CLIENT")).toBe(false);
        expect(canViewFinancials(null)).toBe(false);
      });
    });

    describe("canManageStaff", () => {
      it("should return true only for ADMIN", () => {
        expect(canManageStaff("ADMIN")).toBe(true);
        expect(canManageStaff("CLINICIAN")).toBe(false);
        expect(canManageStaff("TRAINER")).toBe(false);
      });
    });

    describe("canViewCareTeamNotes", () => {
      it("should return true for ADMIN and CLINICIAN", () => {
        expect(canViewCareTeamNotes("ADMIN")).toBe(true);
        expect(canViewCareTeamNotes("CLINICIAN")).toBe(true);
      });

      it("should return false for TRAINER and CLIENT", () => {
        expect(canViewCareTeamNotes("TRAINER")).toBe(false);
        expect(canViewCareTeamNotes("CLIENT")).toBe(false);
      });
    });

    describe("canViewLabResults", () => {
      it("should return true for ADMIN and CLINICIAN", () => {
        expect(canViewLabResults("ADMIN")).toBe(true);
        expect(canViewLabResults("CLINICIAN")).toBe(true);
      });

      it("should return false for TRAINER and CLIENT", () => {
        expect(canViewLabResults("TRAINER")).toBe(false);
        expect(canViewLabResults("CLIENT")).toBe(false);
      });
    });

    describe("canManageRegistrations", () => {
      it("should return true only for ADMIN", () => {
        expect(canManageRegistrations("ADMIN")).toBe(true);
        expect(canManageRegistrations("CLINICIAN")).toBe(false);
        expect(canManageRegistrations("TRAINER")).toBe(false);
        expect(canManageRegistrations("CLIENT")).toBe(false);
      });
    });
  });

  // ============================================================================
  // ROLE BADGE TESTS
  // ============================================================================

  describe("Role Badges", () => {
    describe("ROLE_BADGE_CONFIG", () => {
      it("should have a badge for every role", () => {
        for (const role of USER_ROLES) {
          expect(ROLE_BADGE_CONFIG[role]).toBeDefined();
          expect(ROLE_BADGE_CONFIG[role].label).toBeDefined();
          expect(ROLE_BADGE_CONFIG[role].color).toBeDefined();
          expect(ROLE_BADGE_CONFIG[role].bg).toBeDefined();
        }
      });
    });

    describe("getRoleBadge", () => {
      it("should return badge for valid roles", () => {
        for (const role of USER_ROLES) {
          const badge = getRoleBadge(role);
          expect(badge).not.toBeNull();
          expect(badge!.label).toBeDefined();
        }
      });

      it("should return null for null/undefined", () => {
        expect(getRoleBadge(null)).toBeNull();
        expect(getRoleBadge(undefined)).toBeNull();
      });

      it("should return default badge for unknown role", () => {
        const badge = getRoleBadge("UNKNOWN_ROLE");
        expect(badge).not.toBeNull();
        expect(badge!.label).toBe("UNKNOWN_ROLE");
      });
    });
  });

  // ============================================================================
  // MEMBERSHIP TIERS TESTS
  // ============================================================================

  describe("UserTier", () => {
    describe("tuple values", () => {
      it("should contain exactly 3 tiers", () => {
        expect(USER_TIERS).toHaveLength(3);
      });

      it("should contain all expected tiers", () => {
        expect(USER_TIERS).toContain("ESSENTIALS");
        expect(USER_TIERS).toContain("CORE");
        expect(USER_TIERS).toContain("CONCIERGE");
      });
    });

    describe("schema validation", () => {
      it.each(USER_TIERS)("should accept valid tier: %s", (value) => {
        const result = UserTierSchema.safeParse(value);
        expect(result.success).toBe(true);
      });

      it("should reject invalid values", () => {
        expect(UserTierSchema.safeParse("PLATINUM").success).toBe(false);
        expect(UserTierSchema.safeParse("essentials").success).toBe(false); // lowercase
        expect(UserTierSchema.safeParse("").success).toBe(false);
        expect(UserTierSchema.safeParse(null).success).toBe(false);
      });
    });

    describe("constants object", () => {
      it("should have keys that map to tuple values", () => {
        expect(USER_TIER.ESSENTIALS).toBe("ESSENTIALS");
        expect(USER_TIER.CORE).toBe("CORE");
        expect(USER_TIER.CONCIERGE).toBe("CONCIERGE");
      });

      it("should have all values present in tuple", () => {
        const constantValues = Object.values(USER_TIER);
        expect(constantValues).toHaveLength(3);
        for (const value of constantValues) {
          expect(USER_TIERS).toContain(value);
        }
      });
    });

    describe("labels map", () => {
      it("should have a label for every tier", () => {
        for (const value of USER_TIERS) {
          expect(USER_TIER_LABELS[value]).toBeDefined();
          expect(typeof USER_TIER_LABELS[value]).toBe("string");
        }
      });

      it("should have correct labels", () => {
        expect(USER_TIER_LABELS.ESSENTIALS).toBe("Essentials");
        expect(USER_TIER_LABELS.CORE).toBe("Core");
        expect(USER_TIER_LABELS.CONCIERGE).toBe("Concierge");
      });
    });

    describe("DEFAULT_USER_TIER", () => {
      it("should be ESSENTIALS", () => {
        expect(DEFAULT_USER_TIER).toBe("ESSENTIALS");
      });
    });

    describe("USER_TIER_PRICES_DOLLARS", () => {
      it("should have prices for all tiers", () => {
        for (const tier of USER_TIERS) {
          expect(USER_TIER_PRICES_DOLLARS[tier]).toBeDefined();
          expect(typeof USER_TIER_PRICES_DOLLARS[tier]).toBe("number");
          expect(USER_TIER_PRICES_DOLLARS[tier]).toBeGreaterThan(0);
        }
      });

      it("should have correct prices", () => {
        expect(USER_TIER_PRICES_DOLLARS.ESSENTIALS).toBe(799);
        expect(USER_TIER_PRICES_DOLLARS.CORE).toBe(1599);
        expect(USER_TIER_PRICES_DOLLARS.CONCIERGE).toBe(2499);
      });

      it("prices should increase with tier level", () => {
        expect(USER_TIER_PRICES_DOLLARS.ESSENTIALS).toBeLessThan(
          USER_TIER_PRICES_DOLLARS.CORE,
        );
        expect(USER_TIER_PRICES_DOLLARS.CORE).toBeLessThan(
          USER_TIER_PRICES_DOLLARS.CONCIERGE,
        );
      });
    });

    describe("USER_TIER_PRICES (deprecated alias)", () => {
      it("should be the same object as USER_TIER_PRICES_DOLLARS", () => {
        expect(USER_TIER_PRICES).toBe(USER_TIER_PRICES_DOLLARS);
      });
    });

    describe("shared constants aliases", () => {
      it("should expose an explicit dollar-denominated alias", () => {
        expect(TIER_MONTHLY_PRICE_DOLLARS).toBe(USER_TIER_PRICES_DOLLARS);
      });

      it("should keep the deprecated tier monthly price alias aligned in dollars", () => {
        expect(TIER_MONTHLY_PRICE).toBe(USER_TIER_PRICES_DOLLARS);
        expect(TIER_MONTHLY_PRICE.CORE).toBe(1599);
      });
    });

    describe("PREMIUM_TIERS", () => {
      it("should contain CORE and CONCIERGE", () => {
        expect(PREMIUM_TIERS).toContain("CORE");
        expect(PREMIUM_TIERS).toContain("CONCIERGE");
      });

      it("should NOT contain ESSENTIALS", () => {
        expect(PREMIUM_TIERS).not.toContain("ESSENTIALS");
      });
    });

    describe("isPremiumTier", () => {
      it("should return true for CORE and CONCIERGE", () => {
        expect(isPremiumTier("CORE")).toBe(true);
        expect(isPremiumTier("CONCIERGE")).toBe(true);
      });

      it("should return false for ESSENTIALS", () => {
        expect(isPremiumTier("ESSENTIALS")).toBe(false);
      });

      it("should return false for null/undefined", () => {
        expect(isPremiumTier(null)).toBe(false);
        expect(isPremiumTier(undefined)).toBe(false);
      });
    });
  });

  // ============================================================================
  // BIOLOGICAL SEX TESTS
  // ============================================================================

  describe("BiologicalSex", () => {
    describe("tuple values", () => {
      it("should contain exactly 5 values", () => {
        expect(BIOLOGICAL_SEXES).toHaveLength(5);
      });

      it("should contain all expected values", () => {
        expect(BIOLOGICAL_SEXES).toContain("female");
        expect(BIOLOGICAL_SEXES).toContain("male");
        expect(BIOLOGICAL_SEXES).toContain("non_binary");
        expect(BIOLOGICAL_SEXES).toContain("intersex");
        expect(BIOLOGICAL_SEXES).toContain("prefer_not_to_say");
      });
    });

    describe("schema validation", () => {
      it.each(BIOLOGICAL_SEXES)("should accept valid value: %s", (value) => {
        expect(BiologicalSexSchema.safeParse(value).success).toBe(true);
      });

      it("should reject invalid values", () => {
        expect(BiologicalSexSchema.safeParse("Male").success).toBe(false); // PascalCase
        expect(BiologicalSexSchema.safeParse("FEMALE").success).toBe(false); // uppercase
        expect(BiologicalSexSchema.safeParse("other").success).toBe(false);
        expect(BiologicalSexSchema.safeParse(null).success).toBe(false);
      });
    });

    describe("constants and labels", () => {
      it("should have correct constant mappings", () => {
        expect(BIOLOGICAL_SEX.FEMALE).toBe("female");
        expect(BIOLOGICAL_SEX.MALE).toBe("male");
        expect(BIOLOGICAL_SEX.NON_BINARY).toBe("non_binary");
        expect(BIOLOGICAL_SEX.INTERSEX).toBe("intersex");
        expect(BIOLOGICAL_SEX.PREFER_NOT_TO_SAY).toBe("prefer_not_to_say");
      });

      it("should have a label for every value", () => {
        for (const value of BIOLOGICAL_SEXES) {
          expect(BIOLOGICAL_SEX_LABELS[value]).toBeDefined();
          expect(typeof BIOLOGICAL_SEX_LABELS[value]).toBe("string");
        }
      });
    });
  });

  // ============================================================================
  // ACTIVITY LEVEL TESTS
  // ============================================================================

  describe("ActivityLevel", () => {
    describe("tuple values", () => {
      it("should contain exactly 5 values", () => {
        expect(ACTIVITY_LEVELS).toHaveLength(5);
      });

      it("should contain all expected values", () => {
        expect(ACTIVITY_LEVELS).toContain("sedentary");
        expect(ACTIVITY_LEVELS).toContain("lightly_active");
        expect(ACTIVITY_LEVELS).toContain("moderately_active");
        expect(ACTIVITY_LEVELS).toContain("very_active");
        expect(ACTIVITY_LEVELS).toContain("athlete");
      });
    });

    describe("schema validation", () => {
      it.each(ACTIVITY_LEVELS)("should accept valid value: %s", (value) => {
        expect(ActivityLevelSchema.safeParse(value).success).toBe(true);
      });

      it("should reject invalid values", () => {
        expect(ActivityLevelSchema.safeParse("active").success).toBe(false);
        expect(ActivityLevelSchema.safeParse("SEDENTARY").success).toBe(false);
        expect(ActivityLevelSchema.safeParse(null).success).toBe(false);
      });
    });

    describe("constants and labels", () => {
      it("should have correct constant mappings", () => {
        expect(ACTIVITY_LEVEL.SEDENTARY).toBe("sedentary");
        expect(ACTIVITY_LEVEL.LIGHTLY_ACTIVE).toBe("lightly_active");
        expect(ACTIVITY_LEVEL.MODERATELY_ACTIVE).toBe("moderately_active");
        expect(ACTIVITY_LEVEL.VERY_ACTIVE).toBe("very_active");
        expect(ACTIVITY_LEVEL.ATHLETE).toBe("athlete");
      });

      it("should have a label for every value", () => {
        for (const value of ACTIVITY_LEVELS) {
          expect(ACTIVITY_LEVEL_LABELS[value]).toBeDefined();
          expect(typeof ACTIVITY_LEVEL_LABELS[value]).toBe("string");
        }
      });
    });
  });

  // ============================================================================
  // PRIMARY GOAL TESTS
  // ============================================================================

  describe("PrimaryGoal", () => {
    it("should contain exactly 4 values", () => {
      expect(PRIMARY_GOALS).toHaveLength(4);
    });

    it.each(PRIMARY_GOALS)("PrimaryGoalSchema should accept: %s", (value) => {
      expect(PrimaryGoalSchema.safeParse(value).success).toBe(true);
    });

    it("should have correct constant mappings", () => {
      expect(PRIMARY_GOAL.LOSE_WEIGHT).toBe("lose_weight");
      expect(PRIMARY_GOAL.GAIN_MUSCLE).toBe("gain_muscle");
      expect(PRIMARY_GOAL.MAINTAIN).toBe("maintain");
      expect(PRIMARY_GOAL.IMPROVE_HEALTH).toBe("improve_health");
    });

    it("should have a label for every value", () => {
      for (const value of PRIMARY_GOALS) {
        expect(PRIMARY_GOAL_LABELS[value]).toBeDefined();
      }
    });
  });

  // ============================================================================
  // FITNESS EXPERIENCE TESTS
  // ============================================================================

  describe("FitnessExperience", () => {
    it("should contain exactly 4 values", () => {
      expect(FITNESS_EXPERIENCES).toHaveLength(4);
    });

    it.each(FITNESS_EXPERIENCES)(
      "FitnessExperienceSchema should accept: %s",
      (value) => {
        expect(FitnessExperienceSchema.safeParse(value).success).toBe(true);
      },
    );

    it("should have correct constant mappings", () => {
      expect(FITNESS_EXPERIENCE.BEGINNER).toBe("beginner");
      expect(FITNESS_EXPERIENCE.INTERMEDIATE).toBe("intermediate");
      expect(FITNESS_EXPERIENCE.ADVANCED).toBe("advanced");
      expect(FITNESS_EXPERIENCE.EXPERT).toBe("expert");
    });

    it("should have a label for every value", () => {
      for (const value of FITNESS_EXPERIENCES) {
        expect(FITNESS_EXPERIENCE_LABELS[value]).toBeDefined();
      }
    });
  });

  // ============================================================================
  // NOTIFICATION FREQUENCY TESTS
  // ============================================================================

  describe("NotificationFrequency", () => {
    it("should contain exactly 5 values", () => {
      expect(NOTIFICATION_FREQUENCIES).toHaveLength(5);
    });

    it.each(NOTIFICATION_FREQUENCIES)(
      "NotificationFrequencySchema should accept: %s",
      (value) => {
        expect(NotificationFrequencySchema.safeParse(value).success).toBe(true);
      },
    );

    it("should have correct constant mappings", () => {
      expect(NOTIFICATION_FREQUENCY.DAILY).toBe("daily");
      expect(NOTIFICATION_FREQUENCY.WEEKLY).toBe("weekly");
      expect(NOTIFICATION_FREQUENCY.BIWEEKLY).toBe("biweekly");
      expect(NOTIFICATION_FREQUENCY.MONTHLY).toBe("monthly");
      expect(NOTIFICATION_FREQUENCY.CUSTOM).toBe("custom");
    });

    it("should have a label for every value", () => {
      for (const value of NOTIFICATION_FREQUENCIES) {
        expect(NOTIFICATION_FREQUENCY_LABELS[value]).toBeDefined();
      }
    });
  });

  // ============================================================================
  // WEEKDAY TESTS
  // ============================================================================

  describe("Weekday", () => {
    it("should contain exactly 7 days", () => {
      expect(WEEKDAYS).toHaveLength(7);
    });

    it.each(WEEKDAYS)("WeekdaySchema should accept: %s", (value) => {
      expect(WeekdaySchema.safeParse(value).success).toBe(true);
    });

    it("should have correct constant mappings", () => {
      expect(WEEKDAY.MONDAY).toBe("monday");
      expect(WEEKDAY.TUESDAY).toBe("tuesday");
      expect(WEEKDAY.WEDNESDAY).toBe("wednesday");
      expect(WEEKDAY.THURSDAY).toBe("thursday");
      expect(WEEKDAY.FRIDAY).toBe("friday");
      expect(WEEKDAY.SATURDAY).toBe("saturday");
      expect(WEEKDAY.SUNDAY).toBe("sunday");
    });

    it("should have a label for every day", () => {
      for (const value of WEEKDAYS) {
        expect(WEEKDAY_LABELS[value]).toBeDefined();
      }
    });

    it("should reject invalid weekdays", () => {
      expect(WeekdaySchema.safeParse("Monday").success).toBe(false); // PascalCase
      expect(WeekdaySchema.safeParse("MONDAY").success).toBe(false); // uppercase
      expect(WeekdaySchema.safeParse("").success).toBe(false);
    });
  });

  // ============================================================================
  // ACCOUNT STATUS TESTS
  // ============================================================================

  describe("AccountStatus", () => {
    it("should contain exactly 4 values", () => {
      expect(ACCOUNT_STATUSES).toHaveLength(4);
    });

    it("should contain all expected values", () => {
      expect(ACCOUNT_STATUSES).toContain("active");
      expect(ACCOUNT_STATUSES).toContain("suspended");
      expect(ACCOUNT_STATUSES).toContain("inactive");
      expect(ACCOUNT_STATUSES).toContain("archived");
    });

    it.each(ACCOUNT_STATUSES)(
      "AccountStatusSchema should accept: %s",
      (value) => {
        expect(AccountStatusSchema.safeParse(value).success).toBe(true);
      },
    );

    it("should have correct constant mappings", () => {
      expect(ACCOUNT_STATUS.ACTIVE).toBe("active");
      expect(ACCOUNT_STATUS.SUSPENDED).toBe("suspended");
      expect(ACCOUNT_STATUS.INACTIVE).toBe("inactive");
      expect(ACCOUNT_STATUS.ARCHIVED).toBe("archived");
    });

    it("should have a label for every value", () => {
      for (const value of ACCOUNT_STATUSES) {
        expect(ACCOUNT_STATUS_LABELS[value]).toBeDefined();
      }
    });

    it("should reject uppercase values", () => {
      expect(AccountStatusSchema.safeParse("ACTIVE").success).toBe(false);
    });

    describe("deriveAccountStatus helper", () => {
      it('should return "active" when isActive=true and accountSuspended=false', () => {
        expect(deriveAccountStatus(true, false)).toBe(ACCOUNT_STATUS.ACTIVE);
      });

      it('should return "suspended" when isActive=true and accountSuspended=true', () => {
        expect(deriveAccountStatus(true, true)).toBe(ACCOUNT_STATUS.SUSPENDED);
      });

      it('should return "inactive" when isActive=false regardless of accountSuspended', () => {
        expect(deriveAccountStatus(false, false)).toBe(ACCOUNT_STATUS.INACTIVE);
        expect(deriveAccountStatus(false, true)).toBe(ACCOUNT_STATUS.INACTIVE);
      });

      it('should return "active" when both flags are undefined', () => {
        expect(deriveAccountStatus(undefined, undefined)).toBe(
          ACCOUNT_STATUS.ACTIVE,
        );
      });

      it('should return "active" when isActive=undefined and accountSuspended=false', () => {
        expect(deriveAccountStatus(undefined, false)).toBe(
          ACCOUNT_STATUS.ACTIVE,
        );
      });

      it('should return "suspended" when isActive=undefined and accountSuspended=true', () => {
        expect(deriveAccountStatus(undefined, true)).toBe(
          ACCOUNT_STATUS.SUSPENDED,
        );
      });

      it('should return "archived" when isActive=false and deletedAt is set', () => {
        expect(deriveAccountStatus(false, false, new Date())).toBe(ACCOUNT_STATUS.ARCHIVED);
        expect(deriveAccountStatus(false, true, new Date())).toBe(ACCOUNT_STATUS.ARCHIVED);
      });

      it('should return "inactive" when isActive=false and deletedAt is null', () => {
        expect(deriveAccountStatus(false, false, null)).toBe(ACCOUNT_STATUS.INACTIVE);
      });

      it('should return "inactive" when isActive=false and deletedAt is undefined', () => {
        expect(deriveAccountStatus(false, false, undefined)).toBe(ACCOUNT_STATUS.INACTIVE);
      });

      it("round-trips canonical suspended flags from the shared write helper", () => {
        const flags = mapAccountStatusToFlags(ACCOUNT_STATUS.SUSPENDED);

        expect(
          deriveAccountStatus(flags.isActive, flags.accountSuspended),
        ).toBe(ACCOUNT_STATUS.SUSPENDED);
      });
    });

    describe("isActiveAccountStatus helper", () => {
      it('should return true for "active" status', () => {
        expect(isActiveAccountStatus(ACCOUNT_STATUS.ACTIVE)).toBe(true);
      });

      it('should return false for "suspended" status', () => {
        expect(isActiveAccountStatus(ACCOUNT_STATUS.SUSPENDED)).toBe(false);
      });

      it('should return false for "inactive" status', () => {
        expect(isActiveAccountStatus(ACCOUNT_STATUS.INACTIVE)).toBe(false);
      });
    });

    describe("mapAccountStatusToFlags helper", () => {
      it("maps active to canonical persisted flags", () => {
        expect(mapAccountStatusToFlags(ACCOUNT_STATUS.ACTIVE)).toEqual({
          isActive: true,
          accountSuspended: false,
        });
      });

      it("maps suspended to canonical persisted flags", () => {
        expect(mapAccountStatusToFlags(ACCOUNT_STATUS.SUSPENDED)).toEqual({
          isActive: true,
          accountSuspended: true,
        });
      });

      it("maps inactive to canonical persisted flags", () => {
        expect(mapAccountStatusToFlags(ACCOUNT_STATUS.INACTIVE)).toEqual({
          isActive: false,
          accountSuspended: false,
        });
      });
    });

    describe("normalizeAccountStatusFlags helper", () => {
      it("normalizes legacy inactive+suspended flags to canonical inactive", () => {
        expect(normalizeAccountStatusFlags(false, true)).toEqual({
          accountStatus: ACCOUNT_STATUS.INACTIVE,
          isActive: false,
          accountSuspended: false,
        });
      });

      it("normalizes undefined flags to canonical active", () => {
        expect(normalizeAccountStatusFlags(undefined, undefined)).toEqual({
          accountStatus: ACCOUNT_STATUS.ACTIVE,
          isActive: true,
          accountSuspended: false,
        });
      });
    });
  });

  // ============================================================================
  // PREGNANCY STATUS TESTS
  // ============================================================================

  describe("PregnancyStatus", () => {
    it("should contain exactly 5 values", () => {
      expect(PREGNANCY_STATUSES).toHaveLength(5);
    });

    it("should contain all expected values", () => {
      expect(PREGNANCY_STATUSES).toContain("not_pregnant");
      expect(PREGNANCY_STATUSES).toContain("trimester_1");
      expect(PREGNANCY_STATUSES).toContain("trimester_2");
      expect(PREGNANCY_STATUSES).toContain("trimester_3");
      expect(PREGNANCY_STATUSES).toContain("postpartum");
    });

    it.each(PREGNANCY_STATUSES)(
      "PregnancyStatusSchema should accept: %s",
      (value) => {
        expect(PregnancyStatusSchema.safeParse(value).success).toBe(true);
      },
    );

    it("should have correct constant mappings", () => {
      expect(PREGNANCY_STATUS.NOT_PREGNANT).toBe("not_pregnant");
      expect(PREGNANCY_STATUS.TRIMESTER_1).toBe("trimester_1");
      expect(PREGNANCY_STATUS.TRIMESTER_2).toBe("trimester_2");
      expect(PREGNANCY_STATUS.TRIMESTER_3).toBe("trimester_3");
      expect(PREGNANCY_STATUS.POSTPARTUM).toBe("postpartum");
    });

    it("should have a label for every value", () => {
      for (const value of PREGNANCY_STATUSES) {
        expect(PREGNANCY_STATUS_LABELS[value]).toBeDefined();
      }
    });

    describe("calculateTrimesterFromDueDate", () => {
      it("should return postpartum when due date is in the past", () => {
        const pastDate = new Date("2024-01-01");
        const refDate = new Date("2025-01-01");
        expect(calculateTrimesterFromDueDate(pastDate, refDate)).toBe(
          "postpartum",
        );
      });

      it("should return trimester_3 when due date is ~4 weeks away", () => {
        const refDate = new Date("2025-06-01");
        const dueDate = new Date("2025-07-01"); // ~4 weeks
        expect(calculateTrimesterFromDueDate(dueDate, refDate)).toBe(
          "trimester_3",
        );
      });

      it("should return trimester_1 when due date is ~38 weeks away", () => {
        const refDate = new Date("2025-01-01");
        // 38 weeks away = 266 days
        const dueDate = new Date(
          refDate.getTime() + 38 * 7 * 24 * 60 * 60 * 1000,
        );
        expect(calculateTrimesterFromDueDate(dueDate, refDate)).toBe(
          "trimester_1",
        );
      });

      it("should return not_pregnant for invalid date", () => {
        expect(calculateTrimesterFromDueDate(new Date("invalid"))).toBe(
          "not_pregnant",
        );
      });
    });
  });

  // ============================================================================
  // MESSAGE RECIPIENT ROLES
  // ============================================================================

  describe("MessagingRecipientRole", () => {
    it("should contain exactly 2 values", () => {
      expect(MESSAGE_RECIPIENT_ROLES).toHaveLength(2);
    });

    it("should contain all expected values", () => {
      expect(MESSAGE_RECIPIENT_ROLES).toContain("FITNESS_COORDINATOR");
      expect(MESSAGE_RECIPIENT_ROLES).toContain("CLINICIAN");
    });

    it.each(MESSAGE_RECIPIENT_ROLES)("schema should accept: %s", (value) => {
      expect(MessagingRecipientRoleSchema.safeParse(value).success).toBe(true);
    });

    it("should have correct constant mappings", () => {
      expect(MESSAGE_RECIPIENT_ROLE.FITNESS_COORDINATOR).toBe(
        "FITNESS_COORDINATOR",
      );
      expect(MESSAGE_RECIPIENT_ROLE.CLINICIAN).toBe("CLINICIAN");
    });

    it("should have a label for every value", () => {
      for (const value of MESSAGE_RECIPIENT_ROLES) {
        expect(MESSAGE_RECIPIENT_ROLE_LABELS[value]).toBeDefined();
      }
    });
  });

  // ============================================================================
  // USER PROFILE SCHEMA TESTS
  // ============================================================================

  describe("UserProfileSchema", () => {
    const validProfile = {
      userId: "HH-ABC123",
      email: "user@example.com",
      fullName: "John Doe",
      onboardingCompleted: true,
      createdAt: NOW_ISO,
      updatedAt: NOW_ISO,
    };

    describe("valid objects", () => {
      it("should accept a minimal valid profile", () => {
        const result = UserProfileSchema.safeParse(validProfile);
        expect(result.success).toBe(true);
      });

      it("should accept a profile with all optional fields", () => {
        const result = UserProfileSchema.safeParse({
          ...validProfile,
          id: "some-id",
          preferredName: "Johnny",
          role: "CLIENT",
          tier: "CORE",
          avatarUrl: "https://example.com/avatar.jpg",
          bio: "A test user",
          occupation: "Software Engineer",
          primaryGoal: "gain_muscle",
          activityLevel: "very_active",
          experienceLevel: "intermediate",
          dateOfBirth: "1990-05-15",
          biologicalSex: "male",
          pregnancyStatus: null,
          pregnancyDueDate: null,
          calculatedPregnancyStatus: null,
          heightCm: 180,
          weightKg: 85,
          initialWeightKg: 90,
          timezone: "America/New_York",
          assignedClinicianId: null,
          assignedTrainerId: null,
          medications: [],
          limitations: [],
          injuries: [],
          medicalConditions: [],
          isActive: true,
        });
        expect(result.success).toBe(true);
      });
    });

    describe("invalid objects", () => {
      it("should reject missing email", () => {
        const { email: _e, ...rest } = validProfile;
        const result = UserProfileSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it("should reject invalid email", () => {
        const result = UserProfileSchema.safeParse({
          ...validProfile,
          email: "not-an-email",
        });
        expect(result.success).toBe(false);
      });

      it("should reject empty fullName", () => {
        const result = UserProfileSchema.safeParse({
          ...validProfile,
          fullName: "",
        });
        expect(result.success).toBe(false);
      });

      it("should reject missing onboardingCompleted", () => {
        const { onboardingCompleted: _o, ...rest } = validProfile;
        const result = UserProfileSchema.safeParse(rest);
        expect(result.success).toBe(false);
      });

      it("should reject negative heightCm", () => {
        const result = UserProfileSchema.safeParse({
          ...validProfile,
          heightCm: -1,
        });
        expect(result.success).toBe(false);
      });

      it("should reject negative weightKg", () => {
        const result = UserProfileSchema.safeParse({
          ...validProfile,
          weightKg: -1,
        });
        expect(result.success).toBe(false);
      });

      it("should reject invalid role", () => {
        const result = UserProfileSchema.safeParse({
          ...validProfile,
          role: "SUPERUSER",
        });
        expect(result.success).toBe(false);
      });

      it("should reject invalid tier", () => {
        const result = UserProfileSchema.safeParse({
          ...validProfile,
          tier: "PLATINUM",
        });
        expect(result.success).toBe(false);
      });

      it("should reject invalid avatarUrl", () => {
        const result = UserProfileSchema.safeParse({
          ...validProfile,
          avatarUrl: "not-a-url",
        });
        expect(result.success).toBe(false);
      });

      it("should reject empty object", () => {
        const result = UserProfileSchema.safeParse({});
        expect(result.success).toBe(false);
      });
    });
  });

  // ============================================================================
  // USER GOALS SCHEMA TESTS
  // ============================================================================

  describe("UserGoalsSchema", () => {
    const validGoals = {
      userId: "HH-ABC123",
      calorieTarget: 2500,
      proteinTarget: 180,
      carbTarget: 300,
      fatTarget: 80,
      weeklyWeightChangeTarget: -0.5,
      workoutsPerWeek: 5,
      createdAt: NOW_ISO,
      updatedAt: NOW_ISO,
    };

    it("should accept valid goals", () => {
      const result = UserGoalsSchema.safeParse(validGoals);
      expect(result.success).toBe(true);
    });

    it("should accept zero values for targets", () => {
      const result = UserGoalsSchema.safeParse({
        ...validGoals,
        calorieTarget: 0,
        proteinTarget: 0,
        workoutsPerWeek: 0,
      });
      expect(result.success).toBe(true);
    });

    it("should accept negative weeklyWeightChangeTarget (weight loss)", () => {
      const result = UserGoalsSchema.safeParse({
        ...validGoals,
        weeklyWeightChangeTarget: -1.0,
      });
      expect(result.success).toBe(true);
    });

    it("should accept optional sleepHoursTarget", () => {
      const result = UserGoalsSchema.safeParse({
        ...validGoals,
        sleepHoursTarget: 8,
      });
      expect(result.success).toBe(true);
    });

    it("should reject negative calorieTarget", () => {
      const result = UserGoalsSchema.safeParse({
        ...validGoals,
        calorieTarget: -100,
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing required fields", () => {
      const result = UserGoalsSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // USER METRICS SCHEMA TESTS
  // ============================================================================

  describe("UserMetricsSchema", () => {
    const validMetrics = {
      tdee: 2800,
      bmr: 1800,
      recoveryScore: 75,
      sleepPerformance: 82,
      todaysStrain: 12.5,
      loggedCalories: 2200,
      lastUpdated: NOW_ISO,
    };

    it("should accept valid metrics with required fields only", () => {
      const result = UserMetricsSchema.safeParse(validMetrics);
      expect(result.success).toBe(true);
    });

    it("should accept metrics with all optional fields", () => {
      const result = UserMetricsSchema.safeParse({
        ...validMetrics,
        trainingLoad: 450,
        currentWeight: 85,
        weeklyWeightChange: -0.3,
        monthlyWeightChange: -1.2,
        currentBodyFat: 18.5,
        currentMuscleMass: 38,
        averageSleepDuration: 7.5,
        averageSleepQuality: 80,
        averageHRV: 55,
        averageRestingHR: 62,
        stressScore: 35,
        weeklyStrain: 75,
        monthlyStrain: 300,
        stepCount: 10000,
        activeMinutes: 45,
        weeklyCalorieAverage: 2400,
        macroAdherence: 85,
        workoutStreak: 14,
        loggingStreak: 30,
        adherenceScore: 90,
      });
      expect(result.success).toBe(true);
    });

    it("should reject recoveryScore above 100", () => {
      const result = UserMetricsSchema.safeParse({
        ...validMetrics,
        recoveryScore: 101,
      });
      expect(result.success).toBe(false);
    });

    it("should reject recoveryScore below 0", () => {
      const result = UserMetricsSchema.safeParse({
        ...validMetrics,
        recoveryScore: -1,
      });
      expect(result.success).toBe(false);
    });

    it("should reject sleepPerformance above 100", () => {
      const result = UserMetricsSchema.safeParse({
        ...validMetrics,
        sleepPerformance: 101,
      });
      expect(result.success).toBe(false);
    });

    it("should reject negative tdee", () => {
      const result = UserMetricsSchema.safeParse({
        ...validMetrics,
        tdee: -1,
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing required fields", () => {
      const result = UserMetricsSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // USER PREFERENCES SCHEMA TESTS
  // ============================================================================

  describe("UserPreferencesSchema", () => {
    const validPreferences = {
      userId: "HH-ABC123",
      unitSystem: "imperial" as const,
      timeFormat: "standard" as const,
      locale: "en-US",
      createdAt: NOW_ISO,
      updatedAt: NOW_ISO,
    };

    it("should accept valid preferences", () => {
      const result = UserPreferencesSchema.safeParse(validPreferences);
      expect(result.success).toBe(true);
    });

    it.each(["imperial", "metric", "advanced"] as const)(
      "should accept unitSystem: %s",
      (unitSystem) => {
        const result = UserPreferencesSchema.safeParse({
          ...validPreferences,
          unitSystem,
        });
        expect(result.success).toBe(true);
      },
    );

    it.each(["standard", "military"] as const)(
      "should accept timeFormat: %s",
      (timeFormat) => {
        const result = UserPreferencesSchema.safeParse({
          ...validPreferences,
          timeFormat,
        });
        expect(result.success).toBe(true);
      },
    );

    it("should reject invalid unitSystem", () => {
      const result = UserPreferencesSchema.safeParse({
        ...validPreferences,
        unitSystem: "custom",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid timeFormat", () => {
      const result = UserPreferencesSchema.safeParse({
        ...validPreferences,
        timeFormat: "24h",
      });
      expect(result.success).toBe(false);
    });

    it("accepts canonical notification partial updates with legacy weekday aliases", () => {
      const result = notificationPreferencesUpdateSchema.safeParse({
        weeklyInsights: {
          enabled: false,
          dayOfWeek: 2,
        },
        adminPortal: {
          patientAssignedToMe: true,
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.weeklyInsights?.day).toBe("wednesday");
        expect(result.data.adminPortal).toEqual({ patientAssignedToMe: true });
      }
    });

    it("normalizes partial notification JSON into the canonical full contract", () => {
      const normalized = normalizeNotificationPreferences({
        weeklyInsights: {
          enabled: false,
          dayOfWeek: 4,
        },
        nutritionCoaching: {
          enabled: true,
          mealReminders: true,
        },
        adminPortal: {
          appointmentBookedByOthers: true,
        },
      });

      expect(normalized.weeklyInsights).toEqual({
        enabled: false,
        time: "09:00",
        day: "friday",
      });
      expect(normalized.nutritionCoaching).toEqual({
        enabled: true,
        breakfastTime: "08:00",
        lunchTime: "12:30",
        dinnerTime: "19:00",
      });
      expect(normalized.adminPortal).toEqual({
        appointmentBookedByOthers: true,
        appointmentCancelledByOthers: false,
        appointmentModifiedByOthers: false,
        patientAssignedToMe: false,
      });
    });
  });

  // ============================================================================
  // USER ACCOUNT SCHEMA TESTS
  // ============================================================================

  describe("UserAccountSchema", () => {
    it("should accept account with profile only", () => {
      const result = UserAccountSchema.safeParse({
        profile: {
          userId: "HH-ABC123",
          email: "user@example.com",
          fullName: "John Doe",
          onboardingCompleted: true,
          createdAt: NOW_ISO,
          updatedAt: NOW_ISO,
        },
      });
      expect(result.success).toBe(true);
    });

    it("should reject account without profile", () => {
      const result = UserAccountSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // MOCK FACTORY TESTS
  // ============================================================================

  describe("Mock factories", () => {
    describe("createMockUserProfile", () => {
      it("should create a valid profile", () => {
        const profile = createMockUserProfile();
        const result = UserProfileSchema.safeParse(profile);
        expect(result.success).toBe(true);
      });

      it("should accept overrides", () => {
        const profile = createMockUserProfile({
          fullName: "Jane Doe",
          tier: "CONCIERGE",
        });
        expect(profile.fullName).toBe("Jane Doe");
        expect(profile.tier).toBe("CONCIERGE");
      });

      it("should have correct defaults", () => {
        const profile = createMockUserProfile();
        expect(profile.userId).toBe("mock-user");
        expect(profile.email).toBe("mock.user@example.com");
        expect(profile.fullName).toBe("Mock User");
        expect(profile.role).toBe("CLIENT");
        expect(profile.tier).toBe("CORE");
        expect(profile.onboardingCompleted).toBe(true);
      });
    });

    describe("createMockUserAccount", () => {
      it("should create a valid account", () => {
        const account = createMockUserAccount();
        const result = UserAccountSchema.safeParse(account);
        expect(result.success).toBe(true);
      });

      it("should include a profile", () => {
        const account = createMockUserAccount();
        expect(account.profile).toBeDefined();
        expect(account.profile.userId).toBe("mock-user");
      });
    });
  });
});
