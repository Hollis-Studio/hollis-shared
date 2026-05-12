/**
 * @ai-context Public contact form contracts | schema and types for contact/newsletter submissions
 *
 * Used by:
 * - Server: Validates POST /public/contact requests
 * - Web-public: Client-side form validation
 *
 * deps: zod | consumers: server/routes/public.router.ts, web-public/components/sections/ContactForm.tsx
 */
import { z } from "zod";
/**
 * Types of contact form submissions.
 * - CONTACT: General inquiry or consultation request
 * - NEWSLETTER: Email newsletter signup only
 */
export declare const CONTACT_TYPES: readonly ["CONTACT", "NEWSLETTER"];
export declare const ContactTypeSchema: z.ZodEnum<{
    CONTACT: "CONTACT";
    NEWSLETTER: "NEWSLETTER";
}>;
export type ContactType = z.infer<typeof ContactTypeSchema>;
/**
 * Lead sources for tracking marketing attribution.
 */
export declare const CONTACT_SOURCES: readonly ["WEBSITE", "REFERRAL", "SOCIAL_MEDIA", "GOOGLE", "OTHER"];
export declare const ContactSourceSchema: z.ZodEnum<{
    REFERRAL: "REFERRAL";
    OTHER: "OTHER";
    GOOGLE: "GOOGLE";
    WEBSITE: "WEBSITE";
    SOCIAL_MEDIA: "SOCIAL_MEDIA";
}>;
export type ContactSource = z.infer<typeof ContactSourceSchema>;
/**
 * Submission intent for public form flows that share the same endpoint.
 */
export declare const CONTACT_SUBMISSION_INTENTS: readonly ["GENERAL", "WAITLIST"];
export declare const ContactSubmissionIntentSchema: z.ZodEnum<{
    GENERAL: "GENERAL";
    WAITLIST: "WAITLIST";
}>;
export type ContactSubmissionIntent = z.infer<typeof ContactSubmissionIntentSchema>;
/** Named constant for waitlist intent — avoids fragile index access into the tuple. */
export declare const WAITLIST_INTENT: ContactSubmissionIntent;
/**
 * Contact form submission schema.
 * Validates both contact inquiries and newsletter signups.
 */
export declare const ContactFormSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<{
        CONTACT: "CONTACT";
        NEWSLETTER: "NEWSLETTER";
    }>>;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        REFERRAL: "REFERRAL";
        OTHER: "OTHER";
        GOOGLE: "GOOGLE";
        WEBSITE: "WEBSITE";
        SOCIAL_MEDIA: "SOCIAL_MEDIA";
    }>>;
    submissionIntent: z.ZodOptional<z.ZodEnum<{
        GENERAL: "GENERAL";
        WAITLIST: "WAITLIST";
    }>>;
    referralInfo: z.ZodOptional<z.ZodString>;
    interestedTier: z.ZodOptional<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
}, z.core.$strip>;
export type ContactFormInput = z.infer<typeof ContactFormSchema>;
export declare function isWaitlistSubmission(formData: Pick<ContactFormInput, "submissionIntent">): boolean;
/**
 * Stricter schema for contact inquiries (name and message required).
 */
export declare const ContactInquirySchema: z.ZodObject<{
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        REFERRAL: "REFERRAL";
        OTHER: "OTHER";
        GOOGLE: "GOOGLE";
        WEBSITE: "WEBSITE";
        SOCIAL_MEDIA: "SOCIAL_MEDIA";
    }>>;
    submissionIntent: z.ZodOptional<z.ZodEnum<{
        GENERAL: "GENERAL";
        WAITLIST: "WAITLIST";
    }>>;
    referralInfo: z.ZodOptional<z.ZodString>;
    interestedTier: z.ZodOptional<z.ZodEnum<{
        ESSENTIALS: "ESSENTIALS";
        CORE: "CORE";
        CONCIERGE: "CONCIERGE";
    }>>;
    type: z.ZodLiteral<"CONTACT">;
    name: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
export type ContactInquiryInput = z.infer<typeof ContactInquirySchema>;
/**
 * Simpler schema for newsletter signups (only email required).
 */
export declare const NewsletterSignupSchema: z.ZodObject<{
    type: z.ZodLiteral<"NEWSLETTER">;
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        REFERRAL: "REFERRAL";
        OTHER: "OTHER";
        GOOGLE: "GOOGLE";
        WEBSITE: "WEBSITE";
        SOCIAL_MEDIA: "SOCIAL_MEDIA";
    }>>;
}, z.core.$strip>;
export type NewsletterSignupInput = z.infer<typeof NewsletterSignupSchema>;
/**
 * API response for contact form submission.
 */
export interface ContactFormResponse {
    success: boolean;
    message: string;
    /** If a CRM Lead was created, its ID */
    leadId?: string;
}
//# sourceMappingURL=contact.d.ts.map