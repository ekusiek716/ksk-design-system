import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export interface DetailSheetScaffoldProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export interface DetailSheetHeaderProps {
    title?: React.ReactNode;
    titleEditor?: React.ReactNode;
    description?: React.ReactNode;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export interface DetailSheetBodyProps {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare function DetailSheetScaffold({ header, footer, children, style }: DetailSheetScaffoldProps): React.JSX.Element;
export declare function DetailSheetHeader({ title, titleEditor, description, leading, trailing, children, style, }: DetailSheetHeaderProps): React.JSX.Element;
export declare function DetailSheetBody({ children, style }: DetailSheetBodyProps): React.JSX.Element;
