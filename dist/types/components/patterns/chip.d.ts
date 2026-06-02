import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const chipVariants: (props?: {
    variant?: "accent" | "outline" | "filled";
    size?: "sm" | "lg" | "md" | "tile";
    shape?: "square" | "pill";
} & import("class-variance-authority/types").ClassProp) => string;
interface ChipProps extends Omit<React.ComponentProps<"button">, "children">, VariantProps<typeof chipVariants> {
    /** リンクとして使う場合の URL。指定時は `<a>` でレンダリング */
    href?: string;
    /** 選択状態。true で Brand 色 + 白文字へ強調 */
    selected?: boolean;
    /** 売り切れ状態（斜線オーバーレイ + disabled） */
    soldOut?: boolean;
    /** 削除可能（× ボタン表示） */
    removable?: boolean;
    /** 削除時のコールバック */
    onRemove?: () => void;
    /** 件数バッジ（例: フィルタ件数） */
    count?: number;
    children?: React.ReactNode;
}
/**
 * Chip — クリック可能なキーワード・フィルタチップ。
 *
 * Tag（表示専用ラベル）との違い：
 * - Chip はインタラクティブ（クリック・選択・削除可）
 * - Chip は pill（rounded-full）/ square / tile を持つ
 * - Chip は count バッジ・売り切れ状態・removable を持てる
 *
 * ### AI 向け使用ルール
 * - キーワード: `<Chip>キーワード</Chip>`
 * - フィルタ選択: `<Chip selected>選択済み</Chip>`
 * - 削除可能タグ: `<Chip removable onRemove={fn}>タグ</Chip>`
 * - サイズタイル: `<Chip shape="square" size="tile" selected={isSelected}>M</Chip>`
 * - 売り切れタイル: `<Chip shape="square" size="tile" soldOut>L</Chip>`
 * - カウント付き: `<Chip selected count={156}>すべて</Chip>`
 * - リンク化: `<Chip href="/search?q=foo">foo</Chip>`
 */
declare function Chip({ className, variant, size, shape, href, selected, soldOut, removable, onRemove, count, children, disabled: disabledProp, ...props }: ChipProps): import("react/jsx-runtime").JSX.Element;
export { Chip, chipVariants };
export type { ChipProps };
