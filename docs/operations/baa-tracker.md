# Business Associate Agreement (BAA) Tracker

**Purpose:** Track the BAA status for all third-party vendors that handle Protected Health Information (PHI) on behalf of Hollis Health LLC. HIPAA requires a signed BAA with every Business Associate before PHI is shared. Unsigned BAAs are a compliance violation.

**Owner:** Isaac D. Landes, Privacy Officer
**Applies when:** Any vendor receives, creates, maintains, or transmits PHI on behalf of Hollis Health.

---

## Current BAA Status

| Vendor | PHI Touched | BAA Status | Notes | Next-Step Owner | Priority |
|---|---|---|---|---|---|
| **AWS** | Yes — RDS (ePHI database), S3 (file storage/PHI uploads), ECS, Secrets Manager, KMS | Signed | AWS standard HIPAA BAA accepted via AWS console. Covers all AWS HIPAA-eligible services in use. | None — monitor if new services are added | Closed |
| **Google Cloud** | Yes — platform services | Signed | BAA signed 2026-04-18. | None — monitor scope | Closed |
| **Stripe** | No direct PHI — payment card data only; patient name and email are PII but Stripe's services as structured do not constitute PHI handling under Hollis's current payment architecture | Not signed — not currently required | If Hollis ever passes diagnosis codes, appointment types tied to clinical conditions, or clinical notes to Stripe, reassess. Stripe does offer a BAA for healthcare customers. | Isaac — reassess quarterly | Low |
| **Sentry** | Yes — error logs may contain ePHI if PHI leaks into error messages or request payloads | **NOT SIGNED** | Sentry offers a BAA for enterprise plans. Current plan tier unknown — confirm eligibility. Until BAA is signed, all PHI must be scrubbed from Sentry logs (confirm this is implemented). | Isaac — sign BAA before clinic opens or confirm PHI scrubbing is implemented and documented | **Critical** |
| **Anthropic (Claude AI)** | Potentially yes — if patient data or clinical notes are passed to the Claude API | **NOT SIGNED** | Anthropic does not currently offer a standard HIPAA BAA. PHI must NOT be sent to the Claude API until either (a) a BAA is in place or (b) usage is confirmed to be non-PHI. Review all Compass/AI integration code for PHI exposure. | Isaac + Engineering — audit AI data flows; do not pass PHI to Anthropic without a BAA | **Critical** |
| **White Horse Holistic Health (WHH)** | No — none, ever | **Not required — relationship terminated** | The entity was **White Horse Holistic Health**, not "Winona Health Holdings" (an incorrect guess that stood in this tracker from 2026-05-19). The partner-clinician relationship ended 2026-08-19. No PHI was ever exchanged in either direction — the arrangement was a manual handoff that was discontinued at the 2026-07-17 descope before any data flowed, and no integration was ever built. No BAA is required and none will be sought. | None — closed | Closed |
| **Function Health** | No — Hollis sends no member data and receives no member data | **Not required — not a business associate** | Hollis pays a subscription fee on behalf of CORE/CONCIERGE members. The member contracts with Function Health directly, in their own name, under Function Health's own terms and privacy practices. Hollis has no account access, no interface, no data feed, and no ability to retrieve a member's results. Results reach Hollis only when the member exports a PDF and hands it over — that is member-supplied data, not a vendor data flow. A vendor that never receives or transmits PHI on our behalf is not a Business Associate. **Confirm with counsel** that sponsoring the fee does not itself create an agency relationship. | Isaac — raise in the 2026-08-19 counsel memo | Medium |

---

## What to Do for Each Unsigned BAA

### Sentry
1. Identify current Sentry plan (log into sentry.io > Settings > Subscription).
2. If on Business or Enterprise plan: request a HIPAA BAA from Sentry (available at sentry.io/legal or via their support team).
3. If on a lower plan: upgrade, or confirm that PHI scrubbing is implemented at the code level (Sentry's `beforeSend` hook filtering known PHI fields). Document that confirmation.
4. Do not operate the clinic with PHI potentially flowing into Sentry without a BAA or confirmed scrubbing.

### Anthropic
1. Review all code that calls the Anthropic/Claude API (search for `anthropic`, `claude`, Compass AI integrations).
2. Confirm whether any patient data, clinical notes, appointment content, or other PHI is included in prompts or responses.
3. If PHI is included: either (a) contact Anthropic at privacy@anthropic.com to inquire about BAA availability, or (b) engineer the integration to exclude PHI before the API call.
4. Document the outcome. Update this tracker when resolved.
5. Current Anthropic policy (as of 2026-05): Anthropic does not offer a standard HIPAA BAA for the Claude API. PHI must not be sent without a signed agreement.

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

Last reviewed: 2026-08-19
