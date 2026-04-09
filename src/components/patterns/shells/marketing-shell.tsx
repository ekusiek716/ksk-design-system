import * as React from "react"
import { cn } from "@/lib/utils"

interface MarketingShellProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  footer?: React.ReactNode
}

function MarketingShell({
  className,
  header,
  footer,
  children,
  ...props
}: MarketingShellProps) {
  return (
    <div
      data-slot="marketing-shell"
      className={cn("flex flex-col min-h-screen bg-[var(--Surface-Primary)]", className)}
      {...props}
    >
      {header && (
        <header
          data-slot="marketing-header"
          className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]/95 backdrop-blur px-6 lg:px-16 h-16 shrink-0"
        >
          {header}
        </header>
      )}
      <main data-slot="marketing-main" className="flex-1">
        {children}
      </main>
      {footer && (
        <footer
          data-slot="marketing-footer"
          className="border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Secondary)] px-6 lg:px-16 py-12"
        >
          {footer}
        </footer>
      )}
    </div>
  )
}

export { MarketingShell }
