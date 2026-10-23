import React from "react";
import { PressableProps, ViewStyle, StyleProp } from "react-native";
interface CustomPressableProps extends PressableProps {
    text: string;
    onSelect: () => void;
    style?: StyleProp<ViewStyle>;
}
declare const FocusablePressable: React.MemoExoticComponent<({ text, onSelect, style, ...props }: CustomPressableProps) => React.JSX.Element>;
export default FocusablePressable;
//# sourceMappingURL=FocusablePressable.d.ts.map