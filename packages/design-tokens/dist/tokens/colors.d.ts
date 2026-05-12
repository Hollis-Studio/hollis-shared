/**
 * @ai-context Design tokens: Semantic color system
 *
 * Light and dark theme color mappings built on brand foundation.
 * All UI should reference these semantic tokens, not raw hex values.
 */
export declare const accentColors: {
    /** Success - Muted Sage Green */
    readonly sage: {
        readonly light: "#E8F0E8";
        readonly DEFAULT: "#A8C5A8";
        readonly dark: "#5A7A5A";
    };
    /** Error/Danger - Solid Pastel Red */
    readonly rose: {
        readonly light: "#FEE2E2";
        readonly DEFAULT: "#F87171";
        readonly dark: "#EF4444";
    };
    /** Warning - Muted Amber/Terracotta */
    readonly amber: {
        readonly light: "#F5EDE6";
        readonly DEFAULT: "#D4B896";
        readonly dark: "#8B6914";
    };
    /** Info - Soft Periwinkle */
    readonly periwinkle: {
        readonly light: "#E8EBF5";
        readonly DEFAULT: "#A5B4D4";
        readonly dark: "#5A6A8B";
    };
    /** Neutral - Warm Gray */
    readonly warmGray: {
        readonly light: "#F5F3F1";
        readonly DEFAULT: "#C4BFB9";
        readonly dark: "#6B6560";
    };
    /** Indigo/Purple - Muted Lavender */
    readonly lavender: {
        readonly light: "#F0EAF5";
        readonly DEFAULT: "#B7A5D4";
        readonly dark: "#6A5A8B";
    };
};
export declare const roleBadgeColors: {
    readonly admin: {
        readonly color: "#7C3AED";
        readonly bg: "#EDE9FE";
    };
    readonly clinician: {
        readonly color: "#059669";
        readonly bg: "#D1FAE5";
    };
    readonly trainer: {
        readonly color: "#F59E0B";
        readonly bg: "#FEF3C7";
    };
    readonly client: {
        readonly color: "#2563EB";
        readonly bg: "#DBEAFE";
    };
    readonly default: {
        readonly color: "#6B7280";
        readonly bg: "#F3F4F6";
    };
};
/**
 * Trend indicator colors for dashboards and metric displays.
 * Used for showing improving/declining/stable states.
 */
export declare const trendColors: {
    readonly light: {
        readonly improving: "#16a34a";
        readonly improvingBg: "#dcfce7";
        readonly declining: "#ef4444";
        readonly decliningBg: "#fee2e2";
        readonly stable: "#eab308";
        readonly stableBg: "#fef9c3";
    };
    readonly dark: {
        readonly improving: "#22c55e";
        readonly improvingBg: "rgba(34, 197, 94, 0.15)";
        readonly declining: "#f87171";
        readonly decliningBg: "rgba(248, 113, 113, 0.15)";
        readonly stable: "#facc15";
        readonly stableBg: "rgba(250, 204, 21, 0.15)";
    };
};
/**
 * Strategy status colors for cards and list items.
 * Maps to StrategyStatus contract values.
 */
export declare const strategyStatusColors: {
    readonly light: {
        readonly active: {
            readonly color: "#16a34a";
            readonly bg: "#dcfce7";
        };
        readonly completed: {
            readonly color: "#2563eb";
            readonly bg: "#dbeafe";
        };
        readonly paused: {
            readonly color: "#ca8a04";
            readonly bg: "#fef9c3";
        };
        readonly draft: {
            readonly color: "#6b7280";
            readonly bg: "#f3f4f6";
        };
        readonly archived: {
            readonly color: "#9ca3af";
            readonly bg: "#f3f4f6";
        };
    };
    readonly dark: {
        readonly active: {
            readonly color: "#22c55e";
            readonly bg: "rgba(34, 197, 94, 0.15)";
        };
        readonly completed: {
            readonly color: "#3b82f6";
            readonly bg: "rgba(59, 130, 246, 0.15)";
        };
        readonly paused: {
            readonly color: "#eab308";
            readonly bg: "rgba(234, 179, 8, 0.15)";
        };
        readonly draft: {
            readonly color: "#9ca3af";
            readonly bg: "rgba(156, 163, 175, 0.15)";
        };
        readonly archived: {
            readonly color: "#6b7280";
            readonly bg: "rgba(107, 114, 128, 0.15)";
        };
    };
};
/**
 * Goal progress colors (traffic light pattern).
 * For progress bars, completion indicators, and goal status.
 */
