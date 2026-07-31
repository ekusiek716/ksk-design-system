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
