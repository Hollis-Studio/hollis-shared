/**
 * @ai-context PHI Audit Domain Contracts | Types for PHI access logging and audit trail
 *
 * Provides type-safe definitions for:
 * - PHI resource types (what PHI was accessed)
 * - PHI action types (what was done with it)
 * - Access reasons (business justification)
 *
 * deps: zod | consumers: server
 */
import { z } from "zod";
/**
 * Types of PHI resources that can be accessed
 */
export declare const PHI_RESOURCES: readonly ["user", "user-account", "clinical_profile", "lab_panel", "lab_result", "clinical_note", "patient_document", "document", "biometric_entry", "biometrics", "appointment", "health_metric_goal", "health_goal", "health_snapshot", "medication", "limitation", "crm", "health_progress", "daily_metrics", "daily_summary", "daily_log", "measurement", "session", "journal", "phi", "message", "push", "push_token", "upload", "ai_permanent_note", "client_intake", "registration", "workout_plan", "nutrition_plan", "ai_context", "training_strategy", "exercise_logs", "billing_dispute", "data_export", "wearable_workout", "consent_record"];
export declare const PhiResourceSchema: z.ZodEnum<{
    message: "message";
    push: "push";
    measurement: "measurement";
    medication: "medication";
    session: "session";
    biometrics: "biometrics";
    user: "user";
    "user-account": "user-account";
    clinical_profile: "clinical_profile";
    lab_panel: "lab_panel";
    lab_result: "lab_result";
    clinical_note: "clinical_note";
    patient_document: "patient_document";
    document: "document";
    biometric_entry: "biometric_entry";
    appointment: "appointment";
    health_metric_goal: "health_metric_goal";
    health_goal: "health_goal";
    health_snapshot: "health_snapshot";
    limitation: "limitation";
    crm: "crm";
    health_progress: "health_progress";
    daily_metrics: "daily_metrics";
    daily_summary: "daily_summary";
    daily_log: "daily_log";
    journal: "journal";
    phi: "phi";
    push_token: "push_token";
    upload: "upload";
    ai_permanent_note: "ai_permanent_note";
    client_intake: "client_intake";
    registration: "registration";
    workout_plan: "workout_plan";
    nutrition_plan: "nutrition_plan";
    ai_context: "ai_context";
    training_strategy: "training_strategy";
    exercise_logs: "exercise_logs";
    billing_dispute: "billing_dispute";
    data_export: "data_export";
    wearable_workout: "wearable_workout";
    consent_record: "consent_record";
}>;
export type PhiResource = z.infer<typeof PhiResourceSchema>;
/**
 * Constant map for PHI resources to avoid magic strings
 */
export declare const PHI_RESOURCE: {
    readonly USER: "user";
    readonly USER_ACCOUNT: "user-account";
    readonly CLINICAL_PROFILE: "clinical_profile";
    readonly LAB_PANEL: "lab_panel";
    readonly LAB_RESULT: "lab_result";
    readonly CLINICAL_NOTE: "clinical_note";
    readonly PATIENT_DOCUMENT: "patient_document";
    readonly DOCUMENT: "document";
    readonly BIOMETRIC_ENTRY: "biometric_entry";
    readonly BIOMETRICS: "biometrics";
    readonly APPOINTMENT: "appointment";
    readonly HEALTH_METRIC_GOAL: "health_metric_goal";
    readonly HEALTH_GOAL: "health_goal";
    readonly HEALTH_SNAPSHOT: "health_snapshot";
    readonly MEDICATION: "medication";
    readonly LIMITATION: "limitation";
    readonly CRM: "crm";
    readonly HEALTH_PROGRESS: "health_progress";
    readonly DAILY_METRICS: "daily_metrics";
    readonly DAILY_SUMMARY: "daily_summary";
    readonly DAILY_LOG: "daily_log";
    readonly MEASUREMENT: "measurement";
    readonly SESSION: "session";
    readonly JOURNAL: "journal";
    readonly PHI: "phi";
    readonly MESSAGE: "message";
    readonly PUSH: "push";
    readonly PUSH_TOKEN: "push_token";
    readonly UPLOAD: "upload";
    readonly AI_PERMANENT_NOTE: "ai_permanent_note";
    readonly CLIENT_INTAKE: "client_intake";
    readonly REGISTRATION: "registration";
    readonly WORKOUT_PLAN: "workout_plan";
    readonly NUTRITION_PLAN: "nutrition_plan";
    readonly AI_CONTEXT: "ai_context";
    readonly TRAINING_STRATEGY: "training_strategy";
    readonly EXERCISE_LOGS: "exercise_logs";
    readonly BILLING_DISPUTE: "billing_dispute";
    readonly DATA_EXPORT: "data_export";
    readonly WEARABLE_WORKOUT: "wearable_workout";
    readonly CONSENT_RECORD: "consent_record";
};
/**
 * Actions that can be performed on PHI
 */
