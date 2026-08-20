import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
// 純粋な variants 定義は React に依存しない別ファイルに切り出し。
// 同じ buttonVariants を `ksk-design-system/class-names` から Server Component
// 経由でも参照できるようにするため。詳細は server-variants/button-variants.ts。
import { buttonVariants } from "../../lib/server-variants/button-variants"
import { UNSTYLED_FOCUS_RING } from "../../lib/server-variants/unstyled"

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
  /**
   * 視覚クラスを一切出さず、挙動と a11y だけを提供する（issue #420）。
   *
   * 既存の手書き CSS を持つ画面を段階移行するときに使う。base の
   * `inline-flex / items-center / justify-center / gap / whitespace-nowrap /
   * typo-* / cursor-pointer` と variant / size / layout のクラスは
   * **全て出力されない**。維持されるのは
   * `type` 既定 `"button"` / disabled・aria-disabled 時の
   * preventDefault + stopPropagation / haptic / asChild と、
   * a11y のための focus-visible ring だけ。
   *
   * focus ring は className 側で `focus-visible:ring-0` 等を渡せば上書きできる。
   * `variant` / `size` / `layout` は無視され、`data-variant` / `data-size` は
   * `"unstyled"` になる。
   */
  unstyled?: boolean
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
 *
 * 段階移行:
 * - `unstyled`: 既存の手書き CSS を持つ画面を移行するとき、見た目を DS 側で一切
 *   持たず挙動と a11y だけを提供する（issue #420）。README「段階移行レシピ」参照。
 */
function Button({
  className,
  variant,
  size,
  layout,
  asChild = false,
  haptic,
  unstyled = false,
  onClick,
  type,
  disabled,
  tabIndex,
  "aria-disabled": ariaDisabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled || ariaDisabled === true || ariaDisabled === "true"

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (haptic && typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(HAPTIC_PATTERNS[haptic])
      }
      onClick?.(e as React.MouseEvent<HTMLButtonElement>)
    },
    [haptic, isDisabled, onClick]
  )

  const handleDisabledCapture = React.useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
    },
    []
  )

  const slottedChild = asChild && isDisabled && React.isValidElement<{
    onClick?: React.MouseEventHandler
    onClickCapture?: React.MouseEventHandler
    onAuxClickCapture?: React.MouseEventHandler
    onContextMenuCapture?: React.MouseEventHandler
    "aria-disabled"?: React.AriaAttributes["aria-disabled"]
    tabIndex?: number
    disabled?: boolean
    href?: string
  }>(children)
    ? React.cloneElement(children, {
        onClick: handleClick,
        onClickCapture: handleDisabledCapture,
        onAuxClickCapture: handleDisabledCapture,
        onContextMenuCapture: handleDisabledCapture,
        "aria-disabled": true,
        tabIndex: -1,
        disabled: undefined,
        ...(children.type === "a" ? { href: undefined } : {}),
      })
    : children

  return (
    <Comp
      data-slot="button"
      data-variant={unstyled ? "unstyled" : (variant ?? "default")}
      data-size={unstyled ? "unstyled" : (size ?? "default")}
      // 既定を type="button" にする。生 <button> の既定 "submit" は <form> 内で
      // 意図せぬ送信/リロードを起こす footgun（消費側は皆 type="submit" を明示済みで
      // 暗黙依存ゼロ＝非破壊）。明示された type="submit"/"reset" はそのまま尊重。
      type={asChild ? undefined : (type ?? "button")}
      disabled={asChild ? undefined : disabled}
      aria-disabled={asChild && isDisabled ? true : ariaDisabled}
      tabIndex={asChild && isDisabled ? -1 : tabIndex}
      // unstyled: 寸法・配色・タイポ・radius・flex 配置は一切出さず、
      // a11y のための focus ring だけを残す（issue #420）。
      className={
        unstyled
          ? cn(UNSTYLED_FOCUS_RING, className)
          : cn(buttonVariants({ variant, size, layout, className }))
      }
      onClick={asChild && isDisabled ? undefined : handleClick}
      {...props}
    >
      {slottedChild}
    </Comp>
  )
}

export { Button, buttonVariants }
export type { ButtonProps, HapticType }
