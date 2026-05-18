# Phase D Shared Boundary Baseline — 2026-05-12

Phase D restored the original three shared extraction gates from the WIP
snapshot, added the two new hardening gates, and wired all five into
`package.json`, `scripts/run-check-suite.js`, `scripts/precommit-full.sh`, and
`scripts/agent-tools/scope-resolver.js`.

## Gate Results

| Gate | Result | Violation Count | Notes |
| --- | --- | ---: | --- |
| `npm run check:shared-package-boundary -- --json` | Fail | 21 | Package metadata/dist readiness violations across contracts, design-tokens, and utils. |
| `npm run check:shared-consumer-boundary -- --json` | Fail | 252 | Remaining `@contracts` aliases, shared source-path reach-through, private package subpaths, and tooling aliases. |
| `npm run check:shared-extraction` | Fail | 273 | Umbrella count from package-boundary + consumer-boundary. |
| `npm run check:shared-no-local-barrels -- --json` | Fail | 194 | Local `src/contracts/**` re-export barrels still masking shared package imports. |
| `npm run check:shared-node-esm-smoke -- --json` | Fail | 25 | Remaining Node ESM runtime issues are in `shared/design-tokens/dist/**`; contracts smoke path now passes. |

## First-Burndown Priorities

1. Fix shared package metadata and design-tokens Node ESM emit so package-level
   gates can distinguish real consumer violations from package readiness noise.
2. Remove local contracts barrels and rewrite consumers to direct public
   `@hollis/contracts` entrypoints.
3. Decide deliberate public subpath exports for the private-subpath violations
   instead of relying on app-local compatibility files.
4. Remove config aliases that point `@hollis/*` packages back to local shared
   source before Phase H extraction.

