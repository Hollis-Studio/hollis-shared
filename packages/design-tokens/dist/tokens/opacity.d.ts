/**
 * @ai-context Design tokens: Opacity values
 *
 * Standard opacity values for overlays, hover states, and semi-transparent surfaces.
 */
export declare const opacity: {
    /** Overlay backdrop opacity (0.5) - for modals/overlays */
    readonly overlay: 0.5;
    /** Subtle surface opacity for light mode (0.1) */
    readonly subtle: 0.1;
    /** Subtle surface opacity for dark mode (0.05) */
    readonly subtleDark: 0.05;
    /** Hover state opacity for light mode (0.04) */
    readonly hover: 0.04;
    /** Hover state opacity for dark mode (0.08) */
    readonly hoverDark: 0.08;
    /** Active/pressed state opacity for light mode (0.12) */
    readonly active: 0.12;
    /** Active/pressed state opacity for dark mode (0.16) */
    readonly activeDark: 0.16;
    /** Disabled state opacity (0.4) */
    readonly disabled: 0.4;
    /** FAB shadow and subtle elevation (0.15) */
    readonly fabShadow: 0.15;
    /** Track color for progress rings/dials - light mode (0.08) */
    readonly trackLight: 0.08;
    /** Track color for progress rings/dials - dark mode (0.15) */
    readonly trackDark: 0.15;
};
/**
 * Opacity values for web (CSS string format)
 */
export declare const opacityCss: {
    readonly overlay: "0.5";
    readonly subtle: "0.1";
    readonly subtleDark: "0.05";
    readonly hover: "0.04";
    readonly hoverDark: "0.08";
    readonly active: "0.12";
    readonly activeDark: "0.16";
    readonly disabled: "0.4";
    readonly fabShadow: "0.15";
    readonly trackLight: "0.08";
    readonly trackDark: "0.15";
};
export type OpacityKey = keyof typeof opacity;
//# sourceMappingURL=opacity.d.ts.map