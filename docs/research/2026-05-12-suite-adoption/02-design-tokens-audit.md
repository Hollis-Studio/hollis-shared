# Workouts ↔ @hollis-studio/design-tokens Audit

- **Created:** 2026-05-12
- **Workouts version inspected:** v1.6.3 (post UI Rebrand pt1, git tag `ef42aac`)
- **Shared source inspected:** `hollis-health-app@v3.7.45` — `shared/design-tokens/` v1.0.0
- **Workouts theme home:** `src/theme/tokens.ts`, `src/theme/unistyles.ts`, `src/theme/types.ts`
- **Shared token source root:** `/Users/isaaclandes/Documents/SRC/hollis-health-app/shared/design-tokens/`

> **2026-05-19 status note:** The adoption blockers C.1–C.6 identified in §C have been resolved. Clay palette tokens (`clayLightColors`, `clayDarkColors`, `clayBrand`) are now in `packages/design-tokens/clay.ts`. The `spacingClay` scale (resolving C.2) is exported from `packages/design-tokens/spacing-clay.ts`. Workouts-specific tokens (RIR scale, heatmap opacity, chart geometry — C.5) are in `packages/design-tokens/workouts/`. The Workouts-side renames for C.3 (`extraBold` → `heavy`) and C.4 (shadow `Platform.select` shape) were completed in Workouts `v1.6.7`. The Unistyles architecture (C.6) was kept — Workouts feeds the Clay `NativeTheme` into `UnistylesRegistry` from the shared tokens source. The audit findings remain accurate as a historical description of the state before adoption; §C.1 ("No Clay palette in shared") is the key finding that is now resolved.

---

## A. Palette Parity

### A.1 Does the shared package have a Clay palette?

**No.** The shared package defines only a **Blue/Navy palette** built on `brandColors.navy` (`#01314A`) and `brandColors.lightBlue` (`#93B3CD`). There is no Clay (terracotta/brick) palette in any file under `shared/design-tokens/`.

Relevant files:

- `shared/design-tokens/tokens/brand.ts` — `brandColors = { navy, offWhite, tan, lightBlue }`. The `tan` (`#C6B2A1`) appears here as a secondary accent, but it is used as a warm counterpoint to navy, not as part of a Clay-first identity.
- `shared/design-tokens/tokens/colors.ts` — `lightColors` and `darkColors` are both navy-primary. `accentColors` uses sage, rose, amber, periwinkle, warmGray, lavender — none of which map to terracotta.
- `shared/design-tokens/native/index.ts` — exposes `nativeLightTheme` and `nativeDarkTheme` (both Blue), plus three preset variants (`ocean`, `forest`, `sunset`). No Clay preset exists.

### A.2 Workouts color inventory vs. shared package

The Workouts Clay palette lives entirely in `src/theme/tokens.ts` (lines 33–118). The table below lists every token, its hex value, semantic role, and categorization.

#### Structural tokens (light/dark theme switching)

| Workouts token     | Light value        | Dark value | Semantic role                 | Categorization                                                                                                                                                                              |
| ------------------ | ------------------ | ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background`       | `#FAFAFA`          | `#212121`  | Page background               | **PROMOTE_TO_CLAY**                                                                                                                                                                         |
| `surface`          | `#FFFFFF`          | `#2A2A2A`  | Card / sheet surface          | **PROMOTE_TO_CLAY**                                                                                                                                                                         |
| `surfaceElevated`  | `#FFFFFF`          | `#333333`  | Modal / elevated card         | **PROMOTE_TO_CLAY**                                                                                                                                                                         |
| `surfaceHighlight` | `#EDEDEF`          | `#3D3D3D`  | Selected state highlight      | **PROMOTE_TO_CLAY**                                                                                                                                                                         |
| `border`           | `#D8D8DC`          | `#383838`  | Default hairline border       | **PROMOTE_TO_CLAY**                                                                                                                                                                         |
| `borderStrong`     | `#C6B2A1`          | `#C6B2A1`  | Emphasis border; equals `tan` | **MAP_TO_EXISTING** — maps to `brandColors.tan`                                                                                                                                             |
| `overlay`          | `rgba(0,0,0,0.72)` | same       | Full modal backdrop           | **ADOPT_SHARED** — shared `lightColors.modalOverlay`/`darkColors.modalOverlay` overlap semantically; Workouts value is 0.72 vs. Health's 0.5/0.8 (different opacity). Needs reconciliation. |
| `overlaySubtle`    | `rgba(0,0,0,0.36)` | same       | Drawer/partial backdrop       | **WORKOUTS_LOCAL** — no shared equivalent                                                                                                                                                   |

