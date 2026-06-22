# AWS Pre-Launch Cost Scale-Down & Relaunch Runbook

> **Status:** Active. Owner: Isaac.
> **Captured:** 2026-06-22.
> **Scope:** While Hollis Health is pre-launch (no clinic lease yet), the Health
> services are parked to cut AWS spend, keeping only the live Workouts stack up.
> This runbook records exactly what was changed and the **exact commands to
> reverse it** when Health goes live.
> **Companion doc:** [`../architecture/aws-infrastructure.md`](../architecture/aws-infrastructure.md)
> (full topology, account, routing, separation).

---

## 1. Why

Health is not open and we are still securing a lease, so the Health API, web-admin,
and the every-60-second health-check canaries were burning money for a closed
product. Goal: keep **Workouts** (and the Identity service it authenticates
through) fully live; park everything Health-only. All actions are **reversible
scale-downs/disables — nothing was deleted.**

Run-rate: **~$290–310/mo → ~$85–90/mo** (≈$200/mo saved).

---

## 2. What is currently up vs parked

**Live (do not touch):** `hollis-workouts-server`, `hollis-identity-prod` (1 task),
the ALB `hollis-prod-alb`, RDS `hollis-prod-postgres`. Workouts auth depends on
Identity, and the Workouts DB lives on the shared RDS instance — neither can be
shut down.

**Parked:** `hollis-prod-api` (0 tasks), `hollis-prod-web-admin` (0 tasks), both
Synthetics canaries (stopped), Container Insights (disabled), 7 alarm actions
(disabled).

---

## 3. Changes applied (2026-06-22)

| Action | Command run | ~$/mo saved |
|---|---|---:|
| Stop both canaries | `aws synthetics stop-canary --name hollis-prod-admin` / `... hollis-prod-api-health` | ~99 |
| Park Health API | `aws ecs update-service --cluster hollis-prod-cluster --service hollis-prod-api --desired-count 0` | ~18 |
| Park web-admin | `aws ecs update-service --cluster hollis-prod-cluster --service hollis-prod-web-admin --desired-count 0` | ~18 |
| Identity 2→1 task | `aws ecs update-service --cluster hollis-prod-cluster --service hollis-identity-prod --desired-count 1` | ~18 |
| Identity 0.5→0.25 vCPU | new task-def **revision 12** (cpu `256`, memory `1024`), service updated to it | ~9 |
| Disable Container Insights | `aws ecs update-cluster-settings --cluster hollis-prod-cluster --settings name=containerInsights,value=disabled` | ~25 |
| Freed public IPv4s | automatic (3 fewer tasks) | ~11 |
| Mute 7 alarm actions | see §4 | — |

---

## 4. Alarms muted

These 7 alarms fire **only because** the Health services are parked (no real
incident). Actions were **disabled** (not deleted) so they stop paging but snap
back at relaunch:

- `hollis-prod-api-down`, `hollis-prod-web-admin-down`,
  `hollis-prod-alb-no-healthy-hosts` (api TG), `hollis-prod-ecs-task-count-low`
  (api service), `hollis-prod-canary-admin-failed`,
  `hollis-prod-canary-api-health-failed`, `hollis-prod-alb-5xx-spike` (LB-wide;
  503s come from the default listener rule pointing at the now-empty api TG).

```
aws cloudwatch disable-alarm-actions --alarm-names \
  hollis-prod-api-down hollis-prod-web-admin-down hollis-prod-alb-no-healthy-hosts \
  hollis-prod-ecs-task-count-low hollis-prod-canary-admin-failed \
  hollis-prod-canary-api-health-failed hollis-prod-alb-5xx-spike
```

> ⚠️ **Monitoring gap:** all existing down/error alarms were api/admin-scoped.
> With them muted, the live **Workouts + Identity** services currently have **no
> dedicated down alarm**. If continuous monitoring is wanted before launch, add a
> `HealthyHostCount < 1` alarm on target group `hollis-workouts-server` wired to
> the `hollis-prod-alerts` SNS topic.

---

## 5. Relaunch — reverse everything for Health go-live

Run these when the clinic is opening:

```
# 1. Bring Health services back
aws ecs update-service --cluster hollis-prod-cluster --service hollis-prod-api        --desired-count 1
aws ecs update-service --cluster hollis-prod-cluster --service hollis-prod-web-admin  --desired-count 1

# 2. Restore Identity to 2 tasks (and 0.5 vCPU via revision 11)
aws ecs update-service --cluster hollis-prod-cluster --service hollis-identity-prod \
  --desired-count 2 --task-definition hollis-identity-prod:11

# 3. Restart the health-check canaries
aws synthetics start-canary --name hollis-prod-admin
aws synthetics start-canary --name hollis-prod-api-health

# 4. Re-enable Container Insights (optional — costs ~$25/mo)
aws ecs update-cluster-settings --cluster hollis-prod-cluster \
  --settings name=containerInsights,value=enabled

# 5. Re-enable the muted alarm actions
aws cloudwatch enable-alarm-actions --alarm-names \
  hollis-prod-api-down hollis-prod-web-admin-down hollis-prod-alb-no-healthy-hosts \
  hollis-prod-ecs-task-count-low hollis-prod-canary-admin-failed \
  hollis-prod-canary-api-health-failed hollis-prod-alb-5xx-spike
```

After step 1–2, confirm the ALB target groups report `healthy` before relying on
the endpoints:

```
aws ecs describe-services --cluster hollis-prod-cluster \
  --services hollis-prod-api hollis-prod-web-admin hollis-identity-prod \
  --query 'services[].{S:serviceName,Desired:desiredCount,Running:runningCount}' --output table
```

---

## 6. Not done (deferred, destructive — left alone on purpose)

- Deleting the Health-only secrets `hollis-prod/app/*` and purging the
  `hollis-prod-canary-artifacts` S3 bucket (~$2/mo total). Skipped because Health
  is relaunching soon and these are not cheaply reversible.
