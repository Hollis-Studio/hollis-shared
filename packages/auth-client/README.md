# @hollis-studio/auth-client

Thin middleware package for consumer app servers (hollis-health-app, hollis-workouts) to verify Identity Service tokens. Implements Express-compatible middleware without requiring each app to replicate JWT verification logic.

Published to the GitHub Package Registry (`npm.pkg.github.com`).

## How it works

1. Call `createAuthClient(opts)` once at server startup with your Identity Service URL and expected audience.
2. Use the returned `auth.requireAuth()` middleware on protected routes. It reads the `Authorization: Bearer <token>` header, verifies the token, and attaches `req.userId` and `req.tokenClaims` for downstream handlers.
3. On failure, the middleware calls `next(error)` with an `AppError`-shaped object (never throws directly).

**Verification fast path:** if `jwksSecret` is provided, tokens are verified locally via `jsonwebtoken` with no network call. Otherwise, verification delegates to a `POST {identityServiceUrl}/verify` request.

<!-- UNVERIFIED: The Identity Service /verify endpoint is documented as a stub in the source (TODO(W6): "Once the Identity Service is live, wire up the actual HTTP call"). The remote verification path may not be production-ready. -->

## Installation

```sh
npm install @hollis-studio/auth-client
```

Peer dependencies: `@hollis-studio/contracts@^0.2.0-alpha.85`, `zod@4.3.6`

Contracts is a peer, not a dependency, because this package re-exports contracts
values (`AudienceSchema`, `AUDIENCES`, `validateAudience`) and parses tokens with
`AccessTokenClaimsSchema`. A plain dependency lets npm install a second nested
copy of contracts next to the consumer's own pin, so the middleware would be
validating against a different schema instance than the app it protects.

## API

### `createAuthClient(opts: AuthClientOptions): AuthClient`

Factory that returns a configured `AuthClient`.

```ts
interface AuthClientOptions {
  identityServiceUrl: string   // Base URL, no trailing slash. e.g. 'https://identity.hollis.health'
  audience: Audience           // Expected aud claim value. Tokens without this audience are rejected.
  jwksSecret?: string          // PEM-encoded public key or symmetric secret for local verification.
                               // When omitted, verification delegates to the Identity Service.
  verifyTimeoutMs?: number     // Timeout for remote /verify calls. Default: 5000 ms.
}

interface AuthClient {
  requireAuth<TReq extends AuthenticatedRequest = AuthenticatedRequest>(): AuthClientMiddleware<TReq>
  verifyToken(token: string): Promise<AccessTokenClaims>
}
```

### `AuthClientMiddleware<TReq>`

```ts
type AuthClientMiddleware<TReq extends AuthenticatedRequest = AuthenticatedRequest> =
  (req: TReq, res: AuthResponse, next: AuthNextFunction) => void | Promise<void>
```

Express's `Request` / `Response` / `NextFunction` are structurally compatible with `AuthenticatedRequest` / `AuthResponse` / `AuthNextFunction` — no cast needed.

### Request shape

The middleware writes two properties onto the request object. Declare them via module augmentation in your app:

```ts
// express.d.ts in the consumer app
import type { AccessTokenClaims } from '@hollis-studio/auth-client';
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    tokenClaims?: AccessTokenClaims;
  }
}
```

### `verifyToken(token: string): Promise<AccessTokenClaims>`

Low-level verification outside middleware context (WebSocket upgrades, background jobs, etc.). Throws an `AppError`-shaped object on failure.

## Re-exports

`auth-client` re-exports the following from `@hollis-studio/contracts` so consumers only need one import:

```ts
export type { AccessTokenClaims, Audience }
export { validateAudience, AudienceSchema, AUDIENCES }
```

## Exported types

```ts
interface AuthenticatedRequest     // Minimal request shape (headers + optional userId/tokenClaims)
interface AuthResponse             // Minimal response shape (status + json)
type AuthNextFunction              // (err?: unknown) => void
interface AuthClientOptions        // Factory options (see above)
interface AuthClient               // { requireAuth, verifyToken }
type AuthClientMiddleware<TReq>    // Middleware function type
```

## Usage example

```ts
import { createAuthClient } from '@hollis-studio/auth-client';

const auth = createAuthClient({
  identityServiceUrl: process.env.IDENTITY_SERVICE_URL!,
  audience: 'hollis-health',
  // Optional: omit to delegate to identity service
  // jwksSecret: process.env.JWT_SECRET,
});

// Protect a route
router.get('/protected', auth.requireAuth(), (req, res) => {
  res.json({ userId: req.userId });
});

// Low-level verification (e.g. WebSocket)
const claims = await auth.verifyToken(rawToken);
```

## Dependencies

| Package | Role |
|---|---|
| `@hollis-studio/contracts` (peer) | `AccessTokenClaimsSchema`, `APP_ERROR_CODES`, `AppError`, `Audience` types |
| `jsonwebtoken` | Local JWT signature verification (fast path) |
| `zod` (peer) | Used by contracts for schema parsing |

## Error codes

Failures propagate `AppError` objects with the following codes from `APP_ERROR_CODES`:

- `AUTH_REQUIRED` — missing/malformed header, failed signature, schema mismatch, remote rejection
- `FORBIDDEN` — token valid but does not include the required audience
- `INTERNAL_ERROR` — Identity Service unreachable (network error on remote path)

## Changelog

### 0.1.0-alpha.4 — unpublished

Two fixes that have been sitting in source, unpublished, since 2026-05-26. The
published 0.1.0-alpha.3 tarball does **not** contain either; consumers pinned to
alpha.3 (`hollis-health-app/server`, `hollis-workouts/server`) still run the
alpha.3 behaviour until this version is published and those pins are bumped.

- **Algorithm pin now ships.** `verifyTokenLocally` calls
  `jwt.verify(token, secret, { algorithms: ["HS256"] })`. Commit `8dcd63a`
  ("Verify-alg pin confirmed. Source only — no npm republish.") landed the pin
  in source without a version bump, so the published dist still calls
  `jwt.verify(token, secret)` with no algorithm restriction — it accepts any
  algorithm `jsonwebtoken` supports for the supplied key material instead of
  only the HS256 the README and Workouts production model document.
- **Contracts is a peer dependency with an explicit range.** It was
  `"@hollis-studio/contracts": "*"`, which resolves off the registry's `latest`
  dist-tag — stuck at `0.2.0-alpha.54`, with the superseded studio address and
  older legal-document text. It is now
  `peerDependencies: { "@hollis-studio/contracts": "^0.2.0-alpha.85" }` plus a
  devDependency of the same range for local build/typecheck. The floor is the
  oldest contracts version any current consumer installs; the `<0.3.0` ceiling
  is the caret's, since the audience/claims contract is `0.2.x`.

No API surface change.