#### Brand/accent tokens (shared between light and dark)

| Workouts token       | Value                            | Semantic role                              | Categorization                                                         |
| -------------------- | -------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| `primary`            | `#B65E44`                        | Terracotta primary (CTA, active states)    | **PROMOTE_TO_CLAY** — Clay-only concept, no shared equivalent          |
| `secondary`          | `#C6B2A1`                        | Hollis tan — warm secondary                | **MAP_TO_EXISTING** — `brandColors.tan` exact match                    |
| `primaryMuted` light | `rgba(182,94,68,0.10)`           | Primary tint (pressed backgrounds, badges) | **PROMOTE_TO_CLAY**                                                    |
| `primaryMuted` dark  | `rgba(182,94,68,0.18)`           | Same, slightly more opaque                 | **PROMOTE_TO_CLAY**                                                    |
| `blueMuted`          | `rgba(136,160,181,0.18)`         | Muted blue tint                            | **WORKOUTS_LOCAL** — Workouts-specific use, correlates to `accentBlue` |
| `amberMuted`         | `rgba(214,158,92,0.15)` / `0.16` | Muted amber tint                           | **PROMOTE_TO_CLAY**                                                    |
| `orangeMuted`        | `rgba(201,122,96,0.15)`          | Muted orange tint                          | **PROMOTE_TO_CLAY**                                                    |
| `redMuted`           | `rgba(182,94,68,0.15)`           | Muted error tint                           | **PROMOTE_TO_CLAY**                                                    |
| `successMuted`       | `rgba(107,168,130,0.15)`         | Muted success tint                         | **PROMOTE_TO_CLAY**                                                    |
| `warningMuted`       | `rgba(214,158,92,0.15)`          | Muted warning tint                         | **PROMOTE_TO_CLAY**                                                    |
| `errorMuted`         | `rgba(182,94,68,0.15)`           | Muted error tint                           | **PROMOTE_TO_CLAY**                                                    |

#### Text tokens

| Workouts token  | Light value | Dark value | Semantic role                  | Categorization                                                                       |
| --------------- | ----------- | ---------- | ------------------------------ | ------------------------------------------------------------------------------------ |
| `textPrimary`   | `#000000`   | `#FFFFFF`  | Heading / primary text         | **PROMOTE_TO_CLAY** — note Health uses `brandColors.navy` / `offWhite` for primaries |
| `textSecondary` | `#27272A`   | `#E4E4E4`  | Body text                      | **PROMOTE_TO_CLAY**                                                                  |
| `textTertiary`  | `#52525B`   | `#A8A8A8`  | Caption / helper text          | **PROMOTE_TO_CLAY**                                                                  |
| `textOnPrimary` | `#FFFFFF`   | `#FFFFFF`  | Text on terracotta backgrounds | **PROMOTE_TO_CLAY**                                                                  |
| `textOnAccent`  | `#FFFFFF`   | `#FFFFFF`  | Text on any accent             | **PROMOTE_TO_CLAY**                                                                  |

#### Semantic accent tokens (clayAccents — shared between modes)

| Workouts token | Value     | Semantic role              | Categorization                                                                                         |
| -------------- | --------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `success`      | `#6BA882` | Success state (muted sage) | **NEEDS_RECONCILIATION** — shared `accentColors.sage.DEFAULT` is `#A8C5A8`, different hue              |
| `warning`      | `#D69E5C` | Warning state (warm amber) | **NEEDS_RECONCILIATION** — shared `accentColors.amber.DEFAULT` is `#D4B896`, similar family            |
| `error`        | `#B65E44` | Error state (terracotta)   | **NEEDS_RECONCILIATION** — shared `accentColors.rose.DEFAULT` is `#F87171` (red), completely different |
| `accentBlue`   | `#88A0B5` | Info/chart blue            | **NEEDS_RECONCILIATION** — shared `brandColors.lightBlue` is `#93B3CD`, similar but lighter            |
| `accentGreen`  | `#6BA882` | Positive metric            | same as `success`                                                                                      |
| `accentAmber`  | `#C6B2A1` | Warm neutral accent        | **MAP_TO_EXISTING** — equals `brandColors.tan`                                                         |
| `accentOrange` | `#C97A60` | Warm orange accent         | **PROMOTE_TO_CLAY**                                                                                    |
| `accentRed`    | `#B65E44` | Danger / negative          | **PROMOTE_TO_CLAY** (same as `primary`/`error`)                                                        |
| `accentPurple` | `#A98DC2` | Chart / analytics accent   | **WORKOUTS_LOCAL** — no suite counterpart                                                              |

