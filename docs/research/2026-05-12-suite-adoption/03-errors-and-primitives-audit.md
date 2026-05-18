# Workouts ↔ @hollis-studio/contracts Errors & Primitives Audit

- **Created:** 2026-05-12
- **Workouts version inspected:** v1.6.3
- **Shared source inspected:** hollis-health-app@v3.7.45 / @hollis-studio/contracts@1.0.0

---

## 1. Result\<T\> shape comparison

### Field-by-field comparison

| Aspect                      | Workouts `src/types/errors.ts`                                                                           | Health shared `@hollis-studio/contracts`                                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Result<T>` type exists** | Yes — `export type Result<T, E = AppError> = { ok: true; data: T } \| { ok: false; error: E }` (line 68) | **No.** There is no `Result<T>` type anywhere in `shared/contracts/`. Health uses throw-based patterns throughout its services.                                 |
| **Success discriminant**    | `ok: true`                                                                                               | N/A                                                                                                                                                             |
| **Success payload field**   | `data: T`                                                                                                | N/A                                                                                                                                                             |
| **Failure discriminant**    | `ok: false`                                                                                              | N/A                                                                                                                                                             |
| **Failure payload field**   | `error: E` (defaults to `AppError`)                                                                      | N/A                                                                                                                                                             |
| **Error type**              | `AppError { code: AppErrorCode; message: string; details?: unknown }`                                    | `AppError` is a throw-able class (`server/src/lib/AppError.ts`); `ErrorCode` is a server-only HTTP enum (`VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`, etc.) |
| **Generic E parameter**     | Yes — `Result<T, E = AppError>` allows custom error envelope                                             | N/A                                                                                                                                                             |

### `ok()` / `err()` constructor comparison

|                                   | Workouts (`src/types/errors.ts` lines 94–100)            | Health shared                              |
| --------------------------------- | -------------------------------------------------------- | ------------------------------------------ |
| `ok<T>(data: T): Result<T>`       | `return { ok: true, data }`                              | Not exported — does not exist              |
| `err<T>(code, message, details?)` | Takes typed `AppErrorCode`, `string`, optional `unknown` | Not exported — does not exist              |
| **Signature match**               | —                                                        | **N/A — incompatible (one doesn't exist)** |

### Type narrowing helpers

Neither Workouts nor Health shared exports `isOk()` or `isErr()` helpers. Both repos rely on direct discriminant narrowing (`if (result.ok)` / `if (!result.ok)`). This is consistent and not a divergence point.

### Cloud Functions divergence (bonus finding)

The Workouts Cloud Functions maintain a **separate, structurally different copy** of `Result<T>` at `functions/src/utils/result.ts` (lines 9–11). Its `ok: false` branch carries `{ code: string; message: string }` directly (flat, no nested `error` object), while `src/types/errors.ts`'s `ok: false` branch carries `{ error: AppError }` (nested). The FI-1 rule (functions may not value-import from `src/`) explains this duplication, but it means there are currently **three divergent Result shapes** in the Workouts ecosystem:

1. `src/types/errors.ts` — `{ ok: false; error: { code, message, details? } }` (nested `AppError`)
2. `functions/src/utils/result.ts` — `{ ok: false; code: string; message: string }` (flat)
3. `@hollis-studio/contracts` — does not have a Result type at all

### Verdict

**MAJOR_DRIFT_PROMOTE_WORKOUTS_VARIANT**

The Health/shared package does not define a `Result<T>` type or `ok()`/`err()` constructors at all. The Workouts variant is the only complete, production-hardened implementation in the suite. The correct adoption path is to promote Workouts' `Result<T>` shape into `@hollis-studio/contracts` (or a new `@hollis-studio/result` sub-package), not to replace Workouts' implementation with something from shared.

---

## 2. AppErrorCode enum reconciliation

### Workouts `AppErrorCode` (21 codes, `src/types/errors.ts` lines 39–60)

| Workouts Code         | Exists in Health shared?                                                                                             | Disposition                                                                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AUTH_REQUIRED`       | No exact match. Health server uses `UNAUTHORIZED` (`AppError.unauthorized()`, `server/src/lib/AppError.ts` line 84). | **RENAME_TO_SHARED_EQUIVALENT** — maps to `UNAUTHORIZED`. However `AUTH_REQUIRED` is more precise (missing auth vs. bad auth); keep both after promotion. |
| `NETWORK_OFFLINE`     | Not in shared. Mobile-only concept.                                                                                  | **STAY_LOCAL** — meaningless on a server.                                                                                                                 |
| `HEALTH_PERMISSION`   | Not in shared. iOS HealthKit permission.                                                                             | **STAY_LOCAL** — mobile platform specific.                                                                                                                |
| `HEALTH_UNAVAILABLE`  | Not in shared.                                                                                                       | **STAY_LOCAL** — mobile platform specific.                                                                                                                |
| `VALIDATION_FAILED`   | Health server has `VALIDATION_ERROR` (`ERROR_CODES`, `AppError.ts` line 21). Different name, same semantics.         | **RENAME_TO_SHARED_EQUIVALENT** — align on `VALIDATION_ERROR` (server name) or promote `VALIDATION_FAILED` (more self-describing). Decision needed.       |
| `VALIDATION_WARNING`  | Not in shared. Workouts-specific: a soft validation result, not a hard error.                                        | **PROMOTE** — the soft-warning pattern is valuable cross-app.                                                                                             |
| `AI_UNAVAILABLE`      | Not in shared.                                                                                                       | **PROMOTE** — suite has AI features in both apps.                                                                                                         |
| `AI_INVALID_RESPONSE` | Not in shared.                                                                                                       | **PROMOTE** — same rationale.                                                                                                                             |
| `EXERCISE_NOT_FOUND`  | Not in shared.                                                                                                       | **STAY_LOCAL** — Workouts-domain entity.                                                                                                                  |
| `GYM_NOT_FOUND`       | Not in shared.                                                                                                       | **STAY_LOCAL** — Workouts-domain entity.                                                                                                                  |
| `PROGRAM_NOT_FOUND`   | Not in shared.                                                                                                       | **STAY_LOCAL** — Workouts-domain entity.                                                                                                                  |
| `SESSION_NOT_FOUND`   | Not in shared.                                                                                                       | **STAY_LOCAL** — Workouts-domain entity.                                                                                                                  |
| `BASELINE_NOT_FOUND`  | Not in shared.                                                                                                       | **STAY_LOCAL** — Workouts-domain entity.                                                                                                                  |
| `INJURY_NOT_FOUND`    | Not in shared.                                                                                                       | **STAY_LOCAL** — Workouts-domain entity.                                                                                                                  |
| `SESSION_CONFLICT`    | Health server has `CONFLICT` (`ERROR_CODES`, `AppError.ts` line 26). Generic version exists.                         | **RENAME_TO_SHARED_EQUIVALENT** — use `CONFLICT` at suite layer, keep `SESSION_CONFLICT` as Workouts-local alias if needed.                               |
| `SESSION_ABANDONED`   | Not in shared.                                                                                                       | **STAY_LOCAL** — workout-session lifecycle concept.                                                                                                       |
| `CONFIG_MISSING`      | Not in shared.                                                                                                       | **PROMOTE** — applies to any app with missing runtime config.                                                                                             |
| `SYNC_FAILED`         | Not in shared.                                                                                                       | **STAY_LOCAL** — Firestore sync is Workouts-specific today (migration target). After migration, may become `PROMOTE`.                                     |
| `SHARE_FAILED`        | Not in shared.                                                                                                       | **STAY_LOCAL** — mobile share-sheet concept.                                                                                                              |
| `NOT_IMPLEMENTED`     | Not in shared.                                                                                                       | **PROMOTE** — useful sentinel for stub services during migration.                                                                                         |
| `UNKNOWN`             | Not in shared.                                                                                                       | **PROMOTE** — every error taxonomy needs a fallback.                                                                                                      |

