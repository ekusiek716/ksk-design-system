import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "../../ui/container"
import { SkipLink } from "../../ui/skip-link"

interface AppShellProps extends React.ComponentProps<"div"> {
  topBar?: React.ReactNode
  bottomNav?: React.ReactNode
  mainId?: string
  skipLink?: boolean
  skipLinkLabel?: string | null
}

function AppShell({
  className,
  topBar,
  bottomNav,
  mainId = "main-content",
  skipLink = true,
  skipLinkLabel = "コンテンツへ移動",
  children,
  ...props
}: AppShellProps) {
  return (
    <div
      data-slot="app-shell"
      className={cn("flex flex-col min-h-screen bg-[var(--Surface-Primary)]", className)}
      {...props}
    >
      {skipLink && skipLinkLabel && <SkipLink targetId={mainId} label={skipLinkLabel} />}
      {topBar && (
        <header
          data-slot="app-topbar"
          className="sticky top-0 z-40 h-14 shrink-0 border-b border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)]"
        >
          <Container size="fluid" gutter="tight" className="flex h-full items-center">
            {topBar}
          </Container>
        </header>
      )}
      <main
        id={mainId}
        tabIndex={-1}
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
export type { AppShellProps }
