# Hollis Suite — Docs

Canonical home for cross-suite docs: vision, architecture, research, and dated phase reports. Per-app docs (Workouts/Strength, Health, etc.) live inside each app repo. Anything **suite-wide** lives here.

> **Start here:** [`vision/2026-05-18-suite-vision.md`](./vision/2026-05-18-suite-vision.md) — the canonical long-term vision (2026-05-18).
>
> **The sharpened thesis (read first if you read nothing else):** Hollis is _"the only consumer fitness app that a clinician will trust."_ The six-app consumer suite is the long-term direction, but the near-term bet is **Strength + external-data integration + a Compass intelligence service + B2B trainer/clinician fleet sales**, with Phase 4 native apps explicitly gated on the wedge funding them. See the "Strategic refinement" and "Suite leverage" sections of the vision doc.
>
> All other docs in this folder should be consistent with the vision; if they aren't, the vision wins or the conflict gets resolved before the doc is updated.

---

## Current State — 2026-05-19

The shared package distribution cutover is complete. `hollis-shared` publishes private GitHub Packages under the `@hollis-studio` scope:

- `@hollis-studio/contracts@0.2.0-alpha.10`
- `@hollis-studio/design-tokens@0.2.0-alpha.2`
- `@hollis-studio/utils@0.1.0-alpha.1`
- `@hollis-studio/auth-client@0.1.0-alpha.3`

Health and Workouts consume `@hollis-studio/contracts`, `@hollis-studio/design-tokens`,
and `@hollis-studio/utils` through semver dependencies from GitHub Packages.
Identity consumes `@hollis-studio/contracts`. Workouts Server is still on
temporary `@hollis/*` local file dependencies and must be normalized to
`@hollis-studio/*` before cutover. Sibling `file:../hollis-shared` refs,
`git+...#tag&path=...` refs, and Workouts vendored package copies are historical only.

Local installs need an npm token for `@hollis-studio:registry=https://npm.pkg.github.com`; CI and Docker builds should provide `NODE_AUTH_TOKEN` or a BuildKit npmrc secret.

Identity Service status: the sibling `hollis-identity` repo is locally hardened
with RS256/JWKS, PostgreSQL-backed token revocation, SES password-reset email,
and Terraform IaC, but it is not deployed and Health/Workouts have not cut over.
`@hollis-studio/auth-client` still needs JWKS fetch/cache, explicit `getMe`/
revocation/session surface decisions, optional consumer cookie helpers, and integration tests before it
becomes the production verification path for Health or Workouts.

---

## Reading order

1. **[Vision](./vision/2026-05-18-suite-vision.md)** — what Hollis is, what each of the six apps is, the shared Compass layer, and the build order.
2. **[Architecture](./architecture/)** — start with [`suite-strategy.md`](./architecture/suite-strategy.md) (end-state), then [`suite-infrastructure-migration.md`](./architecture/suite-infrastructure-migration.md) (sequencing). [`aws-infrastructure.md`](./architecture/aws-infrastructure.md) is the live deployed-AWS inventory (services, routing, separation, cost). `shared-auth-migration-checklist.md` and `vendor-hollis-interim.md` cover specific workstreams.
3. **[Research](./research/)** — audits and reconciliation work that fed the architecture decisions.
4. **[Reports](./reports/)** — dated phase snapshots; treat as historical state, not current truth.

---

## Folder map

