/**
 * @ai-context Workouts AI persistence entities | AiAuditLogEntrySchema,
 * SmartBuilderDraftPayloadSchema, PlateauCoachingArtifactSchema,
 * CancellationFeedbackSchema, AiTokenUsageSchema.
 *
 * deps: zod
 * consumers: hollis-workouts server + mobile client
 */
import { z } from 'zod';
export declare const AI_AUDIT_LOG_SURFACES: readonly ["sunday_review_phase_outlook", "plateau_coaching", "program_critique", "program_edit", "goal_reasoning", "pr_celebration", "anomaly_label", "rest_day_pulse", "smart_program_builder", "smart_gym_setup", "sunday_review_freeform"];
export type AiAuditLogSurface = (typeof AI_AUDIT_LOG_SURFACES)[number];
export declare const AiAuditLogSurfaceSchema: z.ZodEnum<{
    sunday_review_phase_outlook: "sunday_review_phase_outlook";
    plateau_coaching: "plateau_coaching";
    program_critique: "program_critique";
    program_edit: "program_edit";
    goal_reasoning: "goal_reasoning";
    pr_celebration: "pr_celebration";
    anomaly_label: "anomaly_label";
    rest_day_pulse: "rest_day_pulse";
    smart_program_builder: "smart_program_builder";
    smart_gym_setup: "smart_gym_setup";
    sunday_review_freeform: "sunday_review_freeform";
}>;
export declare const AI_AUDIT_LOG_MODEL_TIERS: readonly ["flash", "pro", "image"];
export type AiAuditLogModelTier = (typeof AI_AUDIT_LOG_MODEL_TIERS)[number];
export declare const AiAuditLogModelTierSchema: z.ZodEnum<{
    flash: "flash";
    pro: "pro";
    image: "image";
}>;
export declare const AI_AUDIT_LOG_ACTIONS: readonly ["auto_applied", "user_applied", "user_dismissed", "user_overrode"];
export type AiAuditLogAction = (typeof AI_AUDIT_LOG_ACTIONS)[number];
export declare const AiAuditLogActionSchema: z.ZodEnum<{
    auto_applied: "auto_applied";
    user_applied: "user_applied";
    user_dismissed: "user_dismissed";
    user_overrode: "user_overrode";
}>;
export declare const AiAuditLogCreateSchema: z.ZodObject<{
    surface: z.ZodEnum<{
        sunday_review_phase_outlook: "sunday_review_phase_outlook";
        plateau_coaching: "plateau_coaching";
        program_critique: "program_critique";
        program_edit: "program_edit";
        goal_reasoning: "goal_reasoning";
        pr_celebration: "pr_celebration";
        anomaly_label: "anomaly_label";
        rest_day_pulse: "rest_day_pulse";
        smart_program_builder: "smart_program_builder";
        smart_gym_setup: "smart_gym_setup";
        sunday_review_freeform: "sunday_review_freeform";
    }>;
    modelTier: z.ZodEnum<{
        flash: "flash";
        pro: "pro";
        image: "image";
    }>;
    snapshotRef: z.ZodOptional<z.ZodString>;
    action: z.ZodEnum<{
        auto_applied: "auto_applied";
        user_applied: "user_applied";
        user_dismissed: "user_dismissed";
        user_overrode: "user_overrode";
    }>;
    persisted: z.ZodBoolean;
    sourceRef: z.ZodUnknown & z.ZodType<{}, unknown, z.core.$ZodTypeInternals<{}, unknown>>;
    snapshotInline: z.ZodOptional<z.ZodUnknown>;
    aiOutput: z.ZodUnknown & z.ZodType<{}, unknown, z.core.$ZodTypeInternals<{}, unknown>>;
    diff: z.ZodOptional<z.ZodUnknown>;
    clientIdempotencyKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AiAuditLogCreate = z.infer<typeof AiAuditLogCreateSchema>;
export declare const AiAuditLogEntrySchema: z.ZodObject<{
    action: z.ZodEnum<{
        auto_applied: "auto_applied";
        user_applied: "user_applied";
        user_dismissed: "user_dismissed";
        user_overrode: "user_overrode";
    }>;
    surface: z.ZodEnum<{
        sunday_review_phase_outlook: "sunday_review_phase_outlook";
        plateau_coaching: "plateau_coaching";
        program_critique: "program_critique";
        program_edit: "program_edit";
        goal_reasoning: "goal_reasoning";
        pr_celebration: "pr_celebration";
        anomaly_label: "anomaly_label";
        rest_day_pulse: "rest_day_pulse";
        smart_program_builder: "smart_program_builder";
        smart_gym_setup: "smart_gym_setup";
        sunday_review_freeform: "sunday_review_freeform";
    }>;
    modelTier: z.ZodEnum<{
        flash: "flash";
        pro: "pro";
        image: "image";
    }>;
    snapshotRef: z.ZodOptional<z.ZodString>;
    persisted: z.ZodBoolean;
    sourceRef: z.ZodUnknown & z.ZodType<{}, unknown, z.core.$ZodTypeInternals<{}, unknown>>;
    snapshotInline: z.ZodOptional<z.ZodUnknown>;
    aiOutput: z.ZodUnknown & z.ZodType<{}, unknown, z.core.$ZodTypeInternals<{}, unknown>>;
    diff: z.ZodOptional<z.ZodUnknown>;
    id: z.ZodString;
    timestamp: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type AiAuditLogEntry = z.infer<typeof AiAuditLogEntrySchema>;
export declare const SmartBuilderDraftPayloadSchema: z.ZodObject<{
    conversationHistory: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
        }>;
        content: z.ZodString;
        timestamp: z.ZodNumber;
    }, z.core.$strip>>;
    currentProgram: z.ZodUnknown;
    phase: z.ZodEnum<{
        input: "input";
        conversing: "conversing";
        generating: "generating";
        preview: "preview";
        refining: "refining";
    }>;
    questionGroups: z.ZodOptional<z.ZodUnknown>;
    readyMessage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    selectedGymId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userAnswers: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, z.core.$strip>;
export type SmartBuilderDraftPayload = z.infer<typeof SmartBuilderDraftPayloadSchema>;
export declare const SmartBuilderDraftUpsertSchema: z.ZodObject<{
    payload: z.ZodObject<{
        conversationHistory: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<{
                user: "user";
                assistant: "assistant";
            }>;
            content: z.ZodString;
            timestamp: z.ZodNumber;
        }, z.core.$strip>>;
        currentProgram: z.ZodUnknown;
        phase: z.ZodEnum<{
            input: "input";
            conversing: "conversing";
            generating: "generating";
            preview: "preview";
            refining: "refining";
        }>;
        questionGroups: z.ZodOptional<z.ZodUnknown>;
        readyMessage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        selectedGymId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        userAnswers: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>;
    createdAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type SmartBuilderDraftUpsert = z.infer<typeof SmartBuilderDraftUpsertSchema>;
export declare const SmartBuilderDraftRecordSchema: z.ZodObject<{
    userId: z.ZodString;
    payload: z.ZodObject<{
        conversationHistory: z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<{
                user: "user";
                assistant: "assistant";
            }>;
            content: z.ZodString;
            timestamp: z.ZodNumber;
        }, z.core.$strip>>;
        currentProgram: z.ZodUnknown;
        phase: z.ZodEnum<{
            input: "input";
            conversing: "conversing";
            generating: "generating";
            preview: "preview";
            refining: "refining";
        }>;
        questionGroups: z.ZodOptional<z.ZodUnknown>;
        readyMessage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        selectedGymId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        userAnswers: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodNumber;
    }, z.core.$strip>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type SmartBuilderDraftRecord = z.infer<typeof SmartBuilderDraftRecordSchema>;
export declare const PlateauCoachingTokenCountSchema: z.ZodNullable<z.ZodObject<{
    input: z.ZodOptional<z.ZodNumber>;
    output: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>>;
export type PlateauCoachingTokenCount = z.infer<typeof PlateauCoachingTokenCountSchema>;
export declare const PlateauCoachingArtifactCreateSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    detectedAt: z.ZodCoercedDate<unknown>;
    narrative: z.ZodString;
    rootCauses: z.ZodNullable<z.ZodArray<z.ZodString>>;
    recommendations: z.ZodNullable<z.ZodArray<z.ZodString>>;
    dismissedAt: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    tokenCount: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        input: z.ZodOptional<z.ZodNumber>;
        output: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
    createdAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type PlateauCoachingArtifactCreate = z.infer<typeof PlateauCoachingArtifactCreateSchema>;
export declare const PlateauCoachingArtifactSchema: z.ZodObject<{
    id: z.ZodString;
    exerciseId: z.ZodString;
    detectedAt: z.ZodCoercedDate<unknown>;
    narrative: z.ZodString;
    rootCauses: z.ZodArray<z.ZodString>;
    recommendations: z.ZodArray<z.ZodString>;
    dismissedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
    tokenCount: z.ZodNullable<z.ZodObject<{
        input: z.ZodOptional<z.ZodNumber>;
        output: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    deletedAt: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
}, z.core.$strip>;
export type PlateauCoachingArtifact = z.infer<typeof PlateauCoachingArtifactSchema>;
export declare const CANCELLATION_FEEDBACK_OPTIONS: readonly ["too_expensive", "not_using_smart_features", "found_different_app", "taking_break", "something_else"];
export type CancellationFeedbackOption = (typeof CANCELLATION_FEEDBACK_OPTIONS)[number];
export declare const CancellationFeedbackOptionSchema: z.ZodEnum<{
    too_expensive: "too_expensive";
    not_using_smart_features: "not_using_smart_features";
    found_different_app: "found_different_app";
    taking_break: "taking_break";
    something_else: "something_else";
}>;
export declare const CancellationFeedbackCreateSchema: z.ZodObject<{
    option: z.ZodEnum<{
        too_expensive: "too_expensive";
        not_using_smart_features: "not_using_smart_features";
        found_different_app: "found_different_app";
        taking_break: "taking_break";
        something_else: "something_else";
    }>;
    detail: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CancellationFeedbackCreate = z.infer<typeof CancellationFeedbackCreateSchema>;
export declare const CancellationFeedbackSchema: z.ZodObject<{
    id: z.ZodString;
    option: z.ZodEnum<{
        too_expensive: "too_expensive";
        not_using_smart_features: "not_using_smart_features";
        found_different_app: "found_different_app";
        taking_break: "taking_break";
        something_else: "something_else";
    }>;
    detail: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type CancellationFeedback = z.infer<typeof CancellationFeedbackSchema>;
export declare const AiTokenUsageMonthSchema: z.ZodString;
export type AiTokenUsageMonth = z.infer<typeof AiTokenUsageMonthSchema>;
export declare const AiTokenUsageUpsertSchema: z.ZodObject<{
    tokens: z.ZodRecord<z.ZodString, z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type AiTokenUsageUpsert = z.infer<typeof AiTokenUsageUpsertSchema>;
export declare const AiFeatureModelUsageSchema: z.ZodObject<{
    input: z.ZodNumber;
    output: z.ZodNumber;
    total: z.ZodNumber;
    calls: z.ZodNumber;
}, z.core.$strip>;
export type AiFeatureModelUsage = z.infer<typeof AiFeatureModelUsageSchema>;
export declare const AiFeatureUsageSchema: z.ZodObject<{
    input: z.ZodNumber;
    output: z.ZodNumber;
    total: z.ZodNumber;
    calls: z.ZodNumber;
    byModel: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        input: z.ZodNumber;
        output: z.ZodNumber;
        total: z.ZodNumber;
        calls: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type AiFeatureUsage = z.infer<typeof AiFeatureUsageSchema>;
export declare const AiTokenValueSchema: z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
    input: z.ZodNumber;
    output: z.ZodNumber;
    total: z.ZodNumber;
    calls: z.ZodNumber;
    byModel: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
        input: z.ZodNumber;
        output: z.ZodNumber;
        total: z.ZodNumber;
        calls: z.ZodNumber;
    }, z.core.$strip>>>;
}, z.core.$strip>]>;
export type AiTokenValue = z.infer<typeof AiTokenValueSchema>;
export declare const AiTokenUsageSchema: z.ZodObject<{
    id: z.ZodString;
    month: z.ZodString;
    tokens: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
        input: z.ZodNumber;
        output: z.ZodNumber;
        total: z.ZodNumber;
        calls: z.ZodNumber;
        byModel: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodObject<{
            input: z.ZodNumber;
            output: z.ZodNumber;
            total: z.ZodNumber;
            calls: z.ZodNumber;
        }, z.core.$strip>>>;
    }, z.core.$strip>]>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type AiTokenUsage = z.infer<typeof AiTokenUsageSchema>;
export declare const AiTokenUsageAdminQuerySchema: z.ZodObject<{
    month: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AiTokenUsageAdminQuery = z.infer<typeof AiTokenUsageAdminQuerySchema>;
export declare const AiTokenUsageFeatureRollupSchema: z.ZodObject<{
    feature: z.ZodString;
    input: z.ZodNumber;
    output: z.ZodNumber;
    total: z.ZodNumber;
    calls: z.ZodNumber;
    users: z.ZodNumber;
}, z.core.$strip>;
export type AiTokenUsageFeatureRollup = z.infer<typeof AiTokenUsageFeatureRollupSchema>;
export declare const AiTokenUsageModelRollupSchema: z.ZodObject<{
    model: z.ZodString;
    input: z.ZodNumber;
    output: z.ZodNumber;
    total: z.ZodNumber;
    calls: z.ZodNumber;
    users: z.ZodNumber;
}, z.core.$strip>;
export type AiTokenUsageModelRollup = z.infer<typeof AiTokenUsageModelRollupSchema>;
export declare const AiTokenUsageAccountRollupSchema: z.ZodObject<{
    userId: z.ZodString;
    input: z.ZodNumber;
    output: z.ZodNumber;
    total: z.ZodNumber;
    calls: z.ZodNumber;
    lastActiveMonth: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type AiTokenUsageAccountRollup = z.infer<typeof AiTokenUsageAccountRollupSchema>;
export declare const AiTokenUsageAdminSummarySchema: z.ZodObject<{
    month: z.ZodNullable<z.ZodString>;
    totals: z.ZodObject<{
        input: z.ZodNumber;
        output: z.ZodNumber;
        total: z.ZodNumber;
        calls: z.ZodNumber;
        users: z.ZodNumber;
    }, z.core.$strip>;
    byFeature: z.ZodArray<z.ZodObject<{
        feature: z.ZodString;
        input: z.ZodNumber;
        output: z.ZodNumber;
        total: z.ZodNumber;
        calls: z.ZodNumber;
        users: z.ZodNumber;
    }, z.core.$strip>>;
    byModel: z.ZodArray<z.ZodObject<{
        model: z.ZodString;
        input: z.ZodNumber;
        output: z.ZodNumber;
        total: z.ZodNumber;
        calls: z.ZodNumber;
        users: z.ZodNumber;
    }, z.core.$strip>>;
    topAccounts: z.ZodArray<z.ZodObject<{
        userId: z.ZodString;
        input: z.ZodNumber;
        output: z.ZodNumber;
        total: z.ZodNumber;
        calls: z.ZodNumber;
        lastActiveMonth: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>;
    rowsScanned: z.ZodNumber;
    truncated: z.ZodBoolean;
    generatedAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export type AiTokenUsageAdminSummary = z.infer<typeof AiTokenUsageAdminSummarySchema>;
//# sourceMappingURL=persistence.d.ts.map