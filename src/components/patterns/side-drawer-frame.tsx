import { cn } from "@/lib/utils"
import { SheetContent, type SheetContentProps } from "@/components/ui/sheet"

interface SideDrawerFrameProps extends Omit<SheetContentProps, "side" | "padding"> {
  /**
   * どちらの端から出すか。既定 "right"（PC の詳細ドロワーの定番）。
   * `swipeToClose` を付けると side に追従した方向（right→右ドラッグ /
   * left→左ドラッグ）で閉じられる。
   */
  side?: "left" | "right"
}

// フルハイト・内側 padding 無し・flex 縦・幅 md の「サイド詳細ドロワー」recipe。
// SheetContent(side=right) の base variant（w-3/4 max-w-sm）を twMerge で上書きする。
// 中身は DetailSheetScaffold + 固定フッタなどで自前レイアウトを組む前提
// （本文 flex-1 overflow-y-auto、フッタ固定）。
const drawerRecipe = "h-full w-full max-w-md flex flex-col overflow-hidden"

/**
 * SheetContent の「サイド詳細ドロワー」outer frame preset。
 * 全高・padding 無し・flex 縦・幅指定を1つの口でまとめ、consumer 側での長い
 * className 上書き（`p-0 w-full max-w-md flex flex-col overflow-hidden`）を撤去する。
 * PC=右ドロワーの詳細画面を想定（モバイルの下部シートは BottomSheetFrame を使う）。
 */
function SideDrawerFrame({
  className,
  side = "right",
  children,
  ...props
}: SideDrawerFrameProps) {
  return (
    <SheetContent
      data-frame="side-drawer-frame"
      data-side={side}
      side={side}
      padding={false}
      className={cn(drawerRecipe, className)}
      {...props}
    >
      {children}
    </SheetContent>
  )
}

export { SideDrawerFrame }
export type { SideDrawerFrameProps }
