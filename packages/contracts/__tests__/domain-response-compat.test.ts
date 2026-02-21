import {
    appointmentsListResponseSchema,
    biometricListResponseSchema,
    createMockDailyMetrics,
    dailyMetricsListResponseSchema,
    normalizeGoalDataSource,
} from "../domain";

describe("Domain response compatibility contracts", () => {
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
    createdAt: now,
    updatedAt: now,
  } as const;

  it("accepts canonical and legacy biometric list payloads", () => {
    expect(
      biometricListResponseSchema.safeParse({
        data: [biometric],
        pagination: { offset: 0, limit: 50, total: 1 },
      }).success,
    ).toBe(true);

    expect(biometricListResponseSchema.safeParse([biometric]).success).toBe(
      true,
    );
  });

  it("accepts canonical and legacy daily metrics payloads", () => {
    const dailyMetric = createMockDailyMetrics({ userId: "user-1" });

    expect(
      dailyMetricsListResponseSchema.safeParse({
        data: [dailyMetric],
        pagination: { offset: 0, limit: 50, total: 1 },
      }).success,
    ).toBe(true);

    expect(
      dailyMetricsListResponseSchema.safeParse([dailyMetric]).success,
    ).toBe(true);
  });

  it("accepts canonical, legacy-object, and legacy-array appointments payloads", () => {
    expect(
      appointmentsListResponseSchema.safeParse({
        data: [appointment],
        pagination: { offset: 0, limit: 50, total: 1 },
      }).success,
    ).toBe(true);

    expect(
      appointmentsListResponseSchema.safeParse({
        appointments: [appointment],
        total: 1,
        limit: 50,
        offset: 0,
      }).success,
    ).toBe(true);

    expect(
      appointmentsListResponseSchema.safeParse([appointment]).success,
    ).toBe(true);
  });

  it("normalizes legacy training dataSource values", () => {
    expect(normalizeGoalDataSource("measurement")).toBe("biometric");
    expect(normalizeGoalDataSource("exercise_log")).toBe("exercise_log");
  });
});
