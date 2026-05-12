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
// ============================================================================
// REGISTRATION STATUS
// ============================================================================
/**
 * Status of a registered patient account.
 * - pending: Barcode generated, waiting for patient to claim
 * - claimed: Patient has claimed their account and set up credentials
 * - expired: Barcode expired before being claimed (natural timeout)
 * - rejected: Admin explicitly rejected the registration
 */
export const REGISTRATION_STATUSES = [
    "pending",
    "claimed",
    "expired",
    "rejected",
];
export const RegistrationStatusSchema = z.enum(REGISTRATION_STATUSES);
/** Centralized registration status constants for equality checks */
export const REGISTRATION_STATUS = {
    PENDING: "pending",
    CLAIMED: "claimed",
    EXPIRED: "expired",
    REJECTED: "rejected",
};
/** Human-readable labels for registration statuses */
export const REGISTRATION_STATUS_LABELS = {
    pending: "Pending",
    claimed: "Claimed",
    expired: "Expired",
    rejected: "Rejected",
};
/**
 * Type guard to check if a string is a valid registration status
 */
export function isRegistrationStatus(value) {
    return REGISTRATION_STATUSES.includes(value);
}
//# sourceMappingURL=registration.js.map