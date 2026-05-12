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
        light: "#E8F0E8",
        DEFAULT: "#A8C5A8",
        dark: "#5A7A5A",
    },
    /** Error/Danger - Solid Pastel Red */
    rose: {
        light: "#FEE2E2",
        DEFAULT: "#F87171",
        dark: "#EF4444",
    },
    /** Warning - Muted Amber/Terracotta */
    amber: {
        light: "#F5EDE6",
        DEFAULT: "#D4B896",
        dark: "#8B6914",
    },
    /** Info - Soft Periwinkle */
    periwinkle: {
        light: "#E8EBF5",
        DEFAULT: "#A5B4D4",
        dark: "#5A6A8B",
    },
    /** Neutral - Warm Gray */
    warmGray: {
        light: "#F5F3F1",
        DEFAULT: "#C4BFB9",
        dark: "#6B6560",
    },
    /** Indigo/Purple - Muted Lavender */
    lavender: {
        light: "#F0EAF5",
        DEFAULT: "#B7A5D4",
        dark: "#6A5A8B",
    },
};
// ─────────────────────────────────────────────────────────────────────────────
// ROLE BADGE COLORS (for user role indicators in messaging/UI)
// ─────────────────────────────────────────────────────────────────────────────
export const roleBadgeColors = {
    admin: { color: "#7C3AED", bg: "#EDE9FE" },
    clinician: { color: "#059669", bg: "#D1FAE5" },
    trainer: { color: "#F59E0B", bg: "#FEF3C7" },
    client: { color: "#2563EB", bg: "#DBEAFE" },
    default: { color: "#6B7280", bg: "#F3F4F6" },
};
// ─────────────────────────────────────────────────────────────────────────────
// STATUS COLORS (for trends, progress indicators, strategy states)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Trend indicator colors for dashboards and metric displays.
 * Used for showing improving/declining/stable states.
 */
export const trendColors = {
    light: {
        improving: "#16a34a",
        improvingBg: "#dcfce7",
        declining: "#ef4444",
        decliningBg: "#fee2e2",
        stable: "#eab308",
        stableBg: "#fef9c3",
    },
    dark: {
        improving: "#22c55e",
        improvingBg: "rgba(34, 197, 94, 0.15)",
        declining: "#f87171",
        decliningBg: "rgba(248, 113, 113, 0.15)",
        stable: "#facc15",
        stableBg: "rgba(250, 204, 21, 0.15)",
    },
};
/**
 * Strategy status colors for cards and list items.
 * Maps to StrategyStatus contract values.
 */
export const strategyStatusColors = {
    light: {
        active: { color: "#16a34a", bg: "#dcfce7" },
        completed: { color: "#2563eb", bg: "#dbeafe" },
        paused: { color: "#ca8a04", bg: "#fef9c3" },
        draft: { color: "#6b7280", bg: "#f3f4f6" },
        archived: { color: "#9ca3af", bg: "#f3f4f6" },
    },
    dark: {
        active: { color: "#22c55e", bg: "rgba(34, 197, 94, 0.15)" },
        completed: { color: "#3b82f6", bg: "rgba(59, 130, 246, 0.15)" },
        paused: { color: "#eab308", bg: "rgba(234, 179, 8, 0.15)" },
        draft: { color: "#9ca3af", bg: "rgba(156, 163, 175, 0.15)" },
        archived: { color: "#6b7280", bg: "rgba(107, 114, 128, 0.15)" },
    },
};
/**
 * Goal progress colors (traffic light pattern).
 * For progress bars, completion indicators, and goal status.
 */
export const goalProgressColors = {
    light: {
        onTrack: "#16a34a",
        onTrackBg: "#dcfce7",
        atRisk: "#eab308",
        atRiskBg: "#fef9c3",
        offTrack: "#ef4444",
        offTrackBg: "#fee2e2",
    },
    dark: {
        onTrack: "#22c55e",
        onTrackBg: "rgba(34, 197, 94, 0.15)",
        atRisk: "#facc15",
        atRiskBg: "rgba(250, 204, 21, 0.15)",
        offTrack: "#f87171",
        offTrackBg: "rgba(248, 113, 113, 0.15)",
    },
};
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
    // Surfaces
    background: "#F0F2F5",
    surface: "#E8EAED",
    surfaceElevated: "#FFFFFF",
    card: "#FFFFFF",
    // Text hierarchy
    text: brandColors.navy,
    textSecondary: "#374151",
    textTertiary: "#4B5563",
    textMuted: "#6B7280",
    textInverse: brandColors.offWhite,
    // Borders
    border: "#D1D5DB",
    borderLight: "#E5E7EB",
    borderSubtle: "#F1F5F9",
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
    // Interactive states
    hover: "rgba(1, 49, 74, 0.04)",
    active: "rgba(1, 49, 74, 0.08)",
    focus: "rgba(147, 179, 205, 0.3)",
    disabled: "#E2E8F0",
    // Inputs
    inputBackground: "#FFFFFF",
    inputBorder: "#9CA3AF",
    inputText: brandColors.navy,
    inputPlaceholder: "#6B7280",
    // Navigation
    tabBarBackground: "#FFFFFF",
    tabBarBorder: "#D1D5DB",
    tabIconDefault: "#6B7280",
    tabIconSelected: brandColors.navy,
    headerBackground: "#FFFFFF",
    headerText: brandColors.navy,
    // Modal/Overlay
    modalBackground: "#FFFFFF",
    modalOverlay: "rgba(0, 0, 0, 0.5)",
    // Icons
    icon: "#6B7280",
    iconMuted: "#9CA3AF",
    // Charts
    chartPrimary: brandColors.navy,
    chartSecondary: brandColors.lightBlue,
    chartTertiary: brandColors.tan,
    chartGrid: "#D1D5DB",
};
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
};
//# sourceMappingURL=colors.js.map