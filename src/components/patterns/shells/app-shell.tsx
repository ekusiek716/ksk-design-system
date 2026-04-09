import * as React from "react"
import { cn } from "@/lib/utils"

interface AppShellProps extends React.ComponentProps<"div"> {
  topBar?: React.ReactNode
  bottomNav?: React.ReactNode
}

function AppShell({
  className,
  topBar,
  bottomNav,
  children,
  ...props
}: AppShellProps) {
  return (
    <div
      data-slot="app-shell"
      className={cn("flex flex-col min-h-screen bg-[var(--Surface-Primary)]", className)}
      {...props}
    >
      {topBar && (
        <header
          data-slot="app-topbar"
          className="sticky top-0 z-40 flex items-center border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] px-4 h-14 shrink-0"
        >
          {topBar}
        </header>
      )}
      <main
        data-slot="app-main"
        className={cn("flex-1", bottomNav ? "pb-16" : "")}
      >
        {children}
      </main>
      {bottomNav && (
        <nav
          data-slot="app-bottomnav"
          className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-around border-t border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] h-14"
        >
          {bottomNav}
        </nav>
      )}
    </div>
  )
}

export { AppShell }
