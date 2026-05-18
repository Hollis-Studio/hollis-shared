# Phase D Public Export and Relocation Candidates

- **Created:** 2026-05-12
- **Context:** Phase B cannot delete every local `*/contracts/*` file blindly because some files are local-only surface contracts, storage keys, form schemas, or mocks rather than pure shared re-exports.
- **Rule:** shared suite concepts move to `@hollis/contracts` public exports; app-local concerns move out of `contracts/` directories to surface-owned modules. No intermediate compatibility barrels.

## Mobile Candidates

| Current path | Current consumers | Disposition needed | Rationale |
|---|---:|---|---|
| `src/contracts/storageKeys.ts` | runtime storage services + tests | Relocate to a mobile-owned constants module or promote suite-safe keys to `@hollis/contracts` | Storage keys are app runtime concerns today; keeping them under `contracts/` creates a local shared-type barrel. |
| `src/contracts/auth.ts` | auth services, stores, bootstrap, tests | Promote reusable auth session/request types or relocate mobile-only wrappers | `AuthSession`, `AuthService`, listeners, provider requests, and token stripping are used like contracts but are not currently public package exports. |
| `src/contracts/user/schemas.ts` | onboarding/edit-profile screens | Relocate form schemas or promote only cross-suite user schemas | Mobile form validation is UI-surface-specific unless the exact schema is intended for all suite apps. |
| `src/contracts/user/mocks.ts` | settings/admin notification hooks | Relocate defaults/mocks outside `contracts/` | Runtime notification defaults are mobile app configuration, not shared contracts. |
| `src/contracts/validation/*` | tests and compatibility imports | Replace with public `@hollis/contracts` schemas or relocate app-only validation | Compatibility validation aliases preserve the fuzzy boundary. |
| `src/contracts/healthData.ts` | HealthKit/Health Connect hooks/tests | Split platform payload helpers from shared health data contracts | Platform integration helpers are mobile-specific; shared data shapes may belong in package exports. |
| `src/contracts/phi/*` | PHI services/tests | Reconcile with shared PHI/labs contracts or relocate local adapters | These carry documented shape drift and need deliberate contract ownership. |
| `src/contracts/healthProgress/mocks.ts` and other `createMock*` exports | tests | Move test fixtures to test helpers or promote package test factories intentionally | Test mocks should not require a local contracts barrel. |
| `src/contracts/permissions.ts` | UI permission checks | Determine whether permission constants are suite contracts | No obvious direct shared replacement from the initial map. |

| Current path | Disposition needed | Rationale |
|---|---|---|
| `web-admin/contracts/storageKeys.ts` | Relocate to `web-admin/lib` or a local constants module | Browser storage keys are surface-owned unless deliberately suite-wide. |
| `web-admin/contracts/validation/*` | Relocate to `web-admin/validation` or promote exact shared schemas | Admin form validation intentionally diverges from shared AI/domain contracts today; that cannot remain under a local contracts barrel. |
| `web-admin/contracts/validation/messages.schema.ts` | Split shared message types from local upload response | `SendMessageRequest`, unread counts, and user search may be shared; `FileUploadResponse` remains local-only from the mapper. |
| `web-admin/contracts/validation/registration.schema.ts` | Split signed document payload from local draft/form-state schemas | `SignedDocumentPayload` may come from `@hollis/contracts/admin`; registration draft state is web-admin-local. |
| `web-admin/contracts/validation/patient.schema.ts` | Decide whether `PatientDetailsSchema` belongs in shared admin contracts | Current mapper identified it as a web-admin extension of shared account/user shape. |
| `web-admin/contracts/validation/auth.schema.ts` | Relocate or promote web-admin auth normalization schemas | These normalize web-admin auth/session payloads and are not a direct package swap. |
| `web-admin/contracts/validation/biometrics.schema.ts` | Relocate derived `WeightDataPoint` shape or promote intentionally | Currently consumed by profile/weight UI. |

### Web Admin Decision — 2026-05-12 PM

The unresolved web-admin validation candidates remain web-admin-local under
`web-admin/validation/` for this extraction. The schemas for patient details,
admin auth/session normalization, biometrics/weight UI data, registration draft
state, and message upload responses are surface-owned validation/adaptation
modules rather than stable suite contracts. No new `@hollis/contracts/admin`
subpath is promoted in Phase G/H. Future promotion should happen only when a
second suite consumer needs the exact same request/response shape and the
package `exports` map plus `SCHEMA_INDEX.md` are updated deliberately.

## Server Candidates

Server pure passthrough was removed in Phase B commit `v3.7.34 unwind local contracts barrel in server`.
