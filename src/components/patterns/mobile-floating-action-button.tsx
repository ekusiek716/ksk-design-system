import * as React from "react"
import { Add } from "iconsax-reactjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useVisualViewportKeyboardInset } from "@/lib/use-visual-viewport-keyboard-inset"

type MobileFloatingActionButtonPlacement = "end" | "start" | "center"
type MobileFloatingActionButtonKeyboardBehavior = "hide" | "lift" | "stay"
type MobileFloatingActionButtonBottomOffset = "none" | "bottom-nav" | "bottom-nav-pill"

interface MobileFloatingActionButtonProps extends Omit<React.ComponentProps<typeof Button>, "children" | "size" | "variant"> {
  label: string
  icon?: React.ReactNode
  showLabel?: boolean
  placement?: MobileFloatingActionButtonPlacement
  bottomOffset?: MobileFloatingActionButtonBottomOffset
  keyboardBehavior?: MobileFloatingActionButtonKeyboardBehavior
  mobileOnly?: boolean
}

function MobileFloatingActionButton({
  className,
  label,
  icon,
  showLabel = false,
  placement = "end",
  bottomOffset = "bottom-nav",
  keyboardBehavior = "hide",
  mobileOnly = true,
  style,
  ...props
}: MobileFloatingActionButtonProps) {
  const ariaLabel = props["aria-label"] ?? label
  const { keyboardInset, isKeyboardOpen } = useVisualViewportKeyboardInset()
  const shouldHide = keyboardBehavior === "hide" && isKeyboardOpen
  const liftInset = keyboardBehavior === "lift" ? keyboardInset : 0

  return (
    <Button
      {...props}
      data-slot="mobile-floating-action-button"
      data-placement={placement}
      data-bottom-offset={bottomOffset}
      aria-label={ariaLabel}
      variant="default"
      size={showLabel ? "lg" : "icon-lg"}
      className={cn(
        "fixed z-50 shadow-[var(--shadow-lg)] transition-all duration-200",
        "bottom-[calc(env(safe-area-inset-bottom)+var(--ksk-fab-bottom-offset)+var(--ksk-fab-keyboard-inset))]",
        placement === "end" && "right-4",
        placement === "start" && "left-4",
        placement === "center" && "left-1/2 -translate-x-1/2",
        bottomOffset === "none" && "[--ksk-fab-bottom-offset:1rem]",
        bottomOffset === "bottom-nav" && "[--ksk-fab-bottom-offset:5rem]",
        bottomOffset === "bottom-nav-pill" && "[--ksk-fab-bottom-offset:6rem]",
        mobileOnly && "lg:hidden",
        shouldHide && "translate-y-2 opacity-0 pointer-events-none",
        className
      )}
      style={{
        "--ksk-fab-keyboard-inset": `${liftInset}px`,
        ...style,
      } as React.CSSProperties}
    >
      <span aria-hidden className="flex size-5 items-center justify-center">
        {icon ?? <Add size={22} />}
      </span>
      {showLabel && <span>{label}</span>}
    </Button>
  )
}

export { MobileFloatingActionButton }
export type {
  MobileFloatingActionButtonBottomOffset,
  MobileFloatingActionButtonKeyboardBehavior,
  MobileFloatingActionButtonPlacement,
  MobileFloatingActionButtonProps,
}
