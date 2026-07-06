import React from "react";
import { type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import type { BottomTabBarProps as RNBottomTabBarProps } from "@react-navigation/bottom-tabs";
import { type NavigationBarItem } from "./NavigationBar";
import { type GlassIntensity, type GlassTint } from "./GlassView";
export type BottomTabBarKeyboardBehavior = "hide" | "lift" | "stay";
export interface BottomTabBarProps {
    items: NavigationBarItem[];
    value?: string;
    onChange?: (key: string) => void;
    keyboardBehavior?: BottomTabBarKeyboardBehavior;
    keyboardLiftOffset?: number;
}
export type NativeTabBarState = RNBottomTabBarProps["state"];
export type NativeTabBarRoute = NativeTabBarState["routes"][number];
export type NativeTabBarNavigation = RNBottomTabBarProps["navigation"];
export type NativeTabBarDescriptorMap = RNBottomTabBarProps["descriptors"];
export type NativeTabBarDescriptor = NativeTabBarDescriptorMap[string];
export type NativeTabBarOptions = NonNullable<NativeTabBarDescriptor["options"]>;
export type NativeTabBarIconProps = Parameters<NonNullable<NativeTabBarOptions["tabBarIcon"]>>[0];
export interface LiquidBottomTabBarProps {
    state: NativeTabBarState;
    descriptors: NativeTabBarDescriptorMap;
    navigation: NativeTabBarNavigation;
    insets?: RNBottomTabBarProps["insets"];
    keyboardBehavior?: BottomTabBarKeyboardBehavior;
    keyboardLiftOffset?: number;
    hiddenRouteNames?: string[];
    floating?: boolean;
    glass?: boolean;
    glassIntensity?: GlassIntensity;
    glassTint?: GlassTint;
    showLabels?: boolean;
    iconSize?: number;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    itemStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}
export type ExpoRouterTabBarFactoryOptions = Omit<LiquidBottomTabBarProps, "state" | "descriptors" | "navigation" | "insets">;
/** commerce 系の TabBar。中身は NavigationBar とほぼ同じ。 */
export declare function BottomTabBar({ keyboardBehavior, keyboardLiftOffset, ...props }: BottomTabBarProps): React.JSX.Element;
export declare function LiquidBottomTabBar({ state, descriptors, navigation, insets, keyboardBehavior, keyboardLiftOffset, hiddenRouteNames, floating, glass, glassIntensity, glassTint, showLabels, iconSize, style, contentStyle, itemStyle, labelStyle, }: LiquidBottomTabBarProps): React.JSX.Element;
export declare function createExpoRouterTabBar(options?: ExpoRouterTabBarFactoryOptions): (props: Omit<LiquidBottomTabBarProps, keyof ExpoRouterTabBarFactoryOptions>) => React.JSX.Element;
