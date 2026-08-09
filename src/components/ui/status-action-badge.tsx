import * as React from "react"
import { cn } from "@/lib/utils"

type StatusActionBadgeState = "idle" | "pending" | "syncing" | "success" | "warning" | "error" | "offline"

interface StatusActionBadgeProps extends Omit<React.ComponentProps<"button">, "children"> {
  state?: StatusActionBadgeState
  label: string
  count?: number
  compact?: boolean
  loading?: boolean
  icon?: React.ReactNode
  asStatus?: boolean
}

const stateClasses: Record<StatusActionBadgeState, string> = {
  idle: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] text-[var(--Text-Medium-Emphasis)]",
  pending: "border-[var(--Border-Warning)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
  syncing: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
  success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
  warning: "border-[var(--Border-Warning)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
  error: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
  offline: "border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] text-[var(--Text-Low-Emphasis)]",
}

const buttonOnlyPropNames = [
  "form",
  "formAction",
  "formEncType",
  "formMethod",
  "formNoValidate",
  "formTarget",
  "name",
  "value",
] as const

function omitButtonOnlyProps(props: React.ComponentProps<"button">): React.ComponentProps<"span"> {
  const statusProps = { ...props } as Record<string, unknown>
  for (const propName of buttonOnlyPropNames) {
    delete statusProps[propName]
  }
  return statusProps as React.ComponentProps<"span">
}

function StatusDot({
  state,
  loading,
  icon,
}: {
  state: StatusActionBadgeState
  loading: boolean
  icon?: React.ReactNode
}) {
  if (icon) return <span aria-hidden className="flex size-4 items-center justify-center">{icon}</span>
  if (loading || state === "syncing") {
    return (
      <span
        aria-hidden
        className="size-3 rounded-full border-[1.5px] border-current border-t-transparent animate-spin"
      />
    )
  }
  return <span aria-hidden className="size-1.5 rounded-full bg-current" />
}

function StatusActionBadge({
  className,
  state = "idle",
  label,
  count,
  compact = false,
  loading = false,
  icon,
  asStatus = false,
  onClick,
  type,
  disabled,
  ...props
}: StatusActionBadgeProps) {
  const interactive = Boolean(onClick) && !asStatus
  const content = (
    <>
      <StatusDot state={state} loading={loading} icon={icon} />
      {compact ? (
        <span className="sr-only">{label}</span>
      ) : (
        <span className="max-w-[9rem] truncate">{label}</span>
      )}
      {count != null && count > 0 && (
        <span
          data-slot="status-action-badge-count"
          className={cn(
            "ml-0.5 rounded-full bg-[var(--Surface-Primary)] px-1.5 py-0.5 typo-label-xs",
            "text-[var(--Text-High-Emphasis)]"
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </>
  )
  const classes = cn(
    "inline-flex max-w-full items-center justify-center gap-1.5 rounded-full border border-[var(--Border-Low-Emphasis)] px-2.5 py-1",
    "typo-label-xs select-none",
    stateClasses[state],
    // タップ最小寸法は押せるときだけ。非対話（asStatus / onClick 無し）で残すと中身に対して
    // 上下が余り縦に間延びする（issue #316。native 側と同じ構造の不具合）
    interactive && "min-h-9",
    interactive && "cursor-pointer transition-colors hover:bg-[var(--Surface-Tertiary)]",
    interactive && "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--Focus-High-Emphasis)]/50",
    disabled && "opacity-50",
    compact && interactive && "min-w-9 px-2",
    // compact の非対話は左右パディングだけが残ると横長の楕円になるため、上下と同値にして正円を保つ
    compact && !interactive && "p-1",
    className
  )

  if (!interactive) {
    const statusProps = omitButtonOnlyProps(props)

    return (
      <span
        data-slot="status-action-badge"
        data-state={state}
        data-compact={compact || undefined}
        role={state === "error" ? "alert" : "status"}
        aria-live={state === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className={classes}
        {...statusProps}
      >
        {content}
      </span>
    )
  }

  return (
    <button
      data-slot="status-action-badge"
      data-state={state}
      data-compact={compact || undefined}
      type={type ?? "button"}
      aria-label={props["aria-label"] ?? label}
      aria-busy={loading || state === "syncing" || undefined}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {content}
    </button>
  )
}

const SyncStatusButton = StatusActionBadge

export { StatusActionBadge, SyncStatusButton }
export type { StatusActionBadgeProps, StatusActionBadgeState }
