/**
 * @ai-context Design tokens: Brand foundation colors
 *
 * HOLLIS HEALTH OFFICIAL BRAND COLORS
 * Do not modify without brand approval.
 */
export declare const brandColors: {
    /** Primary brand color - headers, text, primary actions */
    readonly navy: "#01314A";
    /** Primary background - clean, minimal */
    readonly offWhite: "#FCFCFC";
    /** Secondary accent - warm, approachable */
    readonly tan: "#C6B2A1";
    /** Tertiary accent - soft, professional */
    readonly lightBlue: "#93B3CD";
};
/** Common utility colors - use sparingly, prefer semantic tokens */
export declare const commonColors: {
    readonly white: "#FFFFFF";
    readonly black: "#000000";
    readonly transparent: "transparent";
};
/** Derived brand shades */
export declare const brandShades: {
    readonly navy: {
        readonly DEFAULT: "#01314A";
        readonly light: "#93B3CD";
        readonly dark: "#001F30";
        readonly 50: "#E8EDF0";
        readonly 100: "#C5D4DD";
        readonly 200: "#9FB9C9";
        readonly 300: "#799EB5";
        readonly 400: "#5C8AA6";
        readonly 500: "#3F7697";
        readonly 600: "#366889";
        readonly 700: "#2B5575";
        readonly 800: "#224462";
        readonly 900: "#142A3D";
        readonly 950: "#01314A";
    };
    readonly tan: {
        readonly DEFAULT: "#C6B2A1";
        readonly light: "#DBC7B6";
        readonly dark: "#A89485";
        readonly 50: "#FAF8F6";
        readonly 100: "#F2EDE9";
        readonly 200: "#E8E0D8";
        readonly 300: "#DBC7B6";
        readonly 400: "#C6B2A1";
        readonly 500: "#B5A08F";
        readonly 600: "#A89485";
        readonly 700: "#8E7A6B";
        readonly 800: "#756456";
        readonly 900: "#5C4F44";
    };
    readonly lightBlue: {
        readonly DEFAULT: "#93B3CD";
        readonly light: "#B0D0EA";
        readonly dark: "#7090AA";
        readonly 50: "#F0F5FA";
        readonly 100: "#E0EBF5";
        readonly 200: "#C5DAEA";
        readonly 300: "#B0D0EA";
        readonly 400: "#93B3CD";
        readonly 500: "#7090AA";
        readonly 600: "#5A7A94";
        readonly 700: "#4A6378";
        readonly 800: "#3A4D5C";
        readonly 900: "#2A3740";
    };
};
export type BrandColor = keyof typeof brandColors;
export type BrandShade = keyof typeof brandShades;
//# sourceMappingURL=brand.d.ts.map