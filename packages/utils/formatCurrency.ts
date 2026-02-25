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

const _cache = new Map<string, Intl.NumberFormat>();

function _getFormatter(locale: string, currency: string): Intl.NumberFormat {
  const key = `${locale}:${currency}`;
  let fmt = _cache.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    _cache.set(key, fmt);
  }
  return fmt;
}

/**
 * Formats an integer cents value as a currency string.
 * @param amountCents - Amount in cents (e.g. 4999 → "$49.99")
 * @param currency    - ISO 4217 currency code (default: "USD")
 * @example formatCents(4999)        // "$49.99"
 * @example formatCents(4999, "EUR") // "€49.99"
 */
export function formatCents(amountCents: number, currency = "USD"): string {
  return _getFormatter("en-US", currency).format(amountCents / 100);
}

/**
 * Formats a dollar (or other major-unit) amount as a currency string.
 * Convenience wrapper around `formatCents` for callers that already have
 * dollar values rather than cents.
 * @param amountDollars - Amount in major currency units (e.g. 49.99 → "$49.99")
 * @param currency      - ISO 4217 currency code (default: "USD")
 * @example formatCurrency(49.99)        // "$49.99"
 * @example formatCurrency(49.99, "EUR") // "€49.99"
 */
export function formatCurrency(
  amountDollars: number,
  currency = "USD",
): string {
  return formatCents(amountDollars * 100, currency);
}
