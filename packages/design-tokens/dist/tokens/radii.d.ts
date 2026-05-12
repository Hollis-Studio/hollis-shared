/**
 * @ai-context Design tokens: Border radius scale
 *
 * Consistent corner rounding for UI elements.
 */
/** Border radius in numeric values (for React Native) */
export declare const radii: {
    /** 4px - Small, subtle rounding */
    readonly sm: 4;
    /** 8px - Medium/default rounding */
    readonly md: 8;
    /** 12px - Large rounding */
    readonly lg: 12;
    /** 16px - Extra large rounding */
    readonly xl: 16;
    /** 9999px - Full/pill shape */
    readonly full: 9999;
};
/** Border radius with CSS units (for web) */
export declare const radiiCss: {
    readonly xs: "2px";
    readonly sm: "4px";
    readonly md: "8px";
    readonly lg: "12px";
    readonly xl: "16px";
    readonly '2xl': "20px";
    readonly full: "9999px";
};
export type RadiusKey = keyof typeof radii;
//# sourceMappingURL=radii.d.ts.map