/**
 * @ai-context Legacy admin realtime notifications import path | passthrough to canonical domain contract
 *
 * Legacy compatibility note:
 * Keep this module as a pure re-export so existing imports continue to resolve
 * while `shared/contracts/domain/admin-notifications` remains the single
 * canonical source of truth.
 *
 * IMPORTANT: These are intentionally PHI-minimal. Payloads should only include IDs
 * and never names, emails, notes, or clinical details.
 *
 * deps: ../domain/admin-notifications | consumers: legacy shared imports
 */

export * from "../domain/admin-notifications.js";
