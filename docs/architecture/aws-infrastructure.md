# Hollis Suite — AWS Infrastructure Inventory

> **Status:** Living reference. Owner: Isaac.
> **Captured:** 2026-06-22 (verified live via AWS CLI).
> **Scope:** What is actually deployed in AWS account `344345273019` (us-east-1):
> services, routing, data stores, the Workouts↔Health separation boundary, and
> the monthly cost breakdown.
> **Companion docs:**
>
> - End-state architecture: [`./suite-strategy.md`](./suite-strategy.md)
> - Migration sequencing: [`./suite-infrastructure-migration.md`](./suite-infrastructure-migration.md)
> - Cost scale-down + relaunch runbook: [`../operations/aws-cost-scaledown-runbook.md`](../operations/aws-cost-scaledown-runbook.md)

---

## 1. Account & region

- **Account:** `344345273019`
- **Region:** `us-east-1` (everything lives here — single region, single account)
- **IAM principal in use:** `user/Hollis-Dev-MacM4pro`

---

## 2. Compute — ECS Fargate

One cluster, `hollis-prod-cluster`, fronts every backend. All services are
Fargate (no EC2). **The 2026-06-22 pre-launch scale-down has been reversed for
Health — nothing here is parked any more.** Sizes below reflect the
**2026-09-27 cost pass** (owner call; ~$35–45/mo saved):

| Service | Task size | Arch / capacity | Routed host |
|---|---|---|---|
| `hollis-prod-api` (Health API) | 0.5 vCPU / 1 GB | ARM64 (Graviton), FARGATE | `api.hollis.health` (ALB default) |
| `hollis-prod-web-admin` | 0.25 vCPU / 0.5 GB | X86_64, **FARGATE_SPOT** | `admin.hollis.health` |
| `hollis-identity-prod` | 0.25 vCPU / 1 GB | ARM64 (Graviton), FARGATE | `identity.hollis.health` |
| `hollis-workouts-server` | 0.25 vCPU / 0.5 GB | ARM64 (Graviton), FARGATE | `workouts-api.hollis.health` |

Each repo's deploy workflow builds `linux/arm64` and stamps `runtimePlatform`
on the task definition it registers, so image and task arch change together.
A Terraform-registered revision is only safe to run once its `image_tag`
names an arm64 image. web-admin stays x86 because Fargate Spot does not run
ARM64; Spot tasks can be reclaimed with a 2-minute warning (owner-only app).

Other 2026-09-27 settings: **Container Insights `disabled`**, RDS backup
retention **7 days** (was 30), RDS Enhanced Monitoring **off** (Performance
Insights free tier stays on), both Synthetics canaries **hourly**. Public IPv4
per task (~$3.60/mo each) is deliberately kept: a NAT gateway or VPC
endpoints cost more.

**ECR repositories (6):** `hollis-prod-api`, `hollis-prod-web-admin`,
`hollis-identity-prod`, `hollis-workouts-server`, `hollis-dev-api`,
`hollis-dev-web-admin`.

---

## 3. Routing — Application Load Balancer

Single internet-facing ALB `hollis-prod-alb`. Port 80 redirects to 443. Host-based
rules on the 443 listener:

| Priority | Host | Target group (port) |
|---|---|---|
| 100 | `admin.hollis.health` | `hollis-prod-web-admin-tg` (3000) |
| 150 | `identity.hollis.health` | `hollis-identity-prod` (4001) |
| 200 | `workouts-api.hollis.health` | `hollis-workouts-server` (3002) |
| default | (unmatched) | `hollis-prod-api-tg` (4000) |

The marketing site (`hollis.health` / `www.hollis.health`) is **not** on the ALB —
it is served by CloudFront distribution `E2M0GWKOQ8UJQF` from the
`hollis-prod-web-public` S3 bucket.

---

## 4. Data stores

