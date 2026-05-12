/**
 * @ai-context Registration domain contracts | barcode-based patient onboarding status tracking
 *
 * This module provides the canonical definitions for registration-related constants:
 * - Registration statuses (pending, claimed, expired)
 *
 * IMPORTANT: All registration-related enum values MUST be imported from here.
 *
 * deps: zod | consumers: all codebases
 */
import { z } from "zod";
/**
 * Status of a registered patient account.
 * - pending: Barcode generated, waiting for patient to claim
 * - claimed: Patient has claimed their account and set up credentials
 * - expired: Barcode expired before being claimed (natural timeout)
 * - rejected: Admin explicitly rejected the registration
 */
export declare const REGISTRATION_STATUSES: readonly ["pending", "claimed", "expired", "rejected"];
export declare const RegistrationStatusSchema: z.ZodEnum<{
    rejected: "rejected";
    pending: "pending";
    claimed: "claimed";
    expired: "expired";
}>;
export type RegistrationStatus = z.infer<typeof RegistrationStatusSchema>;
/** Centralized registration status constants for equality checks */
export declare const REGISTRATION_STATUS: {
    readonly PENDING: RegistrationStatus;
    readonly CLAIMED: RegistrationStatus;
    readonly EXPIRED: RegistrationStatus;
    readonly REJECTED: RegistrationStatus;
};
/** Human-readable labels for registration statuses */
export declare const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string>;
/**
 * Type guard to check if a string is a valid registration status
 */
export declare function isRegistrationStatus(value: string): value is RegistrationStatus;
//# sourceMappingURL=registration.d.ts.map