#### Workout-domain chart tokens (no Health equivalent)

| Workouts token     | Value                                                           | Semantic role                         | Categorization                                                                                     |
| ------------------ | --------------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `nutritionProtein` | `#88A0B5`                                                       | Protein macro color                   | **WORKOUTS_LOCAL** — Health has `macroColors.protein = #9333EA` (purple), completely different     |
| `nutritionCarbs`   | `#D69E5C`                                                       | Carbs macro color                     | **WORKOUTS_LOCAL** — Health has `macroColors.carbs = #059669` (green)                              |
| `nutritionFat`     | `#C97A60`                                                       | Fat macro color                       | **WORKOUTS_LOCAL** — Health has `macroColors.fat = #D97706` (amber)                                |
| `rirLow`           | `#B65E44`                                                       | RIR 0-1 (high effort)                 | **WORKOUTS_LOCAL** — no suite concept                                                              |
| `rirMid`           | `#D69E5C`                                                       | RIR 2-3 (moderate)                    | **WORKOUTS_LOCAL**                                                                                 |
| `rirHigh`          | `#6BA882`                                                       | RIR 4+ (low effort)                   | **WORKOUTS_LOCAL**                                                                                 |
| `exerciseAccents`  | `['#88A0B5','#6BA882','#C6B2A1','#C97A60','#A98DC2','#B65E44']` | Per-exercise chart palette (6 colors) | **WORKOUTS_LOCAL** — analogous to `chartPaletteLight`/`Dark` in shared but Clay-colored and 6-slot |

---

## B. Token Surface Parity

### B.1 Typography

