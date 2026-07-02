import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Celebration, usePrefersReducedMotion } from "./celebration"
import type { CelebrationProps } from "./celebration"

interface CelebrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** ダイアログ上部に表示する絵文字。省略時は非表示 */
  emoji?: string
  title: string
  description?: string
  /** CTA スロット。ボタン群などを渡す */
  actions?: React.ReactNode
  /** 指定時、この ms 経過後に自動で onOpenChange(false) を呼ぶ */
  autoDismissMs?: number
  /** Celebration の emoji 表示アニメーション（既定 "pop"） */
  emojiAnimation?: CelebrationProps["emojiAnimation"]
  /** Celebration confetti のパススルー props */
  particleCount?: CelebrationProps["particleCount"]
  duration?: CelebrationProps["duration"]
  colors?: CelebrationProps["colors"]
  driftRange?: CelebrationProps["driftRange"]
  className?: string
}

/**
 * CelebrationDialog — 達成演出用の Dialog + Celebration confetti + emoji 合成パターン。
 *
 * belle-todo の MilestoneCelebration（src/components/home/MilestoneCelebration.tsx）を
 * 参考に、MILESTONES 定義・アップセル CTA・zustand・i18n・analytics は一切持ち込まず、
 * emoji/title/description/actions をスロット化した汎用コンポーネントとして再設計。
 *
 * - DS の Dialog（Radix ベース、Esc/overlay クリックで閉じる）を土台にする。
 * - 背面に Celebration（trigger="confetti", cardless）を全画面オーバーレイとして重ね、
 *   Dialog 本体には emoji/title/description/actions のみを表示する
 *   （Celebration 側のカード演出とは重複させず、Dialog の見た目に統一する）。
 * - autoDismissMs 指定時は経過後に onOpenChange(false) を呼ぶ。
 */
function CelebrationDialog({
  open,
  onOpenChange,
  emoji,
  title,
  description,
  actions,
  autoDismissMs,
  emojiAnimation = "pop",
  particleCount,
  duration,
  colors,
  driftRange,
  className,
}: CelebrationDialogProps) {
  const reducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (!open || !autoDismissMs) return
    const id = window.setTimeout(() => onOpenChange(false), autoDismissMs)
    return () => window.clearTimeout(id)
  }, [open, autoDismissMs, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <Celebration
          active
          trigger="confetti"
          placement="overlay"
          cardless
          particleCount={particleCount}
          duration={duration}
          colors={colors}
          driftRange={driftRange}
        />
      )}
      <DialogContent className={className}>
        <div className="flex flex-col items-center text-center">
          {emoji && (
            // 絵文字は素置きせず、ブランド連動のソフトな円形バッジ + 外側の淡い光輪に載せる
            //（テーマの Brand 色に自動追従。bounce は絵文字グリフのみに適用）
            <span
              className="relative mb-4 flex h-20 w-20 items-center justify-center"
              aria-hidden="true"
            >
              <span className="absolute -inset-3 rounded-full bg-[var(--Surface-Accent-Primary-Subtle)] opacity-50" />
              <span className="absolute inset-0 rounded-full bg-[var(--Surface-Accent-Primary-Light)] border border-[var(--Surface-Accent-Primary-Subtle)]" />
              <span
                className={
                  !reducedMotion && emojiAnimation === "bounce"
                    ? "relative typo-display-lg leading-none animate-[celebration-emoji-pop_600ms_ease-out_200ms_both]"
                    : "relative typo-display-lg leading-none"
                }
              >
                {emoji}
              </span>
            </span>
          )}
          <DialogTitle className="typo-heading-xl text-[var(--Text-High-Emphasis)]">
            {title}
          </DialogTitle>
          {description && (
            <p className="typo-body-sm mt-2 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </p>
          )}
          {actions && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CelebrationDialog }
export type { CelebrationDialogProps }
