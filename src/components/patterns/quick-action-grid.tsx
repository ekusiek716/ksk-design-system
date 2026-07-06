import * as React from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"

type ActionTileVariant = "neutral" | "selected" | "success" | "info" | "caution"
type QuickActionGridColumns = 2 | 3 | 4 | "auto"
type QuickActionGridGap = "sm" | "md"

interface ActionTileProps extends Omit<React.ComponentProps<"button">, "children"> {
  icon?: React.ReactNode
  emoji?: React.ReactNode
  label: React.ReactNode
  description?: React.ReactNode
  meta?: React.ReactNode
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
  selected = false,
  loading = false,
  variant = selected ? "selected" : "neutral",
  disabled,
  type,
  ...props
}: ActionTileProps) {
  const isDisabled = disabled || loading
  return (
    <button
      data-slot="action-tile"
      data-variant={variant}
      aria-pressed={selected || undefined}
      type={type ?? "button"}
      disabled={isDisabled}
      className={cn(
        "relative flex min-h-24 flex-col items-start justify-between gap-3 rounded-xl border border-[var(--Border-Low-Emphasis)] p-3 text-left transition-colors",
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
            <span className="flex size-6 shrink-0 items-center justify-center text-[var(--Object-Medium-Emphasis)]" aria-hidden>
              {icon}
            </span>
          )}
          <span className="typo-label-md min-w-0 truncate">{label}</span>
        </span>
        {loading && <Spinner size="sm" label="処理中" />}
      </span>
      {(description || meta) && (
        <span className="flex w-full items-end justify-between gap-2">
          {description && (
            <span className="typo-body-sm min-w-0 text-[var(--Text-Medium-Emphasis)]">
              {description}
            </span>
          )}
          {meta && (
            <span className="typo-label-sm shrink-0 text-[var(--Text-Low-Emphasis)]">
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
