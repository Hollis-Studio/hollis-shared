/**
 * @ai-context Design tokens: Main export
 *
 * Re-exports all token modules for convenient importing.
 */

// Brand foundation
export { brandColors, brandShades, commonColors } from './brand';
export type { BrandColor, BrandShade } from './brand';

// Spacing
export { spacing, spacingCss, spacingRem } from './spacing';
export type { SpacingKey } from './spacing';

// Opacity
export { opacity, opacityCss } from './opacity';
export type { OpacityKey } from './opacity';

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
export * from './charts';
export * from './colors';
export * from './typography';

