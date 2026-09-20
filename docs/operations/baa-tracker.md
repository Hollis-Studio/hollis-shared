# Business Associate Agreement (BAA) Tracker

**Purpose:** Track the BAA status for all third-party vendors that handle Protected Health Information (PHI) on behalf of Hollis Health LLC. HIPAA requires a signed BAA with every Business Associate before PHI is shared. Unsigned BAAs are a compliance violation.

**Owner:** Isaac D. Landes, Privacy Officer
**Applies when:** Any vendor receives, creates, maintains, or transmits PHI on behalf of Hollis Health.

---

## Current BAA Status

> **Vendor rows re-verified against current source and the live prod task
> definition on 2026-09-20.** "PHI Touched" below is what the code actually
> does today, not what it might do.

| Vendor | PHI Touched | BAA Status | Notes | Next-Step Owner | Priority |
|---|---|---|---|---|---|
| **AWS** | Yes — RDS (ePHI database), S3 (file storage/PHI uploads), ECS, Secrets Manager, KMS | Signed | AWS standard HIPAA BAA accepted via AWS console. Covers all AWS HIPAA-eligible services in use. | None — monitor if new services are added | Closed |
| **Google Cloud / Vertex AI** | **Yes — the largest PHI-bearing vendor flow we have.** Vertex AI Gemini performs lab-report extraction, lab canonicalization/self-review, DXA extraction, AI chat, and nutrition/plan/strategy generation. Lab PDFs and clinical context go to Vertex. | Signed | BAA signed 2026-04-18. Vertex AI (not the consumer Gemini API) is the HIPAA-eligible surface, and `server/src/lib/gemini.ts` is explicit that reverting to `@google/genai` with an `apiKey` would drop BAA coverage. Prod authenticates via the `GCP_SA_KEY_JSON` Secrets Manager secret (ADC), project `hollis-health-app-473921`. ⚠️ **Verify one thing:** `gemini.ts` requires data residency in a HIPAA-eligible region, but prod runs `GOOGLE_CLOUD_LOCATION=global`. Confirm `global` is in scope under the signed BAA, or pin a region. | Isaac — confirm the `global` location is BAA-covered; otherwise pin `us-central1` | **High** |
| **Stripe** | No direct PHI — payment card data only; patient name and email are PII but Stripe's services as structured do not constitute PHI handling under Hollis's current payment architecture | Not signed — not currently required | If Hollis ever passes diagnosis codes, appointment types tied to clinical conditions, or clinical notes to Stripe, reassess. Stripe does offer a BAA for healthcare customers. | Isaac — reassess quarterly | Low |
| **Sentry** | Yes — error logs may contain ePHI if PHI leaks into error messages or request payloads | **NOT SIGNED** | **PHI scrubbing IS implemented and wired at every initializer** (call sites listed below), with `sendDefaultPii: false` throughout, and the server additionally disables Vertex AI input/output recording. Sentry is live in prod (`SENTRY_DSN` Secrets Manager secret on `hollis-prod-api:443`). A scrubber only removes fields it knows about, so this reduces exposure rather than removing it. Sentry offers a BAA on Business/Enterprise plans; current plan tier still unconfirmed. | Isaac — confirm plan tier and request the BAA, or accept the residual risk in writing before the clinic opens | **Critical** |
| **OpenAI** | **No — non-PHI marketing use only** | Not signed — not currently required | `OPENAI_API_KEY` **is live in prod** (Secrets Manager secret on `hollis-prod-api:443`), so this row exists to record *why* that is not a gap. The only consumer is `server/src/services/marketingImageService.ts` via `server/src/lib/openai.ts`, whose header states "NOT for PHI workloads — marketing use only" (brand-asset image generation through the OpenAI Images API). No patient data, health record, or clinical text reaches it. | Isaac + Engineering — re-assess the moment anything other than `marketingImageService` imports `lib/openai`; a BAA becomes required if it does | Low |
| **Anthropic (Claude AI)** | **No — no integration exists** | Not signed — **not currently required** | **Downgraded from "Critical" on 2026-09-20 after verification.** There is **no Anthropic dependency in any `package.json` across all four repos**, and no `@anthropic-ai/*` import or `api.anthropic.com` call in any source file. The only match suite-wide is `hollis-health-app/ops/session-manager.ts:163`, which shells out to the local `claude` developer CLI for engineering automation — that is a dev-tooling process on a workstation, not a product data flow, and no patient record passes through it. This row was "Critical" for an integration that was never built. It becomes live again **only if Compass is built**: the vision doc plans `hollis-compass` on the Anthropic Claude API, and §4.5 of that doc already flags it BAA-required for any PHI inference. | Isaac + Engineering — no action now. Re-open this row **before** the first line of Compass code that touches PHI | Low (watch) |
| **White Horse Holistic Health (WHH)** | No — none, ever | **Not required — relationship terminated** | The entity was **White Horse Holistic Health**, not "Winona Health Holdings" (an incorrect guess that stood in this tracker from 2026-05-19). The partner-clinician relationship ended 2026-08-19. No PHI was ever exchanged in either direction — the arrangement was a manual handoff that was discontinued at the 2026-07-17 descope before any data flowed, and no integration was ever built. No BAA is required and none will be sought. | None — closed | Closed |
| **Function Health** | No — Hollis sends no member data and receives no member data | **Not required — not a business associate** | Hollis pays a subscription fee on behalf of CORE/CONCIERGE members. The member contracts with Function Health directly, in their own name, under Function Health's own terms and privacy practices. Hollis has no account access, no interface, no data feed, and no ability to retrieve a member's results. Results reach Hollis only when the member exports a PDF and hands it over — that is member-supplied data, not a vendor data flow. A vendor that never receives or transmits PHI on our behalf is not a Business Associate. **Confirm with counsel** that sponsoring the fee does not itself create an agency relationship. | Isaac — raise in the 2026-08-19 counsel memo | Medium |

