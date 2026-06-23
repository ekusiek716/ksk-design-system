import * as React from "react"
import { cn } from "@/lib/utils"

interface MobileAppHeaderProps extends React.ComponentProps<"header"> {
  brand: React.ReactNode
  leading?: React.ReactNode
  status?: React.ReactNode
  compactStatus?: React.ReactNode
  actions?: React.ReactNode
  sticky?: boolean
  bordered?: boolean
}

function MobileAppHeader({
  className,
  brand,
  leading,
  status,
  compactStatus,
  actions,
  sticky = true,
  bordered = true,
  children,
  ...props
}: MobileAppHeaderProps) {
  return (
    <header
      data-slot="mobile-app-header"
      className={cn(
        "bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
        sticky && "sticky top-0 z-40",
        bordered && "border-b border-[var(--Border-Low-Emphasis)]",
        className
      )}
      {...props}
    >
      <div className="flex min-h-14 items-center gap-2 px-4">
        {leading && (
          <div data-slot="mobile-app-header-leading" className="flex shrink-0 items-center">
            {leading}
          </div>
        )}
        <div
          data-slot="mobile-app-header-brand"
          className="flex min-w-fit max-w-[58%] shrink-0 items-center overflow-hidden"
        >
          {brand}
        </div>
        <div
          data-slot="mobile-app-header-status-actions"
          className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2"
        >
          {status && (
            <div className="hidden min-w-0 max-w-full items-center overflow-hidden sm:flex">
              {status}
            </div>
          )}
          {(compactStatus ?? status) && (
            <div className="flex shrink-0 items-center sm:hidden">
              {compactStatus ?? status}
            </div>
          )}
          {actions && (
            <div className="flex shrink-0 items-center gap-1">
              {actions}
            </div>
          )}
        </div>
      </div>
      {children}
    </header>
  )
}

export { MobileAppHeader }
export type { MobileAppHeaderProps }
