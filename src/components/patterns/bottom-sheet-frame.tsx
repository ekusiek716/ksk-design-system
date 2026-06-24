import { cn } from "@/lib/utils"
import { SheetContent, type SheetContentProps } from "@/components/ui/sheet"

type BottomSheetFramePreset = "mobile-full" | "mobile-form" | "desktop-floating"

interface BottomSheetFrameProps extends Omit<SheetContentProps, "side" | "padding"> {
  preset?: BottomSheetFramePreset
}

const presetClasses: Record<BottomSheetFramePreset, string> = {
  "mobile-full": [
    "p-0",
    "max-h-[calc(100dvh-env(safe-area-inset-top))]",
    "overflow-hidden rounded-t-[var(--Radius-Sheet)]",
    "sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-h-[90dvh] sm:max-w-xl sm:rounded-[var(--Radius-Sheet)]",
  ].join(" "),
  "mobile-form": [
    "p-0",
    "max-h-[88dvh] overflow-hidden rounded-t-[var(--Radius-Sheet)]",
    "sm:inset-x-4 sm:bottom-4 sm:mx-auto sm:max-w-lg sm:rounded-[var(--Radius-Sheet)]",
  ].join(" "),
  "desktop-floating": [
    "p-0",
    "inset-x-4 bottom-4 mx-auto max-h-[86dvh] max-w-xl overflow-hidden rounded-[var(--Radius-Sheet)]",
  ].join(" "),
}

function BottomSheetFrame({
  className,
  preset = "mobile-full",
  children,
  ...props
}: BottomSheetFrameProps) {
  return (
    <SheetContent
      data-slot="bottom-sheet-frame"
      data-preset={preset}
      side="bottom"
      padding={false}
      className={cn(presetClasses[preset], className)}
      {...props}
    >
      {children}
    </SheetContent>
  )
}

export { BottomSheetFrame }
export type { BottomSheetFramePreset, BottomSheetFrameProps }