---

## What to Do for Each Unsigned BAA

### Sentry

Step 3 is **already done** — scrubbing is implemented. Step 1–2 are the open work.

1. Identify current Sentry plan (log into sentry.io > Settings > Subscription).
2. If on Business or Enterprise plan: request a HIPAA BAA from Sentry (available at sentry.io/legal or via their support team). If on a lower plan: upgrade, or record a written acceptance of the residual risk given the scrubbing below.
3. ✅ **PHI scrubbing is implemented and documented.** Verified 2026-09-20 — every Sentry initializer in the suite routes events through `sanitizeSentryEvent` / `sanitizeSentryLog` from `@hollis-studio/contracts` and sets `sendDefaultPii: false`:
   - `hollis-health-app/server/src/index.ts:35` — `beforeSend`, `beforeSendTransaction`, `beforeSendLog`, **plus** `googleGenAIIntegration({ recordInputs: false, recordOutputs: false })` so Vertex AI prompts and responses never reach Sentry
   - `hollis-health-app/web-admin/instrumentation-client.ts:17`, `web-admin/sentry.server.config.ts:14`, `web-admin/sentry.edge.config.ts:14`
   - `hollis-health-app/web-public/instrumentation-client.ts:19`, `web-public/sentry.server.config.ts:9`, `web-public/sentry.edge.config.ts:9`
   - `hollis-health-app/app/_layout.tsx:115` — also `beforeBreadcrumb`, the only coverage for SDK-assembled breadcrumbs (the static `check:phi-logging` scanner cannot see them, so a green run there is not evidence)
   - `hollis-identity/src/index.ts:26`
   - `hollis-workouts/server/src/lib/sentry.ts:63`
4. Treat the scrubbing as mitigation, not compliance: a `beforeSend` filter removes only the fields it knows about. Free-text clinical content inside an unexpected field would still ship.

### Google Cloud / Vertex AI — signed, but confirm the region

The BAA is signed (2026-04-18), and the code deliberately uses Vertex AI rather
than the consumer Gemini API for exactly this reason. Two things to confirm
rather than assume:

1. **Data residency.** `server/src/lib/gemini.ts` states that data residency must be configured to a HIPAA-eligible region. Prod runs `GOOGLE_CLOUD_LOCATION=global`. Confirm with Google that the `global` endpoint is in scope under the signed BAA, or pin an explicit region (`us-central1`) and redeploy.
2. **HIPAA-eligible APIs only.** Confirm the GCP project (`hollis-health-app-473921`) has only HIPAA-eligible APIs enabled. Vertex AI is eligible; the consumer Gemini API (`generativelanguage.googleapis.com`) is **not** and must never receive PHI. `gemini.ts` carries a standing warning against reverting to `@google/genai` with an `apiKey` — do not "simplify" that client.

