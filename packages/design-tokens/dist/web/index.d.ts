/**
 * @ai-context Design tokens: Web/Next.js platform exports
 *
 * Theme values formatted for web (CSS strings, Tailwind integration).
 */
import { accentColors, brandColors, fontFamily, fontSizesCss, fontWeights, lightColors, lineHeightsCss, opacityCss, radiiCss, shadowsCss, spacingCss, transitionsCss } from '../tokens/index.js';
/** Color keys present in both light and dark themes */
type ThemeColorKeys = keyof typeof lightColors;
/** Theme colors with string values and chart palette */
export type WebThemeColors = {
    [K in ThemeColorKeys]: string;
} & {
    chartPalette: readonly string[];
};
export interface WebTheme {
    colors: WebThemeColors;
    spacing: typeof spacingCss;
    opacity: typeof opacityCss;
    typography: {
        fontFamily: typeof fontFamily;
        sizes: typeof fontSizesCss;
        weights: typeof fontWeights;
        lineHeights: typeof lineHeightsCss;
    };
    borderRadius: typeof radiiCss;
    shadows: typeof shadowsCss;
    transitions: typeof transitionsCss;
    brand: typeof brandColors;
    accents: typeof accentColors;
}
export declare const webLightTheme: WebTheme;
export declare const webDarkTheme: WebTheme;
/**
 * Generates CSS custom properties from theme colors
 */
export declare function generateColorCssVariables(colors: Record<string, string | readonly string[]>, prefix?: string): string;
/**
 * Generates complete CSS variables block for Tailwind @theme
 */
export declare function generateTailwindThemeBlock(): string;
/**
 * Generates CSS variables for :root selector (traditional approach)
 */
export declare function generateRootCssVariables(): string;
export { accentColors, brandColors, brandShades, chartPaletteDark, chartPaletteLight, darkColors, fontFamily, fontSizesCss, fontWeights, lightColors, lineHeightsCss, radiiCss, shadowsCss, spacingCss, transitionsCss } from '../tokens/index.js';
//# sourceMappingURL=index.d.ts.map