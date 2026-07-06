import React from "react";
import { type StyleProp, type TextStyle, type ViewStyle } from "react-native";
export interface FloatingTabBarItem {
    key: string;
    label: string;
    /** 任意の先頭アイコン（DS 外のアイコンを注入する。色は呼び出し側で合わせる） */
    icon?: React.ReactNode;
}
export interface FloatingTabBarProps {
    items: FloatingTabBarItem[];
    /** 選択中 item の key。未指定なら選択表示なし（クイックナビ用途） */
    activeKey?: string;
    onSelect: (key: string) => void;
    /**
     * 面のトーン。
     * - "hero": GradientSurface 等のビビッド面の上に浮かべる淡色ピル
     * - "surface": 通常サーフェス上（既定）
     */
    tone?: "hero" | "surface";
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}
/**
 * 画面下部に浮かせるピル型のクイックナビゲーション。
 *
 * react-navigation に依存しない単体コンポーネント（Tabs 連携が必要な場合は
 * LiquidBottomTabBar / createExpoRouterTabBar を使う）。Stack 構成の画面で
 * 主要導線を常時見せたいときに使う。色は semantic トークンのみ。
 */
export declare function FloatingTabBar({ items, activeKey, onSelect, tone, style, labelStyle, }: FloatingTabBarProps): React.JSX.Element;
