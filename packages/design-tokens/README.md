# @hollis-studio/design-tokens

Single source of truth for design tokens across all Hollis apps (React Native, Next.js/web, admin).

Published to the GitHub Package Registry (`npm.pkg.github.com`).

## Entry points

| Import path | Contents |
|---|---|
| `@hollis-studio/design-tokens` | Platform-agnostic primitives (brand, spacing, colors, typography, etc.) |
| `@hollis-studio/design-tokens/native` | React Native themes (`nativeLightTheme`, `nativeDarkTheme`, `nativeThemePresets`) |
| `@hollis-studio/design-tokens/web` | Web/Next.js themes + CSS variable generators |
| `@hollis-studio/design-tokens/clay` | Clay theme color palette (light + dark) |
| `@hollis-studio/design-tokens/spacing-clay` | Clay spacing scale only |
| `@hollis-studio/design-tokens/workouts` | Workouts-specific color constants |
| `@hollis-studio/design-tokens/tokens` | Re-export of raw token primitives |

## Root export (`@hollis-studio/design-tokens`)

Re-exports everything from `tokens/index`, `clay`, and `workouts/index`. Use this for cross-platform code that only needs primitive values, not themed objects.

### Brand (`tokens/brand`)

```ts
brandColors: { navy, offWhite, tan, lightBlue }
brandShades: { navy, tan, lightBlue }  // each with DEFAULT, light, dark, 50–950
commonColors: { white, black, transparent }

type BrandColor = keyof typeof brandColors
type BrandShade = keyof typeof brandShades
```

### Spacing (`tokens/spacing`)

```ts
spacing      // alias for spacingBlue — numeric px values (4/8/16/24/32/48)
spacingBlue  // { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 }
spacingClay  // { md:12, lg:16, xl:24, xxl:32 }
spacingCss   // CSS string variants ('4px' … '48px')
spacingRem   // rem variants ('0.25rem' … '3rem')

type SpacingKey     = keyof typeof spacing
type SpacingBlueKey = keyof typeof spacingBlue
type SpacingClayKey = keyof typeof spacingClay
```

### Opacity (`tokens/opacity`)

```ts
opacity:    Record<OpacityKey, number>   // numeric (0–1)
opacityCss: Record<OpacityKey, string>   // percentage strings

type OpacityKey = keyof typeof opacity
```

### Border radius (`tokens/radii`)

```ts
radii:    Record<RadiusKey, number>   // numeric px
radiiCss: Record<RadiusKey, string>   // CSS strings

type RadiusKey = keyof typeof radii
```

### Shadows (`tokens/shadows`)

```ts
shadowsCss:           Record<ShadowKey, string>   // CSS box-shadow values
shadowsNativeIOS:     { sm, md, lg, xl }           // iOS StyleSheet shadow props
shadowsNativeAndroid: { sm, md, lg, xl }           // Android elevation props

type ShadowKey = keyof typeof shadowsCss
```

### Transitions (`tokens/transitions`)

```ts
durations:      Record<DurationKey, number>  // ms values
transitionsCss: Record<DurationKey, string>  // CSS transition strings

type DurationKey = keyof typeof durations
```

### Typography (`tokens/typography`)

```ts
fontSizes:     { xs:11, sm:13, md:15, lg:17, xl:20, xxl:24, xxxl:32 }   // numeric (RN)
fontSizesCss:  { xs:'12px', sm:'14px', md:'16px', lg:'18px', xl:'20px', xxl:'24px', xxxl:'30px', xxxxl:'36px' }
fontWeights:   { regular:'400', medium:'500', semibold:'600', bold:'700', heavy:'800' }
lineHeights:   { tight:1.2, normal:1.5, relaxed:1.75 }   // multipliers (RN)
lineHeightsCss:{ tight:'1.25', normal:'1.5', relaxed:'1.75' }
fontFamily:    { sans: '"Brooklyn", system-ui, …', mono: '…' }

type FontSizeKey   = keyof typeof fontSizes
type FontWeightKey = keyof typeof fontWeights
type LineHeightKey = keyof typeof lineHeights
```

### Semantic colors (`tokens/colors`)

```ts
lightColors: Record<SemanticColor, string>  // light theme
darkColors:  Record<SemanticColor, string>  // dark theme
accentColors: { sage, rose, amber, periwinkle, warmGray, lavender }  // each with light/DEFAULT/dark

trendColors:          { light, dark }
strategyStatusColors: { light, dark }   // keys: active | completed | paused | draft | archived
goalProgressColors:   { light, dark }   // keys: onTrack | atRisk | offTrack
roleBadgeColors:      { admin, clinician, trainer, client, default }  // { color, bg }

type SemanticColor     = keyof typeof lightColors
type AccentColor       = keyof typeof accentColors
type TrendStatus       = keyof typeof trendColors.light
type StrategyStatusKey = keyof typeof strategyStatusColors.light
type GoalProgressStatus = keyof typeof goalProgressColors.light
```

