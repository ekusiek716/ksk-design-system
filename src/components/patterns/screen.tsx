import * as React from "react"
import { cn } from "@/lib/utils"
import { SkipLink } from "../ui/skip-link"

type ScreenPadding = "none" | "page"
/** 画面の高さの測り方（issue #701） */
type ScreenHeight = "dvh" | "svh" | "fill"
/** PC 幅（lg = 1024px 以上）での置き方（issue #701） */
type ScreenDesktopLayout = "full" | "card"
/** 本文のランドマーク（issue #701） */
type ScreenLandmark = "main" | "none"

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
  /**
   * 本文の id（スキップリンクの遷移先）。既定は landmark="main" のとき "main-content"、
   * landmark="none" のとき付けない（外側の main と id が重複しないように）。
   */
  mainId?: string
  /** スキップリンクを出すか。既定は landmark="main" のとき true、"none" のとき false */
  skipLink?: boolean
  skipLinkLabel?: string | null
  /**
   * 上端の safe-area（ステータスバー・ダイナミックアイランド）を避ける余白を付ける（issue #701）。
   * header があれば header の上に、無ければ画面の上端に
   * `var(--Safe-Area-Inset-Top, env(safe-area-inset-top))` の余白を足す。
   * PC の中央カード（desktopLayout="card"）では lg 以上で 0 に戻す（カードは画面端に接しない）。
   * @default false（従来どおり）
   */
  safeAreaTop?: boolean
  /**
   * 画面の高さ（issue #701）。
   * - "dvh"（既定）: `100dvh`。アドレスバーの出入りに追従する（従来どおり）
   * - "svh": `100svh`。アドレスバーが出ている状態の小さい方で固定し、スクロール中に高さが揺れない
   * - "fill": 親の高さいっぱい（`100%`）。高さの決まった親の中に置くとき
   */
  height?: ScreenHeight
  /**
   * PC 幅（lg = 1024px 以上）での置き方（issue #701）。
   * - "full"（既定）: 画面いっぱい（従来どおり）
   * - "card": Surface-Secondary の背景の中央に、枠・角丸付きのカードとして置く
   *   （オンボーディング・ログイン等の 1 画面フロー向け）。lg 未満は "full" と同じ
   */
  desktopLayout?: ScreenDesktopLayout
  /** desktopLayout="card" のカードの最大幅（CSS の長さ）。@default "30rem"（480px） */
  cardMaxWidth?: string
  /**
   * desktopLayout="card" のカードの高さ（CSS の長さ）。画面が低いときは `100dvh - 4rem` まで縮む。
   * 本文のスクロールはカードの中で起きる。@default "47.5rem"（760px）
   */
  cardMaxHeight?: string
  /**
   * 本文のランドマーク（issue #701）。
   * - "main"（既定）: 本文を `<main>` にする（従来どおり）
   * - "none": 本文を `<div>` にする。アプリのシェルなど**他の `<main>` の中に置く**とき
   *   （main が二重になるとランドマークの移動が壊れる）。id とスキップリンクは既定で付けない
   */
  landmark?: ScreenLandmark
}

const BODY_PADDING_CLASS: Record<ScreenPadding, string> = {
  none: "",
  page: "px-6 py-6",
}

const HEIGHT_CLASS: Record<ScreenHeight, string> = {
  dvh: "h-[100dvh]",
  svh: "h-[100svh]",
  fill: "h-full",
}

const SAFE_AREA_TOP_CLASS = "pt-[var(--Safe-Area-Inset-Top,env(safe-area-inset-top,0px))]"

/**
 * Screen — 1 画面ぶんの骨組み（header / スクロールする本文 / 下部固定 footer）。
 *
 * PC の中央カード（desktopLayout="card"）は、lg 以上で背景（Surface-Secondary）の
 * 中央に枠・角丸付きのカードとして置く。カードの寸法は cardMaxWidth / cardMaxHeight。
 * 外側の背景は `data-slot="screen-backdrop"`（lg 未満は素通しのブロック）。
 */
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
  mainId,
  skipLink,
  skipLinkLabel = "コンテンツへ移動",
  safeAreaTop = false,
  height = "dvh",
  desktopLayout = "full",
  cardMaxWidth,
  cardMaxHeight,
  landmark = "main",
  style,
  ...props
}: ScreenProps) {
  const isCard = desktopLayout === "card"
  const isMain = landmark === "main"
  const resolvedMainId = mainId ?? (isMain ? "main-content" : undefined)
  const showSkipLink = (skipLink ?? isMain) && Boolean(skipLinkLabel) && resolvedMainId !== undefined
  const Body = isMain ? "main" : "div"
  // カードの PC では画面端に接しないので safe-area の余白を戻す
  const safeAreaTopClass = safeAreaTop
    ? cn(SAFE_AREA_TOP_CLASS, isCard && "lg:pt-0")
    : undefined

  const screen = (
    <div
      data-slot="screen"
      data-scroll={scroll}
      data-padding={padding}
      data-height={height}
      data-desktop-layout={desktopLayout}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden bg-[var(--Surface-Primary)] text-[var(--Text-High-Emphasis)]",
        HEIGHT_CLASS[height],
        // lg 以上のカード: 寸法は inline の変数（未指定はフォールバックの既定値）
        isCard &&
          "lg:h-[min(var(--ksk-screen-card-max-height,47.5rem),calc(100dvh_-_4rem))] lg:w-full lg:max-w-[var(--ksk-screen-card-max-width,30rem)] lg:rounded-2xl lg:border lg:border-[var(--Border-Low-Emphasis)]",
        !header && safeAreaTopClass,
        className,
      )}
      style={{
        ...(cardMaxWidth !== undefined && { "--ksk-screen-card-max-width": cardMaxWidth }),
        ...(cardMaxHeight !== undefined && { "--ksk-screen-card-max-height": cardMaxHeight }),
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {showSkipLink && <SkipLink targetId={resolvedMainId!} label={skipLinkLabel!} />}
      {header && (
        <div
          data-slot="screen-header"
          className={cn("shrink-0", safeAreaTopClass, headerClassName)}
        >
          {header}
        </div>
      )}
      <Body
        id={resolvedMainId}
        tabIndex={resolvedMainId !== undefined ? -1 : undefined}
        data-slot="screen-body"
        className={cn(
          "flex-1 min-h-0",
          scroll ? "overflow-y-auto overscroll-contain" : "overflow-hidden",
          BODY_PADDING_CLASS[padding],
          bodyClassName,
        )}
      >
        {children}
      </Body>
      {footer && (
        <footer
          data-slot="screen-footer"
          className={cn(
            "shrink-0 bg-[var(--Surface-Primary)] px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)_+_1rem)]",
            footerClassName,
          )}
        >
          {footer}
        </footer>
      )}
    </div>
  )

  if (!isCard) return screen
  return (
    <div
      data-slot="screen-backdrop"
      className="lg:flex lg:min-h-[100dvh] lg:items-center lg:justify-center lg:bg-[var(--Surface-Secondary)] lg:p-8"
    >
      {screen}
    </div>
  )
}

export { Screen }
export type { ScreenDesktopLayout, ScreenHeight, ScreenLandmark, ScreenPadding, ScreenProps }
