/**
 * @ai-context Workouts user profile | WorkoutsUserProfileSchema, UserSettingsSchema,
 * UserEntitlementsSchema. Named Workouts* to avoid shadowing UserProfileSchema in
 * domain/user.ts (the Health-app clinical identity schema with email/role/tier/biologicalSex).
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
export declare const UserEntitlementsSchema: z.ZodObject<{
    aiTier: z.ZodOptional<z.ZodEnum<{
        paid: "paid";
        free: "free";
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        local: "local";
        provider: "provider";
        suite: "suite";
    }>>;
    subscriptionStatus: z.ZodOptional<z.ZodEnum<{
        active: "active";
        none: "none";
        expired: "expired";
        grace_period: "grace_period";
        revoked: "revoked";
    }>>;
    subscriptionProvider: z.ZodOptional<z.ZodString>;
    productId: z.ZodOptional<z.ZodString>;
    originalTransactionId: z.ZodOptional<z.ZodString>;
    suiteEntitlementId: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    lastValidatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$loose>;
export type UserEntitlements = z.infer<typeof UserEntitlementsSchema>;
export declare const UserSettingsSchema: z.ZodObject<{
    defaultWeightUnit: z.ZodEnum<{
        kg: "kg";
        lbs: "lbs";
    }>;
    defaultWeightMode: z.ZodEnum<{
        absolute: "absolute";
        relative: "relative";
    }>;
    defaultDistanceUnit: z.ZodEnum<{
        km: "km";
        mi: "mi";
    }>;
    defaultWeightIncrementKg: z.ZodOptional<z.ZodNumber>;
    workoutExperienceLevel: z.ZodOptional<z.ZodEnum<{
        advanced: "advanced";
        beginner: "beginner";
        intermediate: "intermediate";
        new: "new";
    }>>;
    progressionIncrementKg: z.ZodNumber;
    repIncrement: z.ZodNumber;
    goEasierPercent: z.ZodNumber;
    defaultRestTimerSec: z.ZodNumber;
    theme: z.ZodString;
    languageTag: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodString>;
    appleHealthConnected: z.ZodBoolean;
    repThresholdForWeightJump: z.ZodNumber;
    cardioProgressionFocus: z.ZodEnum<{
        distance: "distance";
        duration: "duration";
        pace: "pace";
    }>;
    notificationsEnabled: z.ZodBoolean;
    dailySummaryTime: z.ZodString;
    weeklySummaryDay: z.ZodNumber;
    timeZone: z.ZodOptional<z.ZodString>;
    workoutReminderEnabled: z.ZodBoolean;
    workoutReminderTime: z.ZodString;
    hapticIntensity: z.ZodOptional<z.ZodEnum<{
        light: "light";
        medium: "medium";
        heavy: "heavy";
        off: "off";
    }>>;
    defaultRIR: z.ZodOptional<z.ZodNumber>;
    dailyNotificationTime: z.ZodOptional<z.ZodString>;
    volumeTargets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    trainingPhase: z.ZodOptional<z.ZodEnum<{
        maintain: "maintain";
        build: "build";
        cut: "cut";
    }>>;
    trainingPhaseStartedAt: z.ZodOptional<z.ZodNumber>;
    phaseEntryBaselines: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    adaptiveProgression: z.ZodOptional<z.ZodBoolean>;
    cardioGoalPreset: z.ZodOptional<z.ZodEnum<{
        none: "none";
        general: "general";
        endurance: "endurance";
        weight_loss: "weight_loss";
        threshold: "threshold";
    }>>;
    cardioWeeklyTargets: z.ZodOptional<z.ZodObject<{
        z1Min: z.ZodNumber;
        z2Min: z.ZodNumber;
        z3Min: z.ZodNumber;
        z4Min: z.ZodNumber;
    }, z.core.$strip>>;
    dateOfBirth: z.ZodOptional<z.ZodNumber>;
    maxHRBpm: z.ZodOptional<z.ZodNumber>;
    hrZoneOverrides: z.ZodOptional<z.ZodObject<{
        z1: z.ZodOptional<z.ZodObject<{
            minBpm: z.ZodNumber;
            maxBpm: z.ZodNumber;
        }, z.core.$strip>>;
        z2: z.ZodOptional<z.ZodObject<{
            minBpm: z.ZodNumber;
            maxBpm: z.ZodNumber;
        }, z.core.$strip>>;
        z3: z.ZodOptional<z.ZodObject<{
            minBpm: z.ZodNumber;
            maxBpm: z.ZodNumber;
        }, z.core.$strip>>;
        z4: z.ZodOptional<z.ZodObject<{
            minBpm: z.ZodNumber;
            maxBpm: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    sundayReview: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodBoolean;
        dayOfWeek: z.ZodNumber;
        hourLocal: z.ZodNumber;
        pushEnabled: z.ZodBoolean;
        timeZone: z.ZodString;
    }, z.core.$strip>>;
    notificationSettings: z.ZodOptional<z.ZodObject<{
        masterEnabled: z.ZodBoolean;
        workoutReminder: z.ZodObject<{
            enabled: z.ZodBoolean;
            reminderTime: z.ZodString;
            minutesBefore: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
        restDayPulse: z.ZodObject<{
            enabled: z.ZodBoolean;
        }, z.core.$strip>;
        smart: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            preLift: z.ZodObject<{
                enabled: z.ZodBoolean;
                hourLocal: z.ZodNumber;
            }, z.core.$strip>;
            restDayPulse: z.ZodObject<{
                enabled: z.ZodBoolean;
                hourLocal: z.ZodNumber;
            }, z.core.$strip>;
            postWorkoutRecap: z.ZodObject<{
                enabled: z.ZodBoolean;
            }, z.core.$strip>;
            missedSlot: z.ZodObject<{
                enabled: z.ZodBoolean;
                hourLocal: z.ZodNumber;
            }, z.core.$strip>;
            weeklyReview: z.ZodObject<{
                enabled: z.ZodBoolean;
                hourLocal: z.ZodNumber;
            }, z.core.$strip>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    simpleModeEnabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;
export declare const WorkoutsUserProfileSchema: z.ZodObject<{
    uid: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    displayName: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    settings: z.ZodObject<{
        defaultWeightUnit: z.ZodEnum<{
            kg: "kg";
            lbs: "lbs";
        }>;
        defaultWeightMode: z.ZodEnum<{
            absolute: "absolute";
            relative: "relative";
        }>;
        defaultDistanceUnit: z.ZodEnum<{
            km: "km";
            mi: "mi";
        }>;
        defaultWeightIncrementKg: z.ZodOptional<z.ZodNumber>;
        workoutExperienceLevel: z.ZodOptional<z.ZodEnum<{
            advanced: "advanced";
            beginner: "beginner";
            intermediate: "intermediate";
            new: "new";
        }>>;
        progressionIncrementKg: z.ZodNumber;
        repIncrement: z.ZodNumber;
        goEasierPercent: z.ZodNumber;
        defaultRestTimerSec: z.ZodNumber;
        theme: z.ZodString;
        languageTag: z.ZodOptional<z.ZodString>;
        gender: z.ZodOptional<z.ZodString>;
        appleHealthConnected: z.ZodBoolean;
        repThresholdForWeightJump: z.ZodNumber;
        cardioProgressionFocus: z.ZodEnum<{
            distance: "distance";
            duration: "duration";
            pace: "pace";
        }>;
        notificationsEnabled: z.ZodBoolean;
        dailySummaryTime: z.ZodString;
        weeklySummaryDay: z.ZodNumber;
        timeZone: z.ZodOptional<z.ZodString>;
        workoutReminderEnabled: z.ZodBoolean;
        workoutReminderTime: z.ZodString;
        hapticIntensity: z.ZodOptional<z.ZodEnum<{
            light: "light";
            medium: "medium";
            heavy: "heavy";
            off: "off";
        }>>;
        defaultRIR: z.ZodOptional<z.ZodNumber>;
        dailyNotificationTime: z.ZodOptional<z.ZodString>;
        volumeTargets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        trainingPhase: z.ZodOptional<z.ZodEnum<{
            maintain: "maintain";
            build: "build";
            cut: "cut";
        }>>;
        trainingPhaseStartedAt: z.ZodOptional<z.ZodNumber>;
        phaseEntryBaselines: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        adaptiveProgression: z.ZodOptional<z.ZodBoolean>;
        cardioGoalPreset: z.ZodOptional<z.ZodEnum<{
            none: "none";
            general: "general";
            endurance: "endurance";
            weight_loss: "weight_loss";
            threshold: "threshold";
        }>>;
        cardioWeeklyTargets: z.ZodOptional<z.ZodObject<{
            z1Min: z.ZodNumber;
            z2Min: z.ZodNumber;
            z3Min: z.ZodNumber;
            z4Min: z.ZodNumber;
        }, z.core.$strip>>;
        dateOfBirth: z.ZodOptional<z.ZodNumber>;
        maxHRBpm: z.ZodOptional<z.ZodNumber>;
        hrZoneOverrides: z.ZodOptional<z.ZodObject<{
            z1: z.ZodOptional<z.ZodObject<{
                minBpm: z.ZodNumber;
                maxBpm: z.ZodNumber;
            }, z.core.$strip>>;
            z2: z.ZodOptional<z.ZodObject<{
                minBpm: z.ZodNumber;
                maxBpm: z.ZodNumber;
            }, z.core.$strip>>;
            z3: z.ZodOptional<z.ZodObject<{
                minBpm: z.ZodNumber;
                maxBpm: z.ZodNumber;
            }, z.core.$strip>>;
            z4: z.ZodOptional<z.ZodObject<{
                minBpm: z.ZodNumber;
                maxBpm: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        sundayReview: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            dayOfWeek: z.ZodNumber;
            hourLocal: z.ZodNumber;
            pushEnabled: z.ZodBoolean;
            timeZone: z.ZodString;
        }, z.core.$strip>>;
        notificationSettings: z.ZodOptional<z.ZodObject<{
            masterEnabled: z.ZodBoolean;
            workoutReminder: z.ZodObject<{
                enabled: z.ZodBoolean;
                reminderTime: z.ZodString;
                minutesBefore: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            restDayPulse: z.ZodObject<{
                enabled: z.ZodBoolean;
            }, z.core.$strip>;
            smart: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodBoolean;
                preLift: z.ZodObject<{
                    enabled: z.ZodBoolean;
                    hourLocal: z.ZodNumber;
                }, z.core.$strip>;
                restDayPulse: z.ZodObject<{
                    enabled: z.ZodBoolean;
                    hourLocal: z.ZodNumber;
                }, z.core.$strip>;
                postWorkoutRecap: z.ZodObject<{
                    enabled: z.ZodBoolean;
                }, z.core.$strip>;
                missedSlot: z.ZodObject<{
                    enabled: z.ZodBoolean;
                    hourLocal: z.ZodNumber;
                }, z.core.$strip>;
                weeklyReview: z.ZodObject<{
                    enabled: z.ZodBoolean;
                    hourLocal: z.ZodNumber;
                }, z.core.$strip>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        simpleModeEnabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$loose>;
    entitlements: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        aiTier: z.ZodOptional<z.ZodEnum<{
            paid: "paid";
            free: "free";
        }>>;
        source: z.ZodOptional<z.ZodEnum<{
            local: "local";
            provider: "provider";
            suite: "suite";
        }>>;
        subscriptionStatus: z.ZodOptional<z.ZodEnum<{
            active: "active";
            none: "none";
            expired: "expired";
            grace_period: "grace_period";
            revoked: "revoked";
        }>>;
        subscriptionProvider: z.ZodOptional<z.ZodString>;
        productId: z.ZodOptional<z.ZodString>;
        originalTransactionId: z.ZodOptional<z.ZodString>;
        suiteEntitlementId: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        lastValidatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$loose>>>;
    smartReaderFreeUsesRemaining: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lastReviewPromptAt: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    fcmDeviceToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastFcmTokenUpdate: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type WorkoutsUserProfile = z.infer<typeof WorkoutsUserProfileSchema>;
export declare const WorkoutsUserProfilePutBodySchema: z.ZodObject<{
    createdAt: z.ZodCoercedDate<unknown>;
    userId: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    displayName: z.ZodString;
    settings: z.ZodObject<{
        defaultWeightUnit: z.ZodEnum<{
            kg: "kg";
            lbs: "lbs";
        }>;
        defaultWeightMode: z.ZodEnum<{
            absolute: "absolute";
            relative: "relative";
        }>;
        defaultDistanceUnit: z.ZodEnum<{
            km: "km";
            mi: "mi";
        }>;
        defaultWeightIncrementKg: z.ZodOptional<z.ZodNumber>;
        workoutExperienceLevel: z.ZodOptional<z.ZodEnum<{
            advanced: "advanced";
            beginner: "beginner";
            intermediate: "intermediate";
            new: "new";
        }>>;
        progressionIncrementKg: z.ZodNumber;
        repIncrement: z.ZodNumber;
        goEasierPercent: z.ZodNumber;
        defaultRestTimerSec: z.ZodNumber;
        theme: z.ZodString;
        languageTag: z.ZodOptional<z.ZodString>;
        gender: z.ZodOptional<z.ZodString>;
        appleHealthConnected: z.ZodBoolean;
        repThresholdForWeightJump: z.ZodNumber;
        cardioProgressionFocus: z.ZodEnum<{
            distance: "distance";
            duration: "duration";
            pace: "pace";
        }>;
        notificationsEnabled: z.ZodBoolean;
        dailySummaryTime: z.ZodString;
        weeklySummaryDay: z.ZodNumber;
        timeZone: z.ZodOptional<z.ZodString>;
        workoutReminderEnabled: z.ZodBoolean;
        workoutReminderTime: z.ZodString;
        hapticIntensity: z.ZodOptional<z.ZodEnum<{
            light: "light";
            medium: "medium";
            heavy: "heavy";
            off: "off";
        }>>;
        defaultRIR: z.ZodOptional<z.ZodNumber>;
        dailyNotificationTime: z.ZodOptional<z.ZodString>;
        volumeTargets: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        trainingPhase: z.ZodOptional<z.ZodEnum<{
            maintain: "maintain";
            build: "build";
            cut: "cut";
        }>>;
        trainingPhaseStartedAt: z.ZodOptional<z.ZodNumber>;
        phaseEntryBaselines: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        adaptiveProgression: z.ZodOptional<z.ZodBoolean>;
        cardioGoalPreset: z.ZodOptional<z.ZodEnum<{
            none: "none";
            general: "general";
            endurance: "endurance";
            weight_loss: "weight_loss";
            threshold: "threshold";
        }>>;
        cardioWeeklyTargets: z.ZodOptional<z.ZodObject<{
            z1Min: z.ZodNumber;
            z2Min: z.ZodNumber;
            z3Min: z.ZodNumber;
            z4Min: z.ZodNumber;
        }, z.core.$strip>>;
        dateOfBirth: z.ZodOptional<z.ZodNumber>;
        maxHRBpm: z.ZodOptional<z.ZodNumber>;
        hrZoneOverrides: z.ZodOptional<z.ZodObject<{
            z1: z.ZodOptional<z.ZodObject<{
                minBpm: z.ZodNumber;
                maxBpm: z.ZodNumber;
            }, z.core.$strip>>;
            z2: z.ZodOptional<z.ZodObject<{
                minBpm: z.ZodNumber;
                maxBpm: z.ZodNumber;
            }, z.core.$strip>>;
            z3: z.ZodOptional<z.ZodObject<{
                minBpm: z.ZodNumber;
                maxBpm: z.ZodNumber;
            }, z.core.$strip>>;
            z4: z.ZodOptional<z.ZodObject<{
                minBpm: z.ZodNumber;
                maxBpm: z.ZodNumber;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        sundayReview: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            dayOfWeek: z.ZodNumber;
            hourLocal: z.ZodNumber;
            pushEnabled: z.ZodBoolean;
            timeZone: z.ZodString;
        }, z.core.$strip>>;
        notificationSettings: z.ZodOptional<z.ZodObject<{
            masterEnabled: z.ZodBoolean;
            workoutReminder: z.ZodObject<{
                enabled: z.ZodBoolean;
                reminderTime: z.ZodString;
                minutesBefore: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>;
            restDayPulse: z.ZodObject<{
                enabled: z.ZodBoolean;
            }, z.core.$strip>;
            smart: z.ZodOptional<z.ZodObject<{
                enabled: z.ZodBoolean;
                preLift: z.ZodObject<{
                    enabled: z.ZodBoolean;
                    hourLocal: z.ZodNumber;
                }, z.core.$strip>;
                restDayPulse: z.ZodObject<{
                    enabled: z.ZodBoolean;
                    hourLocal: z.ZodNumber;
                }, z.core.$strip>;
                postWorkoutRecap: z.ZodObject<{
                    enabled: z.ZodBoolean;
                }, z.core.$strip>;
                missedSlot: z.ZodObject<{
                    enabled: z.ZodBoolean;
                    hourLocal: z.ZodNumber;
                }, z.core.$strip>;
                weeklyReview: z.ZodObject<{
                    enabled: z.ZodBoolean;
                    hourLocal: z.ZodNumber;
                }, z.core.$strip>;
            }, z.core.$strip>>;
        }, z.core.$strip>>;
        simpleModeEnabled: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$loose>;
    entitlements: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        aiTier: z.ZodOptional<z.ZodEnum<{
            paid: "paid";
            free: "free";
        }>>;
        source: z.ZodOptional<z.ZodEnum<{
            local: "local";
            provider: "provider";
            suite: "suite";
        }>>;
        subscriptionStatus: z.ZodOptional<z.ZodEnum<{
            active: "active";
            none: "none";
            expired: "expired";
            grace_period: "grace_period";
            revoked: "revoked";
        }>>;
        subscriptionProvider: z.ZodOptional<z.ZodString>;
        productId: z.ZodOptional<z.ZodString>;
        originalTransactionId: z.ZodOptional<z.ZodString>;
        suiteEntitlementId: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        lastValidatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
        updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    }, z.core.$loose>>>;
    smartReaderFreeUsesRemaining: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lastReviewPromptAt: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    fcmDeviceToken: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    lastFcmTokenUpdate: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type WorkoutsUserProfilePutBody = z.infer<typeof WorkoutsUserProfilePutBodySchema>;
//# sourceMappingURL=workouts-user-profile.d.ts.map