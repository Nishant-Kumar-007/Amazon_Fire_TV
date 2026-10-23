import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleProp, Platform } from 'react-native';

interface PlatformLinearGradientProps {
  colors: string[];
  style?: StyleProp<ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  children?: ReactNode;
}

const PlatformLinearGradient: React.FC<PlatformLinearGradientProps> = ({
  colors,
  style,
  start,
  end,
  children,
}) => {
  if (Platform.OS === 'web' && colors && colors.length > 0) {
    let direction = 'to bottom';
    if (start && end) {
      if (start.x < end.x && start.y === end.y) {
        direction = 'to right';
      } else if (start.x === end.x && start.y < end.y) {
        direction = 'to bottom';
      } else if (start.x < end.x && start.y < end.y) {
        direction = 'to bottom right';
      }
    }

    const gradientCss = `linear-gradient(${direction}, ${colors.join(', ')})`;

    return (
      <View
        style={[
          style as any,
          {
            backgroundImage: gradientCss,
            pointerEvents: 'none',
          } as any,
        ]}
      >
        {children}
      </View>
    );
  }

  const fallbackColor = colors && colors.length > 0
    ? colors[colors.length - 1]
    : 'rgba(0, 0, 0, 0.6)';

  return (
    <View
      style={[
        style as StyleProp<ViewStyle>,
        { backgroundColor: fallbackColor },
      ]}
    >
      {children}
    </View>
  );
};

export default PlatformLinearGradient;