### Health server `ERROR_CODES` (from `server/src/lib/AppError.ts` lines 20–28) — codes Workouts could adopt today

| Health Server Code | Workouts has it?                                             | Action                                                                          |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `VALIDATION_ERROR` | Partial — as `VALIDATION_FAILED`                             | Align name in shared layer                                                      |
| `UNAUTHORIZED`     | Partial — as `AUTH_REQUIRED`                                 | Keep both with clear semantics                                                  |
| `FORBIDDEN`        | No                                                           | **ADOPT** — once suite auth is active, Workouts will need 403 semantics         |
| `NOT_FOUND`        | No — uses entity-specific codes (`EXERCISE_NOT_FOUND`, etc.) | Keep entity-specific; `NOT_FOUND` too generic                                   |
| `CONFLICT`         | Partial — as `SESSION_CONFLICT`                              | Align                                                                           |
| `RATE_LIMITED`     | No                                                           | **ADOPT** — will be needed once AI quota enforcement moves to the suite backend |
| `INTERNAL_ERROR`   | Partial — as `UNKNOWN`                                       | Align on `INTERNAL_ERROR` in shared                                             |

---

## 3. Primitive types

### What `@hollis-studio/contracts` primitives expose

`shared/contracts/primitives/` exports three things (via `primitives/index.ts`):

