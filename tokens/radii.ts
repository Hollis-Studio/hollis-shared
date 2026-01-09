/**
 * @ai-context Design tokens: Border radius scale
 *
 * Consistent corner rounding for UI elements.
 */

/** Border radius in numeric values (for React Native) */
export const radii = {
  /** 4px - Small, subtle rounding */
  sm: 4,
  /** 8px - Medium/default rounding */
  md: 8,
  /** 12px - Large rounding */
  lg: 12,
  /** 16px - Extra large rounding */
  xl: 16,
  /** 9999px - Full/pill shape */
  full: 9999,
} as const;

/** Border radius with CSS units (for web) */
export const radiiCss = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
} as const;

export type RadiusKey = keyof typeof radii;
