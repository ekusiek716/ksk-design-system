import React from "react";
export interface SwipeAction {
    label: string;
    color?: string;
    textColor?: string;
    onPress: () => void;
}
export interface SwipeRowProps {
    rightActions?: SwipeAction[];
    actionWidth?: number;
    children: React.ReactNode;
}
/** 右からスワイプして action を出す簡易行。Animated.Value + PanResponder のみで実装。 */
export declare function SwipeRow({ rightActions, actionWidth, children }: SwipeRowProps): import("react/jsx-runtime").JSX.Element;
