import * as React from "react";
interface AppHeaderNavItem {
    label: string;
    href?: string;
    onClick?: () => void;
    isActive?: boolean;
}
interface AppHeaderProps {
    /**
     * レイアウト:
     * - `default`（既定）: `leading` + `title` + `trailing` の 3 カラム
     * - `logo`: 左にロゴ、右に actions（top page 想定）
     * - `logo-center`: ロゴ中央（checkout / minimal flow 想定）
     * - `back`: 左に戻るボタン、中央タイトル、右 actions（sub page）
     * - `back-search`: 左に戻るボタン、中央に検索 slot、右 actions
     */
    layout?: "default" | "logo" | "logo-center" | "back" | "back-search";
    /** 左端スロット（戻るボタン、ハンバーガー等） */
    leading?: React.ReactNode;
    /** ロゴ要素（layout="logo" / "logo-center" で使用） */
    logo?: React.ReactNode;
    /** 中央タイトル（layout="default" / "back" で使用） */
    title?: React.ReactNode;
    /** サブタイトル（タイトルの下に表示） */
    subtitle?: React.ReactNode;
    /** 中央スロット（layout="back-search" で使用） */
    centerSlot?: React.ReactNode;
    /** 右端スロット（アクションボタン群） */
    trailing?: React.ReactNode;
    /** 旧 prop 名（trailing と等価）。互換用 */
    rightSlot?: React.ReactNode;
    /**
     * PC 用インラインナビ。`@[768px]` 以上で表示される。
     * SP では非表示（ハンバーガー → MenuDrawer 経由を想定）。
     */
    nav?: AppHeaderNavItem[];
    /** ヘッダー下部に追加で出すスロット（タブ・ブレッドクラム等） */
    bottomSlot?: React.ReactNode;
    /** 固定ヘッダー（スクロールに追従しない） */
    sticky?: boolean;
    /** 下線ボーダー */
    bordered?: boolean;
    /**
     * 外観バリアント:
     * - "default"     : 通常（Surface-Primary 背景 + ボーダー）
     * - "glass"       : Liquid Glass（コンテンツに重ねる半透明）
     * - "transparent" : 完全透明（スクロール連動で背景を切り替えるときの初期状態）
     */
    variant?: "default" | "glass" | "transparent";
    className?: string;
}
/**
 * AppHeader — アプリ汎用ヘッダー。
 *
 * 5 つの layout モード × 3 つの visual variant の組み合わせで、
 * SP / PC で別実装が必要だったヘッダーを 1 コンポーネントに統合する。
 *
 * @container クエリで SP/PC を切り替えるため、利用側で `@container` を
 * 宣言した親要素の中に置く必要がある（通常 layout shell が宣言）。
 *
 * @example
 * // サブページ（戻る + タイトル）
 * <AppHeader layout="back" leading={<BackButton />} title="設定" />
 *
 * @example
 * // トップ（ロゴ + PC 用 inline nav）
 * <AppHeader
 *   layout="logo"
 *   logo={<Logo />}
 *   nav={[{label: "求人", href: "/jobs"}, {label: "企業", href: "/companies"}]}
 *   trailing={<UserMenu />}
 * />
 */
declare function AppHeader({ layout, leading, logo, title, subtitle, centerSlot, trailing, rightSlot, nav, bottomSlot, sticky, bordered, variant, className, }: AppHeaderProps): React.JSX.Element;
export { AppHeader };
export type { AppHeaderProps, AppHeaderNavItem };
