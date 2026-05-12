import type { AppErrorCode } from "./app-error-code.js";
export interface AppError {
    code: AppErrorCode;
    message: string;
    details?: unknown;
}
export type Result<T, E = AppError> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: E;
};
export declare function ok<T>(data: T): Result<T>;
export declare function err<T>(code: AppErrorCode, message: string, details?: unknown): Result<T>;
export declare function isOk<T, E = AppError>(result: Result<T, E>): result is {
    ok: true;
    data: T;
};
export declare function isErr<T, E = AppError>(result: Result<T, E>): result is {
    ok: false;
    error: E;
};
//# sourceMappingURL=result.d.ts.map