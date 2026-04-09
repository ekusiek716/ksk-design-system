import * as React from "react"
import { cn } from "@/lib/utils"

interface ErrorStateProps extends React.ComponentProps<"div"> {
  icon?: React.ReactNode
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
}

function ErrorState({
  className,
  icon,
  title = "エラーが発生しました",
  description = "しばらくしてからもう一度お試しください",
  onRetry,
  retryLabel = "再試行",
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-[var(--Object-Caution)]">{icon}</div>
      )}
      <h3 className="typo-heading-md text-[var(--Text-High-Emphasis)]">
        {title}
      </h3>
      {description && (
        <p className="typo-body-md text-[var(--Text-Medium-Emphasis)] mt-2 max-w-sm">
          {description}
        </p>
      )}
      {onRetry && (
        <button
          data-slot="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--Brand-Primary)] px-4 h-10 typo-label-md text-[var(--Text-on-Inverse)] hover:bg-[var(--Hover-Primary-Button)] transition-colors cursor-pointer"
        >
          {retryLabel}
        </button>
      )}
    </div>
  )
}

export { ErrorState }
