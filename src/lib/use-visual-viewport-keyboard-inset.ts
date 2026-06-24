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

    const update = () => {
      const rootKeyboardOpen =
        document.documentElement.hasAttribute("data-kb-open") ||
        document.body?.hasAttribute("data-kb-open") === true

      if (!viewport) {
        setState({
          keyboardInset: 0,
          visibleHeight: null,
          isKeyboardOpen: rootKeyboardOpen,
        })
        return
      }

      const nextState = computeVisualViewportKeyboardState(
        window.innerHeight,
        viewport.height,
        viewport.offsetTop
      )

      setState(
        rootKeyboardOpen && !nextState.isKeyboardOpen
          ? { ...nextState, isKeyboardOpen: true }
          : nextState
      )
    }

    update()
    viewport?.addEventListener("resize", update)
    viewport?.addEventListener("scroll", update)
    const observer = typeof MutationObserver !== "undefined"
      ? new MutationObserver(update)
      : null
    observer?.observe(document.documentElement, { attributes: true, attributeFilter: ["data-kb-open"] })
    if (document.body) {
      observer?.observe(document.body, { attributes: true, attributeFilter: ["data-kb-open"] })
    }
    return () => {
      viewport?.removeEventListener("resize", update)
      viewport?.removeEventListener("scroll", update)
      observer?.disconnect()
    }
  }, [])

  return state
}

export { computeVisualViewportKeyboardState, useVisualViewportKeyboardInset }
