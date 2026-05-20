/**
 * @ai-context Clinical domain contracts | limitation severities, biometric sources
 *
 * This module provides the canonical definitions for clinical-related constants:
 * - Limitation severities (mild, moderate, severe)
 * - Biometric data sources (LAB_REPORT, CLINICIAN_ENTRY, APPLE_HEALTH, etc.)
 *
 * IMPORTANT: All clinical-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
export declare const LIMITATION_SEVERITIES: readonly ["mild", "moderate", "severe"];
export declare const LimitationSeveritySchema: z.ZodEnum<{
    moderate: "moderate";
    mild: "mild";
    severe: "severe";
}>;
export type LimitationSeverity = z.infer<typeof LimitationSeveritySchema>;
export declare const LIMITATION_SEVERITY: {
    readonly MILD: LimitationSeverity;
    readonly MODERATE: LimitationSeverity;
    readonly SEVERE: LimitationSeverity;
};
export declare const LIMITATION_SEVERITY_LABELS: Record<LimitationSeverity, string>;
/**
 * Sources from which biometric data can be captured.
 * Used to track data provenance and enable source-specific filtering.
 *
 * **VERIFICATION RULE**:
 * - VERIFIED (isVerified: true): LAB_REPORT, CLINICIAN_ENTRY, DERIVED
 *   → Manual input from admins/clinicians/trainers, parsed lab reports, or system-calculated values
 * - UNVERIFIED (isVerified: false): All others (APPLE_HEALTH, USER_LOG, GOOGLE_FIT, OURA, WHOOP, DEVICE)
 *   → Data from wearables or user self-entry - not vetted for accuracy
 */
export declare const BIOMETRIC_SOURCES: readonly ["LAB_REPORT", "CLINICIAN_ENTRY", "DERIVED", "APPLE_HEALTH", "USER_LOG", "GOOGLE_FIT", "OURA", "WHOOP", "DEVICE"];
export declare const BiometricSourceSchema: z.ZodEnum<{
    LAB_REPORT: "LAB_REPORT";
    CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
    DERIVED: "DERIVED";
    APPLE_HEALTH: "APPLE_HEALTH";
    USER_LOG: "USER_LOG";
    GOOGLE_FIT: "GOOGLE_FIT";
    OURA: "OURA";
    WHOOP: "WHOOP";
    DEVICE: "DEVICE";
}>;
export type BiometricSource = z.infer<typeof BiometricSourceSchema>;
export declare const BIOMETRIC_SOURCE: {
    readonly LAB_REPORT: "LAB_REPORT";
    readonly CLINICIAN_ENTRY: "CLINICIAN_ENTRY";
    readonly DERIVED: "DERIVED";
    readonly APPLE_HEALTH: "APPLE_HEALTH";
    readonly USER_LOG: "USER_LOG";
    readonly GOOGLE_FIT: "GOOGLE_FIT";
    readonly OURA: "OURA";
    readonly WHOOP: "WHOOP";
    readonly DEVICE: "DEVICE";
};
/** Human-readable labels for biometric sources */
export declare const BIOMETRIC_SOURCE_LABELS: Record<BiometricSource, string>;
export declare const INJURY_RECOVERY_STATUSES: readonly ["active", "recovering", "healed", "chronic"];
export declare const InjuryRecoveryStatusSchema: z.ZodEnum<{
    active: "active";
    recovering: "recovering";
    healed: "healed";
    chronic: "chronic";
}>;
export type InjuryRecoveryStatus = z.infer<typeof InjuryRecoveryStatusSchema>;
export declare const INJURY_RECOVERY_STATUS: {
    readonly ACTIVE: InjuryRecoveryStatus;
    readonly RECOVERING: InjuryRecoveryStatus;
    readonly HEALED: InjuryRecoveryStatus;
    readonly CHRONIC: InjuryRecoveryStatus;
};
export declare const INJURY_RECOVERY_STATUS_LABELS: Record<InjuryRecoveryStatus, string>;
export declare const MEDICAL_CONDITION_STATUSES: readonly ["active", "managed", "resolved", "monitoring"];
export declare const MedicalConditionStatusSchema: z.ZodEnum<{
    active: "active";
    managed: "managed";
    resolved: "resolved";
    monitoring: "monitoring";
}>;
export type MedicalConditionStatus = z.infer<typeof MedicalConditionStatusSchema>;
export declare const MEDICAL_CONDITION_STATUS: {
    readonly ACTIVE: MedicalConditionStatus;
    readonly MANAGED: MedicalConditionStatus;
    readonly RESOLVED: MedicalConditionStatus;
    readonly MONITORING: MedicalConditionStatus;
};
export declare const MEDICAL_CONDITION_STATUS_LABELS: Record<MedicalConditionStatus, string>;
export declare const medicationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    dosage: z.ZodString;
    frequency: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type Medication = z.infer<typeof medicationSchema>;
