# Shared Contracts Module

> **Single source of truth** for all contracts across the Hollis Health monorepo.

## Overview

This module contains the canonical definitions for:
- **API Routes** - HTTP endpoint paths and route helpers
- **Domain Contracts** - Types, schemas, and constants for business domains
- **Zod Schemas** - Shared validation schemas for request/response payloads
- **Constants** - Storage keys, configuration values, and magic numbers

## Why Shared Contracts?

1. **Type Safety** - Ensures frontend and backend use identical types
2. **Validation Consistency** - Same Zod schemas validate data across all surfaces
3. **No Drift** - Single definition prevents divergence between codebases
4. **Better DX** - IDE autocomplete and type checking work across boundaries

## How to Import

### From the Mobile App (`/src/*`)
```typescript
// Preferred: Use the local contracts barrel (which re-exports shared)
import { USER_ROLE, UserRoleSchema, type UserRole } from '@contracts';

// Direct import (for shared-only items)
import { API_ROUTES, HTTP_METHODS } from '@hollis/contracts';
```

### From the Server (`/server/src/*`)
```typescript
// Use the alias
import { USER_ROLE, API_ROUTES, isoDateSchema } from '@hollis/contracts';

// Or via local contracts barrel
import { USER_ROLES } from '@contracts';
```

### From Web Admin (`/web-admin/*`)
```typescript
// Use the alias
import { APPOINTMENT_STATUSES, AppointmentStatusSchema } from '@hollis/contracts';

// Or via local contracts
import { USER_TIERS } from '@contracts';
```

## Module Structure

```
shared/contracts/
├── index.ts           # Main barrel file
├── api/
│   ├── index.ts       # API module barrel
│   └── routes.ts      # HTTP route definitions
├── domain/
│   ├── index.ts       # Domain barrel
│   ├── user.ts        # User roles, tiers
│   ├── appointments.ts # Appointment types, statuses
│   ├── nutrition.ts   # Meal types, food units
│   ├── training.ts    # Strategy types, goals
│   ├── clinical.ts    # Limitations, biometric sources
│   └── sessions.ts    # Session types, reset frequencies
├── schemas/
│   └── index.ts       # Zod validation schemas
├── constants/
│   └── index.ts       # Storage keys, config values
└── __tests__/
    └── compile.test.ts # Contract validation tests
```

## What's Included

### API Routes (`shared/contracts/api`)
- `API_ROUTES` - Base API route paths
- `AUTH_ROUTES` - Authentication endpoints
- `USER_ROUTES(userId)` - User-specific route builders
- `ADMIN_ROUTES` - Admin-only endpoints
- `HTTP_METHODS` - HTTP method constants

### Domain Contracts (`shared/contracts/domain`)
- **User**: `USER_ROLES`, `USER_TIERS`, `UserRoleSchema`, `UserTierSchema`
- **Appointments**: `APPOINTMENT_STATUSES`, `APPOINTMENT_TYPES`, `BOOKING_STEPS`
- **Nutrition**: `MEAL_TYPES`, `FOOD_UNITS`, `LOCATION_TYPES`, `PREPARATION_METHODS`
- **Training**: `STRATEGY_TYPES`, `GOAL_CATEGORIES`, `PROGRESS_TYPES`
- **Clinical**: `LIMITATION_SEVERITIES`, `BIOMETRIC_SOURCES`
- **Sessions**: `SESSION_TYPES`, `RESET_FREQUENCIES`

### Zod Schemas (`shared/contracts/schemas`)
- `isoDateSchema` - ISO date validation (YYYY-MM-DD)
- `isoTimestampSchema` - ISO timestamp validation
- `emailSchema` - Email validation
- `passwordSchema` - Password requirements validation
- `barcodeSchema` - HH-XXXXXX barcode format
- `paginationQuerySchema` - Pagination parameters
- `dateRangeQuerySchema` - Date range parameters

### Constants (`shared/contracts/constants`)
- `STORAGE_KEYS` - AsyncStorage/localStorage keys
- `UNIT_SYSTEMS` - Metric/Imperial
- `PAGINATION` - Default page sizes
- `TIME_MS` - Time constants in milliseconds

## Rules for Adding New Contracts

### DO:
✅ Add new domain concepts here first, then re-export from local contracts  
✅ Include types, Zod schemas, constants, AND label maps together  
✅ Follow the existing pattern: `THING_TYPES` (tuple), `THING_TYPE` (object), `ThingTypeSchema` (Zod), `THING_TYPE_LABELS` (display)  
✅ Add tests in `__tests__/compile.test.ts`  
✅ Keep this module pure TypeScript + Zod only

### DON'T:
❌ Import React, React Native, or Expo  
❌ Import Node-specific modules (fs, path, crypto)  
❌ Import from `@services/*`, `@features/*`, or any layer modules  
❌ Add platform-specific code  
❌ Create circular dependencies with local contracts

## Pattern Examples

### Adding a New Domain Constant

```typescript
// In shared/contracts/domain/your-domain.ts

import { z } from 'zod';

// 1. Tuple (runtime array for iteration)
export const YOUR_THINGS = ['THING_A', 'THING_B', 'THING_C'] as const;

// 2. Type (derived from tuple)
export type YourThing = (typeof YOUR_THINGS)[number];

// 3. Schema (for validation)
export const YourThingSchema = z.enum(YOUR_THINGS);

// 4. Object constant (for direct access)
export const YOUR_THING = {
  THING_A: 'THING_A',
  THING_B: 'THING_B',
  THING_C: 'THING_C',
} as const satisfies Record<YourThing, YourThing>;

// 5. Labels (for display)
export const YOUR_THING_LABELS: Record<YourThing, string> = {
  THING_A: 'Thing A',
  THING_B: 'Thing B',
  THING_C: 'Thing C',
};

// 6. Type guard (for runtime checks)
export const isYourThing = (value: unknown): value is YourThing =>
  YOUR_THINGS.includes(value as YourThing);
```

### Re-exporting in Local Contracts

```typescript
// In src/contracts/your-domain.ts

// Re-export from shared contracts (source of truth)
export {
  YOUR_THINGS,
  YOUR_THING,
  YOUR_THING_LABELS,
  YourThingSchema,
  isYourThing,
} from '@hollis/contracts';
export type { YourThing } from '@hollis/contracts';

// Platform-specific extensions can be added below
export const YOUR_THING_ICONS: Record<YourThing, string> = {
  THING_A: '🅰️',
  THING_B: '🅱️',
  THING_C: '©️',
};
```

## Testing

```bash
# Run contract tests
npm run test:contracts

# Check for duplicates
npm run check:contract-duplicates
```

## Path Aliases

| Codebase   | Alias              | Points To                      |
|------------|--------------------|---------------------------------|
| Mobile     | `@hollis/contracts`| `shared/contracts/index.ts`    |
| Mobile     | `@contracts`       | `src/contracts/index.ts`       |
| Server     | `@hollis/contracts`| `../shared/contracts/index.ts` |
| Server     | `@contracts`       | `../src/contracts/index.ts`    |
| Web Admin  | `@hollis/contracts`| `../shared/contracts/index.ts` |
| Web Admin  | `@contracts`       | `contracts/index.ts`           |

## CI Integration

The shared contracts module includes CI checks:
- `npm run test:contracts` - Validates schemas and exports
- `npm run check:contract-duplicates` - Ensures no duplicate definitions
- TypeScript compilation validates type coherence across all codebases
