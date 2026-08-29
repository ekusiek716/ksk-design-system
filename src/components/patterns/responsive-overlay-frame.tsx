import { cn } from "@/lib/utils"
import { DialogContent } from "../ui/dialog"
import { TitleSurfaceScaleProvider } from "../../lib/title-level"
import { useResponsiveOverlayIsDesktop } from "../ui/responsive-dialog"
import type { SheetContentProps } from "../ui/sheet"
import { BottomSheetFrame, type BottomSheetFramePreset } from "./bottom-sheet-frame"
import { KeyboardAwareSheetFooter, type KeyboardAwareSheetFooterProps } from "./keyboard-aware-sheet-footer"
import { sheetSurfaceClasses, type SheetSurface } from "./sheet-surface"

/**
 * デスクトップ（Dialog）側の面の作り方（issue #472）。
 * BottomSheetFrame の preset ごとに「モバイルの見え方をそのまま中央モーダルへ
 * 移した」寸法を持つ。consumer 側の global CSS で position / transform /
 * width / max-height / radius を `!important` で上書きする必要をなくすのが目的。
 *
 * 幅は DialogContent 既定（sm:max-w-[480px]）を twMerge で置き換える。
 * padding は BottomSheetFrame と同じく持たず（`padding={false}`）、内側の
 * DetailSheetScaffold / ResponsiveOverlayFooter が余白を持つ。
 */
const desktopPresetClasses: Record<BottomSheetFramePreset, string> = {
  // 全画面級。デスクトップでは「背の高い中央モーダル」に落とす。
  "mobile-full": "sm:max-w-xl max-h-[min(90dvh,44rem)] flex flex-col overflow-hidden",
  "mobile-page": "sm:max-w-xl max-h-[min(90dvh,44rem)] flex flex-col overflow-hidden",
  // フォーム。モバイルの sm:max-w-lg をそのまま踏襲する。
  "mobile-form": "sm:max-w-lg max-h-[min(85dvh,40rem)] flex flex-col overflow-hidden",
  // 元からデスクトップ想定の floating。中央モーダルとしての寸法は同じ。
  "desktop-floating": "sm:max-w-xl max-h-[min(86dvh,42rem)] flex flex-col overflow-hidden",
}

/**
 * 全画面級 preset（#341 / BottomSheetFrame の pageScalePresets と同じ集合）。
 * デスクトップ（中央モーダル）でも同じ preset を選んだ以上タイトル階層は
 * 揃えるべきなので、DialogContent が内側に置く "dialog" 文脈をここで
 * 上書きし直す（issue #472）。
 */
const pageScalePresets = new Set<BottomSheetFramePreset>(["mobile-full", "mobile-page"])

interface ResponsiveOverlayFrameProps extends Omit<SheetContentProps, "side" | "padding"> {
  /**
   * モバイル側の BottomSheetFrame preset。デスクトップでも対応する
   * 中央モーダルの寸法へ写像される。既定 "mobile-form"。
   */
  preset?: BottomSheetFramePreset
  /** 面の素材。モバイル / デスクトップの両方に効く。既定 "default"。 */
  surface?: SheetSurface
  /** モバイル（BottomSheetFrame）側にだけ足す className。 */
  mobileClassName?: string
  /** デスクトップ（DialogContent）側にだけ足す className。 */
  desktopClassName?: string
  /**
   * デスクトップ側の縦位置。既定 "center"。
   * preset の寸法をそのまま全画面へ広げたい場合のみ "fullscreen" を使う。
   */
  desktopPosition?: "center" | "top" | "fullscreen"
}

