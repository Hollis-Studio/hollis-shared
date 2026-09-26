/**
 * @ai-context Workouts PUT /v1/profile body (alpha.91, hollis-workouts#130, #238)
 *
 * `email` is server-owned: the Workouts server takes it from the verified access-token
 * claim, so the PUT body no longer declares it (older clients that send it still parse; the
 * key is stripped). `pushInstallationId` scopes push-token moves to one app install.
 */

import {
  WorkoutsUserProfilePutBodySchema,
  WorkoutsUserProfileSchema,
} from '../domain/workouts-user-profile';

const settings = {
  defaultWeightUnit: 'kg',
  defaultWeightMode: 'absolute',
  defaultDistanceUnit: 'km',
  progressionIncrementKg: 2.5,
  repIncrement: 1,
  goEasierPercent: 0.1,
  defaultRestTimerSec: 120,
  theme: 'clay_dark',
  appleHealthConnected: false,
  repThresholdForWeightJump: 12,
  cardioProgressionFocus: 'duration',
  notificationsEnabled: true,
  dailySummaryTime: '20:00',
  weeklySummaryDay: 0,
  workoutReminderEnabled: false,
  workoutReminderTime: '09:00',
};

const body = {
  displayName: 'Isaac',
  createdAt: '2026-01-01T00:00:00.000Z',
  settings,
};

const installationId = '0b8f3c1e-6d2a-4f5b-9c7e-1a2b3c4d5e6f';

describe('WorkoutsUserProfilePutBodySchema', () => {
  it('strips a client-sent email', () => {
    const parsed = WorkoutsUserProfilePutBodySchema.parse({ ...body, email: 'old@example.com' });
    expect(parsed).not.toHaveProperty('email');
  });

  it('keeps email on the GET response schema', () => {
    const parsed = WorkoutsUserProfileSchema.parse({ ...body, uid: 'user_1', email: 'isaac@example.com' });
    expect(parsed.email).toBe('isaac@example.com');
  });

  it('accepts pushInstallationId alongside fcmDeviceToken', () => {
    const parsed = WorkoutsUserProfilePutBodySchema.parse({
      ...body,
      fcmDeviceToken: 'fcm-token',
      pushInstallationId: installationId,
    });
    expect(parsed.pushInstallationId).toBe(installationId);
    expect(parsed.fcmDeviceToken).toBe('fcm-token');
  });

  it('accepts a null or absent pushInstallationId', () => {
    expect(WorkoutsUserProfilePutBodySchema.parse({ ...body, pushInstallationId: null }).pushInstallationId).toBeNull();
    expect(WorkoutsUserProfilePutBodySchema.parse(body).pushInstallationId).toBeUndefined();
  });

  it('rejects a non-UUID pushInstallationId', () => {
    expect(WorkoutsUserProfilePutBodySchema.safeParse({ ...body, pushInstallationId: 'device-1' }).success).toBe(false);
  });

  it('does not add pushInstallationId to the response schema', () => {
    const parsed = WorkoutsUserProfileSchema.parse({ ...body, uid: 'user_1', pushInstallationId: installationId });
    expect(parsed).not.toHaveProperty('pushInstallationId');
  });
});
