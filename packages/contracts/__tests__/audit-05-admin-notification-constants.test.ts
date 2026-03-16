import * as LegacyAdminNotificationContracts from "../admin/notifications";
import * as CanonicalAdminNotificationContracts from "../domain/admin-notifications";

describe("audit-05 admin notification constants", () => {
  it("keeps the legacy admin notifications path as an exact re-export of the canonical domain contract", () => {
    expect(
      LegacyAdminNotificationContracts.ADMIN_REALTIME_NOTIFICATION_KINDS,
    ).toBe(
      CanonicalAdminNotificationContracts.ADMIN_REALTIME_NOTIFICATION_KINDS,
    );
    expect(
      LegacyAdminNotificationContracts.ADMIN_REALTIME_NOTIFICATION_KIND,
    ).toBe(
      CanonicalAdminNotificationContracts.ADMIN_REALTIME_NOTIFICATION_KIND,
    );
    expect(
      LegacyAdminNotificationContracts.adminRealtimeNotificationKindSchema,
    ).toBe(
      CanonicalAdminNotificationContracts.adminRealtimeNotificationKindSchema,
    );
    expect(
      LegacyAdminNotificationContracts.adminRealtimeNotificationEventDataSchema,
    ).toBe(
      CanonicalAdminNotificationContracts.adminRealtimeNotificationEventDataSchema,
    );
  });

  it("preserves canonical values and validation semantics across both import paths", () => {
    const validPayload = {
      kind: CanonicalAdminNotificationContracts.ADMIN_REALTIME_NOTIFICATION_KIND
        .LAB_REVIEW_NEEDED,
      actorUserId: "user-123",
      patientId: "patient-456",
      appointmentId: "appointment-789",
      reportId: "report-101",
    };

    expect(
      CanonicalAdminNotificationContracts.ADMIN_REALTIME_NOTIFICATION_KINDS,
    ).toEqual([
      "appointment-booked",
      "appointment-cancelled",
      "appointment-modified",
      "patient-assigned",
      "lab-review-needed",
      "new-registration",
    ]);

    expect(
      LegacyAdminNotificationContracts.adminRealtimeNotificationEventDataSchema.safeParse(
        validPayload,
      ).success,
    ).toBe(true);
    expect(
      CanonicalAdminNotificationContracts.adminRealtimeNotificationEventDataSchema.safeParse(
        validPayload,
      ).success,
    ).toBe(true);

    expect(
      LegacyAdminNotificationContracts.adminRealtimeNotificationKindSchema.safeParse(
        "not-a-real-kind",
      ).success,
    ).toBe(false);
    expect(
      CanonicalAdminNotificationContracts.adminRealtimeNotificationKindSchema.safeParse(
        "not-a-real-kind",
      ).success,
    ).toBe(false);
  });
});