export declare const goalProgressColors: {
    readonly light: {
        readonly onTrack: "#16a34a";
        readonly onTrackBg: "#dcfce7";
        readonly atRisk: "#eab308";
        readonly atRiskBg: "#fef9c3";
        readonly offTrack: "#ef4444";
        readonly offTrackBg: "#fee2e2";
    };
    readonly dark: {
        readonly onTrack: "#22c55e";
        readonly onTrackBg: "rgba(34, 197, 94, 0.15)";
        readonly atRisk: "#facc15";
        readonly atRiskBg: "rgba(250, 204, 21, 0.15)";
        readonly offTrack: "#f87171";
        readonly offTrackBg: "rgba(248, 113, 113, 0.15)";
    };
};
export type TrendStatus = keyof typeof trendColors.light;
export type StrategyStatusKey = keyof typeof strategyStatusColors.light;
export type GoalProgressStatus = keyof typeof goalProgressColors.light;
export declare const lightColors: {
    readonly primary: "#01314A";
    readonly primaryLight: "#93B3CD";
    readonly primaryDark: "#001F30";
    readonly secondary: "#C6B2A1";
    readonly secondaryLight: "#DBC7B6";
    readonly secondaryDark: "#A89485";
    readonly background: "#F0F2F5";
    readonly surface: "#E8EAED";
    readonly surfaceElevated: "#FFFFFF";
    readonly card: "#FFFFFF";
    readonly text: "#01314A";
    readonly textSecondary: "#374151";
    readonly textTertiary: "#4B5563";
    readonly textMuted: "#6B7280";
    readonly textInverse: "#FCFCFC";
    readonly border: "#D1D5DB";
    readonly borderLight: "#E5E7EB";
    readonly borderSubtle: "#F1F5F9";
    readonly borderFocus: "#01314A";
    readonly success: "#A8C5A8";
    readonly successLight: "#E8F0E8";
    readonly successDark: "#5A7A5A";
    readonly error: "#F87171";
    readonly errorLight: "#FEE2E2";
    readonly errorDark: "#EF4444";
    readonly warning: "#D4B896";
    readonly warningLight: "#F5EDE6";
    readonly warningDark: "#8B6914";
    readonly info: "#A5B4D4";
    readonly infoLight: "#E8EBF5";
    readonly infoDark: "#5A6A8B";
    readonly hover: "rgba(1, 49, 74, 0.04)";
    readonly active: "rgba(1, 49, 74, 0.08)";
    readonly focus: "rgba(147, 179, 205, 0.3)";
    readonly disabled: "#E2E8F0";
    readonly inputBackground: "#FFFFFF";
    readonly inputBorder: "#9CA3AF";
    readonly inputText: "#01314A";
    readonly inputPlaceholder: "#6B7280";
    readonly tabBarBackground: "#FFFFFF";
    readonly tabBarBorder: "#D1D5DB";
    readonly tabIconDefault: "#6B7280";
    readonly tabIconSelected: "#01314A";
    readonly headerBackground: "#FFFFFF";
    readonly headerText: "#01314A";
    readonly modalBackground: "#FFFFFF";
    readonly modalOverlay: "rgba(0, 0, 0, 0.5)";
    readonly icon: "#6B7280";
    readonly iconMuted: "#9CA3AF";
    readonly chartPrimary: "#01314A";
    readonly chartSecondary: "#93B3CD";
    readonly chartTertiary: "#C6B2A1";
    readonly chartGrid: "#D1D5DB";
};
export declare const darkColors: {
    readonly primary: "#93B3CD";
    readonly primaryLight: "#B0D0EA";
    readonly primaryDark: "#7090AA";
    readonly secondary: "#C6B2A1";
    readonly secondaryLight: "#DBC7B6";
    readonly secondaryDark: "#A89485";
    readonly background: "#18181B";
    readonly surface: "#242428";
    readonly surfaceElevated: "#2E2E34";
    readonly card: "#242428";
    readonly text: "#FCFCFC";
    readonly textSecondary: "#93B3CD";
    readonly textTertiary: "#C6B2A1";
    readonly textMuted: "#5A7A90";
    readonly textInverse: "#01314A";
    readonly border: "#333340";
    readonly borderLight: "#3A3A48";
    readonly borderSubtle: "#28282E";
    readonly borderFocus: "#93B3CD";
    readonly success: "#4CAF50";
    readonly successLight: "rgba(76, 175, 80, 0.15)";
    readonly successDark: "#2E7D32";
    readonly error: "#F44336";
    readonly errorLight: "rgba(244, 67, 54, 0.15)";
    readonly errorDark: "#D32F2F";
    readonly warning: "#FF9800";
    readonly warningLight: "rgba(255, 152, 0, 0.15)";
    readonly warningDark: "#F57C00";
    readonly info: "#93B3CD";
    readonly infoLight: "rgba(147, 179, 205, 0.15)";
    readonly infoDark: "#7090AA";
    readonly hover: "rgba(147, 179, 205, 0.08)";
    readonly active: "rgba(147, 179, 205, 0.15)";
    readonly focus: "rgba(147, 179, 205, 0.3)";
    readonly disabled: "#1A4A63";
    readonly inputBackground: "#0F0F12";
    readonly inputBorder: "#3A3A48";
    readonly inputText: "#FCFCFC";
    readonly inputPlaceholder: "#5A7A90";
    readonly tabBarBackground: "#18181B";
    readonly tabBarBorder: "#333340";
    readonly tabIconDefault: "#7A7A90";
    readonly tabIconSelected: "#93B3CD";
    readonly headerBackground: "#18181B";
    readonly headerText: "#FCFCFC";
    readonly modalBackground: "#242428";
    readonly modalOverlay: "rgba(0, 0, 0, 0.8)";
    readonly icon: "#C0C0C0";
    readonly iconMuted: "#8B8B8B";
    readonly chartPrimary: "#93B3CD";
    readonly chartSecondary: "#C6B2A1";
    readonly chartTertiary: "#FF6B6B";
    readonly chartGrid: "#1A4A63";
};
export type SemanticColor = keyof typeof lightColors;
export type AccentColor = keyof typeof accentColors;
//# sourceMappingURL=colors.d.ts.map