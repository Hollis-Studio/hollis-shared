/**
 * @ai-context Design tokens: Main export
 *
 * Re-exports all token modules for convenient importing.
 */

// Brand foundation
export { brandColors, brandShades, commonColors } from './brand';
export type { BrandColor, BrandShade } from './brand';

// Semantic colors
export {
    accentColors,
    darkColors,
    goalProgressColors,
    lightColors,
    roleBadgeColors,
    strategyStatusColors,
    trendColors
} from './colors';
export type {
    AccentColor,
    GoalProgressStatus,
    SemanticColor,
    StrategyStatusKey,
    TrendStatus
} from './colors';

// Spacing
export { spacing, spacingCss, spacingRem } from './spacing';
export type { SpacingKey } from './spacing';

// Opacity
export { opacity, opacityCss } from './opacity';
export type { OpacityKey } from './opacity';

// Typography
export {
    fontFamily,
    fontSizes,
    fontSizesCss,
    fontWeights,
    lineHeights,
    lineHeightsCss
} from './typography';
export type { FontSizeKey, FontWeightKey, LineHeightKey } from './typography';

// Border radius
export { radii, radiiCss } from './radii';
export type { RadiusKey } from './radii';

// Shadows
export { shadowsCss, shadowsNativeAndroid, shadowsNativeIOS } from './shadows';
export type { ShadowKey } from './shadows';

// Transitions
export { durations, transitionsCss } from './transitions';
export type { DurationKey } from './transitions';

// Charts
export {
    chartPaletteDark,
    chartPaletteLight,
    insightColors,
    insightGradients,
    macroColors,
    presetChartPalettes,
    sleepColors
} from './charts';
export type { ChartPalette } from './charts';

