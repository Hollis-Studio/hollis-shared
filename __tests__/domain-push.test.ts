/**
 * @ai-context Tests for push notification domain contracts
 *
 * Tests validation schemas, type guards, and constants for push notifications.
 * Ensures contract drift is caught early.
 */

import { describe, expect, it } from "@jest/globals";
import {
  ADMIN_NOTIFICATION_TYPES,
  CLIENT_NOTIFICATION_TYPES,
  isNotificationType,
  isPushAppRole,
  isPushPlatform,
  NOTIFICATION_TYPE,
  NOTIFICATION_TYPES,
  NotificationTypeSchema,
  PUSH_APP_ROLE,
  PUSH_APP_ROLES,
  PUSH_PLATFORM,
  PUSH_PLATFORMS,
  PushAppRoleSchema,
  PushPlatformSchema,
  registerDevicePushTokenRequestSchema,
  sendTestNotificationRequestSchema,
  unregisterDevicePushTokenRequestSchema,
} from "../domain/push";

describe("Push Platform Contracts", () => {
  describe("Constants", () => {
    it("should have correct platform constants", () => {
      expect(PUSH_PLATFORMS).toEqual(["IOS", "ANDROID"]);
      expect(PUSH_PLATFORM.IOS).toBe("IOS");
      expect(PUSH_PLATFORM.ANDROID).toBe("ANDROID");
    });

    it("should have correct app role constants", () => {
      expect(PUSH_APP_ROLES).toEqual(["CLIENT", "ADMIN"]);
      expect(PUSH_APP_ROLE.CLIENT).toBe("CLIENT");
      expect(PUSH_APP_ROLE.ADMIN).toBe("ADMIN");
    });

    it("should have all notification type constants", () => {
      expect(NOTIFICATION_TYPES).toContain("NEW_WORKOUT_PLAN");
      expect(NOTIFICATION_TYPES).toContain("NEW_NUTRITION_PLAN");
      expect(NOTIFICATION_TYPES).toContain("NEW_MESSAGE");
      expect(NOTIFICATION_TYPES).toContain("APPOINTMENT_REMINDER");
      expect(NOTIFICATION_TYPES).toContain("APPOINTMENT_UPDATE");
      expect(NOTIFICATION_TYPES).toContain("LAB_RESULTS_READY");
      expect(NOTIFICATION_TYPES).toContain("PLAN_UPDATE");
      expect(NOTIFICATION_TYPES).toContain("ADMIN_APPOINTMENT_BOOKED");
      expect(NOTIFICATION_TYPES).toContain("ADMIN_APPOINTMENT_CANCELLED");
      expect(NOTIFICATION_TYPES).toContain("ADMIN_APPOINTMENT_MODIFIED");
      expect(NOTIFICATION_TYPES).toContain("ADMIN_PATIENT_ASSIGNED");
      expect(NOTIFICATION_TYPES).toContain("ADMIN_NEW_REGISTRATION");
      expect(NOTIFICATION_TYPES).toHaveLength(12);
    });

    it("should derive NOTIFICATION_TYPES from client and admin tuples", () => {
      expect(NOTIFICATION_TYPES).toEqual([
        ...CLIENT_NOTIFICATION_TYPES,
        ...ADMIN_NOTIFICATION_TYPES,
      ]);
    });

    it("should have notification type constants matching enum", () => {
      expect(NOTIFICATION_TYPE.NEW_WORKOUT_PLAN).toBe("NEW_WORKOUT_PLAN");
      expect(NOTIFICATION_TYPE.NEW_NUTRITION_PLAN).toBe("NEW_NUTRITION_PLAN");
      expect(NOTIFICATION_TYPE.NEW_MESSAGE).toBe("NEW_MESSAGE");
      expect(NOTIFICATION_TYPE.APPOINTMENT_REMINDER).toBe(
        "APPOINTMENT_REMINDER",
      );
      expect(NOTIFICATION_TYPE.APPOINTMENT_UPDATE).toBe("APPOINTMENT_UPDATE");
      expect(NOTIFICATION_TYPE.LAB_RESULTS_READY).toBe("LAB_RESULTS_READY");
      expect(NOTIFICATION_TYPE.PLAN_UPDATE).toBe("PLAN_UPDATE");
      expect(NOTIFICATION_TYPE.ADMIN_APPOINTMENT_BOOKED).toBe(
        "ADMIN_APPOINTMENT_BOOKED",
      );
      expect(NOTIFICATION_TYPE.ADMIN_APPOINTMENT_CANCELLED).toBe(
        "ADMIN_APPOINTMENT_CANCELLED",
      );
      expect(NOTIFICATION_TYPE.ADMIN_APPOINTMENT_MODIFIED).toBe(
        "ADMIN_APPOINTMENT_MODIFIED",
      );
      expect(NOTIFICATION_TYPE.ADMIN_PATIENT_ASSIGNED).toBe(
        "ADMIN_PATIENT_ASSIGNED",
      );
      expect(NOTIFICATION_TYPE.ADMIN_NEW_REGISTRATION).toBe(
        "ADMIN_NEW_REGISTRATION",
      );
    });
  });

  describe("Type Guards", () => {
    it("isPushPlatform should validate platform strings", () => {
      expect(isPushPlatform("IOS")).toBe(true);
      expect(isPushPlatform("ANDROID")).toBe(true);
      expect(isPushPlatform("invalid")).toBe(false);
      expect(isPushPlatform("ios")).toBe(false); // case-sensitive
    });

    it("isPushAppRole should validate app role strings", () => {
      expect(isPushAppRole("CLIENT")).toBe(true);
      expect(isPushAppRole("ADMIN")).toBe(true);
      expect(isPushAppRole("invalid")).toBe(false);
      expect(isPushAppRole("client")).toBe(false); // case-sensitive
    });

    it("isNotificationType should validate notification type strings", () => {
      expect(isNotificationType("NEW_WORKOUT_PLAN")).toBe(true);
      expect(isNotificationType("ADMIN_APPOINTMENT_BOOKED")).toBe(true);
      expect(isNotificationType("invalid")).toBe(false);
      expect(isNotificationType("new_workout_plan")).toBe(false); // case-sensitive
    });
  });

  describe("Zod Schemas", () => {
    describe("PushPlatformSchema", () => {
      it("should accept valid platforms", () => {
        expect(PushPlatformSchema.parse("IOS")).toBe("IOS");
        expect(PushPlatformSchema.parse("ANDROID")).toBe("ANDROID");
      });

      it("should reject invalid platforms", () => {
        expect(() => PushPlatformSchema.parse("invalid")).toThrow();
        expect(() => PushPlatformSchema.parse("ios")).toThrow();
      });
    });

    describe("PushAppRoleSchema", () => {
      it("should accept valid app roles", () => {
        expect(PushAppRoleSchema.parse("CLIENT")).toBe("CLIENT");
        expect(PushAppRoleSchema.parse("ADMIN")).toBe("ADMIN");
      });

      it("should reject invalid app roles", () => {
        expect(() => PushAppRoleSchema.parse("invalid")).toThrow();
        expect(() => PushAppRoleSchema.parse("client")).toThrow();
      });
    });

    describe("NotificationTypeSchema", () => {
      it("should accept all valid notification types", () => {
        NOTIFICATION_TYPES.forEach((type) => {
          expect(NotificationTypeSchema.parse(type)).toBe(type);
        });
      });

      it("should reject invalid notification types", () => {
        expect(() => NotificationTypeSchema.parse("invalid")).toThrow();
        expect(() =>
          NotificationTypeSchema.parse("NEW_INVALID_PLAN"),
        ).toThrow();
      });
    });

    describe("registerDevicePushTokenRequestSchema", () => {
      it("should validate a complete registration request", () => {
        const valid = {
          platform: "IOS" as const,
          devicePushToken: "valid-token-123456",
          deviceId: "123e4567-e89b-12d3-a456-426614174000",
          appRole: "CLIENT" as const,
        };
        expect(registerDevicePushTokenRequestSchema.parse(valid)).toEqual(
          valid,
        );
      });

      it("should accept minimal registration request", () => {
        const minimal = {
          platform: "ANDROID" as const,
          devicePushToken: "valid-token-123456",
        };
        expect(registerDevicePushTokenRequestSchema.parse(minimal)).toEqual(
          minimal,
        );
      });

      it("should reject missing required fields", () => {
        expect(() => registerDevicePushTokenRequestSchema.parse({})).toThrow();
        expect(() =>
          registerDevicePushTokenRequestSchema.parse({ platform: "IOS" }),
        ).toThrow();
      });

      it("should reject invalid token length", () => {
        expect(() =>
          registerDevicePushTokenRequestSchema.parse({
            platform: "IOS",
            devicePushToken: "short",
          }),
        ).toThrow();
      });

      it("should reject invalid deviceId format", () => {
        expect(() =>
          registerDevicePushTokenRequestSchema.parse({
            platform: "IOS",
            devicePushToken: "valid-token-123456",
            deviceId: "not-a-uuid",
          }),
        ).toThrow();
      });
    });

    describe("unregisterDevicePushTokenRequestSchema", () => {
      it("should validate a complete unregistration request", () => {
        const valid = {
          platform: "IOS" as const,
          devicePushToken: "valid-token-123456",
          deviceId: "123e4567-e89b-12d3-a456-426614174000",
          appRole: "CLIENT" as const,
        };
        expect(unregisterDevicePushTokenRequestSchema.parse(valid)).toEqual(
          valid,
        );
      });

      it("should accept minimal unregistration request", () => {
        const minimal = {
          platform: "ANDROID" as const,
          devicePushToken: "valid-token-123456",
        };
        expect(unregisterDevicePushTokenRequestSchema.parse(minimal)).toEqual(
          minimal,
        );
      });
    });

    describe("sendTestNotificationRequestSchema", () => {
      it("should accept valid notification type", () => {
        const valid = { type: "NEW_WORKOUT_PLAN" as const };
        expect(sendTestNotificationRequestSchema.parse(valid)).toEqual(valid);
      });

      it("should accept missing type (optional)", () => {
        const empty = {};
        expect(sendTestNotificationRequestSchema.parse(empty)).toEqual(empty);
      });

      it("should reject invalid notification type", () => {
        expect(() =>
          sendTestNotificationRequestSchema.parse({ type: "INVALID" }),
        ).toThrow();
      });

      it("should accept all notification types", () => {
        NOTIFICATION_TYPES.forEach((type) => {
          const request = { type };
          expect(sendTestNotificationRequestSchema.parse(request)).toEqual(
            request,
          );
        });
      });
    });
  });

  describe("Contract Completeness", () => {
    it("should have all client notification types in constants", () => {
      const clientTypes = [
        "NEW_WORKOUT_PLAN",
        "NEW_NUTRITION_PLAN",
        "NEW_MESSAGE",
        "APPOINTMENT_REMINDER",
        "APPOINTMENT_UPDATE",
        "LAB_RESULTS_READY",
        "PLAN_UPDATE",
      ];
      clientTypes.forEach((type) => {
        expect(NOTIFICATION_TYPES).toContain(type);
      });
    });

    it("should have all admin notification types in constants", () => {
      const adminTypes = [
        "ADMIN_APPOINTMENT_BOOKED",
        "ADMIN_APPOINTMENT_CANCELLED",
        "ADMIN_APPOINTMENT_MODIFIED",
        "ADMIN_PATIENT_ASSIGNED",
        "ADMIN_NEW_REGISTRATION",
      ];
      adminTypes.forEach((type) => {
        expect(NOTIFICATION_TYPES).toContain(type);
      });
    });
  });
});
