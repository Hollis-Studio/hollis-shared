/**
 * @ai-context Design tokens: Typography scale
 *
 * Font sizes, weights, and line heights for consistent text styling.
 */
/** Font sizes in numeric values (for React Native) */
export const fontSizes = {
    /** 11px - Extra small, captions */
    xs: 11,
    /** 13px - Small, secondary text */
    sm: 13,
    /** 15px - Medium/default body text */
    md: 15,
    /** 17px - Large, emphasis */
    lg: 17,
    /** 20px - Extra large, subheadings */
    xl: 20,
    /** 24px - 2x extra large, headings */
    xxl: 24,
    /** 32px - 3x extra large, display */
    xxxl: 32,
};
/** Font sizes with CSS units (for web) */
export const fontSizesCss = {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '30px',
    xxxxl: '36px',
};
/** Font weights */
export const fontWeights = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
};
/** Line heights as multipliers (for React Native) */
export const lineHeights = {
    /** 1.2 - Tight, for headings */
    tight: 1.2,
    /** 1.5 - Normal, for body text */
    normal: 1.5,
    /** 1.75 - Relaxed, for readable blocks */
    relaxed: 1.75,
};
/** Line heights as CSS values (for web) */
export const lineHeightsCss = {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
};
/** Web font stack */
export const fontFamily = {
    sans: '"Brooklyn", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
};
//# sourceMappingURL=typography.js.map