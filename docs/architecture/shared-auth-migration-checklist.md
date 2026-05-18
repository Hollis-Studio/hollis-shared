# Shared Auth Migration Checklist

> **Status:** active execution backlog  
> **Scope:** every remaining task required before Workouts is fully migrated from
> Firebase Auth to the suite-wide Hollis Identity Service and shared auth
> packages.

This plan expands Step 6 and the auth portions of Steps 5, 7, and 8 in
[`2026-05-11-suite-infrastructure-migration.md`](./2026-05-11-suite-infrastructure-migration.md).
Use that plan for the full backend cutover sequence; use this document for the
auth-specific readiness checklist.

## Current State

Workouts is **not** on shared auth yet.

| Area                    | Current state                                                                                                                     | Gap                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Workouts mobile auth    | `src/services/auth.ts`, `src/services/firebase.ts`, and `src/state/auth.ts` still use Firebase Auth and Firebase UIDs.            | Replace with Hollis Identity client calls and canonical identity `userId`.                                                                |
| Workouts backend        | `workouts-server/` has not been created in this repo yet.                                                                         | Add server auth middleware that consumes `@hollis-studio/auth-client`.                                                                           |
| Shared contracts        | `@hollis-studio/contracts` exports token claims, audiences, auth token types, and revocation reasons.                                    | Add full identity request/response contracts, route schemas, profile shape, and migration mapping types.                                  |
| Shared auth client      | `@hollis-studio/auth-client` exports `createAuthClient`, `requireAuth`, `verifyToken`, audience validation, and a remote `/verify` call. | Add the rest of the intended surface (`getMe`, `revokeToken`, refresh/session helpers, JWKS rotation path) and harden server integration. |
| Hollis Identity Service | Planned as a new service extracted from Health auth.                                                                              | Build and deploy the service, then migrate Health before Workouts depends on it.                                                          |
| Health auth             | Health mobile has an auth abstraction, but Health server auth is still the source implementation to extract.                      | Move auth ownership into `hollis-identity`; Health becomes a consumer.                                                                    |
| Data identity           | Firestore documents are keyed by Firebase UID.                                                                                    | Create and verify Firebase UID → Hollis Identity userId mapping before ETL or client cutover.                                             |

## Target State

The migration is complete only when all of these are true:

- `hollis-identity` is the source of truth for users, credentials, sessions,
  MFA, token revocation, and suite-level identity profile.
- Health and Workouts servers verify access through `@hollis-studio/auth-client`.
  Consumer apps do not locally own JWT signing, password verification, refresh
  token persistence, MFA state, or token denylist checks.
- Workouts mobile authenticates through a mobile-compatible Hollis Identity
  client or a local `src/services/identity.ts` wrapper around the shared
  contracts.
- Workouts no longer imports Firebase Auth in runtime app code.
- Workouts persisted data, local caches, RevenueCat identity handoff, and future
  Postgres rows use canonical Hollis Identity `userId`, not Firebase UID.
- Shared contracts define every auth boundary payload used by Identity, Health,
  Workouts, and future suite apps.
- Existing Health users migrate without password reset unless a security review
  explicitly chooses otherwise.

## Dependency Order

### 1. Finish Shared Identity Contracts

- Decide and document the public package boundary:
  - `@hollis-studio/contracts` for Zod schemas, route constants, token claims, and
    domain types.
  - `@hollis-studio/auth-client` for server-side verification middleware.
  - A separate mobile client package only if `@hollis-studio/auth-client` remains
    server-only.
- Add identity route constants and schemas for:
  - `POST /signup`
  - `POST /login`
  - `POST /oauth/apple`
  - `POST /oauth/google`
  - `POST /refresh`
  - `POST /logout`
  - `GET /me`
  - `POST /verify`
  - `POST /revoke`
  - MFA enroll, verify, challenge, recovery, and disable flows.
- Add shared response contracts for:
  - access/refresh token envelope
  - MFA pending token envelope
  - identity profile
  - session/device list
  - auth errors
  - token revocation result
  - Firebase UID migration mapping.
- Keep `AccessTokenClaims` minimal and suite-safe:
  `sub`, `userId`, `type`, `jti`, `aud`, `iat`, `exp`, MFA timestamps, and a
  namespaced `claims` extension.
