# Hollis Suite — Docs

Canonical home for cross-suite docs: vision, architecture, clinic operations SOPs, research, and dated phase reports. Per-app docs live inside each app repo. Anything **suite-wide** lives here.

> **Start here:** [`vision/2026-05-19-suite-vision.md`](./vision/2026-05-19-suite-vision.md) — the canonical long-term vision.
> The older [`vision/2026-05-18-suite-vision.md`](./vision/2026-05-18-suite-vision.md) is **superseded**; it is kept only for the audit trail.
>
> **The thesis:** Hollis is _"the only consumer fitness app that a clinician will trust."_ The 2026-05-19 revision scoped the six-app idea down to **one company, two business units, four apps, one shared intelligence layer (Compass)**, with the remaining apps gated on wedge revenue. The near-term bet is **Strength + external-data integration + a Compass intelligence service + B2B trainer/clinician fleet sales**.
>
> **If you are opening the clinic, the vision is not your doc.** Go straight to [`operations/`](./operations/) — [`day-1-clinic-runbook.md`](./operations/day-1-clinic-runbook.md) and [`client-acquisition-flow.md`](./operations/client-acquisition-flow.md) are the two that run the business.
>
> All other docs in this folder should be consistent with the vision; if they aren't, the vision wins on *strategy* and current code/live infrastructure wins on *status*.

---

## Current State — 2026-09-20

Every claim in this section was verified against the registry, the live AWS
account, or current source on 2026-09-20. **Anything status-shaped in this folder
has drifted before — re-verify before you act on it.**

### Shared packages

The GitHub Packages cutover is complete. No consumer uses a `file:`,
`git+`, or vendored copy of a shared package (verified: zero `file:`/`git+`
`@hollis*` deps across all four repos).

| Package | Published | Notes |
|---|---|---|
| `@hollis-studio/contracts` | `0.2.0-alpha.87` (75 versions) | Ships fast; check before assuming. |
| `@hollis-studio/design-tokens` | `0.2.0-alpha.2` | One version ever published. |
| `@hollis-studio/utils` | `0.1.0-alpha.1` | One version ever published. |
| `@hollis-studio/auth-client` | `0.1.0-alpha.3` | One version published; the workspace is ahead of the registry. |

Check, don't trust the table — the `alpha` dist-tag is the release channel:

```sh
npm run npm:agent -- view @hollis-studio/contracts dist-tags
# Works for any package, including ones with no dist-tags at all:
gh api /orgs/Hollis-Studio/packages/npm/contracts/versions --jq '.[0].name'
```

> ⚠️ **Dist-tag traps.** `contracts` `latest` is stuck on `0.2.0-alpha.54` and
> `next` on `0.2.0-alpha.72` — a bare `npm install @hollis-studio/contracts`
> resolves to `latest` and silently installs **stale legal-document versions and
> the old studio address**. `design-tokens`, `utils`, and `auth-client` have **no
> dist-tags at all**, so `npm view` on them prints nothing and a bare install
> fails to resolve. Always install an exact version. See [`TODO.md`](./TODO.md).

Installed consumer versions are a separate fact from what is published:

| Consumer | contracts | Other |
|---|---|---|
| `hollis-health-app` (mobile, `server`, `web-admin`, `web-public`) | `0.2.0-alpha.85` | `design-tokens@alpha.2`, `utils@alpha.1`, `auth-client@alpha.3` (server) |
| `hollis-workouts` (mobile, `server`) | `0.2.0-alpha.87` | `utils@alpha.1`, `auth-client@alpha.3` (server) |
| `hollis-identity` | `0.2.0-alpha.83` | — |

Local installs and CI/Docker builds need `NODE_AUTH_TOKEN` for
`@hollis-studio:registry=https://npm.pkg.github.com`. See the repo
[`README.md`](../README.md) for the token bridge and publish helpers.

### Identity service