| Sub-token       | Workouts shape                                                                                                   | Shared shape                                                                                 | Assessment                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sizes`         | 9 steps: `xs=11, sm=13, md=15, lg=17, xl=20, xxl=24, xxxl=32, hero=40, displayLg=48` (`src/theme/tokens.ts:133`) | 7 steps: `xs=11, sm=13, md=15, lg=17, xl=20, xxl=24, xxxl=32` (no `hero`, no `displayLg`)    | **EXTEND_SHARED** — shared numeric scale is a subset; Workouts adds `hero` and `displayLg`. Both are used (`theme.typography.sizes.hero`, `theme.typography.sizes.displayLg` active in components). |
| `weights`       | 5: `regular=400, medium=500, semibold=600, bold=700, extraBold=800`                                              | 5: `regular=400, medium=500, semibold=600, bold=700, heavy=800`                              | **NEEDS_RECONCILIATION** — token names differ: Workouts calls it `extraBold`, shared calls it `heavy`. Same numeric value.                                                                          |
| `lineHeights`   | 3: `tight=1.2, normal=1.4, relaxed=1.6`                                                                          | 3: `tight=1.2, normal=1.5, relaxed=1.75`                                                     | **NEEDS_RECONCILIATION** — `normal` and `relaxed` values differ (0.1–0.15 higher in shared). Workouts is tighter.                                                                                   |
| `letterSpacing` | 3: `tight=0, caps=1, wide=0.8`                                                                                   | Not present in shared                                                                        | **WORKOUTS_LOCAL_DRIFT** — shared has no letterSpacing token                                                                                                                                        |
| `families`      | 5 Brooklyn variants: `regular, bold, heavy, semibold, italic`                                                    | `fontFamily.sans` includes `"Brooklyn"` in the web CSS stack; no RN-native `families` object | **NEEDS_RECONCILIATION** — shared defines a web fontFamily CSS string; Workouts uses direct Brooklyn font file names for RN. Both reference Brooklyn but in incompatible formats.                   |

### B.2 Spacing

| Token key | Workouts value | Shared value | Notes                                             |
| --------- | -------------- | ------------ | ------------------------------------------------- |
| `xxs`     | 2              | **absent**   | Workouts-only step                                |
| `xs`      | 4              | 4            | Match                                             |
| `sm`      | 8              | 8            | Match                                             |
| `md`      | 12             | **16**       | **MISMATCH** — Workouts `md=12`, shared `md=16`   |
| `lg`      | 16             | **24**       | **MISMATCH** — Workouts `lg=16`, shared `lg=24`   |
| `xl`      | 24             | **32**       | **MISMATCH** — Workouts `xl=24`, shared `xl=32`   |
| `xxl`     | 32             | **48**       | **MISMATCH** — Workouts `xxl=32`, shared `xxl=48` |
| `xxxl`    | 48             | **absent**   | Workouts-only step                                |

**Assessment: NEEDS_RECONCILIATION** — The two scales are both 4-base but differ significantly from `md` upward. Workouts uses a tighter, more granular scale (8 steps vs. 6 steps in shared). The majority of Workouts spacing calls (`theme.spacing.lg`, `theme.spacing.md`, `theme.spacing.sm`, `theme.spacing.xl`, `theme.spacing.xs`, `theme.spacing.xxl`, `theme.spacing.xxs`, `theme.spacing.xxxl`) would change numeric values if naively swapped to the shared scale — this is the single most impactful divergence. A Clay-specific spacing scale must be defined separately in the shared package, or the shared scale must be adjusted before adoption.

### B.3 Radii

| Token key | Workouts value | Shared value | Notes                   |
| --------- | -------------- | ------------ | ----------------------- |
| `none`    | 0              | **absent**   | Workouts-only           |
| `sm`      | **6**          | **4**        | MISMATCH                |
| `md`      | 8              | 8            | Match                   |
| `lg`      | 12             | 12           | Match                   |
| `xl`      | 16             | 16           | Match                   |
| `full`    | 999            | 9999         | Functionally equivalent |

**Assessment: EXTEND_SHARED** — Minor divergence: `radii.sm` is 6 in Workouts vs. 4 in shared. Workouts also uses `radii.none` explicitly. Shared could add `none` and adjust `sm`. The remaining values match exactly.

### B.4 Opacity

| Token key        | Workouts value | Shared value                          | Notes                    |
| ---------------- | -------------- | ------------------------------------- | ------------------------ |
| `disabled`       | 0.5            | **0.4**                               | MISMATCH                 |
| `disabledStrong` | 0.32           | **absent**                            | Workouts-only            |
| `emphasis`       | 0.86           | **absent**                            | Workouts-only            |
| `overlaySubtle`  | 0.36           | **absent** (closest is `overlay=0.5`) | Workouts-only            |
| `overlayStrong`  | 0.72           | **absent**                            | Workouts-only            |
| `heatmapLow`     | 0.25           | **absent**                            | Workouts domain-specific |
| `heatmapMid`     | 0.58           | **absent**                            | Workouts domain-specific |
| `heatmapHigh`    | 0.92           | **absent**                            | Workouts domain-specific |
| —                | —              | `overlay=0.5`                         | Not in Workouts          |
| —                | —              | `subtle=0.1`, `subtleDark=0.05`       | Not in Workouts          |
| —                | —              | `hover=0.04`, `hoverDark=0.08`        | Not in Workouts          |
| —                | —              | `active=0.12`, `activeDark=0.16`      | Not in Workouts          |
| —                | —              | `fabShadow=0.15`                      | Not in Workouts          |
| —                | —              | `trackLight=0.08`, `trackDark=0.15`   | Not in Workouts          |

**Assessment: NEEDS_RECONCILIATION** — The two opacity surfaces are almost entirely disjoint. Workouts opacity is tuned to Clay's visual weight (near-full overlays, gradient heatmaps). Shared opacity is tuned for Health's interactive state system (hover/active/track). Merging requires a combined Clay-specific extension.

### B.5 Shadows

| Aspect            | Workouts                                            | Shared                                                         |
| ----------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| Shadow color      | `#000` (black)                                      | `brandColors.navy` (`#01314A`)                                 |
| Scales available  | `none, sm, md, lg` (4 levels)                       | `sm, md, lg, xl` for iOS; `sm, md, lg, xl` for Android         |
| `elevation` field | Yes (Workouts combines iOS + Android in one object) | Separate `shadowsNativeIOS` and `shadowsNativeAndroid` objects |
| iOS `sm` opacity  | 0.05                                                | 0.08                                                           |
| iOS `md` opacity  | 0.08                                                | 0.12                                                           |
| iOS `lg` opacity  | 0.12                                                | 0.15                                                           |