/**
 * BottomSheetFrame の preset をモバイルで保ったまま、デスクトップでは
 * DialogContent（中央モーダル）として出すレスポンシブ overlay frame（issue #472）。
 *
 * 切り替え境界は親の `<ResponsiveDialog breakpoint="md" | "lg" | "product-theme">`
 * が決める。`<ResponsiveDialog snapPoints={...}>` の snap シートは境界を越えても
 * シートのまま（snap は「掴んで高さを変える」操作そのものが機能のため）。
 *
 * `description` / `autoFocus` / `restoreFocusOnClose` / `closeOnEsc` /
 * `bodyScrollLock` / `zIndex` は両分岐へそのまま渡る（DialogContent と
 * SheetContent が同名・同義の prop を持つ）。`container` / `overlayClassName` /
 * `glassOverlay` / `swipeToClose` はシート固有なのでデスクトップでは無視される。
 *
 * @example
 * <ResponsiveDialog open={open} onOpenChange={setOpen} breakpoint="md">
 *   <ResponsiveOverlayFrame preset="mobile-form" description="タスクを編集します">
 *     <DetailSheetScaffold
 *       header={<DetailSheetHeader title="タスクを編集" />}
 *       footer={<ResponsiveOverlayFooter><Button>保存</Button></ResponsiveOverlayFooter>}
 *     >
 *       …fields…
 *     </DetailSheetScaffold>
 *   </ResponsiveOverlayFrame>
 * </ResponsiveDialog>
 */
function ResponsiveOverlayFrame({
  preset = "mobile-form",
  surface = "default",
  className,
  mobileClassName,
  desktopClassName,
  desktopPosition = "center",
  children,
  ...props
}: ResponsiveOverlayFrameProps) {
  const isDesktop = useResponsiveOverlayIsDesktop()

  if (isDesktop) {
    // シート固有の prop はデスクトップ（中央モーダル）に意味が無いので落とす。
    const {
      container: _container,
      overlayClassName: _overlayClassName,
      glassOverlay: _glassOverlay,
      swipeToClose: _swipeToClose,
      ...dialogProps
    } = props
    return (
      <DialogContent
        data-frame="responsive-overlay-frame"
        data-preset={preset}
        data-surface={surface}
        position={desktopPosition}
        padding={false}
        className={cn(
          desktopPresetClasses[preset],
          sheetSurfaceClasses[surface],
          className,
          desktopClassName
        )}
        {...dialogProps}
      >
        {/*
          DialogContent は children を "dialog" 文脈で包むため、全画面級 preset は
          その内側で "page" 文脈に包み直してモバイル側と見出し階層を揃える。
          desktopPosition="fullscreen" は DialogContent 自身が "page" にするので
          結果は同じ（明示しても害はない）。
        */}
        <TitleSurfaceScaleProvider scale={pageScalePresets.has(preset) ? "page" : "dialog"}>
          {children}
        </TitleSurfaceScaleProvider>
      </DialogContent>
    )
  }

  return (
    <BottomSheetFrame
      preset={preset}
      surface={surface}
      className={cn(className, mobileClassName)}
      {...props}
    >
      {children}
    </BottomSheetFrame>
  )
}

/**
 * ResponsiveOverlayFrame 用のフッタ。モバイルでは KeyboardAwareSheetFooter
 * （ソフトキーボード追従 + home indicator の safe-area）、デスクトップでは
 * 同じ見た目の静的フッタになる（デスクトップにはソフトキーボードが無いため、
 * sticky と visualViewport 追従を外す）。
 */
function ResponsiveOverlayFooter({
  behavior = "fixed",
  surface = "default",
  hideWhenInputFocused,
  className,
  children,
  ...props
}: KeyboardAwareSheetFooterProps) {
  const isDesktop = useResponsiveOverlayIsDesktop()

  if (isDesktop) {
    return (
      <div
        data-slot="keyboard-aware-sheet-footer"
        data-behavior={behavior}
        data-surface={surface}
        className={cn(
          "shrink-0 bg-[var(--Surface-Primary)] px-5 pt-3 pb-4",
          "border-t border-[var(--Border-Low-Emphasis)]",
          sheetSurfaceClasses[surface],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <KeyboardAwareSheetFooter
      behavior={behavior}
      surface={surface}
      hideWhenInputFocused={hideWhenInputFocused}
      className={className}
      {...props}
    >
      {children}
    </KeyboardAwareSheetFooter>
  )
}

export { ResponsiveOverlayFrame, ResponsiveOverlayFooter }
export type { ResponsiveOverlayFrameProps }
/** ResponsiveOverlayFooter の props（KeyboardAwareSheetFooter と同型）。 */
export type { KeyboardAwareSheetFooterProps as ResponsiveOverlayFooterProps }
