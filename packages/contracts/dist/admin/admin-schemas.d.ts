/**
 * @ai-context Admin Zod Schemas | Validation schemas for admin operations
 *
 * This module provides Zod schemas for validating admin-related payloads.
 * Schemas match the types defined in admin-types.ts and can be used for:
 * - Client-side form validation
 * - Server-side request validation
 * - Type inference via z.infer
 *
 * deps: zod, domain types | consumers: web-admin/*, server/src/routes/admin/*
 */
import { z } from "zod";
/**
 * Admin compliance status schema.
 */
export declare const adminComplianceStatusSchema: z.ZodEnum<{
    excellent: "excellent";
    good: "good";
    "at-risk": "at-risk";
    "non-compliant": "non-compliant";
}>;
export type AdminComplianceStatus = z.infer<typeof adminComplianceStatusSchema>;
/**
 * Volume level schema for training phases.
 * @deprecated Use `VolumeLevelSchema` (PascalCase) from `../primitives/volume-level` directly.
 */
export declare const volumeLevelSchema: z.ZodEnum<{
    low: "low";
    moderate: "moderate";
    high: "high";
}>;
/**
 * Limitation severity schema.
 * @deprecated Use `LimitationSeveritySchema` (PascalCase) from `../domain/clinical` directly.
 */
export declare const limitationSeveritySchema: z.ZodEnum<{
    moderate: "moderate";
    mild: "mild";
    severe: "severe";
}>;
/**
 * Injury recovery status schema.
 * @deprecated Use `InjuryRecoveryStatusSchema` (PascalCase) from `../domain/clinical` directly.
 */
export declare const injuryRecoveryStatusSchema: z.ZodEnum<{
    active: "active";
    recovering: "recovering";
    healed: "healed";
    chronic: "chronic";
}>;
/**
 * Medical condition status schema.
 * @deprecated Use `MedicalConditionStatusSchema` (PascalCase) from `../domain/clinical` directly.
 */
export declare const medicalConditionStatusSchema: z.ZodEnum<{
    active: "active";
    managed: "managed";
    resolved: "resolved";
    monitoring: "monitoring";
}>;
/**
 * Patient summary schema.
 */
export declare const patientSummarySchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    status: z.ZodNullable<z.ZodEnum<{
        excellent: "excellent";
        good: "good";
        "at-risk": "at-risk";
        "non-compliant": "non-compliant";
    }>>;
    complianceScore: z.ZodNullable<z.ZodNumber>;
    lastLog: z.ZodNullable<z.ZodString>;
    accountStatus: z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        suspended: "suspended";
        archived: "archived";
    }>;
}, z.core.$strip>;
export type PatientSummary = z.infer<typeof patientSummarySchema>;
/**
 * Canonical paginated patient list response.
 * Shape: { data: PatientSummary[], pagination: PaginationMeta }
 */
export declare const patientListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        name: z.ZodString;
        tier: z.ZodEnum<{
            ESSENTIALS: "ESSENTIALS";
            CORE: "CORE";
            CONCIERGE: "CONCIERGE";
        }>;
        status: z.ZodNullable<z.ZodEnum<{
            excellent: "excellent";
            good: "good";
            "at-risk": "at-risk";
            "non-compliant": "non-compliant";
        }>>;
        complianceScore: z.ZodNullable<z.ZodNumber>;
        lastLog: z.ZodNullable<z.ZodString>;
        accountStatus: z.ZodEnum<{
            active: "active";
            inactive: "inactive";
            suspended: "suspended";
            archived: "archived";
        }>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type PatientListResponse = z.infer<typeof patientListResponseSchema>;
/**
 * Admin patient document summary schema used by patient detail responses.
 */
export declare const patientDocumentSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodString;
    url: z.ZodString;
    uploadedAt: z.ZodString;
}, z.core.$strip>;
export type PatientDocumentSummary = z.infer<typeof patientDocumentSummarySchema>;
/**
 * Admin patient membership summary schema used by patient detail responses.
 */
export declare const patientMembershipSummarySchema: z.ZodObject<{
    id: z.ZodString;
    tier: z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PatientMembershipSummary = z.infer<typeof patientMembershipSummarySchema>;
/**
 * Admin medication schema.
 */
export declare const adminMedicationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    dosage: z.ZodString;
    frequency: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdminMedication = z.infer<typeof adminMedicationSchema>;
/**
 * Admin limitation schema.
 */
export declare const adminLimitationSchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
    severity: z.ZodOptional<z.ZodEnum<{
        moderate: "moderate";
        mild: "mild";
        severe: "severe";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdminLimitation = z.infer<typeof adminLimitationSchema>;
/**
 * Admin injury schema.
 */
export declare const adminInjurySchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
    bodyPart: z.ZodOptional<z.ZodString>;
    occurredAt: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<{
        moderate: "moderate";
        mild: "mild";
        severe: "severe";
    }>>;
    recoveryStatus: z.ZodOptional<z.ZodEnum<{
        active: "active";
        recovering: "recovering";
        healed: "healed";
        chronic: "chronic";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdminInjury = z.infer<typeof adminInjurySchema>;
/**
 * Admin medical condition schema.
 */
export declare const adminMedicalConditionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    status: z.ZodEnum<{
        active: "active";
        managed: "managed";
        resolved: "resolved";
        monitoring: "monitoring";
    }>;
    diagnosisDate: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdminMedicalCondition = z.infer<typeof adminMedicalConditionSchema>;
/**
 * Patient profile update payload schema.
 */
export declare const patientProfileUpdatePayloadSchema: z.ZodObject<{
    fullName: z.ZodOptional<z.ZodString>;
    preferredName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
    biologicalSex: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        female: "female";
        male: "male";
        non_binary: "non_binary";
        intersex: "intersex";
        prefer_not_to_say: "prefer_not_to_say";
    }>>>;
    pregnancyStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        not_pregnant: "not_pregnant";
        trimester_1: "trimester_1";
        trimester_2: "trimester_2";
        trimester_3: "trimester_3";
        postpartum: "postpartum";
    }>>>;
    pregnancyDueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    occupation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bio: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    heightCm: z.ZodOptional<z.ZodNumber>;
    weightKg: z.ZodOptional<z.ZodNumber>;
    activityLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        sedentary: "sedentary";
        lightly_active: "lightly_active";
        moderately_active: "moderately_active";
        very_active: "very_active";
        athlete: "athlete";
    }>>>;
    experienceLevel: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        advanced: "advanced";
        beginner: "beginner";
        intermediate: "intermediate";
        expert: "expert";
    }>>>;
    primaryGoal: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        other: "other";
        lose_weight: "lose_weight";
        gain_muscle: "gain_muscle";
        maintain: "maintain";
        improve_health: "improve_health";
    }>>>;
    primaryGoalNote: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    medications: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        dosage: z.ZodString;
        frequency: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    limitations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            moderate: "moderate";
            mild: "mild";
            severe: "severe";
        }>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    injuries: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        bodyPart: z.ZodOptional<z.ZodString>;
        occurredAt: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<{
            moderate: "moderate";
            mild: "mild";
            severe: "severe";
        }>>;
        recoveryStatus: z.ZodOptional<z.ZodEnum<{
            active: "active";
            recovering: "recovering";
            healed: "healed";
            chronic: "chronic";
        }>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    medicalConditions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        status: z.ZodEnum<{
            active: "active";
            managed: "managed";
            resolved: "resolved";
            monitoring: "monitoring";
        }>;
        diagnosisDate: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type PatientProfileUpdatePayload = z.infer<typeof patientProfileUpdatePayloadSchema>;
