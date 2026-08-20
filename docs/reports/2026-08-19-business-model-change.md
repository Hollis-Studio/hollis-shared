# Business Model Change — Partner Clinician Exit + Sponsored Biomarker Panel

**Date:** 2026-08-19
**Author:** Isaac D. Landes (CEO) / CTO office
**Status:** Authoritative. Supersedes the partner-clinician model described in all operations SOPs dated 2026-05-19/20.

---

## 1. What changed

Two changes landed together on 2026-08-19:

1. **The partner clinician relationship ended.** Dr. Tavie / White Horse Holistic Health (WHH) withdrew for legal reasons. There is no partner clinician, no external clinical scheduling dependency, and no WHH handoff of any kind — clinical or administrative.
2. **Blood biomarker testing moved to a sponsored third-party consumer program.** Hollis Health sponsors (pays for) a **Function Health** membership for members at the **CORE** and **CONCIERGE** tiers. Function Health, through its own independent providers, handles everything clinical: ordering, the draw, the panel, and the results. Members export their own results report and may choose to share it with Hollis. With written consent, Hollis uploads that report to the member's Hollis record for **display and trend organization only**.

Both changes fold into the posture already established by the **2026-07-17 medical-services descope** (see `hollis-health-app/docs/09-Legal/HH Legal/internal/2026-07-17-descope-attorney-memo.md`). Hollis Health does not order, schedule, coordinate, interpret, or monitor anything clinical.

## 2. What the operating model is now

| Function | Before (through 2026-08-18, as documented) | Now |
|---|---|---|
| Booking / scheduling | Split. Coaching in Hollis; clinical visits scheduled by WHH's own system via SMS coordination with Isaac. | **Fully in-house.** Every appointment a member has with Hollis is created and owned in the Hollis platform. There are no external calendars to reconcile. |
| Member coordination | Isaac acted as interpreter between member and partner clinician. | **Fully in-house.** Isaac coordinates the member's coaching, recovery, nutrition, and their Function Health sponsorship logistics (enrollment, reminders). No clinical interpretation. |
| Medical visits | Provided by Dr. Tavie at WHH; described as included in membership. | **Not offered, not arranged, not included.** Members obtain medical care from providers of their own choosing. Hollis may refer on request. |
| Blood work | Ordered on paper by Hollis, drawn in clinic or self-transported, interpreted by the clinician. | **Function Health.** Sponsored by Hollis at CORE/CONCIERGE; the member holds the account; Function Health's independent providers own the clinical side end-to-end. |
| Lab results in Hollis | Received from the lab/WHH, reviewed and interpreted, patient notified of abnormals. | **Member-shared, display-only.** Uploaded with written consent, shown as trends. No review, no monitoring, no abnormal-value notification, no duty to flag. |
| Roles | Care Coordinator + Trainer + Partner Clinician. | **Care Coordinator + Trainer.** The clinician role no longer exists in the business. |

## 3. Function Health program specifics

- **Who pays:** Hollis Health sponsors the Function Health membership for CORE and CONCIERGE members. ESSENTIALS is not sponsored.
- **Who holds the account:** the member. Enrollment is in the member's own name, under Function Health's own terms and privacy policy, with Function Health's independent ordering providers.
- **What it covers:** a 160+ biomarker blood panel program.
- **Branding constraint:** **no Function Health branding, logos, marks, brand colors, or product screenshots may appear on any Hollis public surface** (`web-public`, ads, social, printed collateral). The benefit is described in Hollis's own words and typography — what the member gets and why having data about how their body is doing is valuable. Naming the vendor as plain text in a description or on the offer sheet is acceptable; using their visual identity is not. *Confirm the exact naming permission against the Function Health partner terms before the first public use.*
- **Cadence:** a standard Function Health membership — **twice yearly**. Cadence, panel contents, and scheduling are governed by **Function Health's terms and conditions, not ours.** Hollis makes no representation about testing frequency and must never present a date of ours as a testing schedule.
- **Export format:** Function Health provides a **PDF** results export (downloaded by the member from `my.functionhealth.com/documents`). There is no native CSV/JSON export as of 2026-08. Any structured extraction is our own OCR/AI extraction of that PDF, which is the pipeline already built (`POST /api/admin/labs/extract`).
- **Consent gate:** a report is only ever uploaded after the member has given written consent to share it. No consent, no upload. See `biomarker-panel-program-sop.md`.