export declare const PHI_ACTIONS: readonly ["READ", "CREATE", "UPDATE", "DELETE", "LIST"];
export declare const PhiActionSchema: z.ZodEnum<{
    READ: "READ";
    CREATE: "CREATE";
    UPDATE: "UPDATE";
    DELETE: "DELETE";
    LIST: "LIST";
}>;
export type PhiAction = z.infer<typeof PhiActionSchema>;
/**
 * Constant map for PHI actions to avoid magic strings
 */
export declare const PHI_ACTION: {
    readonly READ: "READ";
    readonly CREATE: "CREATE";
    readonly UPDATE: "UPDATE";
    readonly DELETE: "DELETE";
    readonly LIST: "LIST";
};
/**
 * Business justifications for PHI access (HIPAA requirement)
 */
export declare const PHI_ACCESS_REASONS: readonly ["treatment", "payment", "healthcare_ops", "patient_request", "legal_requirement", "emergency", "research", "admin", "unspecified"];
export declare const PhiAccessReasonSchema: z.ZodEnum<{
    treatment: "treatment";
    payment: "payment";
    healthcare_ops: "healthcare_ops";
    patient_request: "patient_request";
    legal_requirement: "legal_requirement";
    emergency: "emergency";
    research: "research";
    admin: "admin";
    unspecified: "unspecified";
}>;
export type PhiAccessReason = z.infer<typeof PhiAccessReasonSchema>;
/**
 * Labels for access reasons
 */
