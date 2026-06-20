import * as React from "react"
import { cn } from "@/lib/utils"

type ScreenPadding = "none" | "page"

interface ScreenProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** スクロールする本文 */
  children: React.ReactNode
  /** 下部固定 CTA。safe-area 分の余白を自動付与する */
  footer?: React.ReactNode
  /** 上部固定ヘッダ */
  header?: React.ReactNode
  /** default true。false で 1 画面固定にする */
  scroll?: boolean
  /** 既定の本文パディング */
  padding?: ScreenPadding
  bodyClassName?: string
  headerClassName?: string
  footerClassName?: string
}

const BODY_PADDING_CLASS: Record<ScreenPadding, string> = {
  none: "",
  page: "px-6 py-6",
}

function Screen({
  children,
  footer,
  header,
  scroll = true,
  padding = "page",
  className,
  bodyClassName,
  headerClassName,
  footerClassName,
  ...props
}: ScreenProps) {
  return (
    <div
      data-slot="screen"
      data-scroll={scroll}
      data-padding={padding}
      className={cn(
        "flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
        className,
      )}
      {...props}
    >
      {header && (
        <div
          data-slot="screen-header"
          className={cn("shrink-0", headerClassName)}
        >
          {header}
        </div>
      )}
      <main
        data-slot="screen-body"
        className={cn(
          "flex-1 min-h-0",
          scroll ? "overflow-y-auto overscroll-contain" : "overflow-hidden",
          BODY_PADDING_CLASS[padding],
          bodyClassName,
        )}
      >
        {children}
      </main>
      {footer && (
        <footer
          data-slot="screen-footer"
          className={cn(
            "shrink-0 bg-[var(--Surface-Primary)] px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]",
            footerClassName,
          )}
        >
          {footer}
        </footer>
      )}
    </div>
  )
}

export { Screen }
export type { ScreenPadding, ScreenProps }
