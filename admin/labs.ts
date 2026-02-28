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
import type { LabOrderStatus } from "../domain/businessAnalytics";
import { LabOrderStatusSchema } from "../domain/businessAnalytics";
import type {
    LabMetricCategory,
    LabMetricDirectionality,
} from "../domain/labs";
import type {
    LabMetricDefinitionSummary,
    PendingMetricReview,
} from "./admin-schemas";
import type { LabObservationInput } from "./admin-types";

// ============================================================================
// SEARCH & METRIC DEFINITION
// ============================================================================

/** Parameters for semantic lab metric search */
export interface LabMetricSearchParams {
  /** Search query string (semantic search) */
  q: string;
  /** Maximum number of results to return */
  limit?: number;
}

/** Response for pending metric governance reviews */
export interface PendingMetricsResponse {
  metrics: PendingMetricReview[];
  total: number;
}

/** Response from lab metric semantic search */
export interface LabMetricSearchResponse {
  results: LabMetricDefinitionSummary[];
}

/** Input for creating a new lab metric definition */
export interface CreateLabMetricDefinitionInput {
  /** Human-readable name for the biomarker */
  name: string;
  /** Unique code identifier (e.g., "HBA1C", "TSH") */
  code?: string;
  /** Category for grouping */
  category: LabMetricCategory;
  /** Standard unit for this metric */
  canonicalUnit: string;
  /** How to interpret changes in value */
  directionality: LabMetricDirectionality;
  /** Threshold for meaningful change (0-1, percentage) */
  variabilityThreshold?: number | null;
  /** Alternative names/abbreviations */
  aliases?: string[];
  /** Lower bound of the optimal reference range */
  optimalRangeLow?: number | null;
  /** Upper bound of the optimal reference range */
  optimalRangeHigh?: number | null;
  /** User-facing description of what this metric measures and why it matters */
  description?: string | null;
  /** User ID of the admin who created this definition */
  createdBy?: string | null;
}

// ============================================================================
// EXTRACTION
// ============================================================================

/** Input for extracting lab data from a document (PDF or image) */
export interface ExtractLabDataInput {
  /** Base64-encoded file content */
  fileBase64: string;
  /** MIME type of the file (e.g., 'application/pdf', 'image/jpeg') */
  mimeType: string;
}

// ============================================================================
// LAB ORDERS & OBSERVATIONS
// ============================================================================

/** Response type for a single lab order with all its observations */
export interface LabOrderDetailResponse {
  id: string;
  userId: string;
  reportDate: string;
  labName: string | null;
  labLocation: string | null;
  specimenType: string | null;
  orderingProvider: string | null;
  panelName: string | null;
  panelCode: string | null;
  notes: string | null;
  orderStatus: LabOrderStatus;
  observations: {
    id: string;
    rawAnalyteName: string;
    rawValueText: string | null;
    rawUnit: string | null;
    rawReferenceIntervalLow: number | null;
    rawReferenceIntervalHigh: number | null;
    rawFlag: string | null;
    canonicalValue: number | null;
    canonicalUnit: string | null;
    metricDefinitionId: string | null;
    mappingStatus: string;
    mappingConfidence: number | null;
  }[];
}

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
  observations: z.array(
    z.object({
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
      mappingStatus: z.string(),
      mappingConfidence: z.number().nullable(),
    }),
  ),
});

/** Input for attaching observations to an existing lab order */
export interface AttachObservationsInput {
  observations: LabObservationInput[];
  /** If true, transitions the order to RESULTS_PENDING status */
  transitionToResultsPending?: boolean;
}

/** Input for creating a new lab order */
export interface CreateLabOrderInput {
  /** Date of the lab report (ISO date string) */
  reportDate: string;
  /** Name of the lab panel */
  panelName: string;
  /** Name of the laboratory */
  labName?: string;
  /** Physical location of the lab */
  labLocation?: string;
  /** Name of the ordering provider */
  orderingProvider?: string;
  /** Type of specimen (e.g., "Blood", "Urine") */
  specimenType?: string;
  /** Lab code for the panel */
  panelCode?: string;
  /** Additional notes */
  notes?: string;
  /** Initial order status (defaults to ORDERED) */
  orderStatus?: "ORDERED" | "SAMPLE_RECEIVED" | "RESULTS_PENDING";
}
