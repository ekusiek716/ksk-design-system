import * as React from "react"
import { cn } from "@/lib/utils"

type KanbanColumnTone = "neutral" | "accent" | "info" | "success" | "warning" | "caution"

interface KanbanColumnProps extends Omit<React.ComponentProps<"section">, "title"> {
  /** 列見出し（「未着手」「進行中」等）。列（region）の読み上げ名にもなる */
  title: React.ReactNode
  /** 件数。見出しの右に出す（読み上げでは見出しに続けて「n件」） */
  count?: number
  /** 見出し左の色ドット（状態の意味）。色だけで意味を伝えず、title で言葉でも示す */
  tone?: KanbanColumnTone
  /**
   * 見出し左の色ドットを任意の色で塗る（issue #702）。分類の識別色（カテゴリ別のボード等）用で、
   * DS の `var(--Categorical-1)`〜`var(--Categorical-16)` を渡す想定（CSS の色ならよい）。
   * 指定時は `tone` より優先する。意味色（状態）は tone を使う。
   * 色だけで分類を伝えない（title の言葉が正）。列の上辺の太い色帯は付けない。
   */
  accentColor?: string
  /** 見出し右端の操作（KebabMenu 等） */
  action?: React.ReactNode
  /** 列の末尾（AddTile size="sm" 等） */
  footer?: React.ReactNode
  /** 件数の読み上げ・表示の文言。既定 `${n}件` */
  countLabel?: (count: number) => string
  /** 列の幅。fixed=18rem（横スクロールのボード向け・既定）/ fluid=親幅 */
  width?: "fixed" | "fluid"
}

const DOT_TONE: Record<KanbanColumnTone, string> = {
  neutral: "bg-[var(--Object-Medium-Emphasis)]",
  accent: "bg-[var(--Object-Accent-Primary)]",
  info: "bg-[var(--Object-Info)]",
  success: "bg-[var(--Object-Success)]",
  warning: "bg-[var(--Object-Warning)]",
  caution: "bg-[var(--Object-Caution)]",
}

/**
 * KanbanColumn — カンバンの列の入れ物（issue #679）
 *
 * 見出し（色ドット + title + 件数 + action）・カードを縦に積む本体・footer（AddTile 等）を持つ。
 * 面は Surface-Secondary、カードは中に Card elevation="none" 等を置く。列の上辺に太い色帯は付けない
 * （状態はドットと見出しの言葉で示す）。並べる側は `flex gap-4 overflow-x-auto` で横に並べる。
 * ドラッグ＆ドロップは持たない（consumer のライブラリで包む）。
 */
function KanbanColumn({
  title,
  count,
  tone,
  accentColor,
  action,
  footer,
  countLabel,
  width = "fixed",
  className,
  children,
  ...props
}: KanbanColumnProps) {
  const titleId = React.useId()
  const label = countLabel ?? ((n: number) => `${n}件`)
  // 空文字（未設定の分類色を "" で渡す等）は指定なしとして tone へフォールバックする
  const accent = accentColor?.trim() ? accentColor : undefined
  return (
    <section
      data-slot="kanban-column"
      data-tone={tone}
      data-accent={accent !== undefined || undefined}
      aria-labelledby={titleId}
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-lg bg-[var(--Surface-Secondary)] p-3",
        width === "fixed" ? "w-72 shrink-0" : "w-full",
        className
      )}
      {...props}
    >
      <div data-slot="kanban-column-header" className="flex min-h-8 items-center gap-2">
        {accent !== undefined ? (
          // 任意色は inline の変数で渡し、クラスは固定文字列にする（動的クラスは静的抽出できない）
          <span
            aria-hidden="true"
            data-slot="kanban-column-dot"
            className="size-2 shrink-0 rounded-full bg-[var(--ksk-kanban-accent)]"
            style={{ "--ksk-kanban-accent": accent } as React.CSSProperties}
          />
        ) : (
          tone && (
            <span
              aria-hidden="true"
              data-slot="kanban-column-dot"
              className={cn("size-2 shrink-0 rounded-full", DOT_TONE[tone])}
            />
          )
        )}
        <h3 id={titleId} className="min-w-0 flex-1 truncate typo-label-md text-[var(--Text-High-Emphasis)]">
          {title}
          {count !== undefined && <span className="sr-only">（{label(count)}）</span>}
        </h3>
        {count !== undefined && (
          <span
            aria-hidden="true"
            data-slot="kanban-column-count"
            className="shrink-0 rounded-full bg-[var(--Surface-Tertiary)] px-2 typo-label-xs text-[var(--Text-Medium-Emphasis)]"
          >
            {count}
          </span>
        )}
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div data-slot="kanban-column-body" className="flex min-w-0 flex-col gap-2">
        {children}
      </div>
      {footer && <div data-slot="kanban-column-footer">{footer}</div>}
    </section>
  )
}

export { KanbanColumn }
export type { KanbanColumnProps, KanbanColumnTone }
