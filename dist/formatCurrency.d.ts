/**
 * @ai-context Canonical currency formatter for all surfaces (mobile, web-admin, web-public)
 *
 * All monetary values in the DB are stored as cents (integers).
 * Use `formatCents` when you have a cents value (the standard case).
 * Use `formatCurrency` when you already have a dollar amount.
 *
 * Intl.NumberFormat instances are cached in a Map keyed by "locale:currency"
 * so the relatively expensive constructor call only runs once per currency.
 */
/**
 * Formats an integer cents value as a currency string.
 * @param amountCents - Amount in cents (e.g. 4999 → "$49.99")
 * @param currency    - ISO 4217 currency code (default: "USD")
 * @example formatCents(4999)        // "$49.99"
 * @example formatCents(4999, "EUR") // "€49.99"
 */
export declare function formatCents(amountCents: number, currency?: string): string;
/**
 * Formats a dollar (or other major-unit) amount as a currency string.
 * Convenience wrapper around `formatCents` for callers that already have
 * dollar values rather than cents.
 * @param amountDollars - Amount in major currency units (e.g. 49.99 → "$49.99")
 * @param currency      - ISO 4217 currency code (default: "USD")
 * @example formatCurrency(49.99)        // "$49.99"
 * @example formatCurrency(49.99, "EUR") // "€49.99"
 */
export declare function formatCurrency(amountDollars: number, currency?: string): string;
//# sourceMappingURL=formatCurrency.d.ts.map