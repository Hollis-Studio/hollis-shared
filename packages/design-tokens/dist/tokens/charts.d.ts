/**
 * @ai-context Design tokens: Chart color palettes
 *
 * Harmonious, accessible color palettes for data visualization.
 * Colors chosen for distinctiveness and colorblind-friendliness.
 */
/** Light mode chart palette - darker values for contrast on light backgrounds */
export declare const chartPaletteLight: readonly ["#01314A", "#2E7D32", "#5E35B1", "#C6B2A1", "#E64A19", "#00838F", "#6D4C41", "#455A64"];
/** Dark mode chart palette - brighter values for visibility on dark backgrounds */
export declare const chartPaletteDark: readonly ["#93B3CD", "#66BB6A", "#9575CD", "#FFAB91", "#EF5350", "#4DD0E1", "#A1887F", "#90A4AE"];
/** Sleep stage colors */
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
/** Health insight indicator colors */
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
/** Macronutrient display colors for nutrition screens */
export declare const macroColors: {
    /** Protein - vibrant purple */
    readonly protein: "#9333EA";
    /** Carbohydrates - emerald green */
    readonly carbs: "#059669";
    /** Fat - warm amber */
    readonly fat: "#D97706";
};
/** Gradient backgrounds for insight cards */
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
/** Theme preset chart palettes */
export declare const presetChartPalettes: {
    readonly ocean: readonly ["#0891B2", "#0D9488", "#0369A1", "#059669", "#7C3AED", "#EC4899", "#F59E0B", "#64748B"];
    readonly forest: readonly ["#059669", "#7C2D12", "#0D9488", "#B45309", "#7C3AED", "#0284C7", "#C026D3", "#475569"];
    readonly sunset: readonly ["#EA580C", "#7C3AED", "#DC2626", "#CA8A04", "#0891B2", "#059669", "#DB2777", "#6B7280"];
};
export type ChartPalette = readonly string[];
//# sourceMappingURL=charts.d.ts.map