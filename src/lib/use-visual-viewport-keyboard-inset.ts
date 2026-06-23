import * as React from "react"

export interface VisualViewportKeyboardState {
  keyboardInset: number
  visibleHeight: number | null
  isKeyboardOpen: boolean
}

function computeVisualViewportKeyboardState(
  layoutHeight: number,
  visualHeight: number,
  visualOffsetTop: number
): VisualViewportKeyboardState {
  const keyboardInset = Math.max(0, layoutHeight - visualHeight - visualOffsetTop)
  if (keyboardInset < 1) {
    return { keyboardInset: 0, visibleHeight: null, isKeyboardOpen: false }
  }
  return { keyboardInset, visibleHeight: visualHeight, isKeyboardOpen: true }
}

function useVisualViewportKeyboardInset(): VisualViewportKeyboardState {
  const [state, setState] = React.useState<VisualViewportKeyboardState>({
    keyboardInset: 0,
    visibleHeight: null,
    isKeyboardOpen: false,
  })

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => {
      setState(
        computeVisualViewportKeyboardState(
          window.innerHeight,
          viewport.height,
          viewport.offsetTop
        )
      )
    }

    update()
    viewport.addEventListener("resize", update)
    viewport.addEventListener("scroll", update)
    return () => {
      viewport.removeEventListener("resize", update)
      viewport.removeEventListener("scroll", update)
    }
  }, [])

  return state
}

export { computeVisualViewportKeyboardState, useVisualViewportKeyboardInset }