```
docs/
├── README.md                                   ← you are here
├── vision/
│   └── 2026-05-18-suite-vision.md              Canonical north star
├── architecture/                                Living suite architecture
│   ├── suite-strategy.md                       End-state architecture: apps, stacks, services
│   ├── suite-infrastructure-migration.md       Shared packages, identity, Workouts backend cutover
│   ├── aws-infrastructure.md                   Live AWS inventory: services, routing, RDS, separation, cost
│   ├── shared-auth-migration-checklist.md      Identity contracts, auth-client, Health extraction
│   └── vendor-hollis-interim.md                Historical Workouts vendoring incident
├── research/
│   └── 2026-05-12-suite-adoption/              Suite adoption audits (6 files)
│       ├── 01-type-collision-audit.md
│       ├── 02-design-tokens-audit.md
│       ├── 03-errors-and-primitives-audit.md
│       ├── 04-schema-parity-audit.md
│       ├── 05-reconciliation-decisions.md
│       └── 06-steps-2-3-adoption-report.md
├── reports/                                     Dated phase snapshots
│   ├── 2026-05-12-extraction-triage.md
│   ├── 2026-05-12-legacy-contract-alias-audit.md
│   ├── 2026-05-12-phase-d-baseline.md
│   ├── 2026-05-12-phase-d-public-export-candidates.md
│   ├── 2026-05-12-phase-i-prime-followup-report.md
│   ├── 2026-05-12-phase-i-prime-report.md
│   ├── 2026-05-12-shared-extraction-phase-gh-report.md
│   └── 2026-05-13-shared-deps-distribution.md
└── operations/                                  Clinic operational SOPs (day-1 and ongoing)
    ├── day-1-clinic-runbook.md                  Master day-1 checklist; opening, check-in, outages, payment fallbacks
    ├── walk-in-and-phone-sop.md                 Triage scripts for walk-ins and phone calls; emergency redirect
    ├── no-show-cancellation-policy.md           Patient-facing policy + manual Stripe fee workflow
    ├── after-hours-messaging-sop.md             Response SLA, auto-reply text, emergency redirect, no on-call
    ├── prescribing-workflow-sop.md              Paper Rx process + legal disclaimer (no e-prescribing at launch)
    ├── imaging-and-referrals-sop.md             Referral letter template + chart tag tracking for imaging/referrals
    ├── labs-manual-workflow.md                  Specimen handoff → external lab → PDF upload pipeline
    ├── breach-notification-runbook.md           HIPAA 60-day rule, HHS steps, patient letter template, counsel triggers
    ├── baa-tracker.md                           Vendor BAA status table; next-step owner for each unsigned BAA
    ├── hipaa-npp-content.md                     Full NPP text for ConsentDocumentType.HIPAA_NPP (attorney review required)
    ├── roi-form-template.md                     HIPAA-compliant Release of Information form template
    └── aws-cost-scaledown-runbook.md           Pre-launch parked AWS state + exact relaunch/reverse commands
```

---

## Where suite docs do NOT live

Anything app-specific stays inside the app repo:

| Topic                                                                                                     | Lives in                                                                                          |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Workouts/Strength product spec, AI integration spec, runbooks, app-distro, mass-market punch list         | [`hollis-studio/Hollis-Workouts`](https://github.com/hollis-studio/Hollis-Workouts) `docs/`       |
| Health product/clinical spec, security, audits, polish-scope, admin/trainer plans, numbered docs taxonomy | [`hollis-studio/hollis-health-app`](https://github.com/hollis-studio/hollis-health-app) `docs/`   |
| Identity service ops, runbooks                                                                            | [`hollis-studio/hollis-identity`](https://github.com/hollis-studio/hollis-identity)               |
| Workouts server ops, runbooks                                                                             | [`hollis-studio/hollis-workouts-server`](https://github.com/hollis-studio/hollis-workouts-server) |

When a piece of work touches more than one app, the doc belongs here, not in any single app repo.

---

## GitHub canonical links

Use these when linking to suite docs from outside the `hollis-shared` checkout:

- Vision: <https://github.com/hollis-studio/hollis-shared/blob/main/docs/vision/2026-05-18-suite-vision.md>
- Architecture: <https://github.com/hollis-studio/hollis-shared/tree/main/docs/architecture>
- Research — suite adoption: <https://github.com/hollis-studio/hollis-shared/tree/main/docs/research/2026-05-12-suite-adoption>
- Reports: <https://github.com/hollis-studio/hollis-shared/tree/main/docs/reports>

---

## Conventions

- **Dates in filenames:** `YYYY-MM-DD-` prefix for any dated artifact (reports, phase snapshots, vision revisions).
- **Living docs:** files under `architecture/` are living — edit in place rather than dating each revision.
- **Reports are frozen:** anything in `reports/` is a historical snapshot. Don't edit; supersede with a new dated report.
- **Vision revisions:** if/when the vision is updated, save a new dated file under `vision/` and update this README's "Start here" pointer. Keep older revisions for the audit trail.
