export function ok(data) {
    return { ok: true, data };
}
export function err(code, message, details) {
    return { ok: false, error: { code, message, details } };
}
export function isOk(result) {
    return result.ok;
}
export function isErr(result) {
    return !result.ok;
}
//# sourceMappingURL=result.js.map