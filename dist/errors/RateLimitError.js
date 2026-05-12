/**
 * @ai-context Rate limit error class | Shared client-side error for 429 responses
 *
 * Thrown when the server returns a 429 Too Many Requests response.
 * Contains `retryAfterSeconds` so UIs can show a countdown timer.
 *
 * deps: none | consumers: src/services/auth.http, web-admin/services/webAuthService
 */
export class RateLimitError extends Error {
    retryAfterSeconds;
    constructor(message, retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
        this.name = "RateLimitError";
    }
}
//# sourceMappingURL=RateLimitError.js.map