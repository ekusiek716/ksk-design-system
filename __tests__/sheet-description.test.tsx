/**
 * @vitest-environment jsdom
 */
import * as React from "react"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  type SheetProps,
} from "../src/components/ui/sheet"

let container: HTMLElement | null = null
let root: Root | null = null

function mountSheet(
  contentProps: React.ComponentProps<typeof SheetContent>,
  sheetProps: SheetProps = {}
) {
  container = document.createElement("div")
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => {
    root!.render(
      <Sheet open {...sheetProps}>
        <SheetContent {...contentProps}>
          <SheetTitle>絞り込み</SheetTitle>
        </SheetContent>
      </Sheet>
    )
  })
}

function expectLinkedDescription(text: string) {
  const content = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
  const descriptionId = content?.getAttribute("aria-describedby")
  expect(descriptionId).toBeTruthy()
  expect(document.getElementById(descriptionId!)?.textContent).toContain(text)
}

afterEach(() => {
  if (root) {
    act(() => root!.unmount())
    root = null
  }
  container?.remove()
  container = null
  document.body.innerHTML = ""
  vi.restoreAllMocks()
})

describe("SheetContent description（Issue #286）", () => {
  const branches = [
    {
      name: "plain",
      contentProps: { side: "right" } as const,
      sheetProps: {},
    },
    {
      name: "snap bottom",
      contentProps: { side: "bottom" } as const,
      sheetProps: { snapPoints: [0.4, 0.9] },
    },
    {
      name: "swipe bottom",
      contentProps: { side: "bottom", swipeToClose: true } as const,
      sheetProps: {},
    },
    {
      name: "swipe side drawer",
      contentProps: { side: "right", swipeToClose: true } as const,
      sheetProps: {},
    },
  ]

  for (const branch of branches) {
    it(`${branch.name}: Radix管理IDで説明文へ接続し、警告を出さない`, () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
      const error = vi.spyOn(console, "error").mockImplementation(() => undefined)

      mountSheet(
        { ...branch.contentProps, description: "絞り込み条件を説明します。" },
        branch.sheetProps
      )

      expectLinkedDescription("絞り込み条件を説明します。")
      expect(warn.mock.calls.flat().join(" ")).not.toContain("Missing `Description`")
      expect(error.mock.calls.flat().join(" ")).not.toContain("Missing `Description`")
    })
  }

  it("description 未指定時は aria-describedby を外して警告を抑制する", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)

    mountSheet({ side: "right" })

    const content = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
    expect(content?.hasAttribute("aria-describedby")).toBe(false)
    expect(warn.mock.calls.flat().join(" ")).not.toContain("Missing `Description`")
    expect(error.mock.calls.flat().join(" ")).not.toContain("Missing `Description`")
  })
})

// #822: consumer が ref を渡すと、内部の callback ref（setContentNode /
// attachTouchListeners）が上書きされ、子の SheetDescription の紐付けと
// autoFocus が効かなくなっていた。全分岐で ref を合成することを固定する。
describe("SheetContent の consumer ref（Issue #822）", () => {
  const branches = [
    { name: "plain", contentProps: { side: "bottom" } as const, sheetProps: {} },
    { name: "plain right", contentProps: { side: "right" } as const, sheetProps: {} },
    {
      name: "snap bottom",
      contentProps: { side: "bottom" } as const,
      sheetProps: { snapPoints: [0.4, 0.9] },
    },
    {
      name: "swipe bottom",
      contentProps: { side: "bottom", swipeToClose: true } as const,
      sheetProps: {},
    },
    {
      name: "swipe left drawer",
      contentProps: { side: "left", swipeToClose: true } as const,
      sheetProps: {},
    },
    {
      name: "swipe right drawer",
      contentProps: { side: "right", swipeToClose: true } as const,
      sheetProps: {},
    },
  ]

  function mountWithRef(
    branch: (typeof branches)[number],
    ref: React.Ref<HTMLDivElement>
  ) {
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0)
      return 0
    })
    container = document.createElement("div")
    document.body.appendChild(container)
    root = createRoot(container)
    act(() => {
      root!.render(
        <Sheet open {...branch.sheetProps}>
          <SheetContent {...branch.contentProps} ref={ref} autoFocus="first-input">
            <SheetTitle>絞り込み</SheetTitle>
            <SheetDescription>条件を選びます。</SheetDescription>
            <input data-testid="field" />
          </SheetContent>
        </Sheet>
      )
    })
  }

  for (const branch of branches) {
    it(`${branch.name}: object ref に面が渡り、説明の紐付けと初期フォーカスが保たれる`, () => {
      const ref = React.createRef<HTMLDivElement>()
      mountWithRef(branch, ref)
      const content = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
      expect(ref.current).toBe(content)
      expectLinkedDescription("条件を選びます。")
      expect(document.activeElement).toBe(
        document.querySelector('[data-testid="field"]')
      )
      vi.unstubAllGlobals()
    })

    it(`${branch.name}: callback ref にも面が渡り、説明の紐付けが保たれる`, () => {
      const seen: Array<HTMLElement | null> = []
      mountWithRef(branch, (node) => {
        seen.push(node)
      })
      const content = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
      expect(seen).toContain(content)
      expectLinkedDescription("条件を選びます。")
      expect(document.activeElement).toBe(
        document.querySelector('[data-testid="field"]')
      )
      vi.unstubAllGlobals()
    })
  }
})
