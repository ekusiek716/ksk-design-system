import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const bannerVariants = cva(
  "flex items-start gap-3 rounded-lg border p-4",
  {
    variants: {
      variant: {
        info: "border-[var(--Border-Info)] bg-[var(--Surface-Info)] text-[var(--Text-Info)]",
        success: "border-[var(--Border-Success)] bg-[var(--Surface-Success)] text-[var(--Text-Success)]",
        warning: "border-[var(--Border-Medium-Emphasis)] bg-[var(--Surface-Warning)] text-[var(--Text-Warning)]",
        caution: "border-[var(--Border-Caution)] bg-[var(--Surface-Caution)] text-[var(--Text-Caution)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

interface BannerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof bannerVariants> {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

function Banner({
  className,
  variant,
  icon,
  title,
  description,
  action,
  children,
  ...props
}: BannerProps) {
  return (
    <div
      data-slot="banner"
      role="alert"
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="typo-label-md text-[var(--Text-High-Emphasis)]">{title}</p>
        )}
        {description && (
          <p className="typo-body-sm mt-1">{description}</p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export { Banner, bannerVariants }
