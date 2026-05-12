import {
  APP_ERROR_CODE_ALIASES,
  APP_ERROR_CODES,
  err,
  isErr,
  isOk,
  ok,
  type AppErrorCode,
  type Result,
} from "../errors";

const WORKOUTS_ERROR_CODES = [
  "AUTH_REQUIRED",
  "NETWORK_OFFLINE",
  "HEALTH_PERMISSION",
  "HEALTH_UNAVAILABLE",
  "VALIDATION_FAILED",
  "VALIDATION_WARNING",
  "AI_UNAVAILABLE",
  "AI_INVALID_RESPONSE",
  "EXERCISE_NOT_FOUND",
  "GYM_NOT_FOUND",
  "PROGRAM_NOT_FOUND",
  "SESSION_NOT_FOUND",
  "BASELINE_NOT_FOUND",
  "INJURY_NOT_FOUND",
  "SESSION_CONFLICT",
  "SESSION_ABANDONED",
  "CONFIG_MISSING",
  "SYNC_FAILED",
  "SHARE_FAILED",
  "NOT_IMPLEMENTED",
  "UNKNOWN",
] as const satisfies readonly AppErrorCode[];

const HEALTH_CANONICAL_ERROR_CODES = [
  "FORBIDDEN",
  "NOT_FOUND",
  "RATE_LIMITED",
  "INTERNAL_ERROR",
] as const satisfies readonly AppErrorCode[];

describe("Result", () => {
  it("constructs and narrows ok results", () => {
    const result: Result<{ id: string }> = ok({ id: "abc" });

    expect(result).toEqual({ ok: true, data: { id: "abc" } });
    expect(isOk(result)).toBe(true);
    expect(isErr(result)).toBe(false);

    if (isOk(result)) {
      expect(result.data.id).toBe("abc");
    }
  });

  it("constructs and narrows error results", () => {
    const details = { field: "name" };
    const result: Result<never> = err("VALIDATION_FAILED", "Invalid name", details);

    expect(result).toEqual({
      ok: false,
      error: { code: "VALIDATION_FAILED", message: "Invalid name", details },
    });
    expect(isOk(result)).toBe(false);
    expect(isErr(result)).toBe(true);

    if (isErr(result)) {
      expect(result.error.code).toBe("VALIDATION_FAILED");
    }
  });
});

describe("AppErrorCode", () => {
  it("includes Workouts and Health canonical codes", () => {
    for (const code of WORKOUTS_ERROR_CODES) {
      expect(APP_ERROR_CODES[code]).toBe(code);
    }

    for (const code of HEALTH_CANONICAL_ERROR_CODES) {
      expect(APP_ERROR_CODES[code]).toBe(code);
    }
  });

  it("exports Health spelling aliases for semantic overlaps", () => {
    expect(APP_ERROR_CODE_ALIASES.UNAUTHORIZED).toBe(APP_ERROR_CODES.AUTH_REQUIRED);
    expect(APP_ERROR_CODE_ALIASES.VALIDATION_ERROR).toBe(APP_ERROR_CODES.VALIDATION_FAILED);
    expect(APP_ERROR_CODE_ALIASES.CONFLICT).toBe(APP_ERROR_CODES.SESSION_CONFLICT);
  });
});
