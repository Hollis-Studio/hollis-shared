import type { AppErrorCode } from "./app-error-code.js";

export interface AppError {
  code: AppErrorCode;
  message: string;
  details?: unknown;
}

export type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E };

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err<T>(code: AppErrorCode, message: string, details?: unknown): Result<T> {
  return { ok: false, error: { code, message, details } };
}

export function isOk<T, E = AppError>(result: Result<T, E>): result is { ok: true; data: T } {
  return result.ok;
}

export function isErr<T, E = AppError>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}
