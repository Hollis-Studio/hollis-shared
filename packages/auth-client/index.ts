/**
 * @ai-context @hollis-studio/auth-client | Thin middleware for consumer apps to verify Identity Service tokens
 *
 * Consumer apps (Health, Workouts) import this package instead of implementing
 * their own token verification. All verification ultimately delegates to the
 * Hollis Identity Service at `identity.hollis.health`.
 *
 * Public surface:
 * - createAuthClient    — factory returning a configured middleware + verifyToken
 * - requireAuth         — Express middleware that enforces a valid access token
 * - verifyToken         — low-level verification call to Identity Service /verify
 * - AuthClientMiddleware — Express middleware type
 *
 * Re-exports (so consumers import only from '@hollis-studio/auth-client'):
 * - AccessTokenClaims, Audience, validateAudience
 *
 * deps: @hollis-studio/contracts, jsonwebtoken | consumers: hollis-health-app server, Hollis-Workouts server
 */

import type { IncomingHttpHeaders } from "node:http";
import jwt from "jsonwebtoken";
import {
  AccessTokenClaimsSchema,
  APP_ERROR_CODES,
  type AppError,
  type Audience,
} from "@hollis-studio/contracts";

// Re-export contract types so consumers only need one import
export type { AccessTokenClaims, Audience } from "@hollis-studio/contracts";
export { validateAudience, AudienceSchema, AUDIENCES } from "@hollis-studio/contracts";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Minimal request shape consumed by the auth-client middleware.
 *
 * `headers` uses Node's `IncomingHttpHeaders` — the same type Express's
 * `Request.headers` resolves to — so an Express `Request` is structurally
 * assignable to `AuthenticatedRequest` with no cast. The middleware reads
 * `req.headers.authorization` and writes `req.userId` / `req.tokenClaims`,
 * which consumers add to Express via module augmentation.
 *
 * @example
 * // express.d.ts in the consumer app
 * import type { AccessTokenClaims } from '@hollis-studio/auth-client';
 * declare module 'express-serve-static-core' {
 *   interface Request {
 *     userId?: string;
 *     tokenClaims?: AccessTokenClaims;
 *   }
 * }
 */
export interface AuthenticatedRequest {
  headers: IncomingHttpHeaders;
  userId?: string;
  tokenClaims?: import("@hollis-studio/contracts").AccessTokenClaims;
}

/** Minimal response shape — Express `Response` is structurally compatible. */
export interface AuthResponse {
  status(code: number): this;
  json(body: unknown): unknown;
}

/** Next callback — Express's `NextFunction` is structurally compatible. */
export type AuthNextFunction = (err?: unknown) => void;

/**
 * Middleware produced by createAuthClient.
 *
 * Generic over the request type so consumers can pass a tighter type (e.g.
 * Express's `Request`) without casting. Defaults to `AuthenticatedRequest`.
 */
export type AuthClientMiddleware<TReq extends AuthenticatedRequest = AuthenticatedRequest> = (
  req: TReq,
  res: AuthResponse,
  next: AuthNextFunction,
) => void | Promise<void>;

// ============================================================================
// OPTIONS
// ============================================================================

export interface AuthClientOptions {
  /**
   * Base URL of the Hollis Identity Service (no trailing slash).
   * Example: 'https://identity.hollis.health'
   */
  identityServiceUrl: string;

  /**
   * The audience string this app expects in every token's `aud` claim.
   * Tokens not listing this audience will be rejected.
   */
  audience: Audience;

  /**
   * Shared HMAC-SHA256 secret (or PEM RSA public key) for local JWT verification.
   * When provided, tokens are verified locally without a network call to the
   * Identity Service — this is the SUPPORTED production verification model for
   * Hollis Workouts (HS256 shared-secret mode).
   *
   * For HS256 (current Workouts production mode): set this to the value of
   * `IDENTITY_JWT_SECRET`, which must be provisioned bit-for-bit identical to
   * the Identity Service's `JWT_SECRET`. The auth-client pins to `algorithms: ["HS256"]`
   * and verifies expiry, audience, and required claims locally.
   *
   * When omitted, verification delegates to the Identity Service /verify endpoint
   * (remote slow path — one HTTP call per request).
   *
   * TODO(W6h): JWKS-fetching path (RS256 asymmetric) is DEFERRED future scope.
   * Implement by fetching public keys lazily from
   * `identityServiceUrl + '/.well-known/jwks.json'` with a configurable cache TTL.
   * This is NOT built yet — do not implement until Identity is deployed with RS256
   * and key rotation is stable.
   */
  jwksSecret?: string;

  /**
   * Timeout in milliseconds for calls to the Identity Service /verify endpoint.
   * Default: 5000 (5 seconds)
   */
  verifyTimeoutMs?: number;
}

// ============================================================================
// AUTH CLIENT FACTORY
// ============================================================================

export interface AuthClient {
  /**
   * Express middleware. Extracts the Bearer token, verifies it, and attaches
   * `req.userId` and `req.tokenClaims` for downstream handlers.
   * Calls next(error) with an AppError on failure.
   *
   * Generic over the request type so callers can pass Express's `Request`
   * directly (assuming module augmentation for `userId` / `tokenClaims`).
   */
  requireAuth: <TReq extends AuthenticatedRequest = AuthenticatedRequest>() => AuthClientMiddleware<TReq>;

  /**
   * Low-level token verification. Returns parsed AccessTokenClaims on success
   * or throws an AppError-shaped object on failure.
   *
   * Use this when you need the claims outside of an Express middleware context
   * (e.g. WebSocket upgrade handlers, background jobs).
   */
  verifyToken: (token: string) => Promise<import("@hollis-studio/contracts").AccessTokenClaims>;
}