| Export                                                                                     | Source file                  | What it is                                                                      |
| ------------------------------------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------- |
| `isRecord(value)`                                                                          | `primitives/typeGuards.ts`   | Runtime type guard: `value is Record<string, unknown>`                          |
| `VOLUME_LEVELS`, `VolumeLevelSchema`, `VolumeLevel`, `VOLUME_LEVEL_LABELS`, `VOLUME_LEVEL` | `primitives/volume-level.ts` | Training volume enum (`low`, `moderate`, `high`) — Health periodization concept |

The `schemas/index.ts` in shared also exports (not in primitives/ but part of `@hollis-studio/contracts`):

| Export                               | Definition                                                                    |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `uuidSchema`                         | `z.string().uuid("Invalid UUID format")` (line 258)                           |
| `emailSchema`                        | `z.string().email(...)` (line 253)                                            |
| `weightKgSchema`                     | `z.number().min(20).max(500)` (lines 213–216) — body weight range (20–500 kg) |
| `heightCmSchema`                     | `z.number().min(50).max(300)`                                                 |
| `phoneSchema` / `phoneSchemaLenient` | E.164 phone validation                                                        |

### Per-primitive gap analysis

| Primitive concern           | Workouts                                                                                                                                                                                                             | Health shared                                                                                                              | Promotable?                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **UUID strings**            | Plain `string` throughout `src/types/models.ts` (e.g. `id: string`). No branded type. No Zod schema.                                                                                                                 | `uuidSchema` exists in `schemas/index.ts`. No branded type either.                                                         | `uuidSchema` could be adopted immediately — Workouts uses `z.string()` alone in most schemas. Low risk.                                                                                                                                                                                                                                                                                          |
| **ISO date strings**        | Not used — Workouts stores dates as `Date` objects (all timestamps in models are `Date`).                                                                                                                            | Health uses ISO strings in many API payloads (e.g. `dateOfBirth: z.string().optional()`). No `IsoDateString` branded type. | Divergence is intentional: Workouts is Firebase/Legend-State backed (native `Date`); Health is REST-API backed (ISO strings). **No promotion needed** — different persistence paradigms.                                                                                                                                                                                                         |
| **Weight quantities (kg)**  | `weightKg: number` everywhere in `src/types/models.ts`. Conversion constants in `src/utils/constants.ts`: `KG_TO_LBS = 2.20462`, `LBS_TO_KG = 0.453592`. Validation in services uses `ABSOLUTE_MAX_WEIGHT_KG = 500`. | `weightKgSchema = z.number().min(20).max(500)` (body weight only — clinical app context). No `KG_TO_LBS` constant.         | The Health `weightKgSchema` lower bound of 20 kg is **clinically motivated** (minimum human body weight). Workouts' lifting weights can be as low as 0 kg (bodyweight exercises with no added weight). **These are semantically different schemas — do not share.** Promote Workouts' `ABSOLUTE_MAX_WEIGHT_KG` and conversion factors as `@hollis-studio/units` only if the suite unifies unit display. |
| **Reps**                    | `reps: number` (integer, validated at service layer). No shared schema.                                                                                                                                              | Not present in shared contracts.                                                                                           | **STAY_LOCAL** — no cross-app need yet.                                                                                                                                                                                                                                                                                                                                                          |
| **Volume level**            | `VolumeLoad` concept exists in `src/services/analytics/` but uses `'low' \| 'moderate' \| 'high'` inline strings.                                                                                                    | `VolumeLevel = 'low' \| 'moderate' \| 'high'` in `primitives/volume-level.ts`.                                             | **ADOPT** — Workouts can import `VolumeLevel` from `@hollis-studio/contracts` and delete its inline union. This is the lowest-risk first adoption.                                                                                                                                                                                                                                                      |
| **Branded types**           | None. No `& { _brand: 'WeightKg' }` patterns anywhere in Workouts.                                                                                                                                                   | None in shared contracts either.                                                                                           | Both sides are unbranded — no divergence.                                                                                                                                                                                                                                                                                                                                                        |
| **Type guard (`isRecord`)** | `isRecord` does not exist in Workouts. Workouts uses inline type narrowing.                                                                                                                                          | `isRecord` in `primitives/typeGuards.ts`.                                                                                  | **ADOPT** — Workouts can use this in services that do `typeof x === 'object' && x !== null` checks (e.g. `src/services/ai/replyResponder.ts`).                                                                                                                                                                                                                                                   |

