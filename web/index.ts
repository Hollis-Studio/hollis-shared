/**
 * @ai-context Design tokens: Web/Next.js platform exports
 *
 * Theme values formatted for web (CSS strings, Tailwind integration).
 */

import {
    accentColors,
    brandColors,
    chartPaletteDark,
    chartPaletteLight,
    darkColors,
    fontFamily,
    fontSizesCss,
    fontWeights,
    lightColors,
    lineHeightsCss,
    opacityCss,
    radiiCss,
    shadowsCss,
    spacingCss,
    transitionsCss,
} from '../tokens/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// WEB THEME INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

/** Color keys present in both light and dark themes */
type ThemeColorKeys = keyof typeof lightColors;

/** Theme colors with string values and chart palette */
export type WebThemeColors = {
  [K in ThemeColorKeys]: string;
} & { chartPalette: readonly string[] };

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

// ─────────────────────────────────────────────────────────────────────────────
// THEME DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const baseWebTheme = {
  spacing: spacingCss,
  opacity: opacityCss,
  typography: {
    fontFamily,
    sizes: fontSizesCss,
    weights: fontWeights,
    lineHeights: lineHeightsCss,
  },
  borderRadius: radiiCss,
  shadows: shadowsCss,
  transitions: transitionsCss,
  brand: brandColors,
  accents: accentColors,
};

export const webLightTheme: WebTheme = {
  ...baseWebTheme,
  colors: {
    ...lightColors,
    chartPalette: chartPaletteLight,
  },
};

export const webDarkTheme: WebTheme = {
  ...baseWebTheme,
  colors: {
    ...darkColors,
    chartPalette: chartPaletteDark,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CSS VARIABLE GENERATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts camelCase to kebab-case
 */
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generates CSS custom properties from theme colors
 */
export function generateColorCssVariables(
  colors: Record<string, string | readonly string[]>,
  prefix = ''
): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(colors)) {
    const varName = `--${prefix}${toKebabCase(key)}`;

    if (Array.isArray(value)) {
      // For arrays (like chartPalette), create indexed variables
      value.forEach((v, i) => {
        lines.push(`  ${varName}-${i}: ${v};`);
      });
    } else if (typeof value === 'string') {
      lines.push(`  ${varName}: ${value};`);
    }
  }

  return lines.join('\n');
}

/**
 * Generates complete CSS variables block for Tailwind @theme
 */
export function generateTailwindThemeBlock(): string {
  const colorVars = generateColorCssVariables(lightColors, 'color-');
  const brandVars = generateColorCssVariables(brandColors, 'brand-');

  // Accent colors with light/DEFAULT/dark variants
  const accentVars: string[] = [];
  for (const [name, shades] of Object.entries(accentColors)) {
    accentVars.push(`  --accent-${name}: ${shades.DEFAULT};`);
    accentVars.push(`  --accent-${name}-light: ${shades.light};`);
    accentVars.push(`  --accent-${name}-dark: ${shades.dark};`);
  }

  const spacingVars = Object.entries(spacingCss)
    .map(([key, value]) => `  --spacing-${key}: ${value};`)
    .join('\n');

  const radiusVars = Object.entries(radiiCss)
    .map(([key, value]) => `  --radius-${key}: ${value};`)
    .join('\n');

  const shadowVars = Object.entries(shadowsCss)
    .map(([key, value]) => `  --shadow-${key}: ${value};`)
    .join('\n');

  const fontSizeVars = Object.entries(fontSizesCss)
    .map(([key, value]) => `  --font-size-${key}: ${value};`)
    .join('\n');

  return `@theme {
  /* Brand Colors */
${brandVars}

  /* Semantic Colors */
${colorVars}

  /* Accent Colors */
${accentVars.join('\n')}

  /* Spacing */
${spacingVars}

  /* Border Radius */
${radiusVars}

  /* Shadows */
${shadowVars}

  /* Font Sizes */
${fontSizeVars}

  /* Font Family */
  --font-sans: ${fontFamily.sans};
  --font-mono: ${fontFamily.mono};
}`;
}

/**
 * Generates CSS variables for :root selector (traditional approach)
 */
export function generateRootCssVariables(): string {
  const colorVars = generateColorCssVariables(lightColors, '');
  const brandVars = generateColorCssVariables(brandColors, 'brand-');

  const accentVars: string[] = [];
  for (const [name, shades] of Object.entries(accentColors)) {
    accentVars.push(`  --${name}: ${shades.DEFAULT};`);
    accentVars.push(`  --${name}-light: ${shades.light};`);
    accentVars.push(`  --${name}-dark: ${shades.dark};`);
  }

  return `:root {
  /* Brand */
${brandVars}

  /* Colors */
${colorVars}

  /* Accents */
${accentVars.join('\n')}
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE RE-EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { accentColors, brandColors, brandShades, chartPaletteDark, chartPaletteLight, darkColors, fontFamily, fontSizesCss, fontWeights, lightColors, lineHeightsCss, radiiCss, shadowsCss, spacingCss, transitionsCss } from '../tokens/index.js';
