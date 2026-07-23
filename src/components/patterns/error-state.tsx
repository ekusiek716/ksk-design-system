import * as React from "react"
import { cn } from "@/lib/utils"

type ErrorStateKind = "error" | "notFound"

type NotFoundIllustrationProps = React.ComponentProps<"svg">

function NotFoundIllustration({
  className,
  "aria-hidden": ariaHidden = true,
  ...props
}: NotFoundIllustrationProps) {
  return (
    <svg
      {...props}
      data-slot="not-found-illustration"
      viewBox="0 0 240 160"
      fill="none"
      aria-hidden={ariaHidden}
      className={cn(
        "h-auto w-56 max-w-full text-[var(--Text-Accent-Primary)]",
        className,
      )}
    >
      <path
        d="M32 118C32 87.1 57.1 62 88 62H152C182.9 62 208 87.1 208 118V128H32V118Z"
        fill="var(--Surface-Accent-Primary-Light)"
      />
      <circle
        cx="58"
        cy="42"
        r="12"
        fill="var(--Surface-Secondary)"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx="188"
        cy="54"
        r="7"
        fill="var(--Surface-Primary)"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M82 119V58C82 50.3 88.3 44 96 44H146C153.7 44 160 50.3 160 58V119"
        fill="var(--Surface-Primary)"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M105 119V86C105 78.3 111.3 72 119 72H123C130.7 72 137 78.3 137 86V119"
        fill="var(--Surface-Secondary)"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M98 59H144M51 128H190"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M174 78L190 94M190 78L174 94"
        stroke="var(--Object-Caution)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface ErrorStateProps extends React.ComponentProps<"div"> {
  kind?: ErrorStateKind
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  onRetry?: () => void
  retryLabel?: string
}

function ErrorState({
  className,
  kind = "error",
  icon,
  title,
  description,
  action,
  onRetry,
  retryLabel = "再試行",
  ...props
}: ErrorStateProps) {
  const notFound = kind === "notFound"
  const resolvedIcon =
    icon === undefined && notFound ? <NotFoundIllustration /> : icon
  const resolvedTitle =
    title ??
    (notFound ? "ページが見つかりません" : "エラーが発生しました")
  const resolvedDescription =
    description ??
    (notFound
      ? "お探しのページは移動または削除された可能性があります。"
      : "しばらくしてからもう一度お試しください")

  return (
    <div
      data-slot="error-state"
      data-kind={kind}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
      {...props}
    >
      {resolvedIcon && (
        <div
          className={cn(
            "mb-4",
            notFound
              ? "text-[var(--Text-Accent-Primary)]"
              : "text-[var(--Object-Caution)]",
          )}
        >
          {resolvedIcon}
        </div>
      )}
      <h3 className="typo-heading-md text-[var(--Text-High-Emphasis)]">
        {resolvedTitle}
      </h3>
      {resolvedDescription && (
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2 max-w-sm">
          {resolvedDescription}
        </p>
      )}
      {action ? (
        <div className="mt-6">{action}</div>
      ) : (
        onRetry && (
          <button
            data-slot="button"
            onClick={onRetry}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--Brand-Primary)] px-4 h-10 typo-label-md text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] transition-colors cursor-pointer"
          >
            {retryLabel}
          </button>
        )
      )}
    </div>
  )
}

export { ErrorState, NotFoundIllustration }
export type {
  ErrorStateKind,
  ErrorStateProps,
  NotFoundIllustrationProps,
}
