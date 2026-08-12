/**
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"

import { SwipeRow, type SwipeAction } from "../src/components/patterns/swipe-row"

/**
 * web 版 SwipeRow のキーボード / スクリーンリーダー到達性（issue #342）。
 *
 * スワイプはポインタ操作でしか開けないため、以前は閉じている間 actions に
 * inert を付けて完全に隠していた（= Tab / VoiceOver から到達不能）。
 * フォーカスが actions グループへ入ると開く代替経路を検証する。
 */
let container: HTMLElement | null = null
let root: Root | null = null

function mount(ui: React.ReactElement) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(ui)
  })
}

const actions: SwipeAction[] = [
  { label: "アーカイブ", onClick: vi.fn() },
  { label: "削除", onClick: vi.fn(), variant: "destructive" },
]

afterEach(() => {
  if (root) {
    act(() => {
      root!.unmount()
    })
    root = null
  }
  container?.remove()
  container = null
  document.body.innerHTML = ""
  vi.restoreAllMocks()
})

describe("SwipeRow の a11y 到達性（#342）", () => {
  it("actions ボタンに inert が付かず、常に読み上げ・フォーカス可能である", () => {
    mount(<SwipeRow actions={actions}>行の内容</SwipeRow>)

    const group = container!.querySelector('[role="group"]')
    expect(group).not.toBeNull()
    expect(group?.hasAttribute("inert")).toBe(false)

    const buttons = container!.querySelectorAll("button")
    expect(buttons.length).toBe(2)
    buttons.forEach((btn) => {
      expect(btn.hasAttribute("inert")).toBe(false)
      expect(btn.tabIndex).not.toBe(-1)
    })
  })

  it("actions グループにフォーカスが入ると開き、外れると閉じる", () => {
    mount(<SwipeRow actions={actions}>行の内容</SwipeRow>)

    const content = container!.querySelector<HTMLDivElement>(".touch-pan-y")
    const firstButton = container!.querySelectorAll("button")[0]

    expect(content?.style.transform).toBe("translateX(0px)")

    act(() => {
      firstButton.dispatchEvent(new FocusEvent("focusin", { bubbles: true }))
    })
    expect(content?.style.transform).not.toBe("translateX(0px)")

    act(() => {
      const blurEvent = new FocusEvent("focusout", { bubbles: true, relatedTarget: document.body })
      firstButton.dispatchEvent(blurEvent)
    })
    expect(content?.style.transform).toBe("translateX(0px)")
  })

  it("group のラベルは actionsLabel で差し替えられる（i18n）", () => {
    mount(
      <SwipeRow actions={actions} actionsLabel="Row actions">
        row
      </SwipeRow>
    )
    const group = container!.querySelector('[role="group"]')
    expect(group?.getAttribute("aria-label")).toBe("Row actions")
  })

  it("既定の group ラベルを持つ（ラベル無しの group は読み上げで意味が取れない）", () => {
    mount(<SwipeRow actions={actions}>row</SwipeRow>)
    const group = container!.querySelector('[role="group"]')
    expect(group?.getAttribute("aria-label")).toBe("行の操作")
  })
})