## 4. Legal posture — read this before acting

The 2026-07-17 descope drew a hard line: Hollis does not order, schedule, **coordinate access to**, or interpret laboratory testing. **Sponsoring and distributing a third-party testing membership sits closer to that line than the pure "member shares their own outside records" model counsel signed off on.** The distinction we are relying on is:

- Hollis pays a subscription fee on the member's behalf. That is a **benefit**, like sponsoring a gym membership.
- Hollis does not select the panel, does not choose or contact the ordering provider, does not schedule the draw, does not receive results from Function Health, and has no account-level access to the member's Function Health data.
- The results reach Hollis only when the member exports them and hands them over with written consent — the same voluntary-share mechanic already papered in Informed Consent v2.0.0 §2.

This is a defensible position but it has **not been confirmed by counsel.** A memo requesting that review is at `hollis-health-app/docs/09-Legal/HH Legal/internal/2026-08-19-fh-sponsorship-counsel-memo.md`. Do not publish sponsored-panel marketing copy before counsel responds.

Separately: the working assumption that Hollis "no longer holds PHI" is a **legal conclusion, not a technical one.** Hollis will hold 160+ biomarker results tied to a named individual. Whether that is PHI depends on covered-entity status, which is open question #2 in the 2026-07-17 memo. **All HIPAA-grade technical controls stay on regardless** — encryption, audit logging, access control, retention. Nothing in this change authorizes relaxing a security control.

## 5. Documents changed in this pass

