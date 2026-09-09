import {
  CoachingAdminMemberBookingCreateSchema,
  CoachingAvailabilityOverrideCreateSchema,
  CoachingMemberBookingCreateSchema,
  CoachingPlanAssignmentRequestSchema,
  CoachingSlotQuerySchema,
  CoachingSchedulingConfigurationUpdateSchema,
} from "../domain/coaching.js";

const startTime = "2026-09-10T18:00:00.000Z";
const membershipId = "7b395a52-f468-4c69-b986-bf3be18e0e73";

describe("coaching Health identifiers", () => {
  it("accepts a canonical Health barcode provider throughout scheduling", () => {
    const providerId = "HH-9P4PRF";
    expect(CoachingSlotQuerySchema.safeParse({ providerId, from: startTime, to: "2026-09-10T19:00:00.000Z" }).success).toBe(true);
    expect(CoachingMemberBookingCreateSchema.safeParse({ providerId, startTime }).success).toBe(true);
    expect(CoachingAdminMemberBookingCreateSchema.safeParse({ membershipId, providerId, startTime }).success).toBe(true);
    expect(CoachingAvailabilityOverrideCreateSchema.safeParse({ providerId, startsAt: startTime, endsAt: "2026-09-10T19:00:00.000Z", available: false }).success).toBe(true);
  });

  it("preserves UUID compatibility for legacy provider records only", () => {
    const providerId = "cbd8e603-97b4-4c12-b94c-ab6ad265bd50";
    expect(CoachingAdminMemberBookingCreateSchema.safeParse({ membershipId, providerId, startTime }).success).toBe(true);
    expect(CoachingMemberBookingCreateSchema.safeParse({ providerId: membershipId, startTime }).success).toBe(true);
  });

  it("only accepts HTTPS meeting URLs and permits an explicit clear", () => {
    expect(CoachingSchedulingConfigurationUpdateSchema.shape.videoMeetingUrl.safeParse("https://meet.hollis.health/call").success).toBe(true);
    expect(CoachingSchedulingConfigurationUpdateSchema.shape.videoMeetingUrl.safeParse(null).success).toBe(true);
    expect(CoachingSchedulingConfigurationUpdateSchema.shape.videoMeetingUrl.safeParse("http://meet.hollis.health/call").success).toBe(false);
  });

  it("keeps membership and Health actor identifiers distinct", () => {
    expect(CoachingAdminMemberBookingCreateSchema.safeParse({ membershipId: "HH-9P4PRF", providerId: "HH-9P4PRF", startTime }).success).toBe(false);
    expect(CoachingPlanAssignmentRequestSchema.shape.assignedByUserId.safeParse("HH-9P4PRF").success).toBe(true);
    expect(CoachingPlanAssignmentRequestSchema.shape.assignedByUserId.safeParse("cbd8e603-97b4-4c12-b94c-ab6ad265bd50").success).toBe(false);
  });
});
