import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
// 純粋な variants 定義は React に依存しない別ファイルに切り出し。
// 同じ buttonVariants を `ksk-design-system/class-names` から Server Component
// 経由でも参照できるようにするため。詳細は server-variants/button-variants.ts。
import { buttonVariants } from "../../lib/server-variants/button-variants"

/** navigator.vibrate のパターン (ms) */
const HAPTIC_PATTERNS: Record<string, number | number[]> = {
  light:   10,
  medium:  25,
  heavy:   50,
  warning: [30, 50, 30],
}

type HapticType = keyof typeof HAPTIC_PATTERNS

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** 子要素へ Button の見た目と操作属性を委譲する。リンクを Button として見せる場合に使用。 */
  asChild?: boolean
  /** モバイルでの触覚フィードバック。navigator.vibrate() を使用。未対応環境では無視される。 */
  haptic?: HapticType
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
function Button({
  className,
  variant,
  size,
  layout,
  asChild = false,
  haptic,
  onClick,
  type,
  disabled,
  tabIndex,
  "aria-disabled": ariaDisabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (haptic && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(HAPTIC_PATTERNS[haptic])
      }
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
    },
    [disabled, haptic, onClick]
  )

  return (
    <Comp
      data-slot="button"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      // 既定を type="button" にする。生 <button> の既定 "submit" は <form> 内で
      // 意図せぬ送信/リロードを起こす footgun（消費側は皆 type="submit" を明示済みで
      // 暗黙依存ゼロ＝非破壊）。明示された type="submit"/"reset" はそのまま尊重。
      type={asChild ? undefined : (type ?? "button")}
      disabled={asChild ? undefined : disabled}
      aria-disabled={asChild && disabled ? true : ariaDisabled}
      tabIndex={asChild && disabled ? -1 : tabIndex}
      className={cn(buttonVariants({ variant, size, layout, className }))}
      onClick={handleClick}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps, HapticType }