### Chart palettes (`tokens/charts`)

```ts
chartPaletteLight:   readonly string[]  // 8 colors for light backgrounds
chartPaletteDark:    readonly string[]  // 8 colors for dark backgrounds
sleepColors:         { light, dark }    // deep | light | rem | awake
insightColors:       { light, dark }
insightGradients:    { light, dark }
macroColors:         { protein, carbs, fat }
presetChartPalettes: { ocean, forest, sunset }  // each is readonly string[]

type ChartPalette = readonly string[]
```

### Clay theme (`clay`)

```ts
clayLightColors: Record<ClayColorToken, string>
clayDarkColors:  Record<ClayColorToken, string>
clayColors:      { light: clayLightColors, dark: clayDarkColors }

type ClayColorMode  = 'light' | 'dark'
type ClayColorToken = keyof typeof clayLightColors
```

### Workouts tokens (`workouts`)

```ts
workoutsRirScale:              { low, mid, high }   // RIR indicator colors
workoutsHeatmapOpacity:        { low, mid, high }   // opacity values
workoutsChartGeometry:         { barHeightSm, barHeightMd, barMinWidth, maxListHeight }
workoutsExerciseAccentPalette: readonly string[]    // 6 accent colors
workoutsNutritionColors:       { protein, carbs, fat }
```

## Native entry point (`@hollis-studio/design-tokens/native`)

```ts
nativeLightTheme: NativeTheme
nativeDarkTheme:  NativeTheme
nativeThemePresets: { light, dark, ocean, forest, sunset }
shadowsIOS:     typeof shadowsNativeIOS
shadowsAndroid: typeof shadowsNativeAndroid

interface NativeTheme {
  colors:       NativeThemeColors   // full semantic color set + chartPalette
  spacing:      typeof spacing
  opacity:      typeof opacity
  typography:   { sizes, weights, lineHeights }
  borderRadius: typeof radii
  shadows:      { sm, md, lg, xl }
  brand:        typeof brandColors
}

type NativeThemePreset = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset'
```

Also re-exports token primitives as mutable copies (Metro bundler compatibility): `accentColors`, `brandColors`, `brandShades`, `chartPaletteDark`, `chartPaletteLight`, `darkColors`, `fontSizes`, `fontWeights`, `insightColors`, `insightGradients`, `lightColors`, `lineHeights`, `macroColors`, `opacity`, `presetChartPalettes`, `radii`, `roleBadgeColors`, `sleepColors`, `spacing`.

## Web entry point (`@hollis-studio/design-tokens/web`)

```ts
webLightTheme: WebTheme
webDarkTheme:  WebTheme

interface WebTheme {
  colors:       WebThemeColors   // semantic colors + chartPalette
  spacing:      typeof spacingCss
  opacity:      typeof opacityCss
  typography:   { fontFamily, sizes: fontSizesCss, weights: fontWeights, lineHeights: lineHeightsCss }
  borderRadius: typeof radiiCss
  shadows:      typeof shadowsCss
  transitions:  typeof transitionsCss
  brand:        typeof brandColors
  accents:      typeof accentColors
}

// CSS variable generators
generateColorCssVariables(colors, prefix?): string
generateTailwindThemeBlock(): string   // emits @theme { … } block for Tailwind v4
generateRootCssVariables(): string     // emits :root { … } block
```

Also re-exports: `accentColors`, `brandColors`, `brandShades`, `chartPaletteDark`, `chartPaletteLight`, `darkColors`, `fontFamily`, `fontSizesCss`, `fontWeights`, `lightColors`, `lineHeightsCss`, `radiiCss`, `shadowsCss`, `spacingCss`, `transitionsCss`.

## Usage examples

```ts
// Platform-agnostic — brand + spacing
import { brandColors, spacing } from '@hollis-studio/design-tokens';

// React Native
import { nativeLightTheme, nativeDarkTheme } from '@hollis-studio/design-tokens/native';

// Next.js / Tailwind v4
import { generateTailwindThemeBlock } from '@hollis-studio/design-tokens/web';

// Clay theme (Workouts app)
import { clayLightColors, clayDarkColors } from '@hollis-studio/design-tokens/clay';
```

## Notes

- No runtime dependencies. Build output is pure JS + TypeScript declarations.
- `spacing` is an alias for `spacingBlue` (the Health app scale). Use `spacingClay` for the Workouts app scale.
- `fontSizes` values are numeric (React Native); `fontSizesCss` values are pixel strings (web). The scales differ slightly — do not assume they correspond 1:1.
- `shadowsNativeIOS` / `shadowsNativeAndroid` should be consumed with `Platform.select()` in the app, not here.
