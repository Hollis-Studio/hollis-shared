/**
 * @ai-context Design tokens: Spacing scale
 *
 * Consistent spacing values for margins, padding, and gaps.
 * Based on a 4px base unit for precise alignment.
 */

/** Spacing scale in numeric values (for React Native) */
export const spacing = {
  /** 4px - Minimal spacing */
  xs: 4,
  /** 8px - Small spacing */
  sm: 8,
  /** 16px - Medium/default spacing */
  md: 16,
  /** 24px - Large spacing */
  lg: 24,
  /** 32px - Extra large spacing */
  xl: 32,
  /** 48px - 2x extra large spacing */
  xxl: 48,
} as const;

/** Spacing scale with CSS units (for web) */
export const spacingCss = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
} as const;

/** Spacing scale as rem values (for web, 1rem = 16px) */
export const spacingRem = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
} as const;

export type SpacingKey = keyof typeof spacing;
