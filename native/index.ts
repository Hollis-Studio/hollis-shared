/**
 * @ai-context Design tokens: React Native platform exports
 *
 * Theme values formatted for React Native StyleSheets.
 * All values are numeric (no CSS units).
 *
 * NOTE: This module is imported by both React Native and Next.js.
 * Platform-specific code (like Platform.select) should be in the consuming app,
 * not in this shared module.
 */

import * as Tokens from '../tokens';

// Re-export status colors for native consumers
export type { GoalProgressStatus, StrategyStatusKey, TrendStatus } from '../tokens';

// Create new objects to avoid "property is not configurable" error with Metro bundler
// These objects are frozen with 'as const', so we need to create fresh copies
export const commonColors = { ...Tokens.commonColors };
export const goalProgressColors = { 
  light: { ...Tokens.goalProgressColors.light },
  dark: { ...Tokens.goalProgressColors.dark }
};
export const strategyStatusColors = {
  light: { ...Tokens.strategyStatusColors.light },
  dark: { ...Tokens.strategyStatusColors.dark }
};
export const trendColors = {
  light: { ...Tokens.trendColors.light },
  dark: { ...Tokens.trendColors.dark }
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface NativeThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;

  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textInverse: string;

  border: string;
  borderLight: string;
  borderSubtle: string;
  borderFocus: string;

  success: string;
  successLight: string;
  successDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  info: string;
  infoLight: string;
  infoDark: string;

  hover: string;
  active: string;
  focus: string;
  disabled: string;

  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;

  tabBarBackground: string;
  tabBarBorder: string;
  tabIconDefault: string;
  tabIconSelected: string;

  headerBackground: string;
  headerText: string;

  modalBackground: string;
  modalOverlay: string;

  chartPrimary: string;
  chartSecondary: string;
  chartTertiary: string;
  chartGrid: string;
  chartPalette: readonly string[];
}

export interface NativeThemeShadow {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
}

export interface NativeTheme {
  colors: NativeThemeColors;
  spacing: typeof Tokens.spacing;
  opacity: typeof Tokens.opacity;
  typography: {
    sizes: typeof Tokens.fontSizes;
    weights: typeof Tokens.fontWeights;
    lineHeights: typeof Tokens.lineHeights;
  };
  borderRadius: typeof Tokens.radii;
  shadows: {
    sm: NativeThemeShadow;
    md: NativeThemeShadow;
    lg: NativeThemeShadow;
    xl: NativeThemeShadow;
  };
  brand: typeof Tokens.brandColors;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHADOW DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shadow definitions for each platform.
 * Consuming apps should use Platform.select() with these values:
 *
 * @example
 * const shadow = Platform.select({
 *   ios: shadowsIOS.md,
 *   android: shadowsAndroid.md,
 *   default: {},
 * });
 */
export const shadowsIOS = Tokens.shadowsNativeIOS;
export const shadowsAndroid = Tokens.shadowsNativeAndroid;

/** Default shadows (iOS style, commonly used) */
const defaultShadows = {
  sm: Tokens.shadowsNativeIOS.sm as NativeThemeShadow,
  md: Tokens.shadowsNativeIOS.md as NativeThemeShadow,
  lg: Tokens.shadowsNativeIOS.lg as NativeThemeShadow,
  xl: Tokens.shadowsNativeIOS.xl as NativeThemeShadow,
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const baseTheme = {
  spacing: Tokens.spacing,
  opacity: Tokens.opacity,
  typography: {
    sizes: Tokens.fontSizes,
    weights: Tokens.fontWeights,
    lineHeights: Tokens.lineHeights,
  },
  borderRadius: Tokens.radii,
  shadows: defaultShadows,
  brand: Tokens.brandColors,
};

export const nativeLightTheme: NativeTheme = {
  ...baseTheme,
  colors: {
    ...Tokens.lightColors,
    card: Tokens.lightColors.card,
    chartPalette: Tokens.chartPaletteLight,
  },
};

export const nativeDarkTheme: NativeTheme = {
  ...baseTheme,
  colors: {
    ...Tokens.darkColors,
    card: Tokens.darkColors.card,
    chartPalette: Tokens.chartPaletteDark,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// THEME PRESETS
// ─────────────────────────────────────────────────────────────────────────────

export const nativeThemePresets = {
  light: nativeLightTheme,
  dark: nativeDarkTheme,
  ocean: {
    ...nativeLightTheme,
    colors: {
      ...nativeLightTheme.colors,
      primary: '#0891B2',
      primaryLight: '#38BDF8',
      primaryDark: '#0E7490',
      secondary: '#0D9488',
      secondaryLight: '#14B8A6',
      secondaryDark: '#0F766E',
      surface: '#F0F9FF',
      borderFocus: '#0891B2',
      tabIconSelected: '#0891B2',
      chartPrimary: '#0891B2',
      chartSecondary: '#0D9488',
      info: '#0891B2',
      chartPalette: Tokens.presetChartPalettes.ocean,
    },
  },
  forest: {
    ...nativeLightTheme,
    colors: {
      ...nativeLightTheme.colors,
      primary: '#059669',
      primaryLight: '#10B981',
      primaryDark: '#047857',
      secondary: '#7C2D12',
      secondaryLight: '#A3511A',
      secondaryDark: '#92400E',
      surface: '#F0FDF4',
      borderFocus: '#059669',
      tabIconSelected: '#059669',
      chartPrimary: '#059669',
      chartSecondary: '#7C2D12',
      info: '#059669',
      chartPalette: Tokens.presetChartPalettes.forest,
    },
  },
  sunset: {
    ...nativeLightTheme,
    colors: {
      ...nativeLightTheme.colors,
      primary: '#EA580C',
      primaryLight: '#FB7C37',
      primaryDark: '#C2410C',
      secondary: '#7C3AED',
      secondaryLight: '#8B5CF6',
      secondaryDark: '#6D28D9',
      surface: '#FFFBEB',
      borderFocus: '#EA580C',
      tabIconSelected: '#EA580C',
      chartPrimary: '#EA580C',
      chartSecondary: '#7C3AED',
      info: '#EA580C',
      chartPalette: Tokens.presetChartPalettes.sunset,
    },
  },
} as const;

export type NativeThemePreset = keyof typeof nativeThemePresets;

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE RE-EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

// Re-export token primitives (create new objects to avoid Metro bundler issues with frozen objects)
export const accentColors = Tokens.accentColors;
export const brandColors = Tokens.brandColors;
export const brandShades = Tokens.brandShades;
export const chartPaletteDark = [...Tokens.chartPaletteDark];
export const chartPaletteLight = [...Tokens.chartPaletteLight];
export const darkColors = Tokens.darkColors;
export const fontSizes = { ...Tokens.fontSizes };
export const fontWeights = { ...Tokens.fontWeights };
export const insightColors = Tokens.insightColors;
export const insightGradients = Tokens.insightGradients;
export const lightColors = Tokens.lightColors;
export const lineHeights = { ...Tokens.lineHeights };
export const macroColors = Tokens.macroColors;
export const opacity = { ...Tokens.opacity };
export const presetChartPalettes = Tokens.presetChartPalettes;
export const radii = { ...Tokens.radii };
export const roleBadgeColors = Tokens.roleBadgeColors;
export const sleepColors = Tokens.sleepColors;
export const spacing = { ...Tokens.spacing };