---

## 4. Service return pattern audit

Five representative Workouts services were inspected for `Result<T>` correctness and throw-free compliance.

### Service 1: `src/services/progression/e1rm.ts`

- **Pattern:** All three exported functions (`computeWathanE1RM`, `buildGatedE1RMSamples`, `calculateSetE1RM`) return `Result<T>`. `ok()` and `err()` imported from `@/types/errors` (line 30).
- **Throws:** Zero. Error paths all `return err(...)`.
- **Narrowing:** Caller sites use `if (!e1rmResult.ok) continue` (line 152) — correct discriminant narrowing.
- **Grade:** COMPLIANT.

### Service 2: `src/services/auth.ts`

- **Pattern:** 12 exported async functions all return `Promise<Result<T>>`. `err()` and `ok()` imported at line 86. Error codes used: `AUTH_REQUIRED`, `SYNC_FAILED`.
- **Throws:** Zero. All catch blocks `return err(...)` (e.g. `signInAnonymous` lines 186–195, `onAuthChange` lines 197–205).
- **Note:** `setAuthState` (line 224) wraps Legend State writes in try/catch → `return ok(undefined)` or `return err(...)`. No naked throws.
- **Grade:** COMPLIANT.

### Service 3: `src/services/bodyweightAdjustment.ts`

- **Pattern:** Both functions return `Result<T>`. `ok()` / `err()` imported at line 22. Error code used: `VALIDATION_FAILED`.
- **Throws:** Zero. Guard clauses use `return err(...)`.
- **Grade:** COMPLIANT (simplest example of the pattern done correctly).

### Service 4: `src/services/deloadDetection.ts`

- **Pattern:** `shouldSuggestDeload` returns `Result<DeloadSuggestion>`. Internal helper `computeMaxBelowTrendStreak` is a pure function returning `number`. `ok` imported at line 22.
- **Throws:** Zero. Insufficient-data branches `continue` or return `ok(defaultDeloadSuggestion)`.
- **Note:** `computeMaxBelowTrendStreak` correctly skips exercises with insufficient data via `if (!result.ok) continue` (line 75) rather than propagating the error upward. This is idiomatic for an aggregation function.
- **Grade:** COMPLIANT.

