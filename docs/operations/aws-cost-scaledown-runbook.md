# AWS Pre-Launch Cost Scale-Down & Relaunch Runbook

> **Status:** **Mostly reversed — this is now a historical record plus a
> finish-the-relaunch checklist.** Owner: Isaac.
> **Park captured:** 2026-06-22. **Relaunch state verified live:** 2026-09-20.
> **Scope:** Health was parked on 2026-06-22 to cut AWS spend while pre-launch.
> Health is now live again. §3/§4 record what was changed; §5 is the reverse
> checklist with the remaining items marked.
> **Companion doc:** [`../architecture/aws-infrastructure.md`](../architecture/aws-infrastructure.md)
> (full topology, account, routing, separation).
>
> ⚠️ **Do not run §5 top to bottom.** Most of it is already done, and step 2 as
> originally written would **roll Identity back to a June image**. Read the
> per-step markers first.

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

**Verified live 2026-09-20** (`aws ecs describe-services`,
`aws synthetics describe-canaries`, `aws cloudwatch describe-alarms`,
`aws ecs describe-clusters --include SETTINGS`):

| Thing | State on 2026-09-20 | Parked on 2026-06-22? |
|---|---|---|
| `hollis-prod-api` (Health API) | **1/1 running** (task-def `:443`) | yes → **unparked** |
| `hollis-prod-web-admin` | **1/1 running** (task-def `:205`) | yes → **unparked** |
| `hollis-identity-prod` | 1/1 running (task-def `:22`, 256 cpu / 1024 mem) | 2→1 task, 512→256 cpu → **still at parked size** |
| `hollis-workouts-server` | 1/1 running (task-def `:150`) | never parked |
| Canary `hollis-prod-admin` | **RUNNING** | stopped → **restarted** |
| Canary `hollis-prod-api-health` | **RUNNING** | stopped → **restarted** |
| Container Insights | **disabled** | disabled → **still disabled** |
| Alarm actions (7) | **4 enabled / 3 still muted** | all 7 muted → partly restored |
| ALB `hollis-prod-alb`, RDS `hollis-prod-postgres` | live | never parked |

So: the two Health services and both canaries are back. What is still in the
parked configuration is **Identity's size and task count**, **Container
Insights**, and **3 alarm actions** — see §5.

Neither the ALB nor RDS can be shut down: Workouts auth depends on Identity, and
the Workouts DB lives on the shared RDS instance.

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

## 4. Alarms muted on 2026-06-22 — and which are still muted

These 7 alarms fired **only because** the Health services were parked (no real
incident). Actions were **disabled** (not deleted) on 2026-06-22 with:

```
aws cloudwatch disable-alarm-actions --alarm-names \
  hollis-prod-api-down hollis-prod-web-admin-down hollis-prod-alb-no-healthy-hosts \
  hollis-prod-ecs-task-count-low hollis-prod-canary-admin-failed \
  hollis-prod-canary-api-health-failed hollis-prod-alb-5xx-spike
```

Current state, verified live 2026-09-20:

| Alarm | Actions enabled? |
|---|---|
| `hollis-prod-api-down` | ✅ enabled |
| `hollis-prod-alb-no-healthy-hosts` (api TG) | ✅ enabled |
| `hollis-prod-ecs-task-count-low` (api service) | ✅ enabled |
| `hollis-prod-canary-api-health-failed` | ✅ enabled |
| `hollis-prod-web-admin-down` | ❌ **still muted** |
| `hollis-prod-canary-admin-failed` | ❌ **still muted** |
| `hollis-prod-alb-5xx-spike` (LB-wide) | ❌ **still muted** |

All 7 are in `OK` state, so nothing is being suppressed right now — but
`web-admin` is live and serving, and a web-admin outage or a 5xx spike would
page nobody. See §5 step 5.

Check it yourself rather than trusting this table:

```
aws cloudwatch describe-alarms --alarm-names \
  hollis-prod-api-down hollis-prod-web-admin-down hollis-prod-alb-no-healthy-hosts \
  hollis-prod-ecs-task-count-low hollis-prod-canary-admin-failed \
  hollis-prod-canary-api-health-failed hollis-prod-alb-5xx-spike \
  --query 'MetricAlarms[].{Name:AlarmName,ActionsEnabled:ActionsEnabled,State:StateValue}' \
  --output table
```

