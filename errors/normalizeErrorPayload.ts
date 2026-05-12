/**
 * @ai-context Shared error payload normalizer | used by all API clients
 *
 * Extracts a human-readable message, optional error code, and optional details
 * from an unknown HTTP error response body. Handles all server envelope shapes:
 *
 *   { error: "string" }
 *   { error: { message, code, details } }
 *   { message: "string", code: "string" }
 *   "plain string body"
 *
 * Previously duplicated across:
 *   - src/services/apiClient.ts (private method)
 *   - web-admin/services/webApiClient.ts (exported free function `normalizeApiErrorPayload`)
 *   - web-public/services/webApiClient.ts (private method, simplified)
 *
 * deps: ../primitives/typeGuards | consumers: src/services/apiClient, web-admin/services/webApiClient, web-public/services/webApiClient
 */

import { isRecord } from "../primitives/typeGuards.js";

export interface NormalizedErrorPayload {
  message: string;
  code?: string;
  details?: unknown;
  response: unknown;
}

interface StructuredApiError {
  code?: string;
  message?: string;
  details?: unknown;
  [key: string]: unknown;
}

function getNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function hasOwnProperty(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

/**
 * Normalize an unknown HTTP error response body into a structured payload.
 *
 * @param payload - Raw error body (string, object, or unknown)
 * @param fallbackMessage - Message to use when none can be extracted
 * @returns Normalized payload with message, optional code/details, and original response
 */
export function normalizeErrorPayload(
  payload: unknown,
  fallbackMessage: string,
): NormalizedErrorPayload {
  if (typeof payload === "string" && payload.length > 0) {
    return {
      message: payload,
      response: payload,
    };
  }

  if (!isRecord(payload)) {
    return {
      message: fallbackMessage,
      response: payload,
    };
  }

  const errorValue = payload.error;
  const flatMessage =
    getNonEmptyString(errorValue) ?? getNonEmptyString(payload.message);
  const flatCode = getNonEmptyString(payload.code);
  const flatDetails = hasOwnProperty(payload, "details")
    ? payload.details
    : undefined;

  if (isRecord(errorValue)) {
    const nestedError = errorValue as StructuredApiError;
    const nestedMessage = getNonEmptyString(nestedError.message);
    const nestedCode = getNonEmptyString(nestedError.code);
    const nestedDetails = hasOwnProperty(errorValue, "details")
      ? nestedError.details
      : undefined;

    return {
      message: nestedMessage ?? flatMessage ?? fallbackMessage,
      code: nestedCode ?? flatCode,
      details: flatDetails ?? nestedDetails,
      response: {
        ...payload,
        ...(nestedMessage !== undefined && !hasOwnProperty(payload, "message")
          ? { message: nestedMessage }
          : {}),
        ...(nestedCode !== undefined && !hasOwnProperty(payload, "code")
          ? { code: nestedCode }
          : {}),
        ...(nestedDetails !== undefined && !hasOwnProperty(payload, "details")
          ? { details: nestedDetails }
          : {}),
      },
    };
  }

  return {
    message: flatMessage ?? fallbackMessage,
    code: flatCode,
    details: flatDetails,
    response: payload,
  };
}