**Assessment: NEEDS_RECONCILIATION** — Workouts uses a single cross-platform shadow object (combining `shadowColor/shadowRadius/elevation`); shared separates iOS and Android and expects the app to use `Platform.select()`. Health's `src/theme/theme.ts` already wraps with Platform.select at the consuming layer. The shadow color is also different (black vs. navy). A Clay shadow variant with terracotta-neutral black color would need to be added to the shared package.

### B.6 Transitions/Animations

Workouts: **Not present.** There is no animation/transition token in Workouts' `src/theme/tokens.ts`. The app uses Reanimated directly with hard-coded duration constants.

Shared: `durations = { fast:150, normal:200, slow:300 }` and `transitionsCss` exist in `shared/design-tokens/tokens/transitions.ts`.

**Assessment: WORKOUTS_LOCAL_DRIFT** — Workouts has no equivalent. When adopting shared tokens, Workouts should adopt `durations` from the shared package rather than continue scattering magic numbers.

### B.7 Layout (Component Sizing)

Workouts defines `layout` (`src/theme/tokens.ts:223`) with three sub-namespaces: `sizes` (32 named component dimensions), `borderWidths` (5), and `charts` (4). This is entirely absent from the shared package.

**Assessment: WORKOUTS_LOCAL_DRIFT** — `layout` is Workouts-specific engineering. Several values are highly app-specific (e.g., `exerciseTabHeight: 90`, `tabThumbWidth: 72`, `confirmButton: 48`). However, the following sub-tokens are generic enough to promote:

- `layout.sizes.iconXs/Sm/Md/Lg/Xl` — standard icon scale
- `layout.sizes.touchTarget: 48` — matches iOS HIG minimum
- `layout.sizes.fab: 56` — standard FAB size
- `layout.borderWidths` — shared does not define named border widths at all

### B.8 Charts

Shared: Comprehensive chart token surface in `shared/design-tokens/tokens/charts.ts` — `chartPaletteLight` (8 colors), `chartPaletteDark` (8 colors), `sleepColors`, `insightColors`, `macroColors`, `insightGradients`, `presetChartPalettes` (ocean/forest/sunset).

Workouts: Chart tokens are embedded inside `clayAccents` (`src/theme/tokens.ts:33`) as: `exerciseAccents` (6-color array), `nutritionProtein/Carbs/Fat`, `rirLow/Mid/High`. Plus `layout.charts` has geometry tokens (`barHeightSm/Md`, `barMinWidth`, `maxListHeight`).

**Assessment: NEEDS_RECONCILIATION** for palette; **WORKOUTS_LOCAL_DRIFT** for geometry.

- Workouts chart palette is Clay-colored (terracotta/sage/tan) vs. shared's Blue-based palette. They cannot be interchanged directly.
- Workouts `macroColors` (protein=`#88A0B5`, carbs=`#D69E5C`, fat=`#C97A60`) deliberately differ from Health's `macroColors` (protein=`#9333EA`, carbs=`#059669`, fat=`#D97706`). These represent the same semantic tokens but with brand-differentiated values — this is the intended Clay vs. Blue split.
- Chart geometry (`barHeightSm`, etc.) is purely Workouts-local and should stay local.

---

## C. Adoption Blockers

### C.1 Hardcoded values bypassing `theme.*`

The checker at `scripts/checks/check-theme-tokens.js` (rules TH-1 through TH-4) was run against the full `src/components/` and `app/` tree.

**Result: 0 violations.** The codebase is clean. Every hex color, fontSize, borderRadius, and spacing value in components and screens flows through `theme.*` access. The single allowlisted exception is `app/_layout.tsx:273` (`backgroundColor: activeThemeColors.background` — uses a theme object, not a raw hex).

No grep for raw `rgba()` or `#rrggbb` literals found any hits outside `src/theme/tokens.ts`.

### C.2 Spacing scale collision (critical)

The spacing scale mismatch identified in §B.2 is a **code-breaking blocker**. `theme.spacing.md` in Workouts is `12`; in shared it is `16`. All `theme.spacing.{md,lg,xl,xxl}` call sites would produce visually different layouts if the shared scale were directly substituted. This affects hundreds of style calls across the component tree. A Clay-specific spacing scale must either:

1. Be promoted into the shared package as `spacingClay` alongside the existing `spacing`, or
2. Keep Workouts on its own scale and only adopt other token categories from shared.

### C.3 Typography weight naming collision

`theme.typography.weights.extraBold` (Workouts) vs. `fontWeights.heavy` (shared) — same value (`800`), different key name. Any generic component that references `weights.extraBold` would need renaming if adopting the shared object.

### C.4 `useStyles` / Unistyles coupling

Workouts uses **react-native-unistyles v2** (`^2.43.0`) as its theming engine, integrated via `src/theme/unistyles.ts`. The shared package (`@hollis-studio/design-tokens/native`) has **no dependency on Unistyles** — it exports plain JS objects.

Health app (`hollis-health-app@3.7.45`) also does not use Unistyles; it imports `@hollis-studio/design-tokens/native` directly in `src/theme/theme.ts` and passes theme objects via React Context (`ThemeProvider.tsx`).

**This is an architectural mismatch.** Workouts' style system is:

```
tokens.ts → unistyles.ts (UnistylesRegistry) → createStyleSheet((theme) => ...) per component
```

Health's style system is:

```
@hollis-studio/design-tokens/native → theme.ts → React Context (useTheme hook) → StyleSheet.create per component
```

To adopt shared tokens, Workouts would need to either:

1. **Keep Unistyles** and wrap the Clay palette into a new `NativeTheme`-compatible shape that Workouts feeds into `UnistylesRegistry` (the least disruptive path — only the token source changes, the style system stays the same).
2. **Migrate off Unistyles** to the Context-based pattern Health uses — this is a larger engineering effort.

The shared `NativeTheme` interface (`native/index.ts:37`) uses `borderRadius` (not `radii`), `card` (not present in Workouts), `textMuted` (not present in Workouts), and lacks `overlay`, `overlaySubtle`, `surfaceHighlight`, `borderStrong`, `primaryMuted`, `*Muted`, `textOnPrimary`, `textOnAccent`, `exerciseAccents`, `nutrition*`, `rir*`, `layout`, `shadows.none`. Workouts' `AppTheme` interface and the shared `NativeTheme` interface are structurally incompatible today.

### C.5 Shadow object shape

Workouts expects a combined `{ shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation }` per shadow level (`src/theme/tokens.ts:192`). The shared package splits iOS and Android and expects the consumer to call `Platform.select()`. Any component using `theme.shadows.md` directly would need to be updated to the `Platform.select` pattern.

### C.6 Opacity semantic gap

Workouts `theme.opacity.disabled` is `0.5`; shared is `0.4`. Workouts `theme.opacity.heatmapLow/Mid/High` are used by `src/components/analytics/MuscleHeatmap.tsx:137–145` — these have no shared equivalent and must be retained locally.

### C.7 Clay-specific structural colors have no home in shared

`primary` (`#B65E44`), `primaryMuted`, `surfaceHighlight`, `borderStrong`, the full muted family (`amberMuted`, `orangeMuted`, `redMuted`, `successMuted`, `warningMuted`, `errorMuted`) exist nowhere in the shared package. Any adoption requires adding a `clayColors` export (or a `clay` preset in `nativeThemePresets`) to the shared package before Workouts can migrate.

### C.8 Brooklyn font — RN vs. web mismatch

Shared's `fontFamily.sans` is a CSS string that begins with `"Brooklyn"` — usable in web. For React Native, Workouts uses named font file variants (`Brooklyn-Regular`, `Brooklyn-Bold`, etc.) in `typography.families`. The shared package has no React Native `families` equivalent. The consuming app (Workouts) would need to maintain its own font-family mapping regardless of shared adoption.

---

## D. Promotion Candidates (Workouts → `@hollis-studio/design-tokens`)

Ordered by impact (highest first — tokens consumed most broadly and needed by any future Clay-palette app).

1. **Clay brand primitive (`clayBrand`)** — `primary: #B65E44` (Terracotta), `secondary: #C6B2A1` (tan, already in `brandColors.tan`), with derived shades. This is the foundation everything else builds on. Add alongside existing `brandColors`. _(Impact: unblocks all other Clay tokens)_

