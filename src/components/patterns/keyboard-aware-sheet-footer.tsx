import * as React from "react"
import { cn } from "@/lib/utils"
import { useVisualViewportKeyboardInset } from "@/lib/use-visual-viewport-keyboard-inset"

type KeyboardAwareSheetFooterBehavior = "fixed" | "hide" | "scroll"

interface FocusComfortScrollOptions {
  enabled?: boolean
  block?: ScrollLogicalPosition
  behavior?: ScrollBehavior
}

interface KeyboardAwareSheetFooterProps extends React.ComponentProps<"div"> {
  behavior?: KeyboardAwareSheetFooterBehavior
  hideWhenInputFocused?: boolean
}

function useFocusedInputComfortScroll<T extends HTMLElement = HTMLDivElement>({
  enabled = true,
  block = "center",
  behavior = "smooth",
}: FocusComfortScrollOptions = {}) {
  const ref = React.useRef<T | null>(null)

  React.useEffect(() => {
    if (!enabled) return
    const root = ref.current
    if (!root) return

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (!target.matches("input, textarea, select, [contenteditable='true']")) return
      window.setTimeout(() => {
        target.scrollIntoView({ block, behavior, inline: "nearest" })
      }, 0)
    }

    root.addEventListener("focusin", handleFocusIn)
    return () => root.removeEventListener("focusin", handleFocusIn)
  }, [block, behavior, enabled])

  return ref
}

function KeyboardAwareSheetFooter({
  className,
  behavior = "fixed",
  hideWhenInputFocused = behavior === "hide",
  style,
  children,
  ...props
}: KeyboardAwareSheetFooterProps) {
  const { keyboardInset, isKeyboardOpen } = useVisualViewportKeyboardInset()
  const shouldHide = hideWhenInputFocused && isKeyboardOpen

  return (
    <div
      data-slot="keyboard-aware-sheet-footer"
      data-behavior={behavior}
      data-keyboard-open={isKeyboardOpen || undefined}
      className={cn(
        "shrink-0 bg-[var(--Surface-Primary)] px-5 pt-3",
        "border-t border-[var(--Border-Low-Emphasis)]",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        behavior === "fixed" && "sticky bottom-[var(--ksk-keyboard-inset)] z-10",
        behavior === "hide" && "sticky bottom-[var(--ksk-keyboard-inset)] z-10 transition-all duration-200",
        behavior === "scroll" && "relative",
        shouldHide && "translate-y-2 opacity-0 pointer-events-none",
        className
      )}
      style={{
        "--ksk-keyboard-inset": `${keyboardInset}px`,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}

export { KeyboardAwareSheetFooter, useFocusedInputComfortScroll }
export type {
  FocusComfortScrollOptions,
  KeyboardAwareSheetFooterBehavior,
  KeyboardAwareSheetFooterProps,
}
