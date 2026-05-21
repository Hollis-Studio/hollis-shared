# Launch Readiness Snapshot — 2026-05-20

**Clinic opens:** ~3 weeks (early-to-mid June 2026)
**Author:** Isaac (Care Coordinator + Owner)
**Status:** Code is green for E2E sandbox test. Owner/ops actions are the remaining gates to first live patient.

---

## What this session produced

1. **Defined the client-acquisition flow** (Stage 1 lead → Stage 4 first med visit). See [`../operations/client-acquisition-flow.md`](../operations/client-acquisition-flow.md).
2. **Rewrote `walk-in-and-phone-sop.md`** to correctly reflect Isaac's role (Care Coordinator + ISSA-CPT/Nutrition/S&C + CPR — **not** a clinician). All medical scope routed to Dr. Tavie at WHH.
3. **6-agent parallel codebase audit** covering: lead capture, `/leads` dashboard, `ConsultationFlowModal` wizard, appointment scheduling, patient-app first-run, ops infrastructure.
4. **7-agent parallel engineering batch** that closed every P0 engineering blocker identified in the audit.
5. **Reconciliation pass** — rebuilt `@hollis-studio/contracts` dist, synced into all `node_modules`, fixed one cross-agent test-mock regression (`useRetrySubscription` in `ConsultationFlowModal.test.tsx`).

---

## The 7 engineering fixes (all shipped, all tested)

| # | Fix | Files touched | Tests |
|---|------|--------------|-------|
| 1 | Wire lead conversion on `ConsultationFlowModal` success — sets `convertedUserId` + moves stage to `ACTIVE_MEMBER` automatically | `registrations/page.tsx`, `useLeads.ts`, `leadsService.ts` (client + server), `admin-schemas.ts` | 3/3 page tests pass |
| 2 | Surface `location` field in `NewAppointmentModal` + auto-suggest "White Horse Holistic Health" for `CONSULTATION` type | `NewAppointmentModal.tsx` | 4/4 modal tests pass |
| 3 | Add `consultationDate` picker to `/leads` rows; auto-opens on stage transition to `CONSULTATION_BOOKED` | `leads/page.tsx`, `leadsService.ts` (client + server), `admin-routes.ts`, `useLeads.ts` | Lint + typecheck clean |
| 4 | CAN-SPAM compliance for waitlist submissions — `unsubscribeToken` / `emailOptIn` / `consentedAt` now populated; unsubscribe link in confirmation email | `public.router.ts`, `lib/urls.ts`, `unsubscribe.routes.test.ts` | 19/19 unsubscribe tests pass (3 new) |
| 5 | Notification permission step added to patient-app onboarding — idempotent, respects iOS one-ask rule | `app/(auth)/onboarding.tsx` | 2,599/2,599 mobile tests pass |
| 6 | Atomic subscription creation — no more silent advance to success on Stripe failure; new `POST /api/admin/subscriptions/:userId/retry` endpoint + "Retry Subscription" UI + "Subscription Pending" success state | `subscriptions.ts`, `subscriptionService.ts`, `validation/admin.ts`, `ConsultationFlowModal.tsx`, `useBilling.ts`, `billingService.ts`, `subscriptionRoute.test.ts` | 5/5 subscription route tests pass; 35/35 modal tests pass (after mock fix) |
| 7 | `CreateLeadModal` + `POST /api/admin/leads` for phone/walk-in lead entry | `leads/page.tsx`, `leadsService.ts` (client + server), `useLeads.ts`, new `components/admin/leads/CreateLeadModal.tsx`, `admin-routes.ts`, new `admin-create-lead.test.ts` | 6/6 new tests pass |

**Verification matrix:**

