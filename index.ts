/**
 * @ai-context Design tokens: Root export
 *
 * @hollis/design-tokens - Single source of truth for design tokens
 *
 * Usage:
 *   // Platform-agnostic tokens
 *   import { brandColors, spacing } from '@hollis/design-tokens';
 *
 *   // React Native specific
 *   import { nativeLightTheme, nativeDarkTheme } from '@hollis/design-tokens/native';
 *
 *   // Web/Next.js specific
 *   import { webLightTheme, generateTailwindThemeBlock } from '@hollis/design-tokens/web';
 */

// Re-export all tokens for convenience
export * from './tokens';
