import { cn } from "@/lib/utils"
import { SheetContent, type SheetContentProps } from "../ui/sheet"
import { TitleSurfaceScaleProvider } from "../../lib/title-level"
import { sheetSurfaceClasses, type SheetSurface } from "./sheet-surface"

type BottomSheetFramePreset = "mobile-full" | "mobile-form" | "mobile-page" | "desktop-floating"

interface BottomSheetFrameProps extends Omit<SheetContentProps, "side" | "padding"> {
  preset?: BottomSheetFramePreset
  /** 見た目だけを glass に切り替える。snap mode の side="bottom" は維持する。 */
  surface?: SheetSurface
}

/**
 * 全画面級の preset（#341）。この配下では SheetTitle の既定が
 * 画面タイトル（H1 / `typo-heading-2xl`）相当になる。
 * `mobile-form` / `desktop-floating` は部分表示なので対象外。
 */
const pageScalePresets = new Set<BottomSheetFramePreset>(["mobile-full", "mobile-page"])

const presetClasses: Record<BottomSheetFramePreset, string> = {
  "mobile-full": [
    "p-0",
    "max-h-[calc(100dvh_-_env(safe-area-inset-top))]",
    "overflow-hidden rounded-t-[var(--Radius-Sheet)]",
    "sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-h-[90dvh] sm:max-w-xl sm:rounded-[var(--Radius-Sheet)]",
  ].join(" "),
  "mobile-form": [
    "p-0",
    "max-h-[88dvh] overflow-hidden rounded-t-[var(--Radius-Sheet)]",
    "sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-w-lg sm:rounded-[var(--Radius-Sheet)]",
  ].join(" "),
  /**
   * iOS ページシート風（#159）。App Store の詳細画面のように、上端に
   * 常時 ~2rem のギャップを残して背後の暗転と上角丸をわずかに覗かせる。
   * ノッチ端末の safe-area は DS 側で一元的に合算する（consumer 側で
   * env() を足し直させない）ので `2rem + env(safe-area-inset-top, 0px)` を
   * まとめて max-height から差し引く。
   */
  "mobile-page": [
    "p-0",
    "max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top,0px))]",
    "overflow-hidden rounded-t-[var(--Radius-Sheet)]",
    "sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-h-[90dvh] sm:max-w-xl sm:rounded-[var(--Radius-Sheet)]",
  ].join(" "),
  "desktop-floating": [
    "p-0",
    "inset-x-4 bottom-4 mx-auto max-h-[86dvh] max-w-xl overflow-hidden rounded-[var(--Radius-Sheet)]",
  ].join(" "),
}

function BottomSheetFrame({
  className,
  preset = "mobile-full",
  surface = "default",
  children,
  glassOverlay,
  ...props
}: BottomSheetFrameProps) {
  return (
    <SheetContent
      data-frame="bottom-sheet-frame"
      data-preset={preset}
      data-surface={surface}
      side="bottom"
      padding={false}
      glassOverlay={glassOverlay ?? surface === "glass"}
      className={cn(presetClasses[preset], sheetSurfaceClasses[surface], className)}
      {...props}
    >
      {/*
        SheetContent が children を "dialog" 文脈で包むため、全画面級 preset は
        その内側でさらに "page" 文脈に包み直して既定を上書きする（#341）。
      */}
      <TitleSurfaceScaleProvider scale={pageScalePresets.has(preset) ? "page" : "dialog"}>
        {children}
      </TitleSurfaceScaleProvider>
    </SheetContent>
  )
}

export { BottomSheetFrame }
export type { BottomSheetFramePreset, BottomSheetFrameProps, SheetSurface }
