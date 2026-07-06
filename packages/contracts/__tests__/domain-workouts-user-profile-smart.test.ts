/**
 * @ai-context Workouts user profile — smart notification settings (alpha.43)
 *
 * Pins the notificationSettings.smart declaration. Before alpha.43 the key was
 * undeclared, so z.object()'s default strip silently discarded every smart
 * notification channel preference on BOTH the Workouts server's PUT /profile
 * parse and the app's client-side UserSettingsSchema parse — the feature was
 * non-persistent end to end (found in the 2026-07-05 Workouts notification
 * audit). These tests fail if the key is ever dropped or renamed again.
 */

import {
  UserSettingsSchema,
  WorkoutsUserProfilePutBodySchema,
} from '../domain/workouts-user-profile';

const smartSettings = {
  enabled: true,
  preLift: { enabled: true, hourLocal: 8 },
  restDayPulse: { enabled: false, hourLocal: 10 },
  postWorkoutRecap: { enabled: true },
  missedSlot: { enabled: false, hourLocal: 20 },
  weeklyReview: { enabled: true, hourLocal: 18 },
};

const baseSettings = {
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
  notificationSettings: {
    masterEnabled: true,
    workoutReminder: { enabled: true, reminderTime: '09:00' },
    restDayPulse: { enabled: false },
    smart: smartSettings,
  },
};

describe('notificationSettings.smart round-trip', () => {
  it('survives UserSettingsSchema parsing intact', () => {
    const parsed = UserSettingsSchema.parse(baseSettings);
    expect(parsed.notificationSettings?.smart).toEqual(smartSettings);
  });

  it('survives the PUT /profile body parse intact', () => {
    const body = {
      displayName: 'Isaac',
      createdAt: '2026-01-01T00:00:00.000Z',
      settings: baseSettings,
    };
    const parsed = WorkoutsUserProfilePutBodySchema.parse(body);
    expect(parsed.settings.notificationSettings?.smart).toEqual(smartSettings);
  });

  it('remains optional — profiles without smart still parse', () => {
    const parsed = UserSettingsSchema.parse({
      ...baseSettings,
      notificationSettings: {
        masterEnabled: false,
        workoutReminder: { enabled: false, reminderTime: '09:00' },
        restDayPulse: { enabled: false },
      },
    });
    expect(parsed.notificationSettings?.smart).toBeUndefined();
    expect(parsed.notificationSettings?.masterEnabled).toBe(false);
  });

  it('rejects out-of-range channel hours', () => {
    const result = UserSettingsSchema.safeParse({
      ...baseSettings,
      notificationSettings: {
        ...baseSettings.notificationSettings,
        smart: { ...smartSettings, preLift: { enabled: true, hourLocal: 24 } },
      },
    });
    expect(result.success).toBe(false);
  });
});
