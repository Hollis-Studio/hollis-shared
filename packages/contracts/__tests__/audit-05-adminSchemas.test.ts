import {
    MessageParticipantSchema as WebAdminMessageParticipantSchema,
    SendMessageRequestSchema as WebAdminSendMessageRequestSchema,
} from "../domain/messages";
import {
    adminTaskSchema,
    clientIntakePayloadSchema,
    createGoalInputSchema,
    fetchValueRequestSchema,
} from "../admin/admin-schemas";
import {
    ADMIN_TASK_PRIORITY,
    ADMIN_TASK_STATUS,
    ADMIN_TASK_TYPE,
} from "../domain/admin-tasks";
import {
    INJURY_RECOVERY_STATUS,
    LIMITATION_SEVERITY,
    MEDICAL_CONDITION_STATUS,
} from "../domain/clinical";
import {
    MessageParticipantSchema as CanonicalMessageParticipantSchema,
    SendMessageRequestSchema as CanonicalSendMessageRequestSchema,
} from "../domain/messages";
import {
    DynamicMetricGoalDataSourceSchema,
    GOAL_DATA_SOURCE,
    StrategyGoalSchema,
} from "../domain/training";
import { MESSAGE_RECIPIENT_ROLE, USER_ROLE } from "../domain/user";
import { FULFILLMENT_STATUS } from "../stripe/order";
import { SUBSCRIPTION_STATUS } from "../stripe/subscription";

