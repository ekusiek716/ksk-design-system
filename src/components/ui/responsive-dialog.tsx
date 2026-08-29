import * as React from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "./dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetTrigger, type SheetProps } from "./sheet"

function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback((onChange: () => void) => {
    if (typeof window === "undefined") return () => {}
    const mql = window.matchMedia(query)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])
  const getSnapshot = React.useCallback(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
    [query],
  )
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/**
 * デスクトップ表示へ切り替える境界（desktop transition point / issue #472）。
 * Tailwind の同名ブレークポイントと 1px も違わない。
 * - "product-theme": `--Overlay-Desktop-Breakpoint`（product theme の公開変数）
 *   を読む。プロダクト単位で境界を揃えたいときに使う。
 */
type ResponsiveOverlayBreakpoint = "sm" | "md" | "lg" | "xl" | "product-theme"

const responsiveOverlayBreakpointQueries: Record<
  Exclude<ResponsiveOverlayBreakpoint, "product-theme">,
  string
> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
}

/** 既定の境界。従来の ResponsiveDialog（768px 固定）と同値。 */
const DEFAULT_RESPONSIVE_OVERLAY_QUERY = responsiveOverlayBreakpointQueries.md

/** product theme 側で境界を差し替えるための公開 CSS 変数。 */
const RESPONSIVE_OVERLAY_BREAKPOINT_VAR = "--Overlay-Desktop-Breakpoint"

interface ResponsiveOverlayBreakpointOptions {
  /**
   * デスクトップ表示へ切り替える境界。既定 "md"（768px = 従来の固定値）。
   * "product-theme" を選ぶと `--Overlay-Desktop-Breakpoint` を読む。
   */
  breakpoint?: ResponsiveOverlayBreakpoint
  /**
   * 上記プリセットで表せない境界のための escape hatch。
   * 生のメディアクエリ文字列（例 `"(min-width: 900px)"`）。指定時は
   * `breakpoint` より優先される。
   */
  breakpointQuery?: string
}

/**
 * product theme の `--Overlay-Desktop-Breakpoint`（`:root`）を読んで
 * `(min-width: <値>)` にマッチしているかを返す。
 *
 * メディアクエリは CSS 変数を直接解釈できないため、getComputedStyle で実値を
 * 読んでから matchMedia を組み立てる。値は CSS 由来の外部状態なので
 * useSyncExternalStore で購読する（effect からの setState を挟まないため、
 * hydration 後の一瞬だけ誤った分岐が描画されることがない）。
 * マッチが変わり得るのは viewport 幅が変わったときなので resize を購読する。
 */
function resolveProductThemeQuery(): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return DEFAULT_RESPONSIVE_OVERLAY_QUERY
  }
  const raw = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(RESPONSIVE_OVERLAY_BREAKPOINT_VAR)
    .trim()
  return raw ? `(min-width: ${raw})` : DEFAULT_RESPONSIVE_OVERLAY_QUERY
}

/**
 * product theme 経路の購読。マッチが変わり得るのは
 * (1) viewport 幅が変わったとき（resize）
 * (2) `--Overlay-Desktop-Breakpoint` の値そのものが変わったとき
 *     （テーマ切替などで `:root` の style / class が差し替わる）
 * の2つなので、両方を購読する。
 * `breakpoint` が product-theme 以外のときは購読も getComputedStyle も行わない
 * （全 ResponsiveDialog に resize リスナと強制スタイル再計算を負わせないため）。
 */
function subscribeToProductThemeBreakpoint(onChange: () => void) {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {}
  window.addEventListener("resize", onChange)
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style", "class"],
  })
  return () => {
    window.removeEventListener("resize", onChange)
    observer.disconnect()
  }
}