export declare const PHI_ACCESS_REASON_LABELS: Record<PhiAccessReason, string>;
/** Constant map for PHI access reasons to avoid magic strings */
export declare const PHI_ACCESS_REASON: {
    readonly TREATMENT: PhiAccessReason;
    readonly PAYMENT: PhiAccessReason;
    readonly HEALTHCARE_OPS: PhiAccessReason;
    readonly PATIENT_REQUEST: PhiAccessReason;
    readonly LEGAL_REQUIREMENT: PhiAccessReason;
    readonly EMERGENCY: PhiAccessReason;
    readonly RESEARCH: PhiAccessReason;
    readonly ADMIN: PhiAccessReason;
    readonly UNSPECIFIED: PhiAccessReason;
};
/** @deprecated Use PhiResourceSchema instead */
export declare const phiResourceSchema: z.ZodEnum<{
    message: "message";
    push: "push";
    measurement: "measurement";
    medication: "medication";
    session: "session";
    biometrics: "biometrics";
    user: "user";
    "user-account": "user-account";
    clinical_profile: "clinical_profile";
    lab_panel: "lab_panel";
    lab_result: "lab_result";
    clinical_note: "clinical_note";
    patient_document: "patient_document";
    document: "document";
    biometric_entry: "biometric_entry";
    appointment: "appointment";
    health_metric_goal: "health_metric_goal";
    health_goal: "health_goal";
    health_snapshot: "health_snapshot";
    limitation: "limitation";
    crm: "crm";
    health_progress: "health_progress";
    daily_metrics: "daily_metrics";
    daily_summary: "daily_summary";
    daily_log: "daily_log";
    journal: "journal";
    phi: "phi";
    push_token: "push_token";
    upload: "upload";
    ai_permanent_note: "ai_permanent_note";
    client_intake: "client_intake";
    registration: "registration";
    workout_plan: "workout_plan";
    nutrition_plan: "nutrition_plan";
    ai_context: "ai_context";
    training_strategy: "training_strategy";
    exercise_logs: "exercise_logs";
    billing_dispute: "billing_dispute";
    data_export: "data_export";
    wearable_workout: "wearable_workout";
    consent_record: "consent_record";
}>;
/** @deprecated Use PhiActionSchema instead */
export declare const phiActionSchema: z.ZodEnum<{
    READ: "READ";
    CREATE: "CREATE";
    UPDATE: "UPDATE";
    DELETE: "DELETE";
    LIST: "LIST";
}>;
/** @deprecated Use PhiAccessReasonSchema instead */
export declare const phiAccessReasonSchema: z.ZodEnum<{
    treatment: "treatment";
    payment: "payment";
    healthcare_ops: "healthcare_ops";
    patient_request: "patient_request";
    legal_requirement: "legal_requirement";
    emergency: "emergency";
    research: "research";
    admin: "admin";
    unspecified: "unspecified";
}>;
export declare const phiAuditLogEntrySchema: z.ZodObject<{
    id: z.ZodString;
    actorId: z.ZodString;
    userId: z.ZodNullable<z.ZodString>;
    resource: z.ZodEnum<{
        message: "message";
        push: "push";
        measurement: "measurement";
        medication: "medication";
        session: "session";
        biometrics: "biometrics";
        user: "user";
        "user-account": "user-account";
        clinical_profile: "clinical_profile";
        lab_panel: "lab_panel";
        lab_result: "lab_result";
        clinical_note: "clinical_note";
        patient_document: "patient_document";
        document: "document";
        biometric_entry: "biometric_entry";
        appointment: "appointment";
        health_metric_goal: "health_metric_goal";
        health_goal: "health_goal";
        health_snapshot: "health_snapshot";
        limitation: "limitation";
        crm: "crm";
        health_progress: "health_progress";
        daily_metrics: "daily_metrics";
        daily_summary: "daily_summary";
        daily_log: "daily_log";
        journal: "journal";
        phi: "phi";
        push_token: "push_token";
        upload: "upload";
        ai_permanent_note: "ai_permanent_note";
        client_intake: "client_intake";
        registration: "registration";
        workout_plan: "workout_plan";
        nutrition_plan: "nutrition_plan";
        ai_context: "ai_context";
        training_strategy: "training_strategy";
        exercise_logs: "exercise_logs";
        billing_dispute: "billing_dispute";
        data_export: "data_export";
        wearable_workout: "wearable_workout";
        consent_record: "consent_record";
    }>;
    action: z.ZodEnum<{
        READ: "READ";
        CREATE: "CREATE";
        UPDATE: "UPDATE";
        DELETE: "DELETE";
        LIST: "LIST";
    }>;
    method: z.ZodString;
    path: z.ZodString;
    resourceId: z.ZodNullable<z.ZodString>;
    ipAddress: z.ZodNullable<z.ZodString>;
    userAgent: z.ZodNullable<z.ZodString>;
    success: z.ZodBoolean;
    errorMessage: z.ZodNullable<z.ZodString>;
    accessReason: z.ZodString;
    sequenceNumber: z.ZodNullable<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodBigInt, z.ZodTransform<string, bigint>>]>>;
    previousHash: z.ZodNullable<z.ZodString>;
    integrityHash: z.ZodString;
    verifiedAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type PhiAuditLogEntryContract = z.infer<typeof phiAuditLogEntrySchema>;
/** Mock factory for tests */
export declare const createMockPhiAuditLogEntry: (overrides?: Partial<PhiAuditLogEntryContract>) => PhiAuditLogEntryContract;
//# sourceMappingURL=phi-audit.d.ts.map