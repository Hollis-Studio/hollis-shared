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
import { type Audience } from "@hollis-studio/contracts";
export type { AccessTokenClaims, Audience } from "@hollis-studio/contracts";
export { validateAudience, AudienceSchema, AUDIENCES } from "@hollis-studio/contracts";
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
export type AuthClientMiddleware<TReq extends AuthenticatedRequest = AuthenticatedRequest> = (req: TReq, res: AuthResponse, next: AuthNextFunction) => void | Promise<void>;
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
     * Optional: provide a PEM-encoded RSA public key (or symmetric secret) to
     * verify JWT signatures locally without a network call.
     * When omitted, verification delegates to the Identity Service /verify endpoint.
     *
     * TODO(W6h): Implement JWKS-fetching path — fetch public keys lazily from
     * `identityServiceUrl + '/.well-known/jwks.json'` and cache them with
     * a configurable TTL. This eliminates the per-request network hop for local
     * signature verification while remaining key-rotation aware.
     */
    jwksSecret?: string;
    /**
     * Timeout in milliseconds for calls to the Identity Service /verify endpoint.
     * Default: 5000 (5 seconds)
     */
    verifyTimeoutMs?: number;
}
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
export declare function createAuthClient(opts: AuthClientOptions): AuthClient;
//# sourceMappingURL=index.d.ts.map