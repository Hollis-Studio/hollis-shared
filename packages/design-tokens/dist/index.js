/**
 * @ai-context Design tokens: Root export
 *
 * @hollis-studio/design-tokens - Single source of truth for design tokens
 *
 * Usage:
 *   // Platform-agnostic tokens
 *   import { brandColors, spacing } from '@hollis-studio/design-tokens';
 *
 *   // React Native specific
 *   import { nativeLightTheme, nativeDarkTheme } from '@hollis-studio/design-tokens/native';
 *
 *   // Web/Next.js specific
 *   import { webLightTheme, generateTailwindThemeBlock } from '@hollis-studio/design-tokens/web';
 */
// Re-export all tokens for convenience
export * from './tokens/index.js';
export * from './clay.js';
export * from './workouts/index.js';
//# sourceMappingURL=index.js.map