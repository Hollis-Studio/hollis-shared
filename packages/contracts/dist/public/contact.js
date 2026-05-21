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
// ============================================================================
// CONTACT FORM TYPES
// ============================================================================
/**
 * Types of contact form submissions.
 * - CONTACT: General inquiry or consultation request
 * - NEWSLETTER: Email newsletter signup only
 */
export const CONTACT_TYPES = ["CONTACT", "NEWSLETTER"];
export const ContactTypeSchema = z.enum(CONTACT_TYPES);
/**
 * Lead sources for tracking marketing attribution.
 * Includes admin-only sources (PHONE_CALL, WALK_IN) for manually-created leads.
 */
export const CONTACT_SOURCES = [
    "PHONE_CALL",
    "WALK_IN",
    "WEBSITE",
    "REFERRAL",
    "SOCIAL_MEDIA",
    "GOOGLE",
    "OTHER",
];
export const ContactSourceSchema = z.enum(CONTACT_SOURCES);
/**
 * Alias for ContactSourceSchema — use when referencing lead pipeline sources
 * in admin routes and services.
 */
export const LeadSourceSchema = ContactSourceSchema;
export const LEAD_SOURCES = CONTACT_SOURCES;
/**
 * Submission intent for public form flows that share the same endpoint.
 */
export const CONTACT_SUBMISSION_INTENTS = ["GENERAL", "WAITLIST"];
export const ContactSubmissionIntentSchema = z.enum(CONTACT_SUBMISSION_INTENTS);
/** Named constant for waitlist intent — avoids fragile index access into the tuple. */
export const WAITLIST_INTENT = "WAITLIST";
// ============================================================================
// CONTACT FORM SCHEMA
// ============================================================================
/**
 * Contact form submission schema.
 * Validates both contact inquiries and newsletter signups.
 */
export const ContactFormSchema = z.object({
    /** Submission type */
    type: ContactTypeSchema.default("CONTACT"),
    /** Full name - required for contact, optional for newsletter */
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    /** Email address - always required */
    email: z.string().email("Please enter a valid email address"),
    /** Phone number - optional */
    phone: z.string().max(20, "Phone number is too long").optional(),
    /** Message - required for contact, optional for newsletter */
    message: z.string().max(2000, "Message is too long").optional(),
    /** Marketing attribution source */
    source: ContactSourceSchema.optional(),
    /** Which public-site flow generated the submission */
    submissionIntent: ContactSubmissionIntentSchema.optional(),
    /** How did you hear about us? Free text */
    referralInfo: z.string().max(200).optional(),
    /** Which membership tier are they interested in? */
    interestedTier: z.enum(["ESSENTIALS", "CORE", "CONCIERGE"]).optional(),
});
export function isWaitlistSubmission(formData) {
    return formData.submissionIntent === WAITLIST_INTENT;
}
/**
 * Stricter schema for contact inquiries (name and message required).
 */
export const ContactInquirySchema = ContactFormSchema.extend({
    type: z.literal("CONTACT"),
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    message: z
        .string()
        .min(10, "Please provide more details")
        .max(2000, "Message is too long"),
});
/**
 * Simpler schema for newsletter signups (only email required).
 */
export const NewsletterSignupSchema = z.object({
    type: z.literal("NEWSLETTER"),
    email: z.string().email("Please enter a valid email address"),
    name: z.string().max(100).optional(),
    source: ContactSourceSchema.optional(),
});
export const billingVerifyTokenQuerySchema = z.object({
    token: z.string().min(1, "token is required"),
});
export const unsubscribeTokenQuerySchema = z.object({
    token: z.string().min(1, "token is required"),
});
export const unsubscribeTokenBodySchema = z.object({
    token: z.string().min(1, "token is required"),
});
//# sourceMappingURL=contact.js.map