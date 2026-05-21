# @hollis-studio/contracts — Release Notes

## 0.2.0-alpha.12 (2026-05-20)

All changes are **additive / backward-compatible**. No existing exports were
modified or removed.

### Consent & HIPAA

- **`HIPAA_NPP`** added to `DOCUMENT_REGISTRY` in
  `admin/legal-documents/index.ts`. The HIPAA Notice of Privacy Practices
  module (`meta`, `content`, `initialsSections`) is now exported alongside the
  other consent documents at `@hollis-studio/contracts/admin/legal-documents`.
  This lets the server drop its local `services/consent/hipaaNpp.ts` bypass and
  treat HIPAA_NPP uniformly with the other registered documents.
- **`HipaaNpp`** namespace and `hipaaNpp` namespaced module export added at
  `@hollis-studio/contracts/admin/legal-documents`.

## 0.2.0-alpha.11 (2026-05-20)

All changes are **additive / backward-compatible**. No existing exports were
modified or removed.

### Consent & HIPAA

- **`HIPAA_NPP`** added to `CONSENT_DOCUMENT_TYPES` enum and `REQUIRED_CONSENT_DOCS`
  array in `admin/consent-schemas.ts`. The NPP (Notice of Privacy Practices,
  45 CFR §164.520) must now be acknowledged at or before first service; the
  contracts package enforces it as a required document type.

### Lead / Contact Sources

- **`PHONE_CALL`** and **`WALK_IN`** added to `CONTACT_SOURCES` in
  `public/contact.ts`, covering admin-initiated, manually-created leads.
- **`LeadSourceSchema`**, **`LEAD_SOURCES`**, and **`LeadSource`** type exported
  from `public/contact.ts` as aliases of `ContactSourceSchema`, `CONTACT_SOURCES`,
  and `ContactSource` respectively — canonical names for lead-CRM UI consumers.

### Clinical Domain

- **`PatientSchema`** (`z.object`) and **`PatientContract`** type added to
  `domain/clinical.ts` — structured Zod schema for the patient demographic
  record used across the clinic admin and lab flows.
- **`LabOrderSchema`** and **`LabOrderContract`** type added to
  `domain/clinical.ts` — schema for lab order payloads (panel, status,
  ordered-by, results).

### Admin API Routes

- **`subscriptions.retryForUser(userId)`** route helper added in
  `admin/admin-routes.ts` → `/api/admin/subscriptions/:userId/retry`.
- **`leads.update(id)`** route helper added →
  `/api/admin/leads/:id` (PATCH).
- **`leads.CREATE`** constant added → `/api/admin/leads` (POST), joining the
  existing `leads.LIST`.

### Admin Schemas

- **`convertedUserId`** (`z.string().uuid().optional()`) added to
  `adminLeadStageUpdateBodySchema` in `admin/admin-schemas.ts`. Allows
  atomically linking a converted lead to its new user account during stage
  transition.

### Environment / App Review

- **`getAppReviewCredentials()`** exported from `domain/app-review.ts` — reads
  `APP_REVIEW_*` env vars and returns structured reviewer credentials; used by
  the server to gate test-account access during App Store review.

---

### Consumer upgrade path

1. Update `@hollis-studio/contracts` to `^0.2.0-alpha.11` in each repo's
   `package.json`.
2. Run `npm install`.
3. Add `HIPAA_NPP` entries to `consentService.ts`, `canonicalDocuments.ts`
   (and any local `DOCUMENT_SECTIONS`/`DOCUMENT_VERSIONS` maps) in
   `hollis-health-app/server/`.
4. Narrow `formState.source` to `LeadSource` (or use `as LeadSource`) in
   `web-admin/components/admin/leads/CreateLeadModal.tsx`.
