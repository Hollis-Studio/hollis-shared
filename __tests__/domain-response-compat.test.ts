import {
    appointmentsListResponseSchema,
    biometricListResponseSchema,
    createMockDailyMetrics,
    dailyMetricsListResponseSchema,
    normalizeGoalDataSource,
} from "../domain";

describe("Domain response contracts — canonical paginated shape", () => {
  const now = new Date().toISOString();

  const biometric = {
    id: "bio-1",
    userId: "user-1",
    date: "2026-01-01",
    key: "weight",
    metricDefinitionId: "metric-weight",
    value: 80,
    unit: "kg",
    source: "USER_LOG",
    isVerified: false,
    createdAt: now,
    updatedAt: now,
  } as const;

  const appointment = {
    id: "appt-1",
    patientId: "user-1",
    providerId: "provider-1",
    title: "Follow-up",
    startTime: now,
    endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    status: "SCHEDULED",
    type: "CONSULTATION",
    duration: 30,
    createdAt: now,
    updatedAt: now,
  } as const;

  it("accepts canonical paginated biometric list payload", () => {
    expect(
      biometricListResponseSchema.safeParse({
        data: [biometric],
        pagination: { offset: 0, limit: 50, total: 1 },
      }).success,
    ).toBe(true);
  });

  it("rejects raw array biometric payload (unions removed)", () => {
    expect(biometricListResponseSchema.safeParse([biometric]).success).toBe(
      false,
    );
  });

  it("accepts canonical paginated daily metrics payload", () => {
    const dailyMetric = createMockDailyMetrics({ userId: "user-1" });

    expect(
      dailyMetricsListResponseSchema.safeParse({
        data: [dailyMetric],
        pagination: { offset: 0, limit: 50, total: 1 },
      }).success,
    ).toBe(true);
  });

  it("rejects raw array daily metrics payload (unions removed)", () => {
    const dailyMetric = createMockDailyMetrics({ userId: "user-1" });

    expect(
      dailyMetricsListResponseSchema.safeParse([dailyMetric]).success,
    ).toBe(false);
  });

  it("accepts canonical paginated appointments payload", () => {
    expect(
      appointmentsListResponseSchema.safeParse({
        data: [appointment],
        pagination: { offset: 0, limit: 50, total: 1 },
      }).success,
    ).toBe(true);
  });

  it("rejects legacy-object and raw array appointment payloads (unions removed)", () => {
    expect(
      appointmentsListResponseSchema.safeParse({
        appointments: [appointment],
        total: 1,
        limit: 50,
        offset: 0,
      }).success,
    ).toBe(false);

    expect(
      appointmentsListResponseSchema.safeParse([appointment]).success,
    ).toBe(false);
  });

  it("normalizes legacy training dataSource values", () => {
    expect(normalizeGoalDataSource("measurement")).toBe("biometric");
    expect(normalizeGoalDataSource("exercise_log")).toBe("exercise_log");
  });
});
