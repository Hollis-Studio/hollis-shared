# Machine-Aware Gym Translation — Data-Acquisition Decision

> **Status:** Decided 2026-08-17. Owner: Isaac.
> **Scope:** How the canonical machine catalog and per-gym machine inventories
> get seeded and maintained for the Hollis Workouts "machine-aware gym
> translation" capability.
> **Consumers:** Hollis Workouts (`docs/TODO.md` §N.3, §G), `@hollis-studio/contracts`.
> **Companion docs:**
>
> - Suite vision: [`../vision/2026-05-18-suite-vision.md`](../vision/2026-05-18-suite-vision.md) §331–339
> - End-state architecture: [`./suite-strategy.md`](./suite-strategy.md)

---

## 1. Context

The suite vision (§331–339) claims machine-aware gym translation as a moat: a
user walking into a new gym should have their program translated onto the
equipment that gym actually has, by name, not by generic movement pattern. That
claim only holds if there is real seed data — a canonical machine catalog plus
per-gym inventories for a meaningful floor of commercial gyms (the vision names
~200).

What exists today is **not** that. `GymExerciseInstance` in Workouts is a
per-user, per-gym record of "this exercise, at this gym, with these settings."
It is a **Gym Profile** feature: it personalizes the user's own gyms. It carries
no shared canonical machine identity, so nothing about it translates across
users or gyms. Marketing it as the moat would overstate what ships.

The vision instructed that a written decision on the seed-data approach precede
shipping the capability. This document is that decision.

## 2. Options considered

**(a) User-contributed.** Users create machine entries as they encounter them;
the catalog emerges from usage. Cheapest to start, zero editorial cost, scales
with adoption. But it bootstraps from nothing — the first thousand users get no
translation benefit at all, which is exactly the cohort the moat is supposed to
win. It also produces a duplicate-heavy, inconsistently-named catalog that is
expensive to clean up later, and quality is unbounded at exactly the moment
trust is being established.

**(b) Curated + crowdsourced.** A curated seed catalog establishes canonical
identity and naming; user contributions extend coverage into the long tail
behind moderation. Higher up-front cost, but the seed guarantees day-one value
and gives every later contribution something to dedupe against.

**(c) Fully curated.** Editorial control end to end. Highest quality, but
coverage is bounded by how much cataloging work Hollis can fund, and gym
inventories churn — a fully curated model has no mechanism to stay current.

## 3. Decision

**Curated + crowdsourced (option b) is the long-term model.**

Rationale: the canonical layer is where correctness lives, and it must be
curated or the moat degrades into a synonym pile. But per-gym inventory is
high-churn, geographically distributed, and unbounded — it is the natural
crowdsourcing surface, and the only economically viable way to reach real
coverage. Curation owns identity; the crowd owns inventory.

**Launch posture: curated-only.** The crowdsourcing feature does not ship at
launch. It will be designed carefully and separately, gated on Isaac's design
review, because a contribution surface that ships badly is worse than one that
ships late: it poisons the catalog, and the cleanup cost is paid forever.

**Marketing constraint:** do not advertise machine-aware gym translation — in
app copy, on the landing page, or in App Store metadata — until the curated seed
milestone actually exists. Until then the shipped feature is described as **Gym
Profiles**, which is what it is.

## 4. Consequences

- **`CanonicalMachine` / `MachineInstance` schema work is unblocked** at P2.
  `CanonicalMachine` lands in `@hollis-studio/contracts` (suite-shared identity);
  `MachineInstance` (the per-gym mapping table) lives in Workouts. Existing
  `GymExerciseInstance` becomes a thin denormalization of
  `MachineInstance × movement pattern`.
- **The seed pipeline stays blocked on the schema.** Manufacturer catalog
  ingest and the per-gym admin entry tool (a web form, not an in-app surface)
  cannot start until canonical identity is defined. Sourcing and the legality of
  ingesting manufacturer catalogs (licensing, trademark, database rights) is
  tracked as its own post-launch research item in Workouts `docs/TODO.md` §G.
- **Workouts issue #46 — canonical submission + moderation pipeline for
  user-generated content — is the future crowdsourcing seam.** The submit /
  dedup-suggest / Promote-Merge-Reject machinery it specifies for exercises is
  the same machinery machine contributions will need. Design #46 so it
  generalizes; do not build a second, parallel moderation path for machines.
- **No moat claim in the roadmap narrative** until the seed milestone is
  declared. The capability is real work with a real payoff, but it is a
  post-launch program, not a launch feature.

## 5. Open

- Define the curated seed milestone concretely (how many gyms, which markets,
  what counts as "covered") before the seed pipeline starts.
- Decide whether canonical machine identity is manufacturer-model-level or
  family-level. Manufacturer-level is more precise and legally heavier;
  family-level generalizes better and sidesteps trademark questions. This
  interacts directly with the catalog-legality research above.
