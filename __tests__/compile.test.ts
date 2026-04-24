/**
 * @ai-context Contract Compilation Tests | validates all shared contracts export correctly
 *
 * Phase 8, Action Item 4: Ensure shared contracts compile and are valid.
 *
 * This test suite verifies:
 * 1. All exports from shared contracts are importable
 * 2. All Zod schemas are valid and can parse sample data
 * 3. All type exports exist
 * 4. No circular dependencies cause import failures
 *
 * Run: npm run test:contracts
 */

import {
    createGoalInputSchema,
    createPhaseInputSchema,
    createStrategyInputSchema,
    exerciseFilterParamsSchema,
    labDataExtractionResultWithGovernanceSchema,
    labMetricSearchResponseSchema,
    labObservationInputSchema,
    pendingMetricsResponseSchema,
    trainerSummarySchema,
    updateGoalInputSchema,
    workoutGenerationProgressSchema,
} from "../admin/admin-schemas";
import type {
    CreateGoalInput,
    CreatePhaseInput,
    CreateStrategyInput,
    ExerciseFilterParams,
    LabDataExtractionResultWithGovernance,
    LabObservationInput,
    TrainerSummary,
    UpdateGoalInput,
    WorkoutGenerationProgress,
} from "../admin/admin-types";
import type {
    AttachObservationsInput,
    CreateLabMetricDefinitionInput,
    CreateLabOrderInput,
    ExtractLabDataInput,
    LabMetricSearchParams,
    LabMetricSearchResponse,
    LabOrderDetailResponse,
    PendingMetricsResponse,
} from "../admin/labs";
import {
    attachObservationsInputSchema,
    createLabMetricDefinitionInputSchema,
    createLabOrderInputSchema,
    extractLabDataInputSchema,
    labMetricSearchParamsSchema,
    LabOrderDetailResponseSchema,
} from "../admin/labs";
import * as contracts from "../index";

type ContractIsExact<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? (<T>() => T extends B ? 1 : 2) extends <T>() => T extends A ? 1 : 2
      ? true
      : false
    : false;

type AssertContract<T extends true> = T;

function assertLabObservationInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      LabObservationInput,
      import("zod").input<typeof labObservationInputSchema>
    >
  >,
): void {
  void _value;
}

function assertLabMetricSearchResponseContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      LabMetricSearchResponse,
      import("zod").output<typeof labMetricSearchResponseSchema>
    >
  >,
): void {
  void _value;
}

function assertLabMetricSearchParamsContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      LabMetricSearchParams,
      import("zod").input<typeof labMetricSearchParamsSchema>
    >
  >,
): void {
  void _value;
}

function assertCreateLabMetricDefinitionInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      CreateLabMetricDefinitionInput,
      import("zod").input<typeof createLabMetricDefinitionInputSchema>
    >
  >,
): void {
  void _value;
}

function assertExtractLabDataInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      ExtractLabDataInput,
      import("zod").input<typeof extractLabDataInputSchema>
    >
  >,
): void {
  void _value;
}

function assertAttachObservationsInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      AttachObservationsInput,
      import("zod").input<typeof attachObservationsInputSchema>
    >
  >,
): void {
  void _value;
}

function assertCreateLabOrderInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      CreateLabOrderInput,
      import("zod").input<typeof createLabOrderInputSchema>
    >
  >,
): void {
  void _value;
}

function assertPendingMetricsResponseContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      PendingMetricsResponse,
      import("zod").output<typeof pendingMetricsResponseSchema>
    >
  >,
): void {
  void _value;
}

function assertWorkoutGenerationProgressContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      WorkoutGenerationProgress,
      import("zod").infer<typeof workoutGenerationProgressSchema>
    >
  >,
): void {
  void _value;
}

function assertLabDataExtractionResultWithGovernanceContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      LabDataExtractionResultWithGovernance,
      import("zod").infer<typeof labDataExtractionResultWithGovernanceSchema>
    >
  >,
): void {
  void _value;
}

function assertLabOrderDetailResponseContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      LabOrderDetailResponse,
      import("zod").infer<typeof LabOrderDetailResponseSchema>
    >
  >,
): void {
  void _value;
}

function assertTrainerSummaryContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      TrainerSummary,
      import("zod").infer<typeof trainerSummarySchema>
    >
  >,
): void {
  void _value;
}

function assertCreatePhaseInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      CreatePhaseInput,
      import("zod").infer<typeof createPhaseInputSchema>
    >
  >,
): void {
  void _value;
}

function assertCreateGoalInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      CreateGoalInput,
      import("zod").infer<typeof createGoalInputSchema>
    >
  >,
): void {
  void _value;
}

function assertUpdateGoalInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      UpdateGoalInput,
      import("zod").infer<typeof updateGoalInputSchema>
    >
  >,
): void {
  void _value;
}

function assertCreateStrategyInputContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      CreateStrategyInput,
      import("zod").infer<typeof createStrategyInputSchema>
    >
  >,
): void {
  void _value;
}

function assertExerciseFilterParamsContractMatchesSchema(
  _value: AssertContract<
    ContractIsExact<
      ExerciseFilterParams,
      import("zod").infer<typeof exerciseFilterParamsSchema>
    >
  >,
): void {
  void _value;
}

// ============================================================================
// COMPILATION TESTS
// ============================================================================

describe("Shared Contracts Compilation", () => {
  describe("API Routes", () => {
    it("should export API_ROUTES", () => {
      expect(contracts.API_ROUTES).toBeDefined();
      expect(typeof contracts.API_ROUTES).toBe("object");
    });

    it("should export AUTH_ROUTES", () => {
      expect(contracts.AUTH_ROUTES).toBeDefined();
      expect(contracts.AUTH_ROUTES.LOGIN).toBe("/auth/login");
      expect(contracts.AUTH_ROUTES.SIGNUP).toBe("/auth/signup");
      expect(contracts.AUTH_ROUTES.REFRESH).toBe("/auth/refresh");
      expect(contracts.AUTH_ROUTES.LOGOUT).toBe("/auth/logout");
    });

    it("should export USER_ROUTES as functions", () => {
      expect(contracts.USER_ROUTES).toBeDefined();
      expect(typeof contracts.USER_ROUTES.get).toBe("function");
      expect(contracts.USER_ROUTES.get("HH-ABC123")).toBe("/users/HH-ABC123");
    });

    it("should export ADMIN_ROUTES", () => {
      expect(contracts.ADMIN_ROUTES).toBeDefined();
      expect(contracts.ADMIN_ROUTES.ANALYTICS).toBe("/admin/analytics");
    });

    it("should export HTTP_METHODS", () => {
      expect(contracts.HTTP_METHODS).toBeDefined();
      expect(contracts.HTTP_METHODS).toContain("GET");
      expect(contracts.HTTP_METHODS).toContain("POST");
      expect(contracts.HTTP_METHODS).toContain("PUT");
      expect(contracts.HTTP_METHODS).toContain("PATCH");
      expect(contracts.HTTP_METHODS).toContain("DELETE");
    });

    it("should export route helper functions", () => {
      expect(typeof contracts.getRoutePattern).toBe("function");
      expect(typeof contracts.buildUrlWithQuery).toBe("function");

      // Test buildUrlWithQuery
      const url = contracts.buildUrlWithQuery("/users/123/metrics", {
        startDate: "2024-01-01",
        endDate: "2024-01-31",
      });
      expect(url).toContain("/users/123/metrics");
      expect(url).toContain("startDate=2024-01-01");
      expect(url).toContain("endDate=2024-01-31");
    });
  });

  describe("Domain Contracts", () => {
    it("should export USER_ROLES", () => {
      expect(contracts.USER_ROLES).toBeDefined();
      expect(Array.isArray(contracts.USER_ROLES)).toBe(true);
      expect(contracts.USER_ROLES).toContain("ADMIN");
      expect(contracts.USER_ROLES).toContain("CLINICIAN");
      expect(contracts.USER_ROLES).toContain("TRAINER");
      expect(contracts.USER_ROLES).toContain("CLIENT");
    });

    it("should export USER_ROLE constants", () => {
      expect(contracts.USER_ROLE).toBeDefined();
      expect(contracts.USER_ROLE.ADMIN).toBe("ADMIN");
      expect(contracts.USER_ROLE.CLINICIAN).toBe("CLINICIAN");
      expect(contracts.USER_ROLE.TRAINER).toBe("TRAINER");
      expect(contracts.USER_ROLE.CLIENT).toBe("CLIENT");
    });

    it("should export USER_ROLE_LABELS", () => {
      expect(contracts.USER_ROLE_LABELS).toBeDefined();
      expect(contracts.USER_ROLE_LABELS.ADMIN).toBe("Admin");
      expect(contracts.USER_ROLE_LABELS.CLINICIAN).toBe("Clinician");
      expect(contracts.USER_ROLE_LABELS.TRAINER).toBe("Trainer");
      expect(contracts.USER_ROLE_LABELS.CLIENT).toBe("Client");
    });

    it("should export APPOINTMENT_STATUSES", () => {
      expect(contracts.APPOINTMENT_STATUSES).toBeDefined();
      expect(Array.isArray(contracts.APPOINTMENT_STATUSES)).toBe(true);
      expect(contracts.APPOINTMENT_STATUSES).toContain("SCHEDULED");
      expect(contracts.APPOINTMENT_STATUSES).toContain("COMPLETED");
      expect(contracts.APPOINTMENT_STATUSES).toContain("CANCELLED");
      expect(contracts.APPOINTMENT_STATUSES).toContain("NO_SHOW");
    });

    it("should export APPOINTMENT_TYPES", () => {
      expect(contracts.APPOINTMENT_TYPES).toBeDefined();
      expect(Array.isArray(contracts.APPOINTMENT_TYPES)).toBe(true);
      expect(contracts.APPOINTMENT_TYPES).toContain("CHECK_IN");
      expect(contracts.APPOINTMENT_TYPES).toContain("TRAINING_SESSION");
    });

    it("should export STRATEGY_STATUSES", () => {
      expect(contracts.STRATEGY_STATUSES).toBeDefined();
      expect(Array.isArray(contracts.STRATEGY_STATUSES)).toBe(true);
      expect(contracts.STRATEGY_STATUSES).toContain("ACTIVE");
      expect(contracts.STRATEGY_STATUSES).toContain("COMPLETED");
      expect(contracts.STRATEGY_STATUSES).toContain("PAUSED");
      expect(contracts.STRATEGY_STATUSES).toContain("CANCELLED");
    });

    it("should export STRATEGY_STATUS constants", () => {
      expect(contracts.STRATEGY_STATUS).toBeDefined();
      expect(contracts.STRATEGY_STATUS.ACTIVE).toBe("ACTIVE");
      expect(contracts.STRATEGY_STATUS.COMPLETED).toBe("COMPLETED");
      expect(contracts.STRATEGY_STATUS.PAUSED).toBe("PAUSED");
      expect(contracts.STRATEGY_STATUS.CANCELLED).toBe("CANCELLED");
    });

    it("should export USER_TIERS", () => {
      expect(contracts.USER_TIERS).toBeDefined();
      expect(contracts.USER_TIERS).toContain("ESSENTIALS");
      expect(contracts.USER_TIERS).toContain("CORE");
      expect(contracts.USER_TIERS).toContain("CONCIERGE");
    });

    it("should export role helper functions", () => {
      expect(typeof contracts.isAdminRole).toBe("function");
      expect(typeof contracts.isSiteAdminRole).toBe("function");
      expect(typeof contracts.isClinicalRole).toBe("function");
      expect(typeof contracts.isTrainerRole).toBe("function");
      expect(contracts.isAdminRole("ADMIN")).toBe(true);
      expect(contracts.isAdminRole("CLINICIAN")).toBe(true);
      expect(contracts.isAdminRole("TRAINER")).toBe(true);
      expect(contracts.isAdminRole("CLIENT")).toBe(false);
      expect(contracts.isSiteAdminRole("ADMIN")).toBe(true);
      expect(contracts.isSiteAdminRole("CLINICIAN")).toBe(false);
      expect(contracts.isSiteAdminRole("TRAINER")).toBe(false);
      expect(contracts.isClinicalRole("ADMIN")).toBe(true);
      expect(contracts.isClinicalRole("CLINICIAN")).toBe(true);
      expect(contracts.isClinicalRole("TRAINER")).toBe(false);
      expect(contracts.isTrainerRole("ADMIN")).toBe(true);
      expect(contracts.isTrainerRole("TRAINER")).toBe(true);
      expect(contracts.isTrainerRole("CLINICIAN")).toBe(false);
    });
  });

  describe("Zod Schemas", () => {
    describe("emailSchema", () => {
      it("should validate correct emails", () => {
        const result = contracts.emailSchema.safeParse("test@example.com");
        expect(result.success).toBe(true);
      });

      it("should reject invalid emails", () => {
        const result = contracts.emailSchema.safeParse("not-an-email");
        expect(result.success).toBe(false);
      });
    });

    describe("passwordSchema", () => {
      it("should validate passwords with 8+ characters", () => {
        const result = contracts.passwordSchema.safeParse("password123");
        expect(result.success).toBe(true);
      });

      it("should reject short passwords", () => {
        const result = contracts.passwordSchema.safeParse("short");
        expect(result.success).toBe(false);
      });
    });

    describe("isoDateSchema", () => {
      it("should validate correct ISO dates", () => {
        const result = contracts.isoDateSchema.safeParse("2024-01-15");
        expect(result.success).toBe(true);
      });

      it("should reject invalid date formats", () => {
        const result = contracts.isoDateSchema.safeParse("01-15-2024");
        expect(result.success).toBe(false);
      });

      it("should reject invalid dates", () => {
        const result = contracts.isoDateSchema.safeParse("2024-02-30");
        expect(result.success).toBe(false);
      });
    });

    describe("isoTimestampSchema", () => {
      it("should validate ISO timestamps", () => {
        const result = contracts.isoTimestampSchema.safeParse(
          "2024-01-15T10:30:00.000Z",
        );
        expect(result.success).toBe(true);
      });

      it("should reject invalid timestamps", () => {
        const result =
          contracts.isoTimestampSchema.safeParse("not-a-timestamp");
        expect(result.success).toBe(false);
      });
    });

    describe("barcodeSchema", () => {
      it("should validate HH-XXXXXX format", () => {
        const result = contracts.barcodeSchema.safeParse("HH-ABC234");
        expect(result.success).toBe(true);
      });

      it("should reject invalid barcode formats", () => {
        const result = contracts.barcodeSchema.safeParse("INVALID");
        expect(result.success).toBe(false);
      });
    });

    describe("userIdSchema", () => {
      it("should validate user ID format", () => {
        const result = contracts.userIdSchema.safeParse("HH-ABC123");
        expect(result.success).toBe(true);
      });
    });

    describe("UserRoleSchema", () => {
      it("should validate user roles", () => {
        expect(contracts.UserRoleSchema.safeParse("ADMIN").success).toBe(true);
        expect(contracts.UserRoleSchema.safeParse("CLINICIAN").success).toBe(
          true,
        );
        expect(contracts.UserRoleSchema.safeParse("TRAINER").success).toBe(
          true,
        );
        expect(contracts.UserRoleSchema.safeParse("CLIENT").success).toBe(true);
        expect(contracts.UserRoleSchema.safeParse("INVALID").success).toBe(
          false,
        );
      });
    });

    describe("AppointmentStatusSchema", () => {
      it("should validate appointment statuses", () => {
        expect(
          contracts.AppointmentStatusSchema.safeParse("SCHEDULED").success,
        ).toBe(true);
        expect(
          contracts.AppointmentStatusSchema.safeParse("COMPLETED").success,
        ).toBe(true);
        expect(
          contracts.AppointmentStatusSchema.safeParse("INVALID").success,
        ).toBe(false);
      });
    });

    describe("loginBodySchema", () => {
      it("should validate login request bodies", () => {
        const result = contracts.loginBodySchema.safeParse({
          email: "user@example.com",
          password: "securepassword",
        });
        expect(result.success).toBe(true);
      });

      it("should reject invalid login bodies", () => {
        const result = contracts.loginBodySchema.safeParse({
          email: "not-an-email",
          password: "",
        });
        expect(result.success).toBe(false);
      });
    });

    describe("dateRangeQuerySchema", () => {
      it("should validate date range queries", () => {
        const result = contracts.dateRangeQuerySchema.safeParse({
          startDate: "2024-01-01",
          endDate: "2024-01-31",
        });
        expect(result.success).toBe(true);
      });
    });

    describe("paginationQuerySchema", () => {
      it("should provide defaults", () => {
        const result = contracts.paginationQuerySchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(20);
          expect(result.data.offset).toBe(0);
        }
      });

      it("should accept custom values", () => {
        const result = contracts.paginationQuerySchema.safeParse({
          limit: "50",
          offset: "10",
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(50);
          expect(result.data.offset).toBe(10);
        }
      });
    });
  });

  describe("Constants", () => {
    it("should export STORAGE_KEYS", () => {
      expect(contracts.STORAGE_KEYS).toBeDefined();
      expect(contracts.STORAGE_KEYS.ACCESS_TOKEN).toBe("hollis:accessToken");
      expect(contracts.STORAGE_KEYS.USER_ID).toBe("hollis:userId");
    });

    it("should export UNIT_SYSTEMS", () => {
      expect(contracts.UNIT_SYSTEMS).toBeDefined();
      expect(contracts.UNIT_SYSTEMS).toContain("metric");
      expect(contracts.UNIT_SYSTEMS).toContain("imperial");
      expect(contracts.UNIT_SYSTEMS).toContain("advanced");
    });

    it("should export PAGINATION defaults", () => {
      expect(contracts.PAGINATION).toBeDefined();
      expect(contracts.PAGINATION.DEFAULT_PAGE_SIZE).toBe(50);
      expect(contracts.PAGINATION.MAX_PAGE_SIZE).toBe(200);
    });

    it("should export TIME_MS constants", () => {
      expect(contracts.TIME_MS).toBeDefined();
      expect(contracts.TIME_MS.SECOND).toBe(1000);
      expect(contracts.TIME_MS.MINUTE).toBe(60000);
      expect(contracts.TIME_MS.HOUR).toBe(3600000);
    });
  });

  describe("Type Validation Helpers", () => {
    it("should export isValidBarcode", () => {
      expect(typeof contracts.isValidBarcode).toBe("function");
      expect(contracts.isValidBarcode("HH-ABC234")).toBe(true);
      expect(contracts.isValidBarcode("invalid")).toBe(false);
    });

    it("should export isValidUserId", () => {
      expect(typeof contracts.isValidUserId).toBe("function");
      expect(contracts.isValidUserId("HH-ABC123")).toBe(true);
      expect(contracts.isValidUserId("invalid")).toBe(false);
    });

    it("should export isAppointmentStatus", () => {
      expect(typeof contracts.isAppointmentStatus).toBe("function");
      expect(contracts.isAppointmentStatus("SCHEDULED")).toBe(true);
      expect(contracts.isAppointmentStatus("INVALID")).toBe(false);
    });

    it("should export isStrategyStatus", () => {
      expect(typeof contracts.isStrategyStatus).toBe("function");
      expect(contracts.isStrategyStatus("ACTIVE")).toBe(true);
      expect(contracts.isStrategyStatus("INVALID")).toBe(false);
    });

    it("should export isAppointmentType", () => {
      expect(typeof contracts.isAppointmentType).toBe("function");
      expect(contracts.isAppointmentType("CHECK_IN")).toBe(true);
      expect(contracts.isAppointmentType("INVALID")).toBe(false);
    });
  });
});