2. **Clay semantic color themes (`clayLightColors`, `clayDarkColors`)** — the full 40-token light/dark objects from `src/theme/tokens.ts:55–113`. Export as a Clay preset alongside `nativeLightTheme`/`nativeDarkTheme` in `native/index.ts`. _(Impact: enables any future app to `import { nativeClayLightTheme }` from shared)_

3. **Muted color family** — `primaryMuted`, `successMuted`, `warningMuted`, `errorMuted`, `amberMuted`, `orangeMuted`, `redMuted`, `blueMuted`. These are the rgba tint tokens used for badge backgrounds, pressed states, and info pills. Generic enough to appear in any fitness or health context. *(Impact: 11 component files reference `*Muted` tokens)\*

4. **Clay spacing scale** — `{ xxs:2, xs:4, sm:8, md:12, lg:16, xl:24, xxl:32, xxxl:48 }` promoted as `spacingClay`. The existing `spacing` (4-base, offset scale) stays for Health. _(Impact: resolves the most critical collision — dozens of `theme.spacing._` callsites)\*

5. **`exerciseAccents` array** — 6-color palette tuned to Clay hues for multi-series exercise charts. Could be promoted as `chartPaletteClay` (light) and `chartPaletteDarkClay` (dark). _(Impact: used in `WeeklyHardSetsChart` and multi-exercise analytics)_

6. **RIR color scale** — `{ low: #B65E44, mid: #D69E5C, high: #6BA882 }`. A "traffic light" pattern used throughout Workouts for effort-level display. Conceptually reusable in any training app. _(Impact: used in set row components, summary views)_

7. **`typography.sizes.hero` and `typography.sizes.displayLg`** — add `hero:40` and `displayLg:48` to the shared `fontSizes` object. Both are used in Workouts dashboard hero numbers and could be valuable in Health's data-display screens. _(Impact: extends shared without conflict)_

8. **`layout.borderWidths`** — `{ none:0, hairline:0.5, thin:1, medium:2, thick:3 }`. Named border widths are completely absent from shared. This token set is platform-neutral and directly reusable. _(Impact: eliminates reliance on `theme.layout.borderWidths._` being local-only)\*

9. **`opacity.heatmapLow/Mid/High`** — `{ heatmapLow:0.25, heatmapMid:0.58, heatmapHigh:0.92 }`. Add to the shared `opacity` object as a fitness/heatmap extension. Used in `MuscleHeatmap.tsx`. _(Impact: allows future muscle-map or effort-heatmap features in sibling apps)_

10. **`layout.sizes` icon scale** — `{ iconXs:12, iconSm:16, iconMd:20, iconLg:24, iconXl:40, touchTarget:48, fab:56 }`. These are platform conventions (iOS HIG touch targets, Material FAB) that belong in a shared layout primitives object. _(Impact: any new RN app can import consistent icon sizing)_

---

## Recommended Phased Adoption Order

1. **Phase 1 — Source-only, no breaking changes.** Add Clay palette tokens to `@hollis-studio/design-tokens` without removing any existing tokens. Deliverables: `clayBrand` primitives, `clayLightColors`/`clayDarkColors`, `nativeClayLightTheme`/`nativeClayDarkTheme` preset, `spacingClay`, `chartPaletteClay`. Publish as v1.1.0 of the shared package.

2. **Phase 2 — Workouts refactors token source.** Update `src/theme/tokens.ts` to import Clay primitives from `@hollis-studio/design-tokens` (pinned git tag) rather than defining them inline. Keep `clayAccents` (domain-specific tokens: `nutritionProtein`, `rir*`, `exerciseAccents`) local. Keep `layout` fully local. Keep `typography.families` local. Keep `shadows` local (pending shadow shape reconciliation).

3. **Phase 3 — Reconcile structural divergences.** Resolve `lineHeights.normal/relaxed` discrepancy, `radii.sm` value (6 vs. 4), shadow object shape (combined vs. Platform.select), and `opacity.disabled` (0.5 vs. 0.4). These require cross-app design review before changing values, as they affect rendered output.

4. **Phase 4 — Typography weight key rename.** Rename `extraBold` → `heavy` in Workouts' `typography.weights` to match shared, gated on a codemod since it's used in many components.

5. **Phase 5 — Transitions adoption.** Import `durations` from shared package and replace any hardcoded Reanimated timing constants in Workouts.
