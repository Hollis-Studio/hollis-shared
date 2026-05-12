/**
 * @ai-context Marketing asset contracts | Types and schemas for AI-generated marketing images
 *
 * This module provides contracts for the marketing image generation feature.
 * Images are generated via OpenAI and stored in S3.
 *
 * NOT PHI — prompts and images are brand/style content only.
 *
 * deps: zod | consumers: server/src/routes/admin/marketing, web-admin/services/marketing
 */

import { z } from "zod";
import { createPaginatedListSchema } from "./pagination.js";

// ============================================================================
// Marketing Image Record
// ============================================================================

export const MarketingImageRecordSchema = z.object({
  id: z.string().uuid(),
  prompt: z.string(),
  s3Key: z.string(),
  imageUrl: z.string().url(),
  generatedByUserId: z.string(),
  createdAt: z.string().datetime(),
});
export type MarketingImageRecord = z.infer<typeof MarketingImageRecordSchema>;

export const MARKETING_IMAGE_SIZES = ["1024x1024", "1792x1024"] as const;
export type MarketingImageSize = (typeof MARKETING_IMAGE_SIZES)[number];

// ============================================================================
// Request / Response Schemas
// ============================================================================

export const GenerateMarketingImageRequestSchema = z.object({
  prompt: z.string().min(1, "prompt is required").max(2000),
  size: z.enum(MARKETING_IMAGE_SIZES).default("1024x1024"),
});
export type GenerateMarketingImageRequest = z.infer<
  typeof GenerateMarketingImageRequestSchema
>;

export const GenerateMarketingImageResponseSchema = MarketingImageRecordSchema;
export type GenerateMarketingImageResponse = MarketingImageRecord;

export const MarketingImageListResponseSchema = createPaginatedListSchema(
  MarketingImageRecordSchema,
);
export type MarketingImageListResponse = z.infer<
  typeof MarketingImageListResponseSchema
>;
