import * as React from "react";
import type { BottomTabBarFloatingPosition } from "./bottom-tab-bar";
interface MobileTabItem<T extends string> {
    key: T;
    label: string;
    /** iconsax-reactjs のアイコンコンポーネント。Linear（非アクティブ）/ Bulk（アクティブ）を自動切替する */
    Icon: React.ElementType;
}
interface MobileTabBarAddAction {
    label: string;
    ariaLabel?: string;
    onClick: () => void;
}
interface MobileTabBarProps<T extends string> {
    tabs: MobileTabItem<T>[];
    activeTab: T;
    onSelect: (tab: T) => void;
    /** 指定するとブランド色丸背景 + iconsax Add アイコンを中央 CTA として表示する */
    addAction?: MobileTabBarAddAction;
    /**
     * pill の水平フロート位置（デフォルト "center"）。
     * addAction と併用しない片側フロート + FAB 併置レイアウトで使う。
     */
    floatingPosition?: BottomTabBarFloatingPosition;
    className?: string;
}
/**
 * MobileTabBar — BottomTabBar の consumer-friendly ラッパー。
 * belle-todo の MobileTabBar（src/components/MobileTabBar.tsx 36-77行）を移植。
 *
 * - iconsax の variant="Linear"（非アクティブ）/ "Bulk"（アクティブ）を自動切替
 * - addAction 指定時はブランド色丸背景 + Add アイコンを centerAction として渡す
 * - onPointerUpCapture でタップ後のフォーカスリング残留を防ぐ（closest("button, a")?.blur()）
 * - 内部は BottomTabBar（variant="pill", pillPosition="fixed", showLabels,
 *   keyboardBehavior="hide"）の薄いラッパー。floatingPosition はパススルー。
 */
declare function MobileTabBar<T extends string>({ tabs, activeTab, onSelect, addAction, floatingPosition, className, }: MobileTabBarProps<T>): React.JSX.Element;
export { MobileTabBar };
export type { MobileTabBarAddAction, MobileTabBarProps, MobileTabItem };