/**
 * Patient goals update payload schema.
 */
export declare const patientGoalsUpdatePayloadSchema: z.ZodObject<{
    calorieTarget: z.ZodOptional<z.ZodNumber>;
    proteinTarget: z.ZodOptional<z.ZodNumber>;
    carbTarget: z.ZodOptional<z.ZodNumber>;
    fatTarget: z.ZodOptional<z.ZodNumber>;
    workoutsPerWeek: z.ZodOptional<z.ZodNumber>;
    sleepHoursTarget: z.ZodOptional<z.ZodNumber>;
    weeklyWeightChangeTarget: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type PatientGoalsUpdatePayload = z.infer<typeof patientGoalsUpdatePayloadSchema>;
/**
 * Patient admin controls payload schema.
 */
export declare const patientAdminControlsPayloadSchema: z.ZodObject<{
    tier: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>>;
    role: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>>>;
    assignedClinicianId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assignedTrainerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    accountStatus: z.ZodOptional<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        suspended: "suspended";
    }>>;
    timezone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type PatientAdminControlsPayload = z.infer<typeof patientAdminControlsPayloadSchema>;
/**
 * Clinician summary schema.
 */
export declare const clinicianSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>;
    specialty: z.ZodString;
}, z.core.$strip>;
export type ClinicianSummary = z.infer<typeof clinicianSummarySchema>;
/**
 * Availability slot schema.
 */
export declare const availabilitySlotSchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    startTime: z.ZodString;
    endTime: z.ZodString;
    isAvailable: z.ZodBoolean;
}, z.core.$strip>;
export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>;
/**
 * Clinician availability schema.
 */
