/**
 * @ai-context Design tokens: Spacing scale
 *
 * Consistent spacing values for margins, padding, and gaps.
 * Based on a 4px base unit for precise alignment.
 */
/** Blue/Health spacing scale in numeric values (for React Native) */
export const spacingBlue = {
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
};
/** Clay/Workouts spacing scale in numeric values (for React Native) */
export const spacingClay = {
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
};
/** Default spacing remains the Blue/Health scale for backward compatibility. */
export const spacing = spacingBlue;
/** Spacing scale with CSS units (for web) */
export const spacingCss = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
};
/** Spacing scale as rem values (for web, 1rem = 16px) */
export const spacingRem = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
};
//# sourceMappingURL=spacing.js.map