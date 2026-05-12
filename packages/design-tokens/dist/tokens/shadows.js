/**
 * @ai-context Design tokens: Shadow definitions
 *
 * Shadow values for elevation and depth.
 * Separate definitions for React Native and web platforms.
 */
import { brandColors } from './brand.js';
/** Shadow scale for React Native (iOS) */
export const shadowsNativeIOS = {
    sm: {
        shadowColor: brandColors.navy,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    md: {
        shadowColor: brandColors.navy,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    lg: {
        shadowColor: brandColors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    xl: {
        shadowColor: brandColors.navy,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
    },
};
/** Shadow scale for React Native (Android) */
export const shadowsNativeAndroid = {
    sm: { elevation: 2 },
    md: { elevation: 4 },
    lg: { elevation: 8 },
    xl: { elevation: 16 },
};
/** Shadow scale for web (CSS box-shadow) */
export const shadowsCss = {
    xs: '0 1px 2px 0 rgba(1, 49, 74, 0.03)',
    sm: '0 1px 3px 0 rgba(1, 49, 74, 0.05), 0 1px 2px 0 rgba(1, 49, 74, 0.03)',
    md: '0 4px 6px -1px rgba(1, 49, 74, 0.07), 0 2px 4px -1px rgba(1, 49, 74, 0.04)',
    lg: '0 10px 15px -3px rgba(1, 49, 74, 0.08), 0 4px 6px -2px rgba(1, 49, 74, 0.04)',
    xl: '0 20px 25px -5px rgba(1, 49, 74, 0.1), 0 10px 10px -5px rgba(1, 49, 74, 0.03)',
};
//# sourceMappingURL=shadows.js.map