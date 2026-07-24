/**
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  AutoPrompt,
  PromptCoordinatorProvider,
  suppressAutoPrompts,
  usePromptSlot,
} from "../src/lib/prompt-coordinator"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.useFakeTimers()
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.useRealTimers()
})

function status(id: string) {
  return container.querySelector(`[data-prompt="${id}"]`)?.getAttribute("data-status")
}

function Prompt({
  id,
  priority,
  when = true,
}: {
  id: string
  priority: number
  when?: boolean
}) {
  return (
    <AutoPrompt id={id} priority={priority} when={when}>
      {({ status: slotStatus, close }) => (
        <button data-prompt={id} data-status={slotStatus} onClick={close}>
          {id}
        </button>
      )}
    </AutoPrompt>
  )
}

describe("PromptCoordinator", () => {
  it("同時 request を priority 降順、その後 FIFO で1件ずつ表示する", () => {
    act(() => {
      root.render(
        <PromptCoordinatorProvider gapMs={400}>
          <Prompt id="low" priority={10} />
          <Prompt id="high" priority={50} />
          <Prompt id="same-priority" priority={10} />
        </PromptCoordinatorProvider>,
      )
    })
    act(() => vi.runOnlyPendingTimers())
    expect(status("high")).toBe("active")
    expect(status("low")).toBe("queued")
    expect(status("same-priority")).toBe("queued")

    act(() => {
      container.querySelector<HTMLButtonElement>('[data-prompt="high"]')!.click()
      vi.advanceTimersByTime(399)
    })
    expect(status("low")).toBe("queued")
    act(() => vi.advanceTimersByTime(1))
    expect(status("low")).toBe("active")
  })

  it("同じ id の重複 request を1件へ coalesce する", () => {
    function DuplicateRequester() {
      const { request, status: slotStatus } = usePromptSlot("celebration", {
        priority: 30,
      })
      React.useEffect(() => {
        request()
        request()
      }, [request])
      return <span data-prompt="celebration" data-status={slotStatus} />
    }

    act(() => {
      root.render(
        <PromptCoordinatorProvider gapMs={0}>
          <DuplicateRequester />
        </PromptCoordinatorProvider>,
      )
    })
    act(() => vi.runOnlyPendingTimers())
    expect(status("celebration")).toBe("active")
  })

  it("抑制中は表示せず、解除後に待機中の最優先を表示する", () => {
    const unsuppress = suppressAutoPrompts("onboarding")
    act(() => {
      root.render(
        <PromptCoordinatorProvider gapMs={0}>
          <Prompt id="review" priority={30} />
        </PromptCoordinatorProvider>,
      )
    })
    act(() => vi.runOnlyPendingTimers())
    expect(status("review")).toBe("queued")

    act(() => {
      unsuppress()
      vi.runOnlyPendingTimers()
    })
    expect(status("review")).toBe("active")
  })

  it("Provider が無くても request 後は active になる", () => {
    function FallbackPrompt() {
      const slot = usePromptSlot("fallback")
      return (
        <button data-prompt="fallback" data-status={slot.status} onClick={slot.request}>
          fallback
        </button>
      )
    }
    act(() => root.render(<FallbackPrompt />))
    act(() => container.querySelector<HTMLButtonElement>("button")!.click())
    expect(status("fallback")).toBe("active")
  })
})
