import * as React from "react"
import { cn } from "@/lib/utils"
import { MobileAppHeader } from "./mobile-app-header"

type MobileAppShellBottomNavMode = "fixed" | "external" | "inline"
type MobileAppShellBottomPadding = "none" | "bottom-nav" | "bottom-nav-fab" | "native-tab-bar"
/** 画面の高さの持ち方（issue #715） */
type MobileAppShellViewport = "flow" | "fixed"

interface MobileAppShellProps extends React.ComponentProps<"div"> {
  header?: React.ReactNode
  bottomNav?: React.ReactNode
  fab?: React.ReactNode
  desktopSidebar?: React.ReactNode
  mainClassName?: string
  contentClassName?: string
  bottomNavMode?: MobileAppShellBottomNavMode
  /**
   * main の下余白。none=0 / bottom-nav=5rem / bottom-nav-fab=7rem /
   * native-tab-bar=`1rem + var(--Native-Tab-Bar-Height, 6rem)`（issue #715。ネイティブの殻がタブバーを描く構成。
   * `--Native-Tab-Bar-Height` はネイティブ側が実測した safe-area 込みの高さを :root に書く任意の変数）。
   * 既定は fab があれば bottom-nav-fab、bottomNav があれば bottom-nav、無ければ none
   */
  bottomPadding?: MobileAppShellBottomPadding
  /**
   * main の下余白に足す長さ（CSS の長さ。issue #681）。画面下に常設する広告バナーの高さなど。
   * bottomPadding の既定余白（bottom-nav=5rem / bottom-nav-fab=7rem / none=0）に加算する。
   * MobileTabBar / MobileFloatingActionButton の `bottomOffsetExtra` と同じ値を渡す。
   */
  bottomPaddingExtra?: string
  /**
   * 画面の高さの持ち方（issue #715）。
   * - "flow"（既定・従来）: 画面の高さ以上に伸び、文書全体がスクロールする
   * - "fixed": ルートを画面の高さ（100svh）に固定し、main だけを縦スクロールさせる。header は main の外にあるので
   *   常に見える。アプリ型の画面（ネイティブの殻に載せる PWA 等）向け。文書がスクロールしないので
   *   アドレスバーの出入りで高さが揺れない svh を使う。desktopSidebar も同じ高さの中で個別にスクロールする
   */
  viewport?: MobileAppShellViewport
  /**
   * 上端の safe-area（ノッチ・ステータスバー）の余白（issue #715。既定 false）。
   * `var(--Safe-Area-Inset-Top, env(safe-area-inset-top))` を、header があれば header（面がノッチの裏まで伸びる）、
   * 無ければ枠の上端に付ける。viewport-fit=cover で Web が画面全体を持つ構成向け
   */
  safeAreaTop?: boolean
  /**
   * main の下余白に下端の safe-area（ホームインジケータ）を足す（issue #715。既定 false）。
   * fixed の BottomTabBar は safe-area の上に浮くので、本文の末尾が隠れないよう同じ量を足す。
   * `bottomPadding="native-tab-bar"` では足さない（ネイティブのタブバーの高さが safe-area 込みのため）
   */
  safeAreaBottom?: boolean
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
  bottomPaddingExtra,
  viewport = "flow",
  safeAreaTop = false,
  safeAreaBottom = false,
  maxWidth = 430,
  centeredPreview = true,
  children,
  ...props
}: MobileAppShellProps) {
  const fixed = viewport === "fixed"
  // #715: 新しい下余白の指定（safeAreaBottom / native-tab-bar）があるときだけ、長さを 1 つの calc に畳んで
  // 変数で渡す。どちらも無いときは従来のクラス（pb-20 / pb-28 / #681 の extra）のまま。
  const usesComposedPadding = safeAreaBottom || bottomPadding === "native-tab-bar"
  const composedPaddingBottom = usesComposedPadding
    ? `calc(${[
        bottomPadding === "native-tab-bar"
          ? "1rem + var(--Native-Tab-Bar-Height, 6rem)"
          : bottomPadding === "bottom-nav-fab"
            ? "7rem"
            : bottomPadding === "bottom-nav"
              ? "5rem"
              : "0px",
        safeAreaBottom && bottomPadding !== "native-tab-bar" ? "env(safe-area-inset-bottom, 0px)" : null,
        bottomPaddingExtra ?? null,
      ]
        .filter(Boolean)
        .join(" + ")})`
    : undefined
  const safeAreaTopClass = "pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]"
  return (
    <div
      data-slot="mobile-app-shell"
      data-viewport={fixed ? "fixed" : undefined}
      className={cn(
        fixed ? "h-[100svh] overflow-hidden" : "min-h-dvh",
        "bg-[var(--Surface-Secondary)] text-[var(--Text-High-Emphasis)]",
        className
      )}
      style={style}
      {...props}
    >
      <div className={cn("mx-auto flex w-full", fixed ? "h-full" : "min-h-dvh")} style={centeredPreview ? { maxWidth } : undefined}>
        {desktopSidebar && (
          <aside
            data-slot="mobile-app-shell-desktop-sidebar"
            className={cn(
              "hidden w-64 shrink-0 border-r border-[var(--Border-Low-Emphasis)] bg-[var(--Surface-Primary)] lg:block",
              fixed && "overflow-y-auto"
            )}
          >
            {desktopSidebar}
          </aside>
        )}
        <div
          data-slot="mobile-app-shell-frame"
          className={cn(
            "relative flex min-w-0 flex-1 flex-col bg-[var(--Surface-Primary)]",
            fixed ? "h-full min-h-0" : "min-h-dvh",
            safeAreaTop && !header && safeAreaTopClass
          )}
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
              className={cn(
                "sticky top-0 z-[var(--Z-Nav)] shrink-0 bg-[var(--Surface-Primary)]",
                safeAreaTop && safeAreaTopClass
              )}
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
              fixed && "overflow-y-auto",
              usesComposedPadding
                ? "pb-[var(--ksk-shell-main-padding-bottom)]"
                : // bottomPaddingExtra（issue #681）は指定時だけ加算する（未指定のクラスは従来どおり）
                  bottomPaddingExtra === undefined
                ? [bottomPadding === "bottom-nav" && "pb-20", bottomPadding === "bottom-nav-fab" && "pb-28"]
                : bottomPadding === "bottom-nav"
                  ? "pb-[calc(5rem_+_var(--ksk-shell-bottom-padding-extra))]"
                  : bottomPadding === "bottom-nav-fab"
                    ? "pb-[calc(7rem_+_var(--ksk-shell-bottom-padding-extra))]"
                    : "pb-[var(--ksk-shell-bottom-padding-extra)]",
              mainClassName
            )}
            style={
              usesComposedPadding
                ? ({ "--ksk-shell-main-padding-bottom": composedPaddingBottom } as React.CSSProperties)
                : bottomPaddingExtra === undefined
                ? undefined
                : ({ "--ksk-shell-bottom-padding-extra": bottomPaddingExtra } as React.CSSProperties)
            }
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
              className="fixed inset-x-0 bottom-0 z-[var(--Z-Nav)] mx-auto w-full pb-[env(safe-area-inset-bottom)] lg:hidden"
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
export type { MobileAppShellBottomNavMode, MobileAppShellBottomPadding, MobileAppShellProps, MobileAppShellViewport }
