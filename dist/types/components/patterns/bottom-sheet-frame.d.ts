import { type SheetContentProps } from "@/components/ui/sheet";
type BottomSheetFramePreset = "mobile-full" | "mobile-form" | "mobile-page" | "desktop-floating";
interface BottomSheetFrameProps extends Omit<SheetContentProps, "side" | "padding"> {
    preset?: BottomSheetFramePreset;
}
declare function BottomSheetFrame({ className, preset, children, ...props }: BottomSheetFrameProps): import("react").JSX.Element;
export { BottomSheetFrame };
export type { BottomSheetFramePreset, BottomSheetFrameProps };
