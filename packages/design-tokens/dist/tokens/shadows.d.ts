/**
 * @ai-context Design tokens: Shadow definitions
 *
 * Shadow values for elevation and depth.
 * Separate definitions for React Native and web platforms.
 */
/** Shadow scale for React Native (iOS) */
export declare const shadowsNativeIOS: {
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
/** Shadow scale for React Native (Android) */
export declare const shadowsNativeAndroid: {
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
/** Shadow scale for web (CSS box-shadow) — opacities ~2x stock so white
 * cards on the warmed background read with clear edges without becoming
 * heavy. Still subtle; real elevation. */
export declare const shadowsCss: {
    readonly xs: "0 1px 2px 0 rgba(1, 49, 74, 0.06)";
    readonly sm: "0 1px 3px 0 rgba(1, 49, 74, 0.08), 0 1px 2px 0 rgba(1, 49, 74, 0.05)";
    readonly md: "0 4px 6px -1px rgba(1, 49, 74, 0.10), 0 2px 4px -1px rgba(1, 49, 74, 0.06)";
    readonly lg: "0 10px 15px -3px rgba(1, 49, 74, 0.12), 0 4px 6px -2px rgba(1, 49, 74, 0.07)";
    readonly xl: "0 20px 25px -5px rgba(1, 49, 74, 0.16), 0 10px 10px -5px rgba(1, 49, 74, 0.06)";
};
export type ShadowKey = keyof typeof shadowsCss;
//# sourceMappingURL=shadows.d.ts.map