**hollis-shared/docs/operations/**
- `client-acquisition-flow.md` — partner-clinician role removed; Stage 4 is one in-house session; tier table corrected (it had been quoting stale $799/$1,599/$2,499 pricing); E2E test plan rewritten around a shared-results upload.
- `walk-in-and-phone-sop.md` — every "defer to Tavie" script replaced with a not-a-medical-provider redirect; added the rule that reassurance ("you're fine") is itself interpretation.
- `biomarker-panel-program-sop.md` — **new.** Sponsorship enrollment, consent capture, PDF upload, and the no-monitoring rule.
- `labs-manual-workflow.md` — **superseded**, content removed (it was a followable procedure for ordering labs and notifying members of critical values).
- `prescribing-workflow-sop.md` — **superseded**, content removed.
- `imaging-and-referrals-sop.md` — rewritten to referral-only; the clinical referral-letter template deleted.
- `day-1-clinic-runbook.md` — Rx pads, lab requisitions, and the Rx log removed.
- `baa-tracker.md` — WHH closed (and the entity name corrected from an incorrect "Winona Health Holdings" guess); Function Health assessed as not-a-BA with four re-evaluation triggers.

**Signed instruments** — canonical source is `@hollis-studio/contracts/admin/legal-documents`, *not* the orphaned copies in `hollis-health-app/web-admin/lib/legalDocuments/`:
- Informed Consent **2.0.0 → 2.1.0** — Section 2 restructured for sponsored programs.
- Membership Agreement **2.2.0 → 2.3.0** — new §2.3 sponsored testing; §8.2/§8.3 standing two-way authorization removed.
- HIPAA NPP **1.1.0 → 1.2.0** — "treating clinician" removed; new section on how health information is obtained. All three copies (contracts, web-admin, server) verified byte-identical; the server copy had silently drifted to a pre-descope version.
- Enrollment Summary — per-tier sponsored-benefit row and disclosure block.
- Liability Waiver **1.2.0 → 1.3.0**, Electronic Comms Consent **1.1.0 → 1.2.0**. Photo/Video Release unchanged in contracts (updated in the draft packet only).

**Public-facing drafts** — Privacy Policy 2.3.0 → 2.4.0, Terms of Service 2.1.0 → 2.2.0, HIPAA Notice 2.2.0 → 2.3.0, Cancellation & Refund 2.0.0 → 3.0.0, Supplement Store Terms 1.1.0 → 1.2.0.

**Internal attorney-review drafts** — BAA, vendor/subprocessor register (new non-processor category for the sponsorship), incident response plan, independent contractor agreement, acceptable use, pre-opening addendum, NDA, supplement disclaimer, liability waiver, photo/video release, electronic comms consent, physician services agreement (hardened SUPERSEDED banner), HIPAA risk assessment (WHH flow closed out, Function Health flow and risks R-19/R-20 added), informed-consent and membership-agreement mirrors.

**Commercial**
- `offer-sheet.json` **3.0.0 → 3.1.0** — sponsored panel row (CORE/CONCIERGE), new `sponsoredTestingBenefit` policy, third-party billing carve-out, and the "Care coordination support" row relabelled so it does not read as clinical care coordination. Pricing unchanged.
- `offer-sheet.ts` — the new policy wired into the zod schema (Zod strips unknown keys, so it would otherwise have been silently dropped).
- `web-public/lib/membershipOffer.ts` — the sponsored row is **excluded from public marketing** pending counsel sign-off. Removing that key is the act of publishing.

**Engineering**
- `hollis-health-app/docs/09-Legal/HH Legal/internal/2026-08-19-fh-sponsorship-counsel-memo.md` — **new.**
- `hollis-health-app/docs/CTO_AGENT.md` — Phase 1 operational model replaced.
- `hollis-health-app/docs/plans/2026-08-19-admin-dashboard-model-alignment.md` — **new.**

**Verified:** contracts typecheck clean, 2485/2485 contracts tests pass, 43/43 server consent-service tests pass, NPP synced across all three copies.

## 6. Open items

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | Counsel review of the whole revised set | Isaac | **In progress** — Isaac is taking the completed document set to counsel. Documents are marked final rather than draft on his instruction; they have not yet been reviewed. |
| 2 | Function Health partner terms — confirm what may be said and shown | Isaac | Open. The no-branding rule is already enforced in the docs and code comments. |
| 3 | ~~Panel cadence per tier~~ | — | **Resolved 2026-08-19.** Standard Function Health membership, twice yearly, on their terms. |
| 4 | Sponsorship cost per member vs. margin at $1,349 / $1,949 | Isaac | Open, non-blocking. Tracking now exists in the dashboard; the analytics rollup does not. |
| 5 | Per-upload consent attestation in web-admin | Engineering | Open — the highest-priority remaining item. See the dashboard plan §2. |
| 6 | Publish contracts and bump the app dependency | Engineering | **Required.** Everything below depends on it. |

## 7. What was built

Sponsorship tracking is implemented, not just planned:

- `User.sponsoredPanelStatus` / `sponsoredPanelEnrolledAt` / `sponsoredPanelTierAtEnrollment` / `sponsoredPanelRenewalDate` / `sponsoredPanelNotes`, plus an index supporting the renewals-due and lapsed-tier queries. Migration `20260819180000_sponsored_biomarker_panel`.
- `GET` / `PUT /api/admin/patients/:userId/sponsored-panel`, ADMIN-only (`requireStrictAdmin`) because sponsorship is a billing commitment. The server refuses to mark an ESSENTIALS member enrolled.
- **Sponsored Blood Panel** section on the member's Profile tab in web-admin, admin-only, showing status, enrolment date, renewal date, and tier at enrollment, with a warning banner when Hollis is still sponsoring someone whose current tier no longer qualifies.
- Tier-at-enrollment and enrolment date are stamped once on the transition into ENROLLED and never recomputed, so they keep saying what was true when Hollis agreed to pay.

The model deliberately holds **nothing clinical** — no panel contents, no draw dates, no results. Shared results continue to flow through the existing member-shared lab records path.

**Verified:** contracts typecheck + 2485/2485 tests; server typecheck clean in all changed files (the repo's 454 pre-existing errors are unchanged and unrelated — confirmed by an A/B against the schema at HEAD); migration applies cleanly with no schema drift; 121/121 server admin-route and consent tests; web-admin typecheck clean and 1731/1731 tests; eslint clean on all new files.

---

Last reviewed: 2026-08-19