### Service 5: `src/services/progression/plateau.ts`

- **Pattern:** `detectPlateau`, `detectPhaseAwarePlateau`, and `detectMetricBasketPlateau` all return `Result<T>`. `err`, `ok`, `APP_ERROR_CODES` imported at line 44.
- **Throws:** Zero. Guard clauses on empty baseline history `return err(APP_ERROR_CODES.BASELINE_NOT_FOUND, ...)`.
- **Note:** `APP_ERROR_CODES` object is used as the code source (rather than string literals) — this is correct per the `as const satisfies Record<AppErrorCode, AppErrorCode>` constraint.
- **Grade:** COMPLIANT.

### Global thrower check

```
grep -rn "throw" src/services/ --include="*.ts"
```

Two hits only — both are comments, not executable statements:

- `src/services/ai/replyResponder.ts:109` — comment: `// Silent sync failure (e.g., getFunctions throws)`
- `src/services/postWorkout/eventCardSelection.ts:210` — JSDoc: `* Pure function; never throws.`

**Zero throw statements in production service code.** The CLAUDE.md hard rule (services return `Result<T>`, never throw) is fully enforced.

### Consumer rewrite footprint estimate

| Layer                  | Files importing from `@/types/errors`                   | Primary change on adoption                                       |
| ---------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| `src/services/`        | 85 files                                                | Change import path only if `ok()`/`err()` signature is identical |
| `src/hooks/`           | 11 files                                                | Same — import path change                                        |
| `src/components/`      | 3 files (PlateauSection ×2, CritiqueSheet)              | Same                                                             |
| `src/state/`           | 2 files                                                 | Same                                                             |
| `src/utils/`           | 1 file (`calculations.ts`)                              | Same                                                             |
| `__tests__/`           | ~15 files (type imports only)                           | No change if type alias is preserved                             |
| `functions/`           | 0 files (uses separate `functions/src/utils/result.ts`) | Separate migration path                                          |
| **Total source files** | **102 unique files**                                    | Import path change only if shapes align exactly                  |

The 85 service files are the bulk. If the promoted `@hollis-studio/contracts` `ok()`/`err()` signatures are **identical** to the current Workouts signatures, each file requires a one-line import change. If the `err()` signature changes (e.g. `code` becomes `string` instead of `AppErrorCode`), every call site's TypeScript type needs updating — estimated 150–200 individual call sites across those 85 files.

---

## 5. Migration risk

Ordered by severity (highest first):

1. **No shared `Result<T>` exists yet.** The most critical risk: there is nothing to migrate _to_ yet. Before any Workouts import can change, someone must add `Result<T>`, `ok()`, and `err()` to `@hollis-studio/contracts`. Getting consensus on the exact shape (especially the `E` generic and whether `AppErrorCode` is shared) takes cross-team alignment.

2. **`AppErrorCode` is a string union in Workouts; Health server `ErrorCode` is an HTTP-semantic enum.** These are architecturally different: Workouts codes are client-side behavioral codes (`BASELINE_NOT_FOUND`, `HEALTH_PERMISSION`); Health server codes map to HTTP status codes (`UNAUTHORIZED` → 401, `NOT_FOUND` → 404). A naive merge would either bloat the shared enum with mobile-only codes or strip Workouts codes. The shared `AppErrorCode` must be a **super-set union** with a clear partition into "suite-universal" vs. "app-local" sections.

3. **`err()` signature change breaks 150–200 call sites.** Workouts `err<T>(code: AppErrorCode, message: string, details?: unknown)` — if shared changes the `code` parameter type from the typed union to `string`, TypeScript loses exhaustiveness checking. If shared adds a required parameter, every call site breaks at compile time. The `err()` function signature must be source-compatible to avoid a big-bang rewrite.

