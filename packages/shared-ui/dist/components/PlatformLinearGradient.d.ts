import React, { ReactNode } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
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