import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../../ui/scroll-area"

interface AdminShellProps extends React.ComponentProps<"div"> {
  sidebar: React.ReactNode
  header?: React.ReactNode
  sidebarWidth?: string
}

function AdminShell({
  className,
  sidebar,
  header,
  children,
  sidebarWidth = "w-64",
  ...props
}: AdminShellProps) {
  return (
    <div
      data-slot="admin-shell"
      className={cn("flex h-screen bg-[var(--Surface-Secondary)]", className)}
      {...props}
    >
      <aside
        data-slot="admin-sidebar"
        className={cn(
          "hidden lg:flex flex-col border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]",
          sidebarWidth
        )}
      >
        <ScrollArea className="flex-1">{sidebar}</ScrollArea>
      </aside>
      <div className="flex flex-1 flex-col min-w-0">
        {header && (
          <header
            data-slot="admin-header"
            className="flex items-center gap-4 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-6 h-16 shrink-0"
          >
            {header}
          </header>
        )}
        <main data-slot="admin-main" className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export { AdminShell }