### RDS — one shared Postgres instance
- **Instance:** `hollis-prod-postgres`, `db.t3.micro`, **single-AZ**
- **Storage:** 50 GB gp3, 3000 IOPS; **7-day** backup retention (30 until 2026-09-27)
- **Network:** VPC `vpc-0abe755c07479d64a`, security group `sg-072f4e44c43356914`
- **Three logical databases on the one instance**, each with its own DB user:

  | Service | Database | DB user |
  |---|---|---|
  | Health | `hollis` | `hollis_admin` |
  | Workouts | `hollis_workouts` | `hollis_workouts` |
  | Identity | `hollis_identity` | `hollis_identity` |

### S3 (7 buckets)
`hollis-prod-uploads`, `hollis-prod-web-public`, `hollis-prod-phi-audit-archive`,
`hollis-prod-cloudtrail-logs`, `hollis-prod-canary-artifacts`,
`hollis-health-tf-state-dev`, `hollis-health-tf-state-prod`.

### DynamoDB (2 tables)
`hollis-health-tf-locks-dev`, `hollis-health-tf-locks-prod` — **Terraform state
locks only**, no application data.

---

## 5. Secrets & keys

**Secrets Manager (16 secrets)** partitioned by namespace — this is the
credential-isolation boundary between business units:

- `hollis-prod/app/*` — Health API (database-url, JWT/billing/pepper, Stripe,
  OpenAI, SNS push, encryption key)
- `hollis-identity-prod/*`, `hollis-prod/identity/*` — Identity service
- `hollis-prod/workouts/*` — Workouts (database-url, identity-jwt-secret,
  identity-service-url, RevenueCat, Gemini, Google credentials, Sentry, SSL CA)
- `hollis-prod/eas/*` — Expo build token

Each ECS service has its own IAM task role and can only read its own namespace.

---

## 6. Workouts ↔ Health separation

**Separated (app / identity / credential layer):**
- Distinct ECS service, task definition, and ECR image per app
- Distinct IAM task roles (`hollis-workouts-server-task` vs
  `hollis-prod-ecs-task-role`) — Workouts cannot read Health's secrets, and vice
  versa
- Separate logical database + DB user per service (see §4)

**Shared (infrastructure layer):**
- Same RDS **instance**, same VPC, same security group `sg-072f4e44c43356914`
- Same ECS cluster and same ALB

**Coupling to note:** Workouts authenticates **through the shared Identity
service** (`identity-service-url` + `identity-jwt-secret` in its task config), so
Identity must stay up for Workouts auth to function.

**Open risk:** Database isolation is **logical, not physical** — the consumer
Workouts DB and the PHI-bearing Health DB share one `db.t3.micro` and one security
group. The actual HIPAA blast-radius control is Postgres role grants; confirm
`hollis_workouts` has no privileges on the `hollis` database. Single-AZ is also a
resilience gap for clinic launch.

---

## 7. Monthly cost (pre-launch baseline)

Full-service run-rate trended **$118 (Apr) → $178 (May) → ~$290–310 (Jun
projected)**. June's spike was almost entirely CloudWatch. Drivers at full scale:

| Service | ~$/mo | Driver |
|---|---:|---|
| CloudWatch | ~135 | Synthetics canaries (~$99, ran every 60s) + detailed metrics (~$26) |
| ECS Fargate | ~76 | 5 running tasks |
| VPC | ~24 | Public IPv4 addresses ($3.60/mo each); **no NAT gateway** |
| RDS | ~20 | `db.t3.micro` (already smallest tier) |
| ELB | ~16 | the single ALB (fixed) |
| Secrets / KMS / ECR / S3 / R53 | ~14 | overhead |

The 2026-06-22 scale-down (Workouts + Identity only) took run-rate to
**~$85–90/mo**. **That saving is gone: Health relaunched, so the cost table above
is the current shape again** — 4 services running and both canaries back. The
only savings still in effect are Container Insights (`disabled`, ~$25/mo) and
Identity at 1 task / 0.25 vCPU (~$27/mo). Expect roughly **~$250–270/mo**, and
read the real number off Cost Explorer rather than this table. See
[`../operations/aws-cost-scaledown-runbook.md`](../operations/aws-cost-scaledown-runbook.md)
for exactly what changed and what remains parked.

---

Last reviewed: 2026-09-20 (compute table, cost note and the parked/relaunch
status verified live via AWS CLI; the rest of the document still carries its
2026-06-22 capture date and has not been re-verified).
