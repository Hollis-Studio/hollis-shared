/**
 * @ai-context Design tokens: Semantic color system
 *
 * Light and dark theme color mappings built on brand foundation.
 * All UI should reference these semantic tokens, not raw hex values.
 */

import { brandColors, brandShades } from "./brand.js";

// ─────────────────────────────────────────────────────────────────────────────
// ACCENT PALETTE (Warm-leaning pastels that complement brand)
// ─────────────────────────────────────────────────────────────────────────────

export const accentColors = {
  /** Success - Muted Sage Green */
  sage: {
    light: "#D5E5D5",
    DEFAULT: "#A8C5A8",
    dark: "#5A7A5A",
  },
  /**
   * Destructive - Desaturated Dusty Rose
   * Reserved for true destructive admin actions (irreversible delete).
   * For client states or "needs attention", use `amber`, not `rose`.
   * Reduced from Tailwind red-400 (78% saturation) to dusty terracotta
   * (~30% saturation) so it sits inside the muted brand palette.
   */
  rose: {
    light: "#ECDAD7",
    DEFAULT: "#C99B96",
    dark: "#A77971",
  },
  /** Warning - Muted Amber/Terracotta */
  amber: {
    light: "#EADFD0",
    DEFAULT: "#D4B896",
    dark: "#8B6914",
  },
  /** Info - Soft Periwinkle */
  periwinkle: {
    light: "#D5DCEF",
    DEFAULT: "#A5B4D4",
    dark: "#5A6A8B",
  },
  /** Neutral - Warm Gray */
  warmGray: {
    light: "#E8E3DD",
    DEFAULT: "#C4BFB9",
    dark: "#6B6560",
  },
  /** Indigo/Purple - Muted Lavender */
  lavender: {
    light: "#DDD2EA",
    DEFAULT: "#B7A5D4",
    dark: "#6A5A8B",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ROLE BADGE COLORS (for user role indicators in messaging/UI)
// ─────────────────────────────────────────────────────────────────────────────

export const roleBadgeColors = {
  admin: { color: "#7C3AED", bg: "#EDE9FE" },
  clinician: { color: "#059669", bg: "#D1FAE5" },
  trainer: { color: "#F59E0B", bg: "#FEF3C7" },
  client: { color: "#2563EB", bg: "#DBEAFE" },
  default: { color: "#6B7280", bg: "#F3F4F6" },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// STATUS COLORS (for trends, progress indicators, strategy states)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Trend indicator colors for dashboards and metric displays.
 * Used for showing improving/declining/stable states.
 */
export const trendColors = {
  light: {
    improving: "#5A7A5A",
    improvingBg: "#D5E5D5",
    declining: "#8B6914",
    decliningBg: "#EADFD0",
    stable: "#5A6A8B",
    stableBg: "#D5DCEF",
  },
  dark: {
    improving: "#22c55e",
    improvingBg: "rgba(34, 197, 94, 0.15)",
    declining: "#f87171",
    decliningBg: "rgba(248, 113, 113, 0.15)",
    stable: "#facc15",
    stableBg: "rgba(250, 204, 21, 0.15)",
  },
} as const;

/**
 * Strategy status colors for cards and list items.
 * Maps to StrategyStatus contract values.
 */
export const strategyStatusColors = {
  light: {
    active: { color: "#5A7A5A", bg: "#D5E5D5" },
    completed: { color: "#01314A", bg: "#D5DCEF" },
    paused: { color: "#6B6560", bg: "#E8E3DD" },
    draft: { color: "#6B6560", bg: "#E8E3DD" },
    archived: { color: "#6B6560", bg: "#E8E3DD" },
  },
  dark: {
    active: { color: "#22c55e", bg: "rgba(34, 197, 94, 0.15)" },
    completed: { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
    paused: { color: "#eab308", bg: "rgba(234, 179, 8, 0.15)" },
    draft: { color: "#9ca3af", bg: "rgba(156, 163, 175, 0.15)" },
    archived: { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)" },
  },
} as const;

/**
 * Goal progress colors (traffic light pattern).
 * For progress bars, completion indicators, and goal status.
 */
export const goalProgressColors = {
  light: {
    onTrack: "#5A7A5A",
    onTrackBg: "#D5E5D5",
    atRisk: "#8B6914",
    atRiskBg: "#EADFD0",
    offTrack: "#8B6914",
    offTrackBg: "#EADFD0",
  },
  dark: {
    onTrack: "#22c55e",
    onTrackBg: "rgba(34, 197, 94, 0.15)",
    atRisk: "#facc15",
    atRiskBg: "rgba(250, 204, 21, 0.15)",
    offTrack: "#f87171",
    offTrackBg: "rgba(248, 113, 113, 0.15)",
  },
} as const;

export type TrendStatus = keyof typeof trendColors.light;
export type StrategyStatusKey = keyof typeof strategyStatusColors.light;
export type GoalProgressStatus = keyof typeof goalProgressColors.light;

// ─────────────────────────────────────────────────────────────────────────────
// LIGHT THEME COLORS
// ─────────────────────────────────────────────────────────────────────────────

export const lightColors = {
  // Brand Primary
  primary: brandColors.navy,
  primaryLight: brandColors.lightBlue,
  primaryDark: brandShades.navy.dark,

  // Brand Secondary (Accent)
  secondary: brandColors.tan,
  secondaryLight: brandShades.tan.light,
  secondaryDark: brandShades.tan.dark,

  // Surfaces — warmed background so white cards lift off the page
  background: "#F4F0EB",
  surface: "#EBE6DF",
  surfaceElevated: "#FFFFFF",
  card: "#FFFFFF",

  // Text hierarchy — navy at decreasing opacity for brand-cohesive ramp
  text: brandColors.navy,
  textSecondary: "rgba(1, 49, 74, 0.78)",
  textTertiary: "rgba(1, 49, 74, 0.58)",
  textMuted: "rgba(1, 49, 74, 0.42)",
  textInverse: brandColors.offWhite,

  // Borders — re-tinted from cool gray to brand navy at low opacity
  border: "rgba(1, 49, 74, 0.14)",
  borderLight: "rgba(1, 49, 74, 0.08)",
  borderSubtle: "rgba(1, 49, 74, 0.04)",
  borderFocus: brandColors.navy,

  // Semantic status
  success: accentColors.sage.DEFAULT,
  successLight: accentColors.sage.light,
  successDark: accentColors.sage.dark,

  error: accentColors.rose.DEFAULT,
  errorLight: accentColors.rose.light,
  errorDark: accentColors.rose.dark,

  warning: accentColors.amber.DEFAULT,
  warningLight: accentColors.amber.light,
  warningDark: accentColors.amber.dark,

  info: accentColors.periwinkle.DEFAULT,
  infoLight: accentColors.periwinkle.light,
  infoDark: accentColors.periwinkle.dark,

  // Interactive states — slightly stronger so hover/active read clearly
  hover: "rgba(1, 49, 74, 0.06)",
  active: "rgba(1, 49, 74, 0.12)",
  focus: "rgba(147, 179, 205, 0.35)",
  disabled: "#E2E8F0",

  // Inputs — sunken treatment: tinted bg, navy-tinted border
  inputBackground: "#F4F0EB",
  inputBorder: "rgba(1, 49, 74, 0.20)",
  inputText: brandColors.navy,
  inputPlaceholder: "rgba(1, 49, 74, 0.45)",

  // Navigation
  tabBarBackground: "#FFFFFF",
  tabBarBorder: "rgba(1, 49, 74, 0.14)",
  tabIconDefault: "rgba(1, 49, 74, 0.55)",
  tabIconSelected: brandColors.navy,

  headerBackground: "#FFFFFF",
  headerText: brandColors.navy,

  // Modal/Overlay — brand-tinted scrim instead of cold black
  modalBackground: "#FFFFFF",
  modalOverlay: "rgba(1, 49, 74, 0.55)",

  // Icons
  icon: "rgba(1, 49, 74, 0.55)",
  iconMuted: "rgba(1, 49, 74, 0.35)",

  // Charts
  chartPrimary: brandColors.navy,
  chartSecondary: brandColors.lightBlue,
  chartTertiary: brandColors.tan,
  chartGrid: "rgba(1, 49, 74, 0.14)",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DARK THEME COLORS
// ─────────────────────────────────────────────────────────────────────────────

export const darkColors = {
  // Brand Primary (inverted for dark mode)
  primary: brandColors.lightBlue,
  primaryLight: "#B0D0EA",
  primaryDark: "#7090AA",

  // Brand Secondary
  secondary: brandColors.tan,
  secondaryLight: brandShades.tan.light,
  secondaryDark: brandShades.tan.dark,

  // Surfaces (dark grey - neutral dark background)
  background: "#18181B",
  surface: "#242428",
  surfaceElevated: "#2E2E34",
  card: "#242428",

  // Text hierarchy
  text: brandColors.offWhite,
  textSecondary: brandColors.lightBlue,
  textTertiary: brandColors.tan,
  textMuted: "#5A7A90",
  textInverse: brandColors.navy,

  // Borders
  border: "#333340",
  borderLight: "#3A3A48",
  borderSubtle: "#28282E",
  borderFocus: brandColors.lightBlue,

  // Semantic status (brighter for dark backgrounds)
  success: "#4CAF50",
  successLight: "rgba(76, 175, 80, 0.15)",
  successDark: "#2E7D32",

  error: "#F44336",
  errorLight: "rgba(244, 67, 54, 0.15)",
  errorDark: "#D32F2F",

  warning: "#FF9800",
  warningLight: "rgba(255, 152, 0, 0.15)",
  warningDark: "#F57C00",

  info: brandColors.lightBlue,
  infoLight: "rgba(147, 179, 205, 0.15)",
  infoDark: "#7090AA",

  // Interactive states
  hover: "rgba(147, 179, 205, 0.08)",
  active: "rgba(147, 179, 205, 0.15)",
  focus: "rgba(147, 179, 205, 0.3)",
  disabled: "#1A4A63",

  // Inputs
  inputBackground: "#0F0F12",
  inputBorder: "#3A3A48",
  inputText: brandColors.offWhite,
  inputPlaceholder: "#5A7A90",

  // Navigation
  tabBarBackground: "#18181B",
  tabBarBorder: "#333340",
  tabIconDefault: "#7A7A90",
  tabIconSelected: brandColors.lightBlue,

  headerBackground: "#18181B",
  headerText: brandColors.offWhite,

  // Modal/Overlay
  modalBackground: "#242428",
  modalOverlay: "rgba(0, 0, 0, 0.8)",

  // Icons
  icon: "#C0C0C0",
  iconMuted: "#8B8B8B",

  // Charts
  chartPrimary: brandColors.lightBlue,
  chartSecondary: brandColors.tan,
  chartTertiary: "#FF6B6B",
  chartGrid: "#1A4A63",
} as const;

export type SemanticColor = keyof typeof lightColors;
export type AccentColor = keyof typeof accentColors;