function useProductThemeDesktopMatch(enabled: boolean): boolean {
  const subscribe = React.useCallback(
    (onChange: () => void) => (enabled ? subscribeToProductThemeBreakpoint(onChange) : () => {}),
    [enabled]
  )
  const getSnapshot = React.useCallback(() => {
    if (!enabled || typeof window === "undefined") return false
    return window.matchMedia(resolveProductThemeQuery()).matches
  }, [enabled])
  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/**
 * `breakpoint` / `breakpointQuery` から「今デスクトップか」を判定する。
 * hooks は条件付きで呼べないため両方のフックを呼び、使う側だけを有効にする。
 */
function useResponsiveOverlayDesktopMatch({
  breakpoint = "md",
  breakpointQuery,
}: ResponsiveOverlayBreakpointOptions = {}): boolean {
  const usesProductTheme = !breakpointQuery && breakpoint === "product-theme"
  const staticQuery =
    breakpointQuery ??
    (breakpoint === "product-theme"
      ? DEFAULT_RESPONSIVE_OVERLAY_QUERY
      : responsiveOverlayBreakpointQueries[breakpoint])
  // product-theme のときは静的クエリ側も購読するが、結果は使わない。
  // matchMedia の購読は安価（リスナ1つ）で、hooks 規則上どちらも呼ぶ必要がある。
  const staticMatch = useMediaQuery(staticQuery)
  const productThemeMatch = useProductThemeDesktopMatch(usesProductTheme)
  return usesProductTheme ? productThemeMatch : staticMatch
}

interface ResponsiveOverlayContextValue {
  isDesktop: boolean
}

const ResponsiveOverlayContext =
  React.createContext<ResponsiveOverlayContextValue | null>(null)

/**
 * 直近の <ResponsiveDialog> が決めた「今デスクトップか」を返す。
 * ResponsiveDialog の外で単体利用された場合は既定の md 境界で自己判定する
 * （従来挙動との後方互換）。
 */
function useResponsiveOverlayIsDesktop(): boolean {
  const ctx = React.useContext(ResponsiveOverlayContext)
  // hooks は条件付きで呼べないため、context がある場合も購読自体は行う。
  const standalone = useMediaQuery(DEFAULT_RESPONSIVE_OVERLAY_QUERY)
  return ctx ? ctx.isDesktop : standalone
}

interface ResponsiveDialogProps
  extends Omit<SheetProps, "children">,
    ResponsiveOverlayBreakpointOptions {
  children: React.ReactNode
}

function ResponsiveDialog({
  children,
  breakpoint,
  breakpointQuery,
  // ─ Sheet 専用 props。デスクトップ（Dialog）へは渡さない ─
  snapPoints,
  activeSnapPoint,
  setActiveSnapPoint,
  fadeFromIndex,
  dismissible,
  overlay,
  // ─ Dialog / Sheet 共通 ─
  open,
  defaultOpen,
  onOpenChange,
  modal,
  ...props
}: ResponsiveDialogProps) {
  const matchesDesktop = useResponsiveOverlayDesktopMatch({ breakpoint, breakpointQuery })
  // snap point 付きのシートはデスクトップでもシートのまま（issue #472）。
  // snap は「掴んで高さを変える」操作そのものが機能なので、中央モーダルへ
  // 変換すると意味が失われる。
  const hasSnapPoints = (snapPoints?.length ?? 0) > 0
  const isDesktop = matchesDesktop && !hasSnapPoints
  const value = React.useMemo(() => ({ isDesktop }), [isDesktop])

  return (
    <ResponsiveOverlayContext.Provider value={value}>
      {isDesktop ? (
        <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
          {children}
        </Dialog>
      ) : (
        <Sheet
          snapPoints={snapPoints}
          activeSnapPoint={activeSnapPoint}
          setActiveSnapPoint={setActiveSnapPoint}
          fadeFromIndex={fadeFromIndex}
          dismissible={dismissible}
          overlay={overlay}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          modal={modal}
          {...props}
        >
          {children}
        </Sheet>
      )}
    </ResponsiveOverlayContext.Provider>
  )
}

function ResponsiveDialogTrigger({ children, ...props }: React.ComponentProps<typeof DialogTrigger>) {
  const isDesktop = useResponsiveOverlayIsDesktop()
  if (isDesktop) return <DialogTrigger {...props}>{children}</DialogTrigger>
  return <SheetTrigger {...props}>{children}</SheetTrigger>
}

function ResponsiveDialogContent({
  children,
  className,
  swipeToClose,
  position,
  safeArea,
  padding,
  ...props
}: React.ComponentProps<typeof DialogContent> & {
  /**
   * SP（Sheet）側で下スワイプ閉じ（全面 scroll-aware）を有効化。
   * PC（Dialog）は中央モーダルなので無視される。絞り込みモーダル等で
   * 「SP は下スワイプで閉じたい」ときに付ける。
   */
  swipeToClose?: boolean
}) {
  const isDesktop = useResponsiveOverlayIsDesktop()
  if (isDesktop)
    return (
      <DialogContent
        className={className}
        position={position}
        safeArea={safeArea}
        padding={padding}
        {...props}
      >
        {children}
      </DialogContent>
    )
  return (
    <SheetContent side="bottom" swipeToClose={swipeToClose} padding={padding} className={className} {...props}>
      {children}
    </SheetContent>
  )
}

function ResponsiveDialogHeader({ children, ...props }: React.ComponentProps<"div">) {
  const isDesktop = useResponsiveOverlayIsDesktop()
  if (isDesktop) return <DialogHeader {...props}>{children}</DialogHeader>
  return <SheetHeader {...props}>{children}</SheetHeader>
}

function ResponsiveDialogTitle({ children, ...props }: React.ComponentProps<typeof DialogTitle>) {
  const isDesktop = useResponsiveOverlayIsDesktop()
  if (isDesktop) return <DialogTitle {...props}>{children}</DialogTitle>
  return <SheetTitle {...props}>{children}</SheetTitle>
}

function ResponsiveDialogDescription({ children, ...props }: React.ComponentProps<typeof DialogDescription>) {
  const isDesktop = useResponsiveOverlayIsDesktop()
  if (isDesktop) return <DialogDescription {...props}>{children}</DialogDescription>
  return <SheetDescription {...props}>{children}</SheetDescription>
}

function ResponsiveDialogFooter({
  children,
  className,
  orientation = "split",
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * アクションボタンの並べ方。
   * - "split"（既定）: 均等幅で横並び（各ボタン flex-1）。iOS のボトムシート風。
   * - "stacked": 旧挙動。デスクトップは右寄せ横並び、モバイルは縦積み。
   */
  orientation?: "split" | "stacked"
}) {
  const isDesktop = useResponsiveOverlayIsDesktop()
  if (isDesktop)
    return (
      <DialogFooter className={className} orientation={orientation} {...props}>
        {children}
      </DialogFooter>
    )
  return (
    <div
      data-slot="sheet-footer"
      data-orientation={orientation}
      className={cn(
        orientation === "stacked"
          ? "flex flex-col gap-2 mt-auto"
          : "flex flex-row gap-3 [&>*]:flex-1 [&>*]:basis-0 mt-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function ResponsiveDialogClose({ children, ...props }: React.ComponentProps<typeof DialogClose>) {
  const isDesktop = useResponsiveOverlayIsDesktop()
  if (isDesktop) return <DialogClose {...props}>{children}</DialogClose>
  return <SheetClose {...props}>{children}</SheetClose>
}

export {
  ResponsiveDialog, ResponsiveDialogTrigger, ResponsiveDialogContent,
  ResponsiveDialogHeader, ResponsiveDialogTitle, ResponsiveDialogDescription,
  ResponsiveDialogFooter, ResponsiveDialogClose, useMediaQuery,
  useResponsiveOverlayIsDesktop, useResponsiveOverlayDesktopMatch,
  responsiveOverlayBreakpointQueries, RESPONSIVE_OVERLAY_BREAKPOINT_VAR,
}
export type { ResponsiveDialogProps, ResponsiveOverlayBreakpoint, ResponsiveOverlayBreakpointOptions }