export declare const clinicianAvailabilitySchema: z.ZodObject<{
    clinicianId: z.ZodString;
    slots: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        startTime: z.ZodString;
        endTime: z.ZodString;
        isAvailable: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ClinicianAvailability = z.infer<typeof clinicianAvailabilitySchema>;
/**
 * Provider schedule slot schema.
 */
export declare const providerScheduleSlotSchema: z.ZodObject<{
    dayOfWeek: z.ZodNumber;
    startHour: z.ZodNumber;
    endHour: z.ZodNumber;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ProviderScheduleSlot = z.infer<typeof providerScheduleSlotSchema>;
/**
 * Provider schedule data schema.
 */
export declare const providerScheduleDataSchema: z.ZodObject<{
    providerId: z.ZodString;
    slots: z.ZodArray<z.ZodObject<{
        dayOfWeek: z.ZodNumber;
        startHour: z.ZodNumber;
        endHour: z.ZodNumber;
        isAvailable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ProviderScheduleData = z.infer<typeof providerScheduleDataSchema>;
/**
 * Canonical max length for legacy registration prefill goal text.
 *
 * @deprecated Registration `primaryGoal` now uses `PrimaryGoalSchema` enum
 * validation instead of free-form text. This export remains for backward
 * compatibility with older consumers and generated artifacts.
 */
export declare const PREFILLED_PROFILE_PRIMARY_GOAL_MAX_LENGTH = 500;
/**
 * Prefilled profile schema.
 *
 * Key names MUST match the keys read by the signup route (auth.ts):
 * - `biologicalSex` (was `sex` — renamed for consistency with ClinicalProfile)
 * - `primaryGoal`   (was `goals` — renamed for consistency with ClinicalProfile)
 */
export declare const prefilledProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    heightCm: z.ZodOptional<z.ZodNumber>;
    weightKg: z.ZodOptional<z.ZodNumber>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
    biologicalSex: z.ZodOptional<z.ZodEnum<{
        female: "female";
        male: "male";
        non_binary: "non_binary";
        intersex: "intersex";
        prefer_not_to_say: "prefer_not_to_say";
    }>>;
    primaryGoal: z.ZodOptional<z.ZodEnum<{
        other: "other";
        lose_weight: "lose_weight";
        gain_muscle: "gain_muscle";
        maintain: "maintain";
        improve_health: "improve_health";
    }>>;
    primaryGoalNote: z.ZodOptional<z.ZodString>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    rejectedAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PrefilledProfile = z.infer<typeof prefilledProfileSchema>;
/**
 * Registered user schema.
 */
export declare const registeredUserSchema: z.ZodObject<{
    id: z.ZodString;
    barcode: z.ZodString;
    prefilledEmail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    prefilledTier: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>>;
    prefilledProfile: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        heightCm: z.ZodOptional<z.ZodNumber>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        dateOfBirth: z.ZodOptional<z.ZodString>;
        biologicalSex: z.ZodOptional<z.ZodEnum<{
            female: "female";
            male: "male";
            non_binary: "non_binary";
            intersex: "intersex";
            prefer_not_to_say: "prefer_not_to_say";
        }>>;
        primaryGoal: z.ZodOptional<z.ZodEnum<{
            other: "other";
            lose_weight: "lose_weight";
            gain_muscle: "gain_muscle";
            maintain: "maintain";
            improve_health: "improve_health";
        }>>;
        primaryGoalNote: z.ZodOptional<z.ZodString>;
        rejectionReason: z.ZodOptional<z.ZodString>;
        rejectedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    isRegistered: z.ZodBoolean;
    registrationExpiresAt: z.ZodString;
    createdAt: z.ZodString;
    status: z.ZodEnum<{
        rejected: "rejected";
        pending: "pending";
        claimed: "claimed";
        expired: "expired";
    }>;
    billingStatus: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    registeredBy: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type RegisteredUser = z.infer<typeof registeredUserSchema>;
/**
 * Create registration payload schema.
 */
export declare const createRegistrationPayloadSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    tier: z.ZodOptional<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    profile: z.ZodOptional<z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        heightCm: z.ZodOptional<z.ZodNumber>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        dateOfBirth: z.ZodOptional<z.ZodString>;
        biologicalSex: z.ZodOptional<z.ZodEnum<{
            female: "female";
            male: "male";
            non_binary: "non_binary";
            intersex: "intersex";
            prefer_not_to_say: "prefer_not_to_say";
        }>>;
        primaryGoal: z.ZodOptional<z.ZodEnum<{
            other: "other";
            lose_weight: "lose_weight";
            gain_muscle: "gain_muscle";
            maintain: "maintain";
            improve_health: "improve_health";
        }>>;
        primaryGoalNote: z.ZodOptional<z.ZodString>;
        rejectionReason: z.ZodOptional<z.ZodString>;
        rejectedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    expiresInDays: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CreateRegistrationPayload = z.infer<typeof createRegistrationPayloadSchema>;
/**
 * Create phase input schema.
 */
export declare const createPhaseInputSchema: z.ZodObject<{
    name: z.ZodString;
    order: z.ZodNumber;
    weekCount: z.ZodNumber;
    intensityRange: z.ZodOptional<z.ZodString>;
    volumeLevel: z.ZodOptional<z.ZodEnum<{
        low: "low";
        moderate: "moderate";
        high: "high";
    }>>;
    focusAreas: z.ZodArray<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    isActive: z.ZodBoolean;
    isCompleted: z.ZodBoolean;
}, z.core.$strip>;
export type CreatePhaseInputFromSchema = z.infer<typeof createPhaseInputSchema>;
/**
 * Create goal input schema.
 */
export declare const createGoalInputSchema: z.ZodObject<{
    goalMetric: z.ZodString;
    goalTarget: z.ZodNumber;
    baselineValue: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    linkedExerciseId: z.ZodOptional<z.ZodString>;
    dataSource: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodEnum<{
        manual: "manual";
        biometric: "biometric";
        lab: "lab";
        exercise_log: "exercise_log";
    }>, z.ZodEnum<{
        manual: "manual";
        biometric: "biometric";
        lab: "lab";
        exercise_log: "exercise_log";
        measurement: "measurement";
    }>]>, z.ZodTransform<"manual" | "biometric" | "lab" | "exercise_log", "manual" | "biometric" | "lab" | "exercise_log" | "measurement">>>;
    dataKey: z.ZodOptional<z.ZodString>;
    dynamicMetricDefinition: z.ZodOptional<z.ZodObject<{
        dataSource: z.ZodEnum<{
            manual: "manual";
            biometric: "biometric";
            lab: "lab";
            exercise_log: "exercise_log";
        }>;
        dataKey: z.ZodString;
        label: z.ZodString;
        unit: z.ZodString;
        direction: z.ZodString;
        category: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateGoalInputFromSchema = z.infer<typeof createGoalInputSchema>;
/**
 * Update goal input schema.
 */
export declare const updateGoalInputSchema: z.ZodObject<{
    goalTarget: z.ZodOptional<z.ZodNumber>;
    baselineValue: z.ZodOptional<z.ZodNumber>;
    currentValue: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateGoalInputFromSchema = z.infer<typeof updateGoalInputSchema>;
/**
 * Create strategy input schema.
 */
export declare const createStrategyInputSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        CUSTOM: "CUSTOM";
        LINEAR_PROGRESSION: "LINEAR_PROGRESSION";
        UNDULATING: "UNDULATING";
        BLOCK: "BLOCK";
        MESOCYCLE: "MESOCYCLE";
        DELOAD: "DELOAD";
    }>;
    goal: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    startDate: z.ZodString;
    endDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        CANCELLED: "CANCELLED";
        ACTIVE: "ACTIVE";
        PAUSED: "PAUSED";
    }>>;
    goals: z.ZodArray<z.ZodObject<{
        goalMetric: z.ZodString;
        goalTarget: z.ZodNumber;
        baselineValue: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        linkedExerciseId: z.ZodOptional<z.ZodString>;
        dataSource: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodEnum<{
            manual: "manual";
            biometric: "biometric";
            lab: "lab";
            exercise_log: "exercise_log";
        }>, z.ZodEnum<{
            manual: "manual";
            biometric: "biometric";
            lab: "lab";
            exercise_log: "exercise_log";
            measurement: "measurement";
        }>]>, z.ZodTransform<"manual" | "biometric" | "lab" | "exercise_log", "manual" | "biometric" | "lab" | "exercise_log" | "measurement">>>;
        dataKey: z.ZodOptional<z.ZodString>;
        dynamicMetricDefinition: z.ZodOptional<z.ZodObject<{
            dataSource: z.ZodEnum<{
                manual: "manual";
                biometric: "biometric";
                lab: "lab";
                exercise_log: "exercise_log";
            }>;
            dataKey: z.ZodString;
            label: z.ZodString;
            unit: z.ZodString;
            direction: z.ZodString;
            category: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    phases: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        order: z.ZodNumber;
        weekCount: z.ZodNumber;
        intensityRange: z.ZodOptional<z.ZodString>;
        volumeLevel: z.ZodOptional<z.ZodEnum<{
            low: "low";
            moderate: "moderate";
            high: "high";
        }>>;
        focusAreas: z.ZodArray<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
        isActive: z.ZodBoolean;
        isCompleted: z.ZodBoolean;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateStrategyInputFromSchema = z.infer<typeof createStrategyInputSchema>;
/**
 * Fetch value request schema.
 */
export declare const fetchValueRequestSchema: z.ZodObject<{
    dataSource: z.ZodPipe<z.ZodUnion<readonly [z.ZodEnum<{
        manual: "manual";
        biometric: "biometric";
        lab: "lab";
        exercise_log: "exercise_log";
    }>, z.ZodEnum<{
        manual: "manual";
        biometric: "biometric";
        lab: "lab";
        exercise_log: "exercise_log";
        measurement: "measurement";
    }>]>, z.ZodTransform<"manual" | "biometric" | "lab" | "exercise_log", "manual" | "biometric" | "lab" | "exercise_log" | "measurement">>;
    dataKey: z.ZodString;
    linkedExerciseId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FetchValueRequest = z.infer<typeof fetchValueRequestSchema>;
/**
 * Fetch value response schema.
 */
export declare const fetchValueResponseSchema: z.ZodObject<{
    found: z.ZodBoolean;
    value: z.ZodNullable<z.ZodNumber>;
    date: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type FetchValueResponse = z.infer<typeof fetchValueResponseSchema>;
/**
 * Smart Assist agent activity entry schema.
 */
export declare const smartAssistActivitySchema: z.ZodObject<{
    timestamp: z.ZodString;
    type: z.ZodEnum<{
        search: "search";
        complete: "complete";
        note: "note";
        plan: "plan";
        create: "create";
        select: "select";
        thinking: "thinking";
        analyze: "analyze";
    }>;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type SmartAssistActivity = z.infer<typeof smartAssistActivitySchema>;
/**
 * Smart Assist progress schema with real-time agent activity.
 */
export declare const smartAssistProgressSchema: z.ZodObject<{
    step: z.ZodNumber;
    totalSteps: z.ZodNumber;
    phase: z.ZodString;
    detail: z.ZodOptional<z.ZodString>;
    turn: z.ZodOptional<z.ZodNumber>;
    maxTurns: z.ZodOptional<z.ZodNumber>;
    activities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        type: z.ZodEnum<{
            search: "search";
            complete: "complete";
            note: "note";
            plan: "plan";
            create: "create";
            select: "select";
            thinking: "thinking";
            analyze: "analyze";
        }>;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    stats: z.ZodOptional<z.ZodObject<{
        exercisesSearched: z.ZodOptional<z.ZodNumber>;
        exercisesCreated: z.ZodOptional<z.ZodNumber>;
        exercisesSelected: z.ZodOptional<z.ZodNumber>;
        notesCreated: z.ZodOptional<z.ZodNumber>;
        goalsIdentified: z.ZodOptional<z.ZodNumber>;
        phasesCreated: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SmartAssistProgress = z.infer<typeof smartAssistProgressSchema>;
/**
 * Response schema for GET /api/admin/patients/:userId/ai-context.
 *
 * The admin endpoint returns the plan-generation context assembled by
 * aiPlanContextService, not the smaller Smart Assist notes context from
 * domain/ai-notes.ts.
 */
export declare const adminAIPlanContextSchema: z.ZodObject<{
    userId: z.ZodString;
    weekStartDate: z.ZodString;
    previousWorkoutPlans: z.ZodArray<z.ZodObject<{}, z.core.$loose>>;
    recentSessionNotes: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodString;
        userId: z.ZodString;
        workoutPlanId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        workoutDate: z.ZodString;
        content: z.ZodString;
    }, z.core.$strip>>;
    permanentNotes: z.ZodArray<z.ZodObject<{
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        id: z.ZodString;
        userId: z.ZodString;
        content: z.ZodString;
        category: z.ZodEnum<{
            OTHER: "OTHER";
            INJURY: "INJURY";
            PREFERENCE: "PREFERENCE";
            LIMITATION: "LIMITATION";
            MEDICAL: "MEDICAL";
            GOAL: "GOAL";
        }>;
        source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sourceType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            AI_GENERATED: "AI_GENERATED";
            COACH_OBSERVATION: "COACH_OBSERVATION";
            INTAKE_SEEDED: "INTAKE_SEEDED";
            CLINICIAN_VERIFIED: "CLINICIAN_VERIFIED";
        }>>>;
    }, z.core.$strip>>;
    clinicalNotes: z.ZodArray<z.ZodObject<{}, z.core.$loose>>;
    compliance: z.ZodObject<{
        workoutCompletionRate: z.ZodNumber;
        nutritionLoggingAdherence: z.ZodNumber;
        checkinsCount: z.ZodNumber;
        workoutsCompleted: z.ZodNumber;
        foodLogsCount: z.ZodNumber;
        periodWeeks: z.ZodNumber;
    }, z.core.$loose>;
    recentLabResults: z.ZodArray<z.ZodObject<{}, z.core.$loose>>;
    verifiedBiometricTrends: z.ZodArray<z.ZodObject<{}, z.core.$loose>>;
    tdeeWeight: z.ZodObject<{}, z.core.$loose>;
    userProfile: z.ZodObject<{}, z.core.$loose>;
    activeStrategy: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    exercisePRs: z.ZodArray<z.ZodObject<{}, z.core.$loose>>;
    recentExercises: z.ZodArray<z.ZodObject<{}, z.core.$loose>>;
    detailedWorkoutHistory: z.ZodArray<z.ZodObject<{}, z.core.$loose>>;
    exerciseLibrary: z.ZodObject<{}, z.core.$loose>;
    weeklyNutritionAverages: z.ZodArray<z.ZodObject<{}, z.core.$loose>>;
    generatedAt: z.ZodString;
}, z.core.$loose>;
export type AdminAIPlanContext = z.infer<typeof adminAIPlanContextSchema>;
/** @deprecated Use smartAssistActivitySchema instead */
export declare const workoutGenerationActivitySchema: z.ZodObject<{
    timestamp: z.ZodString;
    type: z.ZodEnum<{
        search: "search";
        complete: "complete";
        note: "note";
        plan: "plan";
        create: "create";
        select: "select";
        thinking: "thinking";
        analyze: "analyze";
    }>;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/** @deprecated Use smartAssistProgressSchema instead */
export declare const workoutGenerationProgressSchema: z.ZodObject<{
    step: z.ZodNumber;
    totalSteps: z.ZodNumber;
    phase: z.ZodString;
    detail: z.ZodOptional<z.ZodString>;
    turn: z.ZodOptional<z.ZodNumber>;
    maxTurns: z.ZodOptional<z.ZodNumber>;
    activities: z.ZodOptional<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        type: z.ZodEnum<{
            search: "search";
            complete: "complete";
            note: "note";
            plan: "plan";
            create: "create";
            select: "select";
            thinking: "thinking";
            analyze: "analyze";
        }>;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>>;
    stats: z.ZodOptional<z.ZodObject<{
        exercisesSearched: z.ZodOptional<z.ZodNumber>;
        exercisesCreated: z.ZodOptional<z.ZodNumber>;
        exercisesSelected: z.ZodOptional<z.ZodNumber>;
        notesCreated: z.ZodOptional<z.ZodNumber>;
        goalsIdentified: z.ZodOptional<z.ZodNumber>;
        phasesCreated: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Workout plan generation params schema (excludes AbortSignal and callback).
 */
export declare const workoutPlanGenerationParamsSchema: z.ZodObject<{
    userId: z.ZodString;
    weekStartDate: z.ZodString;
    customPrompt: z.ZodOptional<z.ZodString>;
    overwriteMode: z.ZodOptional<z.ZodEnum<{
        overwrite: "overwrite";
        fillEmpty: "fillEmpty";
    }>>;
}, z.core.$strip>;
export type WorkoutPlanGenerationInput = z.infer<typeof workoutPlanGenerationParamsSchema>;
/**
 * Nutrition preferences schema.
 */
export declare const nutritionPreferencesSchema: z.ZodObject<{
    dietaryRestrictions: z.ZodOptional<z.ZodArray<z.ZodString>>;
    allergies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    mealCount: z.ZodOptional<z.ZodNumber>;
    cuisinePreferences: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type NutritionPreferences = z.infer<typeof nutritionPreferencesSchema>;
/**
 * Macro targets schema.
 */
export declare const macroTargetsSchema: z.ZodObject<{
    dailyCalories: z.ZodOptional<z.ZodNumber>;
    proteinGrams: z.ZodOptional<z.ZodNumber>;
    carbsGrams: z.ZodOptional<z.ZodNumber>;
    fatGrams: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type MacroTargets = z.infer<typeof macroTargetsSchema>;
/**
 * Nutrition plan generation request schema.
 */
export declare const nutritionPlanGenerationRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    weekStartDate: z.ZodOptional<z.ZodString>;
    customPrompt: z.ZodOptional<z.ZodString>;
    goals: z.ZodOptional<z.ZodArray<z.ZodString>>;
    preferences: z.ZodOptional<z.ZodObject<{
        dietaryRestrictions: z.ZodOptional<z.ZodArray<z.ZodString>>;
        allergies: z.ZodOptional<z.ZodArray<z.ZodString>>;
        mealCount: z.ZodOptional<z.ZodNumber>;
        cuisinePreferences: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    macroTargets: z.ZodOptional<z.ZodObject<{
        dailyCalories: z.ZodOptional<z.ZodNumber>;
        proteinGrams: z.ZodOptional<z.ZodNumber>;
        carbsGrams: z.ZodOptional<z.ZodNumber>;
        fatGrams: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type NutritionPlanGenerationRequest = z.infer<typeof nutritionPlanGenerationRequestSchema>;
export declare const labMetricDefinitionSummarySchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<{
        body_composition: "body_composition";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        hormonal: "hormonal";
        performance: "performance";
        hematology: "hematology";
        inflammatory: "inflammatory";
        nutritional: "nutritional";
        uncategorized: "uncategorized";
    }>;
    canonicalUnit: z.ZodString;
    directionality: z.ZodEnum<{
        LOWER_IS_BETTER: "LOWER_IS_BETTER";
        HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
        OPTIMAL_ZONE: "OPTIMAL_ZONE";
        DECISION_LIMIT: "DECISION_LIMIT";
    }>;
    isCanonical: z.ZodOptional<z.ZodBoolean>;
    approvalStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        MERGED: "MERGED";
    }>>;
}, z.core.$strip>;
export type LabMetricDefinitionSummary = z.infer<typeof labMetricDefinitionSummarySchema>;
/** Population qualifier for race/ethnicity/sex-specific lab results */
export declare const LabPopulationQualifierSchema: z.ZodNullable<z.ZodEnum<{
    female: "female";
    male: "male";
    african: "african";
    non_african: "non_african";
}>>;
export type LabPopulationQualifier = z.infer<typeof LabPopulationQualifierSchema>;
export declare const extractedLabObservationSchema: z.ZodObject<{
    rawAnalyteName: z.ZodString;
    rawValueText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rawReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rawFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    observedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
    extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
    populationQualifier: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        female: "female";
        male: "male";
        african: "african";
        non_african: "non_african";
    }>>>;
    parentAnalyte: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isCalculated: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    calculationMethod: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    qualityIndicator: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labComment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    canonicalValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    canonicalUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metricDefinitionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metricDefinitionCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metricDefinitionName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mappingStatus: z.ZodEnum<{
        MATCHED: "MATCHED";
        CREATED: "CREATED";
        REVIEW_NEEDED: "REVIEW_NEEDED";
        MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
    }>;
    mappingConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type ExtractedLabObservation = z.infer<typeof extractedLabObservationSchema>;
export declare const extractedLabReportSchema: z.ZodObject<{
    reportDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    specimenType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    orderingProvider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    panelName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    panelCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    collectionTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fastingStatus: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    specimenQualityNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
    extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
export type ExtractedLabReport = z.infer<typeof extractedLabReportSchema>;
export declare const labDataExtractionResultSchema: z.ZodObject<{
    report: z.ZodObject<{
        reportDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        specimenType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        orderingProvider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        panelName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        panelCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        collectionTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fastingStatus: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        specimenQualityNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
        extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
    }, z.core.$strip>;
    observations: z.ZodArray<z.ZodObject<{
        rawAnalyteName: z.ZodString;
        rawValueText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        observedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
        extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
        populationQualifier: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            female: "female";
            male: "male";
            african: "african";
            non_african: "non_african";
        }>>>;
        parentAnalyte: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isCalculated: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        calculationMethod: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        qualityIndicator: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labComment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        canonicalValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        canonicalUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metricDefinitionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metricDefinitionCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metricDefinitionName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mappingStatus: z.ZodEnum<{
            MATCHED: "MATCHED";
            CREATED: "CREATED";
            REVIEW_NEEDED: "REVIEW_NEEDED";
            MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
        }>;
        mappingConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type LabDataExtractionResult = z.infer<typeof labDataExtractionResultSchema>;
/**
 * Canonical MetricDefinition identifier for verified lab observation payloads.
 *
 * When present, this must reference a persisted MetricDefinition UUID.
 * Observations still awaiting review should omit the field or send `null`.
 */
export declare const labMetricDefinitionIdInputSchema: z.ZodString;
export declare const labObservationInputSchema: z.ZodObject<{
    rawAnalyteName: z.ZodString;
    rawValueText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rawReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rawReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    rawFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    observedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    canonicalValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    canonicalUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    labReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    labReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metricDefinitionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mappingStatus: z.ZodEnum<{
        MATCHED: "MATCHED";
        CREATED: "CREATED";
        REVIEW_NEEDED: "REVIEW_NEEDED";
        MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
    }>;
    mappingConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export declare const createLabReportPayloadSchema: z.ZodObject<{
    reportDate: z.ZodString;
    labName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    labLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    specimenType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    orderingProvider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    panelName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    panelCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sourceDocumentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
    extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    observations: z.ZodArray<z.ZodObject<{
        rawAnalyteName: z.ZodString;
        rawValueText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        observedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        canonicalValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        canonicalUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        labReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        labReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metricDefinitionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mappingStatus: z.ZodEnum<{
            MATCHED: "MATCHED";
            CREATED: "CREATED";
            REVIEW_NEEDED: "REVIEW_NEEDED";
            MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
        }>;
        mappingConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        tags: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateLabReportPayload = z.infer<typeof createLabReportPayloadSchema>;
/**
 * Intake questionnaire response schema.
 */
export declare const intakeQuestionnaireResponseSchema: z.ZodObject<{
    userId: z.ZodString;
    completedAt: z.ZodOptional<z.ZodString>;
    responses: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>;
}, z.core.$strip>;
export type IntakeQuestionnaireResponse = z.infer<typeof intakeQuestionnaireResponseSchema>;
/**
 * Client intake payload schema.
 *
 * Supports both:
 * - Structured data (arrays of objects) - preferred for new submissions
 * - String data (semicolon-separated) - legacy format for backwards compatibility
 *
 * Baseline metrics (height, weight, DOB, sex) update ClinicalProfile directly.
 */
export declare const clientIntakePayloadSchema: z.ZodObject<{
    goals: z.ZodString;
    experienceLevel: z.ZodString;
    preferences: z.ZodOptional<z.ZodString>;
    customPreferences: z.ZodOptional<z.ZodString>;
    baselineMetrics: z.ZodOptional<z.ZodObject<{
        heightCm: z.ZodOptional<z.ZodNumber>;
        weightKg: z.ZodOptional<z.ZodNumber>;
        dateOfBirth: z.ZodOptional<z.ZodString>;
        biologicalSex: z.ZodOptional<z.ZodEnum<{
            female: "female";
            male: "male";
            non_binary: "non_binary";
            intersex: "intersex";
            prefer_not_to_say: "prefer_not_to_say";
        }>>;
    }, z.core.$strip>>;
    medicationsData: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        dosage: z.ZodString;
        frequency: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    limitationsData: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            moderate: "moderate";
            mild: "mild";
            severe: "severe";
        }>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    injuriesData: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        bodyPart: z.ZodOptional<z.ZodString>;
        occurredAt: z.ZodOptional<z.ZodString>;
        severity: z.ZodOptional<z.ZodEnum<{
            moderate: "moderate";
            mild: "mild";
            severe: "severe";
        }>>;
        recoveryStatus: z.ZodOptional<z.ZodEnum<{
            active: "active";
            recovering: "recovering";
            healed: "healed";
            chronic: "chronic";
        }>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    medicalConditionsData: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        status: z.ZodEnum<{
            active: "active";
            managed: "managed";
            resolved: "resolved";
            monitoring: "monitoring";
        }>;
        diagnosisDate: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    injuries: z.ZodOptional<z.ZodString>;
    limitations: z.ZodOptional<z.ZodString>;
    medications: z.ZodOptional<z.ZodString>;
    medicalConditions: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ClientIntakePayload = z.infer<typeof clientIntakePayloadSchema>;
/**
 * Exercise filter params schema.
 */
export declare const exerciseFilterParamsSchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    muscleGroup: z.ZodOptional<z.ZodString>;
    equipment: z.ZodOptional<z.ZodString>;
    difficulty: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type ExerciseFilterParamsFromSchema = z.infer<typeof exerciseFilterParamsSchema>;
/**
 * Admin analytics data schema.
 */
export declare const adminAnalyticsDataSchema: z.ZodObject<{
    totalPatients: z.ZodNumber;
    activePatients: z.ZodNumber;
    newPatientsThisMonth: z.ZodNumber;
    averageComplianceScore: z.ZodNumber;
    appointmentsToday: z.ZodNumber;
    pendingLabReviews: z.ZodNumber;
}, z.core.$strip>;
export type AdminAnalyticsData = z.infer<typeof adminAnalyticsDataSchema>;
/**
 * Pending metric review schema - represents a metric awaiting admin review.
 */
export declare const pendingMetricReviewSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<{
        body_composition: "body_composition";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        hormonal: "hormonal";
        performance: "performance";
        hematology: "hematology";
        inflammatory: "inflammatory";
        nutritional: "nutritional";
        uncategorized: "uncategorized";
    }>;
    canonicalUnit: z.ZodString;
    directionality: z.ZodEnum<{
        LOWER_IS_BETTER: "LOWER_IS_BETTER";
        HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
        OPTIMAL_ZONE: "OPTIMAL_ZONE";
        DECISION_LIMIT: "DECISION_LIMIT";
    }>;
    aliases: z.ZodArray<z.ZodString>;
    approvalStatus: z.ZodEnum<{
        PENDING: "PENDING";
        APPROVED: "APPROVED";
        REJECTED: "REJECTED";
        MERGED: "MERGED";
    }>;
    isCanonical: z.ZodBoolean;
    createdBy: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    observationCount: z.ZodNumber;
    suggestedMergeTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        name: z.ZodString;
        similarity: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type PendingMetricReview = z.infer<typeof pendingMetricReviewSchema>;
/**
 * Suggested new metric schema - proposed metric not yet persisted.
 */
export declare const suggestedNewMetricSchema: z.ZodObject<{
    suggestedCode: z.ZodString;
    suggestedName: z.ZodString;
    suggestedCategory: z.ZodEnum<{
        body_composition: "body_composition";
        cardiovascular: "cardiovascular";
        metabolic: "metabolic";
        hormonal: "hormonal";
        performance: "performance";
        hematology: "hematology";
        inflammatory: "inflammatory";
        nutritional: "nutritional";
        uncategorized: "uncategorized";
    }>;
    suggestedAliases: z.ZodArray<z.ZodString>;
    canonicalUnit: z.ZodString;
    directionality: z.ZodEnum<{
        LOWER_IS_BETTER: "LOWER_IS_BETTER";
        HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
        OPTIMAL_ZONE: "OPTIMAL_ZONE";
        DECISION_LIMIT: "DECISION_LIMIT";
    }>;
    description: z.ZodOptional<z.ZodString>;
    confidence: z.ZodNumber;
    reasoning: z.ZodOptional<z.ZodString>;
    rawAnalyteName: z.ZodString;
    isPopulationVariant: z.ZodOptional<z.ZodBoolean>;
    parentMetricCode: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SuggestedNewMetric = z.infer<typeof suggestedNewMetricSchema>;
/**
 * Self-review summary for governed lab extraction responses.
 */
export declare const labDataExtractionSelfReviewSummarySchema: z.ZodObject<{
    iterationsPerformed: z.ZodNumber;
    duplicatesDetected: z.ZodNumber;
    garbageFlagged: z.ZodNumber;
    verifiedCreations: z.ZodNumber;
}, z.core.$strip>;
export type LabDataExtractionSelfReviewSummaryFromSchema = z.infer<typeof labDataExtractionSelfReviewSummarySchema>;
/**
 * Lab data extraction response extended with metric-governance review data.
 * Canonical schema for the governed extraction payload returned after
 * canonicalization and self-review.
 */
export declare const labDataExtractionResultWithGovernanceSchema: z.ZodObject<{
    report: z.ZodObject<{
        reportDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labLocation: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        specimenType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        orderingProvider: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        panelName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        panelCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        collectionTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fastingStatus: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        specimenQualityNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
        extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
    }, z.core.$strip>;
    observations: z.ZodArray<z.ZodObject<{
        rawAnalyteName: z.ZodString;
        rawValueText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawReferenceIntervalText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rawReferenceIntervalLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawReferenceIntervalHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        rawFlag: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        observedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
        extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
        populationQualifier: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            female: "female";
            male: "male";
            african: "african";
            non_african: "non_african";
        }>>>;
        parentAnalyte: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isCalculated: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        calculationMethod: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        qualityIndicator: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        labComment: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        canonicalValue: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        canonicalUnit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metricDefinitionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metricDefinitionCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metricDefinitionName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mappingStatus: z.ZodEnum<{
            MATCHED: "MATCHED";
            CREATED: "CREATED";
            REVIEW_NEEDED: "REVIEW_NEEDED";
            MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
        }>;
        mappingConfidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>;
    suggestedNewMetrics: z.ZodArray<z.ZodObject<{
        suggestedCode: z.ZodString;
        suggestedName: z.ZodString;
        suggestedCategory: z.ZodEnum<{
            body_composition: "body_composition";
            cardiovascular: "cardiovascular";
            metabolic: "metabolic";
            hormonal: "hormonal";
            performance: "performance";
            hematology: "hematology";
            inflammatory: "inflammatory";
            nutritional: "nutritional";
            uncategorized: "uncategorized";
        }>;
        suggestedAliases: z.ZodArray<z.ZodString>;
        canonicalUnit: z.ZodString;
        directionality: z.ZodEnum<{
            LOWER_IS_BETTER: "LOWER_IS_BETTER";
            HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
            OPTIMAL_ZONE: "OPTIMAL_ZONE";
            DECISION_LIMIT: "DECISION_LIMIT";
        }>;
        description: z.ZodOptional<z.ZodString>;
        confidence: z.ZodNumber;
        reasoning: z.ZodOptional<z.ZodString>;
        rawAnalyteName: z.ZodString;
        isPopulationVariant: z.ZodOptional<z.ZodBoolean>;
        parentMetricCode: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    selfReviewSummary: z.ZodOptional<z.ZodObject<{
        iterationsPerformed: z.ZodNumber;
        duplicatesDetected: z.ZodNumber;
        garbageFlagged: z.ZodNumber;
        verifiedCreations: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type LabDataExtractionResultWithGovernanceFromSchema = z.infer<typeof labDataExtractionResultWithGovernanceSchema>;
/**
 * Metric governance action schema - approve/reject a pending metric.
 */
export declare const metricGovernanceActionSchema: z.ZodObject<{
    action: z.ZodEnum<{
        approve: "approve";
        reject: "reject";
    }>;
    reviewNotes: z.ZodOptional<z.ZodString>;
    setAsCanonical: z.ZodOptional<z.ZodBoolean>;
    replacementMetricId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type MetricGovernanceAction = z.infer<typeof metricGovernanceActionSchema>;
/**
 * Merge metrics payload schema - merge source metrics into target.
 */
export declare const mergeMetricsPayloadSchema: z.ZodObject<{
    sourceMetricIds: z.ZodArray<z.ZodString>;
    targetMetricId: z.ZodString;
    migrateObservations: z.ZodDefault<z.ZodBoolean>;
    reviewNotes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type MergeMetricsPayload = z.infer<typeof mergeMetricsPayloadSchema>;
/**
 * Metric governance result schema - response from governance actions.
 */
export declare const metricGovernanceResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    metricId: z.ZodString;
    action: z.ZodEnum<{
        rejected: "rejected";
        approved: "approved";
        merged: "merged";
        promoted: "promoted";
    }>;
    observationsMigrated: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type MetricGovernanceResult = z.infer<typeof metricGovernanceResultSchema>;
/**
 * Trainer summary schema - summary view of a fitness trainer.
 */
export declare const trainerSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>;
}, z.core.$strip>;
export type TrainerSummaryFromSchema = z.infer<typeof trainerSummarySchema>;
/**
 * Response schema for lab metric semantic search endpoint.
 */
export declare const labMetricSearchResponseSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        name: z.ZodString;
        category: z.ZodEnum<{
            body_composition: "body_composition";
            cardiovascular: "cardiovascular";
            metabolic: "metabolic";
            hormonal: "hormonal";
            performance: "performance";
            hematology: "hematology";
            inflammatory: "inflammatory";
            nutritional: "nutritional";
            uncategorized: "uncategorized";
        }>;
        canonicalUnit: z.ZodString;
        directionality: z.ZodEnum<{
            LOWER_IS_BETTER: "LOWER_IS_BETTER";
            HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
            OPTIMAL_ZONE: "OPTIMAL_ZONE";
            DECISION_LIMIT: "DECISION_LIMIT";
        }>;
        isCanonical: z.ZodOptional<z.ZodBoolean>;
        approvalStatus: z.ZodOptional<z.ZodEnum<{
            PENDING: "PENDING";
            APPROVED: "APPROVED";
            REJECTED: "REJECTED";
            MERGED: "MERGED";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type LabMetricSearchResponseFromSchema = z.infer<typeof labMetricSearchResponseSchema>;
/**
 * Response schema for the pending metrics governance endpoint.
 * Wire format: { data: PendingMetricReview[], pagination: PaginationMeta }
 * The web-admin labs service remaps this to { metrics, total } for existing hooks.
 */
export declare const pendingMetricsResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        code: z.ZodString;
        name: z.ZodString;
        category: z.ZodEnum<{
            body_composition: "body_composition";
            cardiovascular: "cardiovascular";
            metabolic: "metabolic";
            hormonal: "hormonal";
            performance: "performance";
            hematology: "hematology";
            inflammatory: "inflammatory";
            nutritional: "nutritional";
            uncategorized: "uncategorized";
        }>;
        canonicalUnit: z.ZodString;
        directionality: z.ZodEnum<{
            LOWER_IS_BETTER: "LOWER_IS_BETTER";
            HIGHER_IS_BETTER: "HIGHER_IS_BETTER";
            OPTIMAL_ZONE: "OPTIMAL_ZONE";
            DECISION_LIMIT: "DECISION_LIMIT";
        }>;
        aliases: z.ZodArray<z.ZodString>;
        approvalStatus: z.ZodEnum<{
            PENDING: "PENDING";
            APPROVED: "APPROVED";
            REJECTED: "REJECTED";
            MERGED: "MERGED";
        }>;
        isCanonical: z.ZodBoolean;
        createdBy: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        observationCount: z.ZodNumber;
        suggestedMergeTargets: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            code: z.ZodString;
            name: z.ZodString;
            similarity: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type PendingMetricsResponseFromSchema = z.infer<typeof pendingMetricsResponseSchema>;
/**
 * Schema for resolving an admin task (optional resolution notes).
 */
export declare const resolveTaskBodySchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ResolveTaskBody = z.infer<typeof resolveTaskBodySchema>;
/**
 * Schema for dismissing an admin task (reason is required).
 */
export declare const dismissTaskBodySchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type DismissTaskBody = z.infer<typeof dismissTaskBodySchema>;
/**
 * Schema for assigning an admin task to an admin user.
 */
export declare const assignTaskBodySchema: z.ZodObject<{
    assigneeId: z.ZodString;
}, z.core.$strip>;
export type AssignTaskBody = z.infer<typeof assignTaskBodySchema>;
/**
 * Admin task schema — mirrors the AdminTask interface in tasksService.ts.
 */
export declare const adminTaskSchema: z.ZodObject<{
    id: z.ZodString;
    taskType: z.ZodEnum<{
        DISPUTE_CREATED: "DISPUTE_CREATED";
        REFUND_AFTER_SESSION_RESET: "REFUND_AFTER_SESSION_RESET";
        VOIDED_INVOICE_AFTER_RESET: "VOIDED_INVOICE_AFTER_RESET";
        DISPUTE_LOST: "DISPUTE_LOST";
        DISPUTE_UNLINKED: "DISPUTE_UNLINKED";
        PAYMENT_ISSUE: "PAYMENT_ISSUE";
        INVENTORY_BACKORDER: "INVENTORY_BACKORDER";
        MANUAL_REVIEW: "MANUAL_REVIEW";
        MOBILE_SESSION_REFUND: "MOBILE_SESSION_REFUND";
        MISSING_DISPUTE_RECORD: "MISSING_DISPUTE_RECORD";
        REFUND_FAILED: "REFUND_FAILED";
        REFUND_SERVICE_REVOCATION: "REFUND_SERVICE_REVOCATION";
    }>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodEnum<{
        LOW: "LOW";
        HIGH: "HIGH";
        NORMAL: "NORMAL";
        URGENT: "URGENT";
    }>;
    status: z.ZodEnum<{
        PENDING: "PENDING";
        IN_PROGRESS: "IN_PROGRESS";
        RESOLVED: "RESOLVED";
        DISMISSED: "DISMISSED";
    }>;
    assignedTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resolvedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resolvedBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resolution: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    userId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    subscriptionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    orderId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    user: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
    subscription: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        tier: z.ZodString;
        status: z.ZodEnum<{
            ACTIVE: "ACTIVE";
            PAUSED: "PAUSED";
            PENDING: "PENDING";
            TRIAL: "TRIAL";
            PAST_DUE: "PAST_DUE";
            CANCELED: "CANCELED";
            TERMINATED: "TERMINATED";
            SUSPENDED: "SUSPENDED";
        }>;
    }, z.core.$strip>>>;
    order: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        totalInCents: z.ZodNumber;
        fulfillmentStatus: z.ZodEnum<{
            CANCELLED: "CANCELLED";
            PENDING: "PENDING";
            PROCESSING: "PROCESSING";
            SHIPPED: "SHIPPED";
            DELIVERED: "DELIVERED";
            RETURNED: "RETURNED";
        }>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type AdminTaskFromSchema = z.infer<typeof adminTaskSchema>;
/**
 * Admin task list response schema — canonical paginated shape.
 * Wire format: { data: AdminTask[], pagination: { limit, total, hasMore, ... } }
 * The tasksService remaps this to { tasks, total } for consumers.
 */
export declare const adminTaskListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        taskType: z.ZodEnum<{
            DISPUTE_CREATED: "DISPUTE_CREATED";
            REFUND_AFTER_SESSION_RESET: "REFUND_AFTER_SESSION_RESET";
            VOIDED_INVOICE_AFTER_RESET: "VOIDED_INVOICE_AFTER_RESET";
            DISPUTE_LOST: "DISPUTE_LOST";
            DISPUTE_UNLINKED: "DISPUTE_UNLINKED";
            PAYMENT_ISSUE: "PAYMENT_ISSUE";
            INVENTORY_BACKORDER: "INVENTORY_BACKORDER";
            MANUAL_REVIEW: "MANUAL_REVIEW";
            MOBILE_SESSION_REFUND: "MOBILE_SESSION_REFUND";
            MISSING_DISPUTE_RECORD: "MISSING_DISPUTE_RECORD";
            REFUND_FAILED: "REFUND_FAILED";
            REFUND_SERVICE_REVOCATION: "REFUND_SERVICE_REVOCATION";
        }>;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodEnum<{
            LOW: "LOW";
            HIGH: "HIGH";
            NORMAL: "NORMAL";
            URGENT: "URGENT";
        }>;
        status: z.ZodEnum<{
            PENDING: "PENDING";
            IN_PROGRESS: "IN_PROGRESS";
            RESOLVED: "RESOLVED";
            DISMISSED: "DISMISSED";
        }>;
        assignedTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        resolvedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        resolvedBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        resolution: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        userId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        subscriptionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        orderId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        user: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        subscription: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            tier: z.ZodString;
            status: z.ZodEnum<{
                ACTIVE: "ACTIVE";
                PAUSED: "PAUSED";
                PENDING: "PENDING";
                TRIAL: "TRIAL";
                PAST_DUE: "PAST_DUE";
                CANCELED: "CANCELED";
                TERMINATED: "TERMINATED";
                SUSPENDED: "SUSPENDED";
            }>;
        }, z.core.$strip>>>;
        order: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            totalInCents: z.ZodNumber;
            fulfillmentStatus: z.ZodEnum<{
                CANCELLED: "CANCELLED";
                PENDING: "PENDING";
                PROCESSING: "PROCESSING";
                SHIPPED: "SHIPPED";
                DELIVERED: "DELIVERED";
                RETURNED: "RETURNED";
            }>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AdminTaskListResponseFromSchema = z.infer<typeof adminTaskListResponseSchema>;
/**
 * Admin task single-item response schema.
 * Wire format: { task: AdminTask }
 */
export declare const adminTaskDetailResponseSchema: z.ZodObject<{
    task: z.ZodObject<{
        id: z.ZodString;
        taskType: z.ZodEnum<{
            DISPUTE_CREATED: "DISPUTE_CREATED";
            REFUND_AFTER_SESSION_RESET: "REFUND_AFTER_SESSION_RESET";
            VOIDED_INVOICE_AFTER_RESET: "VOIDED_INVOICE_AFTER_RESET";
            DISPUTE_LOST: "DISPUTE_LOST";
            DISPUTE_UNLINKED: "DISPUTE_UNLINKED";
            PAYMENT_ISSUE: "PAYMENT_ISSUE";
            INVENTORY_BACKORDER: "INVENTORY_BACKORDER";
            MANUAL_REVIEW: "MANUAL_REVIEW";
            MOBILE_SESSION_REFUND: "MOBILE_SESSION_REFUND";
            MISSING_DISPUTE_RECORD: "MISSING_DISPUTE_RECORD";
            REFUND_FAILED: "REFUND_FAILED";
            REFUND_SERVICE_REVOCATION: "REFUND_SERVICE_REVOCATION";
        }>;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodEnum<{
            LOW: "LOW";
            HIGH: "HIGH";
            NORMAL: "NORMAL";
            URGENT: "URGENT";
        }>;
        status: z.ZodEnum<{
            PENDING: "PENDING";
            IN_PROGRESS: "IN_PROGRESS";
            RESOLVED: "RESOLVED";
            DISMISSED: "DISMISSED";
        }>;
        assignedTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        resolvedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        resolvedBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        resolution: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        userId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        subscriptionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        orderId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        user: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            email: z.ZodString;
            firstName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lastName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        subscription: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            tier: z.ZodString;
            status: z.ZodEnum<{
                ACTIVE: "ACTIVE";
                PAUSED: "PAUSED";
                PENDING: "PENDING";
                TRIAL: "TRIAL";
                PAST_DUE: "PAST_DUE";
                CANCELED: "CANCELED";
                TERMINATED: "TERMINATED";
                SUSPENDED: "SUSPENDED";
            }>;
        }, z.core.$strip>>>;
        order: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            totalInCents: z.ZodNumber;
            fulfillmentStatus: z.ZodEnum<{
                CANCELLED: "CANCELLED";
                PENDING: "PENDING";
                PROCESSING: "PROCESSING";
                SHIPPED: "SHIPPED";
                DELIVERED: "DELIVERED";
                RETURNED: "RETURNED";
            }>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type AdminTaskDetailResponseFromSchema = z.infer<typeof adminTaskDetailResponseSchema>;
export declare const adminInventoryAdjustmentBodySchema: z.ZodObject<{
    changeQuantity: z.ZodNumber;
    reason: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdminInventoryAdjustmentBody = z.infer<typeof adminInventoryAdjustmentBodySchema>;
export declare const adminBillingDisputeIdParamSchema: z.ZodObject<{
    disputeId: z.ZodString;
}, z.core.$strip>;
export type AdminBillingDisputeIdParam = z.infer<typeof adminBillingDisputeIdParamSchema>;
export declare const adminBillingChurnQuerySchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdminBillingChurnQuery = z.infer<typeof adminBillingChurnQuerySchema>;
export declare const taskIdParamSchema: z.ZodObject<{
    taskId: z.ZodString;
}, z.core.$strip>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
export declare const refundApprovalBodySchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RefundApprovalBody = z.infer<typeof refundApprovalBodySchema>;
export declare const refundRejectionBodySchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type RefundRejectionBody = z.infer<typeof refundRejectionBodySchema>;
export declare const adminConsentUserIdParamSchema: z.ZodObject<{
    userId: z.ZodString;
}, z.core.$strip>;
export type AdminConsentUserIdParam = z.infer<typeof adminConsentUserIdParamSchema>;
export declare const adminLeadStageUpdateBodySchema: z.ZodObject<{
    stage: z.ZodEnum<{
        INQUIRY: "INQUIRY";
        CONSULTATION_BOOKED: "CONSULTATION_BOOKED";
        CONSULTATION_COMPLETED: "CONSULTATION_COMPLETED";
        PROPOSAL_SENT: "PROPOSAL_SENT";
        ACTIVE_MEMBER: "ACTIVE_MEMBER";
        CHURNED: "CHURNED";
    }>;
    convertedUserId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdminLeadStageUpdateBody = z.infer<typeof adminLeadStageUpdateBodySchema>;
export declare const adminMessagesThreadParamsSchema: z.ZodObject<{
    userId: z.ZodString;
    partnerId: z.ZodString;
}, z.core.$strip>;
export type AdminMessagesThreadParams = z.infer<typeof adminMessagesThreadParamsSchema>;
export declare const adminMessageIdParamSchema: z.ZodObject<{
    messageId: z.ZodString;
}, z.core.$strip>;
export type AdminMessageIdParam = z.infer<typeof adminMessageIdParamSchema>;
/** Registration IDs are HH-XXXXXX barcodes, not UUIDs. */
export declare const adminRegistrationIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type AdminRegistrationIdParam = z.infer<typeof adminRegistrationIdParamSchema>;
export declare const adminRegistrationBarcodeParamSchema: z.ZodObject<{
    barcode: z.ZodString;
}, z.core.$strip>;
export type AdminRegistrationBarcodeParam = z.infer<typeof adminRegistrationBarcodeParamSchema>;
export declare const adminStrategyParamSchema: z.ZodObject<{
    userId: z.ZodString;
    strategyId: z.ZodString;
}, z.core.$strip>;
export type AdminStrategyParam = z.infer<typeof adminStrategyParamSchema>;
export declare const adminStrategyGoalParamSchema: z.ZodObject<{
    userId: z.ZodString;
    strategyId: z.ZodString;
    goalId: z.ZodString;
}, z.core.$strip>;
export type AdminStrategyGoalParam = z.infer<typeof adminStrategyGoalParamSchema>;
export declare const adminStrategyPhaseParamSchema: z.ZodObject<{
    userId: z.ZodString;
    strategyId: z.ZodString;
    phaseId: z.ZodString;
}, z.core.$strip>;
export type AdminStrategyPhaseParam = z.infer<typeof adminStrategyPhaseParamSchema>;
export declare const adminWearableActivitySummaryQuerySchema: z.ZodObject<{
    periodDays: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number, string | undefined>>;
}, z.core.$strip>;
export type AdminWearableActivitySummaryQuery = z.infer<typeof adminWearableActivitySummaryQuerySchema>;
//# sourceMappingURL=admin-schemas.d.ts.map