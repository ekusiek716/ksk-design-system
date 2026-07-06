import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export interface MobileAppHeaderProps {
    brand: React.ReactNode;
    leading?: React.ReactNode;
    status?: React.ReactNode;
    compactStatus?: React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    bordered?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function MobileAppHeader({ brand, leading, status, compactStatus, actions, children, bordered, style, }: MobileAppHeaderProps): React.JSX.Element;
