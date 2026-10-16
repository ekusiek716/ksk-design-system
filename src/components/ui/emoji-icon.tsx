import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * EmojiIcon の寸法（issue #676）。アイコン枠の大きさに合わせた 4 段:
 * sm=16 / md=24 / lg=36 / xl=48（px）。native EmojiIcon と同じ語彙・値。
 */
type EmojiIconSize = "sm" | "md" | "lg" | "xl"

const SIZE_CLASS: Record<EmojiIconSize, string> = {
  sm: "size-4 typo-body-md",
  md: "size-6 typo-heading-2xl",
  lg: "size-9 typo-display-lg",
  xl: "size-12 typo-display-xl",
}

interface EmojiIconProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** 表示する絵文字（1 文字・1 書記素を想定） */
  emoji: string
  /** 寸法。sm=16 / md=24（既定）/ lg=36 / xl=48 */
  size?: EmojiIconSize
}

/**
 * EmojiIcon — 絵文字をアイコンと同じ寸法の箱に収めて描く装飾（issue #676）
 *
 * EmptyState / ErrorState の `icon`、Alert / Banner の `icon`、ListItem の `leftSlot`、
 * Toast など **アイコンを受けるスロットに絵文字を置くとき**に使う。絵文字を素の文字で
 * 渡すと文字サイズのまま小さく描かれ、consumer が `text-5xl` 等の生サイズで拡大する
 * 原因になっていた。
 *
 * - 常に装飾扱い（`aria-hidden`）。意味は隣の見出し・本文で伝える
 * - 箱（size-*）と字の大きさ（typo-*）を DS が対で持つ。`text-*` で拡大しない
 * - ActionTile は既に `emoji` prop を持つのでそちらを使う
 *
 * ```tsx
 * <EmptyState icon={<EmojiIcon emoji="🎉" size="xl" />} title="すべて完了" />
 * ```
 */
function EmojiIcon({ emoji, size = "md", className, ...props }: EmojiIconProps) {
  return (
    <span
      data-slot="emoji-icon"
      data-size={size}
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center select-none", SIZE_CLASS[size], className)}
      {...props}
    >
      {emoji}
    </span>
  )
}

export { EmojiIcon }
export type { EmojiIconProps, EmojiIconSize }
