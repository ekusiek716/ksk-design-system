import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
export type SettingsSectionVariant = "group" | "card" | "danger";
export interface SettingsSectionProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    variant?: SettingsSectionVariant;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
}
export interface SettingsListRowProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    leading?: React.ReactNode;
    rightSlot?: React.ReactNode;
    children?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    destructive?: boolean;
    style?: StyleProp<ViewStyle>;
}
export declare function SettingsSection({ title, description, action, variant, children, style, contentStyle, }: SettingsSectionProps): React.JSX.Element;
export declare function SettingsListRow({ title, description, leading, rightSlot, children, onPress, disabled, destructive, style, }: SettingsListRowProps): React.JSX.Element;
