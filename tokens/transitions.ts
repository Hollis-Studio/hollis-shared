/**
 * @ai-context Design tokens: Animation/transition timing
 *
 * Consistent motion timing values for web transitions.
 */

/** Transition durations in milliseconds (for programmatic use) */
export const durations = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

/** CSS transition values */
export const transitionsCss = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
} as const;

export type DurationKey = keyof typeof durations;
