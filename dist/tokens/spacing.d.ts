/**
 * @ai-context Design tokens: Spacing scale
 *
 * Consistent spacing values for margins, padding, and gaps.
 * Based on a 4px base unit for precise alignment.
 */
/** Blue/Health spacing scale in numeric values (for React Native) */
export declare const spacingBlue: {
    /** 4px - Minimal spacing */
    readonly xs: 4;
    /** 8px - Small spacing */
    readonly sm: 8;
    /** 16px - Medium/default spacing */
    readonly md: 16;
    /** 24px - Large spacing */
    readonly lg: 24;
    /** 32px - Extra large spacing */
    readonly xl: 32;
    /** 48px - 2x extra large spacing */
    readonly xxl: 48;
};
/** Clay/Workouts spacing scale in numeric values (for React Native) */
export declare const spacingClay: {
    readonly md: 12;
    readonly lg: 16;
    readonly xl: 24;
    readonly xxl: 32;
};
/** Default spacing remains the Blue/Health scale for backward compatibility. */
export declare const spacing: {
    /** 4px - Minimal spacing */
    readonly xs: 4;
    /** 8px - Small spacing */
    readonly sm: 8;
    /** 16px - Medium/default spacing */
    readonly md: 16;
    /** 24px - Large spacing */
    readonly lg: 24;
    /** 32px - Extra large spacing */
    readonly xl: 32;
    /** 48px - 2x extra large spacing */
    readonly xxl: 48;
};
/** Spacing scale with CSS units (for web) */
export declare const spacingCss: {
    readonly xs: "4px";
    readonly sm: "8px";
    readonly md: "16px";
    readonly lg: "24px";
    readonly xl: "32px";
    readonly xxl: "48px";
};
/** Spacing scale as rem values (for web, 1rem = 16px) */
export declare const spacingRem: {
    readonly xs: "0.25rem";
    readonly sm: "0.5rem";
    readonly md: "1rem";
    readonly lg: "1.5rem";
    readonly xl: "2rem";
    readonly xxl: "3rem";
};
export type SpacingKey = keyof typeof spacing;
export type SpacingBlueKey = keyof typeof spacingBlue;
export type SpacingClayKey = keyof typeof spacingClay;
//# sourceMappingURL=spacing.d.ts.map