describe("audit-05 admin schemas", () => {
  it("reuses the canonical send-message schema in web-admin validation", () => {
    expect(WebAdminSendMessageRequestSchema).toBe(
      CanonicalSendMessageRequestSchema,
    );

    expect(
      WebAdminSendMessageRequestSchema.safeParse({
        recipientRole: MESSAGE_RECIPIENT_ROLE.CLINICIAN,
        content: "Follow-up message",
      }).success,
    ).toBe(true);

    expect(
      WebAdminSendMessageRequestSchema.safeParse({
        recipientRole: "ADMIN",
        content: "Follow-up message",
      }).success,
    ).toBe(false);
  });

  it("reuses the canonical message participant schema and rejects legacy participant roles", () => {
    expect(WebAdminMessageParticipantSchema).toBe(
      CanonicalMessageParticipantSchema,
    );

    expect(
      WebAdminMessageParticipantSchema.safeParse({
        id: "user-1",
        email: "clinician@hollis.app",
        role: USER_ROLE.CLINICIAN,
        firstName: "Casey",
        lastName: "Care",
      }).success,
    ).toBe(true);

    expect(
      WebAdminMessageParticipantSchema.safeParse({
        id: "user-1",
        email: "legacy@hollis.app",
        role: "patient",
      }).success,
    ).toBe(false);
  });

  it("validates structured intake clinical payloads with canonical clinical schemas", () => {
    expect(
      clientIntakePayloadSchema.safeParse({
        goals: "Improve recovery",
        experienceLevel: "intermediate",
        limitationsData: [
          {
            id: "lim-1",
            description: "Limit overhead work",
            severity: LIMITATION_SEVERITY.MODERATE,
          },
        ],
        injuriesData: [
          {
            id: "inj-1",
            description: "Shoulder strain",
            occurredAt: "2026-03-12",
            severity: LIMITATION_SEVERITY.MILD,
            recoveryStatus: INJURY_RECOVERY_STATUS.RECOVERING,
          },
        ],
        medicalConditionsData: [
          {
            id: "mc-1",
            name: "Hypertension",
            status: MEDICAL_CONDITION_STATUS.MANAGED,
            diagnosisDate: "2026-03-12",
          },
        ],
      }).success,
    ).toBe(true);

    expect(
      clientIntakePayloadSchema.safeParse({
        goals: "Improve recovery",
        experienceLevel: "intermediate",
        injuriesData: [
          {
            id: "inj-1",
            description: "Shoulder strain",
            occurredAt: "not-an-iso-date",
          },
        ],
      }).success,
    ).toBe(false);

    expect(
      clientIntakePayloadSchema.safeParse({
        goals: "Improve recovery",
        experienceLevel: "intermediate",
        medicalConditionsData: [
          {
            id: "mc-1",
            name: "Hypertension",
            status: MEDICAL_CONDITION_STATUS.MANAGED,
            diagnosisDate: "not-an-iso-date",
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("requires canonical admin task, subscription, and fulfillment statuses", () => {
    expect(
      adminTaskSchema.safeParse({
        id: "task-1",
        taskType: ADMIN_TASK_TYPE.MANUAL_REVIEW,
        title: "Review order",
        priority: ADMIN_TASK_PRIORITY.HIGH,
        status: ADMIN_TASK_STATUS.PENDING,
        createdAt: "2026-03-12T00:00:00.000Z",
        updatedAt: "2026-03-12T00:00:00.000Z",
        subscription: {
          id: "sub-1",
          tier: "CORE",
          status: SUBSCRIPTION_STATUS.ACTIVE,
        },
        order: {
          id: "order-1",
          totalInCents: 129900,
          fulfillmentStatus: FULFILLMENT_STATUS.PROCESSING,
        },
      }).success,
    ).toBe(true);

    expect(
      adminTaskSchema.safeParse({
        id: "task-1",
        taskType: ADMIN_TASK_TYPE.MANUAL_REVIEW,
        title: "Review order",
        priority: ADMIN_TASK_PRIORITY.HIGH,
        status: "pending",
        createdAt: "2026-03-12T00:00:00.000Z",
        updatedAt: "2026-03-12T00:00:00.000Z",
      }).success,
    ).toBe(false);

    expect(
      adminTaskSchema.safeParse({
        id: "task-1",
        taskType: ADMIN_TASK_TYPE.MANUAL_REVIEW,
        title: "Review order",
        priority: ADMIN_TASK_PRIORITY.HIGH,
        status: ADMIN_TASK_STATUS.PENDING,
        createdAt: "2026-03-12T00:00:00.000Z",
        updatedAt: "2026-03-12T00:00:00.000Z",
        subscription: {
          id: "sub-1",
          tier: "CORE",
          status: "active",
        },
      }).success,
    ).toBe(false);

    expect(
      adminTaskSchema.safeParse({
        id: "task-1",
        taskType: ADMIN_TASK_TYPE.MANUAL_REVIEW,
        title: "Review order",
        priority: ADMIN_TASK_PRIORITY.HIGH,
        status: ADMIN_TASK_STATUS.PENDING,
        createdAt: "2026-03-12T00:00:00.000Z",
        updatedAt: "2026-03-12T00:00:00.000Z",
        order: {
          id: "order-1",
          totalInCents: 129900,
          fulfillmentStatus: "processing",
        },
      }).success,
    ).toBe(false);
  });

  it("accepts canonical create-goal dataSource values unchanged", () => {
    const result = createGoalInputSchema.safeParse({
      goalMetric: "resting-heart-rate",
      goalTarget: 55,
      dataSource: GOAL_DATA_SOURCE.MANUAL,
      dataKey: "restingHeartRate",
    });

    expect(result.success).toBe(true);
    expect(result.data?.dataSource).toBe(GOAL_DATA_SOURCE.MANUAL);
  });

  it("normalizes legacy create-goal dataSource values for backward compatibility", () => {
    const result = createGoalInputSchema.safeParse({
      goalMetric: "resting-heart-rate",
      goalTarget: 55,
      dataSource: "measurement",
      dataKey: "restingHeartRate",
    });

    expect(result.success).toBe(true);
    expect(result.data?.dataSource).toBe(GOAL_DATA_SOURCE.BIOMETRIC);
  });

  it("rejects unknown create-goal dataSource values", () => {
    expect(
      createGoalInputSchema.safeParse({
        goalMetric: "resting-heart-rate",
        goalTarget: 55,
        dataSource: "wearable_stream",
        dataKey: "restingHeartRate",
      }).success,
    ).toBe(false);
  });

  it("reuses the canonical dynamic metric goal data-source subset in admin and deprecated training schemas", () => {
    expect(
      DynamicMetricGoalDataSourceSchema.safeParse(GOAL_DATA_SOURCE.BIOMETRIC)
        .success,
    ).toBe(true);
    expect(
      DynamicMetricGoalDataSourceSchema.safeParse(GOAL_DATA_SOURCE.MANUAL)
        .success,
    ).toBe(false);

    expect(
      createGoalInputSchema.safeParse({
        goalMetric: "fasting-glucose",
        goalTarget: 90,
        dynamicMetricDefinition: {
          dataSource: GOAL_DATA_SOURCE.LAB,
          dataKey: "glucose",
          label: "Fasting Glucose",
          unit: "mg/dL",
          direction: "lower_better",
          category: "metabolic",
        },
      }).success,
    ).toBe(true);

    expect(
      StrategyGoalSchema.safeParse({
        id: "00000000-0000-0000-0000-000000000001",
        strategyId: "00000000-0000-0000-0000-000000000002",
        goalMetric: "fasting-glucose",
        goalTarget: 90,
        dynamicMetricDefinition: {
          dataSource: GOAL_DATA_SOURCE.MANUAL,
          dataKey: "glucose",
          label: "Fasting Glucose",
          unit: "mg/dL",
          direction: "lower_better",
          category: "metabolic",
        },
        createdAt: "2026-03-12T00:00:00.000Z",
        updatedAt: "2026-03-12T00:00:00.000Z",
      }).success,
    ).toBe(false);
  });

  it("accepts canonical fetch-value dataSource values unchanged", () => {
    const result = fetchValueRequestSchema.safeParse({
      dataSource: GOAL_DATA_SOURCE.EXERCISE_LOG,
      dataKey: "volume-load",
      linkedExerciseId: "exercise-123",
    });

    expect(result.success).toBe(true);
    expect(result.data?.dataSource).toBe(GOAL_DATA_SOURCE.EXERCISE_LOG);
  });

  it("normalizes legacy fetch-value dataSource values for backward compatibility", () => {
    const result = fetchValueRequestSchema.safeParse({
      dataSource: "measurement",
      dataKey: "fastingGlucose",
    });

    expect(result.success).toBe(true);
    expect(result.data?.dataSource).toBe(GOAL_DATA_SOURCE.BIOMETRIC);
  });

  it("rejects unknown fetch-value dataSource values", () => {
    expect(
      fetchValueRequestSchema.safeParse({
        dataSource: "wearable_stream",
        dataKey: "restingHeartRate",
      }).success,
    ).toBe(false);
  });
});
