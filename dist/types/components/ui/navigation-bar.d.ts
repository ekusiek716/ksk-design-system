import * as React from "react";
declare function IconClose({ size }: {
    size?: number;
}): import("react/jsx-runtime").JSX.Element;
declare function IconBack({ size }: {
    size?: number;
}): import("react/jsx-runtime").JSX.Element;
/** iOS 26 スタイルのシェアアイコン（上向き矢印 + トレイ） */
declare function IconShareIos({ size }: {
    size?: number;
}): import("react/jsx-runtime").JSX.Element;
export interface NavigationBarProps {
    /** 中央タイトル（絶対配置で常に視覚的中央） */
    title?: React.ReactNode;
    /**
     * 左ボタンのアイコン:
     * - "back"  : ← 戻る（デフォルト）
     * - "close" : × 閉じる（iOS 26 モーダル）
     * - ReactNode : カスタム
     */
    leftIcon?: "back" | "close" | React.ReactNode;
    /** 左ボタンクリックハンドラ */
    onLeft?: () => void;
    /** 左ボタンのアクセシビリティラベル（自動補完: "戻る" / "閉じる"） */
    leftLabel?: string;
    /**
     * 右スロット。rightSlot が優先、未指定かつ onShare があればシェアボタンを表示。
     */
    rightSlot?: React.ReactNode;
    /** シェアボタンを右に表示してそのハンドラを登録する簡便 prop */
    onShare?: () => void;
    /** シェアボタンのアクセシビリティラベル */
    shareLabel?: string;
    /**
     * true : Liquid Glass ボタン（グラデーション・写真背景の上に重ねるとき）
     * false: 通常ボタン（secondary variant）
     */
    glass?: boolean;
    /** ヘッダー自体の背景を透明にする（コンテンツに重ねるとき） */
    transparent?: boolean;
    className?: string;
}
/**
 * iOS 26 スタイルのナビゲーションバー。
 *
 * - leading  : `Button size="icon-xl"` (glass or secondary variant)
 * - center   : 絶対配置タイトル（常に視覚的中央）
 * - trailing : `Button size="icon-xl"` (glass or secondary variant)
 *
 * @example
 * // 通常（白背景ページ）
 * <NavigationBar title="設定" leftIcon="back" onLeft={back} onShare={share} />
 *
 * // iOS 26 ガラス（グラデーション上に重ねる）
 * <NavigationBar title="Aircraft Stats" leftIcon="close" onLeft={close} onShare={share} glass transparent />
 */
declare function NavigationBar({ title, leftIcon, onLeft, leftLabel, rightSlot, onShare, shareLabel, glass, transparent, className, }: NavigationBarProps): import("react/jsx-runtime").JSX.Element;
export { NavigationBar, IconClose, IconBack, IconShareIos };
