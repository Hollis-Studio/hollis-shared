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
import * as Tokens from '../tokens/index.js';
export type { GoalProgressStatus, StrategyStatusKey, TrendStatus } from '../tokens/index.js';
export declare const commonColors: {
    white: "#FFFFFF";
    black: "#000000";
    transparent: "transparent";
};
export declare const goalProgressColors: {
    light: {
        onTrack: "#16a34a";
        onTrackBg: "#dcfce7";
        atRisk: "#eab308";
        atRiskBg: "#fef9c3";
        offTrack: "#ef4444";
        offTrackBg: "#fee2e2";
    };
    dark: {
        onTrack: "#22c55e";
        onTrackBg: "rgba(34, 197, 94, 0.15)";
        atRisk: "#facc15";
        atRiskBg: "rgba(250, 204, 21, 0.15)";
        offTrack: "#f87171";
        offTrackBg: "rgba(248, 113, 113, 0.15)";
    };
};
export declare const strategyStatusColors: {
    light: {
        active: {
            readonly color: "#16a34a";
            readonly bg: "#dcfce7";
        };
        completed: {
            readonly color: "#2563eb";
            readonly bg: "#dbeafe";
        };
        paused: {
            readonly color: "#ca8a04";
            readonly bg: "#fef9c3";
        };
        draft: {
            readonly color: "#6b7280";
            readonly bg: "#f3f4f6";
        };
        archived: {
            readonly color: "#9ca3af";
            readonly bg: "#f3f4f6";
        };
    };
    dark: {
        active: {
            readonly color: "#22c55e";
            readonly bg: "rgba(34, 197, 94, 0.15)";
        };
        completed: {
            readonly color: "#3b82f6";
            readonly bg: "rgba(59, 130, 246, 0.15)";
        };
        paused: {
            readonly color: "#eab308";
            readonly bg: "rgba(234, 179, 8, 0.15)";
        };
        draft: {
            readonly color: "#9ca3af";
            readonly bg: "rgba(156, 163, 175, 0.15)";
        };
        archived: {
            readonly color: "#6b7280";
            readonly bg: "rgba(107, 114, 128, 0.15)";
        };
    };
};
export declare const trendColors: {
    light: {
        improving: "#16a34a";
        improvingBg: "#dcfce7";
        declining: "#ef4444";
        decliningBg: "#fee2e2";
        stable: "#eab308";
        stableBg: "#fef9c3";
    };
    dark: {
        improving: "#22c55e";
        improvingBg: "rgba(34, 197, 94, 0.15)";
        declining: "#f87171";
        decliningBg: "rgba(248, 113, 113, 0.15)";
        stable: "#facc15";
        stableBg: "rgba(250, 204, 21, 0.15)";
    };
};
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
    shadowOffset?: {
        width: number;
        height: number;
    };
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
export declare const shadowsIOS: {
    readonly sm: {
        readonly shadowColor: "#01314A";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 1;
        };
        readonly shadowOpacity: 0.08;
        readonly shadowRadius: 3;
    };
    readonly md: {
        readonly shadowColor: "#01314A";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 2;
        };
        readonly shadowOpacity: 0.12;
        readonly shadowRadius: 6;
    };
    readonly lg: {
        readonly shadowColor: "#01314A";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 4;
        };
        readonly shadowOpacity: 0.15;
        readonly shadowRadius: 10;
    };
    readonly xl: {
        readonly shadowColor: "#01314A";
        readonly shadowOffset: {
            readonly width: 0;
            readonly height: 6;
        };
        readonly shadowOpacity: 0.2;
        readonly shadowRadius: 16;
    };
};
export declare const shadowsAndroid: {
    readonly sm: {
        readonly elevation: 2;
    };
    readonly md: {
        readonly elevation: 4;
    };
    readonly lg: {
        readonly elevation: 8;
    };
    readonly xl: {
        readonly elevation: 16;
    };
};
export declare const nativeLightTheme: NativeTheme;
export declare const nativeDarkTheme: NativeTheme;
export declare const nativeThemePresets: {
    readonly light: NativeTheme;
    readonly dark: NativeTheme;
    readonly ocean: {
        readonly colors: {
            readonly primary: "#0891B2";
            readonly primaryLight: "#38BDF8";
            readonly primaryDark: "#0E7490";
            readonly secondary: "#0D9488";
            readonly secondaryLight: "#14B8A6";
            readonly secondaryDark: "#0F766E";
            readonly surface: "#F0F9FF";
            readonly borderFocus: "#0891B2";
            readonly tabIconSelected: "#0891B2";
            readonly chartPrimary: "#0891B2";
            readonly chartSecondary: "#0D9488";
            readonly info: "#0891B2";
            readonly chartPalette: readonly ["#0891B2", "#0D9488", "#0369A1", "#059669", "#7C3AED", "#EC4899", "#F59E0B", "#64748B"];
            readonly background: string;
            readonly surfaceElevated: string;
            readonly card: string;
            readonly text: string;
            readonly textSecondary: string;
            readonly textTertiary: string;
            readonly textMuted: string;
            readonly textInverse: string;
            readonly border: string;
            readonly borderLight: string;
            readonly borderSubtle: string;
            readonly success: string;
            readonly successLight: string;
            readonly successDark: string;
            readonly error: string;
            readonly errorLight: string;
            readonly errorDark: string;
            readonly warning: string;
            readonly warningLight: string;
            readonly warningDark: string;
            readonly infoLight: string;
            readonly infoDark: string;
            readonly hover: string;
            readonly active: string;
            readonly focus: string;
            readonly disabled: string;
            readonly inputBackground: string;
            readonly inputBorder: string;
            readonly inputText: string;
            readonly inputPlaceholder: string;
            readonly tabBarBackground: string;
            readonly tabBarBorder: string;
            readonly tabIconDefault: string;
            readonly headerBackground: string;
            readonly headerText: string;
            readonly modalBackground: string;
            readonly modalOverlay: string;
            readonly chartTertiary: string;
            readonly chartGrid: string;
        };
        readonly spacing: typeof Tokens.spacing;
        readonly opacity: typeof Tokens.opacity;
        readonly typography: {
            sizes: typeof Tokens.fontSizes;
            weights: typeof Tokens.fontWeights;
            lineHeights: typeof Tokens.lineHeights;
        };
        readonly borderRadius: typeof Tokens.radii;
        readonly shadows: {
            sm: NativeThemeShadow;
            md: NativeThemeShadow;
            lg: NativeThemeShadow;
            xl: NativeThemeShadow;
        };
        readonly brand: typeof Tokens.brandColors;
    };
    readonly forest: {
        readonly colors: {
            readonly primary: "#059669";
            readonly primaryLight: "#10B981";
            readonly primaryDark: "#047857";
            readonly secondary: "#7C2D12";
            readonly secondaryLight: "#A3511A";
            readonly secondaryDark: "#92400E";
            readonly surface: "#F0FDF4";
            readonly borderFocus: "#059669";
            readonly tabIconSelected: "#059669";
            readonly chartPrimary: "#059669";
            readonly chartSecondary: "#7C2D12";
            readonly info: "#059669";
            readonly chartPalette: readonly ["#059669", "#7C2D12", "#0D9488", "#B45309", "#7C3AED", "#0284C7", "#C026D3", "#475569"];
            readonly background: string;
            readonly surfaceElevated: string;
            readonly card: string;
            readonly text: string;
            readonly textSecondary: string;
            readonly textTertiary: string;
            readonly textMuted: string;
            readonly textInverse: string;
            readonly border: string;
            readonly borderLight: string;
            readonly borderSubtle: string;
            readonly success: string;
            readonly successLight: string;
            readonly successDark: string;
            readonly error: string;
            readonly errorLight: string;
            readonly errorDark: string;
            readonly warning: string;
            readonly warningLight: string;
            readonly warningDark: string;
            readonly infoLight: string;
            readonly infoDark: string;
            readonly hover: string;
            readonly active: string;
            readonly focus: string;
            readonly disabled: string;
            readonly inputBackground: string;
            readonly inputBorder: string;
            readonly inputText: string;
            readonly inputPlaceholder: string;
            readonly tabBarBackground: string;
            readonly tabBarBorder: string;
            readonly tabIconDefault: string;
            readonly headerBackground: string;
            readonly headerText: string;
            readonly modalBackground: string;
            readonly modalOverlay: string;
            readonly chartTertiary: string;
            readonly chartGrid: string;
        };
        readonly spacing: typeof Tokens.spacing;
        readonly opacity: typeof Tokens.opacity;
        readonly typography: {
            sizes: typeof Tokens.fontSizes;
            weights: typeof Tokens.fontWeights;
            lineHeights: typeof Tokens.lineHeights;
        };
        readonly borderRadius: typeof Tokens.radii;
        readonly shadows: {
            sm: NativeThemeShadow;
            md: NativeThemeShadow;
            lg: NativeThemeShadow;
            xl: NativeThemeShadow;
        };
        readonly brand: typeof Tokens.brandColors;
    };
    readonly sunset: {
        readonly colors: {
            readonly primary: "#EA580C";
            readonly primaryLight: "#FB7C37";
            readonly primaryDark: "#C2410C";
            readonly secondary: "#7C3AED";
            readonly secondaryLight: "#8B5CF6";
            readonly secondaryDark: "#6D28D9";
            readonly surface: "#FFFBEB";
            readonly borderFocus: "#EA580C";
            readonly tabIconSelected: "#EA580C";
            readonly chartPrimary: "#EA580C";
            readonly chartSecondary: "#7C3AED";
            readonly info: "#EA580C";
            readonly chartPalette: readonly ["#EA580C", "#7C3AED", "#DC2626", "#CA8A04", "#0891B2", "#059669", "#DB2777", "#6B7280"];
            readonly background: string;
            readonly surfaceElevated: string;
            readonly card: string;
            readonly text: string;
            readonly textSecondary: string;
            readonly textTertiary: string;
            readonly textMuted: string;
            readonly textInverse: string;
            readonly border: string;
            readonly borderLight: string;
            readonly borderSubtle: string;
            readonly success: string;
            readonly successLight: string;
            readonly successDark: string;
            readonly error: string;
            readonly errorLight: string;
            readonly errorDark: string;
            readonly warning: string;
            readonly warningLight: string;
            readonly warningDark: string;
            readonly infoLight: string;
            readonly infoDark: string;
            readonly hover: string;
            readonly active: string;
            readonly focus: string;
            readonly disabled: string;
            readonly inputBackground: string;
            readonly inputBorder: string;
            readonly inputText: string;
            readonly inputPlaceholder: string;
            readonly tabBarBackground: string;
            readonly tabBarBorder: string;
            readonly tabIconDefault: string;
            readonly headerBackground: string;
            readonly headerText: string;
            readonly modalBackground: string;
            readonly modalOverlay: string;
            readonly chartTertiary: string;
            readonly chartGrid: string;
        };
        readonly spacing: typeof Tokens.spacing;
        readonly opacity: typeof Tokens.opacity;
        readonly typography: {
            sizes: typeof Tokens.fontSizes;
            weights: typeof Tokens.fontWeights;
            lineHeights: typeof Tokens.lineHeights;
        };
        readonly borderRadius: typeof Tokens.radii;
        readonly shadows: {
            sm: NativeThemeShadow;
            md: NativeThemeShadow;
            lg: NativeThemeShadow;
            xl: NativeThemeShadow;
        };
        readonly brand: typeof Tokens.brandColors;
    };
};
export type NativeThemePreset = keyof typeof nativeThemePresets;
export declare const accentColors: {
    readonly sage: {
        readonly light: "#E8F0E8";
        readonly DEFAULT: "#A8C5A8";
        readonly dark: "#5A7A5A";
    };
    readonly rose: {
        readonly light: "#FEE2E2";
        readonly DEFAULT: "#F87171";
        readonly dark: "#EF4444";
    };
    readonly amber: {
        readonly light: "#F5EDE6";
        readonly DEFAULT: "#D4B896";
        readonly dark: "#8B6914";
    };
    readonly periwinkle: {
        readonly light: "#E8EBF5";
        readonly DEFAULT: "#A5B4D4";
        readonly dark: "#5A6A8B";
    };
    readonly warmGray: {
        readonly light: "#F5F3F1";
        readonly DEFAULT: "#C4BFB9";
        readonly dark: "#6B6560";
    };
    readonly lavender: {
        readonly light: "#F0EAF5";
        readonly DEFAULT: "#B7A5D4";
        readonly dark: "#6A5A8B";
    };
};
export declare const brandColors: {
    readonly navy: "#01314A";
    readonly offWhite: "#FCFCFC";
    readonly tan: "#C6B2A1";
    readonly lightBlue: "#93B3CD";
};
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
export declare const chartPaletteDark: ("#93B3CD" | "#66BB6A" | "#9575CD" | "#FFAB91" | "#EF5350" | "#4DD0E1" | "#A1887F" | "#90A4AE")[];
export declare const chartPaletteLight: ("#C6B2A1" | "#01314A" | "#2E7D32" | "#5E35B1" | "#E64A19" | "#00838F" | "#6D4C41" | "#455A64")[];
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
export declare const fontSizes: {
    xs: 11;
    sm: 13;
    md: 15;
    lg: 17;
    xl: 20;
    xxl: 24;
    xxxl: 32;
};
export declare const fontWeights: {
    regular: "400";
    medium: "500";
    semibold: "600";
    bold: "700";
    heavy: "800";
};
export declare const insightColors: {
    readonly light: {
        readonly positive: "#10B981";
        readonly positiveSecondary: "#059669";
        readonly moderate: "#F59E0B";
        readonly moderateSecondary: "#D97706";
        readonly caution: "#EF4444";
        readonly cautionSecondary: "#DC2626";
        readonly neutral: "#3B82F6";
        readonly neutralSecondary: "#2563EB";
        readonly accent: "#AF52DE";
        readonly gradientStart: "#667eea";
        readonly gradientEnd: "#764ba2";
    };
    readonly dark: {
        readonly positive: "#4CAF50";
        readonly positiveSecondary: "#2E7D32";
        readonly moderate: "#FF9800";
        readonly moderateSecondary: "#F57C00";
        readonly caution: "#F44336";
        readonly cautionSecondary: "#D32F2F";
        readonly neutral: "#93B3CD";
        readonly neutralSecondary: "#60A5FA";
        readonly accent: "#BF5AF2";
        readonly gradientStart: "#93B3CD";
        readonly gradientEnd: "#4ECDC4";
    };
};
export declare const insightGradients: {
    readonly light: {
        readonly positive: readonly ["#ECFDF5", "#D1FAE5", "#A7F3D0"];
        readonly moderate: readonly ["#FFFBEB", "#FEF3C7", "#FDE68A"];
        readonly caution: readonly ["#FEF2F2", "#FECACA", "#FCA5A5"];
        readonly neutral: readonly ["#EFF6FF", "#DBEAFE", "#BFDBFE"];
        readonly accent: "#F3E8FF";
    };
    readonly dark: {
        readonly positive: readonly ["rgba(76, 175, 80, 0.1)", "rgba(76, 175, 80, 0.15)", "rgba(76, 175, 80, 0.2)"];
        readonly moderate: readonly ["rgba(255, 152, 0, 0.1)", "rgba(255, 152, 0, 0.15)", "rgba(255, 152, 0, 0.2)"];
        readonly caution: readonly ["rgba(244, 67, 54, 0.1)", "rgba(244, 67, 54, 0.15)", "rgba(244, 67, 54, 0.2)"];
        readonly neutral: readonly ["rgba(64, 158, 255, 0.1)", "rgba(64, 158, 255, 0.15)", "rgba(64, 158, 255, 0.2)"];
        readonly accent: "rgba(191, 90, 242, 0.1)";
    };
};
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
export declare const lineHeights: {
    tight: 1.2;
    normal: 1.5;
    relaxed: 1.75;
};
export declare const macroColors: {
    readonly protein: "#9333EA";
    readonly carbs: "#059669";
    readonly fat: "#D97706";
};
export declare const opacity: {
    overlay: 0.5;
    subtle: 0.1;
    subtleDark: 0.05;
    hover: 0.04;
    hoverDark: 0.08;
    active: 0.12;
    activeDark: 0.16;
    disabled: 0.4;
    fabShadow: 0.15;
    trackLight: 0.08;
    trackDark: 0.15;
};
export declare const presetChartPalettes: {
    readonly ocean: readonly ["#0891B2", "#0D9488", "#0369A1", "#059669", "#7C3AED", "#EC4899", "#F59E0B", "#64748B"];
    readonly forest: readonly ["#059669", "#7C2D12", "#0D9488", "#B45309", "#7C3AED", "#0284C7", "#C026D3", "#475569"];
    readonly sunset: readonly ["#EA580C", "#7C3AED", "#DC2626", "#CA8A04", "#0891B2", "#059669", "#DB2777", "#6B7280"];
};
export declare const radii: {
    sm: 4;
    md: 8;
    lg: 12;
    xl: 16;
    full: 9999;
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
export declare const sleepColors: {
    readonly light: {
        readonly deep: "#5856D6";
        readonly light: "#3B82F6";
        readonly rem: "#AF52DE";
        readonly awake: "#F97316";
    };
    readonly dark: {
        readonly deep: "#5E5CE6";
        readonly light: "#93B3CD";
        readonly rem: "#BF5AF2";
        readonly awake: "#FF9F0A";
    };
};
export declare const spacing: {
    xs: 4;
    sm: 8;
    md: 16;
    lg: 24;
    xl: 32;
    xxl: 48;
};
//# sourceMappingURL=index.d.ts.map