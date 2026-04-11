/**
 * @ai-context Shared Sentry PHI sanitization helpers | strips sensitive fields from Sentry events across all surfaces
 *
 * This module must remain platform-agnostic so it can be used by React Native,
 * Next.js, and the backend server without importing Sentry runtime packages.
 */

import { sanitizeErrorMessage } from "./errorSanitization";

const AUTH_HEADER_NAMES = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "x-auth-token",
  "x-csrf-token",
  "proxy-authorization",
]);

const SENSITIVE_FIELD_NAMES = new Set([
  "accessToken",
  "activeCalories",
  "address",
  "allergies",
  "bankAccount",
  "bmi",
  "bloodPressure",
  "bodyFat",
  "calories",
  "cardNumber",
  "clinicalNotes",
  "cookie",
  "cookies",
  "cvv",
  "dateOfBirth",
  "diagnosis",
  "dob",
  "email",
  "emergencyContact",
  "firstName",
  "fullName",
  "glucose",
  "glucoseLevel",
  "healthMetrics",
  "healthRecords",
  "heartRate",
  "height",
  "insuranceId",
  "ip_address",
  "labPanel",
  "labResults",
  "labValues",
  "lastName",
  "medicalHistory",
  "medication",
  "medications",
  "notes",
  "password",
  "patientName",
  "phone",
  "phoneNumber",
  "policyNumber",
  "postalCode",
  "prescription",
  "prescriptions",
  "providerNotes",
  "refreshToken",
  "sessionNotes",
  "ssn",
  "symptoms",
  "token",
  "userId",
  "username",
  "weight",
  "zipCode",
]);

type UnknownRecord = Record<string, unknown>;

const OMIT = Symbol("omit-sentry-field");

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeUrlLikeString(value: string, keyName?: string): string {
  const normalizedKey = keyName?.toLowerCase();
  const looksLikeUrl =
    normalizedKey === "url" ||
    normalizedKey === "referer" ||
    normalizedKey === "referrer" ||
    value.startsWith("http://") ||
    value.startsWith("https://");

  if (!looksLikeUrl) {
    return value;
  }

  return value
    .replace(/\?.*?(?=#|$)/, "?[QUERY_REDACTED]")
    .replace(/#.*$/, "#[FRAGMENT_REDACTED]");
}

function shouldStripKey(keyName: string): boolean {
  const normalizedKey = keyName.toLowerCase();
  return (
    AUTH_HEADER_NAMES.has(normalizedKey) ||
    SENSITIVE_FIELD_NAMES.has(keyName) ||
    SENSITIVE_FIELD_NAMES.has(normalizedKey)
  );
}

function sanitizeUnknown(
  value: unknown,
  keyName?: string,
  seen?: WeakSet<object>,
): unknown {
  if (keyName && shouldStripKey(keyName)) {
    return OMIT;
  }

  if (typeof value === "string") {
    if (keyName?.toLowerCase() === "query_string") {
      return "[QUERY_REDACTED]";
    }
    return sanitizeUrlLikeString(sanitizeErrorMessage(value), keyName);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeUnknown(item, keyName, seen))
      .filter((item) => item !== OMIT);
  }

  if (!isRecord(value)) {
    return value;
  }

  const activeSeen = seen ?? new WeakSet<object>();
  if (activeSeen.has(value)) {
    return "[Circular]";
  }
  activeSeen.add(value);

  const sanitizedEntries = Object.entries(value).flatMap(([entryKey, entryValue]) => {
    const sanitizedValue = sanitizeUnknown(entryValue, entryKey, activeSeen);
    if (sanitizedValue === OMIT) {
      return [];
    }
    return [[entryKey, sanitizedValue] as const];
  });

  return Object.fromEntries(sanitizedEntries);
}

export interface SentryEventLike {
  user?: UnknownRecord;
  request?: UnknownRecord;
  extra?: UnknownRecord;
  contexts?: UnknownRecord;
  tags?: UnknownRecord;
  breadcrumbs?: unknown;
  exception?: UnknownRecord;
  message?: string;
  [key: string]: unknown;
}

export interface SentryLogLike {
  level?: string;
  message?: string;
  timestamp?: number;
  attributes?: UnknownRecord;
  [key: string]: unknown;
}

/**
 * Sanitizes a Sentry log entry for use in `beforeSendLog`.
 * Scrubs PHI from the message string and all attributes.
 */
export function sanitizeSentryLog<T>(log: T): T {
  const sanitized = sanitizeUnknown(log);
  if (!isRecord(sanitized)) {
    return log;
  }
  return sanitized as T;
}

/**
 * Sanitizes a Sentry event in place and returns it for convenience in `beforeSend`.
 */
export function sanitizeSentryEvent<T>(event: T): T {
  const sanitized = sanitizeUnknown(event);
  if (!isRecord(sanitized)) {
    return event;
  }

  return sanitized as T;
}
