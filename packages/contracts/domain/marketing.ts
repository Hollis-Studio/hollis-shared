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

// ============================================================================
// Request / Response Schemas
// ============================================================================

export const GenerateMarketingImageRequestSchema = z.object({
  prompt: z.string().min(1, "prompt is required").max(2000),
  size: z.enum(["1024x1024", "1792x1024"]).default("1024x1024"),
});
export type GenerateMarketingImageRequest = z.infer<
  typeof GenerateMarketingImageRequestSchema
>;

export const GenerateMarketingImageResponseSchema = MarketingImageRecordSchema;
export type GenerateMarketingImageResponse = MarketingImageRecord;

export const MarketingImageListResponseSchema = z.object({
  data: z.array(MarketingImageRecordSchema),
  pagination: z.object({
    total: z.number().int(),
    limit: z.number().int(),
    offset: z.number().int(),
    hasMore: z.boolean(),
  }),
});
export type MarketingImageListResponse = z.infer<
  typeof MarketingImageListResponseSchema
>;
