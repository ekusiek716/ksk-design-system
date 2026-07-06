import * as React from "react"
import { cn } from "@/lib/utils"

type MobileAppShellBottomNavMode = "fixed" | "external" | "inline"
type MobileAppShellBottomPadding = "none" | "bottom-nav" | "bottom-nav-fab"

interface MobileAppShellProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  bottomNav?: React.ReactNode
  fab?: React.ReactNode
  desktopSidebar?: React.ReactNode
  mainClassName?: string
  contentClassName?: string
  bottomNavMode?: MobileAppShellBottomNavMode
  bottomPadding?: MobileAppShellBottomPadding
  maxWidth?: React.CSSProperties["maxWidth"]
  centeredPreview?: boolean
}

function MobileAppShell({
  className,
  style,
  header,
  bottomNav,
  fab,
  desktopSidebar,
  mainClassName,
  contentClassName,
  bottomNavMode = "fixed",
  bottomPadding = fab ? "bottom-nav-fab" : bottomNav ? "bottom-nav" : "none",
  maxWidth = 430,
  centeredPreview = true,
  children,
  ...props
}: MobileAppShellProps) {
  return (
    <div
      data-slot="mobile-app-shell"
      className={cn(
        "min-h-dvh bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
        className
      )}
      style={style}
      {...props}
    >
      <div className="mx-auto flex min-h-dvh w-full" style={centeredPreview ? { maxWidth } : undefined}>
        {desktopSidebar && (
          <aside
            data-slot="mobile-app-shell-desktop-sidebar"
            className="hidden w-64 shrink-0 border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] lg:block"
          >
            {desktopSidebar}
          </aside>
        )}
        <div
          data-slot="mobile-app-shell-frame"
          className="relative flex min-h-dvh min-w-0 flex-1 flex-col bg-[var(--Surface-Primary)]"
        >
          {header && (
            <header
              data-slot="mobile-app-shell-header"
              className="sticky top-0 z-40 shrink-0 bg-[var(--Surface-Primary)]"
            >
              {header}
            </header>
          )}
          <main
            data-slot="mobile-app-shell-main"
            className={cn(
              "min-h-0 flex-1",
              bottomPadding === "bottom-nav" && "pb-20",
              bottomPadding === "bottom-nav-fab" && "pb-28",
              mainClassName
            )}
          >
            <div data-slot="mobile-app-shell-content" className={contentClassName}>
              {children}
            </div>
          </main>
          {bottomNav && bottomNavMode === "inline" && (
            <footer data-slot="mobile-app-shell-bottom-nav-inline" className="shrink-0">
              {bottomNav}
            </footer>
          )}
          {bottomNav && bottomNavMode === "fixed" && (
            <footer
              data-slot="mobile-app-shell-bottom-nav-fixed"
              className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full pb-[env(safe-area-inset-bottom)] lg:hidden"
              style={centeredPreview ? { maxWidth } : undefined}
            >
              {bottomNav}
            </footer>
          )}
          {bottomNav && bottomNavMode === "external" ? bottomNav : null}
          {fab && (
            <div data-slot="mobile-app-shell-fab" className="pointer-events-none">
              {fab}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { MobileAppShell }
export type { MobileAppShellBottomNavMode, MobileAppShellBottomPadding, MobileAppShellProps }