4. **Cloud Functions use a structurally incompatible `Result<T>` copy** (`functions/src/utils/result.ts`, flat `{ ok: false; code: string; message: string }` vs. nested `{ ok: false; error: AppError }`). The FI-1 rule (Cloud Functions may not value-import from `src/`) currently requires this duplication. Fixing it means either: (a) publishing `@hollis-studio/result` as a separate package the functions can import, or (b) restructuring the monorepo so `functions/` can import from `@hollis-studio/contracts`. This is a separate migration track.

5. **102 import sites must be updated atomically or in a coordinated sweep.** If the migration is done piecemeal (some files on shared, some on local), TypeScript structural typing will keep it compiling — but `instanceof` checks or `satisfies` constraints referencing the local `AppErrorCode` type will diverge from the shared one silently until the final file is migrated.

6. **`functions/src/utils/result.ts` will need a separate migration plan.** The Cloud Functions layer cannot simply change its import — the FI-1 isolation rule blocks it. This migration must be decoupled from the `src/` migration.

7. **Test files import `Result` as a type** (~15 `__tests__` files). These will compile fine with structural typing even after the import path changes, but mock setup (e.g. `{ ok: false, error: { code: 'X', message: 'Y' } }`) must match the canonical shape exactly.

---

## Recommended Step-1-of-adoption commit shape

### What the first commit SHOULD do

```
feat(@hollis-studio/contracts): add Result<T>, ok(), err(), and AppErrorCode to shared errors
```

Specifically:

1. Add `Result<T, E = SharedAppError>` to `@hollis-studio/contracts/errors/result.ts` — shape must be **field-for-field identical** to Workouts `src/types/errors.ts` lines 68–100.
2. Export `SharedAppError { code: AppErrorCode; message: string; details?: unknown }`.
3. Export `ok<T>(data: T): Result<T>` — identical signature to Workouts `ok()`.
4. Export `err<T>(code: AppErrorCode, message: string, details?: unknown): Result<T>` — identical signature.
5. Define the shared `AppErrorCode` as a union of **only the truly cross-app codes**: `AUTH_REQUIRED | VALIDATION_FAILED | VALIDATION_WARNING | AI_UNAVAILABLE | AI_INVALID_RESPONSE | CONFIG_MISSING | NOT_IMPLEMENTED | UNKNOWN | RATE_LIMITED | FORBIDDEN`. Leave `NETWORK_OFFLINE`, `HEALTH_*`, `*_NOT_FOUND`, `SESSION_*`, `SHARE_FAILED`, `SYNC_FAILED` as Workouts-local.
6. Re-export from `@hollis-studio/contracts/index.ts`.
7. Do NOT add `VOLUME_LEVEL` or any domain-specific constants to the same commit.

### What the first commit MUST NOT do

- Do NOT change any Workouts source files. The first commit is Health-side only.
- Do NOT try to migrate all 102 Workouts files in one commit.
- Do NOT merge Workouts' `AppErrorCode` with Health server's `ErrorCode` (`UNAUTHORIZED`, `NOT_FOUND`, `CONFLICT`) — keep server HTTP codes in `server/src/lib/AppError.ts` and client behavioral codes in the shared `Result` layer. These serve different audiences.
- Do NOT reconcile the Cloud Functions `functions/src/utils/result.ts` variant in this commit — that is a separate track gated on FI-1 resolution.
- Do NOT change the `err()` function signature (e.g. adding a required `statusCode` or changing `code` to `string`) — that would cascade to all 85 service files immediately.

### The Workouts Step-2 commit (after shared package is published)

```
chore(workouts): adopt @hollis-studio/contracts Result<T> for shared error codes
```

- Change the import in `src/types/errors.ts` to re-export `Result`, `ok`, `err`, `AppError`, and the shared `AppErrorCode` subset from `@hollis-studio/contracts`.
- Extend the local `AppErrorCode` with Workouts-specific codes via union: `type AppErrorCode = SharedAppErrorCode | WorkoutsLocalCode`.
- The 102 downstream files do not need to change at all — they import from `@/types/errors` which remains the local barrel. The barrel's implementation now delegates to shared.
- After the barrel delegates to shared, run `npm run preflight` to catch any structural mismatches.
