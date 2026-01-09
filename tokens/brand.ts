/**
 * @ai-context Design tokens: Brand foundation colors
 *
 * HOLLIS HEALTH OFFICIAL BRAND COLORS
 * Do not modify without brand approval.
 */

export const brandColors = {
  /** Primary brand color - headers, text, primary actions */
  navy: '#01314A',
  /** Primary background - clean, minimal */
  offWhite: '#FCFCFC',
  /** Secondary accent - warm, approachable */
  tan: '#C6B2A1',
  /** Tertiary accent - soft, professional */
  lightBlue: '#93B3CD',
} as const;

/** Common utility colors - use sparingly, prefer semantic tokens */
export const commonColors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

/** Derived brand shades */
export const brandShades = {
  navy: {
    DEFAULT: brandColors.navy,
    light: brandColors.lightBlue,
    dark: '#001F30',
    50: '#E8EDF0',
    100: '#C5D4DD',
    200: '#9FB9C9',
    300: '#799EB5',
    400: '#5C8AA6',
    500: '#3F7697',
    600: '#366889',
    700: '#2B5575',
    800: '#224462',
    900: '#142A3D',
    950: brandColors.navy,
  },
  tan: {
    DEFAULT: brandColors.tan,
    light: '#DBC7B6',
    dark: '#A89485',
    50: '#FAF8F6',
    100: '#F2EDE9',
    200: '#E8E0D8',
    300: '#DBC7B6',
    400: brandColors.tan,
    500: '#B5A08F',
    600: '#A89485',
    700: '#8E7A6B',
    800: '#756456',
    900: '#5C4F44',
  },
  lightBlue: {
    DEFAULT: brandColors.lightBlue,
    light: '#B0D0EA',
    dark: '#7090AA',
    50: '#F0F5FA',
    100: '#E0EBF5',
    200: '#C5DAEA',
    300: '#B0D0EA',
    400: brandColors.lightBlue,
    500: '#7090AA',
    600: '#5A7A94',
    700: '#4A6378',
    800: '#3A4D5C',
    900: '#2A3740',
  },
} as const;

export type BrandColor = keyof typeof brandColors;
export type BrandShade = keyof typeof brandShades;
