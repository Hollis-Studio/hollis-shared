/**
 * @ai-context Admin Labs Contracts | lab metric management, extraction, and order types
 *
 * LAYER: Contracts (shared types)
 * DOMAIN: Labs — admin-facing lab management types for metric search/creation,
 *         PDF/image extraction, lab order CRUD, and observation attachment.
 *
 * deps: admin-types, domain/labs, domain/businessAnalytics | consumers: web-admin/services/admin/labsService.ts, server/src/routes/admin/labs/*
 */
import { z } from "zod";
import type { LabMetricSearchResponseFromSchema, PendingMetricsResponseFromSchema } from "./admin-schemas.js";
/** Parameters for semantic lab metric search */
export declare const labMetricSearchParamsSchema: z.ZodObject<{
    q: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/** Parameters for semantic lab metric search */
export type LabMetricSearchParams = z.input<typeof labMetricSearchParamsSchema>;
/** Response for pending metric governance reviews */
export type PendingMetricsResponse = PendingMetricsResponseFromSchema;
/** Response from lab metric semantic search */
export type LabMetricSearchResponse = LabMetricSearchResponseFromSchema;
/** Input for creating a new lab metric definition */
export declare const createLabMetricDefinitionInputSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
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
    variabilityThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    aliases: z.ZodOptional<z.ZodArray<z.ZodString>>;
    optimalRangeLow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    optimalRangeHigh: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** Input for creating a new lab metric definition */
export type CreateLabMetricDefinitionInput = z.input<typeof createLabMetricDefinitionInputSchema>;
/** Input for extracting lab data from a document (PDF or image) */
export declare const extractLabDataInputSchema: z.ZodObject<{
    fileBase64: z.ZodString;
    mimeType: z.ZodString;
}, z.core.$strip>;
/** Input for extracting lab data from a document (PDF or image) */
export type ExtractLabDataInput = z.input<typeof extractLabDataInputSchema>;
/**
 * Zod schema for LabOrderDetailResponse — validates the GET /lab-orders/:id response.
 */
export declare const LabOrderDetailResponseSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    reportDate: z.ZodString;
    labName: z.ZodNullable<z.ZodString>;
    labLocation: z.ZodNullable<z.ZodString>;
    specimenType: z.ZodNullable<z.ZodString>;
    orderingProvider: z.ZodNullable<z.ZodString>;
    panelName: z.ZodNullable<z.ZodString>;
    panelCode: z.ZodNullable<z.ZodString>;
    notes: z.ZodNullable<z.ZodString>;
    orderStatus: z.ZodEnum<{
        ORDERED: "ORDERED";
        KIT_SENT: "KIT_SENT";
        SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
        RESULTS_PENDING: "RESULTS_PENDING";
        RESULTS_REVIEWED: "RESULTS_REVIEWED";
        RESULTS_PUBLISHED: "RESULTS_PUBLISHED";
    }>;
    observations: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        rawAnalyteName: z.ZodString;
        rawValueText: z.ZodNullable<z.ZodString>;
        rawUnit: z.ZodNullable<z.ZodString>;
        rawReferenceIntervalLow: z.ZodNullable<z.ZodNumber>;
        rawReferenceIntervalHigh: z.ZodNullable<z.ZodNumber>;
        rawFlag: z.ZodNullable<z.ZodString>;
        canonicalValue: z.ZodNullable<z.ZodNumber>;
        canonicalUnit: z.ZodNullable<z.ZodString>;
        metricDefinitionId: z.ZodNullable<z.ZodString>;
        mappingStatus: z.ZodEnum<{
            MATCHED: "MATCHED";
            CREATED: "CREATED";
            REVIEW_NEEDED: "REVIEW_NEEDED";
            MANUAL_OVERRIDE: "MANUAL_OVERRIDE";
        }>;
        mappingConfidence: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Response type for a single lab order with all its observations */
export type LabOrderDetailResponse = z.infer<typeof LabOrderDetailResponseSchema>;
/** Input for attaching observations to an existing lab order */
export declare const attachObservationsInputSchema: z.ZodObject<{
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
    actualReportDate: z.ZodOptional<z.ZodString>;
    transitionToResultsPending: z.ZodOptional<z.ZodBoolean>;
    extractionConfidences: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>>;
    extractionFragments: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
/** Input for attaching observations to an existing lab order */
export type AttachObservationsInput = z.input<typeof attachObservationsInputSchema>;
/** Input for creating a new lab order */
export declare const createLabOrderInputSchema: z.ZodObject<{
    reportDate: z.ZodString;
    panelName: z.ZodString;
    labName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    labLocation: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    orderingProvider: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    specimenType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    panelCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    orderStatus: z.ZodOptional<z.ZodEnum<{
        ORDERED: "ORDERED";
        SAMPLE_RECEIVED: "SAMPLE_RECEIVED";
        RESULTS_PENDING: "RESULTS_PENDING";
    }>>;
}, z.core.$strip>;
/** Input for creating a new lab order */
export type CreateLabOrderInput = z.input<typeof createLabOrderInputSchema>;
//# sourceMappingURL=labs.d.ts.map