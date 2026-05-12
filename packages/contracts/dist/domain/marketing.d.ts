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
export declare const MarketingImageRecordSchema: z.ZodObject<{
    id: z.ZodString;
    prompt: z.ZodString;
    s3Key: z.ZodString;
    imageUrl: z.ZodString;
    generatedByUserId: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type MarketingImageRecord = z.infer<typeof MarketingImageRecordSchema>;
export declare const MARKETING_IMAGE_SIZES: readonly ["1024x1024", "1792x1024"];
export type MarketingImageSize = (typeof MARKETING_IMAGE_SIZES)[number];
export declare const GenerateMarketingImageRequestSchema: z.ZodObject<{
    prompt: z.ZodString;
    size: z.ZodDefault<z.ZodEnum<{
        "1024x1024": "1024x1024";
        "1792x1024": "1792x1024";
    }>>;
}, z.core.$strip>;
export type GenerateMarketingImageRequest = z.infer<typeof GenerateMarketingImageRequestSchema>;
export declare const GenerateMarketingImageResponseSchema: z.ZodObject<{
    id: z.ZodString;
    prompt: z.ZodString;
    s3Key: z.ZodString;
    imageUrl: z.ZodString;
    generatedByUserId: z.ZodString;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type GenerateMarketingImageResponse = MarketingImageRecord;
export declare const MarketingImageListResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        prompt: z.ZodString;
        s3Key: z.ZodString;
        imageUrl: z.ZodString;
        generatedByUserId: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodNumber;
        total: z.ZodOptional<z.ZodNumber>;
        totalPages: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
        nextCursor: z.ZodOptional<z.ZodString>;
        prevCursor: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type MarketingImageListResponse = z.infer<typeof MarketingImageListResponseSchema>;
//# sourceMappingURL=marketing.d.ts.map