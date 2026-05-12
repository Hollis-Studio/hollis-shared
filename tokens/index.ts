/**
 * @ai-context Design tokens: Main export
 *
 * Re-exports all token modules for convenient importing.
 */

// Brand foundation
export { brandColors, brandShades, commonColors } from './brand.js';
export type { BrandColor, BrandShade } from './brand.js';

// Spacing
export { spacing, spacingCss, spacingRem } from './spacing.js';
export type { SpacingKey } from './spacing.js';

// Opacity
export { opacity, opacityCss } from './opacity.js';
export type { OpacityKey } from './opacity.js';

// Border radius
export { radii, radiiCss } from './radii.js';
export type { RadiusKey } from './radii.js';

// Shadows
export { shadowsCss, shadowsNativeAndroid, shadowsNativeIOS } from './shadows.js';
export type { ShadowKey } from './shadows.js';

// Transitions
export { durations, transitionsCss } from './transitions.js';
export type { DurationKey } from './transitions.js';

// Charts
export * from './charts.js';
export * from './colors.js';
export * from './typography.js';
