import * as React from "react"
import { cn } from "@/lib/utils"

interface HighlightProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** 本文 */
  text: string
  /** 検索語。空・空白だけのときは強調しない。正規表現の特殊文字はそのまま文字として扱う */
  query: string
  /** 大文字と小文字を区別する（既定 false） */
  caseSensitive?: boolean
  /** <mark> に足す className（余白の微調整等。色は変えない） */
  markClassName?: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * 本文を一致部分と非一致部分に分ける（Highlight の中身・テスト用に公開）。
 * query の前後の空白は無視する。
 */
function splitHighlight(text: string, query: string, caseSensitive = false): { text: string; match: boolean }[] {
  const q = query.trim()
  if (!q) return [{ text, match: false }]
  const re = new RegExp(`(${escapeRegExp(q)})`, caseSensitive ? "g" : "gi")
  return text
    .split(re)
    .filter((part) => part !== "")
    .map((part) => ({ text: part, match: caseSensitive ? part === q : part.toLowerCase() === q.toLowerCase() }))
}

/**
 * Highlight — 本文中の検索一致を `<mark>` で強調する（issue #692）
 *
 * 面は `--Surface-Highlight`、文字は `--Text-on-Highlight`（light / dark で AA）。
 * 状態色（Warning / Object-Warning）を一致の面に流用しない。
 *
 * ```tsx
 * <Highlight text={task.title} query={keyword} />
 * ```
 */
function Highlight({ text, query, caseSensitive = false, markClassName, className, ...props }: HighlightProps) {
  const parts = splitHighlight(text, query, caseSensitive)
  return (
    <span data-slot="highlight" className={className} {...props}>
      {parts.map((part, i) =>
        part.match ? (
          <mark
            key={i}
            data-slot="highlight-mark"
            className={cn("rounded-sm bg-[var(--Surface-Highlight)] text-[var(--Text-on-Highlight)]", markClassName)}
          >
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={i}>{part.text}</React.Fragment>
        )
      )}
    </span>
  )
}

export { Highlight, splitHighlight }
export type { HighlightProps }
