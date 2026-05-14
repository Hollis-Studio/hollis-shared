/**
 * @ai-context Design tokens: Semantic color system
 *
 * Light and dark theme color mappings built on brand foundation.
 * All UI should reference these semantic tokens, not raw hex values.
 */
export declare const accentColors: {
    /** Success - Muted Sage Green */
    readonly sage: {
        readonly light: "#D5E5D5";
        readonly DEFAULT: "#A8C5A8";
        readonly dark: "#5A7A5A";
    };
    /**
     * Destructive - Desaturated Dusty Rose
     * Reserved for true destructive admin actions (irreversible delete).
     * For client states or "needs attention", use `amber`, not `rose`.
     * Reduced from Tailwind red-400 (78% saturation) to dusty terracotta
     * (~30% saturation) so it sits inside the muted brand palette.
     */
    readonly rose: {
        readonly light: "#ECDAD7";
        readonly DEFAULT: "#C99B96";
        readonly dark: "#A77971";
    };
    /** Warning - Muted Amber/Terracotta */
    readonly amber: {
        readonly light: "#EADFD0";
        readonly DEFAULT: "#D4B896";
        readonly dark: "#8B6914";
    };
    /** Info - Soft Periwinkle */
    readonly periwinkle: {
        readonly light: "#D5DCEF";
        readonly DEFAULT: "#A5B4D4";
        readonly dark: "#5A6A8B";
    };
    /** Neutral - Warm Gray */
    readonly warmGray: {
        readonly light: "#E8E3DD";
        readonly DEFAULT: "#C4BFB9";
        readonly dark: "#6B6560";
    };
    /** Indigo/Purple - Muted Lavender */
    readonly lavender: {
        readonly light: "#DDD2EA";
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
        readonly improving: "#5A7A5A";
        readonly improvingBg: "#D5E5D5";
        readonly declining: "#8B6914";
        readonly decliningBg: "#EADFD0";
        readonly stable: "#5A6A8B";
        readonly stableBg: "#D5DCEF";
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
            readonly color: "#5A7A5A";
            readonly bg: "#D5E5D5";
        };
        readonly completed: {
            readonly color: "#01314A";
            readonly bg: "#D5DCEF";
        };
        readonly paused: {
            readonly color: "#6B6560";
            readonly bg: "#E8E3DD";
        };
        readonly draft: {
            readonly color: "#6B6560";
            readonly bg: "#E8E3DD";
        };
        readonly archived: {
            readonly color: "#6B6560";
            readonly bg: "#E8E3DD";
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
        readonly onTrack: "#5A7A5A";
        readonly onTrackBg: "#D5E5D5";
        readonly atRisk: "#8B6914";
        readonly atRiskBg: "#EADFD0";
        readonly offTrack: "#8B6914";
        readonly offTrackBg: "#EADFD0";
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
    readonly background: "#F4F0EB";
    readonly surface: "#EBE6DF";
    readonly surfaceElevated: "#FFFFFF";
    readonly card: "#FFFFFF";
    readonly text: "#01314A";
    readonly textSecondary: "rgba(1, 49, 74, 0.78)";
    readonly textTertiary: "rgba(1, 49, 74, 0.58)";
    readonly textMuted: "rgba(1, 49, 74, 0.42)";
    readonly textInverse: "#FCFCFC";
    readonly border: "rgba(1, 49, 74, 0.14)";
    readonly borderLight: "rgba(1, 49, 74, 0.08)";
    readonly borderSubtle: "rgba(1, 49, 74, 0.04)";
    readonly borderFocus: "#01314A";
    readonly success: "#A8C5A8";
    readonly successLight: "#D5E5D5";
    readonly successDark: "#5A7A5A";
    readonly error: "#C99B96";
    readonly errorLight: "#ECDAD7";
    readonly errorDark: "#A77971";
    readonly warning: "#D4B896";
    readonly warningLight: "#EADFD0";
    readonly warningDark: "#8B6914";
    readonly info: "#A5B4D4";
    readonly infoLight: "#D5DCEF";
    readonly infoDark: "#5A6A8B";
    readonly hover: "rgba(1, 49, 74, 0.06)";
    readonly active: "rgba(1, 49, 74, 0.12)";
    readonly focus: "rgba(147, 179, 205, 0.35)";
    readonly disabled: "#E2E8F0";
    readonly inputBackground: "#F4F0EB";
    readonly inputBorder: "rgba(1, 49, 74, 0.20)";
    readonly inputText: "#01314A";
    readonly inputPlaceholder: "rgba(1, 49, 74, 0.45)";
    readonly tabBarBackground: "#FFFFFF";
    readonly tabBarBorder: "rgba(1, 49, 74, 0.14)";
    readonly tabIconDefault: "rgba(1, 49, 74, 0.55)";
    readonly tabIconSelected: "#01314A";
    readonly headerBackground: "#FFFFFF";
    readonly headerText: "#01314A";
    readonly modalBackground: "#FFFFFF";
    readonly modalOverlay: "rgba(1, 49, 74, 0.55)";
    readonly icon: "rgba(1, 49, 74, 0.55)";
    readonly iconMuted: "rgba(1, 49, 74, 0.35)";
    readonly chartPrimary: "#01314A";
    readonly chartSecondary: "#93B3CD";
    readonly chartTertiary: "#C6B2A1";
    readonly chartGrid: "rgba(1, 49, 74, 0.14)";
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