`hollis-identity` **is deployed** — ECS service `hollis-identity-prod` in cluster
`hollis-prod-cluster`, routed at `identity.hollis.health`, running 1 task at 0.25
vCPU. Its Prisma migrations are applied. `hollis-workouts/server` verifies
tokens through `@hollis-studio/auth-client`; `hollis-health-app/server` has
`IDENTITY_SERVICE_URL` wired in prod but **has not cut over** — it still issues
its own JWTs. Remaining auth work is tracked in
[`architecture/shared-auth-migration-checklist.md`](./architecture/shared-auth-migration-checklist.md).

### Health services

Health is **live, not parked**. The 2026-06-22 cost scale-down has been largely
reversed: `hollis-prod-api` and `hollis-prod-web-admin` both run 1/1 and both
Synthetics canaries are running. Container Insights is still disabled and 3 of
the 7 muted alarm actions are still muted. See
[`operations/aws-cost-scaledown-runbook.md`](./operations/aws-cost-scaledown-runbook.md).

---

## Reading order

1. **[Operations](./operations/)** — the clinic SOPs. Start with
   [`day-1-clinic-runbook.md`](./operations/day-1-clinic-runbook.md), then
   [`client-acquisition-flow.md`](./operations/client-acquisition-flow.md).
2. **[Vision](./vision/2026-05-19-suite-vision.md)** — what Hollis is, the four
   apps, the shared Compass layer, and the build order.
3. **[Architecture](./architecture/)** — start with
   [`suite-strategy.md`](./architecture/suite-strategy.md) (end-state), then
   [`suite-infrastructure-migration.md`](./architecture/suite-infrastructure-migration.md)
   (sequencing). [`aws-infrastructure.md`](./architecture/aws-infrastructure.md)
   is the deployed-AWS inventory.
   [`shared-auth-migration-checklist.md`](./architecture/shared-auth-migration-checklist.md)
   and [`vendor-hollis-interim.md`](./architecture/vendor-hollis-interim.md)
   cover specific workstreams.
4. **[Engineering TODO](./TODO.md)** — open cross-repo release/publishing debt.
5. **[Research](./research/)** — audits that fed the architecture decisions.
6. **[Reports](./reports/)** — dated snapshots; historical state, not current truth.

---

## Folder map

```
docs/
├── README.md                                   ← you are here
├── TODO.md                                      Cross-repo publishing/release debt
├── operations/                                  Clinic SOPs — day-1 and ongoing
│   ├── day-1-clinic-runbook.md                  Master day-1 checklist: opening, check-in, outages, payment fallbacks
│   ├── client-acquisition-flow.md               Lead → first visit: the canonical funnel SOP + E2E test plan + launch gaps
│   ├── walk-in-and-phone-sop.md                 Triage scripts for walk-ins and inbound phone; emergency redirect
│   ├── after-hours-messaging-sop.md             Response SLA, auto-reply text, emergency redirect, no on-call
│   ├── no-show-cancellation-policy.md           Patient-facing policy + manual Stripe fee workflow
│   ├── biomarker-panel-program-sop.md           Hollis-sponsored Function Health panel: who pays, how results arrive
│   ├── imaging-and-referrals-sop.md             Member-requested referrals only; imaging-order half removed 2026-08-19
│   ├── breach-notification-runbook.md           HIPAA 60-day rule, HHS steps, patient letter template, counsel triggers
│   ├── baa-tracker.md                           Vendor BAA status + next-step owner for each gap
│   ├── hipaa-npp-content.md                     Full NPP text behind ConsentDocumentType.HIPAA_NPP
│   ├── roi-form-template.md                     HIPAA Release of Information form template
│   ├── aws-cost-scaledown-runbook.md            2026-06-22 park + the reverse commands (partly reversed already)
│   ├── labs-manual-workflow.md                  ⛔ SUPERSEDED — do not follow
│   └── prescribing-workflow-sop.md              ⛔ SUPERSEDED — do not follow
├── vision/
│   ├── 2026-05-19-suite-vision.md               Canonical north star
│   └── 2026-05-18-suite-vision.md               Superseded; kept for the audit trail
├── architecture/                                Living suite architecture
│   ├── suite-strategy.md                        End-state architecture: apps, stacks, services
│   ├── suite-infrastructure-migration.md        Shared packages, identity, Workouts backend cutover
│   ├── aws-infrastructure.md                    AWS inventory: services, routing, RDS, separation, cost
│   ├── shared-auth-migration-checklist.md       Identity contracts, auth-client, Health extraction
│   ├── 2026-08-17-machine-data-acquisition.md   Gym-machine data acquisition options
│   └── vendor-hollis-interim.md                 Historical Workouts vendoring incident
├── research/
│   └── 2026-05-12-suite-adoption/               Suite adoption audits (6 files)
└── reports/                                     Dated phase snapshots (frozen)
    ├── 2026-05-12-*  (7 files)                  Extraction/phase-D/phase-I-prime audits
    ├── 2026-05-13-shared-deps-distribution.md
    ├── 2026-05-20-launch-readiness-snapshot.md
    ├── 2026-08-19-business-model-change.md      Tavie/WHH exit, in-house booking, sponsored panel
    └── 2026-09-04-launch-scope-assumptions.md   Launch scope reduction assumptions
```

