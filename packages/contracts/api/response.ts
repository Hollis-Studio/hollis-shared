/**
 * @ai-context API Response Envelope | shared types and utilities for HTTP response unwrapping
 *
 * The server always wraps successful responses in:
 *   { success: true, data: T, message?: string }
 *
 * All API clients (mobile, web-admin, web-public) must use the same unwrapping logic
 * instead of each implementing their own divergent check.
 *
 * deps: none | consumers: src/services/apiClient, web-admin/services/webApiClient, web-public/services/webApiClient
 */

/**
 * The canonical server success envelope emitted by `sendSuccess()`.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Unwraps the server response envelope `{ success: true, data: T, message?: string }`.
 * Returns the inner `data` value when the envelope is detected; otherwise returns the value as-is.
 *
 * Detection criteria: the value is a non-null object with both `success` and `data` properties.
 * This is safe against paginated responses (e.g. `{ data: [...], pagination: {...} }`)
 * because those lack a `success` property.
 *
 * @example
 *   const json = await response.json();
 *   return unwrapEnvelope<User>(json);
 */
export function unwrapEnvelope<T>(response: ApiSuccessResponse<T> | T): T {
  if (
    response != null &&
    typeof response === "object" &&
    "success" in response &&
    "data" in response
  ) {
    return (response as ApiSuccessResponse<T>).data;
  }
  return response as T;
}
