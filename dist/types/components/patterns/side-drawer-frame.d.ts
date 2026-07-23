import { type SheetContentProps } from "@/components/ui/sheet";
interface SideDrawerFrameProps extends Omit<SheetContentProps, "side" | "padding"> {
    /**
     * どちらの端から出すか。既定 "right"（PC の詳細ドロワーの定番）。
     * `swipeToClose` を付けると side に追従した方向（right→右ドラッグ /
     * left→左ドラッグ）で閉じられる。
     */
    side?: "left" | "right";
}
/**
 * SheetContent の「サイド詳細ドロワー」outer frame preset。
 * 全高・padding 無し・flex 縦・幅指定を1つの口でまとめ、consumer 側での長い
 * className 上書き（`p-0 w-full max-w-md flex flex-col overflow-hidden`）を撤去する。
 * PC=右ドロワーの詳細画面を想定（モバイルの下部シートは BottomSheetFrame を使う）。
 */
declare function SideDrawerFrame({ className, side, children, ...props }: SideDrawerFrameProps): import("react").JSX.Element;
export { SideDrawerFrame };
export type { SideDrawerFrameProps };
