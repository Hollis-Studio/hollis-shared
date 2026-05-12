/**
 * @ai-context Design tokens: Typography scale
 *
 * Font sizes, weights, and line heights for consistent text styling.
 */
/** Font sizes in numeric values (for React Native) */
export declare const fontSizes: {
    /** 11px - Extra small, captions */
    readonly xs: 11;
    /** 13px - Small, secondary text */
    readonly sm: 13;
    /** 15px - Medium/default body text */
    readonly md: 15;
    /** 17px - Large, emphasis */
    readonly lg: 17;
    /** 20px - Extra large, subheadings */
    readonly xl: 20;
    /** 24px - 2x extra large, headings */
    readonly xxl: 24;
    /** 32px - 3x extra large, display */
    readonly xxxl: 32;
};
/** Font sizes with CSS units (for web) */
export declare const fontSizesCss: {
    readonly xs: "12px";
    readonly sm: "14px";
    readonly md: "16px";
    readonly lg: "18px";
    readonly xl: "20px";
    readonly xxl: "24px";
    readonly xxxl: "30px";
    readonly xxxxl: "36px";
};
/** Font weights */
export declare const fontWeights: {
    readonly regular: "400";
    readonly medium: "500";
    readonly semibold: "600";
    readonly bold: "700";
    readonly heavy: "800";
};
/** Line heights as multipliers (for React Native) */
export declare const lineHeights: {
    /** 1.2 - Tight, for headings */
    readonly tight: 1.2;
    /** 1.5 - Normal, for body text */
    readonly normal: 1.5;
    /** 1.75 - Relaxed, for readable blocks */
    readonly relaxed: 1.75;
};
/** Line heights as CSS values (for web) */
export declare const lineHeightsCss: {
    readonly tight: "1.25";
    readonly normal: "1.5";
    readonly relaxed: "1.75";
};
/** Web font stack */
export declare const fontFamily: {
    readonly sans: "\"Brooklyn\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    readonly mono: "ui-monospace, SFMono-Regular, \"SF Mono\", Menlo, Consolas, monospace";
};
export type FontSizeKey = keyof typeof fontSizes;
export type FontWeightKey = keyof typeof fontWeights;
export type LineHeightKey = keyof typeof lineHeights;
//# sourceMappingURL=typography.d.ts.map