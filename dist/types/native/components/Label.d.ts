import React from "react";
import { type ViewProps } from "react-native";
export interface LabelProps extends ViewProps {
    required?: boolean;
    children: React.ReactNode;
}
export declare function Label({ required, children, style, ...rest }: LabelProps): React.JSX.Element;
