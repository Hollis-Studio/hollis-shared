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
import { isoDateSchema } from "../domain/index.js";
import { LabOrderStatusSchema } from "../domain/businessAnalytics.js";
import { LabMappingStatusSchema, LabMetricCategorySchema, LabMetricDirectionalitySchema, } from "../domain/labs.js";
import { userIdSchema } from "../schemas/index.js";
import { labObservationInputSchema } from "./admin-schemas.js";
// ============================================================================
// SEARCH & METRIC DEFINITION
// ============================================================================
/** Parameters for semantic lab metric search */
export const labMetricSearchParamsSchema = z.object({
    /** Search query string (semantic search) */
    q: z.string(),
    /** Maximum number of results to return */
    limit: z.number().int().min(1).max(200).optional(),
});
/** Input for creating a new lab metric definition */
export const createLabMetricDefinitionInputSchema = z.object({
    /** Human-readable name for the biomarker */
    name: z.string().min(1).max(200),
    /** Unique code identifier (e.g., "HBA1C", "TSH") */
    code: z.string().min(1).max(100).optional(),
    /** Category for grouping */
    category: LabMetricCategorySchema,
    /** Standard unit for this metric */
    canonicalUnit: z.string().min(1).max(50),
    /** How to interpret changes in value */
    directionality: LabMetricDirectionalitySchema,
    /** Threshold for meaningful change (0-1, percentage) */
    variabilityThreshold: z.number().min(0).max(1).nullable().optional(),
    /** Alternative names/abbreviations */
    aliases: z.array(z.string().max(200)).optional(),
    /** Lower bound of the optimal reference range */
    optimalRangeLow: z.number().nullable().optional(),
    /** Upper bound of the optimal reference range */
    optimalRangeHigh: z.number().nullable().optional(),
    /** User-facing description of what this metric measures and why it matters */
    description: z.string().max(500).nullable().optional(),
    /** User ID of the admin who created this definition */
    createdBy: userIdSchema.nullable().optional(),
});
// ============================================================================
// EXTRACTION
// ============================================================================
/** Input for extracting lab data from a document (PDF or image) */
export const extractLabDataInputSchema = z.object({
    /** Base64-encoded file content */
    fileBase64: z.string().min(1, "fileBase64 is required"),
    /** MIME type of the file (e.g., 'application/pdf', 'image/jpeg') */
    mimeType: z.string().min(1, "mimeType is required"),
});
// ============================================================================
// LAB ORDERS & OBSERVATIONS
// ============================================================================
const labOrderDetailObservationSchema = z.object({
    id: z.string(),
    rawAnalyteName: z.string(),
    rawValueText: z.string().nullable(),
    rawUnit: z.string().nullable(),
    rawReferenceIntervalLow: z.number().nullable(),
    rawReferenceIntervalHigh: z.number().nullable(),
    rawFlag: z.string().nullable(),
    canonicalValue: z.number().nullable(),
    canonicalUnit: z.string().nullable(),
    metricDefinitionId: z.string().nullable(),
    mappingStatus: LabMappingStatusSchema,
    mappingConfidence: z.number().nullable(),
});
/**
 * Zod schema for LabOrderDetailResponse — validates the GET /lab-orders/:id response.
 */
export const LabOrderDetailResponseSchema = z.object({
    id: z.string(),
    userId: z.string(),
    reportDate: z.string(),
    labName: z.string().nullable(),
    labLocation: z.string().nullable(),
    specimenType: z.string().nullable(),
    orderingProvider: z.string().nullable(),
    panelName: z.string().nullable(),
    panelCode: z.string().nullable(),
    notes: z.string().nullable(),
    orderStatus: LabOrderStatusSchema,
    observations: z.array(labOrderDetailObservationSchema),
});
/** Input for attaching observations to an existing lab order */
export const attachObservationsInputSchema = z.object({
    observations: z
        .array(labObservationInputSchema)
        .min(1, "At least one observation is required"),
    /** Override the order report date with the finalized report date */
    actualReportDate: isoDateSchema.optional(),
    /** If true, transitions the order to RESULTS_PENDING status */
    transitionToResultsPending: z.boolean().optional(),
    extractionConfidences: z.record(z.string(), z.number()).nullable().optional(),
    extractionFragments: z.record(z.string(), z.string()).nullable().optional(),
});
const pendingLabOrderStatuses = [
    "ORDERED",
    "SAMPLE_RECEIVED",
    "RESULTS_PENDING",
];
/** Input for creating a new lab order */
export const createLabOrderInputSchema = z.object({
    /** Date of the lab report (ISO date string) */
    reportDate: isoDateSchema,
    /** Name of the lab panel */
    panelName: z.string().min(1, "Panel name is required").max(200),
    /** Name of the laboratory */
    labName: z.string().max(200).optional().nullable(),
    /** Physical location of the lab */
    labLocation: z.string().max(200).optional().nullable(),
    /** Name of the ordering provider */
    orderingProvider: z.string().max(200).optional().nullable(),
    /** Type of specimen (e.g., "Blood", "Urine") */
    specimenType: z.string().max(200).optional().nullable(),
    /** Lab code for the panel */
    panelCode: z.string().max(100).optional().nullable(),
    /** Additional notes */
    notes: z.string().max(2000).nullable().optional(),
    /** Initial order status (defaults to ORDERED) */
    orderStatus: LabOrderStatusSchema.extract(pendingLabOrderStatuses).optional(),
});
//# sourceMappingURL=labs.js.map