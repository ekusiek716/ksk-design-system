import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  action?: React.ReactNode
}

function SectionHeader({
  className,
  title,
  description,
  action,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    >
      <div className="min-w-0">
        <h2 className="typo-heading-lg text-[var(--Text-High-Emphasis)]">
          {title}
        </h2>
        {description && (
          <p className="typo-body-sm text-[var(--Text-Medium-Emphasis)] mt-1">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export { SectionHeader }