// ============================================================================
// CIRCULAR DEPENDENCY TESTS
// ============================================================================

describe("Circular Dependency Prevention", () => {
  it("should import all modules without errors", () => {
    // If we got here, there are no circular dependencies that would cause
    // import failures. This test documents the expected behavior.
    expect(contracts).toBeDefined();
    expect(Object.keys(contracts).length).toBeGreaterThan(0);
  });

  it("should have all expected top-level exports", () => {
    // API Routes
    expect("API_ROUTES" in contracts).toBe(true);
    expect("AUTH_ROUTES" in contracts).toBe(true);
    expect("USER_ROUTES" in contracts).toBe(true);
    expect("ADMIN_ROUTES" in contracts).toBe(true);

    // Domain
    expect("USER_ROLES" in contracts).toBe(true);
    expect("APPOINTMENT_STATUSES" in contracts).toBe(true);
    expect("USER_TIERS" in contracts).toBe(true);

    // Schemas
    expect("emailSchema" in contracts).toBe(true);
    expect("isoDateSchema" in contracts).toBe(true);
    expect("UserRoleSchema" in contracts).toBe(true);

    // Constants
    expect("STORAGE_KEYS" in contracts).toBe(true);
    expect("UNIT_SYSTEMS" in contracts).toBe(true);
    expect("PAGINATION" in contracts).toBe(true);
  });
});

