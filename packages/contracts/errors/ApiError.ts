/**
 * @ai-context Shared ApiError class | Single definition for mobile, web-admin, and web-public
 *
 * Previously duplicated in src/services/apiClient.ts and web-admin/services/webApiClient.ts.
 * Moved here so all surfaces share one canonical class that supports `instanceof ApiError`.
 *
 * The constructor sanitizes the message via `sanitizeErrorMessage` to prevent PHI
 * from leaking into error displays or structured logs.
 *
 * deps: errorSanitization | consumers: src/services/apiClient, web-admin/services/webApiClient, web-public/services/webApiClient
 */

import { sanitizeErrorMessage } from "../errorSanitization";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    // Sanitize message to prevent PHI exposure in logs/UI
    super(sanitizeErrorMessage(message));
    this.name = "ApiError";
  }

  /**
   * Convert to JSON for serialization, excluding raw response data
   * that may contain PHI
   */
  toJSON(): { name: string; message: string; statusCode?: number } {
    return {
      name: this.name,
      message: this.message,
      ...(this.statusCode !== undefined && { statusCode: this.statusCode }),
    };
  }
}