> ⚠️ **Monitoring gaps that outlived the park:**
> - All of these alarms are api/admin-scoped. **Workouts and Identity still have
>   no dedicated down alarm.** Add a `HealthyHostCount < 1` alarm on target
>   groups `hollis-workouts-server` and `hollis-identity-prod` wired to the
>   alerts SNS topic.
> - Enabling alarm *actions* is not the same as alarm *delivery*. Confirm the
>   SNS topic has a confirmed subscription and that CloudWatch can actually
>   publish to it (the alert topics' KMS key policy has been a blocker) before
>   treating any of these as coverage.

---

## 5. Relaunch checklist — what is done and what is left

Status markers verified live on **2026-09-20**. Re-verify before acting; other
agents and CI deploys change this state.

### Step 1 — Bring Health services back — ✅ DONE

Both are 1/1. Nothing to run.

```
# For reference / if they are ever parked again:
aws ecs update-service --cluster hollis-prod-cluster --service hollis-prod-api        --desired-count 1
aws ecs update-service --cluster hollis-prod-cluster --service hollis-prod-web-admin  --desired-count 1
```

### Step 2 — Restore Identity to 2 tasks and 0.5 vCPU — ❌ NOT DONE

> 🛑 **DANGER — the command this step used to contain was destructive.**
> It read `--task-definition hollis-identity-prod:11`. Revision 11 was registered
> **2026-06-19** and pins a June container image. The service now runs revision
> **22** (registered 2026-09-19) with a completely different image. Pinning
> revision 11 today would **silently roll the Identity service back three months
> of code** — losing every security fix, rate-limit and token change shipped
> since — while looking like a routine resize. **Never name a literal task
> definition revision in a runbook.** Derive the current one and change only the
> field you mean to change.

Identity is still at the parked size: **1 task, cpu `256`, memory `1024`**.

The task count is safe to change on its own — it does not touch the task
definition, so the running image is preserved:

```
aws ecs update-service --cluster hollis-prod-cluster --service hollis-identity-prod \
  --desired-count 2
```

Changing cpu/memory *does* require a new task definition revision. The correct
procedure is to **copy the revision the service is running right now** and edit
only `cpu`/`memory`:

```sh
# 1. Read the revision the service is ACTUALLY running (never hardcode this).
CURRENT_TD=$(aws ecs describe-services --cluster hollis-prod-cluster \
  --services hollis-identity-prod --query 'services[0].taskDefinition' --output text)
echo "$CURRENT_TD"    # sanity-check this before continuing

# 2. Dump it, strip the read-only fields, and raise cpu 256 -> 512.
aws ecs describe-task-definition --task-definition "$CURRENT_TD" \
  --query 'taskDefinition' --output json \
  | jq 'del(.taskDefinitionArn, .revision, .status, .requiresAttributes,
            .compatibilities, .registeredAt, .registeredBy, .deregisteredAt)
        | .cpu = "512"' > /tmp/identity-td.json

# 3. Confirm the image is the CURRENT one, not an old tag, before registering.
jq -r '.containerDefinitions[].image' /tmp/identity-td.json

# 4. Register and roll the service onto the new revision.
NEW_TD=$(aws ecs register-task-definition --cli-input-json file:///tmp/identity-td.json \
  --query 'taskDefinition.taskDefinitionArn' --output text)
aws ecs update-service --cluster hollis-prod-cluster --service hollis-identity-prod \
  --task-definition "$NEW_TD" --desired-count 2
```

> **Terraform owns this service.** `hollis-identity/infrastructure` manages the
> task definition, so a CLI-registered revision is drift and the next `apply`
> may revert it. The durable fix is to raise cpu/memory in the Terraform
> variables and apply — do that instead of the CLI path unless you need the
> capacity in the next five minutes. Either way, **re-plan against the live
> image tag before applying a saved plan.**

### Step 3 — Restart the health-check canaries — ✅ DONE

Both `hollis-prod-admin` and `hollis-prod-api-health` are `RUNNING`.

```
# For reference:
aws synthetics start-canary --name hollis-prod-admin
aws synthetics start-canary --name hollis-prod-api-health
```

### Step 4 — Re-enable Container Insights — ❌ NOT DONE (still `disabled`)

Optional; costs ~$25/mo. Health is live and there is currently no
container-level metric history for incident review.

```
aws ecs update-cluster-settings --cluster hollis-prod-cluster \
  --settings name=containerInsights,value=enabled
```

### Step 5 — Re-enable the muted alarm actions — ⚠️ PARTIAL (4 of 7)

`api-down`, `alb-no-healthy-hosts`, `ecs-task-count-low` and
`canary-api-health-failed` were re-enabled on 2026-09-20. Still muted:

```
aws cloudwatch enable-alarm-actions --alarm-names \
  hollis-prod-web-admin-down hollis-prod-canary-admin-failed hollis-prod-alb-5xx-spike
```

Note that `park_alarm_actions_enabled`-style Terraform variables also gate these;
enabling via the CLI without updating Terraform will be reverted by the next
`apply`. See §4 for the delivery caveat — an enabled action with an
unsubscribable SNS topic is not monitoring.

### Verification after any of the above

```
aws ecs describe-services --cluster hollis-prod-cluster \
  --services hollis-prod-api hollis-prod-web-admin hollis-identity-prod \
  --query 'services[].{S:serviceName,Desired:desiredCount,Running:runningCount,TD:taskDefinition}' --output table
```

Confirm the ALB target groups report `healthy` before relying on the endpoints.

---

## 6. Not done (deferred, destructive — left alone on purpose)

- Deleting the Health-only secrets `hollis-prod/app/*` and purging the
  `hollis-prod-canary-artifacts` S3 bucket (~$2/mo total). Skipped because Health
  is relaunching soon and these are not cheaply reversible. **Still the right
  call — Health relaunched, and those secrets are in active use by task
  definition `hollis-prod-api:443`. Do not delete them.**

---

Last reviewed: 2026-09-20 (relaunch state verified live; §5 step 2's hardcoded
`hollis-identity-prod:11` replaced with a derive-the-current-revision procedure
after it was found to be a silent three-month code rollback).
