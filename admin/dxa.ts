/**
 * @ai-context Admin DXA Contracts | DXA extraction and ingest payloads
 *
 * LAYER: Contracts (shared types)
 * DOMAIN: DXA — admin-facing DXA extraction, review, and save contracts.
 *
 * deps: domain/common, domain/documents, domain/metric-codes | consumers: server DXA routes/services, web-admin DXA service/hooks
 */

import { z } from "zod";
import { isoDateSchema } from "../domain/index.js";
import {
  DOCUMENT_CATEGORY,
  DocumentCategorySchema,
} from "../domain/documents.js";
import {
  METRIC_BODY_FAT_PERCENTAGE,
  METRIC_BODY_WEIGHT,
  METRIC_LEAN_BODY_MASS,
} from "../domain/metric-codes.js";

export const DXA_TRACKED_METRICS = [
  METRIC_BODY_WEIGHT,
  METRIC_BODY_FAT_PERCENTAGE,
  METRIC_LEAN_BODY_MASS,
] as const;

export const dxaTrackedMetricSchema = z.enum(DXA_TRACKED_METRICS);
export type DxaTrackedMetric = z.infer<typeof dxaTrackedMetricSchema>;

export const DXA_TRACKED_METRIC_LABELS: Record<DxaTrackedMetric, string> = {
  [METRIC_BODY_WEIGHT]: "Body Weight",
  [METRIC_BODY_FAT_PERCENTAGE]: "Body Fat %",
  [METRIC_LEAN_BODY_MASS]: "Lean Body Mass",
};

export const DXA_METRIC_ALLOWED_UNITS: Record<DxaTrackedMetric, string[]> = {
  [METRIC_BODY_WEIGHT]: ["kg", "lb", "lbs"],
  [METRIC_BODY_FAT_PERCENTAGE]: ["%"],
  [METRIC_LEAN_BODY_MASS]: ["kg", "lb", "lbs"],
};

export const DXA_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/jpg",
] as const;

export const dxaMimeTypeSchema = z.enum(DXA_ALLOWED_MIME_TYPES);
export type DxaMimeType = z.infer<typeof dxaMimeTypeSchema>;

export const DXA_DOCUMENT_CATEGORY = DOCUMENT_CATEGORY.IMAGING;
export const DXA_DOCUMENT_TAGS = ["DXA", "body_composition"] as const;

export const extractDxaDataInputSchema = z.object({
  fileBase64: z.string().min(1, "fileBase64 is required"),
  mimeType: dxaMimeTypeSchema,
});
export type ExtractDxaDataInput = z.input<typeof extractDxaDataInputSchema>;

export const dxaExtractedMetricSchema = z.object({
  metricCode: dxaTrackedMetricSchema,
  label: z.string().min(1).max(100),
  value: z.number().finite().nullable(),
  unit: z.string().max(32).nullable(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  sourceText: z.string().max(500).nullable().optional(),
  warning: z.string().max(500).nullable().optional(),
});
export type DxaExtractedMetric = z.infer<typeof dxaExtractedMetricSchema>;

export const dxaExtraMetricSchema = z.object({
  label: z.string().min(1).max(200),
  valueText: z.string().min(1).max(200),
  unit: z.string().max(32).nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  sourceText: z.string().max(500).nullable().optional(),
});
export type DxaExtraMetric = z.infer<typeof dxaExtraMetricSchema>;

export const dxaExtractionResultSchema = z.object({
  scanDate: isoDateSchema.nullable().optional(),
  vendor: z.string().max(120).nullable().optional(),
  metrics: z.array(dxaExtractedMetricSchema).length(DXA_TRACKED_METRICS.length),
  extraMetrics: z.array(dxaExtraMetricSchema).default([]),
  warnings: z.array(z.string().max(500)).default([]),
  sourceCategory: DocumentCategorySchema.default(DXA_DOCUMENT_CATEGORY),
});
export type DxaExtractionResult = z.infer<typeof dxaExtractionResultSchema>;

export const dxaReviewedMetricInputSchema = z.object({
  metricCode: dxaTrackedMetricSchema,
  value: z.number().finite(),
  unit: z.string().min(1).max(32),
});

export const dxaExtractionSnapshotSchema = dxaExtractionResultSchema.nullable();

export const createDxaResultPayloadSchema = z
  .object({
    fileBase64: z.string().min(1, "fileBase64 is required"),
    fileName: z.string().min(1).max(255),
    mimeType: dxaMimeTypeSchema,
    scanDate: isoDateSchema,
    vendor: z.string().max(120).nullable().optional(),
    notes: z.string().max(2000).nullable().optional(),
    metrics: z.array(dxaReviewedMetricInputSchema).min(1),
    extractionSnapshot: dxaExtractionSnapshotSchema.optional(),
  })
  .superRefine((value, ctx) => {
    const seen = new Set<DxaTrackedMetric>();

    value.metrics.forEach((metric, index) => {
      if (seen.has(metric.metricCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["metrics", index, "metricCode"],
          message: "Duplicate DXA metric",
        });
      }
      seen.add(metric.metricCode);

      const normalizedUnit = metric.unit.trim().toLowerCase();
      const allowedUnits = DXA_METRIC_ALLOWED_UNITS[metric.metricCode];
      if (!allowedUnits.includes(normalizedUnit)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["metrics", index, "unit"],
          message: `Invalid unit for ${metric.metricCode}`,
        });
      }
    });
  });
export type CreateDxaResultPayload = z.input<typeof createDxaResultPayloadSchema>;

export const dxaIngestResultSchema = z.object({
  ingestId: z.string().uuid(),
  documentId: z.string().uuid(),
  savedMetricCodes: z.array(dxaTrackedMetricSchema).min(1),
});
export type DxaIngestResult = z.infer<typeof dxaIngestResultSchema>;