// ============================================================================
// TYPE COHERENCE TESTS
// ============================================================================

describe("Type Coherence", () => {
  it("should keep legacy admin strategy exports aligned with their schemas", () => {
    assertTrainerSummaryContractMatchesSchema(true);
    assertCreatePhaseInputContractMatchesSchema(true);
    assertCreateGoalInputContractMatchesSchema(true);
    assertUpdateGoalInputContractMatchesSchema(true);
    assertCreateStrategyInputContractMatchesSchema(true);
    assertExerciseFilterParamsContractMatchesSchema(true);

    const trainerSummary: TrainerSummary = {
      id: "trainer_123",
      name: "Coach Hollis",
      role: contracts.USER_ROLE.TRAINER,
    };
    const phase: CreatePhaseInput = {
      name: "Foundation",
      order: 0,
      weekCount: 4,
      intensityRange: "60-70%",
      volumeLevel: contracts.VOLUME_LEVEL.MODERATE,
      focusAreas: ["mobility", "strength"],
      notes: "Build consistency first.",
      isActive: true,
      isCompleted: false,
    };
    const goal: CreateGoalInput = {
      goalMetric: "squat_1rm",
      goalTarget: 225,
      baselineValue: 185,
      weight: 0.5,
      linkedExerciseId: "exercise_456",
      dataSource: contracts.GOAL_DATA_SOURCE.BIOMETRIC,
      dataKey: "strength:squat_1rm",
      dynamicMetricDefinition: {
        dataSource: "biometric",
        dataKey: "strength:squat_1rm",
        label: "Squat 1RM",
        unit: "lb",
        direction: "increase",
        category: "strength",
      },
    };
    const updateGoal: UpdateGoalInput = {
      goalTarget: 235,
      baselineValue: 190,
      currentValue: 205,
      weight: 0.6,
      notes: "Ahead of schedule.",
    };
    const strategy: CreateStrategyInput = {
      name: "Spring Strength Block",
      type: contracts.STRATEGY_TYPE.BLOCK,
      goal: "Increase lower body strength",
      description: "Progressive overload with recovery guardrails.",
      startDate: "2026-03-12",
      endDate: "2026-04-30",
      status: contracts.STRATEGY_STATUS.ACTIVE,
      goals: [goal],
      phases: [phase],
    };
    const filters: ExerciseFilterParams = {
      search: "squat",
      category: "strength",
      muscleGroup: "legs",
      equipment: "barbell",
      difficulty: "intermediate",
      tag: "compound",
      limit: 25,
      offset: 0,
    };

    expect(trainerSummarySchema.safeParse(trainerSummary).success).toBe(true);
    expect(createPhaseInputSchema.safeParse(phase).success).toBe(true);
    expect(createGoalInputSchema.safeParse(goal).success).toBe(true);
    expect(updateGoalInputSchema.safeParse(updateGoal).success).toBe(true);
    expect(createStrategyInputSchema.safeParse(strategy).success).toBe(true);
    expect(exerciseFilterParamsSchema.safeParse(filters).success).toBe(true);
  });

  it("should keep LabObservationInput aligned with labObservationInputSchema", () => {
    assertLabObservationInputContractMatchesSchema(true);

    const payload: LabObservationInput = {
      rawAnalyteName: "Hemoglobin A1c",
      rawValueText: "5.4",
      rawUnit: "%",
      rawReferenceIntervalText: "4.0-5.6",
      rawReferenceIntervalLow: 4,
      rawReferenceIntervalHigh: 5.6,
      rawFlag: null,
      observedAt: "2026-03-12",
      canonicalValue: 5.4,
      canonicalUnit: "%",
      labReferenceIntervalLow: 4,
      labReferenceIntervalHigh: 5.6,
      labReferenceIntervalText: "4.0-5.6",
      labFlag: null,
      metricDefinitionId: null,
      mappingStatus: contracts.LAB_MAPPING_STATUS.REVIEW_NEEDED,
      mappingConfidence: 0.98,
      notes: null,
      tags: ["glycemic"],
    };

    const result = labObservationInputSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("should keep admin lab request inputs aligned with their schemas", () => {
    assertLabMetricSearchParamsContractMatchesSchema(true);
    assertCreateLabMetricDefinitionInputContractMatchesSchema(true);
    assertExtractLabDataInputContractMatchesSchema(true);
    assertAttachObservationsInputContractMatchesSchema(true);
    assertCreateLabOrderInputContractMatchesSchema(true);

    const searchParams: LabMetricSearchParams = {
      q: "hemoglobin",
      limit: 25,
    };
    const createMetricInput: CreateLabMetricDefinitionInput = {
      name: "Hemoglobin A1c",
      code: "HBA1C",
      category: "metabolic",
      canonicalUnit: "%",
      directionality: "LOWER_IS_BETTER",
      variabilityThreshold: 0.15,
      aliases: ["A1C"],
      optimalRangeLow: 4,
      optimalRangeHigh: 5.6,
      description: "Glycemic control marker.",
      createdBy: "HH-ABC123",
    };
    const extractInput: ExtractLabDataInput = {
      fileBase64: "ZmFrZS1wZGY=",
      mimeType: "application/pdf",
    };
    const attachInput: AttachObservationsInput = {
      observations: [
        {
          rawAnalyteName: "Hemoglobin A1c",
          rawValueText: "5.4",
          rawUnit: "%",
          rawReferenceIntervalText: "4.0-5.6",
          rawReferenceIntervalLow: 4,
          rawReferenceIntervalHigh: 5.6,
          rawFlag: null,
          observedAt: "2026-03-12",
          canonicalValue: 5.4,
          canonicalUnit: "%",
          labReferenceIntervalLow: 4,
          labReferenceIntervalHigh: 5.6,
          labReferenceIntervalText: "4.0-5.6",
          labFlag: null,
          metricDefinitionId: null,
          mappingStatus: contracts.LAB_MAPPING_STATUS.REVIEW_NEEDED,
          mappingConfidence: 0.98,
          notes: null,
          tags: ["glycemic"],
        },
      ],
      actualReportDate: "2026-03-12",
      transitionToResultsPending: true,
      extractionConfidences: { reportDate: 0.98 },
      extractionFragments: { reportDate: "03/12/2026" },
    };
    const createOrderInput: CreateLabOrderInput = {
      reportDate: "2026-03-12",
      panelName: "Metabolic Panel",
      labName: "Hollis Diagnostics",
      labLocation: "Austin",
      orderingProvider: "Dr. Hollis",
      specimenType: "Blood",
      panelCode: "MP-01",
      notes: "Fasting panel",
      orderStatus: "RESULTS_PENDING",
    };

    expect(labMetricSearchParamsSchema.safeParse(searchParams).success).toBe(
      true,
    );
    expect(
      createLabMetricDefinitionInputSchema.safeParse(createMetricInput).success,
    ).toBe(true);
    expect(extractLabDataInputSchema.safeParse(extractInput).success).toBe(
      true,
    );
    expect(attachObservationsInputSchema.safeParse(attachInput).success).toBe(
      true,
    );
    expect(createLabOrderInputSchema.safeParse(createOrderInput).success).toBe(
      true,
    );
  });

  it("should keep LabMetricSearchResponse aligned with labMetricSearchResponseSchema", () => {
    assertLabMetricSearchResponseContractMatchesSchema(true);

    const payload: LabMetricSearchResponse = {
      results: [
        {
          id: "metric_1",
          code: "HBA1C",
          name: "Hemoglobin A1c",
          category: "metabolic",
          canonicalUnit: "%",
          directionality: "LOWER_IS_BETTER",
          isCanonical: true,
          approvalStatus: "APPROVED",
        },
      ],
    };

    const result = labMetricSearchResponseSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("should keep PendingMetricsResponse aligned with pendingMetricsResponseSchema", () => {
    assertPendingMetricsResponseContractMatchesSchema(true);

    const payload: PendingMetricsResponse = {
      data: [
        {
          id: "review_1",
          code: "HBA1C",
          name: "Hemoglobin A1c",
          category: "metabolic",
          canonicalUnit: "%",
          directionality: "LOWER_IS_BETTER",
          aliases: ["A1C"],
          approvalStatus: "PENDING",
          isCanonical: false,
          createdBy: "admin_1",
          createdAt: "2026-03-12T00:00:00.000Z",
          observationCount: 3,
          suggestedMergeTargets: [
            {
              id: "metric_approved_1",
              code: "HBA1C-STD",
              name: "Hemoglobin A1c Standard",
              similarity: 0.94,
            },
          ],
        },
      ],
      pagination: {
        page: 1,
        limit: 50,
        total: 1,
        totalPages: 1,
        hasMore: false,
      },
    };

    const result = pendingMetricsResponseSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("should keep WorkoutGenerationProgress aligned with workoutGenerationProgressSchema", () => {
    assertWorkoutGenerationProgressContractMatchesSchema(true);

    const payload: WorkoutGenerationProgress = {
      step: 2,
      totalSteps: 5,
      phase: "Building workout block",
      detail: "Selecting exercises and sequencing sets.",
      turn: 1,
      maxTurns: 4,
      activities: [
        {
          timestamp: "2026-03-12T00:00:00.000Z",
          type: "plan",
          message: "Drafted initial structure.",
          data: { focus: "strength" },
        },
      ],
      stats: {
        exercisesSearched: 12,
        exercisesSelected: 6,
        notesCreated: 2,
      },
    };

    const result = workoutGenerationProgressSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("should keep LabDataExtractionResultWithGovernance aligned with its schema", () => {
    assertLabDataExtractionResultWithGovernanceContractMatchesSchema(true);

    const payload: LabDataExtractionResultWithGovernance = {
      report: {
        reportDate: "2026-03-12",
        labName: "Hollis Diagnostics",
        panelName: "Metabolic Panel",
      },
      observations: [
        {
          rawAnalyteName: "Hemoglobin A1c",
          rawValueText: "5.4",
          rawUnit: "%",
          rawReferenceIntervalText: "4.0-5.6",
          rawReferenceIntervalLow: 4,
          rawReferenceIntervalHigh: 5.6,
          mappingStatus: contracts.LAB_MAPPING_STATUS.REVIEW_NEEDED,
          mappingConfidence: 0.95,
        },
      ],
      suggestedNewMetrics: [
        {
          suggestedCode: "FASTING_INSULIN",
          suggestedName: "Fasting Insulin",
          suggestedCategory: "metabolic",
          suggestedAliases: ["Insulin, Fasting"],
          canonicalUnit: "uIU/mL",
          directionality: "LOWER_IS_BETTER",
          description: "Fasting insulin for metabolic health review.",
          confidence: 0.88,
          reasoning: "Common metabolic marker not found in current catalog.",
          rawAnalyteName: "Insulin",
          isPopulationVariant: false,
        },
      ],
      selfReviewSummary: {
        iterationsPerformed: 2,
        duplicatesDetected: 0,
        garbageFlagged: 0,
        verifiedCreations: 1,
      },
    };

    const result =
      labDataExtractionResultWithGovernanceSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("should keep LabOrderDetailResponse aligned with LabOrderDetailResponseSchema", () => {
    assertLabOrderDetailResponseContractMatchesSchema(true);

    const payload: LabOrderDetailResponse = {
      id: "order_1",
      userId: "HH-ABC123",
      reportDate: "2026-03-12T00:00:00.000Z",
      labName: "Hollis Diagnostics",
      labLocation: "Austin",
      specimenType: "Blood",
      orderingProvider: "Dr. Hollis",
      panelName: "Metabolic Panel",
      panelCode: "MP-01",
      notes: null,
      orderStatus: "RESULTS_PENDING",
      observations: [
        {
          id: "obs_1",
          rawAnalyteName: "Hemoglobin A1c",
          rawValueText: "5.4",
          rawUnit: "%",
          rawReferenceIntervalLow: 4,
          rawReferenceIntervalHigh: 5.6,
          rawFlag: null,
          canonicalValue: 5.4,
          canonicalUnit: "%",
          metricDefinitionId: null,
          mappingStatus: contracts.LAB_MAPPING_STATUS.MATCHED,
          mappingConfidence: 0.99,
        },
      ],
    };

    const result = LabOrderDetailResponseSchema.safeParse(payload);

    expect(result.success).toBe(true);
  });

  it("should have matching tuple and schema for USER_ROLES", () => {
    // Ensure the tuple and schema are coherent
    const tupleValues = contracts.USER_ROLES;
    tupleValues.forEach((role) => {
      const result = contracts.UserRoleSchema.safeParse(role);
      expect(result.success).toBe(true);
    });
  });

  it("should have matching tuple and schema for APPOINTMENT_STATUSES", () => {
    const tupleValues = contracts.APPOINTMENT_STATUSES;
    tupleValues.forEach((status) => {
      const result = contracts.AppointmentStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
    });
  });

  it("should have matching tuple and schema for STRATEGY_STATUSES", () => {
    const tupleValues = contracts.STRATEGY_STATUSES;
    tupleValues.forEach((status) => {
      const result = contracts.StrategyStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
    });
  });

  it("should have labels for all USER_ROLES", () => {
    const roles = contracts.USER_ROLES;
    roles.forEach((role) => {
      expect(contracts.USER_ROLE_LABELS[role]).toBeDefined();
      expect(typeof contracts.USER_ROLE_LABELS[role]).toBe("string");
    });
  });

  it("should have labels for all APPOINTMENT_STATUSES", () => {
    const statuses = contracts.APPOINTMENT_STATUSES;
    statuses.forEach((status) => {
      expect(contracts.APPOINTMENT_STATUS_LABELS[status]).toBeDefined();
      expect(typeof contracts.APPOINTMENT_STATUS_LABELS[status]).toBe("string");
    });
  });

  it("should have labels for all STRATEGY_STATUSES", () => {
    const statuses = contracts.STRATEGY_STATUSES;
    statuses.forEach((status) => {
      expect(contracts.STRATEGY_STATUS_LABELS[status]).toBeDefined();
      expect(typeof contracts.STRATEGY_STATUS_LABELS[status]).toBe("string");
    });
  });

  it("should have labels for all APPOINTMENT_TYPES", () => {
    const types = contracts.APPOINTMENT_TYPES;
    types.forEach((type) => {
      expect(contracts.APPOINTMENT_TYPE_LABELS[type]).toBeDefined();
      expect(typeof contracts.APPOINTMENT_TYPE_LABELS[type]).toBe("string");
    });
  });

  it("should have matching tuple and schema for LAB_RESULT_STATUSES", () => {
    const tupleValues = contracts.LAB_RESULT_STATUSES;
    tupleValues.forEach((status) => {
      const result = contracts.LabResultStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
    });
  });

  it("should have labels for all LAB_RESULT_STATUSES", () => {
    const statuses = contracts.LAB_RESULT_STATUSES;
    statuses.forEach((status) => {
      expect(contracts.LAB_RESULT_STATUS_LABELS[status]).toBeDefined();
      expect(typeof contracts.LAB_RESULT_STATUS_LABELS[status]).toBe("string");
    });
  });

  it("should have matching tuple and schema for LAB_RESULT_FLAGS", () => {
    const tupleValues = contracts.LAB_RESULT_FLAGS;
    tupleValues.forEach((flag) => {
      const result = contracts.LabResultFlagSchema.safeParse(flag);
      expect(result.success).toBe(true);
    });
  });

  it("should have labels for all LAB_RESULT_FLAGS", () => {
    const flags = contracts.LAB_RESULT_FLAGS;
    flags.forEach((flag) => {
      expect(contracts.LAB_RESULT_FLAG_LABELS[flag]).toBeDefined();
      expect(typeof contracts.LAB_RESULT_FLAG_LABELS[flag]).toBe("string");
    });
  });

  it("should have matching tuple and schema for REGISTRATION_STATUSES", () => {
    const tupleValues = contracts.REGISTRATION_STATUSES;
    tupleValues.forEach((status) => {
      const result = contracts.RegistrationStatusSchema.safeParse(status);
      expect(result.success).toBe(true);
    });
  });

  it("should have labels for all REGISTRATION_STATUSES", () => {
    const statuses = contracts.REGISTRATION_STATUSES;
    statuses.forEach((status) => {
      expect(contracts.REGISTRATION_STATUS_LABELS[status]).toBeDefined();
      expect(typeof contracts.REGISTRATION_STATUS_LABELS[status]).toBe(
        "string",
      );
    });
  });
});
