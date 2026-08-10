import * as React from "react"
import { Check } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { IconBadge } from "@/components/ui/icon-badge"
import { Spinner } from "@/components/ui/spinner"

type ActionTileVariant = "neutral" | "selected" | "success" | "info" | "caution"
type QuickActionGridColumns = 2 | 3 | 4 | "auto"
type QuickActionGridGap = "sm" | "md"

interface ActionTileProps extends Omit<React.ComponentProps<"button">, "children"> {
  icon?: React.ReactNode
  emoji?: React.ReactNode
  label: React.ReactNode
  description?: React.ReactNode
  /** カード下段の右端に置く補足情報(例:「所要5分」「要解放」)。選択インジケータには使わない — `indicator` を使う。 */
  meta?: React.ReactNode
  /**
   * 選択状態などを示す小さな表示。**ラベル行の右端**(loading 時に Spinner が入る位置)に置かれる。
   * 省略時、選択状態なら DS 標準のチェックを表示する。表示自体を消したい場合の口は用意していない
   * (選択を色だけで伝えると WCAG 1.4.1 に反するため)。
   */
  indicator?: React.ReactNode
  selected?: boolean
  loading?: boolean
  variant?: ActionTileVariant
}

interface QuickActionGridProps extends React.ComponentProps<"div"> {
  columns?: QuickActionGridColumns
  gap?: QuickActionGridGap
}

const actionTileVariants: Record<ActionTileVariant, string> = {
  neutral: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
  selected: "border-[var(--Brand-Primary)] bg-[var(--Surface-Accent-Primary-Light)] text-[var(--Text-High-Emphasis)]",
  success: "border-[var(--Success-Base)] bg-[var(--Surface-Success-Subtle)] text-[var(--Text-High-Emphasis)]",
  info: "border-[var(--Info-Base)] bg-[var(--Surface-Info-Subtle)] text-[var(--Text-High-Emphasis)]",
  caution: "border-[var(--Caution-Base)] bg-[var(--Surface-Caution-Subtle)] text-[var(--Text-High-Emphasis)]",
}

const gridColumns: Record<QuickActionGridColumns, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  auto: "grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]",
}

function ActionTile({
  className,
  icon,
  emoji,
  label,
  description,
  meta,
  indicator,
  selected = false,
  loading = false,
  variant = selected ? "selected" : "neutral",
  disabled,
  type,
  ...props
}: ActionTileProps) {
  const isDisabled = disabled || loading
  const isSelected = selected || variant === "selected"
  const hasIndicator = indicator !== undefined && indicator !== null && indicator !== false
  // 下段（description / meta）を描くかどうか。下の JSX の描画条件と必ず一致させる
  const hasBottomRow = Boolean(description || meta)
  return (
    <button
      data-slot="action-tile"
      data-variant={variant}
      aria-pressed={isSelected || undefined}
      type={type ?? "button"}
      disabled={isDisabled}
      className={cn(
        // ラベルと説明の間隔は gap トークンだけで決める。justify-between にすると
        // 高さの下限ぶん両者が最大まで引き離され gap が無視された見た目になる（issue #309 の原因2）
        "relative flex flex-col items-start justify-center gap-2 rounded-xl border border-[var(--Border-Low-Emphasis)] px-3 text-left transition-colors",
        // 下段があるタイルだけ 96px の下限を持つ。グリッドで情報量の違うタイルが並ぶときに
        // 高さを揃えるための下限なので、ラベルだけのタイルには効かせない（中身に対して余る）。
        // ラベルのみのときは上下 16px のパディングで内容にフィットさせる
        hasBottomRow ? "min-h-24 py-3" : "py-4",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50 focus-visible:outline-none",
        "hover:bg-[var(--Surface-Secondary)]",
        actionTileVariants[variant],
        isDisabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      <span className="flex w-full items-start justify-between gap-3">
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {emoji && (
            <span className="typo-heading-md shrink-0" aria-hidden>
              {emoji}
            </span>
          )}
          {icon && (
            <IconBadge
              appearance="plain"
              className="size-6 text-[var(--Object-Medium-Emphasis)]"
            >
              {icon}
            </IconBadge>
          )}
          <span className="typo-label-md min-w-0 truncate">{label}</span>
        </span>
        {loading ? (
          <Spinner size="sm" label="処理中" />
        ) : hasIndicator ? (
          <span
            className={cn(
              "shrink-0",
              // 文字列・数値は native 側が resolveTypo("label.md") + text.high-emphasis を当てるので web も揃える。
              // 色は継承に頼らず明示する（消費側の色文脈で崩れるため）
              (typeof indicator === "string" || typeof indicator === "number") &&
                "typo-label-md text-[var(--Text-High-Emphasis)]"
            )}
          >
            {indicator}
          </span>
        ) : isSelected ? (
          // 文字の「✓」グリフはフォント依存で DS のアイコンと太さ・比率が揃わないため
          // iconsax を使う（native は icon ライブラリを持たないので同形を View で描画）
          <span className="shrink-0 text-[var(--Text-Accent-Primary)]" aria-hidden>
            <Check size={16} />
          </span>
        ) : null}
      </span>
      {hasBottomRow && (
        <span className="flex w-full flex-wrap items-end justify-between gap-x-2 gap-y-1">
          {description && (
            <span className="typo-body-sm min-w-[60%] flex-1 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </span>
          )}
          {meta && (
            <span className="typo-label-sm ml-auto shrink-0 text-[var(--Text-Low-Emphasis)]">
              {meta}
            </span>
          )}
        </span>
      )}
    </button>
  )
}

function QuickActionGrid({
  className,
  columns = 3,
  gap = "md",
  ...props
}: QuickActionGridProps) {
  return (
    <div
      data-slot="quick-action-grid"
      className={cn(
        "grid",
        gridColumns[columns],
        gap === "sm" ? "gap-2" : "gap-3",
        className
      )}
      {...props}
    />
  )
}

export { ActionTile, QuickActionGrid }
export type { ActionTileProps, ActionTileVariant, QuickActionGridColumns, QuickActionGridGap, QuickActionGridProps }
