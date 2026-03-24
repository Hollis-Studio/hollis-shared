# Shared Contracts Module

> **Single source of truth** for all contracts across the Hollis Health monorepo.

## Overview

This module contains the canonical definitions for:

- **API Routes** - HTTP endpoint paths and route helpers
- **Domain Contracts** - Types, schemas, and constants for business domains
- **Zod Schemas** - Shared validation schemas for request/response payloads
- **Constants** - Storage keys, configuration values, and magic numbers
- **Commercial Offer Terms** - Membership pricing, term discounts, included services, and standard third-party billing disclosures

## 📖 Schema Index

Looking for a specific schema? See **[SCHEMA_INDEX.md](./SCHEMA_INDEX.md)** for a complete reference of all Zod schemas organized by category:

| Category             | Location                 | When to Use                       |
| -------------------- | ------------------------ | --------------------------------- |
| API Request/Response | `schemas/index.ts`       | Route parameter/body validation   |
| Domain Enums         | `domain/*.ts`            | User roles, statuses, types, etc. |
| JSON Blobs           | `schemas/json-blobs.ts`  | Prisma JSON field validation      |
| Admin Operations     | `admin/admin-schemas.ts` | Admin portal, patient management  |
| AI/Agent             | `ai/ai-validation.ts`    | AI function call validation       |
| Platform-Specific    | `src/contracts/*.ts`     | Mobile/web extensions             |

## Why Shared Contracts?

1. **Type Safety** - Ensures frontend and backend use identical types
2. **Validation Consistency** - Same Zod schemas validate data across all surfaces
3. **No Drift** - Single definition prevents divergence between codebases
4. **Better DX** - IDE autocomplete and type checking work across boundaries
5. **Offer Sync** - Public pricing and legal doc blocks can stay aligned from one commercial source

## How to Import

### From the Mobile App (`/src/*`)

```typescript
// Preferred: Use the local contracts barrel (which re-exports shared)
import { USER_ROLE, UserRoleSchema, type UserRole } from "@contracts";

// Direct import (for shared-only items)
import { API_ROUTES, HTTP_METHODS } from "@hollis/contracts";
```

### From the Server (`/server/src/*`)

```typescript
// Use the alias
import { USER_ROLE, API_ROUTES, isoDateSchema } from "@hollis/contracts";

// Or via local contracts barrel
import { USER_ROLES } from "@contracts";
```

### From Web Admin (`/web-admin/*`)

```typescript
// Use the alias
import {
  APPOINTMENT_STATUSES,
  AppointmentStatusSchema,
} from "@hollis/contracts";

// Or via local contracts
import { USER_TIERS } from "@contracts";
```

### Subpath Exports

For tree-shaking and targeted imports, use subpath exports:

```typescript
// Admin contracts (patient summaries, admin routes, etc.)
import { PatientSummary, ADMIN_API_ROUTES } from "@hollis/contracts/admin";

// AI/Agent contracts
import { AgentMessageSchema, AI_ROUTES } from "@hollis/contracts/ai";

// Public API contracts
import { PublicRoutes } from "@hollis/contracts/public";

// Stripe/Billing contracts
import { StripeWebhookPayload } from "@hollis/contracts/stripe";

// Password validation contracts
import { PasswordStrengthSchema } from "@hollis/contracts/password";
```

## Module Structure