- Add contract tests and Node ESM smoke tests for every public subpath Workouts
  will consume.

### 2. Harden `@hollis-studio/auth-client`

- Confirm the remote `/verify` request/response shape matches the final
  Identity route contract.
- Add `getMe(token)` and `revokeToken(jti)` or remove those names from the suite
  plan if the final API intentionally differs.
- Add refresh/session helpers only if server consumers need them; mobile refresh
  can live in a separate identity client.
- Add JWKS fetch and cache support for local JWT verification with key rotation.
- Require explicit audience validation for:
  - `hollis-health`
  - `hollis-workouts`
  - service-token scopes such as workouts read access for Health admin.
- Type Express request augmentation in the consuming servers instead of relying
  on ad hoc casts.
- Return shared error contracts for auth required, forbidden, expired token,
  revoked token, MFA required, and identity service unavailable.
- Add integration tests that simulate invalid signatures, wrong audience,
  revoked token, timeout, malformed claims, and Identity outage.

### 3. Build Hollis Identity Service

- Create `hollis-identity` as its own service/repo unless the suite plan is
  explicitly amended.
- Extract or port Health auth ownership:
  - password login/signup
  - password reset/change
  - Apple and Google credential exchange
  - refresh token storage and rotation
  - session/device management
  - MFA setup and enforcement
  - token denylist/revocation
  - auth audit logging.
- Create the Identity Prisma schema for:
  - `User`
  - `Session`
  - `MfaSetup`
  - `TokenDenylist`
  - `AuditLog`
  - external identity provider links
  - legacy Firebase UID mapping.
- Implement and validate every shared route contract from Step 1.
- Add JWT signing, JWKS publishing, key rotation, token revocation lookup,
  password policy enforcement, rate limiting, audit logging, and structured
  error mapping.
- Deploy staging infrastructure:
  ECS Fargate service, RDS Postgres, ALB, DNS for `identity.hollis.health`,
  Secrets Manager, logs, metrics, alarms, and backup/restore policy.
- Run a security review on token TTLs, refresh rotation, MFA bypass rules,
  account enumeration, brute-force protection, and audit retention.

### 4. Migrate Health To Be A Consumer

- Switch Health mobile, web-admin, and web-public from local `/api/auth/*`
  ownership to Identity routes.
- Replace Health server JWT/password/session/MFA ownership with
  `@hollis-studio/auth-client` middleware and Identity API calls.
- Keep Health domain data in the Health database, linked by canonical `userId`.
- Preserve any Health-specific organization, tier, or clinician claims under
  `claims.hollisHealth.*`.
- Run migration for existing Health users, bcrypt hashes, sessions, MFA state,
  and token denylist records.
- Keep a rollback path until Health production has soaked on Identity.

### 5. Add Workouts Backend Auth

- Create `workouts-server/` as planned in the suite migration.
- Install and configure `@hollis-studio/auth-client` through the shared package
  consumption pattern.
- Add Express request augmentation for `req.userId` and `req.tokenClaims`.
- Protect every user data route with the shared auth middleware.
- Validate all API payloads with `@hollis-studio/contracts`.
- Add service-token support for Health admin read-only Workouts access.
- Add tests for authenticated user routes, wrong audience, service-token scopes,
  and auth error propagation.

### 6. Prepare Workouts Mobile For Identity

- Add the mobile-facing Identity boundary:
  - preferred: shared mobile client package if one exists;
  - fallback: `src/services/identity.ts` wrapping fetch calls to Identity routes
    with shared request/response schemas.
- Replace Firebase-auth-only schemas in `src/schemas/auth.ts` with shared
  identity schemas while preserving Workouts-specific form validation UX.
- Refactor `src/services/auth.ts` so exported functions keep the current
  `Result<T>` discipline but call Identity instead of Firebase Auth.
- Refactor `src/state/auth.ts` to store canonical Identity user/session state,
  not Firebase `User`.
- Update `useAuth`, login/signup screens, settings sign-out, onboarding, and
  account linking flows to consume the new state shape.
- Replace Firebase UID assumptions in:
  - user profile documents
  - Legend/MMKV persistence keys
  - RevenueCat identity handoff
  - notification/device token association
  - AI audit/user usage records
  - Firestore ETL mapping.