### Anthropic — no action; re-open before Compass

Verified 2026-09-20: **no integration exists.** No `anthropic` dependency in any
`package.json` in `hollis-health-app`, `hollis-workouts`, `hollis-shared` or
`hollis-identity`, and no `@anthropic-ai/*` import or `api.anthropic.com` call in
any source file. There is therefore no current PHI flow and nothing to sign.

Re-open this row **before** writing Compass code that touches PHI (the vision
doc plans `hollis-compass` on the Anthropic Claude API). At that point:

1. Confirm whether any patient data, clinical notes, or appointment content would be included in prompts or responses.
2. If PHI is included: either contact Anthropic at privacy@anthropic.com about BAA availability, or engineer the integration to exclude PHI before the API call (the vision's clinic-Compass / consumer-Compass split with a redacted booleans-only snapshot is designed to do exactly that).
3. Document the outcome here.

Do **not** re-mark this Critical on the basis of the `claude` CLI in
`hollis-health-app/ops/session-manager.ts` — that is local engineering tooling,
not a product data flow.

### OpenAI — no action; watch the import graph

`OPENAI_API_KEY` is live in prod but the only consumer is marketing image
generation (`server/src/lib/openai.ts` → `server/src/services/marketingImageService.ts`),
which is explicitly documented as non-PHI. The tripwire is the import graph, not
the key: if anything other than `marketingImageService` imports `lib/openai`,
re-assess before it ships.

```sh
grep -rn "lib/openai" --include='*.ts' hollis-health-app/server/src
```

### WHH — closed, no action
Nothing to do. The relationship is terminated and no data was exchanged. Retained in the table above as a record of the closure rather than deleted, so that a future audit asking "was there ever a BAA gap with WHH?" finds the answer here.

### Function Health — assess, do not assume
The position is that Function Health is not a Business Associate because it neither receives PHI from Hollis nor creates/transmits PHI **on Hollis's behalf** — it does so on the member's behalf, under the member's own contract. Sponsorship is a payment, not a delegation.

1. Confirm this position with counsel (open item in the 2026-08-19 memo).
2. Re-assess immediately if any of these change: Hollis gains account-level access to member data; Function Health sends results to Hollis directly rather than through the member; Hollis contracts on the member's behalf rather than paying a fee; or any roster of members is shared with Function Health for enrollment. **Any of those four would likely make them a Business Associate.**
3. Do not share a member list, member contact details, or any member health information with Function Health for enrollment convenience. Members enroll themselves.

### Stripe
1. Reassess each quarter whether any PHI (beyond name/email for receipts) is being passed to Stripe.
2. If clinical data or appointment metadata is used in Stripe's metadata fields, initiate BAA discussion with Stripe's healthcare team.
3. No action required unless PHI scope changes.

---

## BAA Review Schedule

- Review this tracker at every quarterly security review.
- Add any new vendor that may handle PHI before onboarding them.
- If a vendor's service changes in a way that introduces PHI handling, reassess BAA status immediately.

---

## How to Sign a BAA

For most cloud vendors:
1. Log into the vendor's admin portal.
2. Navigate to Security, Legal, or Compliance settings.
3. Look for "HIPAA BAA" or "Business Associate Agreement."
4. Accept or sign online, or request via email.
5. Download and retain a copy. File in: Hollis Health / Legal / BAAs / [Vendor].

For custom BAAs:
1. Use the HHS Model BAA as a starting point: https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html
2. Have counsel review before signing.
3. Execute with wet or electronic signatures.
4. File and update this tracker.

---

Last reviewed: 2026-09-20 (vendor rows verified against current source + the live
prod task definition: Anthropic downgraded from Critical — no integration exists;
OpenAI row added for the live prod key; Google Cloud row sharpened to name the
PHI-bearing Vertex AI flows and the `global` region question; Sentry scrubbing
call sites recorded as verified with the BAA still unsigned.)

Prior review: 2026-08-19
