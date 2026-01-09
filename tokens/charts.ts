/**
 * @ai-context Design tokens: Chart color palettes
 *
 * Harmonious, accessible color palettes for data visualization.
 * Colors chosen for distinctiveness and colorblind-friendliness.
 */

import { brandColors } from './brand';

/** Light mode chart palette - darker values for contrast on light backgrounds */
export const chartPaletteLight = [
  brandColors.navy,     // Brand Dark Blue - Weight, primary metrics
  '#2E7D32',            // Forest Green - Recovery, positive metrics
  '#5E35B1',            // Deep Purple - Sleep metrics
  brandColors.tan,      // Brand Beige - Caloric balance
  '#E64A19',            // Deep Orange - Heart rate
  '#00838F',            // Cyan - HRV
  '#6D4C41',            // Brown - Body composition
  '#455A64',            // Blue Grey - Secondary metrics
] as const;

/** Dark mode chart palette - brighter values for visibility on dark backgrounds */
export const chartPaletteDark = [
  brandColors.lightBlue, // Brand Light Blue - Weight, primary metrics
  '#66BB6A',             // Light Green - Recovery, positive metrics
  '#9575CD',             // Light Purple - Sleep metrics
  '#FFAB91',             // Light Orange - Caloric balance
  '#EF5350',             // Light Red - Heart rate
  '#4DD0E1',             // Light Cyan - HRV
  '#A1887F',             // Light Brown - Body composition
  '#90A4AE',             // Light Blue Grey - Secondary metrics
] as const;

/** Sleep stage colors */
export const sleepColors = {
  light: {
    deep: '#5856D6',
    light: '#3B82F6',
    rem: '#AF52DE',
    awake: '#F97316',
  },
  dark: {
    deep: '#5E5CE6',
    light: brandColors.lightBlue,
    rem: '#BF5AF2',
    awake: '#FF9F0A',
  },
} as const;

/** Health insight indicator colors */
export const insightColors = {
  light: {
    positive: '#10B981',
    positiveSecondary: '#059669',
    moderate: '#F59E0B',
    moderateSecondary: '#D97706',
    caution: '#EF4444',
    cautionSecondary: '#DC2626',
    neutral: '#3B82F6',
    neutralSecondary: '#2563EB',
    accent: '#AF52DE',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
  },
  dark: {
    positive: '#4CAF50',
    positiveSecondary: '#2E7D32',
    moderate: '#FF9800',
    moderateSecondary: '#F57C00',
    caution: '#F44336',
    cautionSecondary: '#D32F2F',
    neutral: brandColors.lightBlue,
    neutralSecondary: '#60A5FA',
    accent: '#BF5AF2',
    gradientStart: brandColors.lightBlue,
    gradientEnd: '#4ECDC4',
  },
} as const;

/** Macronutrient display colors for nutrition screens */
export const macroColors = {
  /** Protein - vibrant purple */
  protein: '#9333EA',
  /** Carbohydrates - emerald green */
  carbs: '#059669',
  /** Fat - warm amber */
  fat: '#D97706',
} as const;

/** Gradient backgrounds for insight cards */
export const insightGradients = {
  light: {
    positive: ['#ECFDF5', '#D1FAE5', '#A7F3D0'],
    moderate: ['#FFFBEB', '#FEF3C7', '#FDE68A'],
    caution: ['#FEF2F2', '#FECACA', '#FCA5A5'],
    neutral: ['#EFF6FF', '#DBEAFE', '#BFDBFE'],
    accent: '#F3E8FF',
  },
  dark: {
    positive: ['rgba(76, 175, 80, 0.1)', 'rgba(76, 175, 80, 0.15)', 'rgba(76, 175, 80, 0.2)'],
    moderate: ['rgba(255, 152, 0, 0.1)', 'rgba(255, 152, 0, 0.15)', 'rgba(255, 152, 0, 0.2)'],
    caution: ['rgba(244, 67, 54, 0.1)', 'rgba(244, 67, 54, 0.15)', 'rgba(244, 67, 54, 0.2)'],
    neutral: ['rgba(64, 158, 255, 0.1)', 'rgba(64, 158, 255, 0.15)', 'rgba(64, 158, 255, 0.2)'],
    accent: 'rgba(191, 90, 242, 0.1)',
  },
} as const;

/** Theme preset chart palettes */
export const presetChartPalettes = {
  ocean: [
    '#0891B2', // Ocean Blue
    '#0D9488', // Teal
    '#0369A1', // Dark Blue
    '#059669', // Emerald
    '#7C3AED', // Violet
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#64748B', // Slate
  ],
  forest: [
    '#059669', // Forest Green
    '#7C2D12', // Earth Brown
    '#0D9488', // Teal
    '#B45309', // Amber Dark
    '#7C3AED', // Violet
    '#0284C7', // Sky Blue
    '#C026D3', // Fuchsia
    '#475569', // Slate
  ],
  sunset: [
    '#EA580C', // Sunset Orange
    '#7C3AED', // Purple
    '#DC2626', // Red
    '#CA8A04', // Yellow
    '#0891B2', // Cyan
    '#059669', // Emerald
    '#DB2777', // Pink
    '#6B7280', // Gray
  ],
} as const;

export type ChartPalette = readonly string[];
