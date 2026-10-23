import React, { ReactNode } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
/**
 * Simple gradient replacement component
 * Uses the last color in the gradient array as a solid background
 * Does NOT use expo-linear-gradient to avoid platform compatibility issues
 */
interface PlatformLinearGradientProps {
    colors: string[];
    style?: StyleProp<ViewStyle>;
    start?: {
        x: number;
        y: number;
    };
    end?: {
        x: number;
        y: number;
    };
    locations?: number[];
    children?: ReactNode;
}
declare const PlatformLinearGradient: React.FC<PlatformLinearGradientProps>;
export default PlatformLinearGradient;
//# sourceMappingURL=PlatformLinearGradient.d.ts.map