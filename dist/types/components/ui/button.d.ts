import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "../../lib/server-variants/button-variants";
/** navigator.vibrate のパターン (ms) */
declare const HAPTIC_PATTERNS: Record<string, number | number[]>;
type HapticType = keyof typeof HAPTIC_PATTERNS;
interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    /** 子要素へ Button の見た目と操作属性を委譲する。リンクを Button として見せる場合に使用。 */
    asChild?: boolean;
    /** モバイルでの触覚フィードバック。navigator.vibrate() を使用。未対応環境では無視される。 */
    haptic?: HapticType;
}
/**
 * Button — 汎用ボタン
 *
 * バリアントの使い分け:
 * - `default`: 主たる CTA（1 画面に 1〜2 個まで）。
 * - `secondary` / `tertiary`: 並列の選択肢・キャンセル。
 * - `ghost` / `link`: 文字寄りの controls。
 * - `destructive`: 削除・取り消しなど不可逆操作。
 * - `glass` / `glass-inverse` / `glass-accent` / `accent`: モバイル / ヒーローセクション向け装飾系。
 *   `glass-accent` はブランドカラーをティントした glass。FAB（円形アイコンボタン）等、
 *   中立色の glass より一段強い存在感を出したい主要アクションに使う。
 * - `inverse` / `ghost-inverse`: 暗背景・ヒーローセクション上で使う反転バリアント。
 *
 * サイズ:
 * - `xs` / `sm` / `default` / `lg` / `xl`: 一般用途。
 * - `hero`: トップ hero / final-CTA 向けのピル型特大 CTA。
 * - `icon` / `icon-sm` / `icon-lg` / `icon-xl`: アイコンのみのボタン（aria-label 必須）。
 */
declare function Button({ className, variant, size, layout, asChild, haptic, onClick, type, disabled, tabIndex, "aria-disabled": ariaDisabled, children, ...props }: ButtonProps): React.JSX.Element;
export { Button, buttonVariants };
export type { ButtonProps, HapticType };
