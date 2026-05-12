/**
 * @ai-context Design tokens: Animation/transition timing
 *
 * Consistent motion timing values for web transitions.
 */
/** Transition durations in milliseconds (for programmatic use) */
export declare const durations: {
    readonly fast: 150;
    readonly normal: 200;
    readonly slow: 300;
};
/** CSS transition values */
export declare const transitionsCss: {
    readonly fast: "150ms ease";
    readonly normal: "200ms ease";
    readonly slow: "300ms ease";
};
export type DurationKey = keyof typeof durations;
//# sourceMappingURL=transitions.d.ts.map