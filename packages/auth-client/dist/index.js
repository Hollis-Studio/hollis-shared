/**
 * @ai-context @hollis/auth-client | Thin middleware for consumer apps to verify Identity Service tokens
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
 * Re-exports (so consumers import only from '@hollis/auth-client'):
 * - AccessTokenClaims, Audience, validateAudience
 *
 * deps: @hollis/contracts, jsonwebtoken | consumers: hollis-health-app server, Hollis-Workouts server
 */
import jwt from "jsonwebtoken";
import { AccessTokenClaimsSchema, APP_ERROR_CODES, } from "@hollis/contracts";
export { validateAudience, AudienceSchema, AUDIENCES } from "@hollis/contracts";
/**
 * Creates a configured auth client for a consumer app server.
 *
 * @example
 * import { createAuthClient } from '@hollis/auth-client';
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
export function createAuthClient(opts) {
    const { identityServiceUrl, audience, jwksSecret, verifyTimeoutMs = 5000 } = opts;
    async function verifyToken(token) {
        // Fast path: local JWT verification when a secret/key is provided.
        // This avoids a network call to the Identity Service on every request.
        if (jwksSecret) {
            return verifyTokenLocally(token, jwksSecret, audience);
        }
        // Slow path: delegate to Identity Service /verify endpoint.
        // TODO(W6h): Replace this with JWKS-fetching local verification once the
        // Identity Service exposes /.well-known/jwks.json and key rotation is stable.
        return verifyTokenRemote(token, identityServiceUrl, audience, verifyTimeoutMs);
    }
    function requireAuth() {
        return async (req, _res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                const error = {
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
            }
            catch (err) {
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
 * Verifies a JWT locally using a known secret or public key.
 * Used when `jwksSecret` is provided to createAuthClient.
 */
function verifyTokenLocally(token, secret, audience) {
    let decoded;
    try {
        decoded = jwt.verify(token, secret);
    }
    catch (e) {
        const error = {
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
async function verifyTokenRemote(token, identityServiceUrl, audience, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
        response = await fetch(`${identityServiceUrl}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, audience }),
            signal: controller.signal,
        });
    }
    catch (e) {
        const error = {
            code: APP_ERROR_CODES.INTERNAL_ERROR,
            message: `Identity Service unreachable: ${e instanceof Error ? e.message : String(e)}`,
        };
        throw error;
    }
    finally {
        clearTimeout(timer);
    }
    if (!response.ok) {
        const error = {
            code: APP_ERROR_CODES.AUTH_REQUIRED,
            message: `Identity Service rejected token (HTTP ${response.status})`,
        };
        throw error;
    }
    const body = (await response.json());
    return parseClaims(body.claims, audience);
}
// ============================================================================
// INTERNAL HELPERS
// ============================================================================
/**
 * Parses and validates raw JWT payload against AccessTokenClaimsSchema.
 * Throws AppError if validation fails or audience check does not pass.
 */
function parseClaims(raw, requiredAudience) {
    const result = AccessTokenClaimsSchema.safeParse(raw);
    if (!result.success) {
        const error = {
            code: APP_ERROR_CODES.AUTH_REQUIRED,
            message: "Token payload does not match expected claims schema",
            details: result.error.issues,
        };
        throw error;
    }
    const claims = result.data;
    if (!claims.aud.includes(requiredAudience)) {
        const error = {
            code: APP_ERROR_CODES.FORBIDDEN,
            message: `Token not valid for audience '${requiredAudience}'`,
        };
        throw error;
    }
    return claims;
}
//# sourceMappingURL=index.js.map