import * as React from "react"
import { cn } from "@/lib/utils"
import { MobileAppHeader } from "./mobile-app-header"

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
            // `header` は呼び出し側が渡す任意のノード。素の JSX（<div> 等）を
            // 渡すケースでは banner landmark が無くなってしまうため、この
            // ラッパー自体は <header> のまま維持する。ただし `header` が
            // <MobileAppHeader>（実体は <header>）のときは banner landmark が
            // 入れ子・重複してしまう（axe: landmark-banner-is-top-level /
            // landmark-no-duplicate-banner / landmark-unique）ため、その場合は
            // MobileAppHeader 側に landmark={false} を注入して <div> 化させ、
            // banner landmark はこのシェル側 <header> 1つだけに一本化する。
            <header
              data-slot="mobile-app-shell-header"
              className="sticky top-0 z-40 shrink-0 bg-[var(--Surface-Primary)]"
            >
              {React.isValidElement(header) && header.type === MobileAppHeader
                ? React.cloneElement(
                    header as React.ReactElement<{ landmark?: boolean }>,
                    { landmark: false }
                  )
                : header}
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
            <div data-slot="mobile-app-shell-fab">{fab}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export { MobileAppShell }
export type { MobileAppShellBottomNavMode, MobileAppShellBottomPadding, MobileAppShellProps }
