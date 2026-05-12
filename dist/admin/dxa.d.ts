/**
 * @ai-context Admin DXA Contracts | DXA extraction and ingest payloads
 *
 * LAYER: Contracts (shared types)
 * DOMAIN: DXA — admin-facing DXA extraction, review, and save contracts.
 *
 * deps: domain/common, domain/documents, domain/metric-codes | consumers: server DXA routes/services, web-admin DXA service/hooks
 */
import { z } from "zod";
export declare const DXA_TRACKED_METRICS: readonly ["body_weight", "body_fat_percentage", "lean_body_mass"];
export declare const dxaTrackedMetricSchema: z.ZodEnum<{
    body_weight: "body_weight";
    body_fat_percentage: "body_fat_percentage";
    lean_body_mass: "lean_body_mass";
}>;
export type DxaTrackedMetric = z.infer<typeof dxaTrackedMetricSchema>;
export declare const DXA_TRACKED_METRIC_LABELS: Record<DxaTrackedMetric, string>;
export declare const DXA_METRIC_ALLOWED_UNITS: Record<DxaTrackedMetric, string[]>;
export declare const DXA_ALLOWED_MIME_TYPES: readonly ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/jpg"];
export declare const dxaMimeTypeSchema: z.ZodEnum<{
    "image/jpeg": "image/jpeg";
    "image/png": "image/png";
    "image/webp": "image/webp";
    "application/pdf": "application/pdf";
    "image/heic": "image/heic";
    "image/heif": "image/heif";
    "image/jpg": "image/jpg";
}>;
export type DxaMimeType = z.infer<typeof dxaMimeTypeSchema>;
export declare const DXA_DOCUMENT_CATEGORY: "IMAGING";
export declare const DXA_DOCUMENT_TAGS: readonly ["DXA", "body_composition"];
export declare const extractDxaDataInputSchema: z.ZodObject<{
    fileBase64: z.ZodString;
    mimeType: z.ZodEnum<{
        "image/jpeg": "image/jpeg";
        "image/png": "image/png";
        "image/webp": "image/webp";
        "application/pdf": "application/pdf";
        "image/heic": "image/heic";
        "image/heif": "image/heif";
        "image/jpg": "image/jpg";
    }>;
}, z.core.$strip>;
export type ExtractDxaDataInput = z.input<typeof extractDxaDataInputSchema>;
export declare const dxaExtractedMetricSchema: z.ZodObject<{
    metricCode: z.ZodEnum<{
        body_weight: "body_weight";
        body_fat_percentage: "body_fat_percentage";
        lean_body_mass: "lean_body_mass";
    }>;
    label: z.ZodString;
    value: z.ZodNullable<z.ZodNumber>;
    unit: z.ZodNullable<z.ZodString>;
    confidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sourceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    warning: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type DxaExtractedMetric = z.infer<typeof dxaExtractedMetricSchema>;
export declare const dxaExtraMetricSchema: z.ZodObject<{
    label: z.ZodString;
    valueText: z.ZodString;
    unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    confidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sourceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type DxaExtraMetric = z.infer<typeof dxaExtraMetricSchema>;
export declare const dxaExtractionResultSchema: z.ZodObject<{
    scanDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vendor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metrics: z.ZodArray<z.ZodObject<{
        metricCode: z.ZodEnum<{
            body_weight: "body_weight";
            body_fat_percentage: "body_fat_percentage";
            lean_body_mass: "lean_body_mass";
        }>;
        label: z.ZodString;
        value: z.ZodNullable<z.ZodNumber>;
        unit: z.ZodNullable<z.ZodString>;
        confidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sourceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        warning: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    extraMetrics: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        valueText: z.ZodString;
        unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        confidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sourceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
    warnings: z.ZodDefault<z.ZodArray<z.ZodString>>;
    sourceCategory: z.ZodDefault<z.ZodEnum<{
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
}, z.core.$strip>;
export type DxaExtractionResult = z.infer<typeof dxaExtractionResultSchema>;
export declare const dxaReviewedMetricInputSchema: z.ZodObject<{
    metricCode: z.ZodEnum<{
        body_weight: "body_weight";
        body_fat_percentage: "body_fat_percentage";
        lean_body_mass: "lean_body_mass";
    }>;
    value: z.ZodNumber;
    unit: z.ZodString;
}, z.core.$strip>;
export declare const dxaExtractionSnapshotSchema: z.ZodNullable<z.ZodObject<{
    scanDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vendor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metrics: z.ZodArray<z.ZodObject<{
        metricCode: z.ZodEnum<{
            body_weight: "body_weight";
            body_fat_percentage: "body_fat_percentage";
            lean_body_mass: "lean_body_mass";
        }>;
        label: z.ZodString;
        value: z.ZodNullable<z.ZodNumber>;
        unit: z.ZodNullable<z.ZodString>;
        confidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sourceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        warning: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    extraMetrics: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        valueText: z.ZodString;
        unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        confidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sourceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
    warnings: z.ZodDefault<z.ZodArray<z.ZodString>>;
    sourceCategory: z.ZodDefault<z.ZodEnum<{
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
}, z.core.$strip>>;
export declare const createDxaResultPayloadSchema: z.ZodObject<{
    fileBase64: z.ZodString;
    fileName: z.ZodString;
    mimeType: z.ZodEnum<{
        "image/jpeg": "image/jpeg";
        "image/png": "image/png";
        "image/webp": "image/webp";
        "application/pdf": "application/pdf";
        "image/heic": "image/heic";
        "image/heif": "image/heif";
        "image/jpg": "image/jpg";
    }>;
    scanDate: z.ZodString;
    vendor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metrics: z.ZodArray<z.ZodObject<{
        metricCode: z.ZodEnum<{
            body_weight: "body_weight";
            body_fat_percentage: "body_fat_percentage";
            lean_body_mass: "lean_body_mass";
        }>;
        value: z.ZodNumber;
        unit: z.ZodString;
    }, z.core.$strip>>;
    extractionSnapshot: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        scanDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        vendor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        metrics: z.ZodArray<z.ZodObject<{
            metricCode: z.ZodEnum<{
                body_weight: "body_weight";
                body_fat_percentage: "body_fat_percentage";
                lean_body_mass: "lean_body_mass";
            }>;
            label: z.ZodString;
            value: z.ZodNullable<z.ZodNumber>;
            unit: z.ZodNullable<z.ZodString>;
            confidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sourceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            warning: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>;
        extraMetrics: z.ZodDefault<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            valueText: z.ZodString;
            unit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            confidence: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            sourceText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        warnings: z.ZodDefault<z.ZodArray<z.ZodString>>;
        sourceCategory: z.ZodDefault<z.ZodEnum<{
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
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateDxaResultPayload = z.input<typeof createDxaResultPayloadSchema>;
export declare const dxaIngestResultSchema: z.ZodObject<{
    ingestId: z.ZodString;
    documentId: z.ZodString;
    savedMetricCodes: z.ZodArray<z.ZodEnum<{
        body_weight: "body_weight";
        body_fat_percentage: "body_fat_percentage";
        lean_body_mass: "lean_body_mass";
    }>>;
}, z.core.$strip>;
export type DxaIngestResult = z.infer<typeof dxaIngestResultSchema>;
//# sourceMappingURL=dxa.d.ts.map