- Keep Apple and Google sign-in flows, but route the native provider token to
  Identity for exchange instead of signing into Firebase directly.
- Update offline boot behavior so cached app data waits for Identity hydration
  and uses a stable canonical `userId`.

### 7. Migrate Workouts Data Identity

- Generate a UID mapping table for every Firebase Auth UID that has Workouts
  data.
- Decide how anonymous Workouts users migrate:
  upgrade before cutover, preserve as guest identity, or expire.
- Dry-run Firestore → Postgres ETL with UID mapping and row-count checks.
- Spot-check migrated sessions, programs, gyms, injuries, analytics cache, AI
  audit logs, and settings for at least 10 users.
- Define cutover behavior:
  read-only Firestore window, migration execution, client release gate, rollback
  criteria, and post-cutover token invalidation.
- Retain the legacy UID mapping for support and audit lookup after Firebase is
  retired.

### 8. Remove Firebase Auth From Runtime

- Delete Firebase Auth imports from runtime app code after the backend and data
  migration are complete.
- Keep Firebase Admin usage only in one-off ETL scripts until Firebase is fully
  retired.
- Remove Firebase Auth dependency usage from:
  - `src/services/auth.ts`
  - `src/services/firebase.ts`
  - `src/state/auth.ts`
  - auth-related hooks and tests
  - RevenueCat handoff code.
- Add or update architecture checks so new Firebase Auth imports fail after
  cutover.
- Update docs and AGENTS after Firebase is no longer the runtime auth model.

### 9. Verification Gates

Before Workouts switches production users to shared auth, run and record:

- `@hollis-studio/contracts` contract test suite.
- `@hollis-studio/auth-client` unit and integration tests.
- Identity service API integration tests against staging.
- Health login/signup/refresh/MFA/logout regression tests after Health consumes
  Identity.
- Workouts mobile auth unit tests and screen tests.
- Workouts server authenticated route tests.
- UID mapping dry run and row-count reconciliation.
- End-to-end manual QA:
  signup, login, logout, refresh after app restart, Apple sign-in, Google
  sign-in, password reset, account deletion/support path, offline app launch,
  RevenueCat handoff, notification token association, and failed/expired token
  recovery.
- A production rollback rehearsal covering DNS, client feature flags, token
  compatibility, and database restore points.

## Workouts Cutover Blockers

Do not replace Workouts mobile Firebase Auth until all blockers are cleared:

- Identity service is deployed in staging and passes contract tests.
- Health server has successfully delegated auth to Identity in staging.
- Shared identity contracts are finalized for all Workouts auth flows.
- `@hollis-studio/auth-client` has the server surface Workouts needs.
- Workouts server exists and validates tokens through shared auth middleware, or
  an explicit temporary bridge has been approved.
- Firebase UID → Identity userId mapping has passed a dry run.
- Apple and Google mobile credential exchange are supported by Identity.
- RevenueCat identity handoff has a canonical userId plan.
- Rollback strategy is documented and tested.

## Open Decisions

- Is `@hollis-studio/auth-client` intentionally server-only? If yes, create a separate
  mobile identity client package or commit to a local Workouts wrapper.
- What is the canonical user ID format, and does it preserve Health's existing
  external identifiers?
- Should Workouts support anonymous/guest accounts after shared auth, or require
  account creation before any persisted data sync?
- Which token audiences and service-token scopes are required for Health admin
  to read Workouts data?
- Which claims belong in Identity tokens versus each app database?
- How long do active Health tokens remain valid during the extraction cutover?
- Does Identity own suite subscription/entitlement claims, or does Workouts keep
  RevenueCat as the app-local entitlement source until a later entitlement
  service exists?

## First Executable Milestone

The next useful milestone is **shared-auth readiness in staging**:

1. Finish identity contracts in `hollis-shared`.
2. Finish `@hollis-studio/auth-client` server verification, JWKS, `getMe`, and
   revocation APIs.
3. Stand up `hollis-identity` staging.
4. Point a Health staging server route at Identity through `@hollis-studio/auth-client`.
5. Add a minimal Workouts server protected route that verifies a
   `hollis-workouts` audience token.

Once that works, Workouts mobile can start replacing Firebase Auth behind a
feature flag without guessing at the final auth shape.