/**
 * Creates a configured auth client for a consumer app server.
 *
 * @example
 * import { createAuthClient } from '@hollis-studio/auth-client';
 *
 * const auth = createAuthClient({
 *   identityServiceUrl: process.env.IDENTITY_SERVICE_URL,
 *   audience: 'hollis-health',
 * });
 *
 * router.get('/protected', auth.requireAuth(), (req, res) => {
 *   res.json({ userId: req.userId });
 * });
 */
export function createAuthClient(opts: AuthClientOptions): AuthClient {
  const { identityServiceUrl, audience, jwksSecret, verifyTimeoutMs = 5000 } = opts;

  async function verifyToken(
    token: string,
  ): Promise<import("@hollis-studio/contracts").AccessTokenClaims> {
    // Fast path: local JWT verification when a secret/key is provided.
    // This avoids a network call to the Identity Service on every request.
    if (jwksSecret) {
      return verifyTokenLocally(token, jwksSecret, audience);
    }

    // Slow path: delegate to Identity Service /verify endpoint.
    // TODO(W6h): Replace this with JWKS-fetching local verification (RS256/asymmetric)
    // once the Identity Service is deployed with RS256, /.well-known/jwks.json is
    // stable, and key rotation is implemented. This is DEFERRED future scope — do
    // not implement until then. For HS256 (current Workouts production model),
    // provide jwksSecret above to use the local fast path instead.
    return verifyTokenRemote(token, identityServiceUrl, audience, verifyTimeoutMs);
  }

  function requireAuth<TReq extends AuthenticatedRequest = AuthenticatedRequest>(): AuthClientMiddleware<TReq> {
    return async (req, _res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error: AppError = {
          code: APP_ERROR_CODES.AUTH_REQUIRED,
          message: "Authorization header missing or malformed",
        };
        next(error);
        return;
      }

      const token = authHeader.slice(7);
      try {
        const claims = await verifyToken(token);
        req.userId = claims.userId;
        req.tokenClaims = claims;
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  return { requireAuth, verifyToken };
}

// ============================================================================
// LOCAL VERIFICATION (fast path)
// ============================================================================

/**
 * Verifies a JWT locally using a shared HS256 secret.
 * This is the SUPPORTED production verification path for Hollis Workouts.
 *
 * Validates:
 * - Signature: HS256 pinned — rejects RS256 and all other algorithms.
 * - Expiry: jsonwebtoken enforces `exp` by default.
 * - Audience: checked by parseClaims against the required audience string.
 * - Claims shape: parseClaims runs AccessTokenClaimsSchema (requires `userId`,
 *   `type`, `jti`, `aud`). The Workouts middleware additionally checks
 *   `type === "access"` to reject refresh and mfa_pending tokens.
 *
 * Used when `jwksSecret` is provided to createAuthClient.
 */
function verifyTokenLocally(
  token: string,
  secret: string,
  audience: Audience,
): import("@hollis-studio/contracts").AccessTokenClaims {
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
  } catch (e) {
    const error: AppError = {
      code: APP_ERROR_CODES.AUTH_REQUIRED,
      message: `Token verification failed: ${e instanceof Error ? e.message : String(e)}`,
    };
    throw error;
  }

  return parseClaims(decoded, audience);
}

// ============================================================================
// REMOTE VERIFICATION (slow path — delegates to Identity Service)
// ============================================================================

/**
 * Calls the Identity Service /verify endpoint to validate a token.
 * Returns AccessTokenClaims on success; throws AppError on failure.
 *
 * TODO(W6): Once the Identity Service is live, wire up the actual HTTP call here.
 * The stub below documents the expected request/response contract.
 *
 * Expected request:  POST `{identityServiceUrl}/verify`
 *                    Body: { token: string }
 *                    Header: Content-Type: application/json
 *
 * Expected response: { ok: true, claims: AccessTokenClaims }
 *                 or HTTP 401 { ok: false, code: string, message: string }
 */
async function verifyTokenRemote(
  token: string,
  identityServiceUrl: string,
  audience: Audience,
  timeoutMs: number,
): Promise<import("@hollis-studio/contracts").AccessTokenClaims> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${identityServiceUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, audience }),
      signal: controller.signal,
    });
  } catch (e) {
    const error: AppError = {
      code: APP_ERROR_CODES.INTERNAL_ERROR,
      message: `Identity Service unreachable: ${e instanceof Error ? e.message : String(e)}`,
    };
    throw error;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const error: AppError = {
      code: APP_ERROR_CODES.AUTH_REQUIRED,
      message: `Identity Service rejected token (HTTP ${response.status})`,
    };
    throw error;
  }

  const body = (await response.json()) as { claims?: unknown };
  return parseClaims(body.claims, audience);
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Parses and validates raw JWT payload against AccessTokenClaimsSchema.
 * Throws AppError if validation fails or audience check does not pass.
 */
function parseClaims(
  raw: unknown,
  requiredAudience: Audience,
): import("@hollis-studio/contracts").AccessTokenClaims {
  const result = AccessTokenClaimsSchema.safeParse(raw);
  if (!result.success) {
    const error: AppError = {
      code: APP_ERROR_CODES.AUTH_REQUIRED,
      message: "Token payload does not match expected claims schema",
      details: result.error.issues,
    };
    throw error;
  }

  const claims = result.data;

  if (!claims.aud.includes(requiredAudience)) {
    const error: AppError = {
      code: APP_ERROR_CODES.FORBIDDEN,
      message: `Token not valid for audience '${requiredAudience}'`,
    };
    throw error;
  }

  return claims;
}