---

## Where suite docs do NOT live

Anything app-specific stays inside the app repo:

| Topic | Lives in |
| --- | --- |
| Workouts/Strength product spec, AI integration spec, runbooks, app-distro, mass-market punch list | [`Hollis-Studio/Hollis-Workouts`](https://github.com/Hollis-Studio/Hollis-Workouts) `docs/` |
| Workouts server (API) ops and runbooks | [`Hollis-Studio/Hollis-Workouts`](https://github.com/Hollis-Studio/Hollis-Workouts) `server/` — **the standalone `hollis-workouts-server` repo was merged into `hollis-workouts` on 2026-05-30 and no longer exists** |
| Health product/clinical spec, security, audits, polish-scope, admin/trainer plans, numbered docs taxonomy | [`Hollis-Studio/hollis-health-app`](https://github.com/Hollis-Studio/hollis-health-app) `docs/` |
| Identity service ops, runbooks, secrets | [`Hollis-Studio/hollis-identity`](https://github.com/Hollis-Studio/hollis-identity) `docs/` |

When a piece of work touches more than one app, the doc belongs here, not in any single app repo.

---

## GitHub canonical links

Use these when linking to suite docs from outside the `hollis-shared` checkout:

- Vision: <https://github.com/Hollis-Studio/hollis-shared/blob/main/docs/vision/2026-05-19-suite-vision.md>
- Operations SOPs: <https://github.com/Hollis-Studio/hollis-shared/tree/main/docs/operations>
- Architecture: <https://github.com/Hollis-Studio/hollis-shared/tree/main/docs/architecture>
- Research — suite adoption: <https://github.com/Hollis-Studio/hollis-shared/tree/main/docs/research/2026-05-12-suite-adoption>
- Reports: <https://github.com/Hollis-Studio/hollis-shared/tree/main/docs/reports>

---

## Conventions

- **Dates in filenames:** `YYYY-MM-DD-` prefix for any dated artifact (reports, phase snapshots, vision revisions).
- **Living docs:** files under `architecture/` and `operations/` are living — edit in place rather than dating each revision, and update the "Last reviewed" line at the bottom.
- **Reports are frozen:** anything in `reports/` is a historical snapshot. Don't edit; supersede with a new dated report.
- **Vision revisions:** save a new dated file under `vision/` and update this README's "Start here" pointer. Keep older revisions for the audit trail.
- **Status claims carry a date.** Any sentence about what is deployed, published, signed, or applied gets a `(verified YYYY-MM-DD)` marker or an inline dated note. Undated status text in this folder has repeatedly been months stale.
- **Superseded SOPs are not deleted.** Retitle with `— SUPERSEDED`, add a ⛔ banner pointing at the replacement, and leave the file so an audit can find the closure.

---

Last reviewed: 2026-09-20 (full accuracy pass — package versions, dist-tag traps, identity deployed, Health unparked, `operations/` added to the index, superseded vision pointer fixed).
