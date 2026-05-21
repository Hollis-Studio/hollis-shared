# @hollis-studio/utils

Shared pure-function utilities consumed across mobile, web-admin, and server surfaces.

Published to the GitHub Package Registry (`npm.pkg.github.com`).

## Entry points

Each module is available as both a named deep import and via the root barrel:

| Import path | Module |
|---|---|
| `@hollis-studio/utils` | Root barrel — re-exports `dateKey`, `formatCurrency`, `unitConversions` |
| `@hollis-studio/utils/dateKey` | Date key utilities |
| `@hollis-studio/utils/formatCurrency` | Currency formatting |
| `@hollis-studio/utils/unitConversions` | Weight and height conversions |
| `@hollis-studio/utils/csrf` | CSRF cookie parsing (not in root barrel) |

> `csrf` is intentionally excluded from the root barrel because it is browser/DOM-specific (reads `document.cookie`). Import it directly.

## API

### `dateKey` — YYYY-MM-DD utilities

All date-keyed records in the database (nutrition logs, daily metrics, etc.) use the `yyyy-MM-dd` format. These utilities are the single source of truth for that format.

```ts
DATE_KEY_FORMAT: "yyyy-MM-dd"

formatDateKey(date: Date): string
// Format a Date object to 'yyyy-MM-dd'.
// Uses local time (getFullYear / getMonth / getDate), not UTC.

getTodayDateKey(): string
// Convenience wrapper: formatDateKey(new Date())

parseDateKey(dateKey: string): Date
// Parse a 'yyyy-MM-dd' string to a Date at midnight local time.
// Throws Error if the format is wrong or the date is invalid (e.g. Feb 30).
```

### `formatCurrency` — monetary display

DB values are stored as integer cents. Use `formatCents` for the standard case.

```ts
formatCents(amountCents: number, currency?: string): string
// amountCents=4999, currency='USD' → '$49.99'
// currency defaults to 'USD'

formatCurrency(amountDollars: number, currency?: string): string
// amountDollars=49.99 → '$49.99'
// Convenience wrapper that multiplies by 100 before calling formatCents.
```

`Intl.NumberFormat` instances are cached per `locale:currency` key.

### `unitConversions` — weight and height arithmetic

Pure conversion functions. No React, no store dependencies. Persisted values are always metric (kg, cm); convert at the display boundary only.

```ts
kgToLbs(kg: number): number
lbsToKg(lbs: number): number

cmToFeetInches(cm: number): { feet: number; inches: number }
// Handles the rounding edge case where inches would equal 12 — carries into feet.
// e.g. cmToFeetInches(182.88) → { feet: 6, inches: 0 }, not { feet: 5, inches: 12 }

feetInchesToCm(feet: number, inches: number): number
```

Conversion factors are sourced from `UNIT_CONVERSION` in `@hollis-studio/contracts`.

### `csrf` — CSRF cookie parsing

Client-side half of the double-submit cookie pattern. Reads a non-httpOnly cookie and returns its value to be sent in `X-CSRF-Token` on mutation requests.

```ts
parseCsrfCookie(cookieString: string, cookieName: string): string | null
// cookieString: raw document.cookie value
// cookieName:   use the CSRF_TOKEN_COOKIE constant from @hollis-studio/contracts — never a magic string
// Returns: decoded token string, or null if not found
```

## Peer dependencies / runtime requirements

- `@hollis-studio/contracts` — declared as a direct dependency (`unitConversions` imports `UNIT_CONVERSION` from it).
- No other runtime dependencies. `Intl.NumberFormat` is assumed available in all target environments (Node ≥ 18, modern browsers).

## Notes

- All functions are stateless pure functions except `formatCents` / `formatCurrency`, which share a module-level `Intl.NumberFormat` cache (safe — no side effects visible to callers).
- `parseDateKey` constructs dates using `new Date(year, month - 1, day)` (local time) to avoid the UTC midnight shift that `new Date(isoString)` causes in non-UTC timezones.