/**
 * Form-level schema for a single medication entry in the admin UI (PHI).
 * Used to validate medication form fields before API submission.
 * Intentionally lenient: dosage/frequency optional so partial entries can be
 * validated incrementally (required-field gate lives in the container save handler).
 */
export declare const medicationItemSchema: z.ZodObject<{
    name: z.ZodString;
    dosage: z.ZodOptional<z.ZodString>;
    frequency: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type MedicationItemInput = z.infer<typeof medicationItemSchema>;
export declare const medicationsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    dosage: z.ZodString;
    frequency: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type Medications = z.infer<typeof medicationsSchema>;
export declare const limitationSchema: z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
    severity: z.ZodOptional<z.ZodEnum<{
        moderate: "moderate";
        mild: "mild";
        severe: "severe";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type Limitation = z.infer<typeof limitationSchema>;
export declare const limitationsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    description: z.ZodString;
    severity: z.ZodOptional<z.ZodEnum<{
        moderate: "moderate";
        mild: "mild";
        severe: "severe";
    }>>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type Limitations = z.infer<typeof limitationsSchema>;
export declare const injurySchema: z.ZodObject<{
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
export type Injury = z.infer<typeof injurySchema>;
export declare const injuriesSchema: z.ZodArray<z.ZodObject<{
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
}, z.core.$strip>>;
export type Injuries = z.infer<typeof injuriesSchema>;
export declare const medicalConditionSchema: z.ZodObject<{
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
export type MedicalCondition = z.infer<typeof medicalConditionSchema>;
export declare const medicalConditionsSchema: z.ZodArray<z.ZodObject<{
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
}, z.core.$strip>>;
export type MedicalConditions = z.infer<typeof medicalConditionsSchema>;
/**
 * Roles for care team members associated with a patient.
 */
export declare const CARE_TEAM_ROLES: readonly ["primary_care", "endocrinologist", "cardiologist", "nutritionist", "nurse", "health_coach", "other"];
export declare const CareTeamRoleSchema: z.ZodEnum<{
    primary_care: "primary_care";
    endocrinologist: "endocrinologist";
    cardiologist: "cardiologist";
    nutritionist: "nutritionist";
    nurse: "nurse";
    health_coach: "health_coach";
    other: "other";
}>;
export type CareTeamRole = z.infer<typeof CareTeamRoleSchema>;
export declare const CARE_TEAM_ROLE: {
    readonly PRIMARY_CARE: CareTeamRole;
    readonly ENDOCRINOLOGIST: CareTeamRole;
    readonly CARDIOLOGIST: CareTeamRole;
    readonly NUTRITIONIST: CareTeamRole;
    readonly NURSE: CareTeamRole;
    readonly HEALTH_COACH: CareTeamRole;
    readonly OTHER: CareTeamRole;
};
export declare const CARE_TEAM_ROLE_LABELS: Record<CareTeamRole, string>;
/**
 * Shared content and tag limits for all note types.
 *
 * Use these constants in:
 * - Server route validation (server/src/validation/notes.ts)
 * - Client form validation (features, components)
 *
 * This ensures server and client enforce identical constraints without
 * duplicating magic numbers.
 */
export declare const NOTE_LIMITS: {
    /** User-created notes (patient self-entry) */
    readonly USER_CONTENT_MAX: 10000;
    /** Clinical notes (admin/clinician entry) */
    readonly CLINICAL_CONTENT_MAX: 5000;
    /** Maximum tags per note */
    readonly MAX_TAGS: 20;
    /** Maximum tag length in characters */
    readonly MAX_TAG_LENGTH: 100;
};
/**
 * Canonical tags schema — enforces MAX_TAGS and MAX_TAG_LENGTH.
 * Use in both server validation and client form schemas.
 */
export declare const noteTagsSchema: z.ZodArray<z.ZodString>;
/**
 * Canonical note input schema for user-created (patient self-entry) notes.
 * Server route: server/src/validation/notes.ts createNoteBodySchema
 */
export declare const userNoteInputSchema: z.ZodObject<{
    patientId: z.ZodString;
    content: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type UserNoteInput = z.infer<typeof userNoteInputSchema>;
/**
 * Canonical note input schema for clinical notes (admin/clinician entry).
 * Server route: server/src/validation/notes.ts createClinicalNoteBodySchema
 *
 * NOTE: createdAt is omitted — server decides whether to accept it based on
 * the caller's role (ADMIN may supply it; CLINICIAN must use server timestamp).
 */
export declare const clinicalNoteInputSchema: z.ZodObject<{
    content: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    createdAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ClinicalNoteInput = z.infer<typeof clinicalNoteInputSchema>;
export declare const ClinicalNoteContractSchema: z.ZodObject<{
    id: z.ZodString;
    patientId: z.ZodNullable<z.ZodString>;
    authorId: z.ZodNullable<z.ZodString>;
    content: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type ClinicalNoteContract = z.infer<typeof ClinicalNoteContractSchema>;
export declare const PatientDocumentContractSchema: z.ZodObject<{
    id: z.ZodString;
    patientId: z.ZodString;
    uploaderId: z.ZodString;
    fileUrl: z.ZodString;
    fileType: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<{
        LAB_RESULT: "LAB_RESULT";
        INSURANCE_CARD: "INSURANCE_CARD";
        MEDICAL_RECORD: "MEDICAL_RECORD";
        IMAGING: "IMAGING";
        PRESCRIPTION: "PRESCRIPTION";
        REFERRAL: "REFERRAL";
        CONSENT_FORM: "CONSENT_FORM";
        ID_DOCUMENT: "ID_DOCUMENT";
        INTAKE_FORM: "INTAKE_FORM";
        PROGRESS_PHOTO: "PROGRESS_PHOTO";
        OTHER: "OTHER";
    }>>;
    tags: z.ZodArray<z.ZodString>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    extractedData: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        panelName: z.ZodOptional<z.ZodString>;
        observations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            unit: z.ZodOptional<z.ZodString>;
            referenceRange: z.ZodOptional<z.ZodString>;
            flag: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        reportDate: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type PatientDocumentContract = z.infer<typeof PatientDocumentContractSchema>;
export declare const clinicalNoteSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    patientId: z.ZodString;
    authorId: z.ZodString;
    content: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type ClinicalNote = z.infer<typeof clinicalNoteSchema>;
export declare const patientDocumentSchema: z.ZodObject<{
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    patientId: z.ZodString;
    uploaderId: z.ZodString;
    fileUrl: z.ZodString;
    fileType: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<{
        LAB_RESULT: "LAB_RESULT";
        INSURANCE_CARD: "INSURANCE_CARD";
        MEDICAL_RECORD: "MEDICAL_RECORD";
        IMAGING: "IMAGING";
        PRESCRIPTION: "PRESCRIPTION";
        REFERRAL: "REFERRAL";
        CONSENT_FORM: "CONSENT_FORM";
        ID_DOCUMENT: "ID_DOCUMENT";
        INTAKE_FORM: "INTAKE_FORM";
        PROGRESS_PHOTO: "PROGRESS_PHOTO";
        OTHER: "OTHER";
    }>>;
    tags: z.ZodArray<z.ZodString>;
    extractedData: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        panelName: z.ZodOptional<z.ZodString>;
        observations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            value: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
            unit: z.ZodOptional<z.ZodString>;
            referenceRange: z.ZodOptional<z.ZodString>;
            flag: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
        reportDate: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>>>;
}, z.core.$strip>;
export type PatientDocument = z.infer<typeof patientDocumentSchema>;
/**
 * Full patient profile schema for clinic use.
 * Composes the canonical UserProfileSchema shape with clinic-specific fields.
 *
 * Clinic-specific additions:
 *   clinicMembershipId   — physical clinic membership / chart ID (e.g. "CM-00142")
 *   primaryClinicianId   — assigned clinician (maps to User.id with CLINICIAN role)
 *   clinicEnrolledAt     — ISO timestamp when the patient was enrolled at the clinic
 *   clinicStatus         — whether the patient is currently active at the clinic
 *   clinicNotes          — free-text internal notes (visible to CLINICAL_ROLES only)
 *
 * All user-profile fields mirror UserProfileSchema from domain/user.ts.
 * Import UserProfileContract from there for the full profile shape without clinic fields.
 */
export declare const PatientSchema: z.ZodObject<{
    userId: z.ZodString;
    email: z.ZodString;
    fullName: z.ZodString;
    preferredName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dateOfBirth: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    biologicalSex: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        female: "female";
        male: "male";
        non_binary: "non_binary";
        intersex: "intersex";
        prefer_not_to_say: "prefer_not_to_say";
    }>>>;
    heightCm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weightKg: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    timezone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    stateOfResidence: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodDefault<z.ZodEnum<{
        ADMIN: "ADMIN";
        CLINICIAN: "CLINICIAN";
        TRAINER: "TRAINER";
        CLIENT: "CLIENT";
    }>>;
    tier: z.ZodOptional<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    assignedClinicianId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assignedTrainerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    medications: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        dosage: z.ZodString;
        frequency: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    limitations: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        description: z.ZodString;
        severity: z.ZodOptional<z.ZodEnum<{
            moderate: "moderate";
            mild: "mild";
            severe: "severe";
        }>>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
    injuries: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>>>;
    medicalConditions: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
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
    }, z.core.$strip>>>>;
    onboardingCompleted: z.ZodBoolean;
    isActive: z.ZodOptional<z.ZodBoolean>;
    accountSuspended: z.ZodOptional<z.ZodBoolean>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    clinicMembershipId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    primaryClinicianId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    clinicEnrolledAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    clinicStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
        on_hold: "on_hold";
        discharged: "discharged";
    }>>>;
    clinicNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type PatientContract = z.infer<typeof PatientSchema>;
/**
 * Input schema for creating or updating a lab order.
 *
 * Status values mirror LabOrderStatusSchema from domain/businessAnalytics.ts.
 * Timestamp fields are all optional on update; required by the server for transitions.
 *
 * panelType: human-readable panel label (e.g. "Comprehensive Metabolic Panel",
 *   "Testosterone + SHBG", "Lipid Panel"). Not an enum — lab catalog evolves.
 * externalReference: vendor or LIMS order ID for cross-referencing external systems.
 */
export declare const LabOrderSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    patientUserId: z.ZodString;
    orderedByUserId: z.ZodString;
    panelType: z.ZodString;
    status: z.ZodEnum<{
        ORDERED: "ORDERED";
        KIT_SENT: "KIT_SENT";
        SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
        RESULTS_PENDING: "RESULTS_PENDING";
        RESULTS_REVIEWED: "RESULTS_REVIEWED";
        RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
    }>;
    orderedAt: z.ZodString;
    kitSentAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sampleReceivedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resultsPendingAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resultsReviewedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    resultsPublishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    externalReference: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type LabOrderContract = z.infer<typeof LabOrderSchema>;
/**
 * Mock factory for Medication (testing)
 */
export declare const createMockMedication: (overrides?: Partial<Medication>) => Medication;
/**
 * Mock factory for Limitation (testing)
 */
export declare const createMockLimitation: (overrides?: Partial<Limitation>) => Limitation;
//# sourceMappingURL=clinical.d.ts.map