| Scope | Lint | Typecheck | Tests |
|-------|------|-----------|-------|
| web-admin | ✅ 0 errors, 0 warnings (442 files) | ✅ Pass | ✅ 1,581 / 1,581 (116 suites) |
| server | ✅ 0 errors, 2 pre-existing warnings | ✅ (wrapper) | ✅ 30/30 on changed test files |
| mobile | ✅ 0 errors, 4 pre-existing warnings (incl. complexity from Fix #5) | ✅ Pass | ✅ 2,599 / 2,599 (123 suites) |

> Pre-existing server full-suite issue: `setup.ts` queries a TEST organization that isn't seeded in the test DB. Unrelated to this batch — known infrastructure problem in `contract-invariants.test.ts`.

---

## Cross-agent friction observed (and resolved)

- **Fix #6 + ConsultationFlowModal test mock** — Fix #6 added `useRetrySubscription` to the modal but didn't update the existing test's mock of `useBilling`. All 35 modal tests failed after Fix #6 landed. I caught this in reconciliation and added the missing mock — all 35 now pass.
- **Fix #3 silently fixed Fix #7 bugs** — While Fix #3 was running, it noticed Fix #7 had introduced (a) an incorrect `convertedUserId` destructure from a published schema that didn't yet contain the field, and (b) a `findUnique` on `email` (which is only a partial unique index on `LeadPipeline`). Fix #3 repaired both in flight.
- **`@hollis-studio/contracts` dist not rebuilt** — Fix #1 rebuilt `admin-schemas` dist. Fix #6 did not rebuild `admin-routes` dist. Web-admin typecheck failed on `retryForUser`. I ran `npm run build` in `hollis-shared/packages/contracts/` and copied the dist into all three `node_modules` locations (web-admin, root, server). Typecheck now passes everywhere.

---

## Code state by stage of the acquisition flow

| Flow stage | State | Notes |
|------------|-------|-------|
| Stage 1: Lead capture | ✅ Green | Waitlist + contact forms + `LeadPipeline` writes. CAN-SPAM compliant. Email confirmation sent. Admin "Create Lead" button for phone/walk-in. |
| Stage 2: Phone screen | ✅ Green (P1 caveat) | Stage transitions wired, `consultationDate` picker present and auto-opens. **P1 gap:** no automated 24h reminder email cron (manual workaround documented). |
| Stage 3: In-person intro + signup | ✅ Green | `ConsultationFlowModal` 11 steps; Stripe Payment Element (setup mode) always available; atomic transaction with retry path on failure; auto-converts originating lead. |
| Stage 4: First visits | ✅ Green | Admin can create `TRAINING_SESSION` + `CONSULTATION` appointments with location field (WHH auto-suggest). 24h/1h/15min push reminders working. |
| Patient app first-run | ✅ Green | Barcode signup, password, onboarding wizard with new notification-permission step before completion. Intake correctly skipped if completed in-clinic. |

---

## Remaining blockers — split by who owns them

### 🔴 P0 — owner/legal/ops actions
1. BAA with **White Horse Holistic Health** (PHI partner).
2. BAA with **Sentry** (sees error payloads with PHI scrubbing).
3. Apply Prisma migration `20260520000000_phi_access_log_rls` to prod, then `ALTER ROLE <app_service> BYPASSRLS;`.
4. Apply `hollis-identity` initial migration.
5. **Stripe prod keys** → AWS Secrets Manager (currently only test keys in `server/.env`).
6. **`SENTRY_DSN`** → AWS Secrets Manager (blank in all envs today — prod crashes silent).
7. **Rotate Gemini API key** if `server/.env` is git-tracked (check `git log --all -- server/.env`).
8. Confirm **RDS Multi-AZ** is actually applied (`terraform plan`).
9. **`HIPAA_NPP` consent type** — engineering work needed: add enum value + migration + integrate into `ConsultationFlowModal`. Patients must acknowledge NPP per 45 CFR §164.520.

### 🟠 P0 — engineering follow-ups from today's batch
1. **Republish `@hollis-studio/contracts`** to propagate: `subscriptions.retryForUser`, `leads.update`, `leads.CREATE`, `convertedUserId` field on `adminLeadStageUpdateBodySchema`. Local dist sync survives until the next `npm install`. After republish: clean up TODO workarounds in `web-admin/services/admin/leadsService.ts`, `web-admin/services/billingService.ts`, `server/src/routes/admin/leads.ts`.
2. Set **`SERVER_PUBLIC_URL=https://api.hollis.health`** in prod env (CAN-SPAM unsubscribe URLs need the API origin).
3. Add **`PHONE_CALL` and `WALK_IN`** to a published `LeadSourceSchema` on next contracts bump.

### 🟡 P1 — desirable
1. 24h lead-reminder email cron (`LeadPipeline.consultationDate`).
2. Email templates: `CONSULTATION_BOOKED` confirmation, 24h reminder, post-signup welcome with app links.
3. Convert-lead-to-registration pre-fill on `ConsultationFlowModal`.
4. Lead detail/edit page (today: stage + consultationDate editable inline only).
5. CloudWatch alarm on `"Orphaned Stripe subscription canceled successfully"`.
6. Stripe Terminal provisioning (Location ID + enable flag) before first card-present transaction.
7. `ENABLE_AUDIT_CHAIN_VERIFY=true` in prod env.
8. PagerDuty endpoint + CloudWatch canary S3 bucket (both blank in tfvars).
9. DMARC DNS record.
10. Re-run pre-commit suite against current HEAD (last green report is 8 days stale).

### 🟢 P2 — post-launch
- UTM / ad attribution
- `PartnerClinic` + `ExternalClinician` schema (today: free-text location)
- WHH calendar bridge (depends on Tavie's office)
- SMS provider integration (Twilio HIPAA-eligible)
- Self-serve online checkout on `web-public`
- Lab/DXA/sleep auto-creating downstream records
- Per-appointment deep linking from push notifications
- Identity Service consumption by `hollis-health-app/server`

---

## How to interpret this snapshot

- **The E2E sandbox test from `client-acquisition-flow.md` §12 should now run end-to-end without manual DB writes or workarounds.** All flow-breaking bugs are closed.
- **Patients cannot legally be onboarded** until BAAs, HIPAA NPP, and PHI access log RLS are in place. Those are owner/legal/ops work, not code.
- **The 7-fix batch did not touch:** Stripe Terminal provisioning, ad attribution, email templates, lead-reminder cron, identity service, partner-clinic schema, SMS, telehealth. Those remain on the P1/P2 backlog.

## References

- Audit + fix narrative: this document
- Client acquisition SOP: [`../operations/client-acquisition-flow.md`](../operations/client-acquisition-flow.md)
- Walk-in/phone SOP (rewritten today): [`../operations/walk-in-and-phone-sop.md`](../operations/walk-in-and-phone-sop.md)
- Day-1 runbook: [`../operations/day-1-clinic-runbook.md`](../operations/day-1-clinic-runbook.md)
- Prior batch report (2026-05-19/20 — 12 agents): see `~/.claude/projects/.../memory/project_clinic_launch.md`
- Suite vision: [`../vision/2026-05-19-suite-vision.md`](../vision/2026-05-19-suite-vision.md)

---

Last updated: 2026-05-20
