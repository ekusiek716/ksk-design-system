/**
 * @vitest-environment jsdom
 *
 * DialogContent / SheetContent の幅の段 `size`（opt-in）。
 *
 * 契約: 未指定の見た目は従来と同一（Dialog = sm:max-w-[480px] / Sheet = max-w-sm）、
 * 段を指定したときだけ幅が変わる、消費側 className の max-w-* が size に勝つ、
 * side="bottom" 等の全幅 Sheet では size を無視する。
 * jsdom は CSS を計算しないため、クラス文字列の contract として検証する
 * （dialog-fullscreen-safe-area.test.tsx と同じ方針）。
 *
 * 実行: npm run test
 */
import { describe, it, expect, afterEach } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import * as React from "react"

import { Dialog, DialogContent } from "../src/components/ui/dialog"
import { ResponsiveDialog, ResponsiveDialogContent } from "../src/components/ui/responsive-dialog"
import { Sheet, SheetContent } from "../src/components/ui/sheet"

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

function unmount() {
  if (root) {
    act(() => {
      root!.unmount()
    })
    root = null
  }
  if (container) {
    container.remove()
    container = null
  }
  document.body.innerHTML = ""
}

afterEach(unmount)

function dialogEl(): HTMLElement {
  const el = document.querySelector<HTMLElement>('[data-slot="dialog-content"]')
  expect(el).not.toBeNull()
  return el!
}

function sheetEl(): HTMLElement {
  const el = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
  expect(el).not.toBeNull()
  return el!
}

describe("DialogContent size", () => {
  it("未指定は従来どおり 480px（md と同一）", () => {
    mount(<Dialog open><DialogContent description="d">x</DialogContent></Dialog>)
    const cls = dialogEl().className
    expect(cls).toContain("sm:max-w-[480px]")
    expect(cls).toContain("max-w-[calc(100%_-_3rem)]")
  })

  it.each([
    ["sm", "sm:max-w-[400px]"],
    ["md", "sm:max-w-[480px]"],
    ["lg", "sm:max-w-[640px]"],
    ["xl", "sm:max-w-[800px]"],
  ] as const)("size=%s で %s になり、他の段のキャップは残らない", (size, expected) => {
    mount(<Dialog open><DialogContent size={size} description="d">x</DialogContent></Dialog>)
    const cls = dialogEl().className
    expect(cls).toContain(expected)
    for (const other of ["sm:max-w-[400px]", "sm:max-w-[480px]", "sm:max-w-[640px]", "sm:max-w-[800px]"]) {
      if (other !== expected) expect(cls).not.toContain(other)
    }
    // size は DOM 属性として漏らさない
    expect(dialogEl().getAttribute("size")).toBeNull()
  })

  it("消費側 className の max-w-* は size より優先される", () => {
    mount(
      <Dialog open>
        <DialogContent size="xl" className="sm:max-w-md" description="d">x</DialogContent>
      </Dialog>
    )
    const cls = dialogEl().className
    expect(cls).toContain("sm:max-w-md")
    expect(cls).not.toContain("sm:max-w-[800px]")
  })

  it("fullscreen では size を無視する（幅キャップを持たない）", () => {
    mount(
      <Dialog open>
        <DialogContent position="fullscreen" size="xl" description="d">x</DialogContent>
      </Dialog>
    )
    const cls = dialogEl().className
    expect(cls).toContain("max-w-none")
    expect(cls).not.toContain("sm:max-w-[800px]")
  })

  it("ResponsiveDialogContent は size を PC 側の DialogContent へ渡す", () => {
    const original = window.matchMedia
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia
    try {
      mount(
        <ResponsiveDialog open>
          <ResponsiveDialogContent size="lg" description="d">x</ResponsiveDialogContent>
        </ResponsiveDialog>
      )
      expect(dialogEl().className).toContain("sm:max-w-[640px]")
    } finally {
      window.matchMedia = original
    }
  })
})

describe("SheetContent size", () => {
  it("未指定の right は従来どおり max-w-sm", () => {
    mount(<Sheet open><SheetContent side="right" description="d">x</SheetContent></Sheet>)
    expect(sheetEl().className).toContain("max-w-sm")
  })

  it("未指定の left は従来どおり max-w-sm", () => {
    mount(<Sheet open><SheetContent side="left" description="d">x</SheetContent></Sheet>)
    expect(sheetEl().className).toContain("max-w-sm")
  })

  it.each([
    ["sm", "max-w-sm"],
    ["md", "max-w-xl"],
    ["lg", "max-w-3xl"],
  ] as const)("side=right size=%s で %s になる", (size, expected) => {
    mount(<Sheet open><SheetContent side="right" size={size} description="d">x</SheetContent></Sheet>)
    const cls = sheetEl().className
    expect(cls).toContain(expected)
    expect(cls).toContain("w-3/4")
    expect(sheetEl().getAttribute("size")).toBeNull()
  })

  it("swipeToClose の側面ドロワー経路でも size が効く", () => {
    mount(
      <Sheet open>
        <SheetContent side="left" size="lg" swipeToClose description="d">x</SheetContent>
      </Sheet>
    )
    expect(sheetEl().className).toContain("max-w-3xl")
  })

  it("side=bottom では size を無視する（max-w を足さない）", () => {
    mount(<Sheet open><SheetContent side="bottom" size="lg" description="d">x</SheetContent></Sheet>)
    expect(sheetEl().className).not.toMatch(/max-w-(sm|xl|3xl)/)
  })

  it("side=float は自前の max-w-lg のまま size を無視する", () => {
    mount(<Sheet open><SheetContent side="float" size="lg" description="d">x</SheetContent></Sheet>)
    expect(sheetEl().className).toContain("max-w-lg")
    expect(sheetEl().className).not.toContain("max-w-3xl")
  })

  it("消費側 className の max-w-* は size より優先される", () => {
    mount(
      <Sheet open>
        <SheetContent side="right" size="lg" className="max-w-md" description="d">x</SheetContent>
      </Sheet>
    )
    const cls = sheetEl().className
    expect(cls).toContain("max-w-md")
    expect(cls).not.toContain("max-w-3xl")
  })
})
