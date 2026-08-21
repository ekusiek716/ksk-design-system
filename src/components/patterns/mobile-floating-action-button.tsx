import * as React from "react"
import { Add } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useVisualViewportKeyboardInset } from "@/lib/use-visual-viewport-keyboard-inset"

type MobileFloatingActionButtonPlacement = "end" | "start" | "center"
type MobileFloatingActionButtonKeyboardBehavior = "hide" | "lift" | "stay"
type MobileFloatingActionButtonBottomOffset = "none" | "bottom-nav" | "bottom-nav-pill" | "bottom-nav-pill-inline"
type MobileFloatingActionButtonVariant = "default" | "glass"

interface MobileFloatingActionButtonProps extends Omit<React.ComponentProps<typeof Button>, "children" | "size" | "variant"> {
  label: string
  icon?: React.ReactNode
  showLabel?: boolean
  placement?: MobileFloatingActionButtonPlacement
  bottomOffset?: MobileFloatingActionButtonBottomOffset
  keyboardBehavior?: MobileFloatingActionButtonKeyboardBehavior
  mobileOnly?: boolean
  /**
   * 見た目。既定は `default`（Brand 塗りのソリッド FAB）。
   * `glass` は Button の `glass-accent`（Brand ティントの Liquid Glass）を使い、
   * 写真・地図・リスト等のコンテンツが FAB の背後に透けて見える表現にする。
   */
  variant?: MobileFloatingActionButtonVariant
  /**
   * 下部固定の全幅 CTA にする。既定 `false`（従来どおり右下の円形 FAB）。
   *
   * true のとき `placement` は無視され、左右に safe-area + 16px の inset を取った
   * 全幅ボタンになる。ラベルは常に表示される（`showLabel` の指定は不要）。
   * 「この画面で next action が 1 つだけ」の予約・購入・送信フローに使う。
   */
  fullWidth?: boolean
  /**
   * `bottomOffset` プリセット値へ加算する追加オフセット（CSS length。例: `"64px"`）。
   *
   * 画面下に広告バナー（AdMob 等）を出すアプリで、バナーの高さぶん FAB を
   * 持ち上げる用途を想定。既定は未指定（＝加算なし・既存の挙動を変えない）。
   *
   * @example
   * // AdMob バナー（高さは実測 or SDK から取得した値）の分だけ FAB を持ち上げる
   * <MobileFloatingActionButton
   *   label="追加する"
   *   bottomOffsetExtra={`${admobBannerHeight}px`}
   * />
   */
  bottomOffsetExtra?: string
}

function MobileFloatingActionButton({
  className,
  label,
  icon,
  showLabel = false,
  placement = "end",
  bottomOffset = "bottom-nav",
  keyboardBehavior = "hide",
  mobileOnly = true,
  variant = "default",
  fullWidth = false,
  bottomOffsetExtra,
  style,
  ...props
}: MobileFloatingActionButtonProps) {
  // 全幅 CTA はラベルが無いと何の操作か分からないため、常にラベルを出す。
  const showsLabel = showLabel || fullWidth
  const ariaLabel = props["aria-label"] ?? label
  const { keyboardInset, isKeyboardOpen } = useVisualViewportKeyboardInset()
  const shouldHide = keyboardBehavior === "hide" && isKeyboardOpen
  const liftInset = keyboardBehavior === "lift" ? keyboardInset : 0

  return (
    <Button
      {...props}
      data-slot="mobile-floating-action-button"
      data-placement={placement}
      data-bottom-offset={bottomOffset}
      aria-label={ariaLabel}
      variant={variant === "glass" ? "glass-accent" : "default"}
      data-full-width={fullWidth || undefined}
      size={showsLabel ? "lg" : "icon-lg"}
      className={cn(
        "fixed z-[var(--Z-Floating)] transition-all duration-[var(--Motion-Duration-Base)]",
        // glass-accent は inset 3層 + ドロップシャドウを自前で持つため、DS の lg 影を
        // 重ねると影が二重になって濁る。ソリッド FAB のときだけ影を敷く。
        variant === "default" && "shadow-[var(--shadow-lg)]",
        "bottom-[calc(env(safe-area-inset-bottom)_+_var(--ksk-fab-bottom-offset)_+_var(--ksk-fab-bottom-offset-extra,_0px)_+_var(--ksk-fab-keyboard-inset))]",
        // 全幅 CTA: 左右に safe-area（横向き時のノッチ）+ 16px の inset を取る。
        fullWidth && "left-[calc(env(safe-area-inset-left)_+_1rem)] right-[calc(env(safe-area-inset-right)_+_1rem)] w-auto justify-center",
        !fullWidth && placement === "end" && "right-4",
        !fullWidth && placement === "start" && "left-4",
        !fullWidth && placement === "center" && "left-1/2 -translate-x-1/2",
        bottomOffset === "none" && "[--ksk-fab-bottom-offset:1rem]",
        bottomOffset === "bottom-nav-pill-inline" && "[--ksk-fab-bottom-offset:1rem]",
        bottomOffset === "bottom-nav" && "[--ksk-fab-bottom-offset:5rem]",
        bottomOffset === "bottom-nav-pill" && "[--ksk-fab-bottom-offset:6rem]",
        mobileOnly && "lg:hidden",
        shouldHide && "translate-y-2 opacity-0 pointer-events-none",
        className
      )}
      style={{
        "--ksk-fab-keyboard-inset": `${liftInset}px`,
        ...(bottomOffsetExtra !== undefined && {
          "--ksk-fab-bottom-offset-extra": bottomOffsetExtra,
        }),
        ...style,
      } as React.CSSProperties}
    >
      <span aria-hidden className="flex size-5 items-center justify-center">
        {icon ?? <Add size={22} />}
      </span>
      {showsLabel && <span>{label}</span>}
    </Button>
  )
}

export { MobileFloatingActionButton }
export type {
  MobileFloatingActionButtonBottomOffset,
  MobileFloatingActionButtonKeyboardBehavior,
  MobileFloatingActionButtonPlacement,
  MobileFloatingActionButtonProps,
  MobileFloatingActionButtonVariant,
}