```
shared/contracts/
├── index.ts           # Main barrel file
├── api/
│   ├── index.ts       # API module barrel
│   ├── csrf.ts        # CSRF token contracts
│   ├── endpoints.ts   # Endpoint definitions
│   ├── response.ts    # Response shape contracts
│   ├── routes.ts      # HTTP route definitions
│   └── routes/        # Route sub-module
├── domain/            # 41 domain contract files + 1 barrel index (`index.ts`)
│   ├── index.ts       # Domain barrel
│   ├── user.ts        # User roles, tiers
│   ├── offer-sheet.ts # Master commercial offer sheet wrapper + helpers
│   ├── appointments.ts # Appointment types, statuses
│   ├── nutrition.ts   # Meal types, food units
│   ├── training.ts    # Strategy types, goals
│   ├── clinical.ts    # Limitations, biometric sources
│   ├── sessions.ts    # Session types, reset frequencies
│   ├── billing.ts     # Billing statuses, subscription types
│   ├── biometrics.ts  # Biometric sources, types
│   ├── labs.ts        # Lab observation types
│   ├── messages.ts    # Messaging types
│   ├── journal.ts     # Journal entry types
│   ├── exercise.ts    # Exercise categories, types
│   ├── documents.ts   # Document types
│   ├── analytics.ts   # Analytics types
│   ├── mfa.ts         # MFA credential types
│   ├── health-metrics.ts # Health metric types
│   ├── metric-definition.ts # Unified metric definitions
│   ├── compliance.ts  # Compliance types
│   ├── organization.ts # Organization types
│   └── ...            # + 22 more domain files (daily-metrics, sleep, workouts, etc.)
├── admin/             # Admin-specific contracts
│   ├── index.ts       # Admin module barrel
│   ├── admin-routes.ts # Admin route definitions
│   ├── admin-schemas.ts # Admin Zod validation schemas
│   ├── admin-types.ts # Admin TypeScript types
│   ├── labs.ts        # Lab admin contracts
│   └── notifications.ts # Admin notification contracts
├── ai/                # AI/Agent contracts
│   ├── index.ts       # AI module barrel
│   ├── ai-types.ts    # AI TypeScript types
│   ├── ai-validation.ts # AI function-call Zod schemas
│   └── prompt-templates.ts # Prompt template definitions
├── errors/            # Error class contracts
│   ├── index.ts       # Errors module barrel
│   ├── ApiError.ts    # Base API error class
│   └── RateLimitError.ts # Rate-limit error class
├── public/            # Public API contracts
├── stripe/            # Stripe/Billing contracts
├── password/          # Password validation contracts
├── errorSanitization.ts # PHI-safe error sanitization helpers
├── schemas/
│   └── index.ts       # Zod validation schemas
├── constants/
│   └── index.ts       # Storage keys, config values
├── primitives/        # Cross-domain shared primitives
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
- **Commercial Offer**: `MASTER_OFFER_SHEET`, `MASTER_OFFER_TERMS`, offer comparison rows, pricing helpers
- **Appointments**: `APPOINTMENT_STATUSES`, `APPOINTMENT_TYPES`, `BOOKING_STEPS`
- **Nutrition**: `MEAL_TYPES`, `FOOD_UNITS`, `LOCATION_TYPES`, `PREPARATION_METHODS`
- **Training**: `STRATEGY_TYPES`, `GOAL_CATEGORIES`
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
- `UNIT_SYSTEMS` - Metric/Imperial/Advanced (lives in `domain/units.ts`)
- `PAGINATION` - Default page sizes
- `TIME_MS` - Time constants in milliseconds

## Rules for Adding New Contracts

### DO:

✅ Add new domain concepts here first, then re-export from local contracts  
✅ Include types, Zod schemas, constants, AND label maps together  
✅ Follow the existing pattern: `THING_TYPES` (tuple), `THING_TYPE` (object), `ThingTypeSchema` (Zod), `THING_TYPE_LABELS` (display)  
✅ Add tests in `__tests__/compile.test.ts`  
✅ Keep this module pure TypeScript + Zod only
✅ For membership commercial terms, update `domain/offer-sheet.json` first so legal and web-public can stay aligned

### DON'T:

❌ Import React, React Native, or Expo  
❌ Import Node-specific modules (fs, path, crypto)  
❌ Import from `@services/*`, `@features/*`, or any layer modules  
❌ Add platform-specific code  
❌ Create circular dependencies with local contracts (caught by `npm run check:circular`)

## Avoiding Circular Dependencies

Circular dependencies can cause:

- Module initialization failures
- Undefined exports at runtime
- Build tool confusion (Vite, Metro, Webpack)

### When to Extract to `primitives/`

Use the **3-Module Test** — extract to `primitives/` ONLY when:

✅ **Used by 3+ domain modules** (actual `domain/*.ts` files, not just admin/ai)
✅ **OR** causing an actual circular dependency error

Otherwise, keep it in the domain module where it naturally belongs.

**Examples:**

```typescript
// ✅ STAYS in domain/user.ts (only user module needs it)
export const USER_ROLES = ["ADMIN", "CLINICIAN", "TRAINER", "CLIENT"] as const;

// ✅ STAYS in domain/appointments.ts (only appointments need it)
export const APPOINTMENT_STATUSES = ["SCHEDULED", "COMPLETED"] as const;

// ✅ EXTRACTED to primitives/volume-level.ts
// Used by: domain/training.ts, admin/admin-types.ts, ai/ai-types.ts
export const VOLUME_LEVELS = ["low", "moderate", "high"] as const;
```

**Simple Check:**

```bash
# Count domain modules that import this type
grep -r "import.*MyType" shared/contracts/domain/*.ts | wc -l

# If result < 3, DON'T extract to primitives
```

### Prevention Rules:

1. ✅ Extract to `primitives/` only when hitting the 3-Module Test threshold
2. ✅ Make primitives depend only on Zod, not other contracts
3. ✅ Have higher-level contracts import from primitives
4. ❌ Never import from barrel `index.ts` files within the same module
5. ❌ Don't preemptively extract "just in case"

**Detection:**

```bash
npm run check:circular       # Check for circular deps
npm run test:circular        # Run circular deps tests
```

The CI pipeline automatically checks for circular dependencies on every push.

## Pattern Examples

### Adding a New Domain Constant

```typescript
// In shared/contracts/domain/your-domain.ts

import { z } from "zod";

// 1. Tuple (runtime array for iteration)
export const YOUR_THINGS = ["THING_A", "THING_B", "THING_C"] as const;

// 2. Type (derived from tuple)
export type YourThing = (typeof YOUR_THINGS)[number];

// 3. Schema (for validation)
export const YourThingSchema = z.enum(YOUR_THINGS);

// 4. Object constant (for direct access)
export const YOUR_THING = {
  THING_A: "THING_A",
  THING_B: "THING_B",
  THING_C: "THING_C",
} as const satisfies Record<YourThing, YourThing>;

// 5. Labels (for display)
export const YOUR_THING_LABELS: Record<YourThing, string> = {
  THING_A: "Thing A",
  THING_B: "Thing B",
  THING_C: "Thing C",
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
} from "@hollis/contracts";
export type { YourThing } from "@hollis/contracts";

// Platform-specific extensions can be added below
export const YOUR_THING_ICONS: Record<YourThing, string> = {
  THING_A: "🅰️",
  THING_B: "🅱️",
  THING_C: "©️",
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

| Codebase  | Alias               | Points To                      |
| --------- | ------------------- | ------------------------------ |
| Mobile    | `@hollis/contracts` | `shared/contracts/index.ts`    |
| Mobile    | `@contracts`        | `src/contracts/index.ts`       |
| Server    | `@hollis/contracts` | `../shared/contracts/index.ts` |
| Web Admin | `@hollis/contracts` | `../shared/contracts/index.ts` |
| Web Admin | `@contracts`        | `contracts/index.ts`           |

## CI Integration

The shared contracts module includes CI checks:

- `npm run test:contracts` - Validates schemas and exports
- `npm run check:contract-duplicates` - Ensures no duplicate definitions
- TypeScript compilation validates type coherence across all codebases
